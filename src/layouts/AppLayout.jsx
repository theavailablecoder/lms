import Header from './Header.jsx';
import Footer from './Footer.jsx';
import Sidebar from './Sidebar.jsx';

export default function AppLayout({
  shellClass,
  dashboardClass = '',
  sidebarProps,
  headerProps,
  children,
}) {
  return (
    <main className={`appShell websiteRefresh ${shellClass}`}>
      <div className={`dashboard ${dashboardClass}`}>
        <Sidebar {...sidebarProps} />
        <section className="content">
          <Header {...headerProps} />
          {children}
          <Footer />
        </section>
      </div>
    </main>
  );
}
