'use client'
import { createContext, useContext, useState, useEffect } from 'react'
import type { ReactNode } from 'react'

interface User {
    userId: number
    firstName: string
    lastName: string
    email: string
    role: string
    profilePicture?: string
    bio?: string
    dateOfBirth?: string
    gender?: string
    experienceYears?: number
    overallRating?: number
}

interface AuthContextType {
    user: User | null
    token: string | null
    login: (token: string, user: User) => void
    logout: () => void
    isLoggedIn: boolean
    refreshUser: () => Promise<void>
}

const AuthContext = createContext<AuthContextType | null>(null)

export function AuthProvider({ children }: { children: ReactNode }) {
    const [user, setUser] = useState<User | null>(null)
    const [token, setToken] = useState<string | null>(null)

    async function fetchFullProfile(savedToken: string, currentRole?: string) {
        try {
            const role = currentRole || 'Student'

            // Admin has no profile endpoint
            if (role === 'Admin') return

            const endpoint = role === 'Instructor'
                ? 'https://localhost:7167/api/Instructor/profile'
                : 'https://localhost:7167/api/Student/profile'

            const response = await fetch(endpoint, {
                headers: {
                    'Authorization': `Bearer ${savedToken}`,
                    'Content-Type': 'application/json',
                },
            })

            if (response.ok) {
                const data = await response.json()

                const fullUser = {
                    userId: data.studentID || data.instructorID,
                    firstName: data.firstName,
                    lastName: data.lastName,
                    email: data.email,
                    role: role,
                    profilePicture: data.profilePicture || '',
                    bio: data.bio || '',
                    dateOfBirth: data.dateOfBirth || '',
                    gender: data.gender || '',
                    experienceYears: data.experienceYears || 0,
                    overallRating: data.overallRating || 0,
                }

                setUser(fullUser)
                localStorage.setItem('user', JSON.stringify(fullUser))
            }
        } catch {
            // keep existing user data
        }
    }

    useEffect(() => {
        try {
            const savedToken = localStorage.getItem('token')
            const savedUser = localStorage.getItem('user')
            if (savedToken && savedUser && savedUser !== 'undefined') {
                const parsedUser = JSON.parse(savedUser)
                setToken(savedToken)
                setUser(parsedUser)
                // fetch fresh profile to get latest profilePicture
                fetchFullProfile(savedToken, parsedUser.role)
            }
        } catch {
            localStorage.removeItem('token')
            localStorage.removeItem('user')
        }
    }, [])

    function login(newToken: string, newUser: User) {
        setToken(newToken)
        setUser(newUser)
        localStorage.setItem('token', newToken)
        localStorage.setItem('user', JSON.stringify(newUser))
        // fetch full profile after login
        fetchFullProfile(newToken, newUser.role)
    }

    function logout() {
        setToken(null)
        setUser(null)
        localStorage.removeItem('token')
        localStorage.removeItem('user')
    }

    async function refreshUser() {
        if (token) await fetchFullProfile(token)
    }

    return (
        <AuthContext.Provider value={{
            user, token, login, logout,
            isLoggedIn: !!token,
            refreshUser,
        }}>
            {children}
        </AuthContext.Provider>
    )
}

export function useAuth() {
    const context = useContext(AuthContext)
    if (!context) throw new Error('useAuth must be used inside AuthProvider')
    return context
}