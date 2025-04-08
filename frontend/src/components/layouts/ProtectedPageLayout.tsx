import axios from 'axios';
import { useEffect, useState } from 'react'
import { Navigate, Outlet } from 'react-router-dom';

const ProtectedPageLayout = () => {
    const [isAuthenticated, setIsAuthenticated] = useState<boolean | null>(null);
    useEffect(() => {  
        const interval = setInterval(async () => {
            console.log('sending request')
          try {
            const res = await axios.post(
              `${import.meta.env.VITE_API_URL}/api/auth/refresh-token`,
              {},
              { withCredentials: true }
            );
            console.log('sending request');
            console.log("cookie got refresh", res);
            } catch (err) {
                console.log(err);
              
                console.error("Error refreshing token", err);
            }
        }, 1000 * 60 * 15); // every 15 minutes
    
        return () => clearInterval(interval); // 👈 this is the correct cleanup
    }, []);
    useEffect(() => {
        function getCookie(name:string) {
            const cookies = document.cookie.split("; ");
            for (let cookie of cookies) {
              const [key, value] = cookie.split("=");
              if (key === name) return value;
            }
            return null;
        }
        if (getCookie('accessToken')) {
            setIsAuthenticated(true)
        }
        else{
            setIsAuthenticated(false)
        }
    }, []);
    return isAuthenticated !== null ? isAuthenticated === true ? <Outlet /> : <Navigate to="/signin" /> : <></>;
}

export default ProtectedPageLayout