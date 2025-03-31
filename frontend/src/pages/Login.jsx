import React, { useState } from 'react';
import supabase from '../supabaseClient';
import { Link, useNavigate } from 'react-router-dom';
import SignWithGoogle from '../components/SignWithGoogle';
import { AiOutlineEye, AiOutlineEyeInvisible } from 'react-icons/ai';

const Login = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setSuccess('');
        try {
            const { error } = await supabase
                .from('users')
                .select('*')
                .eq('auth_provider', "email")
                .eq('email', email)
                .eq('is_email_verified', true)
                .single();

            if (error) {
                setError('No User Found for this email');
            } else {
                const { error: loginError } = await supabase.auth.signInWithPassword({
                    email: email,
                    password: password,
                });
                if (loginError) {
                    setError(loginError.message);
                }
            }
            const session = await supabase.auth.getSession();
            if (session.data.session) {
                navigate('/profile');
            }
        } catch (err) {
            setError(err.message);
        }
    };

    return (
        <div className="flex items-center justify-center h-screen bg-gray-100">
            <div className="w-full max-w-sm p-6 bg-white rounded-2xl shadow-lg">
                <h2 className="text-2xl font-bold text-center mb-6">Login</h2>
                <div className='flex justify-center mt-4'>
                    <SignWithGoogle title='Sign In with Google' />
                </div>

                <div className="flex items-center my-4">
                    <div className="flex-grow border-t border-gray-300"></div>
                    <span className="mx-4 text-gray-500">or</span>
                    <div className="flex-grow border-t border-gray-300"></div>
                </div>
                {error && <p className="text-red-500 text-center mb-4">{error}</p>}
                {success && <p className="text-green-500 text-center mb-4">{success}</p>}
                
                <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                        <label className="block text-sm font-medium text-gray-700">Email</label>
                        <input
                            type="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            required
                            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                        />
                    </div>
                    <div className="relative">
                        <label className="block text-sm font-medium text-gray-700 mb-1">Password</label>
                        <div className="relative">
                            <input
                                type={showPassword ? 'text' : 'password'}
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                id="password"
                                name="password"
                                required
                                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                            />
                            <div 
                                className="absolute inset-y-0 right-0 flex items-center pr-3 cursor-pointer text-gray-700"
                                onClick={() => setShowPassword(!showPassword)}
                            >
                                {showPassword ? <AiOutlineEyeInvisible size={20} /> : <AiOutlineEye size={20} />}
                            </div>
                        </div>
                    </div>

                    <button
                        type="submit"
                        className="w-full py-2 px-4 text-white bg-indigo-600 hover:bg-indigo-700 rounded-lg  transition"
                    >
                        Login
                    </button>
                </form>
                <div className="mt-4 text-center text-sm text-gray-600">
                    Not have an account?{' '}
                    <Link to="/signup" className="font-medium text-indigo-600 hover:text-indigo-500">
                        Sign up
                    </Link>
                </div>
            </div>
        </div>
    );
};

export default Login;
