import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import supabase from '../supabaseClient';


export default function AuthCallback() {
  const navigate = useNavigate();
    console.log('it is coming');
    
  const[isAuthenticated, setIsAuthenticated] = useState(false);
  useEffect(() => {
    const handleAuth = async () => {
      const { data: { user } } = await supabase.auth.getUser();
          if (user) {
            setIsAuthenticated(true);  // User is authenticated
          } else {
            setIsAuthenticated(false); // User is not authenticated
          }
      // Success! Redirect to profile   
      if (isAuthenticated) {
        navigate('/profile');
      }
      else{
        navigate('/login');
      }
    };
    handleAuth();
  }, [navigate,isAuthenticated]);

  return <div>Loading...</div>;
}