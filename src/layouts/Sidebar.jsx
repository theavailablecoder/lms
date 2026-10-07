import { ChevronLeft, LogOut, Menu } from '../icons/index.js';
import { orangeClassroomLogo } from '../data/navConfig.js';
import CompanyBrand from '../components/shared/CompanyBrand.jsx';

export default function Sidebar({
  title,
  activePage,
  onNavigate,
  groups,
  items,
  onLogout,
  collapsed = false,
  onToggle,
}) {
  return (
    <aside className={`sidebar ${collapsed ? 'sidebarCollapsed' : ''}`}>
      <div className="brand">
        <div className="sidebarLogoOrbit">
          <CompanyBrand compact={collapsed} />
        </div>
        {onToggle && (
          <button
            type="button"
            className="sidebarToggle"
            onClick={onToggle}
            aria-label={collapsed ? 'Expand sidebar' : 'Collapse sidebar'}
            title={collapsed ? 'Expand menu' : 'Close menu'}
          >
            {collapsed ? <Menu size={19} /> : <ChevronLeft size={20} />}
          </button>
        )}
        <span className="srOnly">{title}</span>
      </div>
      <nav>
        {groups ? groups.map((group) => (
          <div className="navGroup" key={group.label || 'footer'}>
            {group.label && <p>{group.label}</p>}
            {group.items.map(({ icon: Icon, label, page }) => (
              <button
                className={`navItem ${activePage === (page || label) ? 'active' : ''}`}
                key={label}
                type="button"
                aria-current={activePage === (page || label) ? 'page' : undefined}
                title={collapsed ? label : undefined}
                onClick={() => onNavigate(page || label)}
              >
                <Icon size={21} />
                <span>{label}</span>
              </button>
            ))}
          </div>
        )) : (
          <div className="navGroup">
            <p>Teacher</p>
            {items.map(({ icon: Icon, label, featured }) => (
              <button
                className={`navItem ${featured ? 'navItemFeatured' : ''} ${activePage === label ? 'active' : ''}`}
                key={label}
                type="button"
                onClick={() => onNavigate(label)}
              >
                <Icon size={21} />
                <span>{label}</span>
              </button>
            ))}
          </div>
        )}
      </nav>
      <button className="logoutButton" type="button" onClick={onLogout}>
        <LogOut size={19} />
        <span>Logout</span>
      </button>
    </aside>
  );
}
