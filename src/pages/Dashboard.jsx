import { Link } from 'react-router-dom'
import { Chart as ChartJS, CategoryScale, LinearScale, PointElement, LineElement, ArcElement, Filler, Tooltip, Legend } from 'chart.js'
import { Line, Doughnut } from 'react-chartjs-2'
import { TrendingUp, TrendingDown, QrCode, Sparkles, BarChart3, ScanLine, Eye, ArrowRight } from 'lucide-react'
import { dashboardStats, scanTrends, deviceBreakdown, locationData, predictiveInsights } from '../data/mockData'
import { useLanguage } from '../context/LanguageContext'
import { useAuth } from '../context/AuthContext'
import { useQR } from '../context/QRContext'

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, ArcElement, Filler, Tooltip, Legend)

const chartOptions = {
  responsive: true,
  maintainAspectRatio: false,
  plugins: {
    legend: {
      position: 'top',
      labels: {
        color: 'rgba(240,240,248,0.6)',
        font: { family: 'Inter', size: 11 },
        boxWidth: 12,
        padding: 16,
      },
    },
    tooltip: {
      backgroundColor: 'rgba(18, 22, 39, 0.95)',
      borderColor: 'rgba(255,255,255,0.08)',
      borderWidth: 1,
      titleFont: { family: 'Inter', weight: '600' },
      bodyFont: { family: 'Inter' },
      padding: 12,
      cornerRadius: 8,
    },
  },
  scales: {
    x: {
      grid: { color: 'rgba(255,255,255,0.03)' },
      ticks: { color: 'rgba(240,240,248,0.4)', font: { family: 'Inter', size: 11 } },
    },
    y: {
      grid: { color: 'rgba(255,255,255,0.03)' },
      ticks: {
        color: 'rgba(240,240,248,0.4)',
        font: { family: 'Inter', size: 11 },
        callback: v => v >= 1000 ? `${v / 1000}k` : v,
      },
    },
  },
}

const doughnutOptions = {
  responsive: true,
  maintainAspectRatio: false,
  cutout: '72%',
  plugins: {
    legend: {
      position: 'right',
      labels: {
        color: 'rgba(240,240,248,0.6)',
        font: { family: 'Inter', size: 11 },
        boxWidth: 10,
        padding: 12,
      },
    },
    tooltip: {
      backgroundColor: 'rgba(18, 22, 39, 0.95)',
      borderColor: 'rgba(255,255,255,0.08)',
      borderWidth: 1,
      padding: 12,
      cornerRadius: 8,
    },
  },
}

const statIcons = [
  { icon: ScanLine, color: 'purple' },
  { icon: QrCode, color: 'teal' },
  { icon: Eye, color: 'pink' },
  { icon: Sparkles, color: 'gold' },
]

const statKeys = ['totalScans', 'activeQRs', 'conversionRate', 'aiGenerations']
export default function Dashboard() {
  const { t } = useLanguage()
  const { currentUser } = useAuth()
  const { qrCodes } = useQR()
  
  const statLabels = [t('totalScans'), t('activeQRs'), t('conversionRate'), t('aiGenerations')]

  return (
    <div className="animate-fade-in">
      <div className="page-header">
        <h1 className="page-title">{t('dashboard')}</h1>
        <p className="page-subtitle">{t('welcome')}, {currentUser?.name || currentUser?.email || 'Guest'}. {t('overview')}</p>
      </div>

      {/* Stats Grid */}
      <div className="stat-grid stagger-children">
        {statKeys.map((key, i) => {
          const stat = { ...dashboardStats[key] }
          if (key === 'activeQRs') {
            stat.value = qrCodes.length
          }
          const StatIcon = statIcons[i].icon
          const color = statIcons[i].color
          const isPositive = stat.change.startsWith('+')
          return (
            <div key={key} className={`glass-card stat-card ${color}`} id={`stat-${key}`}>
              <div className="stat-card-header">
                <span className="stat-card-label">{statLabels[i]}</span>
                <div className={`stat-card-icon ${color}`}>
                  <StatIcon size={18} />
                </div>
              </div>
              <div className="stat-card-value">{stat.value}</div>
              <div className={`stat-card-change ${isPositive ? 'positive' : 'negative'}`}>
                {isPositive ? <TrendingUp size={14} /> : <TrendingDown size={14} />}
                {stat.change} {stat.period}
              </div>
            </div>
          )
        })}
      </div>

      {/* Charts Row */}
      <div className="grid-2 mb-24">
        <div className="glass-card">
          <div className="flex items-center justify-between mb-16">
            <h3 className="section-title" style={{ marginBottom: 0 }}>{t('scanTrends')}</h3>
            <span className="badge badge-purple">{t('twelveMonths')}</span>
          </div>
          <div className="chart-container">
            <Line data={scanTrends} options={chartOptions} />
          </div>
        </div>

        <div className="glass-card">
          <div className="flex items-center justify-between mb-16">
            <h3 className="section-title" style={{ marginBottom: 0 }}>{t('deviceBreakdown')}</h3>
            <span className="badge badge-teal">{t('realTime')}</span>
          </div>
          <div className="chart-container">
            <Doughnut data={deviceBreakdown} options={doughnutOptions} />
          </div>
        </div>
      </div>

      {/* Predictive Insights */}
      <div className="glass-card glass-card-accent mb-24">
        <div className="flex items-center justify-between mb-16">
          <h3 className="section-title" style={{ marginBottom: 0 }}>
            <Sparkles size={18} style={{ color: 'var(--accent-primary)' }} />
            {t('aiPredictiveInsights')}
          </h3>
          <span className="badge badge-pink">{t('poweredByAi')}</span>
        </div>
        <div className="grid-3">
          {predictiveInsights.map((insight, i) => (
            <div key={i} className="glass-card" style={{ background: 'rgba(255,255,255,0.02)' }}>
              <div className="flex items-center justify-between mb-8">
                <span className="text-xs font-mono" style={{ color: 'var(--accent-secondary)' }}>
                  {insight.confidence}% {t('confidence')}
                </span>
              </div>
              <h4 style={{ fontSize: 14, fontWeight: 700, marginBottom: 8 }}>{insight.title}</h4>
              <p className="text-sm" style={{ color: 'var(--text-tertiary)', marginBottom: 12, lineHeight: 1.6 }}>
                {insight.prediction}
              </p>
              <div style={{ fontSize: 12, color: 'var(--accent-primary)', fontWeight: 600 }}>
                {'->'} {insight.action}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Top Locations */}
      <div className="glass-card mb-24">
        <div className="flex items-center justify-between mb-16">
          <h3 className="section-title" style={{ marginBottom: 0 }}>{t('topScanLocations')}</h3>
          <Link to="/analytics" className="btn btn-ghost btn-sm">
            {t('viewAll')} <ArrowRight size={14} />
          </Link>
        </div>
        <div className="table-container">
          <table className="table">
            <thead>
              <tr>
                <th>{t('city')}</th>
                <th>{t('country')}</th>
                <th>{t('totalScans')}</th>
                <th>{t('trend')}</th>
              </tr>
            </thead>
            <tbody>
              {locationData.slice(0, 5).map((loc, i) => (
                <tr key={i}>
                  <td style={{ fontWeight: 600 }}>{loc.city}</td>
                  <td className="text-muted">{loc.country}</td>
                  <td>{loc.scans.toLocaleString()}</td>
                  <td>
                    <span className="stat-card-change positive">
                      <TrendingUp size={12} /> {loc.trend}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="grid-3 stagger-children">
        <Link to="/" className="glass-card feature-card" style={{ textDecoration: 'none', color: 'inherit' }} id="quick-generator">
          <div className="feature-card-icon purple"><Sparkles size={22} /></div>
          <h3>{t('generateQrArt')}</h3>
          <p>{t('generateQrArtDesc')}</p>
        </Link>
        <Link to="/scanner" className="glass-card feature-card" style={{ textDecoration: 'none', color: 'inherit' }} id="quick-scanner">
          <div className="feature-card-icon teal"><ScanLine size={22} /></div>
          <h3>{t('smartScanner')}</h3>
          <p>{t('smartScannerDesc')}</p>
        </Link>
        <Link to="/ab-testing" className="glass-card feature-card" style={{ textDecoration: 'none', color: 'inherit' }} id="quick-abtesting">
          <div className="feature-card-icon pink"><BarChart3 size={22} /></div>
          <h3>{t('abTesting')}</h3>
          <p>{t('abTestingDesc')}</p>
        </Link>
      </div>
    </div>
  )
}
