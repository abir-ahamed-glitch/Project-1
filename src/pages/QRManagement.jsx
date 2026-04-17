import { useState, useEffect, useRef } from 'react'
import { useNavigate } from 'react-router-dom'
import { QrCode, ExternalLink, Clock, History, FileText, Search, Plus, Edit, Trash2, ChevronDown, ChevronRight, Save, Download } from 'lucide-react'
import QRCode from 'qrcode'
import { useQR } from '../context/QRContext'
import { aiStyles } from '../data/mockData'
import { useLanguage } from '../context/LanguageContext'

// Simple hash function to generate a seed from a string
const simpleHash = (str) => {
  let h = 0;
  for (let i = 0; i < str.length; i++)
    h = Math.imul(31, h) + str.charCodeAt(i) | 0;
  return h;
}

// Simple seeded PRNG (mulberry32)
const getSeededRandom = (prompt, style) => {
  const seedString = (prompt || 'default') + '-' + style
  let a = simpleHash(seedString)
  return function() {
    var t = a += 0x6D2B79F5;
    t = Math.imul(t ^ t >>> 15, t | 1);
    t ^= t + Math.imul(t ^ t >>> 7, t | 61);
    return ((t ^ t >>> 14) >>> 0) / 4294967296;
  }
}

function QRThumbnail({ url, style }) {
  const canvasRef = useRef(null)
  
  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const themeStyle = aiStyles.find(s => s.name === style)
    const fgColor = themeStyle?.colors[0] || '#6c5ce7'
    
    QRCode.toCanvas(canvas, url, {
      width: 40,
      margin: 1,
      color: { dark: fgColor, light: '#00000000' },
      errorCorrectionLevel: 'M',
    })
  }, [url, style])

  return <canvas ref={canvasRef} style={{ borderRadius: 4, width: 40, height: 40 }} />
}

export default function QRManagement() {
  const { t } = useLanguage()
  const { qrCodes, deleteQR, updateQR, loading } = useQR()
  const navigate = useNavigate()
  const [search, setSearch] = useState('')
  const [filter, setFilter] = useState('all')
  const [expandedId, setExpandedId] = useState(null)
  const [activeTab, setActiveTab] = useState('versions')
  const [editingUrl, setEditingUrl] = useState('')
  const [editingId, setEditingId] = useState(null)
  const [showEditModal, setShowEditModal] = useState(false)

  const filtered = qrCodes.filter(qr => {
    const matchSearch = qr.name.toLowerCase().includes(search.toLowerCase())
    const matchFilter = filter === 'all' || qr.status === filter
    return matchSearch && matchFilter
  })

  const handleExpand = (id) => {
    setExpandedId(expandedId === id ? null : id)
    setActiveTab('versions')
  }

  const handleEditUrl = (qr) => {
    setEditingId(qr.id)
    setEditingUrl(qr.url)
    setShowEditModal(true)
  }

  const handleUpdate = () => {
    updateQR(editingId, { url: editingUrl })
    setShowEditModal(false)
  }

  const handleDelete = (e, id) => {
    e.stopPropagation()
    if (window.confirm('Are you sure you want to delete this project?')) {
      deleteQR(id)
    }
  }

  const drawLabel = (ctx, qr, qrSize, totalHeight) => {
    if (!qr.customText) return
    
    // Scale factors relative to 4096px
    const scale = qrSize / 280
    const fontSize = 18 * scale
    const gap = 5 * scale
    const textTop = qrSize + gap
    
    ctx.font = `700 ${fontSize}px "Outfit", "Inter", sans-serif`
    ctx.textAlign = 'center'
    ctx.textBaseline = 'top'
    
    const textMetrics = ctx.measureText(qr.customText)
    const paddingX = 12 * scale
    const paddingY = 4 * scale
    const bgWidth = Math.min(textMetrics.width + paddingX * 2, qrSize - 100) // Less extreme padding for high-res
    const bgHeight = fontSize + paddingY * 2
    
    // Draw pill background
    const isBW = qr.style === 'Black & White'
    ctx.fillStyle = isBW ? 'rgba(0, 0, 0, 0.05)' : 'rgba(255, 255, 255, 0.15)'
    ctx.beginPath()
    ctx.roundRect((qrSize - bgWidth) / 2, textTop, bgWidth, bgHeight, 8 * scale)
    ctx.fill()
    
    // Draw text
    ctx.fillStyle = isBW ? '#000000' : '#ffffff'
    ctx.fillText(qr.customText, qrSize / 2, textTop + paddingY)
  }

  const handleDownload = (qr) => {
    // Create a temporary canvas to render the QR code for download
    const qrSize = 4096
    const hasLabel = !!qr.customText
    const extraHeight = hasLabel ? Math.round(qrSize * 0.15) : 0 // Add 15% extra height for label
    
    const downloadCanvas = document.createElement('canvas')
    downloadCanvas.width = qrSize
    downloadCanvas.height = qrSize + extraHeight
    const dctx = downloadCanvas.getContext('2d')
    
    // Background fill
    const isBW = qr.style === 'Black & White'
    dctx.fillStyle = isBW ? '#ffffff' : '#07080d'
    dctx.fillRect(0, 0, downloadCanvas.width, downloadCanvas.height)
    
    const style = aiStyles.find(s => s.name === qr.style)
    const fgColor = style?.colors[0] || '#6c5ce7'

    const tempQRCanvas = document.createElement('canvas')
    QRCode.toCanvas(tempQRCanvas, qr.url, {
      width: qrSize,
      margin: 2,
      color: { dark: fgColor, light: '#00000000' }, // Transparent light so we can draw it on BG
      errorCorrectionLevel: 'H',
    }).then(async qCanvas => {
      // 1. Draw Artistic Background if not BW
      if (qr.style !== 'Black & White' && qr.prompt) {
        const random = getSeededRandom(qr.prompt, qr.style)
        const colors = style?.colors || ['#6c5ce7', '#00cec9', '#fd79a8']
        const strength = (qr.visualStrength || 65) / 100
        
        dctx.globalAlpha = strength
        for (let i = 0; i < 20 * 4; i++) { // More items for high res
          dctx.beginPath()
          const x = random() * qrSize
          const y = random() * qrSize
          const r = (random() * 40 + 10) * (qrSize / 280)
          const gradient = dctx.createRadialGradient(x, y, 0, x, y, r)
          const color = colors[Math.floor(random() * colors.length)]
          gradient.addColorStop(0, color + '60')
          gradient.addColorStop(1, 'transparent')
          dctx.fillStyle = gradient
          dctx.arc(x, y, r, 0, Math.PI * 2)
          dctx.fill()
        }
        dctx.globalAlpha = 1.0
      }

      // 2. Draw QR Pattern
      dctx.drawImage(qCanvas, 0, 0)
      
      // 3. Draw Logo if exists
      if (qr.logo) {
        const logoImg = new Image()
        logoImg.src = qr.logo
        await new Promise(resolve => logoImg.onload = resolve)
        
        const logoSizePct = qr.logoSize || 15
        const logoPaddingPct = qr.logoPadding || 4
        
        const czPercent = logoSizePct + logoPaddingPct
        const czSize = (qrSize * czPercent) / 100
        const czX = (qrSize - czSize) / 2
        const czY = (qrSize - czSize) / 2
        
        dctx.fillStyle = qr.logoBorderColor || '#ffffff'
        dctx.beginPath()
        dctx.roundRect(czX, czY, czSize, czSize, 8 * (qrSize / 280))
        dctx.fill()
        
        const lSize = (qrSize * logoSizePct) / 100
        const lX = (qrSize - lSize) / 2
        const lY = (qrSize - lSize) / 2
        dctx.drawImage(logoImg, lX, lY, lSize, lSize)
      }

      // 4. Draw Label
      if (hasLabel) {
        drawLabel(dctx, qr, qrSize, downloadCanvas.height)
      }
      
      const link = document.createElement('a')
      link.download = `qr-ultra-hq-${qr.name.toLowerCase().replace(/\s+/g, '-')}.png`
      link.href = downloadCanvas.toDataURL('image/png', 1.0)
      link.click()
    })
  }

  return (
    <div className="animate-fade-in">
      <div className="page-header">
        <div className="flex items-center justify-between flex-col-mobile gap-16">
          <div>
            <h1 className="page-title">{t('qrManagementTitle')}</h1>
            <p className="page-subtitle">
              {t('qrManagementSubtitle')}
            </p>
          </div>
          <button className="btn btn-primary" id="create-qr-btn" onClick={() => navigate('/generator')}>
            <Plus size={16} /> {t('createNewQr')}
          </button>
        </div>
      </div>

      {/* Filters */}
      <div className="glass-card mb-24 flex items-center gap-16 flex-col-mobile" style={{ flexWrap: 'wrap' }}>
        <div style={{ flex: 1, minWidth: 200 }}>
          <div className="flex items-center gap-8" style={{ position: 'relative' }}>
            <Search size={16} style={{ color: 'var(--text-muted)', position: 'absolute', left: 12 }} />
            <input
              className="input"
              style={{ paddingLeft: 36 }}
              placeholder={t('searchQrs')}
              value={search}
              onChange={e => setSearch(e.target.value)}
              id="qr-search"
            />
          </div>
        </div>
        <div className="tabs" style={{ marginBottom: 0 }}>
          {['all', 'active', 'expired'].map(f => (
            <button
              key={f}
              className={`tab ${filter === f ? 'active' : ''}`}
              onClick={() => setFilter(f)}
            >
              {t(f)}
            </button>
          ))}
        </div>
      </div>

      {/* QR List */}
      <div className="flex flex-col gap-16 stagger-children">
        {filtered.map(qr => (
          <div key={qr.id} className="glass-card" style={{ padding: 0, overflow: 'hidden' }}>
            {/* Main Row */}
            <div
              className="flex items-center gap-16"
              style={{ padding: '20px 24px', cursor: 'pointer' }}
              onClick={() => handleExpand(qr.id)}
              id={`qr-row-${qr.id}`}
            >
              <div style={{
                width: 48,
                height: 48,
                borderRadius: 'var(--radius-md)',
                background: 'var(--gradient-card)',
                border: '1px solid var(--border-glass)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                flexShrink: 0,
              }}>
                <QRThumbnail url={qr.url} style={qr.style} />
              </div>

              <div style={{ flex: 1, minWidth: 0 }}>
                <div className="flex items-center gap-8 mb-4">
                  <span style={{ fontWeight: 700, fontSize: 15 }}>{qr.name}</span>
                  <span className={`badge ${qr.status === 'active' ? 'badge-success' : 'badge-warning'}`}>
                    {qr.status}
                  </span>
                  {qr.style && <span className="badge badge-purple">{qr.style}</span>}
                </div>
                <div style={{ fontSize: 13, color: 'var(--accent-secondary)', marginBottom: 8, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                  {qr.url}
                </div>
                <div className="flex items-center gap-16 text-xs text-muted">
                  <span className="flex items-center gap-4">
                    <Clock size={12} />
                    {qr.created}
                  </span>
                </div>
              </div>

              <div style={{ textAlign: 'right', flexShrink: 0 }}>
                <div style={{ fontSize: 18, fontWeight: 800, fontFamily: 'var(--font-primary)' }}>
                  {qr.scans.toLocaleString()}
                </div>
                <div className="text-xs text-muted">{t('totalScansSmall')}</div>
              </div>

              <div className="flex items-center gap-8">
                <button 
                  className="btn btn-ghost btn-icon btn-sm" 
                  onClick={e => { e.stopPropagation(); handleDownload(qr) }}
                  title={t('download')}
                >
                  <Download size={14} />
                </button>
                <button className="btn btn-ghost btn-icon btn-sm" onClick={e => { e.stopPropagation(); handleEditUrl(qr) }}>
                  <Edit size={14} />
                </button>
                {expandedId === qr.id ? <ChevronDown size={18} /> : <ChevronRight size={18} />}
              </div>
            </div>

            {/* Expanded Detail */}
            {expandedId === qr.id && (
              <div style={{
                borderTop: '1px solid var(--border-glass)',
                padding: '20px 24px',
                background: 'rgba(0,0,0,0.15)',
                animation: 'fadeIn 0.3s ease-out',
              }}>
                <div className="tabs" style={{ width: 'fit-content' }}>
                  <button
                    className={`tab ${activeTab === 'versions' ? 'active' : ''}`}
                    onClick={() => setActiveTab('versions')}
                  >
                    <History size={14} style={{ marginRight: 4 }} /> {t('versionControl')}
                  </button>
                  <button
                    className={`tab ${activeTab === 'audit' ? 'active' : ''}`}
                    onClick={() => setActiveTab('audit')}
                  >
                    <FileText size={14} style={{ marginRight: 4 }} /> {t('auditTrail')}
                  </button>
                </div>

                {activeTab === 'versions' && (
                  <div>
                    {qr.versions.length > 0 ? qr.versions.map((ver, i) => (
                      <div key={i} className="version-row">
                        <span className="version-number">v{ver.v}</span>
                        <div className="version-info">
                          <div className="version-url">{ver.url}</div>
                          <div className="version-meta">
                            {ver.date} · by {ver.by}
                          </div>
                        </div>
                        {ver.tag && (
                          <span className={`version-tag ${ver.tag === 'current' ? 'badge-success' : 'badge-purple'}`} style={{ padding: '3px 10px' }}>
                            {ver.tag}
                          </span>
                        )}
                      </div>
                    )) : (
                      <div className="text-sm text-muted" style={{ padding: '16px 0' }}>
                        {t('noVersionHistory')}
                      </div>
                    )}
                  </div>
                )}

                {activeTab === 'audit' && (
                  <div className="timeline" style={{ marginTop: 8 }}>
                    {qr.auditTrail.length > 0 ? qr.auditTrail.map((entry, i) => (
                      <div key={i} className="timeline-item">
                        <div className="timeline-item-time">{entry.time}</div>
                        <div className="timeline-item-content">
                          {entry.action}
                          <span className="text-muted"> — {entry.user}</span>
                        </div>
                      </div>
                    )) : (
                      <div className="text-sm text-muted" style={{ padding: '16px 0' }}>
                        {t('noAuditTrail')}
                      </div>
                    )}
                  </div>
                )}

                <div className="flex gap-8 mt-16">
                  <button className="btn btn-secondary btn-sm" onClick={() => handleEditUrl(qr)}>
                    <Edit size={14} /> {t('updateDestination')}
                  </button>
                  <button className="btn btn-secondary btn-sm" onClick={() => handleDownload(qr)}>
                    <Download size={14} /> {t('download')}
                  </button>
                  <button className="btn btn-ghost btn-sm" onClick={(e) => handleDelete(e, qr.id)} style={{ color: 'var(--accent-danger)' }}>
                    <Trash2 size={14} /> {t('archive')}
                  </button>
                </div>
              </div>
            )}
          </div>
        ))}
      </div>

      {/* Edit Modal */}
      {showEditModal && (
        <div style={{
          position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.6)',
          display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 200
        }} onClick={() => setShowEditModal(false)}>
          <div
            className="glass-card animate-scale-in"
            style={{ width: 480, maxWidth: '90vw' }}
            onClick={e => e.stopPropagation()}
          >
            <h3 className="section-title">{t('updateQrDestination')}</h3>
            <p className="text-sm text-muted mb-16">
              {t('printedQrStays')}
            </p>
            <div className="input-group mb-16">
              <label className="input-label">{t('newUrl')}</label>
              <input
                className="input"
                value={editingUrl}
                onChange={e => setEditingUrl(e.target.value)}
                placeholder="https://..."
                id="edit-url-input"
              />
            </div>
            <div className="flex gap-8 justify-between">
              <button className="btn btn-ghost" onClick={() => setShowEditModal(false)}>{t('cancel')}</button>
              <button className="btn btn-primary" onClick={handleUpdate}>
                <Save size={16} /> {t('saveVersion')}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
