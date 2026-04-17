import { useState } from 'react'
import { FlaskConical, TrendingUp, TrendingDown, Clock, CheckCircle2, AlertCircle, BarChart, Sparkles, Plus } from 'lucide-react'
import { abTests } from '../data/mockData'

import { useLanguage } from '../context/LanguageContext'

export default function ABTesting() {
  const { t } = useLanguage()
  const [activeTab, setActiveTab] = useState('running')

  const filteredTests = abTests.filter(test => test.status === activeTab)

  return (
    <div className="animate-fade-in">
      <div className="page-header">
        <h1 className="page-title">
          <FlaskConical size={28} style={{ color: 'var(--accent-tertiary)', display: 'inline', verticalAlign: 'middle', marginRight: 8 }} />
          {t('abTesting')}
        </h1>
        <p className="page-subtitle">
          {t('abTestingDesc')}
        </p>
      </div>

      <div className="tabs mb-24">
        <button 
          className={`tab ${activeTab === 'running' ? 'active' : ''}`} 
          onClick={() => setActiveTab('running')}
        >
          {t('activeExperiments')}
        </button>
        <button 
          className={`tab ${activeTab === 'completed' ? 'active' : ''}`} 
          onClick={() => setActiveTab('completed')}
        >
          {t('historicalResults')}
        </button>
      </div>

      <div className="flex flex-col gap-24 stagger-children">
        {filteredTests.map((test) => (
          <div key={test.id} className="glass-card">
            <div className="flex justify-between items-start mb-24">
              <div>
                <h3 className="section-title" style={{ marginBottom: 4 }}>{test.name}</h3>
                <div className="flex items-center gap-12 text-xs text-muted">
                  <span className="flex items-center gap-4">
                    <Clock size={12} /> {t('started')}: {test.startDate}
                  </span>
                  <span className="flex items-center gap-4">
                    <BarChart size={12} /> {t('totalScans')}: {test.totalScans.toLocaleString()}
                  </span>
                </div>
              </div>
              <div className="flex flex-col items-end">
                <span className={`badge ${test.status === 'running' ? 'badge-purple' : 'badge-success'}`}>
                  {test.status === 'running' ? t('experimentLive') : t('concluded')}
                </span>
                <span className="text-xs font-mono mt-8" style={{ color: 'var(--accent-secondary)' }}>
                  {t('confidence')}: {test.confidence}%
                </span>
              </div>
            </div>

            <div className="ab-split">
              {/* Variant A */}
              <div className="ab-variant glass-card" style={{ background: 'rgba(255,255,255,0.02)' }}>
                <span className="ab-variant-label a">{t('variantA')}</span>
                <div className="flex items-center gap-16 mb-16 mt-16">
                   <div style={{ 
                    width: 48, height: 48, borderRadius: 'var(--radius-md)', 
                    background: 'var(--gradient-accent)', display: 'flex', 
                    alignItems: 'center', justifyContent: 'center', flexShrink: 0
                   }}>
                    <Sparkles size={24} color="white" style={{margin: 'auto'}} />
                   </div>
                   <div>
                    <h4 style={{ fontSize: 16, fontWeight: 700 }}>{test.variantA.name}</h4>
                    <p className="text-xs text-muted">{t('styleVariation')}</p>
                   </div>
                </div>

                <div className="grid-2 gap-16">
                  <div className="stat-card" style={{ padding: 12 }}>
                    <div className="stat-card-label" style={{ fontSize: 10 }}>{t('scans')}</div>
                    <div className="stat-card-value" style={{ fontSize: 20 }}>{test.variantA.scans.toLocaleString()}</div>
                  </div>
                  <div className="stat-card" style={{ padding: 12 }}>
                    <div className="stat-card-label" style={{ fontSize: 10 }}>{t('conversionRate')}</div>
                    <div className="stat-card-value" style={{ fontSize: 20, color: 'var(--accent-primary)' }}>
                      {test.variantA.rate}%
                    </div>
                  </div>
                </div>

                {test.winner === 'A' && (
                  <div className="flex items-center gap-8 mt-16 text-sm" style={{ color: 'var(--accent-success)' }}>
                    <CheckCircle2 size={16} /> {t('frontrunner')}
                  </div>
                )}
              </div>

              {/* Variant B */}
              <div className="ab-variant glass-card" style={{ background: 'rgba(255,255,255,0.02)' }}>
                <span className="ab-variant-label b">{t('variantB')}</span>
                <div className="flex items-center gap-16 mb-16 mt-16">
                   <div style={{ 
                    width: 48, height: 48, borderRadius: 'var(--radius-md)', 
                    background: 'var(--gradient-cool)', display: 'flex', 
                    alignItems: 'center', justifyContent: 'center', flexShrink: 0
                   }}>
                    <Sparkles size={24} color="white" style={{margin: 'auto'}} />
                   </div>
                   <div>
                    <h4 style={{ fontSize: 16, fontWeight: 700 }}>{test.variantB.name}</h4>
                    <p className="text-xs text-muted">{t('styleVariation')}</p>
                   </div>
                </div>

                <div className="grid-2 gap-16">
                  <div className="stat-card" style={{ padding: 12 }}>
                    <div className="stat-card-label" style={{ fontSize: 10 }}>{t('scans')}</div>
                    <div className="stat-card-value" style={{ fontSize: 20 }}>{test.variantB.scans.toLocaleString()}</div>
                  </div>
                  <div className="stat-card" style={{ padding: 12 }}>
                    <div className="stat-card-label" style={{ fontSize: 10 }}>{t('conversionRate')}</div>
                    <div className="stat-card-value" style={{ fontSize: 20, color: 'var(--accent-secondary)' }}>
                      {test.variantB.rate}%
                    </div>
                  </div>
                </div>
                
                {test.winner === 'B' && (
                  <div className="flex items-center gap-8 mt-16 text-sm" style={{ color: 'var(--accent-success)' }}>
                    <CheckCircle2 size={16} /> {t('frontrunner')}
                  </div>
                )}
              </div>
            </div>

            <div className="mt-24" style={{ padding: '16px', borderRadius: 'var(--radius-md)', background: 'rgba(108, 92, 231, 0.05)', border: '1px solid rgba(108, 92, 231, 0.1)' }}>
              <div className="flex items-center gap-12">
                <AlertCircle size={18} style={{ color: 'var(--accent-primary)' }} />
                <p className="text-sm">
                  <strong>{t('aiAnalysis')}:</strong> {t('variant')} {test.winner} {t('performing')} {Math.abs(test.variantA.rate - test.variantB.rate).toFixed(1)}% {t('better')}. 
                  {test.confidence > 90 ? t('recommendCommit') : t('suggestContinue')}
                </p>
              </div>
            </div>
          </div>
        ))}

        <div className="glass-card flex flex-col items-center justify-center p-48 text-center" style={{ borderStyle: 'dashed' }}>
          <div className="feature-card-icon pink" style={{ marginBottom: 16 }}>
            <Plus size={24} />
          </div>
          <h3 className="section-title">{t('newExperiment')}</h3>
          <p className="text-sm text-muted mb-24" style={{ maxWidth: 320 }}>
            {t('compareStyles')}
          </p>
          <button className="btn btn-primary" onClick={() => alert(t('testWizardStarted'))}>{t('launchTest')}</button>
        </div>
      </div>
    </div>
  )
}
