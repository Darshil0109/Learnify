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
import React, { useState } from "react"
import { useNavigate } from "react-router-dom"
const SignupForm = () => {
  const [loading,setLoading] = useState<boolean>(false);
  const [error,setError] = useState<string>('');
  const navigate = useNavigate();
  const handlePasswordReset = async(e : React.FormEvent<HTMLFormElement>) =>{
    e.preventDefault();
    setLoading(true);
    setError('');
    try {
        const formData = new FormData(e.currentTarget);
        const email = formData.get("email");
        const response = await api.post(`/api/auth/send-otp`,{email});
        console.log(response);
        console.log(document.cookie);
        
        
        if (response.data.message === "OTP sent successfully") {
          navigate('/verify-otp');
        }
    } catch (error) {
    }finally{
        setLoading(false);
    }
  }

  return (
    <div className={"flex flex-col gap-6"}>
      <Card>
        <CardHeader className="text-center">
          <CardTitle className="text-xl">Forgot your password?</CardTitle>
          <CardDescription>
            Enter your email to receive OTP
          </CardDescription>
        </CardHeader>
        <CardContent>
          {error && (
            <div className="mb-4 p-3 bg-red-100 text-red-700 rounded-md">
              {error}
            </div>
          )}
          <form onSubmit={handlePasswordReset}>
            <div className="grid gap-6">
              <div className="grid gap-3">
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
                <Button type="submit" disabled={loading} className="w-full">
                  {loading ? "Please Wait..." : "Send OTP"}
                </Button>
              </div>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}

export default SignupForm