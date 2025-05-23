import { Routes, Route } from 'react-router-dom'

import LoginPage from './Pages/LoginPage'


function App() {
  return (
    <div className="min-h-screen bg-gray-100">
      <Routes>
        <Route path="/login" element={<LoginPage />} />

      </Routes>
    </div>
  )
}

export default App