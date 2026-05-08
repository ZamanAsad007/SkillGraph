import * as d3 from "d3";

export type WorkerNode = {
  id: string;
  x?: number;
  y?: number;
  vx?: number;
  vy?: number;
  fx?: number | null;
  fy?: number | null;
  proficiency?: number;
};

export type WorkerLink = {
  source: string | WorkerNode;
  target: string | WorkerNode;
  type: string;
};

export type WorkerMessage =
  | { type: "init"; nodes: WorkerNode[]; links: WorkerLink[]; width: number; height: number }
  | { type: "tick" }
  | { type: "stop" };

export type WorkerResponse = {
  type: "tick";
  nodes: Array<{ id: string; x: number; y: number }>;
};

let simulation: d3.Simulation<WorkerNode, WorkerLink> | null = null;

self.onmessage = (event: MessageEvent<WorkerMessage>) => {
  const message = event.data;

  if (message.type === "init") {
    const { nodes, links, width, height } = message;

    // Stop any existing simulation
    if (simulation) {
      simulation.stop();
    }

    // Create a new force simulation
    simulation = d3
      .forceSimulation<WorkerNode>(nodes)
      .force(
        "link",
        d3
          .forceLink<WorkerNode, WorkerLink>(links)
          .id((d) => d.id)
          .distance(100)
      )
      .force("charge", d3.forceManyBody().strength(-300))
      .force("center", d3.forceCenter(width / 2, height / 2))
      .force(
        "collide",
        d3.forceCollide<WorkerNode>().radius((d) => {
          const proficiency = d.proficiency ?? 0.5;
          return 18 + Math.round(proficiency * 10) + 5; // node radius + padding
        })
      );

    // Post position updates after each tick
    simulation.on("tick", () => {
      const positions = nodes.map((node) => ({
        id: node.id,
        x: node.x ?? 0,
        y: node.y ?? 0,
      }));

      self.postMessage({ type: "tick", nodes: positions } as WorkerResponse);
    });
  } else if (message.type === "stop") {
    if (simulation) {
      simulation.stop();
      simulation = null;
    }
  }
};
