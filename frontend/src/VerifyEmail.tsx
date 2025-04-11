import api from "@/axios/api"
import { useEffect } from "react"
import { useNavigate, useParams } from "react-router-dom"

const VerifyEmail = () => {
    const {token} = useParams()
    const navigate = useNavigate();
    useEffect(()=>{
        const verifyRequest = async () =>{
            try {
                const response = await api.get(`/verify/${token}`);
                console.log(response.data);
                if (response.data.message === "Email verified successfully"){
                    navigate('/dashboard');
                }
            } catch (error) {
                console.log(error)
            }   
        }
        verifyRequest()
    },[])
  return (
    <div>Your Email Has been Verified</div>
  )
}

export default VerifyEmail