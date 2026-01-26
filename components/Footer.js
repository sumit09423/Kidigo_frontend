'use client'

import Link from 'next/link'
import Image from 'next/image'
import { Facebook, Twitter, Instagram, Linkedin } from 'lucide-react'

export default function Footer() {
  return (
    <footer className="bg-white border-t border-gray-200 mt-auto">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Top Section: Logo on left, Links in middle, QR on right */}
        <div className="flex flex-col md:flex-row items-center justify-between gap-6 py-6">
          {/* Left Side: Logo */}
          <div className="flex-shrink-0">
            <Link href="/" className="flex items-center">
              <Image
                src="/assets/logo/logo.png"
                alt="Kidigo Logo"
                width={120}
                height={90}
                className="w-20 h-16 md:w-[100px] md:h-[75px] lg:w-[120px] lg:h-[90px] object-contain"
              />
            </Link>
          </div>

          {/* Middle Links */}
          <div className="flex flex-wrap items-center justify-center gap-6 md:gap-8 flex-1">
            <Link href="/terms" className="text-sm text-gray-700 hover:text-blue-600 transition-colors whitespace-nowrap">
              Terms & Conditions
            </Link>
            <Link href="/privacy" className="text-sm text-gray-700 hover:text-blue-600 transition-colors whitespace-nowrap">
              Privacy Policy
            </Link>
            <Link href="/contact" className="text-sm text-gray-700 hover:text-blue-600 transition-colors whitespace-nowrap">
              Contact us
            </Link>
            <Link href="/list-events" className="text-sm text-gray-700 hover:text-blue-600 transition-colors whitespace-nowrap">
              List Your Events
            </Link>
          </div>

          {/* Right Side: QR Code */}
          <div className="flex-shrink-0">
            <Image
              src="/assets/logo/QR.png"
              alt="QR Code - Scan to download"
              width={100}
              height={100}
              className="w-20 h-20 md:w-24 md:h-24 lg:w-[100px] lg:h-[100px] object-contain"
            />
          </div>
        </div>

        {/* Bottom Border Section */}
        <div className="border-t border-gray-200 pt-6">
          <div className="relative flex flex-col md:flex-row items-center justify-center gap-4">
            {/* Centered: Copyright */}
            <p className="text-sm text-gray-600 text-center">
              © 2025 kidigo. All Rights Reserved
            </p>

            {/* Right: Social Icons */}
            <div className="flex space-x-4 md:absolute md:right-0">
              <a
                href="https://facebook.com"
                target="_blank"
                rel="noopener noreferrer"
                className="w-9 h-9 flex items-center justify-center bg-gray-100 hover:bg-blue-600 rounded-full transition-colors group"
                aria-label="Facebook"
              >
                <Facebook className="h-5 w-5 text-gray-600 group-hover:text-white transition-colors" />
              </a>
              <a
                href="https://twitter.com"
                target="_blank"
                rel="noopener noreferrer"
                className="w-9 h-9 flex items-center justify-center bg-gray-100 hover:bg-blue-400 rounded-full transition-colors group"
                aria-label="Twitter"
              >
                <Twitter className="h-5 w-5 text-gray-600 group-hover:text-white transition-colors" />
              </a>
              <a
                href="https://instagram.com"
                target="_blank"
                rel="noopener noreferrer"
                className="w-9 h-9 flex items-center justify-center bg-gray-100 hover:bg-pink-600 rounded-full transition-colors group"
                aria-label="Instagram"
              >
                <Instagram className="h-5 w-5 text-gray-600 group-hover:text-white transition-colors" />
              </a>
              <a
                href="https://linkedin.com"
                target="_blank"
                rel="noopener noreferrer"
                className="w-9 h-9 flex items-center justify-center bg-gray-100 hover:bg-blue-700 rounded-full transition-colors group"
                aria-label="LinkedIn"
              >
                <Linkedin className="h-5 w-5 text-gray-600 group-hover:text-white transition-colors" />
              </a>
            </div>
          </div>
        </div>
      </div>
    </footer>
  )
}
