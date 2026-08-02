import { useState } from "react";
import useStore from "../../store/useStore";
import { formatCurrency } from "../../utils/dataFormat";

const initialForm = {
  project: "",
  amount: "",
};

export default function Income() {
  const [income, setIncome] = useStore("income", []);
  const [form, setForm] = useState(initialForm);

  const save = (event) => {
    event.preventDefault();
    if (!form.project.trim() || !form.amount) return;

    setIncome([
      ...income,
      {
        project: form.project.trim(),
        amount: Number(form.amount),
      },
    ]);
    setForm(initialForm);
  };

  return (
    <div className="page">
      <header className="page-header">
        <div>
          <p className="eyebrow">Accounts</p>
          <h1>Add Income</h1>
        </div>
      </header>

      <form className="form-panel" onSubmit={save}>
        <label className="field">
          <span>Project</span>
          <input
            placeholder="Project name"
            value={form.project}
            onChange={(event) => setForm({ ...form, project: event.target.value })}
          />
        </label>

        <label className="field">
          <span>Amount</span>
          <input
            min="0"
            placeholder="50000"
            type="number"
            value={form.amount}
            onChange={(event) => setForm({ ...form, amount: event.target.value })}
          />
        </label>

        <button type="submit">Save Income</button>
      </form>

      <section className="record-grid">
        {income.length === 0 ? (
          <p className="empty-state">No income has been saved yet.</p>
        ) : (
          income.map((entry, index) => (
            <article key={`${entry.project}-${index}`} className="card record-card">
              <span>Income</span>
              <h2>{entry.project}</h2>
              <p>{formatCurrency(entry.amount)}</p>
            </article>
          ))
        )}
      </section>
    </div>
  );
}
