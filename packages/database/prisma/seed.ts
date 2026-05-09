import crypto from "node:crypto";
import { promisify } from "node:util";
import { PrismaClient, type InvitationStatus, type MentorshipStatus, type UserRole } from "@prisma/client";

const prisma = new PrismaClient();
const scrypt = promisify(crypto.scrypt);

const DEMO_PASSWORD = "SkillGraph@123";

async function hashPassword(password: string) {
  const salt = "skillgraph-bd-demo-salt";
  const derived = (await scrypt(password, salt, 64)) as Buffer;
  return `scrypt:${salt}:${derived.toString("base64url")}`;
}

const ids = {
  universities: {
    buet: "10000000-0000-4000-8000-000000000001",
    du: "10000000-0000-4000-8000-000000000002",
    nsu: "10000000-0000-4000-8000-000000000003",
    bracu: "10000000-0000-4000-8000-000000000004"
  },
  departments: {
    buetCse: "11000000-0000-4000-8000-000000000001",
    buetEee: "11000000-0000-4000-8000-000000000002",
    duCse: "11000000-0000-4000-8000-000000000003",
    duStats: "11000000-0000-4000-8000-000000000004",
    nsuCse: "11000000-0000-4000-8000-000000000005",
    bracuCse: "11000000-0000-4000-8000-000000000006"
  },
  users: {
    arif: "20000000-0000-4000-8000-000000000001",
    nusrat: "20000000-0000-4000-8000-000000000002",
    tanvir: "20000000-0000-4000-8000-000000000003",
    mehzabin: "20000000-0000-4000-8000-000000000004",
    rahim: "20000000-0000-4000-8000-000000000005",
    farhana: "20000000-0000-4000-8000-000000000006",
    professor: "20000000-0000-4000-8000-000000000101",
    admin: "20000000-0000-4000-8000-000000000102",
    alumnus: "20000000-0000-4000-8000-000000000201",
    alumna: "20000000-0000-4000-8000-000000000202"
  },
  profiles: {
    arif: "21000000-0000-4000-8000-000000000001",
    nusrat: "21000000-0000-4000-8000-000000000002",
    tanvir: "21000000-0000-4000-8000-000000000003",
    mehzabin: "21000000-0000-4000-8000-000000000004",
    rahim: "21000000-0000-4000-8000-000000000005",
    farhana: "21000000-0000-4000-8000-000000000006"
  },
  alumniProfiles: {
    alumnus: "22000000-0000-4000-8000-000000000201",
    alumna: "22000000-0000-4000-8000-000000000202"
  },
  repos: {
    arifSkill: "30000000-0000-4000-8000-000000000001",
    arifBus: "30000000-0000-4000-8000-000000000002",
    nusratClinic: "30000000-0000-4000-8000-000000000003",
    tanvirFlood: "30000000-0000-4000-8000-000000000004",
    mehzabinJobs: "30000000-0000-4000-8000-000000000005",
    rahimMfs: "30000000-0000-4000-8000-000000000006",
    farhanaVision: "30000000-0000-4000-8000-000000000007"
  },
  projects: {
    skillBridge: "31000000-0000-4000-8000-000000000001",
    dhakaTransit: "31000000-0000-4000-8000-000000000002",
    floodWatch: "31000000-0000-4000-8000-000000000003"
  },
  fairs: {
    buet2026: "40000000-0000-4000-8000-000000000001",
    du2026: "40000000-0000-4000-8000-000000000002"
  }
};

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
  ["HTML", "Language", ["html5", "semantic html"]],
  ["CSS", "Language", ["css3", "stylesheets"]],
  ["JavaScript", "Language", ["js", "ecmascript"]],
  ["TypeScript", "Language", ["ts"]],
  ["Python", "Language", ["py"]],
  ["Java", "Language", ["jvm"]],
  ["Go", "Language", ["golang"]],
  ["SQL", "Language", ["structured query language"]],
  ["React", "Frontend", ["reactjs", "react.js"]],
  ["Next.js", "Frontend", ["nextjs", "next"]],
  ["Tailwind CSS", "Frontend", ["tailwind"]],
  ["Redux", "Frontend", ["redux toolkit", "rtk"]],
  ["React Query", "Frontend", ["tanstack query"]],
  ["Web Accessibility", "Frontend", ["a11y", "wcag"]],
  ["Responsive Design", "Frontend", ["mobile first", "responsive ui"]],
  ["WebSockets", "Frontend", ["socket.io", "socketio"]],
  ["Node.js", "Backend", ["node", "nodejs"]],
  ["Express", "Backend", ["express.js", "expressjs"]],
  ["NestJS", "Backend", ["nestjs"]],
  ["FastAPI", "Backend", ["fast api"]],
  ["Django", "Backend", []],
  ["REST APIs", "Backend", ["rest", "restful api"]],
  ["Authentication", "Backend", ["auth", "oauth", "oidc"]],
  ["JWT", "Backend", ["json web token"]],
  ["Microservices", "Backend", ["distributed services"]],
  ["PostgreSQL", "Database", ["postgres", "psql"]],
  ["MySQL", "Database", ["mariadb"]],
  ["MongoDB", "Database", ["mongo"]],
  ["Redis", "Database", ["redis streams"]],
  ["Neo4j", "Database", ["cypher", "graph database"]],
  ["Prisma", "Database", ["prisma orm"]],
  ["Database Indexing", "Database", ["indexes", "query optimization"]],
  ["Data Modeling", "Database", ["schema design", "er modeling"]],
  ["Git", "Tooling", ["github", "gitlab"]],
  ["Linux", "Tooling", ["unix"]],
  ["Vite", "Tooling", []],
  ["OpenAPI", "Tooling", ["swagger"]],
  ["Docker", "DevOps", ["dockerfile", "containers"]],
  ["Docker Compose", "DevOps", ["compose"]],
  ["Kubernetes", "DevOps", ["k8s"]],
  ["CI/CD", "DevOps", ["github actions", "gitlab ci", "pipelines"]],
  ["Terraform", "DevOps", ["iac", "infrastructure as code"]],
  ["Nginx", "DevOps", []],
  ["Observability", "DevOps", ["monitoring", "logging", "tracing"]],
  ["AWS", "Cloud", ["amazon web services"]],
  ["Azure", "Cloud", ["microsoft azure"]],
  ["Google Cloud", "Cloud", ["gcp"]],
  ["Serverless", "Cloud", ["lambda", "cloud functions"]],
  ["Jest", "Testing", []],
  ["Vitest", "Testing", []],
  ["Playwright", "Testing", ["e2e testing"]],
  ["Pytest", "Testing", []],
  ["Unit Testing", "Testing", []],
  ["Integration Testing", "Testing", []],
  ["OWASP Top 10", "Security", ["owasp"]],
  ["Input Validation", "Security", ["validation", "sanitization"]],
  ["Secrets Management", "Security", ["secrets", "vault"]],
  ["RBAC", "Security", ["role based access control"]],
  ["Pandas", "Data", []],
  ["NumPy", "Data", ["numpy"]],
  ["ETL", "Data", ["data pipelines"]],
  ["Airflow", "Data", ["apache airflow"]],
  ["dbt", "Data", ["data build tool"]],
  ["Spark", "Data", ["apache spark", "pyspark"]],
  ["Data Warehousing", "Data", ["warehouse", "star schema"]],
  ["Power BI", "Data", ["powerbi"]],
  ["Tableau", "Data", []],
  ["scikit-learn", "ML Library", ["sklearn"]],
  ["TensorFlow", "ML Library", []],
  ["PyTorch", "ML Library", ["torch"]],
  ["NLP", "ML Library", ["natural language processing"]],
  ["Computer Vision", "ML Library", ["cv"]],
  ["Model Evaluation", "ML Library", ["metrics", "validation set"]],
  ["MLOps", "ML Library", ["ml pipelines"]],
  ["React Native", "Mobile", []],
  ["Flutter", "Mobile", ["dart"]],
  ["Android", "Mobile", ["kotlin"]],
  ["Figma", "Design", []],
  ["UI Design", "Design", ["interface design"]],
  ["UX Research", "Design", ["user research"]],
  ["Design Systems", "Design", ["component library"]],
  ["Agile", "Product", ["scrum", "kanban"]],
  ["Product Analytics", "Product", ["funnels", "cohorts"]],
  ["A/B Testing", "Product", ["experimentation"]],
  ["Technical Writing", "Product", ["documentation"]],
  ["Stakeholder Communication", "Product", ["communication"]]
] satisfies Array<[string, string, string[]]>;

const roles = [
  {
    title: "Frontend Developer",
    description: "Builds accessible, responsive, production-quality client applications.",
    requiredSkills: [["HTML", 0.95], ["CSS", 0.95], ["JavaScript", 0.95], ["TypeScript", 0.85], ["React", 0.9], ["Responsive Design", 0.8], ["Web Accessibility", 0.75], ["Unit Testing", 0.55]]
  },
  {
    title: "Full Stack Developer",
    description: "Owns features across frontend, backend, database, and deployment.",
    requiredSkills: [["TypeScript", 0.9], ["React", 0.85], ["Node.js", 0.9], ["REST APIs", 0.85], ["PostgreSQL", 0.8], ["Prisma", 0.65], ["Docker", 0.65], ["Authentication", 0.7]]
  },
  {
    title: "Backend Developer",
    description: "Builds APIs, data models, integrations, and reliable backend systems.",
    requiredSkills: [["Node.js", 0.9], ["Express", 0.8], ["REST APIs", 0.9], ["PostgreSQL", 0.85], ["Database Indexing", 0.7], ["Authentication", 0.75], ["Docker", 0.65], ["Unit Testing", 0.55]]
  },
  {
    title: "Python Backend Developer",
    description: "Builds Python APIs and service integrations with clean data access patterns.",
    requiredSkills: [["Python", 0.95], ["FastAPI", 0.85], ["Django", 0.6], ["PostgreSQL", 0.8], ["REST APIs", 0.85], ["Pytest", 0.65], ["Docker", 0.55]]
  },
  {
    title: "Data Engineer",
    description: "Builds data pipelines, models, orchestration, and analytical storage.",
    requiredSkills: [["Python", 0.9], ["SQL", 0.95], ["PostgreSQL", 0.75], ["ETL", 0.9], ["Airflow", 0.75], ["dbt", 0.7], ["Spark", 0.65], ["Data Warehousing", 0.8]]
  },
  {
    title: "Machine Learning Engineer",
    description: "Builds, evaluates, and deploys machine learning systems.",
    requiredSkills: [["Python", 0.95], ["NumPy", 0.8], ["Pandas", 0.8], ["scikit-learn", 0.85], ["PyTorch", 0.7], ["Model Evaluation", 0.85], ["MLOps", 0.65], ["Docker", 0.55]]
  },
  {
    title: "DevOps Engineer",
    description: "Automates delivery, infrastructure, observability, and runtime operations.",
    requiredSkills: [["Linux", 0.9], ["Docker", 0.9], ["Kubernetes", 0.85], ["CI/CD", 0.85], ["Terraform", 0.75], ["Nginx", 0.55], ["Observability", 0.75], ["AWS", 0.65]]
  },
  {
    title: "Application Security Engineer",
    description: "Improves software security through review, automation, and risk mitigation.",
    requiredSkills: [["OWASP Top 10", 0.95], ["Input Validation", 0.75], ["Authentication", 0.75], ["RBAC", 0.65], ["Secrets Management", 0.75], ["REST APIs", 0.55], ["Docker", 0.45]]
  }
] satisfies Array<{ title: string; description: string; requiredSkills: Array<[string, number]> }>;

const universities = [
  { id: ids.universities.buet, name: "Bangladesh University of Engineering and Technology", shortName: "BUET", country: "Bangladesh" },
  { id: ids.universities.du, name: "University of Dhaka", shortName: "DU", country: "Bangladesh" },
  { id: ids.universities.nsu, name: "North South University", shortName: "NSU", country: "Bangladesh" },
  { id: ids.universities.bracu, name: "BRAC University", shortName: "BRACU", country: "Bangladesh" }
];

const departments = [
  { id: ids.departments.buetCse, universityId: ids.universities.buet, name: "Computer Science and Engineering", code: "CSE" },
  { id: ids.departments.buetEee, universityId: ids.universities.buet, name: "Electrical and Electronic Engineering", code: "EEE" },
  { id: ids.departments.duCse, universityId: ids.universities.du, name: "Computer Science and Engineering", code: "CSE" },
  { id: ids.departments.duStats, universityId: ids.universities.du, name: "Statistics", code: "STAT" },
  { id: ids.departments.nsuCse, universityId: ids.universities.nsu, name: "Electrical and Computer Engineering", code: "ECE" },
  { id: ids.departments.bracuCse, universityId: ids.universities.bracu, name: "Computer Science and Engineering", code: "CSE" }
];

const users = [
  { key: "arif", id: ids.users.arif, role: "student", fullName: "Arif Hasan", email: "arif.hasan@buet.ac.bd", githubHandle: "arif-buet", profileId: ids.profiles.arif, studentIdNo: "BUET-CSE-1905012", universityId: ids.universities.buet, departmentId: ids.departments.buetCse, graduationYear: 2026, publicHandle: "arif-hasan-buet", bio: "BUET CSE student building transit and career tools for Dhaka students." },
  { key: "nusrat", id: ids.users.nusrat, role: "student", fullName: "Nusrat Jahan", email: "nusrat.jahan@buet.ac.bd", githubHandle: "nusrat-buet", profileId: ids.profiles.nusrat, studentIdNo: "BUET-CSE-1905024", universityId: ids.universities.buet, departmentId: ids.departments.buetCse, graduationYear: 2026, publicHandle: "nusrat-jahan-buet", bio: "Frontend-focused student interested in accessibility for public health products." },
  { key: "tanvir", id: ids.users.tanvir, role: "student", fullName: "Tanvir Ahmed", email: "tanvir.ahmed@du.ac.bd", githubHandle: "tanvir-du", profileId: ids.profiles.tanvir, studentIdNo: "DU-CSE-2019018", universityId: ids.universities.du, departmentId: ids.departments.duCse, graduationYear: 2025, publicHandle: "tanvir-ahmed-du", bio: "Data and backend builder working on flood analytics and civic datasets." },
  { key: "mehzabin", id: ids.users.mehzabin, role: "student", fullName: "Mehzabin Chowdhury", email: "mehzabin@northsouth.edu", githubHandle: "mehzabin-nsu", profileId: ids.profiles.mehzabin, studentIdNo: "NSU-ECE-2021061", universityId: ids.universities.nsu, departmentId: ids.departments.nsuCse, graduationYear: 2027, publicHandle: "mehzabin-nsu", bio: "Product-minded engineer prototyping internship and job matching workflows." },
  { key: "rahim", id: ids.users.rahim, role: "student", fullName: "Rahim Uddin", email: "rahim.uddin@g.bracu.ac.bd", githubHandle: "rahim-bracu", profileId: ids.profiles.rahim, studentIdNo: "BRACU-CSE-20304011", universityId: ids.universities.bracu, departmentId: ids.departments.bracuCse, graduationYear: 2025, publicHandle: "rahim-uddin-bracu", bio: "Backend and security learner working on payment-style APIs." },
  { key: "farhana", id: ids.users.farhana, role: "student", fullName: "Farhana Sultana", email: "farhana.sultana@du.ac.bd", githubHandle: "farhana-du", profileId: ids.profiles.farhana, studentIdNo: "DU-STAT-2020055", universityId: ids.universities.du, departmentId: ids.departments.duStats, graduationYear: 2026, publicHandle: "farhana-sultana-du", bio: "Statistics student exploring ML, computer vision, and dashboard storytelling." }
] satisfies Array<{
  key: keyof typeof ids.profiles;
  id: string;
  role: UserRole;
  fullName: string;
  email: string;
  githubHandle: string;
  profileId: string;
  studentIdNo: string;
  universityId: string;
  departmentId: string;
  graduationYear: number;
  publicHandle: string;
  bio: string;
}>;

const staffUsers = [
  { id: ids.users.professor, role: "professor" as UserRole, fullName: "Dr. Samia Rahman", email: "samia.rahman@buet.ac.bd", githubHandle: "samia-rahman" },
  { id: ids.users.admin, role: "admin" as UserRole, fullName: "SkillGraph Bangladesh Admin", email: "admin@skillgraph.bd", githubHandle: "skillgraph-bd-admin" },
  { id: ids.users.alumnus, role: "alumni" as UserRole, fullName: "Sajid Karim", email: "sajid.karim@alumni.buet.ac.bd", githubHandle: "sajid-karim" },
  { id: ids.users.alumna, role: "alumni" as UserRole, fullName: "Maliha Islam", email: "maliha.islam@alumni.du.ac.bd", githubHandle: "maliha-islam" }
];

const repositories = [
  { id: ids.repos.arifSkill, userId: ids.users.arif, githubRepoId: 880000001n, repoName: "skillbridge-bd", fullName: "arif-buet/skillbridge-bd", description: "Capstone team finder for Bangladeshi university students.", language: "TypeScript", starsCount: 42, readme: "React TypeScript Node.js Express PostgreSQL Prisma Neo4j Docker matching skill graph" },
  { id: ids.repos.arifBus, userId: ids.users.arif, githubRepoId: 880000002n, repoName: "dhaka-bus-pulse", fullName: "arif-buet/dhaka-bus-pulse", description: "Realtime bus crowding dashboard for Dhaka routes.", language: "TypeScript", starsCount: 18, readme: "React WebSockets Redis Node.js PostgreSQL data visualization" },
  { id: ids.repos.nusratClinic, userId: ids.users.nusrat, githubRepoId: 880000003n, repoName: "clinic-queue-bd", fullName: "nusrat-buet/clinic-queue-bd", description: "Accessible clinic queue UI for upazila health centers.", language: "TypeScript", starsCount: 27, readme: "React TypeScript Tailwind CSS Web Accessibility Playwright Figma" },
  { id: ids.repos.tanvirFlood, userId: ids.users.tanvir, githubRepoId: 880000004n, repoName: "floodwatch-bd", fullName: "tanvir-du/floodwatch-bd", description: "Flood risk ETL and alert API using public Bangladesh datasets.", language: "Python", starsCount: 35, readme: "Python FastAPI PostgreSQL Pandas ETL Airflow Docker data engineering" },
  { id: ids.repos.mehzabinJobs, userId: ids.users.mehzabin, githubRepoId: 880000005n, repoName: "internship-pathways-bd", fullName: "mehzabin-nsu/internship-pathways-bd", description: "Internship matching prototype for Dhaka tech companies.", language: "TypeScript", starsCount: 16, readme: "Next.js React Product Analytics A/B Testing Figma REST APIs" },
  { id: ids.repos.rahimMfs, userId: ids.users.rahim, githubRepoId: 880000006n, repoName: "mfs-ledger-lab", fullName: "rahim-bracu/mfs-ledger-lab", description: "Payment ledger API inspired by mobile financial service workflows.", language: "TypeScript", starsCount: 24, readme: "Node.js Express PostgreSQL Authentication JWT OWASP Top 10 Input Validation Docker" },
  { id: ids.repos.farhanaVision, userId: ids.users.farhana, githubRepoId: 880000007n, repoName: "rickshaw-vision", fullName: "farhana-du/rickshaw-vision", description: "Small computer vision classifier for traffic image experiments.", language: "Python", starsCount: 21, readme: "Python PyTorch Computer Vision Pandas NumPy Model Evaluation MLOps" }
];

const resources = [
  ["MDN JavaScript Guide", "https://developer.mozilla.org/en-US/docs/Web/JavaScript/Guide", "DOCUMENTATION", "MDN", 8, 4.9],
  ["TypeScript Handbook", "https://www.typescriptlang.org/docs/handbook/intro.html", "DOCUMENTATION", "TypeScript", 10, 4.9],
  ["React Documentation", "https://react.dev/learn", "DOCUMENTATION", "React", 10, 4.9],
  ["Next.js Learn", "https://nextjs.org/learn", "COURSE", "Vercel", 8, 4.7],
  ["FastAPI Tutorial", "https://fastapi.tiangolo.com/tutorial/", "DOCUMENTATION", "FastAPI", 8, 4.8],
  ["PostgreSQL Tutorial", "https://www.postgresql.org/docs/current/tutorial.html", "DOCUMENTATION", "PostgreSQL", 6, 4.8],
  ["Prisma Documentation", "https://www.prisma.io/docs", "DOCUMENTATION", "Prisma", 6, 4.6],
  ["Docker Get Started", "https://docs.docker.com/get-started/", "DOCUMENTATION", "Docker", 5, 4.8],
  ["Playwright Docs", "https://playwright.dev/docs/intro", "DOCUMENTATION", "Playwright", 5, 4.8],
  ["OWASP Top 10", "https://owasp.org/www-project-top-ten/", "REFERENCE", "OWASP", 4, 4.9],
  ["Pandas User Guide", "https://pandas.pydata.org/docs/user_guide/index.html", "DOCUMENTATION", "Pandas", 10, 4.7],
  ["scikit-learn Tutorials", "https://scikit-learn.org/stable/tutorial/index.html", "TUTORIAL", "scikit-learn", 10, 4.7],
  ["Bangladesh Open Data Portal", "https://data.gov.bd/", "REFERENCE", "Bangladesh Government", 3, 4.4],
  ["10 Minute School Career Skills", "https://10minuteschool.com/", "COURSE", "10 Minute School", 6, 4.5],
  ["Kaggle Learn Python", "https://www.kaggle.com/learn/python", "COURSE", "Kaggle", 5, 4.7]
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
  const passwordHash = await hashPassword(DEMO_PASSWORD);
  const categoryIds = new Map<string, string>();
  const skillIds = new Map<string, string>();
  const roleIds = new Map<string, string>();

  for (const university of universities) {
    await prisma.university.upsert({
      where: { id: university.id },
      update: university,
      create: university
    });
  }

  for (const department of departments) {
    await prisma.department.upsert({
      where: { id: department.id },
      update: department,
      create: department
    });
  }

  for (const category of categories) {
    const saved = await prisma.skillCategory.upsert({
      where: { name: category.name },
      update: category,
      create: category
    });
    categoryIds.set(saved.name, saved.id);
  }

  for (const [name, category, aliases] of skills) {
    const categoryId = categoryIds.get(category);
    const saved = await prisma.skill.upsert({
      where: { name },
      update: { aliases, categoryId },
      create: { name, aliases, categoryId }
    });
    skillIds.set(saved.name, saved.id);
  }

  for (const role of roles) {
    const savedRole = await prisma.industryRole.upsert({
      where: { title: role.title },
      update: { description: role.description, source: "SkillGraph Bangladesh demo seed" },
      create: { title: role.title, description: role.description, source: "SkillGraph Bangladesh demo seed" }
    });
    roleIds.set(savedRole.title, savedRole.id);

    for (const [skillName, criticality] of role.requiredSkills) {
      const skillId = skillIds.get(skillName);
      if (!skillId) throw new Error(`Role "${role.title}" references missing skill "${skillName}"`);

      await prisma.roleRequirement.upsert({
        where: { roleId_skillId: { roleId: savedRole.id, skillId } },
        update: { criticality },
        create: { roleId: savedRole.id, skillId, criticality }
      });
    }
  }

  for (const user of [...users, ...staffUsers]) {
    await prisma.user.upsert({
      where: { id: user.id },
      update: {
        email: user.email,
        emailVerifiedAt: new Date("2026-01-15T06:00:00.000Z"),
        passwordHash,
        fullName: user.fullName,
        githubHandle: user.githubHandle,
        role: user.role,
        isActive: true
      },
      create: {
        id: user.id,
        email: user.email,
        emailVerifiedAt: new Date("2026-01-15T06:00:00.000Z"),
        passwordHash,
        fullName: user.fullName,
        githubHandle: user.githubHandle,
        role: user.role,
        isActive: true
      }
    });
  }

  for (const user of users) {
    await prisma.studentProfile.upsert({
      where: { userId: user.id },
      update: {
        id: user.profileId,
        studentIdNo: user.studentIdNo,
        universityId: user.universityId,
        departmentId: user.departmentId,
        graduationYear: user.graduationYear,
        publicHandle: user.publicHandle,
        bio: user.bio,
        linkedinUrl: `https://www.linkedin.com/in/${user.publicHandle}`,
        portfolioUrl: `https://${user.publicHandle}.skillgraph.bd`
      },
      create: {
        id: user.profileId,
        userId: user.id,
        studentIdNo: user.studentIdNo,
        universityId: user.universityId,
        departmentId: user.departmentId,
        graduationYear: user.graduationYear,
        publicHandle: user.publicHandle,
        bio: user.bio,
        linkedinUrl: `https://www.linkedin.com/in/${user.publicHandle}`,
        portfolioUrl: `https://${user.publicHandle}.skillgraph.bd`
      }
    });

    await prisma.portfolio.upsert({
      where: { id: `23000000-0000-4000-8000-${user.profileId.slice(-12)}` },
      update: { studentId: user.profileId, isPublic: true, viewCount: 80 + Number(user.profileId.slice(-2)), lastViewed: new Date("2026-05-01T09:00:00.000Z") },
      create: { id: `23000000-0000-4000-8000-${user.profileId.slice(-12)}`, studentId: user.profileId, isPublic: true, viewCount: 80 + Number(user.profileId.slice(-2)), lastViewed: new Date("2026-05-01T09:00:00.000Z") }
    });
  }

  await prisma.alumniProfile.upsert({
    where: { userId: ids.users.alumnus },
    update: {
      id: ids.alumniProfiles.alumnus,
      graduationYear: 2018,
      currentCompany: "bKash",
      currentRole: "Senior Backend Engineer",
      yearsExperience: 7,
      mentoringSkills: ["Node.js", "PostgreSQL", "Authentication", "System Design"],
      willingToMentor: true,
      linkedinUrl: "https://www.linkedin.com/in/sajid-karim"
    },
    create: {
      id: ids.alumniProfiles.alumnus,
      userId: ids.users.alumnus,
      graduationYear: 2018,
      currentCompany: "bKash",
      currentRole: "Senior Backend Engineer",
      yearsExperience: 7,
      mentoringSkills: ["Node.js", "PostgreSQL", "Authentication", "System Design"],
      willingToMentor: true,
      linkedinUrl: "https://www.linkedin.com/in/sajid-karim"
    }
  });

  await prisma.alumniProfile.upsert({
    where: { userId: ids.users.alumna },
    update: {
      id: ids.alumniProfiles.alumna,
      graduationYear: 2019,
      currentCompany: "Pathao",
      currentRole: "Machine Learning Engineer",
      yearsExperience: 6,
      mentoringSkills: ["Python", "Pandas", "PyTorch", "MLOps"],
      willingToMentor: true,
      linkedinUrl: "https://www.linkedin.com/in/maliha-islam"
    },
    create: {
      id: ids.alumniProfiles.alumna,
      userId: ids.users.alumna,
      graduationYear: 2019,
      currentCompany: "Pathao",
      currentRole: "Machine Learning Engineer",
      yearsExperience: 6,
      mentoringSkills: ["Python", "Pandas", "PyTorch", "MLOps"],
      willingToMentor: true,
      linkedinUrl: "https://www.linkedin.com/in/maliha-islam"
    }
  });

  for (const repo of repositories) {
    await prisma.githubRepository.upsert({
      where: { githubRepoId: repo.githubRepoId },
      update: {
        id: repo.id,
        userId: repo.userId,
        repoName: repo.repoName,
        fullName: repo.fullName,
        description: repo.description,
        language: repo.language,
        starsCount: repo.starsCount,
        rawReadmeText: repo.readme,
        lastIngestedAt: new Date("2026-05-01T10:30:00.000Z")
      },
      create: {
        id: repo.id,
        userId: repo.userId,
        githubRepoId: repo.githubRepoId,
        repoName: repo.repoName,
        fullName: repo.fullName,
        description: repo.description,
        language: repo.language,
        starsCount: repo.starsCount,
        rawReadmeText: repo.readme,
        lastIngestedAt: new Date("2026-05-01T10:30:00.000Z")
      }
    });
  }

  const commits = repositories.flatMap((repo, repoIndex) => [0, 1].map((commitIndex) => ({
    repoId: repo.id,
    sha: `${repo.githubRepoId.toString(16).padStart(20, "0")}${commitIndex.toString().repeat(20)}`.slice(0, 40),
    message: commitIndex === 0 ? "Seed demo workflow implementation" : "Add evidence and tests",
    committedAt: new Date(Date.UTC(2026, 3, 20 + repoIndex, 8 + commitIndex, 30))
  })));

  for (const commit of commits) {
    await prisma.githubCommit.upsert({
      where: { sha: commit.sha },
      update: commit,
      create: commit
    });
  }

  const projects = [
    { id: ids.projects.skillBridge, title: "SkillBridge Bangladesh", description: "Capstone project for matching Bangladeshi university students into balanced teams.", ownerId: ids.users.arif, repoId: ids.repos.arifSkill, isCapstone: true, startDate: new Date("2026-01-15"), endDate: new Date("2026-06-15") },
    { id: ids.projects.dhakaTransit, title: "Dhaka Transit Pulse", description: "Realtime public transport crowding and delay dashboard.", ownerId: ids.users.nusrat, repoId: ids.repos.arifBus, isCapstone: false, startDate: new Date("2026-02-01"), endDate: new Date("2026-05-30") },
    { id: ids.projects.floodWatch, title: "FloodWatch BD", description: "Flood risk analytics using open river and rainfall datasets.", ownerId: ids.users.tanvir, repoId: ids.repos.tanvirFlood, isCapstone: true, startDate: new Date("2026-01-20"), endDate: new Date("2026-07-01") }
  ];

  for (const project of projects) {
    await prisma.academicProject.upsert({
      where: { id: project.id },
      update: project,
      create: project
    });
  }

  const collaborators = [
    [ids.projects.skillBridge, ids.users.nusrat, "Frontend and accessibility"],
    [ids.projects.skillBridge, ids.users.rahim, "API and security"],
    [ids.projects.dhakaTransit, ids.users.arif, "Realtime data"],
    [ids.projects.dhakaTransit, ids.users.mehzabin, "Product analytics"],
    [ids.projects.floodWatch, ids.users.farhana, "Model evaluation"]
  ] satisfies Array<[string, string, string]>;

  for (const [projectId, userId, role] of collaborators) {
    await prisma.projectCollaborator.upsert({
      where: { projectId_userId: { projectId, userId } },
      update: { role },
      create: { projectId, userId, role }
    });
  }

  const endorsements = [
    [ids.users.nusrat, ids.users.arif, "React"],
    [ids.users.rahim, ids.users.arif, "Node.js"],
    [ids.users.arif, ids.users.nusrat, "Web Accessibility"],
    [ids.users.mehzabin, ids.users.nusrat, "React"],
    [ids.users.farhana, ids.users.tanvir, "Python"],
    [ids.users.tanvir, ids.users.farhana, "Pandas"],
    [ids.users.arif, ids.users.rahim, "Authentication"],
    [ids.users.rahim, ids.users.mehzabin, "Product Analytics"]
  ] satisfies Array<[string, string, string]>;

  for (const [endorserId, endorsedId, skillName] of endorsements) {
    const skillId = skillIds.get(skillName);
    if (!skillId) throw new Error(`Endorsement references missing skill "${skillName}"`);

    await prisma.peerEndorsement.upsert({
      where: { endorserId_endorsedId_skillId: { endorserId, endorsedId, skillId } },
      update: {},
      create: { endorserId, endorsedId, skillId }
    });
  }

  await prisma.teamRequest.create({
    data: {
      projectId: ids.projects.skillBridge,
      requesterId: ids.users.arif,
      requiredSkills: ["React", "Node.js", "PostgreSQL", "Docker"]
    }
  }).catch(() => undefined);

  await prisma.projectInvitation.upsert({
    where: { projectId_toUserId: { projectId: ids.projects.skillBridge, toUserId: ids.users.tanvir } },
    update: { fromUserId: ids.users.arif, status: "pending" as InvitationStatus },
    create: { projectId: ids.projects.skillBridge, fromUserId: ids.users.arif, toUserId: ids.users.tanvir, status: "pending" as InvitationStatus }
  });

  const careerFairs = [
    { id: ids.fairs.buet2026, universityId: ids.universities.buet, name: "BUET CSE Industry Connect 2026", eventDate: new Date("2026-06-12"), location: "BUET ECE Building, Dhaka" },
    { id: ids.fairs.du2026, universityId: ids.universities.du, name: "DU Data and Software Career Fair 2026", eventDate: new Date("2026-07-18"), location: "TSC Auditorium, University of Dhaka" }
  ];

  for (const fair of careerFairs) {
    await prisma.careerFair.upsert({
      where: { id: fair.id },
      update: fair,
      create: fair
    });
  }

  const booths = [
    { id: "41000000-0000-4000-8000-000000000001", fairId: ids.fairs.buet2026, companyName: "bKash", requiredSkills: ["Node.js", "PostgreSQL", "Authentication", "Docker"], hiringRoles: ["Backend Intern", "Security Engineering Intern"], boothNumber: "B1" },
    { id: "41000000-0000-4000-8000-000000000002", fairId: ids.fairs.buet2026, companyName: "Pathao", requiredSkills: ["React", "TypeScript", "Product Analytics"], hiringRoles: ["Frontend Intern", "Product Engineering Intern"], boothNumber: "B2" },
    { id: "41000000-0000-4000-8000-000000000003", fairId: ids.fairs.du2026, companyName: "Brain Station 23", requiredSkills: ["Python", "FastAPI", "PostgreSQL", "AWS"], hiringRoles: ["Software Engineer Trainee"], boothNumber: "D1" },
    { id: "41000000-0000-4000-8000-000000000004", fairId: ids.fairs.du2026, companyName: "Chaldal", requiredSkills: ["Data Warehousing", "Pandas", "SQL", "Power BI"], hiringRoles: ["Data Analyst Intern"], boothNumber: "D2" }
  ];

  for (const booth of booths) {
    await prisma.careerFairBooth.upsert({
      where: { id: booth.id },
      update: booth,
      create: booth
    });
  }

  const learningPaths = [
    { id: "50000000-0000-4000-8000-000000000001", studentId: ids.profiles.arif, role: "Full Stack Developer", completionPct: 75, missing: ["Docker", "Authentication"], weeks: 8 },
    { id: "50000000-0000-4000-8000-000000000002", studentId: ids.profiles.nusrat, role: "Frontend Developer", completionPct: 82, missing: ["Unit Testing"], weeks: 3 },
    { id: "50000000-0000-4000-8000-000000000003", studentId: ids.profiles.tanvir, role: "Data Engineer", completionPct: 70, missing: ["Airflow", "dbt"], weeks: 9 },
    { id: "50000000-0000-4000-8000-000000000004", studentId: ids.profiles.farhana, role: "Machine Learning Engineer", completionPct: 68, missing: ["MLOps", "Docker"], weeks: 10 }
  ];

  for (const path of learningPaths) {
    const roleId = roleIds.get(path.role);
    if (!roleId) continue;

    await prisma.studentLearningPath.upsert({
      where: { id: path.id },
      update: {
        studentId: path.studentId,
        roleId,
        completionPct: path.completionPct,
        missingSkillsJson: path.missing,
        roadmapJson: path.missing.map((skillName, index) => ({ skillName, estimatedWeeks: index + 3, objective: `Build Bangladesh demo evidence for ${skillName}` })),
        lastComputedAt: new Date("2026-05-05T10:00:00.000Z"),
        isActive: true
      },
      create: {
        id: path.id,
        studentId: path.studentId,
        roleId,
        completionPct: path.completionPct,
        missingSkillsJson: path.missing,
        roadmapJson: path.missing.map((skillName, index) => ({ skillName, estimatedWeeks: index + 3, objective: `Build Bangladesh demo evidence for ${skillName}` })),
        lastComputedAt: new Date("2026-05-05T10:00:00.000Z"),
        isActive: true
      }
    });
  }

  const mentorships = [
    { id: "51000000-0000-4000-8000-000000000001", studentId: ids.profiles.rahim, alumniId: ids.alumniProfiles.alumnus, skill: "Authentication", status: "active" as MentorshipStatus },
    { id: "51000000-0000-4000-8000-000000000002", studentId: ids.profiles.farhana, alumniId: ids.alumniProfiles.alumna, skill: "MLOps", status: "requested" as MentorshipStatus }
  ];

  for (const mentorship of mentorships) {
    const skillId = skillIds.get(mentorship.skill);
    if (!skillId) continue;

    await prisma.alumniMentorship.upsert({
      where: { id: mentorship.id },
      update: { studentId: mentorship.studentId, alumniId: mentorship.alumniId, skillId, status: mentorship.status, startedAt: mentorship.status === "active" ? new Date("2026-04-20T10:00:00.000Z") : null },
      create: { id: mentorship.id, studentId: mentorship.studentId, alumniId: mentorship.alumniId, skillId, status: mentorship.status, startedAt: mentorship.status === "active" ? new Date("2026-04-20T10:00:00.000Z") : null }
    });
  }

  for (const resource of resources) {
    await prisma.learningResource.upsert({
      where: { url: resource.url },
      update: resource,
      create: resource
    });
  }

  const notifications = [
    { id: "60000000-0000-4000-8000-000000000001", userId: ids.users.arif, type: "INGESTION_COMPLETED", payload: { repositoryCount: 2, skillsFound: 12, message: "Your Bangladesh demo graph is ready." }, isRead: false },
    { id: "60000000-0000-4000-8000-000000000002", userId: ids.users.nusrat, type: "ENDORSEMENT_RECEIVED", payload: { fromUser: "Arif Hasan", skillName: "Web Accessibility" }, isRead: false },
    { id: "60000000-0000-4000-8000-000000000003", userId: ids.users.tanvir, type: "TEAM_INVITE_RECEIVED", payload: { projectName: "SkillBridge Bangladesh", fromUser: "Arif Hasan", requiredSkills: ["React", "PostgreSQL", "Docker"] }, isRead: false }
  ];

  for (const notification of notifications) {
    await prisma.systemNotification.upsert({
      where: { id: notification.id },
      update: notification,
      create: notification
    });
  }

  const decayAudits = [
    { studentId: ids.profiles.arif, skillName: "Kubernetes", currentWeight: 0.35, lastActiveDate: new Date("2025-11-15T10:00:00.000Z"), isDormant: true, decayCycles: 2 },
    { studentId: ids.profiles.nusrat, skillName: "Redux", currentWeight: 0.45, lastActiveDate: new Date("2025-12-10T10:00:00.000Z"), isDormant: true, decayCycles: 1 },
    { studentId: ids.profiles.rahim, skillName: "Frontend", currentWeight: 0.4, lastActiveDate: new Date("2025-10-01T10:00:00.000Z"), isDormant: true, decayCycles: 3 }
  ];

  for (const audit of decayAudits) {
    await prisma.skillDecayAudit.upsert({
      where: { studentId_skillName: { studentId: audit.studentId, skillName: audit.skillName } },
      update: audit,
      create: audit
    });
  }

  const mlRoleId = roleIds.get("Machine Learning Engineer");
  if (mlRoleId) {
    await prisma.simulatedPath.upsert({
      where: { id: "70000000-0000-4000-8000-000000000001" },
      update: {
        studentId: ids.profiles.farhana,
        scenarioName: "Add MLOps and Docker before Pathao interview",
        targetRoleId: mlRoleId,
        hypotheticalSkills: ["MLOps", "Docker"],
        simulatedResult: { completionPercentage: 88, recommendedProject: "Deploy rickshaw-vision as a small API" },
        completionDelta: 20,
        weeksSaved: 6
      },
      create: {
        id: "70000000-0000-4000-8000-000000000001",
        studentId: ids.profiles.farhana,
        scenarioName: "Add MLOps and Docker before Pathao interview",
        targetRoleId: mlRoleId,
        hypotheticalSkills: ["MLOps", "Docker"],
        simulatedResult: { completionPercentage: 88, recommendedProject: "Deploy rickshaw-vision as a small API" },
        completionDelta: 20,
        weeksSaved: 6
      }
    });
  }

  console.log(`Seeded Bangladesh demo data. Login any demo user with password: ${DEMO_PASSWORD}`);
  console.log("Primary demo login: arif.hasan@buet.ac.bd / SkillGraph@123");
  console.log(`Seeded ${universities.length} universities, ${departments.length} departments, ${users.length} students, ${skills.length} skills, ${roles.length} roles, ${repositories.length} repositories.`);
}

main()
  .catch((error) => {
    console.error(error);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
