import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import api from "@/axios/api"
import { useState } from "react"
import { Link } from "react-router-dom"
import { AiOutlineEyeInvisible,AiOutlineEye } from "react-icons/ai";
import ContinueWithGoogle from "@/components/custom/ContinueWithGoogle"
import axios from "axios"
const SignupForm = () => {
  const [loading,setLoading] = useState<boolean>(false);
  const [error,setError] = useState<string>('');
  const [success, setSuccess] = useState<boolean>(false);
  const [showPassword, setShowPassword] = useState<boolean>(false);
  const handleSignup = async (e: React.FormEvent<HTMLFormElement>) =>{
    e.preventDefault();
    setLoading(true);
    setError('');

    const formData = new FormData(e.currentTarget);        
    const name = formData.get("name") as string;
    const email = formData.get("email") as string;
    const password = formData.get("password") as string;
    const nameRegex = /^[A-Za-z ]{2,15}$/;
    if (nameRegex.test(name as string) === false){
      setError('Name must be between 2 to 15 characters and contain only letters and spaces.');
      setLoading(false);
      return;
    }
    if(password?.length < 8 || password?.length > 16){
      setError('Password must be at least 8 characters long and at most 16 characters long.');
      setLoading(false);
      return;
    }
    if(/.*[A-Z].*/.test(password) === false){
      setError('Password must contain at least one Uppercase letter.');
      setLoading(false);
      return;
    }
    if(/.*[a-z].*/.test(password) === false){
      setError('Password must contain at least one Lowercase letter.');
      setLoading(false);
      return;
    }
    if(/.*[0-9].*/.test(password) === false){
      setError('Password must contain at least one Digit.');
      setLoading(false);
      return;
    }
    if(/.*[$@#].*/.test(password) === false){
      setError('Password must contain at least one special character from $, @, #');
      setLoading(false);
      return;
    }
    try {
      const response = await api.post(
        `/api/auth/signup`,
        {
          name:name,
          email:email,
          password:password
        }
      );
      if (response.data.message === "Sign-up successful"){
        setSuccess(true);
      }
    } catch (err: unknown) {  // Type is unknown for safety
      console.log(err);

      if (axios.isAxiosError(err)) {  // Narrow the type
          setError(err.response?.data?.message || 'Signup failed. Please try again.');
      } else if (err instanceof Error) {
          setError(err.message || 'An unexpected error occurred.');
      } else {
          setError('An unknown error occurred.');
      }
    } finally {
      setLoading(false);
    }
  }
  if (success) {
    return (
      <div className="max-w-md mx-auto mt-10 p-6 bg-white rounded-lg shadow-md">
        <h2 className="text-2xl font-bold text-center text-green-600 mb-4">
          Signup Successful!
        </h2>
        <p className="text-center">
          Please check your email to verify your account.
        </p>
      </div>
    );
  }
  return (
    <div className={"flex flex-col gap-6"}>
      <Card>
        <CardHeader className="text-center">
          <CardTitle className="text-xl">Welcome back</CardTitle>
          <CardDescription>
            Signup with your Google account 
          </CardDescription>
        </CardHeader>
        <CardContent>
          {error && (
            <div className="mb-4 p-3 bg-red-100 text-red-700 rounded-md">
              {error}
            </div>
          )}
          <ContinueWithGoogle/>
          <form onSubmit={handleSignup}>
            <div className="grid gap-6">
              <div className="relative text-center text-sm after:absolute after:inset-0 after:top-1/2 after:z-0 after:flex after:items-center after:border-t after:border-border">
                <span className="relative z-10 bg-background px-2 text-muted-foreground">
                  Or continue with
                </span>
              </div>
              <div className="grid gap-3">
                <div className="grid gap-2">
                  <Label htmlFor="name">Name</Label>
                  <Input
                    id="name"
                    name="name"
                    type="name"
                    placeholder="john doe"
                    required
                  />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="email">Email</Label>
                  <Input
                    id="email"
                    name="email"
                    type="email"
                    placeholder="abc12@example.com"
                    required
                  />
                </div>
                <div className="grid gap-2 relative">
                  <Label htmlFor="password">Password</Label>
                  <Input id="password" type={showPassword ? "text" : "password"} name="password" required />
                  <div 
                    className="absolute inset-y-10 right-0 flex items-center pr-3 cursor-pointer text-gray-700"
                    onClick={() => setShowPassword(!showPassword)}
                  >
                      {showPassword ? <AiOutlineEyeInvisible size={20} /> : <AiOutlineEye size={20} />}
                  </div>
                </div>
                <Button type="submit" disabled={loading} className="w-full">
                  {loading ? "Please Wait..." : "Signup"}
                </Button>
              </div>
              <div className="text-center text-sm">
                Already have an account?{" "}
                <Link to={'/signin'} className="underline underline-offset-4">
                  Sign in
                </Link>
              </div>
            </div>
          </form>
        </CardContent>
      </Card>
      <div className="text-balance text-center text-xs text-muted-foreground [&_a]:underline [&_a]:underline-offset-4 [&_a]:hover:text-primary  ">
        By clicking continue, you agree to our <Link to="#" className="underline">Terms of Service</Link>{" "}
        and <Link to="#">Privacy Policy</Link>.
      </div>
    </div>
  )
}

export default SignupForm