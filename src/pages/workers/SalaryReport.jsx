import useStore from "../../store/useStore";
import SummaryCard from "../../components/SummaryCard";
import Table from "../../components/Table";
import { STORAGE_KEYS } from "../../utils/constants";
import { calculateTotal, formatCurrency } from "../../utils/dataFormat";

export default function SalaryReport() {
  const [workers] = useStore(STORAGE_KEYS.WORKERS, []);
  const totalSalary = calculateTotal(workers, "salary");
  const rows = workers.map((worker) => ({
    ...worker,
    salary: formatCurrency(worker.salary),
  }));

  return (
    <div className="page">
      <header className="page-header">
        <div>
          <p className="eyebrow">Team</p>
          <h1>Salary Report</h1>
        </div>
      </header>

      <section className="stats-grid">
        <SummaryCard title="Workers" amount={workers.length} detail="Total people" currency={false} />
        <SummaryCard title="Salary Total" amount={totalSalary} detail="Current payroll" />
      </section>

      <Table columns={["name", "salary"]} data={rows} emptyMessage="No salary records available." />
    </div>
  );
}
