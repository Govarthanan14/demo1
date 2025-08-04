import   { Users, FileText, Mail, BarChart3, Activity, Clock } from 'lucide-react'

const AdminDashboard = () => {
  const stats = [
    { label: 'Total Users', value: '1,234', icon: Users, change: '+12%', color: 'blue' },
    { label: 'Active Recruiters', value: '89', icon: Activity, change: '+5%', color: 'green' },
    { label: 'Candidates', value: '567', icon: Users, change: '+23%', color: 'purple' },
    { label: 'AR Requestors', value: '45', icon: Clock, change: '+8%', color: 'orange' }
  ]

  const recentActivity = [
    { user: 'John Recruiter', action: 'Uploaded new JD', time: '2 hours ago' },
    { user: 'Sarah Candidate', action: 'Applied for position', time: '3 hours ago' },
    { user: 'Mike AR', action: 'Requested consultant', time: '5 hours ago' }
  ]

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Admin Dashboard</h1>
      
           <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        {stats.map((stat, index) => (
          <div key={index} className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow">
            <div className="flex items-center justify-between">
              <div className="flex items-center min-w-0 flex-1">
                <div className={`p-2 rounded-lg bg-${stat.color}-100 flex-shrink-0`}>
                  <stat.icon className={`h-4 w-4 text-${stat.color}-600`} />
                </div>
                <div className="ml-2 min-w-0 flex-1">
                  <p className="text-xs font-medium text-gray-600 dark:text-gray-400 truncate">{stat.label}</p>
                  <p className="text-base font-bold text-gray-900 dark:text-white truncate">{stat.value}</p>
                </div>
              </div>
              <span className="text-xs text-green-600 flex-shrink-0 ml-2">{stat.change}</span>
            </div>
          </div>
        ))} 
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow">
          <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-4">Recent Activity</h3>
          <div className="space-y-3">
            {recentActivity.map((activity, index) => (
              <div key={index} className="flex justify-between items-center py-2">
                <div>
                  <p className="text-sm font-medium text-gray-900 dark:text-white">{activity.user}</p>
                  <p className="text-xs text-gray-600 dark:text-gray-400">{activity.action}</p>
                </div>
                <span className="text-xs text-gray-500 dark:text-gray-500">{activity.time}</span>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow">
          <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-4">System Health</h3>
          <div className="space-y-3">
            <div className="flex justify-between items-center">
              <span className="text-sm text-gray-600 dark:text-gray-400">Server Status</span>
              <span className="text-sm text-green-600">Online</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm text-gray-600 dark:text-gray-400">Database</span>
              <span className="text-sm text-green-600">Connected</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm text-gray-600 dark:text-gray-400">Email Service</span>
              <span className="text-sm text-green-600">Active</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  ) 
}

export default AdminDashboard
 