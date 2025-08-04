import  { createContext, useContext, useState } from 'react'

const AuthContext = createContext()

export const useAuth = () => useContext(AuthContext)

export  const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null)

  const login = (credentials) => {
    const users = {
      'gokul.recruiter@gmail.com': { password: 'recruit@123', role: 'recruiter', name: 'Gokul Kumar', specialId: 'REC001' },
      'govardhnan.recruiter@gmail.com': { password: 'gova@123', role: 'recruiter', name: 'Govardhnan', specialId: 'REC002' },
      'harini.requestor@gmail.com': { password: 'harinik@123', role: 'requestor', name: 'Harini Krishnan', specialId: 'REQ001' },
      'kovarthini.requestor@gmail.com': { password: 'kova@123', role: 'requestor', name: 'Kovarthini', specialId: 'REQ002' },
      'candidate@gmail.com': { password: 'candi@123', role: 'candidate', name: 'John Candidate', specialId: 'CAN001' }
    }

    const userData = users[credentials.email]
    if (userData && userData.password === credentials.password) {
      setUser({ 
        ...userData, 
        email: credentials.email,
        profilePhoto: localStorage.getItem(`profilePhoto_${credentials.email}`) || null,
        loginTime: new Date().getTime()
      })
      return { success: true }
    }
    return { success: false }
  } 

  const logout = () => setUser(null)

  const updateUser = (data) => {
    setUser(prev => ({ ...prev, ...data }))
  }

  return (
    <AuthContext.Provider value={{ user, login, logout, updateUser }}>
      {children}
    </AuthContext.Provider>
  )
}
 