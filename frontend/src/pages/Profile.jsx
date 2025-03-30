import React, { useEffect } from 'react'
import supabase from '../supabaseClient';

const Profile = () => {
  const[isAuthenticated, setIsAuthenticated] = React.useState(false);
    useEffect(() => {
        const checkAuthentication = async () => {
          const session = await supabase.auth.getSession();
          console.log(session);
          
          setIsAuthenticated(session !== null);
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