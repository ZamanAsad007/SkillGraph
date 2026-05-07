import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

const categories = [
  { name: "Language", colorHex: "#2563eb", iconName: "code" },
  { name: "Framework", colorHex: "#16a34a", iconName: "blocks" },
  { name: "Database", colorHex: "#dc2626", iconName: "database" },
  { name: "DevOps", colorHex: "#9333ea", iconName: "container" },
  { name: "ML Library", colorHex: "#0891b2", iconName: "brain" }
];

const skills = [
  { name: "HTML", category: "Language", aliases: ["html5"] },
  { name: "CSS", category: "Language", aliases: ["css3"] },
  { name: "JavaScript", category: "Language", aliases: ["js", "ecmascript"] },
  { name: "TypeScript", category: "Language", aliases: ["ts"] },
  { name: "React", category: "Framework", aliases: ["reactjs", "react.js"] },
  { name: "Node.js", category: "Framework", aliases: ["node", "nodejs"] },
  { name: "Express", category: "Framework", aliases: ["express.js", "expressjs"] },
  { name: "FastAPI", category: "Framework", aliases: ["fast api"] },
  { name: "PostgreSQL", category: "Database", aliases: ["postgres", "psql"] },
  { name: "Neo4j", category: "Database", aliases: ["cypher"] },
  { name: "Redis", category: "Database", aliases: ["redis streams"] },
  { name: "Docker", category: "DevOps", aliases: ["dockerfile"] },
  { name: "Kubernetes", category: "DevOps", aliases: ["k8s"] },
  { name: "Python", category: "Language", aliases: ["py"] },
  { name: "Pandas", category: "ML Library", aliases: [] },
  { name: "NumPy", category: "ML Library", aliases: ["numpy"] },
  { name: "scikit-learn", category: "ML Library", aliases: ["sklearn"] }
];

const roles = [
  {
    title: "Frontend Developer",
    description: "Builds accessible client applications.",
    requiredSkills: ["HTML", "CSS", "JavaScript", "TypeScript", "React"]
  },
  {
    title: "Backend Developer",
    description: "Builds APIs, data models, and backend systems.",
    requiredSkills: ["JavaScript", "Node.js", "Express", "PostgreSQL", "Docker"]
  },
  {
    title: "Data Engineer",
    description: "Builds data pipelines, models, and storage systems.",
    requiredSkills: ["Python", "PostgreSQL", "Docker"]
  }
];

const resources = [
  {
    title: "MDN JavaScript Guide",
    url: "https://developer.mozilla.org/en-US/docs/Web/JavaScript/Guide",
    type: "DOCUMENTATION",
    provider: "MDN",
    durationHours: 8,
    isUniversityApproved: true,
    rating: 4.9
  },
  {
    title: "React Documentation",
    url: "https://react.dev/learn",
    type: "DOCUMENTATION",
    provider: "React",
    durationHours: 10,
    isUniversityApproved: true,
    rating: 4.9
  },
  {
    title: "PostgreSQL Tutorial",
    url: "https://www.postgresql.org/docs/current/tutorial.html",
    type: "DOCUMENTATION",
    provider: "PostgreSQL",
    durationHours: 6,
    isUniversityApproved: true,
    rating: 4.8
  },
  {
    title: "Docker Get Started",
    url: "https://docs.docker.com/get-started/",
    type: "DOCUMENTATION",
    provider: "Docker",
    durationHours: 5,
    isUniversityApproved: true,
    rating: 4.8
  }
];

async function main() {
  for (const category of categories) {
    await prisma.skillCategory.upsert({
      where: { name: category.name },
      update: category,
      create: category
    });
  }

  for (const skill of skills) {
    const category = await prisma.skillCategory.findUniqueOrThrow({ where: { name: skill.category } });
    await prisma.skill.upsert({
      where: { name: skill.name },
      update: { aliases: skill.aliases, categoryId: category.id },
      create: { name: skill.name, aliases: skill.aliases, categoryId: category.id }
    });
  }

  for (const role of roles) {
    const createdRole = await prisma.industryRole.upsert({
      where: { title: role.title },
      update: { description: role.description },
      create: { title: role.title, description: role.description }
    });

    for (const skillName of role.requiredSkills) {
      const skill = await prisma.skill.findUniqueOrThrow({ where: { name: skillName } });
      await prisma.roleRequirement.upsert({
        where: { roleId_skillId: { roleId: createdRole.id, skillId: skill.id } },
        update: { criticality: 0.8 },
        create: { roleId: createdRole.id, skillId: skill.id, criticality: 0.8 }
      });
    }
  }

  for (const resource of resources) {
    await prisma.learningResource.upsert({
      where: { url: resource.url },
      update: resource,
      create: resource
    });
  }
}

main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (error) => {
    console.error(error);
    await prisma.$disconnect();
    process.exit(1);
  });
