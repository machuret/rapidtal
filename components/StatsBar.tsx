const stats = [
  { num: "18", label: "Days avg. to hire" },
  { num: "94%", label: "Retention rate" },
  { num: "300+", label: "Applicants sourced per role" },
  { num: "6-Mo", label: "Replacement guarantee" },
];

export default function StatsBar() {
  return (
    <div className="stats-bar">
      {stats.map((s) => (
        <div className="stat-item" key={s.label}>
          <span className="stat-num">{s.num}</span>
          <span className="stat-label">{s.label}</span>
        </div>
      ))}
    </div>
  );
}
