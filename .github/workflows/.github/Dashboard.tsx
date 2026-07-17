import { motion } from "framer-motion";
import { School, Award, Gauge, Activity as ActivityIcon } from "lucide-react";
import { useAuth } from "../context/AuthContext";
import { ProgressRail } from "../components/ui/ProgressRail";
import { StatCard } from "../components/ui/StatCard";
import type { ActivityItem } from "../types";

// Recent activity is sample data until the Scholarship Center and Simulation
// modules (next build phase) start writing real events into Supabase.
const sampleActivity: ActivityItem[] = [
  { id: "1", label: "Compared Lakeside College vs Riverton Institute of Technology", timestamp: "2 hours ago", kind: "simulation" },
  { id: "2", label: "Updated budget plan for State University", timestamp: "Yesterday", kind: "budget" },
  { id: "3", label: "Saved Harborview University to your list", timestamp: "2 days ago", kind: "scholarship" },
];

const activityIcon = {
  budget: Gauge,
  scholarship: Award,
  simulation: ActivityIcon,
  achievement: Award,
};

export default function Dashboard() {
  const { profile } = useAuth();
  const firstName = profile?.full_name?.split(" ")[0] ?? "there";

  return (
    <div className="flex flex-col gap-8">
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.4 }}>
        <h1 className="font-display text-3xl font-semibold text-ink">
          Welcome back, <span className="gradient-text">{firstName}</span>
        </h1>
        <p className="mt-1 text-slate">Here's where your college finance plan stands today.</p>
      </motion.div>

      <ProgressRail level={profile?.level ?? 1} xp={profile?.xp ?? 120} />

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard label="Saved Colleges" value="3" icon={School} accent="horizon" delay={0.05} />
        <StatCard label="Scholarship Progress" value="2 / 6" icon={Award} accent="amber" delay={0.1} />
        <StatCard label="Budget Score" value={`${profile?.budget_score ?? 68}/100`} icon={Gauge} accent="mint" delay={0.15} />
        <StatCard label="Total XP" value={`${profile?.xp ?? 120}`} icon={ActivityIcon} accent="coral" delay={0.2} />
      </div>

      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, delay: 0.25 }}
        className="glass-card p-6"
      >
        <h2 className="font-display text-lg font-semibold text-ink">Recent Activity</h2>
        <div className="mt-4 flex flex-col divide-y divide-ink/5">
          {sampleActivity.map((item) => {
            const Icon = activityIcon[item.kind];
            return (
              <div key={item.id} className="flex items-center gap-3 py-3">
                <div className="flex h-8 w-8 flex-none items-center justify-center rounded-lg bg-horizon/10 text-horizon">
                  <Icon size={15} />
                </div>
                <p className="flex-1 text-sm text-ink-soft">{item.label}</p>
                <p className="text-xs text-slate-light">{item.timestamp}</p>
              </div>
            );
          })}
        </div>
      </motion.div>
    </div>
  );
}
