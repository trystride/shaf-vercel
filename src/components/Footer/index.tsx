import React from "react";
import Image from "next/image";
import Link from "next/link";

const Footer = () => {
  const currentYear = new Date().getFullYear();
  
  return (
    <footer className="relative z-10 mt-auto border-t border-gray-200 bg-white pt-16 pb-12 dark:border-gray-800 dark:bg-gray-900">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 gap-12 md:grid-cols-2 lg:grid-cols-4">
          {/* Company Info */}
          <div className="flex flex-col gap-6">
            <Link href="/" className="inline-block">
              <Image
                src="/images/logo/logo-light.svg"
                alt="Shaf Logo"
                width={140}
                height={32}
                className="hidden dark:block"
              />
              <Image
                src="/images/logo/logo.svg"
                alt="Shaf Logo"
                width={140}
                height={32}
                className="block dark:hidden"
              />
            </Link>
            <p className="text-sm leading-relaxed text-gray-600 dark:text-gray-400">
              Empowering businesses with AI-driven solutions for enhanced productivity and innovation.
            </p>
            <div className="flex items-center gap-4">
              <a
                href="https://twitter.com/ShafAI"
                target="_blank"
                rel="noopener noreferrer"
                className="rounded-lg p-2 text-gray-500 transition-colors hover:bg-gray-100 hover:text-primary dark:text-gray-400 dark:hover:bg-gray-800"
                aria-label="Follow us on Twitter"
              >
                <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M8.29 20.251c7.547 0 11.675-6.253 11.675-11.675 0-.178 0-.355-.012-.53A8.348 8.348 0 0022 5.92a8.19 8.19 0 01-2.357.646 4.118 4.118 0 001.804-2.27 8.224 8.224 0 01-2.605.996 4.107 4.107 0 00-6.993 3.743 11.65 11.65 0 01-8.457-4.287 4.106 4.106 0 001.27 5.477A4.072 4.072 0 012.8 9.713v.052a4.105 4.105 0 003.292 4.022 4.095 4.095 0 01-1.853.07 4.108 4.108 0 003.834 2.85A8.233 8.233 0 012 18.407a11.616 11.616 0 006.29 1.84" />
                </svg>
              </a>
              <a
                href="https://linkedin.com/company/shaf-ai"
                target="_blank"
                rel="noopener noreferrer"
                className="rounded-lg p-2 text-gray-500 transition-colors hover:bg-gray-100 hover:text-primary dark:text-gray-400 dark:hover:bg-gray-800"
                aria-label="Follow us on LinkedIn"
              >
                <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z"/>
                </svg>
              </a>
            </div>
          </div>

          {/* Product */}
          <div className="flex flex-col gap-4">
            <h3 className="text-sm font-semibold uppercase tracking-wider text-gray-900 dark:text-white">Product</h3>
            <div className="flex flex-col gap-3">
              <Link href="#" className="text-sm text-gray-600 transition-colors hover:text-primary dark:text-gray-400">
                Features
              </Link>
              <Link href="#" className="text-sm text-gray-600 transition-colors hover:text-primary dark:text-gray-400">
                Pricing
              </Link>
              <Link href="#" className="text-sm text-gray-600 transition-colors hover:text-primary dark:text-gray-400">
                Integrations
              </Link>
              <Link href="#" className="text-sm text-gray-600 transition-colors hover:text-primary dark:text-gray-400">
                Changelog
              </Link>
              <Link href="#" className="text-sm text-gray-600 transition-colors hover:text-primary dark:text-gray-400">
                Documentation
              </Link>
            </div>
          </div>

          {/* Company */}
          <div className="flex flex-col gap-4">
            <h3 className="text-sm font-semibold uppercase tracking-wider text-gray-900 dark:text-white">Company</h3>
            <div className="flex flex-col gap-3">
              <Link href="#" className="text-sm text-gray-600 transition-colors hover:text-primary dark:text-gray-400">
                About Us
              </Link>
              <Link href="#" className="text-sm text-gray-600 transition-colors hover:text-primary dark:text-gray-400">
                Careers
              </Link>
              <Link href="#" className="text-sm text-gray-600 transition-colors hover:text-primary dark:text-gray-400">
                Blog
              </Link>
              <Link href="#" className="text-sm text-gray-600 transition-colors hover:text-primary dark:text-gray-400">
                Contact
              </Link>
              <Link href="#" className="text-sm text-gray-600 transition-colors hover:text-primary dark:text-gray-400">
                Press Kit
              </Link>
            </div>
          </div>

          {/* Legal & Support */}
          <div className="flex flex-col gap-4">
            <h3 className="text-sm font-semibold uppercase tracking-wider text-gray-900 dark:text-white">Legal & Support</h3>
            <div className="flex flex-col gap-3">
              <Link href="#" className="text-sm text-gray-600 transition-colors hover:text-primary dark:text-gray-400">
                Privacy Policy
              </Link>
              <Link href="#" className="text-sm text-gray-600 transition-colors hover:text-primary dark:text-gray-400">
                Terms of Service
              </Link>
              <Link href="#" className="text-sm text-gray-600 transition-colors hover:text-primary dark:text-gray-400">
                Security
              </Link>
              <Link href="#" className="text-sm text-gray-600 transition-colors hover:text-primary dark:text-gray-400">
                Help Center
              </Link>
              <Link href="#" className="text-sm text-gray-600 transition-colors hover:text-primary dark:text-gray-400">
                System Status
              </Link>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="mt-12 border-t border-gray-200 pt-8 dark:border-gray-800">
          <div className="flex flex-col items-center justify-between gap-4 text-sm text-gray-500 dark:text-gray-400 md:flex-row">
            <p>&copy; {currentYear} Shaf. All rights reserved.</p>
            <div className="flex items-center gap-4">
              <Link href="/accessibility" className="hover:text-primary">
                Accessibility
              </Link>
              <span>·</span>
              <Link href="/cookies" className="hover:text-primary">
                Cookie Settings
              </Link>
              <span>·</span>
              <Link href="/sitemap" className="hover:text-primary">
                Sitemap
              </Link>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
