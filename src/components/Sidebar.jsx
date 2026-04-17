import { NavLink, Link } from 'react-router-dom'
import {
  LayoutDashboard, Sparkles, QrCode, BarChart3,
  ScanLine, FlaskConical, Box, ShieldCheck, Settings, Palette,
  LogOut, User as UserIcon
} from 'lucide-react'
import { useTheme } from '../context/ThemeContext'
import { useLanguage } from '../context/LanguageContext'
import { useAuth } from '../context/AuthContext'
import BangladeshFlag from './BangladeshFlag'

const navItems = [
  { section: 'main' },
  { to: '/', icon: Sparkles, key: 'aiArtGenerator', badge: 'AI' },
  { to: '/management', icon: QrCode, key: 'qrManagement' },
  { section: 'intelligence' },
  { to: '/overview', icon: LayoutDashboard, key: 'dashboard' },
  { to: '/analytics', icon: BarChart3, key: 'analytics' },
  { to: '/scanner', icon: ScanLine, key: 'smartScanner', badge: 'ML' },
  { to: '/ab-testing', icon: FlaskConical, key: 'abTesting' },
  { section: 'advanced' },
  { to: '/webar', icon: Box, key: 'webarExperience' },
  { to: '/compliance', icon: ShieldCheck, key: 'compliance' },
]

export default function Sidebar({ open, onClose }) {
  const { activeTheme, setActiveTheme, themes } = useTheme()
  const { t } = useLanguage()
  const { currentUser, logout } = useAuth()

  return (
    <aside className={`sidebar ${open ? 'open' : ''}`} id="main-sidebar">
      <div className="sidebar-header">
        <Link to="/" className="sidebar-logo" onClick={onClose}>
          <div className="sidebar-logo-icon">
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5" strokeLinecap="round">
              <rect x="3" y="3" width="7" height="7" rx="1" />
              <rect x="14" y="3" width="7" height="7" rx="1" />
              <rect x="3" y="14" width="7" height="7" rx="1" />
              <circle cx="17.5" cy="17.5" r="3" />
            </svg>
          </div>
          <span className="sidebar-logo-text">QR For All</span>
          <BangladeshFlag />
        </Link>
      </div>

      <nav className="sidebar-nav">
        {navItems.map((item, i) => {
          if (item.section) {
            return <div key={i} className="nav-section-label">{t(item.section)}</div>
          }
          const Icon = item.icon
          return (
            <NavLink
              key={item.to}
              to={item.to}
              end={item.to === '/'}
              className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`}
              onClick={onClose}
              id={`nav-${item.to.slice(1)}`}
            >
              <Icon size={18} className="nav-link-icon" />
              <span>{t(item.key)}</span>
              {item.badge && <span className="nav-link-badge">{item.badge}</span>}
            </NavLink>
          )
        })}

        <div className="nav-section-label" style={{ marginTop: 8, display: 'flex', alignItems: 'center', gap: 6 }}>
          <Palette size={12} /> {t('appTheme')}
        </div>
        <div style={{ 
          display: 'flex', 
          flexWrap: 'wrap',
          gap: 10, 
          padding: '8px 12px 16px', 
        }} className="theme-grid">
          {themes.map(theme => (
            <button
              key={theme.id}
              title={theme.name}
              onClick={() => setActiveTheme(theme.id)}
              style={{
                width: 24,
                height: 24,
                borderRadius: '50%',
                backgroundColor: theme.color,
                border: activeTheme === theme.id ? '2px solid white' : '2px solid transparent',
                outline: activeTheme === theme.id ? `2px solid ${theme.color}` : 'none',
                cursor: 'pointer',
                flexShrink: 0,
                transition: 'all 0.2s ease',
                boxShadow: activeTheme === theme.id ? `0 0 10px ${theme.color}80` : 'none',
              }}
            />
          ))}
        </div>
      </nav>



    </aside>
  )
}
