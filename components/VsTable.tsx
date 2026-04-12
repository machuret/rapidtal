const rows = [
  "You hire the talent directly",
  "One-time fee, no ongoing costs",
  "Talent paid fairly (not skimmed)",
  "Specialist marketing & sales focus",
  "300+ applicants sourced per role",
  "You own the relationship",
  "6-month replacement guarantee",
  "Senior, experienced candidates only",
];

export default function VsTable() {
  return (
    <section className="vs-section">
      <div className="vs-header reveal">
        <span className="section-label">— The Honest Comparison</span>
        <h2 className="section-heading">RAPID TAL VS<br /><em>EVERYONE ELSE.</em></h2>
      </div>
      <table className="vs-table reveal">
        <thead>
          <tr>
            <th>What Matters</th>
            <th>RAPID TAL ✦</th>
            <th>Agencies</th>
          </tr>
        </thead>
        <tbody>
          {rows.map((row) => (
            <tr key={row}>
              <td>{row}</td>
              <td>✔</td>
              <td>✘</td>
            </tr>
          ))}
        </tbody>
      </table>
    </section>
  );
}
