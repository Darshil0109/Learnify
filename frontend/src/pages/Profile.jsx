import React, { useEffect,useState } from 'react'
import supabase from '../supabaseClient';

const Profile = () => {
  const[isAuthenticated, setIsAuthenticated] = useState(false);
    useEffect(() => {
      const checkAuthentication = async () => {
          const { data: { user } } = await supabase.auth.getUser();
          if (user) {
            setIsAuthenticated(true);  // User is authenticated
          } else {
            setIsAuthenticated(false); // User is not authenticated
          }
        }
        checkAuthentication();
      }, []);
  return (
    <div>
      {isAuthenticated ? (
        <p>Authenticated</p>
      ) : (
        <p>Not authenticated</p>
      )}
    </div>
  )
}

export default Profile