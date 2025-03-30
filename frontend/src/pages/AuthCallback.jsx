import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import supabase from '../supabaseClient';


export default function AuthCallback() {
  const navigate = useNavigate();
    console.log('it is coming');
    
  useEffect(() => {
    const handleAuth = async () => {
      // Extract error from URL (if any)
      const urlParams = new URLSearchParams(window.location.hash.substring(1));
      const error = urlParams.get('error');

      if (error) {
        console.error('OAuth Error:', error);
        navigate('/login?error=' + encodeURIComponent(error));
        return;
      }

      // Get session from Supabase
      const { sessionData, supabaseError } = await supabase.auth.getSessionFromUrl({ storeSession: true });

      if (supabaseError || !sessionData) {
        navigate('/login', { state: { error: 'Failed to authenticate' } });
        return;
      }
      console.log('it is navigating to profile');
      // Success! Redirect to profile   
      navigate('/profile');
    };

    handleAuth();
  }, [navigate]);

  return <div>Loading...</div>;
}