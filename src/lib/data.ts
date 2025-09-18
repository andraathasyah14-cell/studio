import { type LucideIcon, BarChart3, Code, TrendingUp, Smartphone, Search, Monitor } from 'lucide-react';

export interface Feature {
  icon: LucideIcon;
  title: string;
  description: string;
}

export const features: Feature[] = [
  {
    icon: BarChart3,
    title: "Business Strategy",
    description: "I throw myself down among the tall grass by the stream as lie close to the earth.",
  },
  {
    icon: Code,
    title: "App Development",
    description: "We'll handle everything from in-app development process until it is time to make your project live.",
  },
  {
    icon: TrendingUp,
    title: "Business Strategy",
    description: "We'll help you optimize your business processes to maximize profitability and eliminate unnecessary costs.",
  },
  {
    icon: Smartphone,
    title: "Mobile App",
    description: "Using our expertise in mobile application development to create beautiful pixel-perfect designs.",
  },
  {
    icon: Search,
    title: "SEO Optimisation",
    description: "Your website ranking matters. Our SEO services will help you get to the top of the ranks and stay there!",
  },
  {
    icon: Monitor,
    title: "UX Consulting",
    description: "A UX consultant is responsible for many of the same tasks as a UI designer, but they typically.",
  },
];
