import { IoBookOutline } from "react-icons/io5";
import SignupForm from "./SignupForm";
import { Link } from "react-router-dom";

const Signup = () => {
  return (
    <div>
        <div className="flex min-h-svh flex-col items-center justify-center gap-6 bg-muted p-6 md:p-10">
        <div className="flex w-full max-w-sm flex-col gap-6">
            <Link to="#" className="flex items-center gap-2 self-center font-medium">
            <div className="flex h-6 w-6 items-center justify-center rounded-md ">
                <IoBookOutline/>
            </div>
                Learnify
            </Link>
            <SignupForm/>
        </div>
        </div>
    </div>
  )
}

export default Signup