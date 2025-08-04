import  { useState } from 'react'
import { MessageCircle, X, Send } from 'lucide-react'

const AIAssistant = () => {
  const [isOpen, setIsOpen] = useState(false)
  const [messages, setMessages] = useState([
    { id: 1, type: 'ai', text: 'Hello! I\'m your AI assistant. How can I help you today?' }
  ])
  const [inputValue, setInputValue] = useState('')
  const [isLoading, setIsLoading] = useState(false)

  const handleSendMessage = async (e) => {
    e.preventDefault()
    if (!inputValue.trim()) return

    const userMessage = { id: Date.now(), type: 'user', text: inputValue }
    setMessages(prev => [...prev, userMessage])
    setInputValue('')
    setIsLoading(true)

    // Simulate AI processing
    setTimeout(() => {
      const aiResponse = generateAIResponse(userMessage.text)
      setMessages(prev => [...prev, { id: Date.now() + 1, type: 'ai', text: aiResponse }])
      setIsLoading(false)
    }, 2000)
  }

  const generateAIResponse = (userText) => {
    const responses = {
      default: "I'm here to help! You can ask me about using the dashboard, uploading files, analyzing resumes, or managing applications.",
      upload: "To upload files, go to the 'Upload Files' section in your dashboard. You can upload job descriptions (JD) in PDF format and multiple resume files.",
      analyze: "After uploading your JD and resumes, click 'Analyze Resumes' to get semantic similarity scores and candidate rankings.",
      ranking: "The ranking table shows candidates sorted by their compatibility scores. You can export this data as CSV and share it with requestors.",
      profile: "You can edit your profile by clicking on your avatar in the top-right corner and selecting 'Edit Profile'.",
      messages: "Use the messaging system to communicate with other team members. You can find it in the 'Messages' section of your dashboard.",
      theme: "Toggle between light and dark themes using the sun/moon icon in the top navigation bar."
    }

    const text = userText.toLowerCase()
    if (text.includes('upload') || text.includes('file')) return responses.upload
    if (text.includes('analyz') || text.includes('resume')) return responses.analyze
    if (text.includes('rank') || text.includes('score')) return responses.ranking
    if (text.includes('profile') || text.includes('edit')) return responses.profile
    if (text.includes('message') || text.includes('chat')) return responses.messages
    if (text.includes('theme') || text.includes('dark') || text.includes('light')) return responses.theme
    
    return responses.default
  }

  return (
    <>
      {/* AI Assistant Toggle Button */}
           <button
        onClick={() => setIsOpen(!isOpen)}
        className="fixed bottom-6 right-6 w-14 h-14 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-full shadow-2xl hover:shadow-3xl transform transition-all duration-300 hover:scale-110 focus:outline-none z-50 animate-pulse-glow flex items-center justify-center"
      >
        {isOpen ? <X className="w-6 h-6" /> : <MessageCircle className="w-6 h-6" />}
      </button> 

      {/* AI Assistant Chat Window */}
      {isOpen && (
        <div className="fixed bottom-24 right-6 w-80 h-96 bg-white/95 dark:bg-gray-800/95 backdrop-blur-xl rounded-2xl shadow-2xl border border-white/20 dark:border-gray-700/50 z-40 animate-bounce-in glass-effect">
          <div className="flex items-center justify-between p-4 border-b border-gray-200 dark:border-gray-700">
            <div className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full flex items-center justify-center">
                <MessageCircle className="w-4 h-4 text-white" />
              </div>
              <h3 className="font-medium text-gray-900 dark:text-white">AI Assistant</h3>
            </div>
            <button
              onClick={() => setIsOpen(false)}
              className="p-1 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
            >
              <X className="w-4 h-4 text-gray-500" />
            </button>
          </div>

          <div className="flex flex-col h-80">
            <div className="flex-1 p-4 overflow-y-auto space-y-3">
              {messages.map((message) => (
                <div
                  key={message.id}
                  className={`flex ${message.type === 'user' ? 'justify-end' : 'justify-start'}`}
                >
                  <div
                    className={`max-w-xs p-3 rounded-2xl text-sm ${
                      message.type === 'user'
                        ? 'bg-blue-600 text-white'
                        : 'bg-gray-100 dark:bg-gray-700 text-gray-900 dark:text-white'
                    }`}
                  >
                    {message.text}
                  </div>
                </div>
              ))}
              
              {isLoading && (
                <div className="flex justify-start">
                  <div className="bg-gray-100 dark:bg-gray-700 p-3 rounded-2xl">
                    <div className="flex space-x-1">
                      <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
                      <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{animationDelay: '0.1s'}}></div>
                      <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{animationDelay: '0.2s'}}></div>
                    </div>
                  </div>
                </div>
              )}
            </div>

            <form onSubmit={handleSendMessage} className="p-4 border-t border-gray-200 dark:border-gray-700">
              <div className="flex space-x-2">
                <input
                  type="text"
                  value={inputValue}
                  onChange={(e) => setInputValue(e.target.value)}
                  placeholder="Ask me anything..."
                  className="flex-1 px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white text-sm"
                />
                <button
                  type="submit"
                  disabled={!inputValue.trim() || isLoading}
                  className="px-3 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                >
                  <Send className="w-4 h-4" />
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </>
  )
}

export default AIAssistant
 