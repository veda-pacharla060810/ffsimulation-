import { useMemo, useState } from "react";
import { motion } from "framer-motion";
import { sampleColleges } from "../data/colleges";
import { StatCard } from "../components/ui/StatCard";
import { Wallet, TrendingDown, TrendingUp, PiggyBank } from "lucide-react";

const currency = (n: number) =>
  n.toLocaleString("en-US", { style: "currency", currency: "USD", maximumFractionDigits: 0 });

function NumberField({
  label,
  value,
  onChange,
  hint,
}: {
  label: string;
  value: number;
  onChange: (n: number) => void;
  hint?: string;
}) {
  return (
    <div>
      <label className="mb-1 block text-sm font-medium text-slate">{label}</label>
      <div className="flex items-center overflow-hidden rounded-xl border border-ink/10 bg-white/80 focus-within:border-horizon">
        <span className="pl-3.5 text-sm text-slate-light">$</span>
        <input
          type="number"
          min={0}
          value={value}
          onChange={(e) => onChange(Number(e.target.value) || 0)}
          className="w-full bg-transparent px-2 py-2.5 font-mono text-sm text-ink outline-none"
        />
      </div>
      {hint && <p className="mt-1 text-xs text-slate-light">{hint}</p>}
    </div>
  );
}

export default function BudgetPlanner() {
  const [collegeId, setCollegeId] = useState(sampleColleges[0].id);
  const college = sampleColleges.find((c) => c.id === collegeId)!;

  const [housing, setHousing] = useState(college.housing);
  const [mealPlan, setMealPlan] = useState(college.meal_plan);
  const [transportation, setTransportation] = useState(college.transportation);
  const [partTimeIncome, setPartTimeIncome] = useState(400);
  const [scholarships, setScholarships] = useState(3000);
  const [savings, setSavings] = useState(2000);
  const [parentContribution, setParentContribution] = useState(4000);
  const [federalLoans, setFederalLoans] = useState(5500);
  const [privateLoans, setPrivateLoans] = useState(0);

  const handleCollegeChange = (id: string) => {
    const next = sampleColleges.find((c) => c.id === id)!;
    setCollegeId(id);
    setHousing(next.housing);
    setMealPlan(next.meal_plan);
    setTransportation(next.transportation);
  };

  const result = useMemo(() => {
    const yearlyCost = college.tuition + housing + mealPlan + college.books + transportation;
    const yearlyPartTimeIncome = partTimeIncome * 12;
    const totalFunding =
      yearlyPartTimeIncome + scholarships + savings + parentContribution + federalLoans + privateLoans;
    const remainingBalance = yearlyCost - totalFunding;
    const totalDebt = federalLoans + privateLoans;
    const monthlyBudget = yearlyCost / 12;

    return { yearlyCost, totalFunding, remainingBalance, totalDebt, monthlyBudget };
  }, [college, housing, mealPlan, transportation, partTimeIncome, scholarships, savings, parentContribution, federalLoans, privateLoans]);

  return (
    <div className="flex flex-col gap-8">
      <div>
        <h1 className="font-display text-3xl font-semibold text-ink">College Budget Planner</h1>
        <p className="mt-1 text-slate">Adjust any field — your totals update instantly.</p>
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-[1.2fr,1fr]">
        <div className="glass-card flex flex-col gap-5 p-6">
          <div>
            <label className="mb-1 block text-sm font-medium text-slate">College</label>
            <select
              value={collegeId}
              onChange={(e) => handleCollegeChange(e.target.value)}
              className="w-full rounded-xl border border-ink/10 bg-white/80 px-3.5 py-2.5 text-sm text-ink outline-none focus:border-horizon"
            >
              {sampleColleges.map((c) => (
                <option key={c.id} value={c.id}>
                  {c.name} — {c.location}
                </option>
              ))}
            </select>
          </div>

          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <NumberField label="Housing (yearly)" value={housing} onChange={setHousing} />
            <NumberField label="Meal Plan (yearly)" value={mealPlan} onChange={setMealPlan} />
            <NumberField label="Transportation (yearly)" value={transportation} onChange={setTransportation} />
            <NumberField label="Part-time Income (monthly)" value={partTimeIncome} onChange={setPartTimeIncome} />
            <NumberField label="Scholarships (yearly)" value={scholarships} onChange={setScholarships} />
            <NumberField label="Savings Contribution" value={savings} onChange={setSavings} />
            <NumberField label="Parent Contribution (yearly)" value={parentContribution} onChange={setParentContribution} />
            <NumberField label="Federal Loans" value={federalLoans} onChange={setFederalLoans} hint="Subsidized + unsubsidized" />
            <NumberField label="Private Loans" value={privateLoans} onChange={setPrivateLoans} />
          </div>
        </div>

        <div className="flex flex-col gap-4">
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="glass-card p-6"
          >
            <p className="text-xs font-medium uppercase tracking-wide text-slate-light">Yearly Cost of Attendance</p>
            <p className="mt-1 font-mono text-3xl font-semibold text-ink">{currency(result.yearlyCost)}</p>
            <p className="mt-1 text-xs text-slate-light">
              Tuition {currency(college.tuition)} + Housing {currency(housing)} + Meals {currency(mealPlan)} + Books{" "}
              {currency(college.books)} + Transport {currency(transportation)}
            </p>
          </motion.div>

          <div className="grid grid-cols-2 gap-4">
            <StatCard label="Monthly Budget" value={currency(result.monthlyBudget)} icon={Wallet} accent="horizon" />
            <StatCard label="Total Debt" value={currency(result.totalDebt)} icon={TrendingDown} accent="coral" />
          </div>

          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className={`glass-card p-6 ${result.remainingBalance > 0 ? "" : ""}`}
          >
            <div className="flex items-center gap-2">
              {result.remainingBalance > 0 ? (
                <TrendingDown size={18} className="text-coral" />
              ) : (
                <TrendingUp size={18} className="text-mint" />
              )}
              <p className="text-xs font-medium uppercase tracking-wide text-slate-light">
                {result.remainingBalance > 0 ? "Remaining Balance (Gap)" : "Surplus"}
              </p>
            </div>
            <p
              className={`mt-1 font-mono text-3xl font-semibold ${
                result.remainingBalance > 0 ? "text-coral" : "text-mint"
              }`}
            >
              {currency(Math.abs(result.remainingBalance))}
            </p>
            <p className="mt-1 text-xs text-slate-light">
              {result.remainingBalance > 0
                ? "This much isn't yet covered by income, savings, scholarships or loans."
                : "Your funding covers the full cost of attendance, with some left over."}
            </p>
          </motion.div>

          <div className="glass-card flex items-center gap-3 p-5">
            <div className="flex h-10 w-10 flex-none items-center justify-center rounded-xl bg-mint/10 text-mint">
              <PiggyBank size={18} />
            </div>
            <div>
              <p className="text-xs font-medium uppercase tracking-wide text-slate-light">Total Funding Sources</p>
              <p className="font-mono text-lg font-semibold text-ink">{currency(result.totalFunding)}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
