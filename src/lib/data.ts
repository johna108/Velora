import type { ImagePlaceholder } from "@/lib/placeholder-images";
import { PlaceHolderImages } from "@/lib/placeholder-images";

export type TeamMember = {
  name: string;
  role: "Founder" | "Team Member";
  avatar: ImagePlaceholder | undefined;
};

export type StartupProfile = {
  id: string;
  name: string;
  description: string;
  industry: string;
  targetMarket: string;
  businessModel: string;
  stage: "Idea" | "MVP" | "Pre-Seed" | "Seed";
  team: TeamMember[];
  founderEmail: string;
  problem: string;
  solution: string;
  roadmap: string;
  traction: string;
};

export type Task = {
  id: string;
  title: string;
  status: "Todo" | "In Progress" | "Done";
  assignee?: TeamMember;
  description: string;
};

export type Feedback = {
  id: string;
  type: "Internal" | "External";
  content: string;
  from: string;
  metric: number;
};

export type AnalyticsData = {
  taskCompletion: { month: string; completed: number }[];
  milestones: { total: number; achieved: number };
  feedbackScore: { average: number; count: number };
  tasksByStatus: { todo: number; inProgress: number; done: number };
};

const avatar1 = PlaceHolderImages.find((img) => img.id === "avatar-1");
const avatar2 = PlaceHolderImages.find((img) => img.id === "avatar-2");
const avatar3 = PlaceHolderImages.find((img) => img.id === "avatar-3");
const avatar4 = PlaceHolderImages.find((img) => img.id === "avatar-4");

export const teamMembers: TeamMember[] = [
  { name: "Alex Johnson", role: "Founder", avatar: avatar1 },
  { name: "Maria Garcia", role: "Team Member", avatar: avatar2 },
  { name: "Sam Chen", role: "Team Member", avatar: avatar3 },
];

export const startupProfileData: StartupProfile = {
  id: "innovate-ai",
  name: "InnovateAI",
  industry: "Artificial Intelligence",
  targetMarket: "SaaS companies",
  businessModel: "B2B Subscription",
  stage: "MVP",
  team: teamMembers,
  description: "A unified digital platform that acts as an operational workspace for early-stage founders.",
  founderEmail: "founder@velora.com",
  problem: "Early-stage startups often struggle not because of a lack of ideas, but due to poor execution, unstructured planning, and the absence of data-driven decision-making. Founders rely on a fragmented set of tools, leading to inefficiency and a lack of focus on what truly matters for growth.",
  solution: "InnovateAI is a unified digital platform that acts as an operational workspace for early-stage founders. We help them manage execution, validate ideas, collaborate with their teams, and gain actionable insights to scale efficiently. Our solution is intuitive, scalable, and founder-centric, designed to mirror real-world startup workflows.",
  roadmap: "Our 12-month roadmap includes: Q1: Launch public beta and onboard first 100 startups. Q2: Integrate with popular developer tools like GitHub and Slack. Q3: Introduce advanced collaboration and resource planning features. Q4: Develop a mobile application and expand our AI capabilities.",
  traction: "We are currently at the MVP stage with positive feedback from a small group of beta testers. Key features like task management and feedback collection are live. We have 2 external beta users providing feedback.",
};

export const publicStartups: StartupProfile[] = [
  startupProfileData,
  {
    id: "green-route",
    name: "GreenRoute",
    industry: "Logistics & Sustainability",
    description: "Optimizing delivery routes to reduce carbon emissions for logistics companies.",
    founderEmail: "founder@greenroute.com",
    stage: "Pre-Seed",
    targetMarket: "E-commerce and shipping companies",
    businessModel: "B2B SaaS",
    problem: "Last-mile delivery is a significant contributor to urban pollution. Companies lack easy-to-use tools to plan routes that are both efficient and environmentally friendly.",
    solution: "Our API provides real-time route optimization that prioritizes lower carbon footprints, considering traffic, vehicle type, and delivery density. We make it easy for any company to go green.",
    roadmap: "Q1: Pilot with 5 local businesses. Q2: Develop a dashboard for analytics. Q3: Expand to a new city. Q4: Secure seed funding.",
    traction: "Completed a successful proof-of-concept, reducing fuel consumption by 15% for a local delivery service.",
    team: [
        { name: "Jane Doe", role: "Founder", avatar: avatar2 },
    ]
  },
  {
    id: "health-hub",
    name: "HealthHub",
    industry: "Healthcare",
    description: "A centralized platform for patients to manage their health records from various providers.",
    founderEmail: "founder@healthhub.com",
    stage: "Seed",
    targetMarket: "Individuals and families managing chronic conditions",
    businessModel: "Freemium B2C",
    problem: "Patient health data is fragmented across different hospitals, clinics, and labs, making it difficult for patients and doctors to get a holistic view of health history.",
    solution: "HealthHub securely connects to provider portals and allows users to consolidate all their medical records, lab results, and appointments into a single, easy-to-manage dashboard.",
    roadmap: "Q1: Launch iOS and Android apps. Q2: Integrate with 2 major hospital networks. Q3: Introduce medication reminder features. Q4: Reach 50,000 active users.",
    traction: "10,000 active users on our web platform. Partnership with a major insurance provider.",
     team: [
        { name: "Peter Jones", role: "Founder", avatar: avatar3 },
    ]
  },
   {
    id: "codelabs",
    name: "CodeLabs",
    industry: "EdTech",
    description: "Interactive, project-based coding tutorials for aspiring developers.",
    founderEmail: "founder@codelabs.com",
    stage: "MVP",
    targetMarket: "Students and career-changers",
    businessModel: "Subscription",
    problem: "Traditional coding education is often passive and theoretical, leaving learners unprepared for real-world development challenges.",
    solution: "CodeLabs offers a hands-on learning environment where users build real applications from scratch with guidance from AI-powered mentors and a supportive community.",
    roadmap: "Q1: Add Python and JavaScript courses. Q2: Launch a student community forum. Q3: Partner with universities for curriculum integration. Q4: Introduce a job board.",
    traction: "500 paying subscribers in the first 3 months. 95% course completion rate.",
     team: [
        { name: "Samira Khan", role: "Founder", avatar: avatar4 },
    ]
  }
];

export const tasksData: Task[] = [
  {
    id: "task-1",
    title: "Develop user authentication flow",
    status: "Done",
    assignee: teamMembers[1],
    description: "Implement secure login, signup, and password reset functionalities.",
  },
  {
    id: "task-2",
    title: "Design dashboard UI/UX",
    status: "In Progress",
    assignee: teamMembers[2],
    description: "Create wireframes and mockups for the main user dashboard.",
  },
  {
    id: "task-3",
    title: "Setup production database",
    status: "In Progress",
    assignee: teamMembers[0],
    description: "Configure and deploy a scalable database solution on the cloud.",
  },
  {
    id: "task-4",
    title: "Initial market research",
    status: "Todo",
    description: "Analyze competitors and identify key market opportunities.",
  },
  {
    id: "task-5",
    title: "Create marketing landing page",
    status: "Todo",
    assignee: teamMembers[2],
    description: "Build a high-converting landing page to attract early users.",
  },
  {
    id: "task-6",
    title: "Finalize MVP feature list",
    status: "Done",
    assignee: teamMembers[0],
    description: "Define the core features required for the minimum viable product.",
  },
];

export const feedbackData: Feedback[] = [
    { id: 'fb-1', type: 'Internal', content: 'The new dashboard design looks clean but the font size might be too small on mobile.', from: 'Maria Garcia', metric: 4 },
    { id: 'fb-2', type: 'External', content: 'I love the idea! But it was not immediately clear how to add a new task.', from: 'Beta User #1', metric: 3 },
    { id: 'fb-3', type: 'Internal', content: 'API response time for tasks is a bit slow. We should optimize the query.', from: 'Sam Chen', metric: 4 },
    { id: 'fb-4', type: 'External', content: 'This is exactly what our startup needs. The milestone tracking is a game-changer!', from: 'Beta User #2', metric: 5 },
];


export const analyticsData: AnalyticsData = {
    taskCompletion: [
        { month: 'Jan', completed: 12 },
        { month: 'Feb', completed: 19 },
        { month: 'Mar', completed: 31 },
        { month: 'Apr', completed: 25 },
        { month: 'May', completed: 42 },
        { month: 'Jun', completed: 51 },
    ],
    milestones: { total: 10, achieved: 4 },
    feedbackScore: { average: 4.1, count: feedbackData.length },
    tasksByStatus: { 
        todo: tasksData.filter(t => t.status === 'Todo').length,
        inProgress: tasksData.filter(t => t.status === 'In Progress').length,
        done: tasksData.filter(t => t.status === 'Done').length,
    }
};
