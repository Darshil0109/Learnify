import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import ContinueWithGoogle from "@/components/custom/ContinueWithGoogle";
import { AiOutlineEyeInvisible,AiOutlineEye } from "react-icons/ai";
import axios from "axios";

const SigninForm = () => {
      const [loading, setLoading] = useState<boolean>(false);
      const [error, setError] = useState<null | string>(null);
      const [showPassword, setShowPassword] = useState<boolean>(false);
      const navigate = useNavigate()
      const handleSignin = async (e: React.FormEvent<HTMLFormElement>) =>{
        e.preventDefault();
        setLoading(true);
       
        setError('');
        const formData = new FormData(e.currentTarget);        
        const email = formData.get("email");
        const password = formData.get("password");
        try {
          const response = await axios.post(
            `${import.meta.env.VITE_API_URL}/api/auth/login`,
            {
              email:email,
              password:password
            },
            {
              withCredentials: true
            }
          );
          if (response.data.message === "Login successful"){
            alert("Login successful");
            navigate('/profile')
          }
        } catch (err: unknown) {  // Type is unknown for safety}
          console.log(err);
          
          setError(axios.isAxiosError(err) ? err.response?.data : 'An unexpected error occurred.');
        }
        finally{
          setLoading(false);
        }
      }
      
  return (
    <div className={"flex flex-col gap-6"}>
      <Card>
        <CardHeader className="text-center">
          <CardTitle className="text-xl">Welcome back</CardTitle>
          <CardDescription>
            Login with your Google account 
          </CardDescription>
        </CardHeader>
        <CardContent>
          {error && (
              <div className="mb-4 p-3 bg-red-100 text-red-700 rounded-md">
                {error}
              </div>
            )}
          <ContinueWithGoogle/>
          <form onSubmit={handleSignin}>
            <div className="grid gap-6">
              <div className="relative text-center text-sm after:absolute after:inset-0 after:top-1/2 after:z-0 after:flex after:items-center after:border-t after:border-border">
                <span className="relative z-10 bg-background px-2 text-muted-foreground">
                  Or continue with
                </span>
              </div>
              <div className="grid gap-3">
                <div className="grid gap-2">
                  <Label htmlFor="email">Email</Label>
                  <Input
                    id="email"
                    type="email"
                    name="email"
                    placeholder="m@example.com"
                    required
                  />
                </div>
                <div className="grid gap-2 relative">
                  <div className="flex items-center">
                    <Label htmlFor="password">Password</Label>
                    <Link
                      to="/forgot-password"
                      className="ml-auto text-sm underline-offset-4 hover:underline"
                    >
                      Forgot your password?
                    </Link>
                  </div>
                  <Input id="password" name='password' type={showPassword ? "text" : "password"} required />
                  <div 
                    className="absolute inset-y-12 right-0 flex items-center pr-3 cursor-pointer text-gray-700"
                    onClick={() => setShowPassword(!showPassword)}
                  >
                      {showPassword ? <AiOutlineEyeInvisible size={20} /> : <AiOutlineEye size={20} />}
                  </div>
                </div>
                <Button type="submit" disabled={loading} className="w-full">
                  {loading ? "Logging in..." : "LogIn"}
                </Button>
              </div>
              <div className="text-center text-sm">
                Don&apos;t have an account?{" "}
                <Link to="/signup" className="underline underline-offset-4">
                  Sign up
                </Link>
              </div>
            </div>
          </form>
        </CardContent>
      </Card>
      <div className="text-balance text-center text-xs text-muted-foreground [&_a]:underline [&_a]:underline-offset-4 [&_a]:hover:text-primary  ">
        By clicking continue, you agree to our <Link to="#" className="underline">Terms of Service</Link>{" "}
        and <Link to="#" className="underline">Privacy Policy</Link>.
      </div>
    </div>
  )
}

export default SigninForm