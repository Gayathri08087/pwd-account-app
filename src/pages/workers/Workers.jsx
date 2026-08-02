import { useState } from "react";
import useStore from "../../store/useStore";
import { STORAGE_KEYS } from "../../utils/constants";
import { formatCurrency } from "../../utils/dataFormat";

export default function Workers() {
  const [workers, setWorkers] = useStore(STORAGE_KEYS.WORKERS, []);
  const [form, setForm] = useState({ name: "", salary: "" });

  const addWorker = (event) => {
    event.preventDefault();
    if (!form.name.trim()) return;

    setWorkers([
      ...workers,
      {
        name: form.name.trim(),
        salary: Number(form.salary || 0),
      },
    ]);
    setForm({ name: "", salary: "" });
  };

  return (
    <div className="page">
      <header className="page-header">
        <div>
          <p className="eyebrow">Team</p>
          <h1>Workers</h1>
        </div>
      </header>

      <form className="form-panel" onSubmit={addWorker}>
        <label className="field">
          <span>Worker Name</span>
          <input
            placeholder="Worker name"
            value={form.name}
            onChange={(event) => setForm({ ...form, name: event.target.value })}
          />
        </label>

        <label className="field">
          <span>Salary</span>
          <input
            min="0"
            placeholder="15000"
            type="number"
            value={form.salary}
            onChange={(event) => setForm({ ...form, salary: event.target.value })}
          />
        </label>

        <button type="submit">Add Worker</button>
      </form>

      <section className="record-grid">
        {workers.length === 0 ? (
          <p className="empty-state">No workers have been added yet.</p>
        ) : (
          workers.map((worker, index) => (
            <article key={`${worker.name}-${index}`} className="card record-card">
              <span>Worker</span>
              <h2>{worker.name}</h2>
              <p>{formatCurrency(worker.salary)}</p>
            </article>
          ))
        )}
      </section>
    </div>
  );
}
