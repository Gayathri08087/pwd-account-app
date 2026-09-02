import { useMemo, useState } from "react";
import useStore from "../../store/useStore";
import ConfirmDialog from "../../components/ConfirmDialog";
import { STORAGE_KEYS } from "../../utils/constants";
import { calculateTotal, formatCurrency } from "../../utils/dataFormat";
import { Hammer, CheckCircle2, Clock } from "lucide-react";

const todayInputDate = () => new Date().toISOString().slice(0, 10);

const UNITS = ["Nos", "Kg", "Units", "Bag"];

const initialRecord = {
  project: "",
  date: todayInputDate(),
  personName: "",
  material: "",
  quantity: "",
  unit: "Nos",
  amountPerQuantity: "",
  totalAmount: "",
  paidAmount: "",
  paidDate: "",
};

const displayDate = (value) => {
  if (!value) return "-";
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return value;
  return date.toLocaleDateString("en-IN");
};

const normalizeRecord = (record) => {
  const qty = Number(record.quantity || 0);
  const amtPerQty = Number(record.amountPerQuantity || 0);
  const totalAmount = qty > 0 && amtPerQty > 0 ? qty * amtPerQty : Number(record.totalAmount || 0);
  const paidAmount = Math.min(Number(record.paidAmount || 0), totalAmount);
  const remainingAmount = Math.max(totalAmount - paidAmount, 0);
  const isFullyPaid = totalAmount > 0 && remainingAmount === 0;

  return {
    ...record,
    project: record.project.trim(),
    personName: record.personName.trim(),
    material: record.material.trim(),
    unit: record.unit || "Nos",
    quantity: record.quantity,
    amountPerQuantity: amtPerQty,
    totalAmount,
    paidAmount,
    remainingAmount,
    paidDate: isFullyPaid ? record.paidDate || todayInputDate() : "",
  };
};

/**
 * Recalculate each project's actualExpenditure as the sum of all matching work record totalAmounts.
 */
const syncProjectExpenditures = (updatedRecords, projects) =>
  projects.map((project) => {
    const projectName = (project.projectName || "").trim().toLowerCase();
    const spent = updatedRecords.reduce((sum, r) => {
      if ((r.project || "").trim().toLowerCase() === projectName) {
        return sum + Number(r.totalAmount || 0);
      }
      return sum;
    }, 0);
    return { ...project, actualExpenditure: spent };
  });

export default function WorkManagement() {
  const [records, setRecords] = useStore(STORAGE_KEYS.WORK_RECORDS, []);
  const [projects, setProjects] = useStore("pwd_project_estimations", []);
  const [form, setForm] = useState(initialRecord);
  const [editingIndex, setEditingIndex] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [expandedProjects, setExpandedProjects] = useState({});

  // Confirmation dialog state
  const [dialog, setDialog] = useState({ open: false, type: null, payload: null });
  const closeDialog = () => setDialog({ open: false, type: null, payload: null });

  // Derived form amounts
  const qty = Number(form.quantity || 0);
  const amtPerQty = Number(form.amountPerQuantity || 0);
  const computedTotal = qty > 0 && amtPerQty > 0 ? qty * amtPerQty : Number(form.totalAmount || 0);
  const paidAmount = Math.min(Number(form.paidAmount || 0), computedTotal);
  const formRemainingAmount = Math.max(computedTotal - paidAmount, 0);
  const isFormFullyPaid = computedTotal > 0 && formRemainingAmount === 0;

  // Project names list from Project Estimation
  const projectNames = useMemo(
    () => projects.map((p) => (p.projectName || "").trim()).filter(Boolean),
    [projects]
  );

  // Group records by project for folder view
  const groupedRecords = useMemo(() => {
    const q = searchQuery.trim().toLowerCase();
    const filtered = q
      ? records.filter(
          (r) =>
            (r.personName || "").toLowerCase().includes(q) ||
            (r.project || "").toLowerCase().includes(q) ||
            (r.material || "").toLowerCase().includes(q)
        )
      : records;

    const groups = {};
    filtered.forEach((record, idx) => {
      const projKey = (record.project || "Unassigned").trim();
      if (!groups[projKey]) groups[projKey] = [];
      // Store the original index in `records` for edit/delete
      const originalIndex = records.indexOf(record);
      groups[projKey].push({ ...record, _originalIndex: originalIndex });
    });
    return groups;
  }, [records, searchQuery]);

  const totals = useMemo(() => {
    const totalAmount = calculateTotal(records, "totalAmount");
    const paidAmount = calculateTotal(records, "paidAmount");
    const remainingAmount = Math.max(totalAmount - paidAmount, 0);
    return { totalAmount, paidAmount, remainingAmount };
  }, [records]);

  const updateQuantityOrRate = (field, value) => {
    setForm((current) => {
      const next = { ...current, [field]: value };
      const nextQty = Number(next.quantity || 0);
      const nextRate = Number(next.amountPerQuantity || 0);
      if (nextQty > 0 && nextRate > 0) {
        next.totalAmount = String(nextQty * nextRate);
      }
      const newTotal = nextQty > 0 && nextRate > 0 ? nextQty * nextRate : Number(next.totalAmount || 0);
      const boundedPaid = Math.min(Number(next.paidAmount || 0), newTotal);
      const nextRemaining = Math.max(newTotal - boundedPaid, 0);
      const nextFullyPaid = newTotal > 0 && nextRemaining === 0;
      next.paidDate = nextFullyPaid ? current.paidDate || todayInputDate() : "";
      return next;
    });
  };

  const updatePaid = (value) => {
    setForm((current) => {
      const next = { ...current, paidAmount: value };
      const currentTotal = computedTotal;
      const nextPaid = Number(value || 0);
      if (nextPaid > currentTotal) next.paidAmount = String(currentTotal);
      const bounded = Math.min(Number(next.paidAmount || 0), currentTotal);
      const nextRemaining = Math.max(currentTotal - bounded, 0);
      const nextFullyPaid = currentTotal > 0 && nextRemaining === 0;
      next.paidDate = nextFullyPaid ? current.paidDate || todayInputDate() : "";
      return next;
    });
  };

  const toggleProject = (projKey) => {
    setExpandedProjects((prev) => ({ ...prev, [projKey]: !prev[projKey] }));
  };

  const saveRecord = (event) => {
    event.preventDefault();
    if (!form.project.trim() || !form.personName.trim() || !form.material.trim()) return;
    const record = normalizeRecord(form);
    setDialog({ open: true, type: editingIndex === null ? "save" : "update", payload: { record } });
  };

  const syncAndSaveProjects = (updatedRecords) => {
    const updatedProjects = syncProjectExpenditures(updatedRecords, projects);
    setProjects(updatedProjects);
  };

  const confirmSave = () => {
    const { record } = dialog.payload;
    let updatedRecords;
    if (editingIndex === null) {
      updatedRecords = [...records, record];
    } else {
      updatedRecords = records.map((item, index) => (index === editingIndex ? record : item));
      setEditingIndex(null);
    }
    setRecords(updatedRecords);
    syncAndSaveProjects(updatedRecords);
    setForm({ ...initialRecord, date: todayInputDate() });
    closeDialog();
  };

  const editRecord = (originalIndex) => {
    const record = records[originalIndex];
    setDialog({ open: true, type: "edit", payload: { record, originalIndex } });
  };

  const confirmEdit = () => {
    const { record, originalIndex } = dialog.payload;
    setForm({
      project: record.project || "",
      date: record.date || todayInputDate(),
      personName: record.personName || "",
      material: record.material || "",
      quantity: record.quantity || "",
      unit: record.unit || "Nos",
      amountPerQuantity: record.amountPerQuantity || "",
      totalAmount: record.totalAmount || "",
      paidAmount: record.paidAmount || "",
      paidDate: record.paidDate || "",
    });
    setEditingIndex(originalIndex);
    closeDialog();
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const deleteRecord = (originalIndex) => {
    setDialog({ open: true, type: "delete", payload: { originalIndex } });
  };

  const confirmDelete = () => {
    const { originalIndex } = dialog.payload;
    const updatedRecords = records.filter((_, i) => i !== originalIndex);
    setRecords(updatedRecords);
    syncAndSaveProjects(updatedRecords);
    if (editingIndex === originalIndex) {
      setForm({ ...initialRecord, date: todayInputDate() });
      setEditingIndex(null);
    }
    closeDialog();
  };

  const cancelEdit = () => {
    setForm({ ...initialRecord, date: todayInputDate() });
    setEditingIndex(null);
  };

  const fieldStyle = {
    padding: "0.6rem 0.75rem",
    borderRadius: "8px",
    border: "1px solid var(--border)",
    background: "var(--surface)",
    color: "var(--text-primary)",
    fontSize: "0.95rem",
    width: "100%",
  };

  return (
    <div className="page">
      <header className="page-header">
        <div>
          <h1>Work Management</h1>
        </div>
      </header>

      {/* Summary cards */}
      <section className="stats-grid">
        <article className="card metric-card accent-card">
          <span className="metric-card-icon" style={{ opacity: 0.15 }}><Hammer size={32} /></span>
          <h3>Total Amount</h3>
          <strong>{formatCurrency(totals.totalAmount)}</strong>
          <p>{records.length} work record{records.length !== 1 ? "s" : ""}</p>
        </article>
        <article className="card metric-card success-card">
          <span className="metric-card-icon" style={{ opacity: 0.15 }}><CheckCircle2 size={32} /></span>
          <h3>Paid Amount</h3>
          <strong>{formatCurrency(totals.paidAmount)}</strong>
          <p>Collected or paid so far</p>
        </article>
        <article className="card metric-card warning-card">
          <span className="metric-card-icon" style={{ opacity: 0.15 }}><Clock size={32} /></span>
          <h3>Remaining Amount</h3>
          <strong>{formatCurrency(totals.remainingAmount)}</strong>
          <p>{totals.remainingAmount === 0 ? "All records are fully paid" : "Amount still pending"}</p>
        </article>
      </section>

      {/* Form */}
      <section className="work-section">
        <div className="section-heading">
          <div>
            <h2>Material Purchase Register</h2>
            <p>Select a project, enter quantity and amount — total is calculated automatically.</p>
          </div>
          <span className={isFormFullyPaid ? "status-pill paid" : "status-pill pending"}>
            {isFormFullyPaid ? "Fully paid" : `${formatCurrency(formRemainingAmount)} remaining`}
          </span>
        </div>

        {/* Warning if no projects exist */}
        {projectNames.length === 0 && (
          <div
            style={{
              background: "rgba(245,158,11,0.1)",
              border: "1px solid rgba(245,158,11,0.35)",
              borderRadius: "10px",
              padding: "0.85rem 1.1rem",
              marginBottom: "1rem",
              color: "var(--warning, #f59e0b)",
              fontSize: "0.9rem",
              display: "flex",
              alignItems: "center",
              gap: "0.5rem",
            }}
          >
            <span>⚠️</span>
            <span>
              No projects found. Please add a project in{" "}
              <a href="/projects" style={{ color: "inherit", textDecoration: "underline" }}>
                Project Estimation
              </a>{" "}
              first.
            </span>
          </div>
        )}

        <form className="form-panel work-register-form" onSubmit={saveRecord}>
          {/* Project dropdown */}
          <label className="field">
            <span>Project</span>
            {projectNames.length > 0 ? (
              <select
                value={form.project}
                onChange={(e) => setForm({ ...form, project: e.target.value })}
                style={fieldStyle}
              >
                <option value="" disabled>— Select a project —</option>
                {projectNames.map((name) => (
                  <option key={name} value={name}>{name}</option>
                ))}
              </select>
            ) : (
              <input
                placeholder="No projects available — add one in Project Estimation"
                value=""
                disabled
                style={{ ...fieldStyle, opacity: 0.5 }}
              />
            )}
          </label>

          <label className="field">
            <span>Date</span>
            <input
              type="date"
              value={form.date}
              onChange={(e) => setForm({ ...form, date: e.target.value })}
            />
          </label>

          <label className="field">
            <span>Person Name</span>
            <input
              placeholder="Supplier or person name"
              value={form.personName}
              onChange={(e) => setForm({ ...form, personName: e.target.value })}
            />
          </label>

          <label className="field">
            <span>Material</span>
            <input
              placeholder="Cement, steel, paint…"
              value={form.material}
              onChange={(e) => setForm({ ...form, material: e.target.value })}
            />
          </label>

          {/* Quantity + Unit side by side */}
          <label className="field">
            <span>Quantity &amp; Unit</span>
            <div style={{ display: "flex", gap: "0.5rem" }}>
              <input
                type="number"
                min="0"
                placeholder="e.g. 50"
                value={form.quantity}
                onChange={(e) => updateQuantityOrRate("quantity", e.target.value)}
                style={{ flex: 2 }}
              />
              <select
                value={form.unit}
                onChange={(e) => setForm({ ...form, unit: e.target.value })}
                style={{ ...fieldStyle, flex: 1 }}
              >
                {UNITS.map((u) => (
                  <option key={u} value={u}>{u}</option>
                ))}
              </select>
            </div>
          </label>

          <label className="field">
            <span>Amount Per Quantity (Rs.)</span>
            <input
              type="number"
              min="0"
              placeholder="e.g. 5000"
              value={form.amountPerQuantity}
              onChange={(e) => updateQuantityOrRate("amountPerQuantity", e.target.value)}
            />
          </label>

          <label className="field calculated-field">
            <span>Total Amount (auto)</span>
            <input value={formatCurrency(computedTotal)} readOnly />
          </label>

          <label className="field">
            <span>Paid Amount (Rs.)</span>
            <input
              min="0"
              max={computedTotal || undefined}
              placeholder="e.g. 15000"
              type="number"
              value={form.paidAmount}
              onChange={(e) => updatePaid(e.target.value)}
            />
          </label>

          <label className="field calculated-field">
            <span>Remaining Amount (auto)</span>
            <input value={formatCurrency(formRemainingAmount)} readOnly />
          </label>

          <label className="field">
            <span>Complete Paid Date</span>
            <input
              disabled={!isFormFullyPaid}
              type="date"
              value={isFormFullyPaid ? form.paidDate : ""}
              onChange={(e) => setForm({ ...form, paidDate: e.target.value })}
            />
          </label>

          <div className="button-row">
            <button type="submit" disabled={projectNames.length === 0}>
              {editingIndex === null ? "Save Record" : "Update Record"}
            </button>
            {editingIndex !== null && (
              <button type="button" className="secondary-button" onClick={cancelEdit}>
                Cancel
              </button>
            )}
          </div>
        </form>

        {/* Search */}
        <div className="search-bar" style={{ marginTop: "1.5rem" }}>
          <input
            type="text"
            placeholder="Search by project, person or material…"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
          {searchQuery && (
            <button type="button" className="secondary-button" onClick={() => setSearchQuery("")}>
              Clear
            </button>
          )}
        </div>

        {/* Project-folder grouped records */}
        {Object.keys(groupedRecords).length === 0 ? (
          <p className="empty-state" style={{ marginTop: "1.5rem" }}>
            {records.length === 0
              ? "No work records have been added yet."
              : "No records match your search."}
          </p>
        ) : (
          <div style={{ marginTop: "1.5rem", display: "flex", flexDirection: "column", gap: "1rem" }}>
            {Object.entries(groupedRecords).map(([projKey, projRecords]) => {
              const isOpen = expandedProjects[projKey] === true; // default closed
              const projTotal = projRecords.reduce((s, r) => s + Number(r.totalAmount || 0), 0);
              const projPaid = projRecords.reduce((s, r) => s + Number(r.paidAmount || 0), 0);
              const projRemaining = Math.max(projTotal - projPaid, 0);

              return (
                <div key={projKey} className="card" style={{ overflow: "hidden", padding: 0 }}>
                  {/* Folder header */}
                  <button
                    type="button"
                    onClick={() => toggleProject(projKey)}
                    style={{
                      width: "100%",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "space-between",
                      padding: "0.9rem 1.1rem",
                      background: "var(--surface-raised, rgba(255,255,255,0.04))",
                      border: "none",
                      borderBottom: isOpen ? "1px solid var(--border)" : "none",
                      cursor: "pointer",
                      color: "var(--text-primary)",
                      gap: "0.75rem",
                      textAlign: "left",
                    }}
                  >
                    <div style={{ display: "flex", alignItems: "center", gap: "0.6rem", flex: 1, minWidth: 0 }}>
                      <span style={{ fontSize: "1.1rem" }}>{isOpen ? "📂" : "📁"}</span>
                      <div style={{ minWidth: 0 }}>
                        <div style={{ fontWeight: 700, fontSize: "0.95rem", color: "var(--text-primary)", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                          {projKey}
                        </div>
                        <div style={{ fontSize: "0.78rem", color: "var(--text-secondary)", marginTop: "0.1rem" }}>
                          {projRecords.length} record{projRecords.length !== 1 ? "s" : ""}
                          &nbsp;·&nbsp;Total: {formatCurrency(projTotal)}
                          &nbsp;·&nbsp;Paid: {formatCurrency(projPaid)}
                          {projRemaining > 0 && (
                            <span style={{ color: "var(--warning, #f59e0b)" }}>
                              &nbsp;·&nbsp;Pending: {formatCurrency(projRemaining)}
                            </span>
                          )}
                        </div>
                      </div>
                    </div>
                    <span style={{ fontSize: "0.8rem", color: "var(--text-secondary)", flexShrink: 0 }}>
                      {isOpen ? "▲" : "▼"}
                    </span>
                  </button>

                  {/* Records inside the folder */}
                  {isOpen && (
                    <div style={{ padding: "0.75rem 1rem", display: "flex", flexDirection: "column", gap: "0.65rem" }}>
                      {projRecords.map((record, ri) => {
                        const remaining = Number(record.remainingAmount || 0);
                        return (
                          <div
                            key={ri}
                            style={{
                              display: "grid",
                              gridTemplateColumns: "1fr auto",
                              gap: "0.5rem 1rem",
                              padding: "0.7rem 0.85rem",
                              background: "var(--surface-raised, rgba(255,255,255,0.03))",
                              borderRadius: "8px",
                              border: "1px solid var(--border)",
                              alignItems: "center",
                            }}
                          >
                            <div>
                              <div style={{ display: "flex", alignItems: "center", gap: "0.5rem", flexWrap: "wrap" }}>
                                <span style={{ fontWeight: 600, fontSize: "0.9rem" }}>{record.personName}</span>
                                <span style={{ fontSize: "0.78rem", color: "var(--text-secondary)" }}>·</span>
                                <span style={{ fontSize: "0.85rem", color: "var(--text-secondary)" }}>{record.material}</span>
                                {record.quantity && (
                                  <span style={{ fontSize: "0.78rem", color: "var(--text-secondary)" }}>
                                    · {record.quantity} {record.unit || "Nos"}
                                  </span>
                                )}
                                <span
                                  className={remaining > 0 ? "status-pill pending" : "status-pill paid"}
                                  style={{ fontSize: "0.72rem", padding: "0.15rem 0.5rem" }}
                                >
                                  {remaining > 0 ? "Pending" : "Paid"}
                                </span>
                              </div>
                              <div style={{ display: "flex", gap: "1rem", marginTop: "0.35rem", flexWrap: "wrap" }}>
                                <span style={{ fontSize: "0.8rem", color: "var(--text-secondary)" }}>
                                  📅 {displayDate(record.date)}
                                </span>
                                <span style={{ fontSize: "0.8rem" }}>
                                  Total: <strong>{formatCurrency(record.totalAmount)}</strong>
                                </span>
                                <span style={{ fontSize: "0.8rem", color: "var(--success, #22c55e)" }}>
                                  Paid: {formatCurrency(record.paidAmount)}
                                </span>
                                {remaining > 0 && (
                                  <span style={{ fontSize: "0.8rem", color: "var(--warning, #f59e0b)" }}>
                                    Remaining: {formatCurrency(remaining)}
                                  </span>
                                )}
                              </div>
                            </div>
                            <div style={{ display: "flex", flexDirection: "column", gap: "0.35rem", alignItems: "flex-end" }}>
                              <button
                                type="button"
                                className="small-button"
                                onClick={() => editRecord(record._originalIndex)}
                              >
                                Edit
                              </button>
                              <button
                                type="button"
                                className="small-button danger-button"
                                onClick={() => deleteRecord(record._originalIndex)}
                              >
                                Delete
                              </button>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        )}
      </section>

      <ConfirmDialog
        open={dialog.open}
        onCancel={closeDialog}
        {...{
          save:   { title: "Save Record?",   message: `Save this new work record for "${dialog.payload?.record?.project ?? form.project}"?`,      confirmText: "Save",         variant: "success", onConfirm: confirmSave },
          update: { title: "Save Changes?",  message: `Update this record for "${dialog.payload?.record?.project ?? form.project}" with new data?`, confirmText: "Save Changes", variant: "warning", onConfirm: confirmSave },
          edit:   { title: "Edit Record?",   message: `Load the record for "${dialog.payload?.record?.personName}" into the form for editing?`,      confirmText: "Edit",         variant: "warning", onConfirm: confirmEdit },
          delete: { title: "Delete Record?", message: "This will permanently remove the record. This action cannot be undone.",                       confirmText: "Delete",       variant: "danger",  onConfirm: confirmDelete },
        }[dialog.type] ?? {}}
      />
    </div>
  );
}
