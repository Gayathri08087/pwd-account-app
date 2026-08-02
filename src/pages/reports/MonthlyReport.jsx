import { useMemo } from "react";
import useStore from "../../store/useStore";
import SummaryCard from "../../components/SummaryCard";
import Table from "../../components/Table";
import { STORAGE_KEYS } from "../../utils/constants";
import { calculateTotal, formatCurrency } from "../../utils/dataFormat";

const monthKey = (value) => {
  if (!value) return "No date";

  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return value;

  return date.toLocaleDateString("en-IN", {
    month: "short",
    year: "numeric",
  });
};

export default function MonthlyReport() {
  const [records] = useStore(STORAGE_KEYS.WORK_RECORDS, []);

  const reportRows = useMemo(() => {
    const monthlyTotals = records.reduce((acc, record) => {
      const key = monthKey(record.date);
      const current = acc[key] || {
        month: key,
        entries: 0,
        totalAmount: 0,
        paidAmount: 0,
        remainingAmount: 0,
      };

      current.entries += 1;
      current.totalAmount += Number(record.totalAmount || 0);
      current.paidAmount += Number(record.paidAmount || 0);
      current.remainingAmount += Number(record.remainingAmount || 0);

      acc[key] = current;
      return acc;
    }, {});

    return Object.values(monthlyTotals).map((row) => ({
      ...row,
      totalAmount: formatCurrency(row.totalAmount),
      paidAmount: formatCurrency(row.paidAmount),
      remainingAmount: row.remainingAmount > 0 ? formatCurrency(row.remainingAmount) : "Paid",
    }));
  }, [records]);

  const total = calculateTotal(records, "totalAmount");
  const paid = calculateTotal(records, "paidAmount");
  const remaining = Math.max(total - paid, 0);

  return (
    <div className="page">
      <header className="page-header">
        <div>
          <p className="eyebrow">Reports</p>
          <h1>Monthly Report</h1>
        </div>
      </header>

      <section className="stats-grid">
        <SummaryCard title="Work Total" amount={total} detail={`${records.length} records`} variant="accent" icon="📋" />
        <SummaryCard title="Paid" amount={paid} detail="Auto-calculated" variant="success" icon="✅" />
        <SummaryCard title="Remaining" amount={remaining} detail="Auto-calculated balance" variant="warning" icon="⏳" />
      </section>

      <Table
        columns={["month", "entries", "totalAmount", "paidAmount", "remainingAmount"]}
        data={reportRows}
        emptyMessage="No work records are available for monthly reporting."
      />
    </div>
  );
}
