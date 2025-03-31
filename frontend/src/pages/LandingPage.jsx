import React from 'react';
import { FaUsers, FaAward, FaArrowRight, FaCheckCircle, FaGlobe } from 'react-icons/fa';
import Footer from '../components/Footer';
import Navbar from '../components/Navbar';
import { Link } from 'react-router-dom';
function LandingPage() {
  return (
    <div className="min-h-screen bg-white">
      {/* Hero Section */}
      <div className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-sky-400 to-sky-600 opacity-5"></div>
        
        <Navbar />
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24">
          <div className="text-center">
            <h1 className="text-4xl md:text-6xl font-bold text-gray-900 mb-6">
              Unlock Your Potential with <span className="text-sky-500">Learnify</span>
            </h1>
            <p className="text-xl text-gray-600 mb-8 max-w-3xl mx-auto">
              Transform your future with our cutting-edge online learning platform. Access world-class courses, expert instructors, and a supportive community.
            </p>
            <div className="flex justify-center space-x-4">
              <Link to="/login" >
                <button className="bg-sky-400 text-white px-8 py-4 rounded-lg hover:bg-sky-500 transition flex items-center font-semibold cursor-pointer">
                  Start Learning <FaArrowRight className="ml-2" />
                </button>
              </Link>
              <button className="border border-gray-300 text-gray-700 px-8 py-4 rounded-lg hover:bg-gray-50 transition cursor-pointer">
                View Courses
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Features Section */}
      <div className="bg-white py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-3 gap-12">
            <div className="text-center">
              <div className="bg-sky-100 w-16 h-16 rounded-lg flex items-center justify-center mx-auto mb-4">
                <FaGlobe className="h-8 w-8 text-sky-500" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">Global Access</h3>
              <p className="text-gray-600">Learn from anywhere in the world, at any time that suits you best.</p>
            </div>
            <div className="text-center">
              <div className="bg-sky-100 w-16 h-16 rounded-lg flex items-center justify-center mx-auto mb-4">
                <FaUsers className="h-8 w-8 text-sky-500" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">Expert Instructors</h3>
              <p className="text-gray-600">Learn from industry professionals with real-world experience.</p>
            </div>
            <div className="text-center">
              <div className="bg-sky-100 w-16 h-16 rounded-lg flex items-center justify-center mx-auto mb-4">
                <FaAward className="h-8 w-8 text-sky-500" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">Certified Learning</h3>
              <p className="text-gray-600">Earn recognized certificates to boost your career prospects.</p>
            </div>
          </div>
        </div>
      </div>

      {/* Stats Section */}
      <div className="bg-gray-50 py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-4 gap-8 text-center">
            <div>
              <div className="text-3xl font-bold text-sky-500 mb-2">100K+</div>
              <div className="text-gray-600">Active Students</div>
            </div>
            <div>
              <div className="text-3xl font-bold text-sky-500 mb-2">500+</div>
              <div className="text-gray-600">Expert Instructors</div>
            </div>
            <div>
              <div className="text-3xl font-bold text-sky-500 mb-2">1000+</div>
              <div className="text-gray-600">Online Courses</div>
            </div>
            <div>
              <div className="text-3xl font-bold text-sky-500 mb-2">95%</div>
              <div className="text-gray-600">Success Rate</div>
            </div>
          </div>
        </div>
      </div>

      {/* CTA Section */}
      <div className="bg-white py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-gradient-to-r from-sky-400 to-sky-500 rounded-2xl p-12 text-center">
            <h2 className="text-3xl font-bold text-white mb-6">Ready to Start Your Learning Journey?</h2>
            <p className="text-xl text-white/90 mb-8 max-w-2xl mx-auto">
              Join thousands of learners who have already transformed their careers with Learnify.
            </p>
            <Link to={'/login'}>
              <button className="bg-white cursor-pointer text-sky-500 px-8 py-4 rounded-lg hover:bg-gray-50 transition font-semibold">
                Get Started Today
              </button>
            </Link>
          </div>
        </div>
      </div>

      {/* Footer */}
      <Footer/>
    </div>
  );
}

export default LandingPage;