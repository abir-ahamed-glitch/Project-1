import { Box, Play, Layers, Globe, Zap, Smartphone, ExternalLink, Sparkles, FileText, Activity } from 'lucide-react'
import { useNavigate } from 'react-router-dom'
import { useLanguage } from '../context/LanguageContext'

const arExperiences = [
  {
    id: 'ar-1',
    title: '3D Product Visualization',
    desc: 'Let customers visualize products in their own space with high-fidelity 3D models and realistic textures.',
    icon: Box,
    status: 'Ready',
    tags: ['E-commerce', 'Retails']
  },
  {
    id: 'ar-2',
    title: 'Interactive Spatial Tours',
    desc: 'Transform any scanned physical location into a digital gateway for virtual tours and hidden spatial content.',
    icon: Globe,
    status: 'Beta',
    tags: ['Real Estate', 'Tourism']
  },
  {
    id: 'ar-3',
    title: 'AR Holographic Salespiece',
    desc: 'Launch a life-sized holographic representative directly from your business card or marketing collateral.',
    icon: Zap,
    status: 'Ready',
    tags: ['Marketing', 'B2B']
  }
]

export default function WebAR() {
  const { t } = useLanguage()
  const navigate = useNavigate()

  return (
    <div className="animate-fade-in">
      <div className="page-header">
        <h1 className="page-title">
          <Box size={28} style={{ color: 'var(--accent-secondary)', display: 'inline', verticalAlign: 'middle', marginRight: 8 }} />
          {t('webarTitle')}
        </h1>
        <p className="page-subtitle">
          {t('webarSubtitle')}
        </p>
      </div>

      <div className="ar-banner mb-32 flex-col-mobile">
        <div className="ar-banner-content">
          <h2 className="ar-banner-title">{t('turnPhysicalDigital')}</h2>
          <p className="ar-banner-desc">
            {t('webarBannerDesc')}
          </p>
          <div className="flex gap-12">
            <button className="btn btn-primary" onClick={() => navigate('/generator')}>
              <Play size={16} fill="white" /> {t('launchCreator')}
            </button>
            <button className="btn btn-secondary" onClick={() => window.open('https://docs.qrforall.ai', '_blank')}>
              <FileText size={16} /> {t('documentation')}
            </button>
          </div>
        </div>
        <div className="flex-shrink-0 flex items-center justify-center" style={{ width: 240 }}>
           <div style={{ position: 'relative' }}>
             <Smartphone size={120} strokeWidth={1} style={{ opacity: 0.5, color: 'var(--accent-primary)' }} />
             <div style={{ 
              position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)',
              width: 80, height: 80, borderRadius: 'var(--radius-lg)', background: 'var(--gradient-accent)',
              display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: 'var(--shadow-glow)'
             }}>
                <Box size={40} color="white" />
             </div>
           </div>
        </div>
      </div>

      <div className="section-title">
        {t('availableBlueprints')}
        <div className="section-title-line" />
      </div>

      <div className="grid-3 mb-32 stagger-children">
        {arExperiences.map((exp) => {
          const Icon = exp.icon
          return (
            <div key={exp.id} className="glass-card feature-card">
               <div className="feature-card-icon teal">
                  <Icon size={24} />
               </div>
               <h3 className="mb-8">{exp.title}</h3>
               <p className="text-sm text-muted mb-16">{exp.desc}</p>
               <div className="flex flex-wrap gap-8 justify-center mb-16">
                  {exp.tags.map(tag => (
                    <span key={tag} className="badge badge-purple">{tag}</span>
                  ))}
               </div>
               <div className="flex items-center justify-between pt-16" style={{ borderTop: '1px solid var(--border-glass)' }}>
                  <span className="badge badge-teal">{exp.status}</span>
                  <button className="btn btn-ghost btn-sm">
                    {t('edit')} <ExternalLink size={12} style={{marginLeft: 4}} />
                  </button>
               </div>
            </div>
          )
        })}
      </div>

      <div className="grid-2">
         <div className="glass-card">
            <h3 className="section-title">
              <Layers size={16} style={{ color: 'var(--accent-primary)' }} />
              {t('activeArAnchors')}
            </h3>
            <div className="table-container">
              <table className="table">
                <thead>
                  <tr>
                    <th>{t('qrAnchor')}</th>
                    <th>{t('experience')}</th>
                    <th>{t('sessions')}</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td><span className="font-mono text-xs">qr-prd-001</span></td>
                    <td>Running Shoe 3D</td>
                    <td className="font-mono">1,240</td>
                  </tr>
                  <tr>
                    <td><span className="font-mono text-xs">qr-prd-002</span></td>
                    <td>Active Desk Model</td>
                    <td className="font-mono">856</td>
                  </tr>
                  <tr>
                    <td><span className="font-mono text-xs">qr-evt-005</span></td>
                    <td>Main Stage Portal</td>
                    <td className="font-mono">3,412</td>
                  </tr>
                </tbody>
              </table>
            </div>
         </div>

         <div className="glass-card glass-card-accent">
            <h3 className="section-title">
              <Sparkles size={16} style={{ color: 'var(--accent-primary)' }} />
              {t('arOptimizationAi')}
            </h3>
            <div className="flex flex-col gap-12">
               <div className="glass-card" style={{ padding: 12, background: 'rgba(255,255,255,0.02)' }}>
                  <p className="text-sm"><strong>{t('polygonCrunching')}:</strong> Successfully optimized "Shoe_Final_Mesh" from 250k to 12k polys for faster loading.</p>
               </div>
               <div className="glass-card" style={{ padding: 12, background: 'rgba(255,255,255,0.02)' }}>
                  <p className="text-sm"><strong>{t('lightingAnalysis')}:</strong> Detected low contrast at "London_Store_01". Suggesting higher emissive materials.</p>
               </div>
               <button 
                  className="btn btn-primary w-full mt-4" 
                  style={{ justifyContent: 'center' }}
                  onClick={() => alert(t('auditStarted'))}
                >
                  <Activity size={16} /> {t('runFullAudit')}
               </button>
            </div>
         </div>
      </div>
    </div>
  )
}
