import React from 'react'
import {BrowserRouter as Router, Routes, Route} from 'react-router-dom'
import Profile from './pages/Profile'
import LandingPage from './pages/LandingPage'
import Signup from './pages/Signup'
import AuthCallback from './pages/AuthCallback'


const App = () => {
  return (
    <Router>
      <Routes>
        <Route path='/' element={< LandingPage/>} />
        <Route path="/profile" element={<Profile />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/auth/callback" element={<AuthCallback />} />

      </Routes>
    </Router>
  ) 
}

export default App