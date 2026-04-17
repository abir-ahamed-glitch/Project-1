import { useState } from 'react'
import { ScanLine, Zap, Moon, RotateCcw, Sun, Camera, CheckCircle, Info } from 'lucide-react'
import { useLanguage } from '../context/LanguageContext'

const scanResults = [
  { url: 'https://link.yourbrand.com/menu', time: '0.12s', condition: 'Low Light', confidence: 98, method: 'ML Reconstruction' },
  { url: 'https://link.yourbrand.com/launch-2026', time: '0.08s', condition: 'Normal', confidence: 100, method: 'Standard Decode' },
  { url: 'https://link.yourbrand.com/event-2026', time: '0.34s', condition: 'High Glare', confidence: 94, method: 'Glare Removal AI' },
  { url: 'https://link.yourbrand.com/feedback', time: '0.21s', condition: '45 deg Angle', confidence: 96, method: 'Perspective Warp' },
]

export default function SmartScanner() {
  const { t } = useLanguage()
  const [scanning, setScanning] = useState(false)
  const [scanResult, setScanResult] = useState(null)
  const [scanIndex, setScanIndex] = useState(0)

  const mlFeatures = [
    {
      icon: Moon,
      title: t('lowLightTitle'),
      desc: t('lowLightDesc'),
      color: 'var(--accent-primary)',
      bg: 'rgba(108,92,231,0.12)',
    },
    {
      icon: Sun,
      title: t('glareTitle'),
      desc: t('glareDesc'),
      color: 'var(--accent-warning)',
      bg: 'rgba(253,203,110,0.12)',
    },
    {
      icon: RotateCcw,
      title: t('perspectiveTitle'),
      desc: t('perspectiveDesc'),
      color: 'var(--accent-secondary)',
      bg: 'rgba(0,206,201,0.12)',
    },
    {
      icon: Zap,
      title: t('damagedCodeTitle'),
      desc: t('damagedCodeDesc'),
      color: 'var(--accent-tertiary)',
      bg: 'rgba(253,121,168,0.12)',
    },
  ]

  const handleScan = () => {
    setScanning(true)
    setScanResult(null)
    setTimeout(() => {
      setScanning(false)
      setScanResult(scanResults[scanIndex % scanResults.length])
      setScanIndex(i => i + 1)
    }, 2000)
  }

  return (
    <div className="animate-fade-in">
      <div className="page-header">
        <h1 className="page-title">
          <ScanLine size={28} style={{ color: 'var(--accent-secondary)', display: 'inline', verticalAlign: 'middle', marginRight: 8 }} />
          {t('scannerTitle')}
        </h1>
        <p className="page-subtitle">
          {t('scannerSubtitle')}
        </p>
      </div>

      <div className="grid-2">
        {/* Scanner */}
        <div className="flex flex-col gap-24">
          <div className="glass-card">
            <h3 className="section-title mb-16">
              <Camera size={16} style={{ color: 'var(--accent-secondary)' }} />
              {t('scannerViewport')}
            </h3>
            <div className="scanner-viewport">
              {/* Simulated camera feed */}
              <div style={{
                width: '100%',
                height: '100%',
                background: 'linear-gradient(135deg, #0a0a15 0%, #1a1a2e 100%)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}>
                {scanning ? (
                  <div style={{ textAlign: 'center' }}>
                    <div className="spinner" style={{ margin: '0 auto 12px', borderTopColor: 'var(--accent-secondary)' }} />
                    <span className="text-sm" style={{ color: 'var(--accent-secondary)' }}>
                      {t('aiProcessing')}
                    </span>
                  </div>
                ) : scanResult ? (
                  <div style={{ textAlign: 'center' }} className="animate-scale-in">
                    <CheckCircle size={48} style={{ color: 'var(--accent-success)', marginBottom: 12 }} />
                    <div style={{ fontSize: 14, fontWeight: 600, color: 'var(--accent-success)' }}>
                      {t('qrDecoded')}
                    </div>
                  </div>
                ) : (
                  <div style={{ textAlign: 'center', color: 'var(--text-muted)' }}>
                    <Camera size={48} style={{ marginBottom: 12, opacity: 0.3 }} />
                    <div style={{ fontSize: 13 }}>{t('tapSimulate')}</div>
                  </div>
                )}
              </div>

              {/* Scanner corners */}
              <div className="scanner-corners" />
              <div className="scanner-corners scanner-corners-bottom" style={{ position: 'absolute', inset: 20 }} />

              {scanning && <div className="scanner-line" />}
            </div>

            <button
              className="btn btn-primary btn-lg w-full mt-16"
              onClick={handleScan}
              disabled={scanning}
              style={{ justifyContent: 'center' }}
              id="scan-btn"
            >
              {scanning ? (
                <>{t('processingML')}</>
              ) : (
                <>
                  <ScanLine size={18} /> {t('simScan')}
                </>
              )}
            </button>
          </div>

          {/* Scan Result */}
          {scanResult && (
            <div className="glass-card animate-fade-in">
              <h3 className="section-title mb-16">
                <CheckCircle size={16} style={{ color: 'var(--accent-success)' }} />
                {t('scanResultLabel')}
              </h3>
              <div className="flex flex-col gap-12">
                <div className="flex justify-between items-center">
                  <span className="text-xs text-muted">URL</span>
                  <a href={scanResult.url} className="table-link text-sm" target="_blank" rel="noopener">{scanResult.url}</a>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-xs text-muted">{t('decodeTime')}</span>
                  <span className="font-mono text-sm" style={{ color: 'var(--accent-success)' }}>{scanResult.time}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-xs text-muted">{t('condition')}</span>
                  <span className="badge badge-warning">{scanResult.condition}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-xs text-muted">{t('mlConfidence')}</span>
                  <span className="font-mono text-sm" style={{ color: 'var(--accent-primary)' }}>{scanResult.confidence}%</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-xs text-muted">{t('methodUsed')}</span>
                  <span className="badge badge-purple">{scanResult.method}</span>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* ML Features */}
        <div className="flex flex-col gap-24">
          <div className="glass-card">
            <h3 className="section-title mb-16">
              <Zap size={16} style={{ color: 'var(--accent-warning)' }} />
              {t('mlPipeline')}
            </h3>
            <div className="flex flex-col gap-16">
              {mlFeatures.map((feat, i) => {
                const Icon = feat.icon
                return (
                  <div key={i} className="flex gap-16 items-start" style={{
                    padding: 16,
                    background: 'rgba(255,255,255,0.02)',
                    borderRadius: 'var(--radius-md)',
                    border: '1px solid var(--border-glass)',
                  }}>
                    <div style={{
                      width: 44,
                      height: 44,
                      borderRadius: 'var(--radius-md)',
                      background: feat.bg,
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      flexShrink: 0,
                    }}>
                      <Icon size={20} style={{ color: feat.color }} />
                    </div>
                    <div>
                      <h4 style={{ fontSize: 14, fontWeight: 700, marginBottom: 4 }}>{feat.title}</h4>
                      <p className="text-sm" style={{ color: 'var(--text-tertiary)', lineHeight: 1.6 }}>{feat.desc}</p>
                    </div>
                  </div>
                )
              })}
            </div>
          </div>

          <div className="glass-card" style={{ background: 'rgba(0,206,201,0.05)', border: '1px solid rgba(0,206,201,0.15)' }}>
            <div className="flex items-center gap-8 mb-8">
              <Info size={16} style={{ color: 'var(--accent-secondary)' }} />
              <span style={{ fontWeight: 700, fontSize: 14 }}>{t('scanReliabilityAi')}</span>
            </div>
            <p className="text-sm" style={{ color: 'var(--text-tertiary)', lineHeight: 1.7 }}>
              {t('scanReliabilityAiDesc')}
            </p>
          </div>

          {/* Recent Scan History */}
          <div className="glass-card">
            <h3 className="section-title mb-16">{t('recentScanHistory')}</h3>
            <div className="table-container">
              <table className="table">
                <thead>
                  <tr>
                    <th>{t('condition')}</th>
                    <th>{t('time')}</th>
                    <th>{t('confidence')}</th>
                    <th>{t('method')}</th>
                  </tr>
                </thead>
                <tbody>
                  {scanResults.map((r, i) => (
                    <tr key={i}>
                      <td>
                        <span className="badge badge-warning">{r.condition}</span>
                      </td>
                      <td className="font-mono">{r.time}</td>
                      <td>
                        <span className="font-mono" style={{
                          color: r.confidence >= 98 ? 'var(--accent-success)' : 'var(--accent-warning)'
                        }}>{r.confidence}%</span>
                      </td>
                      <td className="text-sm">{r.method}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
