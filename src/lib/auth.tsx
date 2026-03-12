import React, { createContext, useContext, useState } from 'react'

interface User {
  id: string
  name: string
  email: string
}

interface AuthContextValue {
  user: User | null
  signIn: (email: string, password: string) => Promise<void>
  signOut: () => void
  isLoaded: boolean
}

const AuthContext = createContext<AuthContextValue>({
  user: null,
  signIn: async () => {},
  signOut: () => {},
  isLoaded: true,
})

export function useAuth() {
  return useContext(AuthContext)
}

// Mock auth for development (no Clerk key required)
export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(() => {
    try {
      const saved = localStorage.getItem('ol_mock_user')
      return saved ? JSON.parse(saved) : null
    } catch { return null }
  })

  async function signIn(email: string, _password: string) {
    const u = { id: 'mock-user-1', name: email.split('@')[0], email }
    setUser(u)
    localStorage.setItem('ol_mock_user', JSON.stringify(u))
  }

  function signOut() {
    setUser(null)
    localStorage.removeItem('ol_mock_user')
  }

  return (
    <AuthContext.Provider value={{ user, signIn, signOut, isLoaded: true }}>
      {children}
    </AuthContext.Provider>
  )
}

export function ProtectedRoute({ children }: { children: React.ReactNode }) {
  const { user, isLoaded } = useAuth()
  const [, navigate] = [null, (path: string) => { window.location.href = path }]

  if (!isLoaded) return <div className="flex items-center justify-center min-h-[400px]"><div className="animate-spin w-6 h-6 border-2 border-[#FF6B35] border-t-transparent rounded-full" /></div>

  if (!user) {
    window.location.href = '/sign-in'
    return null
  }

  return <>{children}</>
}
