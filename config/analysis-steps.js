import { Search, Brain, BarChart4, AlertTriangle } from "lucide-react";

export const analysisSteps = [
  {
    id: "market-research",
    title: "Market Research",
    description: "Analyzing market trends and opportunities",
    icon: Search,
    color: "text-purple-600",
    bgColor: "bg-purple-100 dark:bg-purple-900/20",
    duration: 3000,
  },
  {
    id: "brainstorming",
    title: "Brainstorming",
    description: "Generating growth & monetization strategies",
    icon: Brain,
    color: "text-green-600",
    bgColor: "bg-green-100 dark:bg-green-900/20",
    duration: 2500,
  },
  {
    id: "swot-analysis",
    title: "SWOT Analysis",
    description: "Evaluating strengths, weaknesses, opportunities, threats",
    icon: BarChart4,
    color: "text-blue-600",
    bgColor: "bg-blue-100 dark:bg-blue-900/20",
    duration: 2800,
  },
  {
    id: "risk-assessment",
    title: "Risk Assessment",
    description: "Identifying potential risks and mitigation strategies",
    icon: AlertTriangle,
    color: "text-orange-600",
    bgColor: "bg-orange-100 dark:bg-orange-900/20",
    duration: 2200,
  },
];
