import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Check, MapPin } from "lucide-react";
import { sampleColleges } from "../data/colleges";

const currency = (n: number) =>
  n.toLocaleString("en-US", { style: "currency", currency: "USD", maximumFractionDigits: 0 });

const rows: { key: keyof typeof sampleColleges[number]; label: string; format?: (n: number) => string }[] = [
  { key: "tuition", label: "Tuition", format: currency },
  { key: "housing", label: "Housing", format: currency },
  { key: "meal_plan", label: "Meal Plan", format: currency },
  { key: "books", label: "Books", format: currency },
  { key: "transportation", label: "Transportation", format: currency },
  { key: "graduation_rate", label: "Graduation Rate", format: (n) => `${n}%` },
  { key: "average_salary", label: "Avg. Starting Salary", format: currency },
  { key: "average_debt", label: "Avg. Student Debt", format: currency },
];

export default function CollegeComparison() {
  const [selected, setSelected] = useState<string[]>([sampleColleges[0].id, sampleColleges[1].id]);

  const toggle = (id: string) => {
    setSelected((prev) =>
      prev.includes(id) ? prev.filter((s) => s !== id) : prev.length >= 4 ? prev : [...prev, id]
    );
  };

  const selectedColleges = sampleColleges.filter((c) => selected.includes(c.id));

  return (
    <div className="flex flex-col gap-8">
      <div>
        <h1 className="font-display text-3xl font-semibold text-ink">Compare Colleges</h1>
        <p className="mt-1 text-slate">
          Select up to 4 schools to see how they stack up side by side.
        </p>
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {sampleColleges.map((college, i) => {
          const isSelected = selected.includes(college.id);
          return (
            <motion.button
              key={college.id}
              onClick={() => toggle(college.id)}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: i * 0.04 }}
              className={`glass-card relative p-5 text-left transition-transform hover:-translate-y-0.5 ${
                isSelected ? "ring-2 ring-horizon" : ""
              }`}
            >
              {isSelected && (
                <div className="gradient-ring absolute right-4 top-4 flex h-6 w-6 items-center justify-center rounded-full text-white">
                  <Check size={14} />
                </div>
              )}
              <div
                className="mb-3 flex h-10 w-10 items-center justify-center rounded-xl font-display font-semibold text-white"
                style={{ backgroundColor: college.logo_color }}
              >
                {college.name[0]}
              </div>
              <h3 className="font-display text-base font-semibold text-ink">{college.name}</h3>
              <p className="mt-0.5 flex items-center gap-1 text-xs text-slate-light">
                <MapPin size={12} /> {college.location}
              </p>
              <p className="mt-3 font-mono text-lg font-semibold text-horizon">
                {currency(college.tuition)}
                <span className="ml-1 text-xs font-normal text-slate-light">/ yr tuition</span>
              </p>
            </motion.button>
          );
        })}
      </div>

      <AnimatePresence>
        {selectedColleges.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            className="glass-card overflow-x-auto p-6"
          >
            <h2 className="mb-4 font-display text-lg font-semibold text-ink">Side-by-side</h2>
            <table className="w-full min-w-[560px] border-collapse text-sm">
              <thead>
                <tr>
                  <th className="w-40 pb-3 text-left text-xs font-medium uppercase tracking-wide text-slate-light">
                    Metric
                  </th>
                  {selectedColleges.map((c) => (
                    <th key={c.id} className="pb-3 text-left font-display font-semibold text-ink">
                      {c.name}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-ink/5">
                {rows.map((row) => (
                  <tr key={row.key}>
                    <td className="py-3 text-slate-light">{row.label}</td>
                    {selectedColleges.map((c) => (
                      <td key={c.id} className="py-3 font-mono text-ink-soft">
                        {row.format ? row.format(c[row.key] as number) : c[row.key]}
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
