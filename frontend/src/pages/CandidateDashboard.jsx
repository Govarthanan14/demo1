import  { useState } from 'react'
import { Upload, User, BarChart3, FileText, Settings } from 'lucide-react'
import Layout from '../components/Layout'

const  CandidateDashboard = () => {
  const [activeTab, setActiveTab] = useState('profile')
  const [selectedRole, setSelectedRole] = useState('')
  const [resumeFile, setResumeFile] = useState(null)
  const [analysisResult, setAnalysisResult] = useState(null)
  const [analyzing, setAnalyzing] = useState(false)
  const [applied, setApplied] = useState(false) 

   const sidebarItems = [
    { name: 'Profile', icon: User, active: activeTab === 'profile', onClick: () => setActiveTab('profile') },
    { name: 'Resume Analysis', icon: BarChart3, active: activeTab === 'analysis', onClick: () => setActiveTab('analysis') },
    { name: 'Applications', icon: FileText, active: activeTab === 'applications', onClick: () => setActiveTab('applications') },
    { name: 'Settings', icon: Settings, active: activeTab === 'settings', onClick: () => setActiveTab('settings') }
  ] 

  const jobRoles = [
    'Software Engineer',
    'Data Analyst',
    'Data Scientist',
    'Frontend Developer',
    'DevOps Engineer'
  ]

   const applications = [
    { id: 1, role: 'Software Engineer', company: 'TechCorp', status: 'under-review', date: '2024-01-15' },
    { id: 2, role: 'Frontend Developer', company: 'StartupXYZ', status: 'interview', date: '2024-01-10' },
    { id: 3, role: 'Data Scientist', company: 'DataTech', status: 'rejected', date: '2024-01-05' }
  ]

  const analyzeResume = () => {
    if (!resumeFile || !selectedRole) return
    
    setAnalyzing(true)
    setTimeout(() => {
      const mockAnalysis = {
        score: Math.floor(Math.random() * 40) + 60,
        strengths: ['Strong technical skills', 'Good project experience', 'Relevant education'],
        improvements: ['Add more quantified achievements', 'Include soft skills'],
        keywordMatch: Math.floor(Math.random() * 30) + 70,
        recommendations: 'Your resume shows strong alignment with the selected role'
      }
      setAnalysisResult(mockAnalysis)
      setAnalyzing(false)
    }, 2000)
  }

  const applyForJob = () => {
    if (!resumeFile || !selectedRole || !analysisResult) return
    
    const application = {
      candidateName: 'John Candidate',
      candidateEmail: 'candidate@gmail.com',
      jobRole: selectedRole,
      resume: resumeFile,
      score: analysisResult.score,
      timestamp: new Date().toISOString(),
      id: Date.now()
    }
    
    const existingApplications = JSON.parse(localStorage.getItem('candidateApplications') || '[]')
    existingApplications.push(application)
    localStorage.setItem('candidateApplications', JSON.stringify(existingApplications))
    
    setApplied(true)
    setTimeout(() => setApplied(false), 3000)
  } 

  const renderContent = () => {
    switch(activeTab) {
      case 'profile':
        return (
          <div className="space-y-6">
                       <div className="card p-6 animate-fade-in"> 
              <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-4">Profile Overview</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Preferred Role
                  </label>
                                   <select
                    value={selectedRole}
                    onChange={(e) => setSelectedRole(e.target.value)}
                    className="form-input focus-enhanced"
                  > 
                    <option value="">Select a role</option>
                    {jobRoles.map(role => (
                      <option key={role} value={role}>{role}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Experience Level
                  </label>
                  <select className="w-full p-3 border border-gray-300 dark:border-gray-600 rounded-lg dark:bg-gray-700 dark:text-white">
                    <option>Entry Level</option>
                    <option>Mid Level</option>
                    <option>Senior Level</option>
                  </select>
                </div>
              </div>
            </div>
          </div>
        )
           case 'analysis':
        return (
          <div className="space-y-6">
            <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700">
              <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-4">Resume Analysis</h3>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Select Job Role
                  </label>
                  <select
                    value={selectedRole}
                    onChange={(e) => setSelectedRole(e.target.value)}
                    className="w-full p-3 border border-gray-300 dark:border-gray-600 rounded-lg dark:bg-gray-700 dark:text-white"
                  >
                    <option value="">Select a role</option>
                    {jobRoles.map(role => (
                      <option key={role} value={role}>{role}</option>
                    ))}
                  </select>
                </div>
                
                <div className="border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-lg p-8 text-center">
                  <Upload className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                  <p className="text-gray-600 dark:text-gray-400 mb-2">
                    {resumeFile ? resumeFile.name : 'Upload your resume (PDF format)'}
                  </p>
                  <input
                    type="file"
                    accept=".pdf"
                    onChange={(e) => setResumeFile(e.target.files[0])}
                    className="hidden"
                    id="resume-upload"
                  />
                  <label
                    htmlFor="resume-upload"
                    className="inline-block bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 cursor-pointer transition-colors"
                  >
                    Choose File
                  </label>
                </div>
                
                {resumeFile && selectedRole && (
                                   <button 
                    onClick={analyzeResume}
                    disabled={analyzing}
                    className="btn-primary w-full bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 disabled:opacity-50"
                  > 
                    {analyzing ? 'Analyzing...' : 'Analyze Resume'}
                  </button>
                )}
                
                {analysisResult && (
                  <div className="bg-gray-50 dark:bg-gray-700 p-6 rounded-lg">
                    <h4 className="font-medium text-gray-900 dark:text-white mb-4">Analysis Results</h4>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                      <div className="text-center p-3 bg-blue-100 dark:bg-blue-900 rounded">
                        <p className="text-2xl font-bold text-blue-600 dark:text-blue-400">{analysisResult.score}%</p>
                        <p className="text-sm text-gray-600 dark:text-gray-400">Overall Score</p>
                      </div>
                      <div className="text-center p-3 bg-green-100 dark:bg-green-900 rounded">
                        <p className="text-2xl font-bold text-green-600 dark:text-green-400">{analysisResult.keywordMatch}%</p>
                        <p className="text-sm text-gray-600 dark:text-gray-400">Keyword Match</p>
                      </div>
                      <div className="text-center p-3 bg-purple-100 dark:bg-purple-900 rounded">
                        <p className="text-2xl font-bold text-purple-600 dark:text-purple-400">
                          {analysisResult.score >= 80 ? 'Strong' : analysisResult.score >= 60 ? 'Good' : 'Fair'}
                        </p>
                        <p className="text-sm text-gray-600 dark:text-gray-400">Match Level</p>
                      </div>
                    </div>
                    
                    <div className="space-y-3">
                      <div>
                        <p className="font-medium text-green-700 dark:text-green-300">Strengths:</p>
                        <ul className="text-sm text-gray-600 dark:text-gray-400 list-disc list-inside">
                          {analysisResult.strengths.map((strength, index) => (
                            <li key={index}>{strength}</li>
                          ))}
                        </ul>
                      </div>
                      
                      <div>
                        <p className="font-medium text-orange-700 dark:text-orange-300">Areas for Improvement:</p>
                        <ul className="text-sm text-gray-600 dark:text-gray-400 list-disc list-inside">
                          {analysisResult.improvements.map((improvement, index) => (
                            <li key={index}>{improvement}</li>
                          ))}
                        </ul>
                      </div>
                      
                      <div>
                        <p className="font-medium text-gray-700 dark:text-gray-300">Recommendation:</p>
                        <p className="text-sm text-gray-600 dark:text-gray-400">{analysisResult.recommendations}</p>
                      </div>
                    </div>
                    
                    <button 
                      onClick={applyForJob}
                      className="w-full mt-4 bg-blue-600 text-white py-3 px-4 rounded-lg hover:bg-blue-700 transition-colors"
                    >
                      Apply for Job
                    </button>
                    
                    {applied && (
                      <div className="mt-4 p-3 bg-green-100 dark:bg-green-900 border border-green-300 dark:border-green-700 rounded-lg">
                        <p className="text-green-800 dark:text-green-200 text-sm">
                          ✓ Application submitted successfully! Your resume has been sent to the recruiter.
                        </p>
                      </div>
                    )}
                  </div>
                )}
              </div>
            </div>
          </div>
        ) 
      case 'applications':
        return (
          <div className="space-y-6">
            <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700">
              <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-4">Application History</h3>
              <div className="space-y-4">
                {applications.map((app) => (
                  <div key={app.id} className="p-4 border border-gray-200 dark:border-gray-600 rounded-lg">
                    <div className="flex items-center justify-between mb-2">
                      <h4 className="font-medium text-gray-900 dark:text-white">{app.role}</h4>
                      <span className={`px-2 py-1 text-xs rounded-full ${
                        app.status === 'interview' ? 'bg-blue-100 text-blue-800' :
                        app.status === 'under-review' ? 'bg-yellow-100 text-yellow-800' :
                        app.status === 'rejected' ? 'bg-red-100 text-red-800' :
                        'bg-gray-100 text-gray-800'
                      }`}>
                        {app.status}
                      </span>
                    </div>
                    <p className="text-sm text-gray-600 dark:text-gray-400">{app.company}</p>
                    <p className="text-xs text-gray-500 dark:text-gray-500 mt-1">Applied on {app.date}</p>
                  </div>
                ))}
              </div>
            </div>
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
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Candidate Dashboard</h1>
        </div>
        {renderContent()}
      </div>
    </Layout>
  )
}

export default CandidateDashboard
 