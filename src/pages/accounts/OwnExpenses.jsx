import { useState } from "react";
import useStore from "../../store/useStore";
import ConfirmDialog from "../../components/ConfirmDialog";
import { formatCurrency } from "../../utils/dataFormat";

const todayDate = () => new Date().toISOString().slice(0, 10);

const initialForm = {
  item: "",
  amount: "",
  date: todayDate(),
};

export default function HomeExpense() {
  const [expenses, setExpenses] = useStore("home", []);
  const [form, setForm] = useState(initialForm);
  const [dialog, setDialog] = useState({ open: false, payload: null });

  const save = (event) => {
    event.preventDefault();
    if (!form.item.trim() || !form.amount) return;
    setDialog({
      open: true,
      payload: { item: form.item.trim(), amount: Number(form.amount), date: form.date },
    });
  };

  const confirmSave = () => {
    setExpenses([...expenses, dialog.payload]);
    setForm(initialForm);
    setDialog({ open: false, payload: null });
  };

  return (
    <div className="page">
      <header className="page-header">
        <div>
          <p className="eyebrow">Personal</p>
          <h1>Own Expenses</h1>
        </div>
      </header>

      <form className="form-panel" onSubmit={save}>
        <label className="field">
          <span>Date</span>
          <input
            type="date"
            value={form.date}
            onChange={(event) => setForm({ ...form, date: event.target.value })}
          />
        </label>

        <label className="field">
          <span>Expense Item</span>
          <input
            placeholder="Electricity bill"
            value={form.item}
            onChange={(event) => setForm({ ...form, item: event.target.value })}
          />
        </label>

        <label className="field">
          <span>Amount</span>
          <input
            min="0"
            placeholder="3000"
            type="number"
            value={form.amount}
            onChange={(event) => setForm({ ...form, amount: event.target.value })}
          />
        </label>

        <button type="submit">Save Expense</button>
      </form>

      <section className="record-grid">
        {expenses.length === 0 ? (
          <p className="empty-state">No own expenses have been saved yet.</p>
        ) : (
          expenses.map((expense, index) => (
            <article key={`${expense.item}-${index}`} className="card record-card">
              <span>{expense.date ?? ""}</span>
              <h2>{expense.item}</h2>
              <p>{formatCurrency(expense.amount)}</p>
            </article>
          ))
        )}
      </section>

      <ConfirmDialog
        open={dialog.open}
        title="Save Expense?"
        message={`Save "${dialog.payload?.item}" for ${formatCurrency(dialog.payload?.amount ?? 0)}?`}
        confirmText="Save"
        variant="success"
        onConfirm={confirmSave}
        onCancel={() => setDialog({ open: false, payload: null })}
      />
    </div>
  );
}
