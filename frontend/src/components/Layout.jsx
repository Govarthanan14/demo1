import   { useState } from 'react'
import { useAuth } from '../context/AuthContext'
import { Bell, User, LogOut, Settings, Edit, Menu, X, MoreVertical } from 'lucide-react'
import Logo from './Logo'
import ThemeToggle from './ThemeToggle'
import Modal from './Modal'
import NotificationDropdown from './NotificationDropdown'
import AIAssistant from './AIAssistant' 

const Layout = ({ children, sidebarItems = [] }) => {
  const { user, logout, updateUser } = useAuth()
  const [showUserMenu, setShowUserMenu] = useState(false)
  const [showEditModal, setShowEditModal] = useState(false)
  const [showMoreModal, setShowMoreModal] = useState(false)
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false)
  const [editForm, setEditForm] = useState({
    name: user?.name || '',
    email: user?.email || ''
  })

  const handleSaveProfile = () => {
    updateUser(editForm)
    setShowEditModal(false)
  } 

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <nav className="bg-white dark:bg-gray-800 shadow-sm border-b border-gray-200 dark:border-gray-700">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
                       <div className="flex items-center animate-slide-in">
              <Logo />
            </div> 
            
                       <div className="flex items-center space-x-4">
              <ThemeToggle />
              
                           <NotificationDropdown /> 
              
              <div className="relative">
                <button
                  onClick={() => setShowUserMenu(!showUserMenu)}
                  className="flex items-center space-x-2 p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
                >
                  <User className="w-5 h-5 text-gray-600 dark:text-gray-400" />
                  <span className="text-sm font-medium text-gray-900 dark:text-white">{user?.name}</span>
                </button> 
                
                               {showUserMenu && (
                  <div className="absolute right-0 mt-2 w-72 bg-white/90 dark:bg-gray-800/90 backdrop-blur-xl rounded-2xl shadow-2xl border border-white/20 dark:border-gray-700/50 z-50 glass-effect animate-bounce-in"> 
                                       <div className="p-4 border-b border-gray-200 dark:border-gray-700">
                      <div className="flex items-center space-x-3">
                        <div className="w-12 h-12 bg-blue-100 dark:bg-blue-900 rounded-full flex items-center justify-center overflow-hidden">
                          {user?.profilePhoto ? (
                            <img src={user.profilePhoto} alt="Profile" className="w-full h-full object-cover" />
                          ) : (
                            <User className="w-6 h-6 text-blue-600 dark:text-blue-400" />
                          )}
                        </div>
                        <div>
                          <p className="font-medium text-gray-900 dark:text-white">{user?.name}</p>
                          <p className="text-sm text-gray-500 dark:text-gray-400">{user?.email}</p>
                          <p className="text-xs text-blue-600 dark:text-blue-400">ID: {user?.specialId}</p>
                          <p className="text-xs text-blue-600 dark:text-blue-400 capitalize">{user?.role}</p>
                        </div>
                      </div>
                    </div> 
                    <div className="p-2">
                      <button
                        onClick={() => {
                          setShowEditModal(true)
                          setShowUserMenu(false)
                        }}
                        className="w-full flex items-center space-x-2 p-2 text-left hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
                      >
                        <Edit className="w-4 h-4 text-gray-500" />
                        <span className="text-sm text-gray-700 dark:text-gray-300">Edit Profile</span>
                      </button>
                      <button
                        onClick={logout}
                        className="w-full flex items-center space-x-2 p-2 text-left hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
                      >
                        <LogOut className="w-4 h-4 text-gray-500" />
                        <span className="text-sm text-gray-700 dark:text-gray-300">Logout</span>
                      </button>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </nav>

           <div className="flex">
               <aside className={`${sidebarCollapsed ? 'w-16' : 'w-64'} bg-white/95 dark:bg-gray-800/95 backdrop-blur-xl h-screen shadow-xl border-r border-white/30 dark:border-gray-700/50 sidebar glass-effect`}> 
          <div className="p-4 border-b border-gray-200 dark:border-gray-700">
            <button
              onClick={() => setSidebarCollapsed(!sidebarCollapsed)}
              className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
            >
              {sidebarCollapsed ? <Menu className="w-5 h-5" /> : <X className="w-5 h-5" />}
            </button>
          </div>
          <nav className="mt-4 px-4">
            <div className="space-y-2">
              {sidebarItems.map((item, index) => (
                <button
                  key={index}
                  onClick={item.onClick}
                                   className={`sidebar-item ${sidebarCollapsed ? 'justify-center px-2' : 'space-x-3 px-4'} ${
                    item.active 
                      ? 'active' 
                      : 'text-gray-700 dark:text-gray-300'
                  }`} 
                  title={sidebarCollapsed ? item.name : ''}
                >
                  <item.icon className="w-5 h-5 flex-shrink-0" />
                  {!sidebarCollapsed && <span className="font-medium">{item.name}</span>}
                </button>
              ))}
            </div>
          </nav>
        </aside>

        <main className="flex-1 p-6">
          {children}
               </main>
      </div>
      
      <AIAssistant />

           <Modal 
        isOpen={showMoreModal}
        onClose={() => setShowMoreModal(false)}
        title="User Information"
      >
        <div className="space-y-4">
          <div className="text-center mb-6">
            <div className="w-20 h-20 bg-blue-100 dark:bg-blue-900 rounded-full flex items-center justify-center mx-auto mb-3 overflow-hidden">
              {user?.profilePhoto ? (
                <img src={user.profilePhoto} alt="Profile" className="w-full h-full object-cover" />
              ) : (
                <User className="w-10 h-10 text-blue-600 dark:text-blue-400" />
              )}
            </div>
            <h3 className="text-lg font-medium text-gray-900 dark:text-white">{user?.name}</h3>
          </div>
          
          <div className="space-y-3">
            <div className="flex justify-between py-2 border-b border-gray-200 dark:border-gray-600">
              <span className="text-sm font-medium text-gray-600 dark:text-gray-400">Special ID:</span>
              <span className="text-sm text-gray-900 dark:text-white">{user?.specialId}</span>
            </div>
            <div className="flex justify-between py-2 border-b border-gray-200 dark:border-gray-600">
              <span className="text-sm font-medium text-gray-600 dark:text-gray-400">Name:</span>
              <span className="text-sm text-gray-900 dark:text-white">{user?.name}</span>
            </div>
            <div className="flex justify-between py-2 border-b border-gray-200 dark:border-gray-600">
              <span className="text-sm font-medium text-gray-600 dark:text-gray-400">Email:</span>
              <span className="text-sm text-gray-900 dark:text-white">{user?.email}</span>
            </div>
            <div className="flex justify-between py-2 border-b border-gray-200 dark:border-gray-600">
              <span className="text-sm font-medium text-gray-600 dark:text-gray-400">Role:</span>
              <span className="text-sm text-gray-900 dark:text-white capitalize">{user?.role}</span>
            </div>
            <div className="flex justify-between py-2">
              <span className="text-sm font-medium text-gray-600 dark:text-gray-400">Status:</span>
              <span className="text-sm text-green-600 dark:text-green-400">Active</span>
            </div>
          </div>

          <div className="pt-4 space-y-2">
            <input
              type="file"
              accept="image/*"
              onChange={(e) => {
                const file = e.target.files[0]
                if (file) {
                  const reader = new FileReader()
                  reader.onload = (e) => {
                    const photoUrl = e.target.result
                    localStorage.setItem(`profilePhoto_${user.email}`, photoUrl)
                    updateUser({ profilePhoto: photoUrl })
                  }
                  reader.readAsDataURL(file)
                }
              }}
              className="w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-medium file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
            />
            <button
              onClick={() => {
                setShowMoreModal(false)
                setShowEditModal(true)
              }}
              className="w-full bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 transition-colors"
            >
              Edit Profile
            </button>
          </div>
        </div>
      </Modal> 

      <Modal
        isOpen={showEditModal}
        onClose={() => setShowEditModal(false)}
        title="Edit Profile"
      >
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Name
            </label>
            <input
              type="text"
              value={editForm.name}
              onChange={(e) => setEditForm({...editForm, name: e.target.value})}
              className="w-full p-2 border border-gray-300 dark:border-gray-600 rounded-lg dark:bg-gray-700 dark:text-white"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Email
            </label>
            <input
              type="email"
              value={editForm.email}
              onChange={(e) => setEditForm({...editForm, email: e.target.value})}
              className="w-full p-2 border border-gray-300 dark:border-gray-600 rounded-lg dark:bg-gray-700 dark:text-white"
            />
          </div>
          <div className="flex space-x-2 pt-4">
            <button
              onClick={handleSaveProfile}
              className="flex-1 bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 transition-colors"
            >
              Save Changes
            </button>
            <button
              onClick={() => setShowEditModal(false)}
              className="flex-1 bg-gray-300 dark:bg-gray-600 text-gray-700 dark:text-gray-300 py-2 px-4 rounded-lg hover:bg-gray-400 dark:hover:bg-gray-500 transition-colors"
            >
              Cancel
            </button>
          </div>
        </div>
      </Modal>
    </div>
  )
}

export default Layout
 