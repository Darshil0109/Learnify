import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import api from "@/axios/api"
import React, { useEffect, useState } from "react"
import { useNavigate } from "react-router-dom"
import {
    InputOTP,
    InputOTPGroup,
    InputOTPSeparator,
    InputOTPSlot,
  } from "@/components/ui/input-otp"
import axios from "axios"
const VerifyOtp = () => {
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
    const handleOTPVerification = async(e : React.FormEvent<HTMLFormElement>) =>{
        e.preventDefault()
        setLoading(true);
        setError('');
        try {
            const formData = new FormData(e.currentTarget);
            const otp = formData.get("otp") as string;
            const response = await api.post(`/api/auth/verify-otp`,{otp});
            if (response.data.message === "OTP verified successfully") {
                navigate('/password-reset');
            }
        } catch (error) {
           if (axios.isAxiosError(error)) {
               setError(error.response?.data.message);
           }
        }
        finally{
            setLoading(false);
        }

    }
  return (
    dataLoaded ? <div className={"flex flex-col gap-6"}>
      <Card>
        <CardHeader className="text-center">
          <CardTitle className="text-xl">Enter OTP</CardTitle>
          <CardDescription>
            Enter your otp to reset Password
          </CardDescription>
        </CardHeader>
        <CardContent>
          {error && (
            <div className="mb-4 p-3 bg-red-100 text-red-700 rounded-md">
              {error}
            </div>
          )}
          <form onSubmit={handleOTPVerification}>
            <div className="grid gap-6">
              <div className="grid gap-3">
                <div className="grid gap-2 justify-center my-4">
                    <InputOTP maxLength={6} name="otp">
                        <InputOTPGroup>
                            <InputOTPSlot index={0} />
                            <InputOTPSlot index={1} />
                            <InputOTPSlot index={2} />
                        </InputOTPGroup>
                        <InputOTPSeparator />
                        <InputOTPGroup>
                            <InputOTPSlot index={3} />
                            <InputOTPSlot index={4} />
                            <InputOTPSlot index={5} />
                        </InputOTPGroup>
                    </InputOTP>
                </div>
                <Button type="submit" disabled={loading} className="w-full">
                  {loading ? "Please Wait..." : "Verify OTP"}
                </Button>
              </div>
            </div>
          </form>
        </CardContent>
      </Card>
    </div> : <></>
  )
}

export default VerifyOtp