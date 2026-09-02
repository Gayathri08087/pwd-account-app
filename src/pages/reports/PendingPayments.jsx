import useStore from "../../store/useStore";
import { STORAGE_KEYS } from "../../utils/constants";
import { formatCurrency } from "../../utils/dataFormat";
import { Folder, PartyPopper } from "lucide-react";

export default function PendingPayments() {
  const [records] = useStore(STORAGE_KEYS.WORK_RECORDS, []);

  // Aggregate: group by (project + personName), sum remainingAmount
  // Each unique (project, personName) pair gets its own row
  const pendingMap = {};
  records.forEach((record) => {
    const remaining = Number(record.remainingAmount || 0);
    if (remaining <= 0) return;
    const key = `${(record.project || "").trim()}|||${(record.personName || "").trim()}`;
    if (!pendingMap[key]) {
      pendingMap[key] = {
        project: (record.project || "—").trim(),
        personName: (record.personName || "—").trim(),
        totalPending: 0,
        recordCount: 0,
        latestDate: "",
      };
    }
    pendingMap[key].totalPending += remaining;
    pendingMap[key].recordCount += 1;
    // Track the most recent date
    if (!pendingMap[key].latestDate || record.date > pendingMap[key].latestDate) {
      pendingMap[key].latestDate = record.date;
    }
  });

  const pendingRows = Object.values(pendingMap).sort((a, b) => {
    // Sort by project name then person name
    if (a.project < b.project) return -1;
    if (a.project > b.project) return 1;
    if (a.personName < b.personName) return -1;
    if (a.personName > b.personName) return 1;
    return 0;
  });

  const grandTotal = pendingRows.reduce((s, r) => s + r.totalPending, 0);

  const displayDate = (value) => {
    if (!value) return "—";
    const date = new Date(value);
    if (Number.isNaN(date.getTime())) return value;
    return date.toLocaleDateString("en-IN");
  };

  return (
    <div className="page">
      <header className="page-header">
        <div>
          <h1>Pending Payments</h1>
        </div>
        {grandTotal > 0 && (
          <span
            style={{
              background: "rgba(239,68,68,0.12)",
              border: "1px solid rgba(239,68,68,0.3)",
              color: "#ef4444",
              borderRadius: "10px",
              padding: "0.4rem 0.9rem",
              fontWeight: 700,
              fontSize: "0.9rem",
              whiteSpace: "nowrap",
            }}
          >
            Total Due: {formatCurrency(grandTotal)}
          </span>
        )}
      </header>

      {pendingRows.length === 0 ? (
        <p className="empty-state"><PartyPopper size={18} style={{ display: 'inline-block', verticalAlign: 'middle', marginRight: '6px' }} /> All work records are fully paid. No pending payments!</p>
      ) : (
        <section style={{ marginTop: "1rem" }}>
          <p style={{ fontSize: "0.85rem", color: "var(--text-secondary)", marginBottom: "0.75rem" }}>
            Showing {pendingRows.length} pending entr{pendingRows.length !== 1 ? "ies" : "y"} across{" "}
            {[...new Set(pendingRows.map((r) => r.project))].length} project
            {[...new Set(pendingRows.map((r) => r.project))].length !== 1 ? "s" : ""}
          </p>

          <div className="table-card">
            <div className="table-scroll">
              <table>
                <thead>
                  <tr>
                    {["Project", "Person Name", "Pending Amount", "No. of Records", "Latest Date"].map((col) => (
                      <th
                        key={col}
                        style={{ textAlign: col === "Pending Amount" ? "right" : "left" }}
                      >
                        {col}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {pendingRows.map((row, idx) => (
                    <tr key={idx}>
                      <td data-label="Project">
                        <span style={{ display: "flex", alignItems: "center", gap: "0.4rem" }}>
                          <span><Folder size={16} /></span>
                          {row.project}
                        </span>
                      </td>
                      <td data-label="Person Name">
                        {row.personName}
                      </td>
                      <td data-label="Pending Amount" style={{ textAlign: "right", color: "var(--warning)", fontWeight: 700, fontSize: "0.95rem" }}>
                        {formatCurrency(row.totalPending)}
                      </td>
                      <td data-label="No. of Records">
                        {row.recordCount} record{row.recordCount !== 1 ? "s" : ""}
                      </td>
                      <td data-label="Latest Date">
                        {displayDate(row.latestDate)}
                      </td>
                    </tr>
                  ))}

                  {/* Grand total footer row */}
                  <tr style={{ borderTop: "2px solid var(--border)", background: "var(--surface-muted)" }}>
                    <td colSpan={2} style={{ fontWeight: 700, color: "var(--text-primary)" }}>
                      Grand Total
                    </td>
                    <td style={{ textAlign: "right", color: "var(--danger)", fontSize: "1rem", fontWeight: 800 }}>
                      {formatCurrency(grandTotal)}
                    </td>
                    <td colSpan={2} />
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </section>
      )}
    </div>
  );
}
