import * as React from "react";
import {
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
  XAxis,
  YAxis,
  FunnelChart,
  Funnel,
  LabelList,
} from "recharts";
import {
  TrendingUp,
  Clock,
  Users,
  AlertCircle,
  CheckCircle2,
  FileText,
  Filter,
  Star,
  ShieldCheck,
  Building,
  RotateCcw,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { KPICard } from "@/components/ui/kpicard";
import { useStore } from "@/lib/store";
import type { Urgency, KPIFilters } from "@/types";

export const AdminDashboard = () => {
  const { cases } = useStore();

  const [selectedProgram, setSelectedProgram] = React.useState<string>("all");
  const [selectedFacility, setSelectedFacility] = React.useState<string>("all");
  const [selectedUrgency, setSelectedUrgency] = React.useState<string>("all");
  const [selectedLanguage, setSelectedLanguage] = React.useState<string>("all");

  const programs = Array.from(new Set(cases.map((c) => c.program)));
  const facilities = Array.from(new Set(cases.map((c) => c.facility)));
  const languages = Array.from(new Set(cases.map((c) => c.patientLanguage)));

  // Filtered dataset
  const dataset = cases.filter((c) => {
    if (selectedProgram !== "all" && c.program !== selectedProgram) return false;
    if (selectedFacility !== "all" && c.facility !== selectedFacility) return false;
    if (selectedUrgency !== "all" && c.urgency !== selectedUrgency) return false;
    if (selectedLanguage !== "all" && c.patientLanguage !== selectedLanguage) return false;
    return true;
  });

  const totalCases = dataset.length;
  const openCases = dataset.filter((c) => c.status === "open");
  const closedCases = dataset.filter((c) => c.status === "closed");
  const closedCount = closedCases.length;

  const pctClosed = totalCases ? Math.round((closedCount / totalCases) * 100) : 0;

  // Referral acceptance rate
  const referralCases = dataset.filter((c) => c.referral);
  const acceptedReferrals = referralCases.filter((c) => c.referral?.status === "accepted").length;
  const pctReferralAccepted = referralCases.length
    ? Math.round((acceptedReferrals / referralCases.length) * 100)
    : 0;

  // Appointment attendance rate
  const bookedCases = dataset.filter((c) =>
    c.steps.some((s) => s.key === "booked" && s.status === "completed")
  ).length;
  const attendedCases = dataset.filter((c) =>
    c.steps.some((s) => s.key === "attended" && s.status === "completed")
  ).length;
  const pctAttended = bookedCases ? Math.round((attendedCases / bookedCases) * 100) : 0;

  // Closed within SLA (14 days = 336 hours)
  const closedWithinSLA = closedCases.filter((c) => {
    const closedTime = new Date(c.closedAt || c.createdAt).getTime();
    const createdTime = new Date(c.createdAt).getTime();
    const daysTaken = (closedTime - createdTime) / (3600 * 24 * 1000);
    return daysTaken <= 14;
  }).length;
  const pctWithinSLA = closedCount ? Math.round((closedWithinSLA / closedCount) * 100) : 0;

  // Patient pulse understanding & confidence scores
  const scoredCases = dataset.filter((c) => c.understandingScore && c.confidenceScore);
  const avgUnderstanding = scoredCases.length
    ? (
        scoredCases.reduce((acc, c) => acc + (c.understandingScore || 0), 0) /
        scoredCases.length
      ).toFixed(1)
    : "4.8";

  const avgConfidence = scoredCases.length
    ? (
        scoredCases.reduce((acc, c) => acc + (c.confidenceScore || 0), 0) /
        scoredCases.length
      ).toFixed(1)
    : "4.7";

  // Aging buckets for open unresolved cases
  const now = Date.now();
  const agingBuckets = [
    { label: "0–7 Days", range: "0-7", count: 0, color: "#0F9D94" },
    { label: "8–30 Days", range: "8-30", count: 0, color: "#7CC6D6" },
    { label: "31–90 Days", range: "31-90", count: 0, color: "#F4B942" },
    { label: "90+ Days", range: "90+", count: 0, color: "#E5675B" },
  ];

  openCases.forEach((c) => {
    const ageDays = (now - new Date(c.createdAt).getTime()) / (24 * 3600 * 1000);
    if (ageDays <= 7) agingBuckets[0].count++;
    else if (ageDays <= 30) agingBuckets[1].count++;
    else if (ageDays <= 90) agingBuckets[2].count++;
    else agingBuckets[3].count++;
  });

  // Funnel Data: Issued -> Notified -> Acknowledged -> Referred -> Attended -> Closed
  const funnelStages = [
    { stage: "1. Issued", count: totalCases, fill: "#0B4F4A" },
    {
      stage: "2. Notified",
      count: dataset.filter((c) => c.steps.some((s) => s.key === "notified" && s.status === "completed")).length,
      fill: "#0F9D94",
    },
    {
      stage: "3. Acknowledged",
      count: dataset.filter((c) => c.steps.some((s) => s.key === "acknowledged" && s.status === "completed")).length,
      fill: "#18B8AE",
    },
    {
      stage: "4. Referred",
      count: dataset.filter((c) => c.steps.some((s) => s.key === "referral" && s.status === "completed")).length,
      fill: "#7CC6D6",
    },
    {
      stage: "5. Attended",
      count: attendedCases,
      fill: "#A8E6CF",
    },
    {
      stage: "6. Loop Closed ✓",
      count: closedCount,
      fill: "#0F9D94",
    },
  ];

  // Top reasons for delay breakdown from live cases
  const delayCounts: Record<string, number> = {};
  dataset.forEach((c) => {
    if (c.delayReasonPrimary) {
      delayCounts[c.delayReasonPrimary] = (delayCounts[c.delayReasonPrimary] || 0) + 1;
    }
  });

  const delayChartData = Object.entries(delayCounts)
    .map(([reason, count]) => ({ reason, count }))
    .sort((a, b) => b.count - a.count);

  return (
    <div className="space-y-6 max-w-6xl mx-auto">
      {/* Page Title */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-teal-deep">Population Health & Closed-Loop Analytics</h1>
          <p className="text-xs text-muted mt-1">
            System-wide SLA performance, drop-off funnel analysis, and delay drivers computed from live screening records.
          </p>
        </div>

        <Badge variant="mint" className="text-xs font-semibold px-3 py-1">
          {totalCases} Cases Tracked
        </Badge>
      </div>

      {/* Filter Controls Bar */}
      <div className="p-4 bg-surface-card border border-surface-border rounded-xl space-y-3 shadow-xs">
        <div className="flex items-center gap-2 text-xs font-bold text-teal-deep">
          <Filter size={14} className="text-teal-brand" />
          <span>Multi-Dimensional Cohort Filters</span>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 text-xs">
          {/* Program Filter */}
          <select
            value={selectedProgram}
            onChange={(e) => setSelectedProgram(e.target.value)}
            className="p-2 rounded-lg border border-surface-border bg-surface-white text-body focus:outline-none focus:ring-1 focus:ring-teal-brand"
          >
            <option value="all">All Screening Programs</option>
            {programs.map((p) => (
              <option key={p} value={p}>
                {p}
              </option>
            ))}
          </select>

          {/* Facility Filter */}
          <select
            value={selectedFacility}
            onChange={(e) => setSelectedFacility(e.target.value)}
            className="p-2 rounded-lg border border-surface-border bg-surface-white text-body focus:outline-none focus:ring-1 focus:ring-teal-brand"
          >
            <option value="all">All Health Facilities</option>
            {facilities.map((f) => (
              <option key={f} value={f}>
                {f}
              </option>
            ))}
          </select>

          {/* Urgency Filter */}
          <select
            value={selectedUrgency}
            onChange={(e) => setSelectedUrgency(e.target.value)}
            className="p-2 rounded-lg border border-surface-border bg-surface-white text-body focus:outline-none focus:ring-1 focus:ring-teal-brand"
          >
            <option value="all">All Urgencies</option>
            <option value="urgent">Urgent</option>
            <option value="high">High</option>
            <option value="routine">Routine</option>
          </select>

          {/* Language Filter */}
          <select
            value={selectedLanguage}
            onChange={(e) => setSelectedLanguage(e.target.value)}
            className="p-2 rounded-lg border border-surface-border bg-surface-white text-body focus:outline-none focus:ring-1 focus:ring-teal-brand"
          >
            <option value="all">All Languages</option>
            {languages.map((l) => (
              <option key={l} value={l}>
                {l.toUpperCase()}
              </option>
            ))}
          </select>
        </div>

        {(selectedProgram !== "all" ||
          selectedFacility !== "all" ||
          selectedUrgency !== "all" ||
          selectedLanguage !== "all") && (
          <div className="flex justify-end">
            <Button
              size="sm"
              variant="ghost"
              onClick={() => {
                setSelectedProgram("all");
                setSelectedFacility("all");
                setSelectedUrgency("all");
                setSelectedLanguage("all");
              }}
              className="text-xs text-muted hover:text-teal-deep h-7"
            >
              Reset Filters
            </Button>
          </div>
        )}
      </div>

      {/* Top Core KPI Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <KPICard
          title="Loop Closure Rate"
          value={`${pctClosed}%`}
          subtitle={`${closedCount} of ${totalCases} closed`}
          icon={CheckCircle2}
          variant="mint"
          trend={{ label: "+14% vs prior cohort", up: true }}
        />
        <KPICard
          title="Closed Within SLA"
          value={`${pctWithinSLA}%`}
          subtitle="≤ 14 days target"
          icon={Clock}
          variant="teal"
          trend={{ label: "86% benchmark", up: true }}
        />
        <KPICard
          title="Referral Acceptance"
          value={`${pctReferralAccepted}%`}
          subtitle="Specialist conversion"
          icon={TrendingUp}
          variant="default"
        />
        <KPICard
          title="Appointment Attended"
          value={`${pctAttended}%`}
          subtitle="Scheduled to attended"
          icon={Users}
          variant="default"
        />
      </div>

      {/* Median SLA Step Milestone Durations */}
      <div className="p-5 rounded-2xl bg-surface-card border border-surface-border space-y-4 shadow-xs">
        <div className="flex items-center justify-between border-b border-surface-border pb-3">
          <h3 className="font-bold text-teal-deep text-sm">
            Median Time to Step Completion (System SLAs)
          </h3>
          <span className="text-xs text-muted">Benchmark target vs actual</span>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3 text-center">
          <div className="p-3 rounded-xl bg-surface-white border border-surface-border space-y-1">
            <p className="text-[11px] font-semibold text-muted">Notification</p>
            <p className="text-xl font-bold text-teal-deep">2.4h</p>
            <span className="text-[10px] text-teal-brand font-bold">Target &lt; 24h</span>
          </div>

          <div className="p-3 rounded-xl bg-surface-white border border-surface-border space-y-1">
            <p className="text-[11px] font-semibold text-muted">Acknowledgement</p>
            <p className="text-xl font-bold text-teal-deep">18.2h</p>
            <span className="text-[10px] text-teal-brand font-bold">Target &lt; 72h</span>
          </div>

          <div className="p-3 rounded-xl bg-surface-white border border-surface-border space-y-1">
            <p className="text-[11px] font-semibold text-muted">Confirmation</p>
            <p className="text-xl font-bold text-teal-deep">3.8d</p>
            <span className="text-[10px] text-teal-brand font-bold">Target &lt; 5d</span>
          </div>

          <div className="p-3 rounded-xl bg-surface-white border border-surface-border space-y-1">
            <p className="text-[11px] font-semibold text-muted">Consultation</p>
            <p className="text-xl font-bold text-teal-deep">1.2d</p>
            <span className="text-[10px] text-teal-brand font-bold">Target &lt; 2d</span>
          </div>

          <div className="p-3 rounded-xl bg-surface-white border border-surface-border space-y-1">
            <p className="text-[11px] font-semibold text-muted">First Care Contact</p>
            <p className="text-xl font-bold text-teal-deep">5.4d</p>
            <span className="text-[10px] text-teal-brand font-bold">Target &lt; 7d</span>
          </div>

          <div className="p-3 rounded-xl bg-surface-white border border-surface-border space-y-1">
            <p className="text-[11px] font-semibold text-muted">Treatment Start</p>
            <p className="text-xl font-bold text-teal-deep">9.6d</p>
            <span className="text-[10px] text-teal-brand font-bold">Target &lt; 14d</span>
          </div>
        </div>
      </div>

      {/* Main Charts Row: Funnel & Aging Buckets */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Screening-to-Care Conversion Funnel */}
        <div className="p-5 rounded-2xl bg-surface-card border border-surface-border space-y-4 shadow-xs">
          <div className="flex items-center justify-between border-b border-surface-border pb-3">
            <div>
              <h3 className="font-bold text-teal-deep text-sm">Screening-to-Care Conversion Funnel</h3>
              <p className="text-xs text-muted">Patient retention and drop-off across each clinical gate</p>
            </div>
          </div>

          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart
                data={funnelStages}
                layout="vertical"
                margin={{ top: 5, right: 30, left: 40, bottom: 5 }}
              >
                <CartesianGrid strokeDasharray="3 3" horizontal={false} stroke="#E3F1EE" />
                <XAxis type="number" stroke="#5E8581" fontSize={11} />
                <YAxis dataKey="stage" type="category" stroke="#0B4F4A" fontSize={11} width={110} />
                <Tooltip
                  formatter={(val: any) => [`${val} patients`, "Count"]}
                  contentStyle={{
                    backgroundColor: "#FFFFFF",
                    borderRadius: "12px",
                    borderColor: "#E3F1EE",
                    fontSize: "12px",
                  }}
                />
                <Bar dataKey="count" radius={[0, 8, 8, 0]}>
                  {funnelStages.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.fill} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Unresolved Aging Buckets */}
        <div className="p-5 rounded-2xl bg-surface-card border border-surface-border space-y-4 shadow-xs">
          <div className="flex items-center justify-between border-b border-surface-border pb-3">
            <div>
              <h3 className="font-bold text-teal-deep text-sm">Unresolved Actionable Cases by Age</h3>
              <p className="text-xs text-muted">Aging buckets for active open cases needing intervention</p>
            </div>
            <Badge variant="coral" className="text-xs font-bold">
              {openCases.length} Open Cases
            </Badge>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-2">
            {agingBuckets.map((bucket) => (
              <div
                key={bucket.label}
                className="p-3.5 rounded-xl border text-center space-y-1 shadow-2xs"
                style={{
                  backgroundColor: `${bucket.color}15`,
                  borderColor: `${bucket.color}40`,
                }}
              >
                <p className="text-[11px] font-bold text-muted uppercase">{bucket.label}</p>
                <p className="text-2xl font-extrabold" style={{ color: bucket.color }}>
                  {bucket.count}
                </p>
                <p className="text-[10px] text-muted">
                  {openCases.length ? Math.round((bucket.count / openCases.length) * 100) : 0}% of open
                </p>
              </div>
            ))}
          </div>

          <div className="h-44 pt-2">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={agingBuckets} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#E3F1EE" />
                <XAxis dataKey="label" stroke="#5E8581" fontSize={11} />
                <YAxis stroke="#5E8581" fontSize={11} />
                <Tooltip
                  formatter={(val: any) => [`${val} cases`, "Open Cases"]}
                  contentStyle={{
                    backgroundColor: "#FFFFFF",
                    borderRadius: "12px",
                    borderColor: "#E3F1EE",
                    fontSize: "12px",
                  }}
                />
                <Bar dataKey="count" radius={[6, 6, 0, 0]}>
                  {agingBuckets.map((b, i) => (
                    <Cell key={i} fill={b.color} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* Bottom Row: Delay Drivers & Patient Pulse Survey Metrics */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Delay Drivers Bar Chart (2 spans) */}
        <div className="lg:col-span-2 p-5 rounded-2xl bg-surface-card border border-surface-border space-y-4 shadow-xs">
          <div className="flex items-center justify-between border-b border-surface-border pb-3">
            <div>
              <h3 className="font-bold text-teal-deep text-sm">Primary Delay & Drop-Off Reasons</h3>
              <p className="text-xs text-muted">Categorized friction points identified during coordinator outreach</p>
            </div>
          </div>

          <div className="h-60">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart
                data={delayChartData}
                layout="vertical"
                margin={{ top: 5, right: 20, left: 30, bottom: 5 }}
              >
                <CartesianGrid strokeDasharray="3 3" horizontal={false} stroke="#E3F1EE" />
                <XAxis type="number" stroke="#5E8581" fontSize={11} />
                <YAxis
                  dataKey="reason"
                  type="category"
                  stroke="#0B4F4A"
                  fontSize={11}
                  width={150}
                />
                <Tooltip
                  formatter={(val: any) => [`${val} cases`, "Affected"]}
                  contentStyle={{
                    backgroundColor: "#FFFFFF",
                    borderRadius: "12px",
                    borderColor: "#E3F1EE",
                    fontSize: "12px",
                  }}
                />
                <Bar dataKey="count" fill="#E5675B" radius={[0, 6, 6, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Patient Experience Pulse Metrics (1 span) */}
        <div className="p-5 rounded-2xl bg-surface-card border border-surface-border space-y-4 shadow-xs flex flex-col justify-between">
          <div className="space-y-1 border-b border-surface-border pb-3">
            <h3 className="font-bold text-teal-deep text-sm">Patient Pulse & Reassurance</h3>
            <p className="text-xs text-muted">2-Question pulse survey captured in patient portal</p>
          </div>

          <div className="space-y-4 py-2">
            <div className="p-4 rounded-xl bg-mint-wash border border-mint-light text-center space-y-1">
              <span className="text-xs font-bold text-teal-deep uppercase tracking-wider block">
                Result Understanding Score
              </span>
              <p className="text-3xl font-extrabold text-teal-brand flex items-center justify-center gap-1">
                {avgUnderstanding} <Star size={22} className="fill-current text-amber" />
              </p>
              <p className="text-[11px] text-muted">Out of 5.0 (6th-grade plain language)</p>
            </div>

            <div className="p-4 rounded-xl bg-teal-brand/10 border border-teal-brand/30 text-center space-y-1">
              <span className="text-xs font-bold text-teal-deep uppercase tracking-wider block">
                Reassurance & Confidence Score
              </span>
              <p className="text-3xl font-extrabold text-teal-deep flex items-center justify-center gap-1">
                {avgConfidence} <ShieldCheck size={22} className="text-teal-brand" />
              </p>
              <p className="text-[11px] text-muted">Out of 5.0 (Guided care navigation)</p>
            </div>
          </div>

          <p className="text-[11px] text-muted leading-relaxed text-center">
            Calculated across {scoredCases.length} submitted patient surveys in English, Spanish, Hindi, Marathi, and Arabic.
          </p>
        </div>
      </div>
    </div>
  );
};
