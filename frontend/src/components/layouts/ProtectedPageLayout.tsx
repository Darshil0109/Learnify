    import axios from 'axios';
    import { useEffect, useState } from 'react'
    import { Navigate, Outlet } from 'react-router-dom';

    const ProtectedPageLayout = () => {
        const [isAuthenticated, setIsAuthenticated] = useState<boolean | null>(null);
        let time = 0
        setInterval(()=>{
            time += 1
        },1000)
        
        useEffect(() => {  
            const refreshToken = async() => {
                try {
                    const res = await axios.post(
                        `${import.meta.env.VITE_API_URL}/api/auth/refresh-token`,
                        {},
                        { withCredentials: true }
                    );
                    console.log('sending request',time);
                    time = 0;
                    console.log("cookie got refresh", res);
                } catch (err) {
                    console.log(err);
                
                    console.error("Error refreshing token", err);
                }
            }
            refreshToken();
            const interval = setInterval(async () => {
                console.log('sending request')
                refreshToken();
            }, 1000 * 60 * 14); // every 14 minutes (1 minute before cookie expires)
        
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