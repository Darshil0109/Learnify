import { BrowserRouter as Router, Routes, Route } from "react-router-dom"
import VerifyEmail from "./VerifyEmail"
import Landing from "./components/pages/Landing/Landing"
import Pricing from "./components/pages/Pricing/Pricing"
import Profile from "./components/pages/Profile/Profile"
import ProtectedPageLayout from "./components/layouts/ProtectedPageLayout"
import Dashboard from "./components/pages/Dashboard/Dashboard"
import AuthenticationFormLayout from "./components/layouts/AuthenticationFormLayout"
import SigninForm from "./components/pages/Authentication/SigninForm"
import SignupForm from "./components/pages/Authentication/SignupForm"
import ForgotPassword from "./components/pages/Authentication/ForgotPassword"
import axios from 'axios';
import VerifyOtp from "./components/pages/Authentication/VerifyOtp"
import ResetPassword from "./components/pages/Authentication/ResetPassword"
import CoursesPage from "./components/pages/Courses/CoursesPage"
import CourseDetailsPage from "./components/pages/Courses/CourseDetailsPage"
import CourseForm from "./components/pages/Courses/CourseForm"
import { Toaster } from "sonner";
axios.defaults.withCredentials = true;

const App = () => {
  return (
    <>
    
          <Toaster />
      <Router>
        <Routes>
          <Route path="/" element={<Landing />}/>
          <Route path="/pricing" element={<Pricing />}/>
          <Route path="/courses" element={<CoursesPage />}/>
          <Route path="/courses/course/details/:courseId" element={<CourseDetailsPage />}/>

          <Route element = {<AuthenticationFormLayout/>}>
            <Route path="/signin" element={<SigninForm />}/>
            <Route path="/signup" element={<SignupForm />}/>
            <Route path="/forgot-password" element={<ForgotPassword />}/>
            <Route path="/verify-otp" element={<VerifyOtp />}/>
            <Route path="/password-reset" element={<ResetPassword />}/>
          </Route>
          <Route path="/verify/:token" element={<VerifyEmail/>}/>
          <Route element = {<ProtectedPageLayout/>}>
            <Route path="/add-course" element={<CourseForm />}/>
            <Route path="/profile" element={<Profile/>} />
            <Route path="/dashboard" element={<Dashboard/>}/>
          </Route>
          <Route path="*" element={<>Not found</>}/>
        </Routes>
      </Router>
    </>
  )
}

export default App