export default function Header({ title, subtitle, actions }) {
  return (
    <header className="topbar">
      <div>
        <h1>{title}</h1>
        <p>{subtitle}</p>
      </div>
      <div className="headerActions">{actions}</div>
    </header>
  );
}
