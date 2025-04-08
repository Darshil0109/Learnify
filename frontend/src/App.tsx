import { BrowserRouter as Router, Routes, Route } from "react-router-dom"
import VerifyEmail from "./VerifyEmail"
import Landing from "./components/pages/Landing/Landing"
import Pricing from "./components/pages/Pricing/Pricing"
import Signin from "./components/pages/Authentication/Signin"
import Signup from "./components/pages/Authentication/Signup"
import Profile from "./components/pages/Profile/Profile"
import ProtectedPageLayout from "./components/layouts/ProtectedPageLayout"


const App = () => {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Landing />}/>
        <Route path="/pricing" element={<Pricing />}/>
        <Route path="/signin" element={<Signin />}/>
        <Route path="/signup" element={<Signup />}/>
        <Route path="/verify/:token" element={<VerifyEmail/>}/>
        <Route element = {<ProtectedPageLayout/>}>
          <Route path="/profile" element={<Profile/>}/>
        </Route>
      </Routes>
    </Router>
  )
}

export default App