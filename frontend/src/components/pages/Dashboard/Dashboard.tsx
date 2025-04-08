import AuthenticatedNavbar from "@/components/custom/AuthenticatedNavbar"
import Courses from "./Courses"

const Dashboard = () => {
  return (
    <>
      <AuthenticatedNavbar/>
      <Courses/>
    </>
  )
}

export default Dashboard