'use client'

import { Heart, Github, Mail, Linkedin, AtSign } from 'lucide-react'

export default function Footer() {
  const currentYear = new Date().getFullYear()

  return (
    <footer className="bg-white/80 backdrop-blur-lg border-t border-white/20 mt-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">

        {/* Bottom Section */}
        <div className="mt-8 pt-8 border-t border-gray-200/50">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="flex flex-col items-center md:items-start">
              <p className="text-sm text-gray-600">
                © {currentYear} . All rights reserved.
              </p>
              <div className="flex items-center mt-2">
                <Heart className="w-4 h-4 text-red-500 mr-2" />
                <p className="text-sm text-gray-600">
                  Designed and Developed by{' '}
                  <span className="font-semibold text-blue-600">Nikhil Are</span>
                </p>
              </div>
              {/* Social Icons */}
              <div className="flex space-x-4 mt-3">
                <a 
                  href="https://github.com/nikhil41425/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-gray-600 hover:text-gray-800 transition-colors"
                  title="GitHub"
                >
                  <Github className="w-5 h-5" />
                </a>
                <a 
                  href="https://in.linkedin.com/in/nikhil-are-7440a1207"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-blue-600 hover:text-blue-700 transition-colors"
                  title="LinkedIn"
                >
                  <Linkedin className="w-5 h-5" />
                </a>
                <a 
                  href="mailto:nikhilaree@gmail.com"
                  className="text-red-500 hover:text-red-600 transition-colors"
                  title="Gmail"
                >
                  <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M24 5.457v13.909c0 .904-.732 1.636-1.636 1.636h-3.819V11.73L12 16.64l-6.545-4.91v9.273H1.636A1.636 1.636 0 0 1 0 19.366V5.457c0-2.023 2.309-3.178 3.927-1.964L5.455 4.64 12 9.548l6.545-4.908 1.528-1.147C21.69 2.28 24 3.434 24 5.457z"/>
                  </svg>
                </a>
              </div>
            </div>
            <div className="flex space-x-6 mt-4 md:mt-0">
              <a href="#privacy" className="text-sm text-gray-600 hover:text-blue-600 transition-colors">
                Privacy Policy
              </a>
              <a href="#terms" className="text-sm text-gray-600 hover:text-blue-600 transition-colors">
                Terms of Service
              </a>
            </div>
          </div>
        </div>
      </div>
    </footer>
  )
}
