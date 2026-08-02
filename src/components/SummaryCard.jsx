export default function SummaryCard({ title, amount, detail, currency = true, variant = "", icon = "" }) {
  const value = currency
    ? `Rs. ${Number(amount || 0).toLocaleString("en-IN")}`
    : amount;

  const variantClass = variant ? ` ${variant}-card` : "";

  return (
    <article className={`card metric-card${variantClass}`}>
      {icon && <span className="metric-card-icon">{icon}</span>}
      <h3>{title}</h3>
      <strong>{value}</strong>
      {detail && <p>{detail}</p>}
    </article>
  );
}
