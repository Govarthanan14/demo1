import   { useState, useEffect } from 'react' 
import { Users, FileText, BarChart3, Upload, MessageCircle, Settings, Trash } from 'lucide-react'
import Layout from '../components/Layout'
import MessagingSystem from '../components/MessagingSystem'
import { useAuth } from '../context/AuthContext' 

const   RecruiterDashboard = () => {
  const [activeTab, setActiveTab] = useState('overview')
  const [jdFile, setJdFile] = useState(null)
  const [resumeFiles, setResumeFiles] = useState([])
  const [analysisResults, setAnalysisResults] = useState(null)
  const [candidateApplications, setCandidateApplications] = useState([])
  const [resumeRankings, setResumeRankings] = useState([])
  const { user } = useAuth()

  useEffect(() => {
    const applications = JSON.parse(localStorage.getItem('candidateApplications') || '[]')
    setCandidateApplications(applications)
    
    const rankings = JSON.parse(localStorage.getItem('resumeRankings') || '[]')
    setResumeRankings(rankings)
  }, [])

  const updateResumeScore = (applicationId, score) => {
    const updatedRankings = resumeRankings.map(ranking => 
      ranking.id === applicationId ? { ...ranking, score } : ranking
    )
    
    const newRanking = candidateApplications.find(app => app.id === applicationId && !resumeRankings.find(r => r.id === applicationId))
    if (newRanking) {
      updatedRankings.push({ ...newRanking, score })
    }
    
    setResumeRankings(updatedRankings)
    localStorage.setItem('resumeRankings', JSON.stringify(updatedRankings))
  }

  const exportRankingsToCSV = () => {
    const csvData = [
      ['Candidate Name', 'Email', 'Job Role', 'Resume Score', 'Date Applied'],
      ...resumeRankings.map(ranking => [
        ranking.candidateName,
        ranking.candidateEmail,
        ranking.jobRole,
        ranking.score || 'Not scored',
        new Date(ranking.timestamp).toLocaleDateString()
      ])
    ].map(row => row.join(',')).join('\n')

    const blob = new Blob([csvData], { type: 'text/csv' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = 'resume_rankings.csv'
    a.click()
    URL.revokeObjectURL(url)

    // Notify requestor
    const notification = {
      id: Date.now(),
      message: `Resume ranking table received from ${user.name}`,
      recruiterName: user.name,
      recruiterId: user.specialId,
      timestamp: new Date().toISOString(),
      csvData: resumeRankings
    }
    
    const existingNotifications = JSON.parse(localStorage.getItem('requestorNotifications') || '[]')
    existingNotifications.push(notification)
    localStorage.setItem('requestorNotifications', JSON.stringify(existingNotifications))
  }  

   const sidebarItems = [
    { name: 'Overview', icon: BarChart3, active: activeTab === 'overview', onClick: () => setActiveTab('overview') },
    { name: 'Upload Files', icon: Upload, active: activeTab === 'upload', onClick: () => setActiveTab('upload') },
    { name: 'Applications', icon: Users, active: activeTab === 'applications', onClick: () => setActiveTab('applications') },
    { name: 'Resume Ranking', icon: BarChart3, active: activeTab === 'ranking', onClick: () => setActiveTab('ranking') },
    { name: 'Job Descriptions', icon: FileText, active: activeTab === 'jobs', onClick: () => setActiveTab('jobs') },
    { name: 'Candidates', icon: Users, active: activeTab === 'candidates', onClick: () => setActiveTab('candidates') },
    { name: 'Analysis', icon: BarChart3, active: activeTab === 'analysis', onClick: () => setActiveTab('analysis') },
    { name: 'Messages', icon: MessageCircle, active: activeTab === 'messages', onClick: () => setActiveTab('messages') },
    { name: 'Settings', icon: Settings, active: activeTab === 'settings', onClick: () => setActiveTab('settings') }
  ] 

  const stats = [
    { label: 'Total Candidates', value: '234', change: '+12%', color: 'blue' },
    { label: 'Active JDs', value: '15', change: '+3%', color: 'green' },
    { label: 'Interviews Scheduled', value: '28', change: '+8%', color: 'purple' },
    { label: 'Positions Filled', value: '7', change: '+2%', color: 'orange' }
  ]

   const candidates = [
    { name: 'Sarah Johnson', role: 'Frontend Developer', score: 94, status: 'Interview', appliedJd: 'Senior Frontend Developer' },
    { name: 'Michael Chen', role: 'Backend Developer', score: 89, status: 'Review', appliedJd: 'Backend Developer' },
    { name: 'Emma Davis', role: 'UI Designer', score: 92, status: 'Hired', appliedJd: 'UI/UX Designer' },
    { name: 'James Wilson', role: 'DevOps Engineer', score: 87, status: 'Test', appliedJd: 'DevOps Engineer' }
  ]

  const jobDescriptions = [
    { id: 1, title: 'Senior Frontend Developer', department: 'Engineering', posted: '2024-01-15' },
    { id: 2, title: 'Backend Developer', department: 'Engineering', posted: '2024-01-12' },
    { id: 3, title: 'UI/UX Designer', department: 'Design', posted: '2024-01-10' },
    { id: 4, title: 'DevOps Engineer', department: 'Operations', posted: '2024-01-08' }
  ]

  const handleJdUpload = (e) => {
    const file = e.target.files[0]
    if (file && file.type === 'application/pdf') {
      setJdFile(file)
    }
  }

  const handleResumeUpload = (e) => {
    const files = Array.from(e.target.files)
    const pdfFiles = files.filter(file => file.type === 'application/pdf')
    setResumeFiles(prev => [...prev, ...pdfFiles])
  }

  const analyzeResumes = () => {
    if (!jdFile || resumeFiles.length === 0) return
    
    const mockResults = resumeFiles.map((file, index) => ({
      fileName: file.name,
      candidateName: `Candidate ${index + 1}`,
      score: Math.floor(Math.random() * 40) + 60,
      email: `candidate${index + 1}@example.com`,
      matchedSkills: ['JavaScript', 'React', 'Node.js'].slice(0, Math.floor(Math.random() * 3) + 1)
    })).sort((a, b) => b.score - a.score)

    setAnalysisResults(mockResults)
    localStorage.setItem('analysisResults', JSON.stringify(mockResults))
    setActiveTab('analysis')
  } 

  const renderContent = () => {
    switch(activeTab) {
      case 'overview':
        return (
          <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                           {stats.map((stat, index) => (
                <div key={index} className="card p-6 animate-fade-in" style={{animationDelay: `${index * 0.1}s`}}> 
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-gray-600 dark:text-gray-400">{stat.label}</p>
                      <p className="text-2xl font-bold text-gray-900 dark:text-white">{stat.value}</p>
                    </div>
                    <div className={`text-${stat.color}-600 text-sm font-medium`}>
                      {stat.change}
                    </div>
                  </div>
                </div>
              ))}
            </div>
            
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                         <div className="card p-6 animate-slide-in"> 
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-medium text-gray-900 dark:text-white">New Applications</h3>
                  {candidateApplications.length > 0 && (
                    <span className="bg-red-100 text-red-800 text-xs px-2 py-1 rounded-full">
                      {candidateApplications.length} new
                    </span>
                  )}
                </div>
                <div className="space-y-3">
                  {candidateApplications.slice(0, 3).map((application) => (
                    <div key={application.id} className="p-3 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
                      <p className="font-medium text-blue-700 dark:text-blue-300">{application.candidateName}</p>
                      <p className="text-sm text-blue-600 dark:text-blue-400">{application.jobRole}</p>
                      <p className="text-xs text-blue-500">Applied {new Date(application.timestamp).toLocaleDateString()}</p>
                    </div>
                  ))}
                  {candidateApplications.length === 0 && (
                    <p className="text-gray-500 dark:text-gray-400 text-sm">No new applications</p>
                  )}
                </div>
              </div>
                           <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700">
                <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-4">Quick Actions</h3>
                <div className="space-y-3">
                  <button 
                    onClick={() => setActiveTab('upload')}
                    className="w-full flex items-center space-x-3 p-3 bg-blue-50 dark:bg-blue-900/20 rounded-lg hover:bg-blue-100 dark:hover:bg-blue-900/40 transition-colors"
                  >
                    <Upload className="w-5 h-5 text-blue-600 dark:text-blue-400" />
                    <span className="text-blue-700 dark:text-blue-300">Upload Files</span>
                  </button>
                  <button 
                    onClick={() => setActiveTab('applications')}
                    className="w-full flex items-center space-x-3 p-3 bg-green-50 dark:bg-green-900/20 rounded-lg hover:bg-green-100 dark:hover:bg-green-900/40 transition-colors"
                  >
                    <Users className="w-5 h-5 text-green-600 dark:text-green-400" />
                    <span className="text-green-700 dark:text-green-300">Review Applications</span>
                  </button>
                </div>
              </div> 
              
              <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700">
                <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-4">Top Candidates</h3>
                <div className="space-y-3">
                  {candidates.slice(0, 3).map((candidate, index) => (
                    <div key={index} className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-700 rounded-lg">
                      <div>
                        <p className="font-medium text-gray-900 dark:text-white">{candidate.name}</p>
                        <p className="text-sm text-gray-500 dark:text-gray-400">{candidate.role}</p>
                      </div>
                      <div className="text-right">
                        <p className="text-sm font-medium text-gray-900 dark:text-white">{candidate.score}%</p>
                        <p className="text-xs text-gray-500 dark:text-gray-400">{candidate.status}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )
           case 'upload':
        return (
          <div className="space-y-6">
            <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700">
              <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-4">Upload Job Description</h3>
              <div className="border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-lg p-6">
                <input
                  type="file"
                  accept=".pdf"
                  onChange={handleJdUpload}
                  className="w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-medium file:bg-blue-50 file:text-blue-700"
                />
                {jdFile && (
                  <p className="mt-2 text-sm text-green-600 dark:text-green-400">
                    ✓ {jdFile.name} uploaded
                  </p>
                )}
              </div>
            </div>

            <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700">
              <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-4">Upload Resumes</h3>
              <div className="border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-lg p-6">
                <input
                  type="file"
                  accept=".pdf"
                  multiple
                  onChange={handleResumeUpload}
                  className="w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-medium file:bg-blue-50 file:text-blue-700"
                />
                {resumeFiles.length > 0 && (
                  <div className="mt-4 space-y-2">
                    <p className="text-sm font-medium text-gray-700 dark:text-gray-300">
                      Uploaded files ({resumeFiles.length}):
                    </p>
                    {resumeFiles.map((file, index) => (
                      <div key={index} className="flex items-center justify-between p-2 bg-gray-50 dark:bg-gray-700 rounded">
                        <span className="text-sm text-gray-600 dark:text-gray-400">{file.name}</span>
                        <button
                          onClick={() => setResumeFiles(prev => prev.filter((_, i) => i !== index))}
                          className="text-red-500 hover:text-red-700"
                        >
                          <Trash className="w-4 h-4" />
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>

            {jdFile && resumeFiles.length > 0 && (
                             <button
                  onClick={analyzeResumes}
                  className="btn-primary w-full bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700"
                > 
                Analyze Resumes
              </button>
                       )}
          </div>
        )
      case 'applications':
        return (
          <div className="space-y-6">
            <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700">
              <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-4">Candidate Applications</h3>
              {candidateApplications.length > 0 ? (
                <div className="space-y-4">
                  {candidateApplications.map((application) => (
                    <div key={application.id} className="border border-gray-200 dark:border-gray-600 rounded-lg p-4">
                      <div className="flex justify-between items-start mb-3">
                        <div>
                          <h4 className="font-medium text-gray-900 dark:text-white">{application.candidateName}</h4>
                          <p className="text-sm text-gray-600 dark:text-gray-400">{application.candidateEmail}</p>
                          <p className="text-sm text-blue-600 dark:text-blue-400">{application.jobRole}</p>
                        </div>
                        <div className="text-right">
                          <span className="px-3 py-1 bg-green-100 dark:bg-green-900 text-green-800 dark:text-green-200 text-sm rounded-full">
                            Score: {application.score}%
                          </span>
                        </div>
                      </div>
                      <div className="flex space-x-3">
                        <button 
                          onClick={() => {
                            const url = URL.createObjectURL(application.resume)
                            const a = document.createElement('a')
                            a.href = url
                            a.download = `${application.candidateName}_resume.pdf`
                            a.click()
                            URL.revokeObjectURL(url)
                          }}
                          className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 text-sm"
                        >
                          Download Resume
                        </button>
                        <button 
                          onClick={() => {
                            const url = URL.createObjectURL(application.resume)
                            window.open(url, '_blank')
                          }}
                          className="px-4 py-2 bg-gray-600 text-white rounded hover:bg-gray-700 text-sm"
                        >
                          View Resume
                        </button>
                      </div>
                      <p className="text-xs text-gray-500 dark:text-gray-500 mt-2">
                        Applied on {new Date(application.timestamp).toLocaleDateString()}
                      </p>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-gray-500 dark:text-gray-400">No applications received yet.</p>
              )}
            </div>
          </div>
        )
      case 'ranking':
        return (
          <div className="space-y-6">
            <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-lg font-medium text-gray-900 dark:text-white">Resume Ranking</h3>
                {resumeRankings.length > 0 && (
                  <button
                    onClick={exportRankingsToCSV}
                    className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 text-sm"
                  >
                    Export to CSV
                  </button>
                )}
              </div>
              
              {candidateApplications.length > 0 ? (
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead>
                      <tr className="border-b border-gray-200 dark:border-gray-700">
                        <th className="text-left py-3 px-4 font-medium text-gray-900 dark:text-white">Candidate Name</th>
                        <th className="text-left py-3 px-4 font-medium text-gray-900 dark:text-white">Job Role</th>
                        <th className="text-left py-3 px-4 font-medium text-gray-900 dark:text-white">Initial Score</th>
                        <th className="text-left py-3 px-4 font-medium text-gray-900 dark:text-white">Your Score</th>
                        <th className="text-left py-3 px-4 font-medium text-gray-900 dark:text-white">Action</th>
                      </tr>
                    </thead>
                    <tbody>
                      {candidateApplications.map((application) => {
                        const ranking = resumeRankings.find(r => r.id === application.id)
                        return (
                          <tr key={application.id} className="border-b border-gray-100 dark:border-gray-700">
                            <td className="py-3 px-4 text-gray-900 dark:text-white">{application.candidateName}</td>
                            <td className="py-3 px-4 text-gray-600 dark:text-gray-400">{application.jobRole}</td>
                            <td className="py-3 px-4 text-gray-900 dark:text-white">{application.score}%</td>
                            <td className="py-3 px-4">
                              <input
                                type="number"
                                min="0"
                                max="100"
                                value={ranking?.score || ''}
                                onChange={(e) => updateResumeScore(application.id, parseInt(e.target.value))}
                                placeholder="Score"
                                className="w-20 p-1 border border-gray-300 dark:border-gray-600 rounded dark:bg-gray-700 dark:text-white text-center"
                              />
                            </td>
                            <td className="py-3 px-4">
                              <button 
                                onClick={() => {
                                  const url = URL.createObjectURL(application.resume)
                                  window.open(url, '_blank')
                                }}
                                className="text-blue-600 hover:text-blue-800 text-sm"
                              >
                                View Resume
                              </button>
                            </td>
                          </tr>
                        )
                      })}
                    </tbody>
                  </table>
                </div>
              ) : (
                <p className="text-gray-500 dark:text-gray-400">No applications to rank yet.</p>
              )}
            </div>
          </div>
        )
      case 'jobs': 
        return (
          <div className="space-y-6">
            <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700">
              <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-4">Job Descriptions</h3>
              <div className="grid gap-4">
                {jobDescriptions.map((jd) => (
                  <div key={jd.id} className="p-4 border border-gray-200 dark:border-gray-600 rounded-lg">
                    <h4 className="font-medium text-gray-900 dark:text-white">{jd.title}</h4>
                    <p className="text-sm text-gray-600 dark:text-gray-400">{jd.department}</p>
                    <p className="text-xs text-gray-500 dark:text-gray-500">Posted: {jd.posted}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )
      case 'candidates':
        return (
          <div className="space-y-6">
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700">
              <div className="p-6">
                <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-4">Candidate Applications</h3>
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead>
                      <tr className="border-b border-gray-200 dark:border-gray-700">
                        <th className="text-left py-3 px-4 font-medium text-gray-900 dark:text-white">Name</th>
                        <th className="text-left py-3 px-4 font-medium text-gray-900 dark:text-white">Applied JD</th>
                        <th className="text-left py-3 px-4 font-medium text-gray-900 dark:text-white">Score</th>
                        <th className="text-left py-3 px-4 font-medium text-gray-900 dark:text-white">Status</th>
                      </tr>
                    </thead>
                    <tbody>
                      {candidates.map((candidate, index) => (
                        <tr key={index} className="border-b border-gray-100 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700">
                          <td className="py-3 px-4 text-gray-900 dark:text-white">{candidate.name}</td>
                          <td className="py-3 px-4 text-gray-600 dark:text-gray-400">{candidate.appliedJd}</td>
                          <td className="py-3 px-4 text-gray-900 dark:text-white">{candidate.score}%</td>
                          <td className="py-3 px-4">
                            <span className={`px-2 py-1 text-xs rounded-full ${
                              candidate.status === 'Hired' ? 'bg-green-100 text-green-800' :
                              candidate.status === 'Interview' ? 'bg-blue-100 text-blue-800' :
                              'bg-yellow-100 text-yellow-800'
                            }`}>
                              {candidate.status}
                            </span>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          </div>
        )
      case 'analysis':
        return (
          <div className="space-y-6">
            <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700">
              <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-4">Resume Analysis Results</h3>
              {analysisResults ? (
                <div className="space-y-4">
                  {analysisResults.map((result, index) => (
                    <div key={index} className="p-4 border border-gray-200 dark:border-gray-600 rounded-lg">
                      <div className="flex justify-between items-start mb-2">
                        <div>
                          <h4 className="font-medium text-gray-900 dark:text-white">{result.candidateName}</h4>
                          <p className="text-sm text-gray-600 dark:text-gray-400">{result.email}</p>
                        </div>
                        <span className="px-3 py-1 bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200 text-sm rounded-full">
                          {result.score}%
                        </span>
                      </div>
                      <p className="text-sm text-gray-500 dark:text-gray-400">File: {result.fileName}</p>
                      <div className="mt-2">
                        <p className="text-xs text-gray-600 dark:text-gray-400">Skills: {result.matchedSkills.join(', ')}</p>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-gray-500 dark:text-gray-400">No analysis results yet. Please upload JD and resumes first.</p>
              )}
            </div>
          </div>
        )
      case 'messages':
        return (
          <div className="space-y-6">
            <MessagingSystem user={user} />
          </div>
        ) 
      default:
        return (
          <div className="flex items-center justify-center h-64">
            <p className="text-gray-500 dark:text-gray-400">Content for {activeTab} coming soon...</p>
          </div>
        )
    }
  }

  return (
    <Layout sidebarItems={sidebarItems}>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Recruiter Dashboard</h1>
        </div>
        {renderContent()}
      </div>
    </Layout>
  )
}

export default RecruiterDashboard
 