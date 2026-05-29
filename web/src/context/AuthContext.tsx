import { createContext, useContext, useState, useCallback } from 'react'

export interface AuthUser {
  id: string
  fullName: string
  email: string
  username: string
}

interface StoredUser extends AuthUser {
  password: string
}

interface AuthContextType {
  user: AuthUser | null
  login: (emailOrUsername: string, password: string) => string | null
  signup: (fullName: string, email: string, username: string, password: string) => string | null
  logout: () => void
}

const USERS_KEY = 'mascot_users'
const SESSION_KEY = 'mascot_session'

function loadUsers(): StoredUser[] {
  try { return JSON.parse(localStorage.getItem(USERS_KEY) || '[]') } catch { return [] }
}

function saveUsers(users: StoredUser[]) {
  localStorage.setItem(USERS_KEY, JSON.stringify(users))
}

const AuthContext = createContext<AuthContextType | null>(null)

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<AuthUser | null>(() => {
    try {
      const raw = localStorage.getItem(SESSION_KEY)
      return raw ? JSON.parse(raw) : null
    } catch { return null }
  })

  const login = useCallback((emailOrUsername: string, password: string): string | null => {
    const users = loadUsers()
    const match = users.find(
      u => (u.email.toLowerCase() === emailOrUsername.toLowerCase() ||
            u.username.toLowerCase() === emailOrUsername.toLowerCase()) &&
           u.password === password
    )
    if (!match) return 'Incorrect email/username or password.'
    const session: AuthUser = { id: match.id, fullName: match.fullName, email: match.email, username: match.username }
    localStorage.setItem(SESSION_KEY, JSON.stringify(session))
    setUser(session)
    return null
  }, [])

  const signup = useCallback((fullName: string, email: string, username: string, password: string): string | null => {
    const users = loadUsers()
    if (users.some(u => u.email.toLowerCase() === email.toLowerCase()))
      return 'An account with this email already exists.'
    if (users.some(u => u.username.toLowerCase() === username.toLowerCase()))
      return 'This username is already taken.'
    const newUser: StoredUser = {
      id: crypto.randomUUID(),
      fullName: fullName.trim(),
      email: email.toLowerCase().trim(),
      username: username.trim(),
      password,
    }
    saveUsers([...users, newUser])
    return null
  }, [])

  const logout = useCallback(() => {
    localStorage.removeItem(SESSION_KEY)
    setUser(null)
  }, [])

  return (
    <AuthContext.Provider value={{ user, login, signup, logout }}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const ctx = useContext(AuthContext)
  if (!ctx) throw new Error('useAuth must be used inside AuthProvider')
  return ctx
}
