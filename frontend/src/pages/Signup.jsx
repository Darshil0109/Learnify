import React,{ useState } from 'react'
import axios from 'axios';
import { FcGoogle } from 'react-icons/fc';
import SignWithGoogle from '../components/SignWithGoogle';
const Signup = () => {
    const [formData, setFormData] = useState({
        email: '',
        password: '',
        name: '',
      });
      const [loading, setLoading] = useState(false);
      const [error, setError] = useState(null);
      const [success, setSuccess] = useState(false);
    
      const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
          ...prev,
          [name]: value
        }));
      };
    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError(null);
    
        try {
          const response = await axios.post(
            `${import.meta.env.VITE_APP_API_URL}/signup`,
            formData
          );
          
          setSuccess(true);
          console.log('Signup successful:', response.data);
        } catch (err) {
          setError(err.response?.data?.error || 'Signup failed. Please try again.');
        } finally {
          setLoading(false);
        }
      };
    if (success) {
        return (
          <div className="max-w-md mx-auto mt-10 p-6 bg-white rounded-lg shadow-md">
            <h2 className="text-2xl font-bold text-center text-green-600 mb-4">
              Signup Successful!
            </h2>
            <p className="text-center">
              Please check your email to verify your account.
            </p>
          </div>
        );
      }
  return (
    <div>
        <div className="max-w-md mx-auto mt-10 p-6 bg-white rounded-lg shadow-md">
      <h2 className="text-2xl font-bold text-center text-gray-800 mb-6">
        Create an Account
      </h2>

      {error && (
        <div className="mb-4 p-3 bg-red-100 text-red-700 rounded-md">
          {error}
        </div>
      )}

    <div className='flex justify-center mt-4'>
        <SignWithGoogle/>
      </div>

      <div className="flex items-center my-4">
        <div className="flex-grow border-t border-gray-300"></div>
        <span className="mx-4 text-gray-500">or</span>
        <div className="flex-grow border-t border-gray-300"></div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label htmlFor="email" className="block text-sm font-medium text-gray-700">
            Email
          </label>
          <input
            type="email"
            id="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            required
            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
          />
        </div>

        <div>
          <label htmlFor="name" className="block text-sm font-medium text-gray-700">
            Full Name
          </label>
          <input
            type="text"
            id="name"
            name="name"
            value={formData.name}
            onChange={handleChange}
            required
            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
          />
        </div>

        <div>
          <label htmlFor="password" className="block text-sm font-medium text-gray-700">
            Password
          </label>
          <input
            type="password"
            id="password"
            name="password"
            value={formData.password}
            onChange={handleChange}
            required
            minLength="6"
            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
          />
        </div>

        <button
          type="submit"
          disabled={loading}
          className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {loading ? 'Signing up...' : 'Sign Up'}
        </button>
      </form>

      <div className="mt-4 text-center text-sm text-gray-600">
        Already have an account?{' '}
        <a href="/login" className="font-medium text-indigo-600 hover:text-indigo-500">
          Log in
        </a>
      </div>
    </div>
    </div>
  )
}

export default Signup