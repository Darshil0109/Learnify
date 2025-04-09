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
import axios from "axios"
import React, { useEffect, useState } from "react"
import { useNavigate } from "react-router-dom"
const ResetPassword = () => {
  const [loading,setLoading] = useState<boolean>(false);
  const [error,setError] = useState<string>('');
  const navigate = useNavigate();
  const [dataLoaded,setDataLoaded] = useState<boolean>(false);
  useEffect(()=>{
    function getCookie(name:string) {
        const cookies = document.cookie.split("; ");
        for (let cookie of cookies) {
        const [key, value] = cookie.split("=");
        if (key === name) return value;
        }
        return null;
    }
    if (getCookie('email')=== null){
        navigate('/forgot-password');
    }
    else{
        setDataLoaded(true);
    }
  },[])
  const handlePasswordReset = async(e : React.FormEvent<HTMLFormElement>) =>{
    e.preventDefault();
    setLoading(true);
    setError('');
    try {
        const formData = new FormData(e.currentTarget);
        const newPassword = formData.get("newPassword") as string;
        const confirmPassword = formData.get("confirmPassword") as string;
        
        if (newPassword !== confirmPassword) {
            setError('Password and Confirm Password should be same.');
            setLoading(false);
            return;
        }
        if(newPassword?.length < 8 || newPassword?.length > 16){
            setError('Password must be at least 8 characters long and at most 16 characters long.');
            setLoading(false);
            return;
        }
        if(/.*[A-Z].*/.test(newPassword) === false){
            setError('Password must contain at least one Uppercase letter.');
            setLoading(false);
            return;
        }
        if(/.*[a-z].*/.test(newPassword) === false){
            setError('Password must contain at least one Lowercase letter.');
            setLoading(false);
            return;
        }
        if(/.*[0-9].*/.test(newPassword) === false){
            setError('Password must contain at least one Digit.');
            setLoading(false);
            return;
        }
        if(/.*[$@#].*/.test(newPassword) === false){
            setError('Password must contain at least one special character from $, @, #');
            setLoading(false);
            return;
        }
        const response = await axios.post(`${import.meta.env.VITE_API_URL}/api/auth/change-password`,{newPassword});
        if (response.data.message === "Password changed successfully") {
            navigate('/signin');
        }
        
    } catch (error) {
    }finally{
        setLoading(false);
    }
  }

  return (
    dataLoaded ? <div className={"flex flex-col gap-6"}>
      <Card>
        <CardHeader className="text-center">
          <CardTitle className="text-xl">Reset Password</CardTitle>
          <CardDescription>
            Enter new Password
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
                  <Label htmlFor="password">password</Label>
                  <Input
                    id="password"
                    name="newPassword"
                    type="password"
                    placeholder="Enter New Password"
                    required
                  />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="confirmPassword">Confirm Password</Label>
                  <Input
                    id="confirmPassword"
                    name="confirmPassword"
                    type="confirmPassword"
                    placeholder="Enter Confirm Password"
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
    </div> : <></>
  )
}

export default ResetPassword