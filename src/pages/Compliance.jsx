import { ShieldCheck, Database, FileText, CheckCircle, Clock, AlertTriangle, Scale, Lock } from 'lucide-react'

import { useLanguage } from '../context/LanguageContext'

export default function Compliance() {
  const { t } = useLanguage()

  return (
    <div className="animate-fade-in">
      <div className="page-header">
        <h1 className="page-title">
          <ShieldCheck size={28} style={{ color: 'var(--accent-success)', display: 'inline', verticalAlign: 'middle', marginRight: 8 }} />
          {t('complianceTitle')}
        </h1>
        <p className="page-subtitle">
          {t('complianceSubtitle')}
        </p>
      </div>

      <div className="grid-2 mb-24">
        <div className="glass-card">
          <h3 className="section-title">
            <Database size={16} style={{ color: 'var(--accent-primary)' }} />
            {t('dataPersistenceStatus')}
          </h3>
          <div className="flex flex-col gap-16 mt-16">
            <div className="flex items-center justify-between p-16 glass-card" style={{ background: 'rgba(0,184,148,0.05)', borderColor: 'rgba(0,184,148,0.2)' }}>
               <div className="flex items-center gap-12">
                  <div className="compliance-icon" style={{ width: 36, height: 36, fontSize: 16 }}>
                    <CheckCircle size={18} />
                  </div>
                  <div>
                    <h4 className="text-sm font-bold">{t('tenYearGuarantee')}</h4>
                    <p className="text-xs text-muted">{t('dppDataStoreDesc')}</p>
                  </div>
               </div>
               <span className="badge badge-success">ACTIVE</span>
            </div>

            <div className="flex items-center justify-between p-16 glass-card" style={{ background: 'rgba(108, 92, 231, 0.05)', borderColor: 'rgba(108, 92, 231, 0.2)' }}>
               <div className="flex items-center gap-12">
                  <div className="compliance-icon" style={{ width: 36, height: 36, fontSize: 16, background: 'rgba(108, 92, 231, 0.12)', color: 'var(--accent-primary)' }}>
                    <Scale size={18} />
                  </div>
                  <div>
                    <h4 className="text-sm font-bold">{t('regulatoryAlignment')}</h4>
                    <p className="text-xs text-muted">{t('regulatoryDesc')}</p>
                  </div>
               </div>
               <span className="badge badge-purple">V2.4</span>
            </div>
          </div>
        </div>

        <div className="glass-card">
           <h3 className="section-title">
            <Lock size={16} style={{ color: 'var(--accent-secondary)' }} />
            {t('immutableAuditLog')}
          </h3>
          <div className="flex flex-col gap-12">
            {[
              { time: '2026-03-16 10:22 AM', event: 'Encryption keys rotated', status: 'Secure' },
              { time: '2026-03-15 04:45 PM', event: 'DPP Schema Update v1.2', status: 'Applied' },
              { time: '2026-03-14 09:12 AM', event: 'Third-party compliance audit', status: 'Passed' },
            ].map((entry, i) => (
              <div key={i} className="flex justify-between items-center text-xs p-12 border-glass" style={{ borderBottomWidth: 1 }}>
                <div>
                   <div style={{ color: 'white', fontWeight: 600 }}>{entry.event}</div>
                   <div style={{ color: 'var(--text-muted)', marginTop: 2 }}>{entry.time}</div>
                </div>
                <span className="badge badge-teal">{entry.status}</span>
              </div>
            ))}
            <button className="btn btn-ghost btn-sm w-full mt-4" onClick={() => alert(t('ledgerDownloaded'))}>{t('viewFullLedger')}</button>
          </div>
        </div>
      </div>

      <div className="glass-card mb-24">
        <h3 className="section-title">
          <FileText size={16} style={{ color: 'var(--accent-primary)' }} />
          {t('activeDpps')}
        </h3>
        <div className="table-container">
          <table className="table">
            <thead>
              <tr>
                <th>{t('productId')}</th>
                <th>{t('category')}</th>
                <th>{t('manufacturer')}</th>
                <th>{t('lastUpdated')}</th>
                <th>{t('persistence')}</th>
                <th>{t('status')}</th>
              </tr>
            </thead>
            <tbody>
              {[
                { id: 'DPP-TXT-4822', cat: 'Textiles', mfr: 'EcoThread GmbH', date: '2026-02-14', years: '10/10' },
                { id: 'DPP-BATT-9921', cat: 'Batteries', mfr: 'VoltShift Energy', date: '2026-03-01', years: '10/10' },
                { id: 'DPP-ELEC-0032', cat: 'Electronics', mfr: 'Silica Circuits', date: '2026-01-20', years: '10/10' },
                { id: 'DPP-CON-7721', cat: 'Construction', mfr: 'HardRock Materials', date: '2025-12-15', years: '9/10' },
              ].map((dpp, i) => (
                <tr key={i}>
                  <td className="font-mono" style={{ color: 'var(--accent-primary)', fontSize: 12 }}>{dpp.id}</td>
                  <td>{dpp.cat}</td>
                  <td>{dpp.mfr}</td>
                  <td className="text-muted">{dpp.date}</td>
                  <td>
                     <div className="flex items-center gap-8">
                       <span className="text-xs">{dpp.years} yrs</span>
                       <div className="progress-bar" style={{ width: 60 }}>
                          <div className="progress-bar-fill teal" style={{ width: '100%' }} />
                       </div>
                     </div>
                  </td>
                  <td><span className="badge badge-success">Compliant</span></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <div className="ar-banner" style={{ background: 'rgba(225, 112, 85, 0.05)', borderColor: 'rgba(225, 112, 85, 0.2)' }}>
         <div className="ar-banner-content">
            <h3 style={{ color: 'var(--accent-danger)', display: 'flex', alignItems: 'center', gap: 8, marginBottom: 8 }}>
              <AlertTriangle size={20} /> {t('urgentAction')}
            </h3>
            <p className="text-sm text-muted">
              {t('complianceAlert')}
              <strong> 12 of your active products </strong> require updated sustainability disclosures.
            </p>
         </div>
         <button 
          className="btn btn-primary" 
          style={{ background: 'var(--accent-danger)', boxShadow: 'none' }}
          onClick={() => alert(t('remediationStarted'))}
        >
            {t('remediateNow')}
         </button>
      </div>
    </div>
  )
}
