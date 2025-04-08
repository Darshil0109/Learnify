import axios from "axios"
import { useEffect } from "react"
import { useNavigate, useParams } from "react-router-dom"

const VerifyEmail = () => {
    const {token} = useParams()
    const navigate = useNavigate();
    useEffect(()=>{
        const verifyRequest = async () =>{
            try {
                const response = await axios.get(`${import.meta.env.VITE_API_URL}/verify/${token}`,{withCredentials: true});
                console.log(response.data);
                if (response.data.message === "Email verified successfully"){
                    navigate('/profile');
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