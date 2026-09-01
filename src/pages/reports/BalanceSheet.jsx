import useStore from "../../store/useStore";
import SummaryCard from "../../components/SummaryCard";
import { STORAGE_KEYS } from "../../utils/constants";
import { calculateTotal, formatCurrency } from "../../utils/dataFormat";

export default function BalanceSheet() {
  const [records] = useStore(STORAGE_KEYS.WORK_RECORDS, []);

  const total = calculateTotal(records, "totalAmount");
  const paid = calculateTotal(records, "paidAmount");
  const remaining = Math.max(total - paid, 0);

  return (
    <div className="page">
      <header className="page-header">
        <div>
          <h1>Balance Sheet</h1>
        </div>
      </header>

      <section className="stats-grid">
        <SummaryCard title="Total Work Amount" amount={total} detail={`${records.length} work records`} variant="accent" icon="📋" />
        <SummaryCard title="Paid Amount" amount={paid} detail="Automatically calculated" variant="success" icon="✅" />
        <SummaryCard title="Remaining Amount" amount={remaining} detail={formatCurrency(remaining)} variant="warning" icon="⏳" />
      </section>
    </div>
  );
}
