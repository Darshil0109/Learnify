import React from 'react'
import { Link } from 'react-router-dom'

const Footer = () => {
  return (
    <footer className="bg-white border-t border-gray-200 py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-4 gap-8">
            <div>
              <div className="flex items-center mb-4">
                <img src="../src/assets/learnify.png" alt="learnify" className="h-15 w-15" />
              </div>
              <p className="text-gray-600">Empowering learners worldwide with quality education.</p>
            </div>
            <div>
              <h4 className="text-gray-900 font-semibold mb-4">Company</h4>
              <ul className="space-y-2 text-gray-600">
                <li><Link to="#" className="hover:text-gray-900">About Us</Link></li>
                <li><Link to="#" className="hover:text-gray-900">Careers</Link></li>
                <li><Link to="#" className="hover:text-gray-900">Blog</Link></li>
              </ul>
            </div>
            <div>
              <h4 className="text-gray-900 font-semibold mb-4">Resources</h4>
              <ul className="space-y-2 text-gray-600">
                <li><Link to="#" className="hover:text-gray-900">Help Center</Link></li>
                <li><Link to="#" className="hover:text-gray-900">Terms of Service</Link></li>
                <li><Link to="#" className="hover:text-gray-900">Privacy Policy</Link></li>
              </ul>
            </div>
            <div>
              <h4 className="text-gray-900 font-semibold mb-4">Contact</h4>
              <ul className="space-y-2 text-gray-600">
                <li>support@learnify.com</li>
                <li>+1 (555) 123-4567</li>
              </ul>
            </div>
          </div>
          <div className="border-t border-gray-200 mt-12 pt-8 text-center text-gray-600">
            <p>&copy; 2025 Learnify. All rights reserved.</p>
          </div>
        </div>
      </footer>
  )
}

export default Footer