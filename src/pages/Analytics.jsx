import { useState } from 'react'
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, PointElement, LineElement, ArcElement, Filler, Tooltip, Legend } from 'chart.js'
import { Bar, Line, Doughnut } from 'react-chartjs-2'
import { BarChart3, TrendingUp, MapPin, Brain, ThumbsUp, ThumbsDown, Minus, Sparkles } from 'lucide-react'
import { locationData, hourlyHeatmap, sentimentData, predictiveInsights, scanTrends } from '../data/mockData'

import { useLanguage } from '../context/LanguageContext'

ChartJS.register(CategoryScale, LinearScale, BarElement, PointElement, LineElement, ArcElement, Filler, Tooltip, Legend)

const chartDefaults = {
  responsive: true,
  maintainAspectRatio: false,
  plugins: {
    legend: {
      labels: { color: 'rgba(240,240,248,0.5)', font: { family: 'Inter', size: 11 }, boxWidth: 10, padding: 12 },
    },
    tooltip: {
      backgroundColor: 'rgba(18, 22, 39, 0.95)',
      borderColor: 'rgba(255,255,255,0.08)',
      borderWidth: 1,
      padding: 12,
      cornerRadius: 8,
    },
  },
  scales: {
    x: { grid: { color: 'rgba(255,255,255,0.03)' }, ticks: { color: 'rgba(240,240,248,0.4)', font: { size: 11 } } },
    y: { grid: { color: 'rgba(255,255,255,0.03)' }, ticks: { color: 'rgba(240,240,248,0.4)', font: { size: 11 } } },
  },
}

export default function Analytics() {
  const { t } = useLanguage()
  const [timeRange, setTimeRange] = useState('12m')

  return (
    <div className="animate-fade-in">
      <div className="page-header">
        <div className="flex items-center justify-between flex-col-mobile gap-16">
          <div>
            <h1 className="page-title">
              <BarChart3 size={28} style={{ color: 'var(--accent-primary)', display: 'inline', verticalAlign: 'middle', marginRight: 8 }} />
              {t('intelligentAnalytics')}
            </h1>
            <p className="page-subtitle">{t('analyticsSubtitle')}</p>
          </div>
          <div className="tabs" style={{ marginBottom: 0 }}>
            {['7d', '30d', '12m', 'All'].map(r => (
              <button key={r} className={`tab ${timeRange === r ? 'active' : ''}`} onClick={() => setTimeRange(r)}>
                {r}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Scan Trend & Device */}
      <div className="grid-2 mb-24">
        <div className="glass-card">
          <h3 className="section-title mb-16">{t('scanVolumeTime')}</h3>
          <div className="chart-container">
            <Line data={scanTrends} options={chartDefaults} />
          </div>
        </div>
        <div className="glass-card">
          <h3 className="section-title mb-16">{t('hourlyActivity')}</h3>
          <div className="chart-container">
            <Bar data={hourlyHeatmap} options={{
              ...chartDefaults,
              plugins: { ...chartDefaults.plugins, legend: { ...chartDefaults.plugins.legend, position: 'top' } },
            }} />
          </div>
        </div>
      </div>

      {/* Sentiment Analysis */}
      <div className="glass-card glass-card-accent mb-24">
        <div className="flex items-center justify-between mb-16">
          <h3 className="section-title" style={{ marginBottom: 0 }}>
            <Brain size={18} style={{ color: 'var(--accent-primary)' }} />
            {t('sentimentAnalysis')}
          </h3>
          <span className="badge badge-pink">{t('poweredByAi')}</span>
        </div>

        <div className="grid-2 flex-col-mobile" style={{ gap: 32 }}>
          <div>
            {/* Sentiment bars */}
            <div className="flex flex-col gap-16">
              <div>
                <div className="flex items-center justify-between mb-8">
                  <span className="flex items-center gap-8 text-sm">
                    <ThumbsUp size={14} style={{ color: 'var(--accent-success)' }} /> {t('positive')}
                  </span>
                  <span className="font-mono text-sm" style={{ color: 'var(--accent-success)' }}>
                    {sentimentData.positive}%
                  </span>
                </div>
                <div className="progress-bar">
                  <div className="progress-bar-fill teal" style={{ width: `${sentimentData.positive}%` }} />
                </div>
              </div>
              <div>
                <div className="flex items-center justify-between mb-8">
                  <span className="flex items-center gap-8 text-sm">
                    <Minus size={14} style={{ color: 'var(--accent-warning)' }} /> {t('neutral')}
                  </span>
                  <span className="font-mono text-sm" style={{ color: 'var(--accent-warning)' }}>
                    {sentimentData.neutral}%
                  </span>
                </div>
                <div className="progress-bar">
                  <div className="progress-bar-fill" style={{ width: `${sentimentData.neutral}%`, background: 'var(--gradient-warm)' }} />
                </div>
              </div>
              <div>
                <div className="flex items-center justify-between mb-8">
                  <span className="flex items-center gap-8 text-sm">
                    <ThumbsDown size={14} style={{ color: 'var(--accent-danger)' }} /> {t('negative')}
                  </span>
                  <span className="font-mono text-sm" style={{ color: 'var(--accent-danger)' }}>
                    {sentimentData.negative}%
                  </span>
                </div>
                <div className="progress-bar">
                  <div className="progress-bar-fill pink" style={{ width: `${sentimentData.negative}%` }} />
                </div>
              </div>
            </div>
          </div>

          <div className="flex flex-col gap-12">
            {sentimentData.insights.map((insight, i) => (
              <div key={i} className="glass-card" style={{
                padding: '12px 16px',
                background: insight.type === 'positive' ? 'rgba(0,184,148,0.05)' :
                  insight.type === 'negative' ? 'rgba(225,112,85,0.05)' : 'rgba(255,255,255,0.02)',
                border: `1px solid ${insight.type === 'positive' ? 'rgba(0,184,148,0.15)' :
                  insight.type === 'negative' ? 'rgba(225,112,85,0.15)' : 'var(--border-glass)'}`,
              }}>
                <span className="text-sm" style={{ lineHeight: 1.5 }}>{insight.text}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Location & Predictions */}
      <div className="grid-2 mb-24">
        <div className="glass-card">
          <h3 className="section-title mb-16">
            <MapPin size={16} style={{ color: 'var(--accent-secondary)' }} />
            {t('optimalLocations')}
          </h3>
          <div className="table-container">
            <table className="table">
              <thead>
                <tr>
                  <th>#</th>
                  <th>{t('city')}</th>
                  <th>{t('scans')}</th>
                  <th>{t('growth')}</th>
                </tr>
              </thead>
              <tbody>
                {locationData.map((loc, i) => (
                  <tr key={i}>
                    <td className="text-muted">{i + 1}</td>
                    <td>
                      <span style={{ fontWeight: 600 }}>{loc.city}</span>
                      <span className="text-muted">, {loc.country}</span>
                    </td>
                    <td className="font-mono">{loc.scans.toLocaleString()}</td>
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

        <div className="glass-card">
          <h3 className="section-title mb-16">
            <Sparkles size={16} style={{ color: 'var(--accent-primary)' }} />
            {t('aiPredictiveInsights')}
          </h3>
          <div className="flex flex-col gap-16">
            {predictiveInsights.map((insight, i) => (
              <div key={i} className="glass-card" style={{ padding: 16, background: 'rgba(255,255,255,0.02)' }}>
                <div className="flex items-center justify-between mb-8">
                  <span style={{ fontWeight: 700, fontSize: 14 }}>{insight.title}</span>
                  <span className="badge badge-teal">{insight.confidence}%</span>
                </div>
                <p className="text-sm" style={{ color: 'var(--text-tertiary)', lineHeight: 1.6 }}>
                  {insight.prediction}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
