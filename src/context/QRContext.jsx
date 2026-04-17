import { createContext, useContext, useState, useEffect } from 'react'
import { useAuth } from './AuthContext'

const QRContext = createContext()

export function useQR() {
  return useContext(QRContext)
}

export function QRProvider({ children }) {
  const { currentUser } = useAuth()
  const [qrCodes, setQrCodes] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (currentUser) {
      const savedQRs = localStorage.getItem(`qr_codes_${currentUser.id}`)
      if (savedQRs) {
        setQrCodes(JSON.parse(savedQRs))
      } else {
        setQrCodes([])
      }
    } else {
      setQrCodes([])
    }
    setLoading(false)
  }, [currentUser])

  function saveQR(qrData) {
    if (!currentUser) throw new Error('You must be logged in to save QR codes')
    const newQR = {
      ...qrData,
      id: Date.now().toString(),
      created: new Date().toLocaleDateString(),
      status: 'active',
      scans: 0,
      versions: [{ v: 1, url: qrData.url, date: new Date().toLocaleDateString(), by: currentUser.name || currentUser.email, tag: 'current' }],
      auditTrail: [{ time: new Date().toLocaleTimeString(), action: 'Created project', user: currentUser.name || currentUser.email }]
    }
    const updatedQRs = [newQR, ...qrCodes]
    setQrCodes(updatedQRs)
    localStorage.setItem(`qr_codes_${currentUser.id}`, JSON.stringify(updatedQRs))
    return newQR
  }

  function deleteQR(id) {
    const updatedQRs = qrCodes.filter(qr => qr.id !== id)
    setQrCodes(updatedQRs)
    localStorage.setItem(`qr_codes_${currentUser.id}`, JSON.stringify(updatedQRs))
  }

  function updateQR(id, updates) {
    const updatedQRs = qrCodes.map(qr => {
      if (qr.id === id) {
        const newVersion = updates.url ? { 
          v: qr.versions.length + 1, 
          url: updates.url, 
          date: new Date().toLocaleDateString(), 
          by: currentUser.name || currentUser.email, 
          tag: 'current' 
        } : null
        
        const versions = newVersion ? 
          qr.versions.map(v => ({ ...v, tag: null })).concat(newVersion) : 
          qr.versions

        return { 
          ...qr, 
          ...updates, 
          versions,
          auditTrail: [{ 
            time: new Date().toLocaleTimeString(), 
            action: updates.url ? 'Updated URL' : 'Updated project', 
            user: currentUser.name || currentUser.email 
          }, ...qr.auditTrail]
        }
      }
      return qr
    })
    setQrCodes(updatedQRs)
    localStorage.setItem(`qr_codes_${currentUser.id}`, JSON.stringify(updatedQRs))
  }

  const value = {
    qrCodes,
    loading,
    saveQR,
    deleteQR,
    updateQR
  }

  return (
    <QRContext.Provider value={value}>
      {children}
    </QRContext.Provider>
  )
}
