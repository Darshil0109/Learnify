    import api from '@/axios/api';
    import { useEffect, useState } from 'react'
    import { Navigate, Outlet } from 'react-router-dom';

    const ProtectedPageLayout = () => {
        const [isAuthenticated, setIsAuthenticated] = useState<boolean | null>(null);
        useEffect(()=>{
            const checkAuth = async () => {
                try {
                    const response = await api.get(`/api/authenticate`);
                    if (response.data.message === "Authenticated") {
                        setIsAuthenticated(true);
                    }
                    else{
                        setIsAuthenticated(false);
                    }
                } catch (err) {
                    setIsAuthenticated(false);
                    console.log(err);
                }
            }
            checkAuth();
        },[])
        useEffect(() => {  
            if (isAuthenticated) {
                const refreshToken = async() => {
                    try {
                        await api.post(
                            `/api/auth/refresh-token`,
                            {},
                        );
                        setIsAuthenticated(true);
                    } catch (err) {
                        console.log(err);
                        
                    }
                }
                refreshToken()
                const interval = setInterval(async () => {
                    refreshToken();
                }, 1000 * 60 * 14); // every 14 minutes (1 minute before cookie expires)
            
                return () => clearInterval(interval); // cleanup interval
            }
            
        }, [isAuthenticated]);
        return isAuthenticated !== null ? isAuthenticated === true ? <Outlet /> : <Navigate to="/signin" /> : <></>;
    }

    export default ProtectedPageLayout