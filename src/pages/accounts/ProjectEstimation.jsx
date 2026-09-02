import { useMemo, useState } from "react";
import useStore from "../../store/useStore";
import { formatCurrency } from "../../utils/dataFormat";
import ConfirmDialog from "../../components/ConfirmDialog";
import { ClipboardList, Wallet, Landmark, Clock } from "lucide-react";

const todayInputDate = () => new Date().toISOString().slice(0, 10);

const PAYMENT_STATUS = {
  RECEIVED: "Received",
  PENDING: "Pending",
  PARTIAL: "Partial",
};

const getPaymentStatus = (spent, estimated, received) => {
  const target = spent > 0 ? spent : estimated;
  if (received <= 0) return PAYMENT_STATUS.PENDING;
  if (received >= target && target > 0) return PAYMENT_STATUS.RECEIVED;
  return PAYMENT_STATUS.PARTIAL;
};

const initialForm = {
  projectName: "",
  description: "",
  startDate: todayInputDate(),
  estimatedCost: "",
  actualExpenditure: "",
  govtPaymentReceived: "",
  govtPaymentDate: "",
  remarks: "",
};

const displayDate = (value) => {
  if (!value) return "-";
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return value;
  return date.toLocaleDateString("en-IN");
};

export default function ProjectEstimation() {
  const [projects, setProjects] = useStore("pwd_project_estimations", []);
  const [form, setForm] = useState(initialForm);
  const [editingIndex, setEditingIndex] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [filterStatus, setFilterStatus] = useState("All");

  // Confirmation dialog state
  const [dialog, setDialog] = useState({ open: false, type: null, payload: null });
  const closeDialog = () => setDialog({ open: false, type: null, payload: null });

  const estimated = Number(form.estimatedCost || 0);
  // actualExpenditure is auto-calculated by WorkManagement; read from stored project when editing
  const spent = editingIndex !== null ? Number(projects[editingIndex]?.actualExpenditure || 0) : 0;
  const received = Number(form.govtPaymentReceived || 0);
  const overUnder = spent - estimated;
  const pendingTarget = spent > 0 ? spent : estimated;
  const pendingFromGovt = Math.max(pendingTarget - received, 0);
  
  const currentStatus = getPaymentStatus(spent, estimated, received);

  const filteredProjects = useMemo(() => {
    let list = projects;
    if (searchQuery.trim()) {
      const q = searchQuery.trim().toLowerCase();
      list = list.filter(
        (p) =>
          (p.projectName || "").toLowerCase().includes(q) ||
          (p.description || "").toLowerCase().includes(q)
      );
    }
    if (filterStatus !== "All") {
      list = list.filter((p) => {
        const pSpent = Number(p.actualExpenditure || 0);
        const pEstimated = Number(p.estimatedCost || 0);
        const pReceived = Number(p.govtPaymentReceived || 0);
        return getPaymentStatus(pSpent, pEstimated, pReceived) === filterStatus;
      });
    }
    return list;
  }, [projects, searchQuery, filterStatus]);

  const totals = useMemo(() => {
    const totalEstimated = projects.reduce((s, p) => s + Number(p.estimatedCost || 0), 0);
    const totalSpent = projects.reduce((s, p) => s + Number(p.actualExpenditure || 0), 0);
    const totalReceived = projects.reduce((s, p) => s + Number(p.govtPaymentReceived || 0), 0);
    const totalPending = projects.reduce((s, p) => {
      const pSpent = Number(p.actualExpenditure || 0);
      const pEstimated = Number(p.estimatedCost || 0);
      const pReceived = Number(p.govtPaymentReceived || 0);
      const pTarget = pSpent > 0 ? pSpent : pEstimated;
      return s + Math.max(pTarget - pReceived, 0);
    }, 0);
    
    let receivedCount = 0;
    let pendingCount = 0;
    let partialCount = 0;
    
    projects.forEach(p => {
      const pSpent = Number(p.actualExpenditure || 0);
      const pEstimated = Number(p.estimatedCost || 0);
      const pReceived = Number(p.govtPaymentReceived || 0);
      const status = getPaymentStatus(pSpent, pEstimated, pReceived);
      if (status === PAYMENT_STATUS.RECEIVED) receivedCount++;
      else if (status === PAYMENT_STATUS.PENDING) pendingCount++;
      else if (status === PAYMENT_STATUS.PARTIAL) partialCount++;
    });
    
    return { totalEstimated, totalSpent, totalReceived, totalPending, receivedCount, pendingCount, partialCount };
  }, [projects]);

  const save = (event) => {
    event.preventDefault();
    if (!form.projectName.trim() || !form.estimatedCost) return;
    // Preserve the actualExpenditure that is auto-managed by WorkManagement.
    // For a new project it starts at 0; for an edit we keep the stored value.
    const existingExpenditure =
      editingIndex !== null ? Number(projects[editingIndex]?.actualExpenditure || 0) : 0;
    const record = {
      ...form,
      projectName: form.projectName.trim(),
      description: form.description.trim(),
      estimatedCost: Number(form.estimatedCost || 0),
      actualExpenditure: existingExpenditure,
      govtPaymentReceived: Number(form.govtPaymentReceived || 0),
      govtPaymentStatus: currentStatus,
    };
    setDialog({ open: true, type: editingIndex === null ? "save" : "update", payload: record });
  };

  const confirmSave = () => {
    const record = dialog.payload;
    if (editingIndex === null) {
      setProjects([...projects, record]);
    } else {
      setProjects(projects.map((item, i) => (i === editingIndex ? record : item)));
      setEditingIndex(null);
    }
    setForm({ ...initialForm, startDate: todayInputDate() });
    closeDialog();
  };

  const editProject = (index) => {
    const record = filteredProjects[index];
    const originalIndex = projects.findIndex((p) => p === record);
    setDialog({ open: true, type: "edit", payload: { record, originalIndex } });
  };

  const confirmEdit = () => {
    const { record, originalIndex } = dialog.payload;
    setForm({
      projectName: record.projectName || "",
      description: record.description || "",
      startDate: record.startDate || todayInputDate(),
      estimatedCost: record.estimatedCost || "",
      actualExpenditure: record.actualExpenditure || "",
      govtPaymentReceived: record.govtPaymentReceived || "",
      govtPaymentDate: record.govtPaymentDate || "",
      remarks: record.remarks || "",
    });
    setEditingIndex(originalIndex);
    closeDialog();
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const deleteProject = (index) => {
    const record = filteredProjects[index];
    const originalIndex = projects.findIndex((p) => p === record);
    setDialog({ open: true, type: "delete", payload: { originalIndex } });
  };

  const confirmDelete = () => {
    const { originalIndex } = dialog.payload;
    setProjects(projects.filter((_, i) => i !== originalIndex));
    if (editingIndex === originalIndex) {
      setForm({ ...initialForm, startDate: todayInputDate() });
      setEditingIndex(null);
    }
    closeDialog();
  };

  const cancelEdit = () => {
    setForm({ ...initialForm, startDate: todayInputDate() });
    setEditingIndex(null);
  };

  const statusClass = (status) => {
    if (status === PAYMENT_STATUS.RECEIVED) return "status-pill paid";
    if (status === PAYMENT_STATUS.PARTIAL) return "status-pill partial";
    return "status-pill pending";
  };

  const dialogProps = {
    save:   { title: "Save Project?",         message: `Save "${dialog.payload?.projectName ?? form.projectName}" as a new project?`,               confirmText: "Save",         variant: "success", onConfirm: confirmSave },
    update: { title: "Save Changes?",         message: `Update "${dialog.payload?.projectName ?? form.projectName}" with the new details?`,             confirmText: "Save Changes", variant: "warning", onConfirm: confirmSave },
    edit:   { title: "Edit Project?",         message: `Load "${dialog.payload?.record?.projectName}" into the form for editing?`,                     confirmText: "Edit",         variant: "warning", onConfirm: confirmEdit },
    delete: { title: "Delete Project?",       message: `This will permanently remove the project. This action cannot be undone.`,                       confirmText: "Delete",       variant: "danger",  onConfirm: confirmDelete },
  }[dialog.type] ?? {};

  return (
    <div className="page">
      <header className="page-header">
        <div>
          <h1>Project Estimation &amp; Payment Tracker</h1>
        </div>
      </header>

      {/* Summary Cards */}
      <section className="stats-grid">
        <article className="card metric-card accent-card">
          <span className="metric-card-icon" style={{ opacity: 0.15 }}><ClipboardList size={32} /></span>
          <h3>Total Estimation</h3>
          <strong>{formatCurrency(totals.totalEstimated)}</strong>
          <p>{projects.length} project{projects.length !== 1 ? "s" : ""} tracked</p>
        </article>
        <article className="card metric-card warning-card">
          <span className="metric-card-icon" style={{ opacity: 0.15 }}><Wallet size={32} /></span>
          <h3>Total Expenditure</h3>
          <strong>{formatCurrency(totals.totalSpent)}</strong>
          <p>
            {totals.totalSpent > totals.totalEstimated
              ? `Over budget by ${formatCurrency(totals.totalSpent - totals.totalEstimated)}`
              : `Under budget by ${formatCurrency(totals.totalEstimated - totals.totalSpent)}`}
          </p>
        </article>
        <article className="card metric-card success-card">
          <span className="metric-card-icon" style={{ opacity: 0.15 }}><Landmark size={32} /></span>
          <h3>Govt. Payment Received</h3>
          <strong>{formatCurrency(totals.totalReceived)}</strong>
          <p>{totals.receivedCount} fully received · {totals.partialCount} partial</p>
        </article>
        <article className="card metric-card danger-card">
          <span className="metric-card-icon" style={{ opacity: 0.15 }}><Clock size={32} /></span>
          <h3>Pending from Govt.</h3>
          <strong>{formatCurrency(totals.totalPending)}</strong>
          <p>{totals.pendingCount} project{totals.pendingCount !== 1 ? "s" : ""} awaiting payment</p>
        </article>
      </section>

      {/* Form */}
      <section className="work-section">
        <div className="section-heading">
          <div>
            <h2>{editingIndex === null ? "Add New Project" : "Edit Project"}</h2>
            <p>Enter project details, expenditure, and government payment status.</p>
          </div>
          <span className={
            currentStatus === PAYMENT_STATUS.RECEIVED
              ? "status-pill paid"
              : currentStatus === PAYMENT_STATUS.PARTIAL
              ? "status-pill partial"
              : "status-pill pending"
          }>
            Govt. Payment: {currentStatus}
          </span>
        </div>

        <form className="form-panel work-register-form" onSubmit={save}>
          <label className="field">
            <span>Project Name</span>
            <input
              placeholder="Road repair - NH47 block 3"
              value={form.projectName}
              onChange={(e) => setForm({ ...form, projectName: e.target.value })}
            />
          </label>

          <label className="field">
            <span>Description</span>
            <input
              placeholder="Short description of the project"
              value={form.description}
              onChange={(e) => setForm({ ...form, description: e.target.value })}
            />
          </label>

          <label className="field">
            <span>Start Date</span>
            <input
              type="date"
              value={form.startDate}
              onChange={(e) => setForm({ ...form, startDate: e.target.value })}
            />
          </label>

          <label className="field">
            <span>Estimated Cost (Rs.)</span>
            <input
              type="number"
              min="0"
              placeholder="e.g. 500000"
              value={form.estimatedCost}
              onChange={(e) => setForm({ ...form, estimatedCost: e.target.value })}
            />
          </label>

          <label className="field calculated-field">
            <span>Actual Expenditure (Rs.) <em style={{ fontWeight: 400, fontSize: "0.78rem", color: "var(--text-secondary)" }}>— auto from Work Management</em></span>
            <input
              readOnly
              value={spent === 0 ? "₹ 0 (no work records yet)" : `₹${spent.toLocaleString("en-IN")}`}
            />
          </label>

          <label className="field calculated-field">
            <span>Over / Under Budget</span>
            <input
              readOnly
              value={
                estimated === 0
                  ? "-"
                  : overUnder > 0
                  ? `Over by ${formatCurrency(overUnder)}`
                  : overUnder < 0
                  ? `Under by ${formatCurrency(Math.abs(overUnder))}`
                  : "On budget"
              }
            />
          </label>



          <label className="field">
            <span>Govt. Amount Received (Rs.)</span>
            <input
              type="number"
              min="0"
              placeholder="e.g. 300000"
              value={form.govtPaymentReceived}
              onChange={(e) => setForm({ ...form, govtPaymentReceived: e.target.value })}
            />
          </label>

          <label className="field calculated-field">
            <span>Pending from Govt. (auto)</span>
            <input
              readOnly
              value={estimated === 0 && spent === 0 ? "-" : formatCurrency(pendingFromGovt)}
            />
          </label>

          <label className="field">
            <span>Govt. Payment Date</span>
            <input
              type="date"
              value={form.govtPaymentDate}
              onChange={(e) => setForm({ ...form, govtPaymentDate: e.target.value })}
            />
          </label>

          <label className="field">
            <span>Remarks</span>
            <input
              placeholder="Any additional notes"
              value={form.remarks}
              onChange={(e) => setForm({ ...form, remarks: e.target.value })}
            />
          </label>

          <div className="button-row">
            <button type="submit">{editingIndex === null ? "Save Project" : "Update Project"}</button>
            {editingIndex !== null && (
              <button type="button" className="secondary-button" onClick={cancelEdit}>
                Cancel
              </button>
            )}
          </div>
        </form>
      </section>

      {/* Filter & Records */}
      <section className="work-section">
        <div className="section-heading">
          <h2>Project Records</h2>
        </div>

        <div className="search-bar" style={{ flexWrap: "wrap", gap: "0.5rem" }}>
          <input
            type="text"
            placeholder="Search by project name or description…"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
          <select
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
            style={{ padding: "0.55rem 0.75rem", borderRadius: "8px", border: "1px solid var(--border)", background: "var(--surface)", color: "var(--text-primary)" }}
          >
            <option value="All">All Statuses</option>
            <option value={PAYMENT_STATUS.PENDING}>Pending</option>
            <option value={PAYMENT_STATUS.PARTIAL}>Partial</option>
            <option value={PAYMENT_STATUS.RECEIVED}>Received</option>
          </select>
          {(searchQuery || filterStatus !== "All") && (
            <button
              type="button"
              className="secondary-button"
              onClick={() => { setSearchQuery(""); setFilterStatus("All"); }}
            >
              Clear Filters
            </button>
          )}
        </div>

        {filteredProjects.length === 0 ? (
          <p className="empty-state">
            {projects.length === 0
              ? "No projects have been added yet. Add your first project above."
              : "No projects match the current filters."}
          </p>
        ) : (
          <div className="record-grid" style={{ marginTop: "1rem" }}>
            {filteredProjects.map((project, index) => {
              const projSpent = Number(project.actualExpenditure || 0);
              const projEstimated = Number(project.estimatedCost || 0);
              const projReceived = Number(project.govtPaymentReceived || 0);
              const projPendingTarget = projSpent > 0 ? projSpent : projEstimated;
              const projPending = Math.max(projPendingTarget - projReceived, 0);
              const diff = projSpent - projEstimated;

              return (
                <article key={`${project.projectName}-${index}`} className="card project-card">
                  <div className="project-card-header">
                    <div>
                      <h2>{project.projectName}</h2>
                      {project.description && <p className="project-desc">{project.description}</p>}
                    </div>
                    <span className={statusClass(getPaymentStatus(projSpent, projEstimated, projReceived))}>
                      {getPaymentStatus(projSpent, projEstimated, projReceived)}
                    </span>
                  </div>

                  <div className="project-card-stats">
                    <div className="project-stat">
                      <span>Estimated</span>
                      <strong>{formatCurrency(projEstimated)}</strong>
                    </div>
                    <div className="project-stat">
                      <span>Spent</span>
                      <strong
                        style={{
                          color: diff > 0 ? "var(--danger, #ef4444)" : diff < 0 ? "var(--success, #22c55e)" : undefined,
                        }}
                      >
                        {formatCurrency(projSpent)}
                      </strong>
                    </div>
                    <div className="project-stat">
                      <span>Govt. Received</span>
                      <strong style={{ color: "var(--success, #22c55e)" }}>
                        {formatCurrency(projReceived)}
                      </strong>
                    </div>
                    <div className="project-stat">
                      <span>Pending from Govt.</span>
                      <strong style={{ color: projPending > 0 ? "var(--warning, #f59e0b)" : undefined }}>
                        {projPending > 0 ? formatCurrency(projPending) : "Nil"}
                      </strong>
                    </div>
                  </div>

                  {diff !== 0 && projEstimated > 0 && (
                    <p
                      className="project-budget-note"
                      style={{ color: diff > 0 ? "var(--danger, #ef4444)" : "var(--success, #22c55e)" }}
                    >
                      {diff > 0
                        ? `⚠ Over budget by ${formatCurrency(Math.abs(diff))}`
                        : `✔ Under budget by ${formatCurrency(Math.abs(diff))}`}
                    </p>
                  )}

                  {project.govtPaymentDate && (
                    <p style={{ fontSize: "0.8rem", color: "var(--text-secondary)", marginTop: "0.25rem" }}>
                      Govt. payment date: {displayDate(project.govtPaymentDate)}
                    </p>
                  )}

                  {project.remarks && (
                    <p style={{ fontSize: "0.8rem", color: "var(--text-secondary)", marginTop: "0.25rem", fontStyle: "italic" }}>
                      {project.remarks}
                    </p>
                  )}

                  <div className="table-actions" style={{ marginTop: "1rem" }}>
                    <button type="button" className="small-button" onClick={() => editProject(index)}>
                      Edit
                    </button>
                    <button
                      type="button"
                      className="small-button danger-button"
                      onClick={() => deleteProject(index)}
                    >
                      Delete
                    </button>
                  </div>
                </article>
              );
            })}
          </div>
        )}
      </section>

      <ConfirmDialog
        open={dialog.open}
        onCancel={closeDialog}
        {...dialogProps}
      />
    </div>
  );
}
