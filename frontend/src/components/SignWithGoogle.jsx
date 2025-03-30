import supabase from "../supabaseClient";


export default function SignWithGoogle() {
  const GoogleSignIn = async () => {
    const { error } = await supabase.auth.signInWithOAuth({
      provider: "google",
      options: {
        redirectTo: `${window.location.origin}/profile`, // ✅ Correct redirect
      },
    });
    
    if (error) {
      console.error("Google Sign-In Error:", error.message);
    }
  };
  return (
    
    <button
      onClick={GoogleSignIn}
      className="flex items-center gap-2 px-5 py-2 bg-white border border-gray-300 rounded-lg shadow-md hover:bg-gray-200 transition duration-200"
    >
      <img
        src="https://www.svgrepo.com/show/475656/google-color.svg"
        alt="Google Logo"
        className="w-6 h-6"
      />
      <span className="text-gray-700 font-medium">Sign in with Google</span>
    </button>

  );
}
