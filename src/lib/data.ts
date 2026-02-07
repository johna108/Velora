import type { ImagePlaceholder } from "@/lib/placeholder-images";
import { PlaceHolderImages } from "@/lib/placeholder-images";

export type TeamMember = {
  name: string;
  role: "Founder" | "Team Member";
  avatar: ImagePlaceholder | undefined;
};

export type StartupProfile = {
  name: string;
  industry: string;
  targetMarket: string;
  businessModel: string;
  stage: "Idea" | "MVP" | "Pre-Seed" | "Seed";
  team: TeamMember[];
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

export const teamMembers: TeamMember[] = [
  { name: "Alex Johnson", role: "Founder", avatar: avatar1 },
  { name: "Maria Garcia", role: "Team Member", avatar: avatar2 },
  { name: "Sam Chen", role: "Team Member", avatar: avatar3 },
];

export const startupProfileData: StartupProfile = {
  name: "InnovateAI",
  industry: "Artificial Intelligence",
  targetMarket: "SaaS companies",
  businessModel: "B2B Subscription",
  stage: "MVP",
  team: teamMembers,
};

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
