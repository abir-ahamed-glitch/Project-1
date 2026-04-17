import { createContext, useContext, useState, useEffect } from 'react'

const AuthContext = createContext()

export function useAuth() {
  return useContext(AuthContext)
}

const DEFAULT_USER = {
  id: 'demo-user-123',
  email: 'demo@qrfpall.com',
  name: 'Demo User',
  role: 'Pro User',
  joinDate: new Date().toISOString(),
  twoFA: false,
  notifications: { loginAlerts: true, scanAlerts: true, weeklyReport: false }
}

export function AuthProvider({ children }) {
  const [currentUser, setCurrentUser] = useState(() => {
    const savedUser = localStorage.getItem('qr_auth_user')
    return savedUser ? JSON.parse(savedUser) : DEFAULT_USER
  })

  useEffect(() => {
    localStorage.setItem('qr_auth_user', JSON.stringify(currentUser))
  }, [currentUser])

  function login(email, password) {
    // No-op or simulated
    return currentUser
  }

  function signup(email, password, name) {
    // No-op or simulated
    return currentUser
  }

  function logout() {
    // We'll just keep the default user for now
    setCurrentUser(DEFAULT_USER)
  }

  function updateUser(updates) {
    setCurrentUser(prev => ({ ...prev, ...updates }))
  }

  function changePassword(newPassword) {
    // Simulated success
    console.log('Password changed to:', newPassword)
  }

  const value = {
    currentUser,
    signup,
    login,
    logout,
    updateUser,
    changePassword
  }

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  )
}

