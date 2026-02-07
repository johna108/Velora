"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  CreditCard,
  FileText,
  LayoutDashboard,
  ListChecks,
  MessageSquare,
  Sparkles,
  User,
} from "lucide-react";
import { cn } from "@/lib/utils";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "./ui/tooltip";

const navItems = [
  { href: "/dashboard", label: "Dashboard", icon: LayoutDashboard },
  { href: "/dashboard/profile", label: "Profile", icon: User },
  {
    href: "/dashboard/pricing",
    label: "Pricing",
    icon: CreditCard,
  },
  { href: "/dashboard/tasks", label: "Tasks", icon: ListChecks },
  { href: "/dashboard/feedback", label: "Feedback", icon: MessageSquare },
  {
    href: "/dashboard/ai-insights",
    label: "AI Insights",
    icon: Sparkles,
  },
  {
    href: "/dashboard/pitch-generator",
    label: "Pitch Generator",
    icon: FileText,
  },
];

export function DashboardNav({ isMobile = false }: { isMobile?: boolean }) {
  const pathname = usePathname();

  const content = navItems.map((item) => {
    const isActive = pathname === item.href;
    return (
      <Link
        key={item.label}
        href={item.href}
        className={cn(
          "flex items-center gap-3 rounded-lg px-3 py-2 text-muted-foreground transition-all hover:text-primary",
          isActive && "bg-secondary text-primary",
          isMobile && "text-lg"
        )}
      >
        <item.icon className="h-4 w-4" />
        {item.label}
      </Link>
    );
  });

  if (isMobile) {
    return (
      <>
        <Link
          href="/"
          className="group flex items-center gap-2 text-lg font-semibold"
        >
          <svg
            width="32"
            height="32"
            viewBox="0 0 32 32"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            className="h-6 w-6 text-primary"
          >
            <path
              d="M21.3333 2.66699H10.6667C9.95942 2.66699 9.28115 2.94795 8.78105 3.44805C8.28095 3.94815 8 4.62642 8 5.33366V26.667C8 27.3742 8.28095 28.0525 8.78105 28.5526C9.28115 29.0527 9.95942 29.3337 10.6667 29.3337H21.3333C22.0406 29.3337 22.7189 29.0527 23.219 28.5526C23.7191 28.0525 24 27.3742 24 26.667V5.33366C24 4.62642 23.7191 3.94815 23.219 3.44805C22.7189 2.94795 22.0406 2.66699 21.3333 2.66699Z"
              stroke="hsl(var(--primary))"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
            <path
              d="M16 24H16.0133"
              stroke="hsl(var(--primary))"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
            <path
              d="M12 8H20"
              stroke="hsl(var(--primary))"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
          <span className="font-headline">StartupOps</span>
        </Link>
        {content}
      </>
    );
  }

  return (
    <TooltipProvider>
      <div className="flex-1">
        <nav className="grid items-start px-2 text-sm font-medium lg:px-4">
          {content}
        </nav>
      </div>
    </TooltipProvider>
  );
}
