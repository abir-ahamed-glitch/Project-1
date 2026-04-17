import { Routes, Route, Navigate } from 'react-router-dom'
import { useState } from 'react'
import Sidebar from './components/Sidebar'
import BangladeshFlag from './components/BangladeshFlag'
import LanguageSwitcher from './components/LanguageSwitcher'
import Dashboard from './pages/Dashboard'
import QRArtGenerator from './pages/QRArtGenerator'
import QRManagement from './pages/QRManagement'
import Analytics from './pages/Analytics'
import SmartScanner from './pages/SmartScanner'
import ABTesting from './pages/ABTesting'
import WebAR from './pages/WebAR'
import Compliance from './pages/Compliance'
import { useAuth } from './context/AuthContext'

function App() {
  const [sidebarOpen, setSidebarOpen] = useState(false)

  return (
    <div className="app-layout">
      <Sidebar open={sidebarOpen} onClose={() => setSidebarOpen(false)} />
      
      {sidebarOpen && (
        <div className="sidebar-overlay" onClick={() => setSidebarOpen(false)} />
      )}

      <div className="mobile-header">
        <button className="mobile-menu-btn" onClick={() => setSidebarOpen(true)} id="mobile-menu-toggle">
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <line x1="3" y1="6" x2="21" y2="6" />
            <line x1="3" y1="12" x2="21" y2="12" />
            <line x1="3" y1="18" x2="21" y2="18" />
          </svg>
        </button>
        <span className="sidebar-logo-text">QR For All</span>
        <BangladeshFlag className="mobile-flag" />
        <div style={{ width: 40 }} />
      </div>

      <main className="main-content">
        <header className="main-header">
          <div className="header-spacer" />
          <LanguageSwitcher />
        </header>
        <Routes>
          <Route path="/" element={<QRArtGenerator />} />
          <Route path="/dashboard" element={<Navigate to="/" replace />} />
          <Route path="/generator" element={<Navigate to="/" replace />} />
          <Route path="/management" element={<QRManagement />} />
          <Route path="/overview" element={<Dashboard />} />
          <Route path="/analytics" element={<Analytics />} />
          <Route path="/scanner" element={<SmartScanner />} />
          <Route path="/ab-testing" element={<ABTesting />} />
          <Route path="/webar" element={<WebAR />} />
          <Route path="/compliance" element={<Compliance />} />
        </Routes>
      </main>
    </div>
  )
}

export default App


