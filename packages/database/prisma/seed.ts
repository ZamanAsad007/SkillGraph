import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

const categories = [
  { name: "Language", colorHex: "#2563eb", iconName: "code" },
  { name: "Frontend", colorHex: "#0c66e4", iconName: "layout" },
  { name: "Backend", colorHex: "#16a34a", iconName: "server" },
  { name: "Database", colorHex: "#dc2626", iconName: "database" },
  { name: "DevOps", colorHex: "#9333ea", iconName: "container" },
  { name: "Cloud", colorHex: "#0891b2", iconName: "cloud" },
  { name: "Testing", colorHex: "#ca8a04", iconName: "check-circle" },
  { name: "Security", colorHex: "#be123c", iconName: "shield" },
  { name: "Data", colorHex: "#7c3aed", iconName: "bar-chart" },
  { name: "ML Library", colorHex: "#0f766e", iconName: "brain" },
  { name: "Mobile", colorHex: "#db2777", iconName: "smartphone" },
  { name: "Design", colorHex: "#ea580c", iconName: "palette" },
  { name: "Product", colorHex: "#475569", iconName: "briefcase" },
  { name: "Tooling", colorHex: "#334155", iconName: "wrench" }
];

const skills = [
  { name: "HTML", category: "Language", aliases: ["html5", "semantic html"] },
  { name: "CSS", category: "Language", aliases: ["css3", "stylesheets"] },
  { name: "JavaScript", category: "Language", aliases: ["js", "ecmascript"] },
  { name: "TypeScript", category: "Language", aliases: ["ts"] },
  { name: "Python", category: "Language", aliases: ["py"] },
  { name: "Java", category: "Language", aliases: ["jvm"] },
  { name: "C#", category: "Language", aliases: ["csharp", ".net"] },
  { name: "Go", category: "Language", aliases: ["golang"] },
  { name: "Rust", category: "Language", aliases: [] },
  { name: "SQL", category: "Language", aliases: ["structured query language"] },
  { name: "Bash", category: "Language", aliases: ["shell", "sh"] },
  { name: "PHP", category: "Language", aliases: [] },

  { name: "React", category: "Frontend", aliases: ["reactjs", "react.js"] },
  { name: "Next.js", category: "Frontend", aliases: ["nextjs", "next"] },
  { name: "Vue.js", category: "Frontend", aliases: ["vue", "vuejs"] },
  { name: "Angular", category: "Frontend", aliases: [] },
  { name: "Svelte", category: "Frontend", aliases: ["sveltekit"] },
  { name: "Tailwind CSS", category: "Frontend", aliases: ["tailwind"] },
  { name: "Redux", category: "Frontend", aliases: ["redux toolkit", "rtk"] },
  { name: "Zustand", category: "Frontend", aliases: [] },
  { name: "React Query", category: "Frontend", aliases: ["tanstack query"] },
  { name: "Web Accessibility", category: "Frontend", aliases: ["a11y", "accessibility", "wcag"] },
  { name: "Responsive Design", category: "Frontend", aliases: ["mobile first", "responsive ui"] },
  { name: "WebSockets", category: "Frontend", aliases: ["socket.io", "socketio"] },

  { name: "Node.js", category: "Backend", aliases: ["node", "nodejs"] },
  { name: "Express", category: "Backend", aliases: ["express.js", "expressjs"] },
  { name: "NestJS", category: "Backend", aliases: ["nestjs"] },
  { name: "FastAPI", category: "Backend", aliases: ["fast api"] },
  { name: "Django", category: "Backend", aliases: [] },
  { name: "Flask", category: "Backend", aliases: [] },
  { name: "Spring Boot", category: "Backend", aliases: ["spring"] },
  { name: "ASP.NET Core", category: "Backend", aliases: ["aspnet core", ".net core"] },
  { name: "REST APIs", category: "Backend", aliases: ["rest", "restful api"] },
  { name: "GraphQL", category: "Backend", aliases: ["apollo"] },
  { name: "gRPC", category: "Backend", aliases: ["grpc"] },
  { name: "Authentication", category: "Backend", aliases: ["auth", "oauth", "oidc"] },
  { name: "JWT", category: "Backend", aliases: ["json web token"] },
  { name: "Microservices", category: "Backend", aliases: ["distributed services"] },
  { name: "Message Queues", category: "Backend", aliases: ["queues", "pubsub", "rabbitmq"] },

  { name: "PostgreSQL", category: "Database", aliases: ["postgres", "psql"] },
  { name: "MySQL", category: "Database", aliases: ["mariadb"] },
  { name: "MongoDB", category: "Database", aliases: ["mongo"] },
  { name: "Redis", category: "Database", aliases: ["redis streams"] },
  { name: "Neo4j", category: "Database", aliases: ["cypher", "graph database"] },
  { name: "Prisma", category: "Database", aliases: ["prisma orm"] },
  { name: "SQLAlchemy", category: "Database", aliases: [] },
  { name: "Database Indexing", category: "Database", aliases: ["indexes", "query optimization"] },
  { name: "Data Modeling", category: "Database", aliases: ["schema design", "er modeling"] },

  { name: "Git", category: "Tooling", aliases: ["github", "gitlab"] },
  { name: "Linux", category: "Tooling", aliases: ["unix"] },
  { name: "Vite", category: "Tooling", aliases: [] },
  { name: "Webpack", category: "Tooling", aliases: [] },
  { name: "ESLint", category: "Tooling", aliases: ["linting"] },
  { name: "OpenAPI", category: "Tooling", aliases: ["swagger"] },

  { name: "Docker", category: "DevOps", aliases: ["dockerfile", "containers"] },
  { name: "Docker Compose", category: "DevOps", aliases: ["compose"] },
  { name: "Kubernetes", category: "DevOps", aliases: ["k8s"] },
  { name: "CI/CD", category: "DevOps", aliases: ["github actions", "gitlab ci", "pipelines"] },
  { name: "Terraform", category: "DevOps", aliases: ["iac", "infrastructure as code"] },
  { name: "Nginx", category: "DevOps", aliases: [] },
  { name: "Observability", category: "DevOps", aliases: ["monitoring", "logging", "tracing"] },
  { name: "Prometheus", category: "DevOps", aliases: [] },
  { name: "Grafana", category: "DevOps", aliases: [] },

  { name: "AWS", category: "Cloud", aliases: ["amazon web services"] },
  { name: "Azure", category: "Cloud", aliases: ["microsoft azure"] },
  { name: "Google Cloud", category: "Cloud", aliases: ["gcp"] },
  { name: "Serverless", category: "Cloud", aliases: ["lambda", "cloud functions"] },
  { name: "S3", category: "Cloud", aliases: ["object storage"] },
  { name: "Cloud Networking", category: "Cloud", aliases: ["vpc", "load balancer"] },

  { name: "Jest", category: "Testing", aliases: [] },
  { name: "Vitest", category: "Testing", aliases: [] },
  { name: "Playwright", category: "Testing", aliases: ["e2e testing"] },
  { name: "Cypress", category: "Testing", aliases: [] },
  { name: "Pytest", category: "Testing", aliases: [] },
  { name: "Unit Testing", category: "Testing", aliases: [] },
  { name: "Integration Testing", category: "Testing", aliases: [] },

  { name: "OWASP Top 10", category: "Security", aliases: ["owasp"] },
  { name: "Input Validation", category: "Security", aliases: ["validation", "sanitization"] },
  { name: "Secrets Management", category: "Security", aliases: ["secrets", "vault"] },
  { name: "RBAC", category: "Security", aliases: ["role based access control"] },
  { name: "Secure Coding", category: "Security", aliases: ["appsec"] },

  { name: "Pandas", category: "Data", aliases: [] },
  { name: "NumPy", category: "Data", aliases: ["numpy"] },
  { name: "ETL", category: "Data", aliases: ["data pipelines"] },
  { name: "Airflow", category: "Data", aliases: ["apache airflow"] },
  { name: "dbt", category: "Data", aliases: ["data build tool"] },
  { name: "Spark", category: "Data", aliases: ["apache spark", "pyspark"] },
  { name: "Data Warehousing", category: "Data", aliases: ["warehouse", "star schema"] },
  { name: "Power BI", category: "Data", aliases: ["powerbi"] },
  { name: "Tableau", category: "Data", aliases: [] },

  { name: "scikit-learn", category: "ML Library", aliases: ["sklearn"] },
  { name: "TensorFlow", category: "ML Library", aliases: [] },
  { name: "PyTorch", category: "ML Library", aliases: ["torch"] },
  { name: "NLP", category: "ML Library", aliases: ["natural language processing"] },
  { name: "Computer Vision", category: "ML Library", aliases: ["cv"] },
  { name: "Model Evaluation", category: "ML Library", aliases: ["metrics", "validation set"] },
  { name: "MLOps", category: "ML Library", aliases: ["ml pipelines"] },

  { name: "React Native", category: "Mobile", aliases: [] },
  { name: "Flutter", category: "Mobile", aliases: ["dart"] },
  { name: "Android", category: "Mobile", aliases: ["kotlin"] },
  { name: "iOS", category: "Mobile", aliases: ["swift"] },

  { name: "Figma", category: "Design", aliases: [] },
  { name: "UI Design", category: "Design", aliases: ["interface design"] },
  { name: "UX Research", category: "Design", aliases: ["user research"] },
  { name: "Design Systems", category: "Design", aliases: ["component library"] },
  { name: "Wireframing", category: "Design", aliases: ["prototyping"] },

  { name: "Agile", category: "Product", aliases: ["scrum", "kanban"] },
  { name: "Product Analytics", category: "Product", aliases: ["funnels", "cohorts"] },
  { name: "A/B Testing", category: "Product", aliases: ["experimentation"] },
  { name: "Technical Writing", category: "Product", aliases: ["documentation"] },
  { name: "Stakeholder Communication", category: "Product", aliases: ["communication"] }
];

const roles = [
  {
    title: "Frontend Developer",
    description: "Builds accessible, responsive, production-quality client applications.",
    requiredSkills: [
      ["HTML", 0.95], ["CSS", 0.95], ["JavaScript", 0.95], ["TypeScript", 0.85],
      ["React", 0.9], ["Responsive Design", 0.8], ["Web Accessibility", 0.75], ["Unit Testing", 0.55]
    ]
  },
  {
    title: "React Developer",
    description: "Specializes in React applications, state management, and component architecture.",
    requiredSkills: [
      ["JavaScript", 0.95], ["TypeScript", 0.9], ["React", 1], ["Redux", 0.7],
      ["React Query", 0.7], ["Tailwind CSS", 0.55], ["Vitest", 0.55], ["Playwright", 0.45]
    ]
  },
  {
    title: "Full Stack Developer",
    description: "Owns features across frontend, backend, database, and deployment.",
    requiredSkills: [
      ["TypeScript", 0.9], ["React", 0.85], ["Node.js", 0.9], ["REST APIs", 0.85],
      ["PostgreSQL", 0.8], ["Prisma", 0.65], ["Docker", 0.65], ["Authentication", 0.7]
    ]
  },
  {
    title: "Backend Developer",
    description: "Builds APIs, data models, integrations, and reliable backend systems.",
    requiredSkills: [
      ["Node.js", 0.9], ["Express", 0.8], ["REST APIs", 0.9], ["PostgreSQL", 0.85],
      ["Database Indexing", 0.7], ["Authentication", 0.75], ["Docker", 0.65], ["Unit Testing", 0.55]
    ]
  },
  {
    title: "Python Backend Developer",
    description: "Builds Python APIs and service integrations with clean data access patterns.",
    requiredSkills: [
      ["Python", 0.95], ["FastAPI", 0.85], ["Django", 0.6], ["PostgreSQL", 0.8],
      ["SQLAlchemy", 0.65], ["REST APIs", 0.85], ["Pytest", 0.65], ["Docker", 0.55]
    ]
  },
  {
    title: "DevOps Engineer",
    description: "Automates delivery, infrastructure, observability, and runtime operations.",
    requiredSkills: [
      ["Linux", 0.9], ["Docker", 0.9], ["Kubernetes", 0.85], ["CI/CD", 0.85],
      ["Terraform", 0.75], ["Nginx", 0.55], ["Observability", 0.75], ["AWS", 0.65]
    ]
  },
  {
    title: "Cloud Engineer",
    description: "Designs and operates cloud infrastructure, networking, and managed services.",
    requiredSkills: [
      ["AWS", 0.9], ["Cloud Networking", 0.85], ["Terraform", 0.8], ["Docker", 0.7],
      ["Kubernetes", 0.65], ["Serverless", 0.6], ["S3", 0.55], ["Secrets Management", 0.65]
    ]
  },
  {
    title: "Data Engineer",
    description: "Builds data pipelines, models, orchestration, and analytical storage.",
    requiredSkills: [
      ["Python", 0.9], ["SQL", 0.95], ["PostgreSQL", 0.75], ["ETL", 0.9],
      ["Airflow", 0.75], ["dbt", 0.7], ["Spark", 0.65], ["Data Warehousing", 0.8]
    ]
  },
  {
    title: "Data Analyst",
    description: "Turns data into reports, dashboards, insights, and recommendations.",
    requiredSkills: [
      ["SQL", 0.95], ["Product Analytics", 0.75], ["Pandas", 0.75], ["Power BI", 0.65],
      ["Tableau", 0.65], ["Data Warehousing", 0.55], ["A/B Testing", 0.55], ["Technical Writing", 0.45]
    ]
  },
  {
    title: "Machine Learning Engineer",
    description: "Builds, evaluates, and deploys machine learning systems.",
    requiredSkills: [
      ["Python", 0.95], ["NumPy", 0.8], ["Pandas", 0.8], ["scikit-learn", 0.85],
      ["PyTorch", 0.7], ["Model Evaluation", 0.85], ["MLOps", 0.65], ["Docker", 0.55]
    ]
  },
  {
    title: "Mobile App Developer",
    description: "Builds mobile applications with native or cross-platform stacks.",
    requiredSkills: [
      ["JavaScript", 0.65], ["TypeScript", 0.6], ["React Native", 0.85], ["Flutter", 0.65],
      ["Android", 0.55], ["iOS", 0.55], ["REST APIs", 0.65], ["UI Design", 0.45]
    ]
  },
  {
    title: "QA Automation Engineer",
    description: "Builds automated test suites and quality gates for product workflows.",
    requiredSkills: [
      ["Unit Testing", 0.75], ["Integration Testing", 0.8], ["Playwright", 0.85], ["Cypress", 0.7],
      ["JavaScript", 0.7], ["CI/CD", 0.65], ["REST APIs", 0.5], ["Technical Writing", 0.45]
    ]
  },
  {
    title: "Application Security Engineer",
    description: "Improves software security through review, automation, and risk mitigation.",
    requiredSkills: [
      ["OWASP Top 10", 0.95], ["Secure Coding", 0.85], ["Input Validation", 0.75], ["Authentication", 0.75],
      ["RBAC", 0.65], ["Secrets Management", 0.75], ["REST APIs", 0.55], ["Docker", 0.45]
    ]
  },
  {
    title: "UI/UX Designer",
    description: "Designs usable product flows, prototypes, and design systems.",
    requiredSkills: [
      ["Figma", 0.95], ["UI Design", 0.9], ["UX Research", 0.8], ["Wireframing", 0.85],
      ["Design Systems", 0.7], ["Web Accessibility", 0.55], ["Stakeholder Communication", 0.6]
    ]
  },
  {
    title: "Product Engineer",
    description: "Blends product judgment with full-stack implementation for user-facing features.",
    requiredSkills: [
      ["React", 0.8], ["TypeScript", 0.8], ["Node.js", 0.65], ["Product Analytics", 0.7],
      ["A/B Testing", 0.55], ["UI Design", 0.55], ["Technical Writing", 0.5], ["Stakeholder Communication", 0.7]
    ]
  }
] satisfies Array<{
  title: string;
  description: string;
  requiredSkills: Array<[string, number]>;
}>;

const resources = [
  ["MDN JavaScript Guide", "https://developer.mozilla.org/en-US/docs/Web/JavaScript/Guide", "DOCUMENTATION", "MDN", 8, 4.9],
  ["MDN HTML Guide", "https://developer.mozilla.org/en-US/docs/Learn/HTML", "DOCUMENTATION", "MDN", 6, 4.8],
  ["MDN CSS Guide", "https://developer.mozilla.org/en-US/docs/Learn/CSS", "DOCUMENTATION", "MDN", 8, 4.8],
  ["TypeScript Handbook", "https://www.typescriptlang.org/docs/handbook/intro.html", "DOCUMENTATION", "TypeScript", 10, 4.9],
  ["React Documentation", "https://react.dev/learn", "DOCUMENTATION", "React", 10, 4.9],
  ["Next.js Learn", "https://nextjs.org/learn", "COURSE", "Vercel", 8, 4.7],
  ["Node.js Learn", "https://nodejs.org/en/learn", "DOCUMENTATION", "Node.js", 8, 4.7],
  ["Express Guide", "https://expressjs.com/en/guide/routing.html", "DOCUMENTATION", "Express", 4, 4.5],
  ["FastAPI Tutorial", "https://fastapi.tiangolo.com/tutorial/", "DOCUMENTATION", "FastAPI", 8, 4.8],
  ["PostgreSQL Tutorial", "https://www.postgresql.org/docs/current/tutorial.html", "DOCUMENTATION", "PostgreSQL", 6, 4.8],
  ["Prisma Documentation", "https://www.prisma.io/docs", "DOCUMENTATION", "Prisma", 6, 4.6],
  ["Docker Get Started", "https://docs.docker.com/get-started/", "DOCUMENTATION", "Docker", 5, 4.8],
  ["Kubernetes Basics", "https://kubernetes.io/docs/tutorials/kubernetes-basics/", "TUTORIAL", "Kubernetes", 8, 4.7],
  ["Terraform Tutorials", "https://developer.hashicorp.com/terraform/tutorials", "TUTORIAL", "HashiCorp", 8, 4.6],
  ["AWS Skill Builder", "https://skillbuilder.aws/", "COURSE", "AWS", 12, 4.5],
  ["Playwright Docs", "https://playwright.dev/docs/intro", "DOCUMENTATION", "Playwright", 5, 4.8],
  ["OWASP Top 10", "https://owasp.org/www-project-top-ten/", "REFERENCE", "OWASP", 4, 4.9],
  ["Pandas User Guide", "https://pandas.pydata.org/docs/user_guide/index.html", "DOCUMENTATION", "Pandas", 10, 4.7],
  ["scikit-learn Tutorials", "https://scikit-learn.org/stable/tutorial/index.html", "TUTORIAL", "scikit-learn", 10, 4.7],
  ["Figma Resource Library", "https://www.figma.com/resource-library/", "GUIDE", "Figma", 6, 4.6]
].map(([title, url, type, provider, durationHours, rating]) => ({
  title: String(title),
  url: String(url),
  type: String(type),
  provider: String(provider),
  durationHours: Number(durationHours),
  isUniversityApproved: true,
  rating: Number(rating)
}));

async function main() {
  const categoryIds = new Map<string, string>();

  for (const category of categories) {
    const saved = await prisma.skillCategory.upsert({
      where: { name: category.name },
      update: category,
      create: category
    });
    categoryIds.set(saved.name, saved.id);
  }

  const skillIds = new Map<string, string>();

  for (const skill of skills) {
    const categoryId = categoryIds.get(skill.category);
    const saved = await prisma.skill.upsert({
      where: { name: skill.name },
      update: { aliases: skill.aliases, categoryId },
      create: { name: skill.name, aliases: skill.aliases, categoryId }
    });
    skillIds.set(saved.name, saved.id);
  }

  for (const role of roles) {
    const savedRole = await prisma.industryRole.upsert({
      where: { title: role.title },
      update: { description: role.description },
      create: { title: role.title, description: role.description }
    });

    for (const [skillName, criticality] of role.requiredSkills) {
      const skillId = skillIds.get(skillName);
      if (!skillId) throw new Error(`Seed role "${role.title}" references missing skill "${skillName}"`);

      await prisma.roleRequirement.upsert({
        where: { roleId_skillId: { roleId: savedRole.id, skillId } },
        update: { criticality },
        create: { roleId: savedRole.id, skillId, criticality }
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

  console.log(`Seeded ${categories.length} categories, ${skills.length} skills, ${roles.length} roles, and ${resources.length} resources.`);
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
