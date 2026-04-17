import { useState, useRef, useEffect, useCallback } from 'react'
import QRCode from 'qrcode'
import { Sparkles, Download, RefreshCw, Wand2, Eye, Palette, Sliders } from 'lucide-react'
import { aiStyles } from '../data/mockData'
import { useLanguage } from '../context/LanguageContext'
import { useAuth } from '../context/AuthContext'
import { useQR } from '../context/QRContext'
import { Save } from 'lucide-react'

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

export default function QRArtGenerator() {
  const { t } = useLanguage()
  const { currentUser } = useAuth()
  const { saveQR } = useQR()
  const [prompt, setPrompt] = useState('')
  const [projectName, setProjectName] = useState('')
  const [url, setUrl] = useState('https://link.yourbrand.com/my-campaign')
  const [selectedStyle, setSelectedStyle] = useState('Cyberpunk Neon')
  const [visualStrength, setVisualStrength] = useState(65)
  const [conditioningScale, setConditioningScale] = useState(80)
  const [generating, setGenerating] = useState(false)
  const [generated, setGenerated] = useState(false)
  const [logo, setLogo] = useState(null)
  const [logoSize, setLogoSize] = useState(15)
  const [logoPadding, setLogoPadding] = useState(4)
  const [logoBorderColor, setLogoBorderColor] = useState('#ffffff')
  const [customText, setCustomText] = useState('')
  const [logoImg, setLogoImg] = useState(null)
  const [saveStatus, setSaveStatus] = useState(null)
  const canvasRef = useRef(null)
  const artCanvasRef = useRef(null)
  const logoInputRef = useRef(null)

  // Pre-load logo image for instantaneous, lag-free rendering
  useEffect(() => {
    if (!logo) {
      setLogoImg(null)
      return
    }
    const img = new Image()
    img.crossOrigin = "anonymous"
    img.onload = () => setLogoImg(img)
    img.src = logo
  }, [logo])

  const renderText = useCallback((ctx, width, height, scale = 1) => {
    const qrSize = 280 * scale
    const fontSize = 14 * scale
    const gap = 5 * scale
    const textTop = qrSize + gap
    
    ctx.font = `700 ${fontSize}px "Outfit", "Inter", sans-serif`
    ctx.textAlign = 'center'
    ctx.textBaseline = 'top'
    
    const textMetrics = ctx.measureText(customText)
    const paddingX = 12 * scale
    const paddingY = 4 * scale
    const bgWidth = Math.min(textMetrics.width + paddingX * 2, qrSize - 20 * scale)
    const bgHeight = fontSize + paddingY * 2
    
    // Draw pill background
    const isBW = selectedStyle === 'Black & White'
    ctx.fillStyle = isBW ? 'rgba(0, 0, 0, 0.05)' : 'rgba(255, 255, 255, 0.15)'
    ctx.beginPath()
    ctx.roundRect((qrSize - bgWidth) / 2, textTop, bgWidth, bgHeight, 8 * scale)
    ctx.fill()
    
    // Draw text
    ctx.fillStyle = isBW ? '#000000' : '#ffffff'
    ctx.fillText(customText, qrSize / 2, textTop + paddingY)
  }, [customText, selectedStyle])

  const drawLogoAndText = useCallback((canvas) => {
    if (!canvas) return
    const ctx = canvas.getContext('2d')

    // 1. Draw Logo if it exists
    if (logoImg) {
      // Logic for dynamic clear zone + logo size
      // We center based on canvas.width/2 (140) to stay strictly centered in the QR pattern
      const clearZonePercent = logoSize + logoPadding
      const clearZoneSize = (canvas.width * clearZonePercent) / 100
      const czX = (canvas.width - clearZoneSize) / 2
      const czY = (canvas.width - clearZoneSize) / 2

      // Draw the "Blank Space" (Clear Zone) with custom color
      ctx.fillStyle = logoBorderColor
      ctx.beginPath()
      ctx.roundRect(czX, czY, clearZoneSize, clearZoneSize, 8)
      ctx.fill()
      
      // Draw the Logo centered within that space
      const lSize = (canvas.width * logoSize) / 100
      const lX = (canvas.width - lSize) / 2
      const lY = (canvas.width - lSize) / 2
      ctx.drawImage(logoImg, lX, lY, lSize, lSize)
      
      if (customText) renderText(ctx, canvas.width, canvas.height, 1)
    } else if (customText) {
      renderText(ctx, canvas.width, canvas.height, 1)
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [logoImg, logoSize, customText, logoPadding, logoBorderColor, renderText])

  const generateQR = useCallback(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    
    const style = aiStyles.find(s => s.name === selectedStyle)
    const fgColor = style?.colors[0] || '#6c5ce7'
    const hasText = customText.length > 0
    const targetHeight = hasText ? 320 : 280

    // Use a temporary canvas to generate the QR pattern so we don't 
    // let the library reset our preview canvas dimensions
    const virtualCanvas = document.createElement('canvas')
    
    QRCode.toCanvas(virtualCanvas, url || 'https://qrforall.app', {
      width: 280,
      margin: 2,
      color: { dark: fgColor, light: '#00000000' },
      errorCorrectionLevel: 'H',
    }).then(qCanvas => {
      // Now prepare our actual preview canvas
      canvas.width = 280
      canvas.height = targetHeight
      const ctx = canvas.getContext('2d')
      
      // Clear and draw the QR pattern
      ctx.clearRect(0, 0, 280, targetHeight)
      ctx.drawImage(qCanvas, 0, 0)
      
      // Draw Logo and Text overlays
      drawLogoAndText(canvas)
    })
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [url, selectedStyle, drawLogoAndText, customText, logoPadding, logoBorderColor])

  useEffect(() => {
    generateQR()
  }, [generateQR])

  const handleGenerate = () => {
    setGenerating(true)
    setTimeout(() => {
      setGenerating(false)
      setGenerated(true)
      generateQR()
      drawArtOverlay()
    }, 2500)
  }

  const handleSave = () => {
    if (!currentUser) {
      setSaveStatus('error')
      setTimeout(() => setSaveStatus(null), 3000)
      return
    }

    try {
      saveQR({
        name: projectName || (prompt ? (prompt.slice(0, 20) + '...') : 'AI Art QR'),
        url: url,
        style: selectedStyle,
        prompt: prompt,
        visualStrength: visualStrength,
        conditioningScale: conditioningScale,
        customText: customText,
        logo: logo
      })
      setSaveStatus('success')
      setTimeout(() => setSaveStatus(null), 3000)
    } catch (err) {
      setSaveStatus('error')
      setTimeout(() => setSaveStatus(null), 3000)
    }
  }

  const drawArtOverlay = () => {
    const canvas = artCanvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')
    canvas.width = 280
    canvas.height = 280
    ctx.clearRect(0, 0, 280, 280)

    const random = getSeededRandom(prompt, selectedStyle)
    const style = aiStyles.find(s => s.name === selectedStyle)
    const colors = style?.colors || ['#6c5ce7', '#00cec9', '#fd79a8']
    const strength = visualStrength / 100

    if (selectedStyle === 'Black & White') return;

    // Decorative art background based on style
    for (let i = 0; i < 20; i++) {
      ctx.beginPath()
      const x = random() * 280
      const y = random() * 280
      const r = random() * 40 + 10
      const gradient = ctx.createRadialGradient(x, y, 0, x, y, r)
      const color = colors[Math.floor(random() * colors.length)]
      gradient.addColorStop(0, color + Math.round(strength * 40).toString(16).padStart(2, '0'))
      gradient.addColorStop(1, 'transparent')
      ctx.fillStyle = gradient
      ctx.arc(x, y, r, 0, Math.PI * 2)
      ctx.fill()
    }

    // Add geometric elements
    ctx.strokeStyle = colors[0] + '30'
    ctx.lineWidth = 1
    for (let i = 0; i < 8; i++) {
      ctx.beginPath()
      ctx.moveTo(random() * 280, random() * 280)
      ctx.lineTo(random() * 280, random() * 280)
      ctx.stroke()
    }
    
    // Ensure logo stays visible on art canvas too if needed, 
    // but usually it's better to keep it on the main QR canvas
  }

  const handleLogoUpload = (e) => {
    const file = e.target.files[0]
    if (file) {
      const reader = new FileReader()
      reader.onload = (readerEvent) => {
        setLogo(readerEvent.target.result)
      }
      reader.readAsDataURL(file)
    }
  }

  const clearLogo = () => {
    setLogo(null)
    if (logoInputRef.current) logoInputRef.current.value = ''
    generateQR()
  }

  const handleDownload = () => {
    const mainCanvas = canvasRef.current
    if (!mainCanvas) return
    
    // 15x Resolution Scaling for ultra-high-quality downloads (4k+ print-ready)
    const scale = 15
    const qrSize = 280 * scale
    const hasText = customText.length > 0
    const extraHeight = hasText ? 40 * scale : 0
    
    // Create a high-res temporary canvas
    const downloadCanvas = document.createElement('canvas')
    downloadCanvas.width = qrSize
    downloadCanvas.height = qrSize + extraHeight
    const dctx = downloadCanvas.getContext('2d')
    
    // Fill background (white for Black & White style, dark for others)
    const isBW = selectedStyle === 'Black & White'
    dctx.fillStyle = isBW ? '#ffffff' : '#07080d'
    dctx.fillRect(0, 0, downloadCanvas.width, downloadCanvas.height)
    
    // 1. Draw Art Background at high-res
    if (generated && artCanvasRef.current && selectedStyle !== 'Black & White') {
      dctx.globalAlpha = visualStrength / 100
      const style = aiStyles.find(s => s.name === selectedStyle)
      const colors = style?.colors || ['#6c5ce7', '#00cec9', '#fd79a8']
      const random = getSeededRandom(prompt, selectedStyle)
      
      // Seed random for reproducible art patterns at high scale
      for (let i = 0; i < 20; i++) {
        const x = random() * qrSize
        const y = random() * qrSize
        const r = (random() * 40 + 10) * scale
        const gradient = dctx.createRadialGradient(x, y, 0, x, y, r)
        const color = colors[Math.floor(random() * colors.length)]
        gradient.addColorStop(0, color + '55')
        gradient.addColorStop(1, 'transparent')
        dctx.fillStyle = gradient
        dctx.beginPath()
        dctx.arc(x, y, r, 0, Math.PI * 2)
        dctx.fill()
      }
      dctx.globalAlpha = 1.0
    }
    
    // 2. Generate High-Res QR Base
    const tempQRCanvas = document.createElement('canvas')
    const style = aiStyles.find(s => s.name === selectedStyle)
    const fgColor = style?.colors[0] || '#6c5ce7'
    
    QRCode.toCanvas(tempQRCanvas, url || 'https://qrforall.app', {
      width: qrSize,
      margin: 2,
      color: { dark: fgColor, light: '#00000000' },
      errorCorrectionLevel: 'H',
    }).then(qCanvas => {
      dctx.drawImage(qCanvas, 0, 0)
      
      // 3. Draw Logo with Clear Zone
      if (logo) {
        const czPercent = logoSize + logoPadding
        const czSize = (qrSize * czPercent) / 100
        const czX = (qrSize - czSize) / 2
        const czY = (qrSize - czSize) / 2
        
        dctx.fillStyle = logoBorderColor
        dctx.beginPath()
        dctx.roundRect(czX, czY, czSize, czSize, 8 * scale)
        dctx.fill()
        
        const img = logoImg
        if (img) {
          const lSize = (qrSize * logoSize) / 100
          const lX = (qrSize - lSize) / 2
          const lY = (qrSize - lSize) / 2
          dctx.drawImage(img, lX, lY, lSize, lSize)
          
          
          if (hasText) renderText(dctx, qrSize, downloadCanvas.height, scale)
          finalizeDownload(downloadCanvas)
        }
      } else {
        if (hasText) renderText(dctx, qrSize, downloadCanvas.height, scale)
        finalizeDownload(downloadCanvas)
      }
    })
  }

  const finalizeDownload = (canvas) => {
    canvas.toBlob((blob) => {
      const url = URL.createObjectURL(blob)
      const link = document.createElement('a')
      // safe filename without &
      const safeName = selectedStyle.toLowerCase().replace(/[^a-z0-9]+/g, '-')
      link.download = `qrforall-hq-${safeName}.png`
      link.href = url
      link.click()
      setTimeout(() => URL.revokeObjectURL(url), 1000)
    }, 'image/png', 1.0)
  }

  return (
    <div className="animate-fade-in">
      <div className="page-header">
        <h1 className="page-title">
          <Sparkles size={28} style={{ color: 'var(--accent-primary)', display: 'inline', verticalAlign: 'middle', marginRight: 8 }} />
          {t('generatorTitle')}
        </h1>
        <p className="page-subtitle">
          {t('generatorSubtitle')}
        </p>
      </div>

      <div className="grid-2">
        {/* Controls */}
        <div className="flex flex-col gap-24">
          <div className="glass-card">
            <h3 className="section-title">
              <Wand2 size={16} style={{ color: 'var(--accent-primary)' }} />
              {t('generationSettings')}
            </h3>

            <div className="input-group mb-16">
              <label className="input-label">{t('projectName') || 'Project Name'}</label>
              <input
                className="input"
                type="text"
                value={projectName}
                onChange={e => setProjectName(e.target.value)}
                placeholder="Marketing Campaign #1"
                id="project-name-input"
              />
            </div>

            <div className="input-group mb-16">
              <label className="input-label">{t('destinationUrl')}</label>
              <input
                className="input"
                type="url"
                value={url}
                onChange={e => setUrl(e.target.value)}
                placeholder="https://your-url.com"
                id="qr-url-input"
              />
            </div>

            <div className="input-group mb-16">
              <label className="input-label">{t('aiArtPrompt')}</label>
              <textarea
                className="input input-textarea"
                value={prompt}
                onChange={e => setPrompt(e.target.value)}
                placeholder={t('aiArtPromptPlaceholder')}
                rows={3}
                id="ai-prompt-input"
              />
            </div>

            <div className="input-group mb-16">
              <label className="input-label">{t('artStyle')}</label>
              <select
                className="select"
                value={selectedStyle}
                onChange={e => setSelectedStyle(e.target.value)}
                id="style-select"
              >
                {aiStyles.map(s => (
                  <option key={s.name} value={s.name}>{s.name} — {s.category}</option>
                ))}
              </select>
            </div>

            <div className="input-group mb-24">
              <label className="input-label">{t('customLabel')}</label>
              <div className="flex gap-8 flex-col-mobile">
                <input
                  className="input flex-1"
                  value={customText}
                  onChange={e => setCustomText(e.target.value)}
                  placeholder="e.g. 'SCAN ME' or Brand Name"
                  id="custom-text-input"
                  maxLength={30}
                />
                {customText && (
                  <button className="btn btn-ghost btn-sm btn-icon" onClick={() => setCustomText('')}>
                    <RefreshCw size={14} />
                  </button>
                )}
              </div>
              <p className="text-xs text-muted mt-4">{t('customLabelDesc')}</p>
            </div>

            <div className="input-group mt-24">
              <label className="input-label">{t('brandLogoOverlay')}</label>
              <div className="flex gap-8 mt-4">
                <input
                  type="file"
                  ref={logoInputRef}
                  onChange={handleLogoUpload}
                  accept="image/*"
                  style={{ display: 'none' }}
                  id="logo-upload-input"
                />
                <button 
                  className="btn btn-secondary btn-sm flex-1"
                  onClick={() => logoInputRef.current?.click()}
                  style={{ justifyContent: 'center' }}
                >
                  <Palette size={14} /> {logo ? t('changeLogo') : t('uploadLogo')}
                </button>
                {logo && (
                  <button className="btn btn-ghost btn-sm btn-icon" onClick={clearLogo} title="Remove Logo">
                    <RefreshCw size={14} />
                  </button>
                )}
              </div>
              
              {logo && (
                <div className="mt-16 animate-scale-in">
                  <div className="flex items-center gap-12 mb-12 p-8 glass-card" style={{ background: 'rgba(255,255,255,0.03)' }}>
                    <div style={{ 
                      width: 40, height: 40, borderRadius: 'var(--radius-sm)', 
                      background: 'white', display: 'flex', alignItems: 'center', 
                      justifyContent: 'center', overflow: 'hidden', padding: 4 
                    }}>
                      <img src={logo} alt="Logo Preview" style={{ maxWidth: '100%', maxHeight: '100%', objectFit: 'contain' }} />
                    </div>
                    <div className="flex-1">
                      <div className="text-xs font-bold">Logo Preview</div>
                      <div className="text-xs text-muted">Centered in clear zone</div>
                    </div>
                  </div>
                  
                  <div className="slider-group mb-12">
                    <div className="slider-header">
                      <span className="slider-label">{t('logoSize')}</span>
                      <span className="slider-value">{logoSize}%</span>
                    </div>
                    <input
                      type="range"
                      className="slider"
                      min="5"
                      max="40"
                      value={logoSize}
                      onChange={e => setLogoSize(Number(e.target.value))}
                    />
                  </div>

                  <div className="slider-group mb-12">
                    <div className="slider-header">
                      <span className="slider-label">{t('borderPadding')}</span>
                      <span className="slider-value">{logoPadding}%</span>
                    </div>
                    <input
                      type="range"
                      className="slider"
                      min="0"
                      max="20"
                      value={logoPadding}
                      onChange={e => setLogoPadding(Number(e.target.value))}
                    />
                  </div>

                  <div className="input-group">
                    <label className="input-label" style={{ fontSize: 10 }}>{t('borderColor')}</label>
                    <div className="flex items-center gap-8">
                      <input 
                        type="color" 
                        value={logoBorderColor}
                        onChange={e => setLogoBorderColor(e.target.value)}
                        style={{ 
                          width: 32, height: 32, padding: 0, border: 'none', 
                          background: 'none', cursor: 'pointer', borderRadius: 4
                        }}
                      />
                      <input 
                        className="input" 
                        type="text" 
                        value={logoBorderColor}
                        onChange={e => setLogoBorderColor(e.target.value)}
                        style={{ height: 32, fontSize: 12, padding: '0 8px' }}
                      />
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>

          <div className="glass-card">
            <h3 className="section-title">
              <Sliders size={16} style={{ color: 'var(--accent-secondary)' }} />
              {t('aiBalanceControls')}
            </h3>

            <div className="slider-group mb-24">
              <div className="slider-header">
                <span className="slider-label">{t('visualStrength')}</span>
                <span className="slider-value">{visualStrength}%</span>
              </div>
              <input
                type="range"
                className="slider"
                min="10"
                max="100"
                value={visualStrength}
                onChange={e => setVisualStrength(Number(e.target.value))}
                id="visual-strength-slider"
              />
              <div className="flex justify-between text-xs text-muted" style={{ marginTop: 4 }}>
                <span>{t('subtle')}</span>
                <span>{t('maximumArt')}</span>
              </div>
            </div>

            <div className="slider-group mb-24">
              <div className="slider-header">
                <span className="slider-label">{t('conditioningScale')}</span>
                <span className="slider-value" style={{ color: 'var(--accent-secondary)', background: 'rgba(0,206,201,0.1)' }}>
                  {conditioningScale}%
                </span>
              </div>
              <input
                type="range"
                className="slider"
                min="50"
                max="100"
                value={conditioningScale}
                onChange={e => setConditioningScale(Number(e.target.value))}
                id="conditioning-scale-slider"
              />
              <div className="flex justify-between text-xs text-muted" style={{ marginTop: 4 }}>
                <span>{t('moreArt')}</span>
                <span>{t('scannable100')}</span>
              </div>
            </div>

            <div className="glass-card" style={{ background: 'rgba(0,184,148,0.06)', border: '1px solid rgba(0,184,148,0.15)', padding: 12 }}>
              <div className="flex items-center gap-8">
                <Eye size={14} style={{ color: 'var(--accent-success)' }} />
                <span style={{ fontSize: 12, color: 'var(--accent-success)', fontWeight: 600 }}>
                  {t('scanReliability')}: {conditioningScale >= 75 ? t('excellent') : conditioningScale >= 60 ? t('good') : t('fair')}
                </span>
              </div>
              <div className="progress-bar mt-8">
                <div
                  className="progress-bar-fill teal"
                  style={{ width: `${conditioningScale}%` }}
                />
              </div>
            </div>
          </div>

          <button
            className="btn btn-primary btn-lg w-full"
            onClick={handleGenerate}
            disabled={generating}
            id="generate-btn"
            style={{ justifyContent: 'center' }}
          >
            {generating ? (
              <>
                <div className="spinner" style={{ width: 18, height: 18, borderWidth: 2 }} />
                {t('generatingSD')}
              </>
            ) : (
              <>
                <Sparkles size={18} />
                {t('generateQrArt')}
              </>
            )}
          </button>
        </div>

        {/* Preview */}
        <div className="flex flex-col gap-24">
          <div className="glass-card">
            <div className="flex items-center justify-between mb-16">
              <h3 className="section-title" style={{ marginBottom: 0 }}>
                <Eye size={16} style={{ color: 'var(--accent-secondary)' }} />
                {t('preview')}
              </h3>
              {generated && (
                <div className="flex gap-8">
                  <button className="btn btn-secondary btn-sm" onClick={handleGenerate} id="regenerate-btn">
                    <RefreshCw size={14} /> {t('regenerate')}
                  </button>
                  <button 
                    className="btn btn-secondary btn-sm" 
                    onClick={handleSave} 
                    id="save-project-btn"
                    style={{ 
                      borderColor: saveStatus === 'success' ? 'var(--accent-success)' : 'var(--border-glass)',
                      color: saveStatus === 'success' ? 'var(--accent-success)' : 'inherit'
                    }}
                  >
                    <Save size={14} /> {saveStatus === 'success' ? t('projectSaved') : t('saveProject')}
                  </button>
                  <button className="btn btn-primary btn-sm" onClick={handleDownload} id="download-btn">
                    <Download size={14} /> {t('download')}
                  </button>
                </div>
              )}
            </div>
            {saveStatus === 'error' && !currentUser && (
              <div className="text-xs mt-8 animate-pulse" style={{ color: 'var(--accent-danger)', textAlign: 'center' }}>
                {t('pleaseLogin')}
              </div>
            )}
            <div className="qr-preview-container" style={{ 
              position: 'relative',
              background: selectedStyle === 'Black & White' ? '#ffffff' : 'rgba(255,255,255,0.03)',
              borderRadius: 'var(--radius-md)',
              width: 280,
              margin: '0 auto',
              paddingBottom: customText ? 40 : 0 // Ensure container follows canvas height
            }}>
              {generated && (
                <canvas
                  ref={artCanvasRef}
                  style={{
                    position: 'absolute',
                    top: 0,
                    left: 0,
                    borderRadius: 'var(--radius-md)',
                    opacity: visualStrength / 100,
                    zIndex: 0
                  }}
                />
              )}
              <canvas ref={canvasRef} style={{ position: 'relative', zIndex: 1, display: 'block' }} />
              {!generated && !customText && (
                <div style={{
                  position: 'absolute',
                  bottom: 16,
                  left: '50%',
                  transform: 'translateX(-50%)',
                  fontSize: 12,
                  color: 'var(--text-muted)',
                  whiteSpace: 'nowrap',
                  pointerEvents: 'none'
                }}>
                  {t('clickGenerateDesc')}
                </div>
              )}
            </div>
          </div>

          {/* Style Palette */}
          <div className="glass-card">
            <h3 className="section-title">
              <Palette size={16} style={{ color: 'var(--accent-tertiary)' }} />
              {t('stylePalette')}
            </h3>
            <div className="chip-group">
              {aiStyles.map(style => (
                <button
                  key={style.name}
                  className={`chip ${selectedStyle === style.name ? 'active' : ''}`}
                  onClick={() => setSelectedStyle(style.name)}
                >
                  <span style={{
                    display: 'inline-block',
                    width: 8,
                    height: 8,
                    borderRadius: '50%',
                    background: style.colors[0],
                    marginRight: 4,
                  }} />
                  {style.name}
                </button>
              ))}
            </div>
          </div>

          {/* API Info */}
          <div className="glass-card" style={{ fontFamily: 'var(--font-mono)', fontSize: 12 }}>
            <h3 className="section-title" style={{ fontFamily: 'var(--font-primary)' }}>{t('apiEndpoint')}</h3>
            <div style={{ background: 'rgba(0,0,0,0.3)', padding: 16, borderRadius: 'var(--radius-md)', lineHeight: 1.8 }}>
              <span style={{ color: 'var(--accent-success)' }}>POST</span>
              <span style={{ color: 'var(--text-secondary)' }}> /api/v1/generate</span>
              <br />
              <span style={{ color: 'var(--text-muted)' }}>{'{'}</span>
              <br />
              <span style={{ color: 'var(--accent-tertiary)' }}>&nbsp;&nbsp;"prompt"</span>
              <span style={{ color: 'var(--text-muted)' }}>: </span>
              <span style={{ color: 'var(--accent-warning)' }}>"{prompt || '...'}"</span>
              <br />
              <span style={{ color: 'var(--accent-tertiary)' }}>&nbsp;&nbsp;"style"</span>
              <span style={{ color: 'var(--text-muted)' }}>: </span>
              <span style={{ color: 'var(--accent-warning)' }}>"{selectedStyle}"</span>
              <br />
              <span style={{ color: 'var(--accent-tertiary)' }}>&nbsp;&nbsp;"visual_strength"</span>
              <span style={{ color: 'var(--text-muted)' }}>: </span>
              <span style={{ color: 'var(--accent-secondary)' }}>{visualStrength / 100}</span>
              <br />
              <span style={{ color: 'var(--accent-tertiary)' }}>&nbsp;&nbsp;"conditioning_scale"</span>
              <span style={{ color: 'var(--text-muted)' }}>: </span>
              <span style={{ color: 'var(--accent-secondary)' }}>{conditioningScale / 100}</span>
              <br />
              <span style={{ color: 'var(--text-muted)' }}>{'}'}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
