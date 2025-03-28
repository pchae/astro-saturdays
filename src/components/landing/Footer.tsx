import { Linkedin, Github } from 'lucide-react';

const currentYear = new Date().getFullYear();

const navigation = {
    social: [
      {
        name: 'GitHub',
        href: 'https://github.com/saturdaysio',
        icon: Github,
      },
      {
        name: 'LinkedIn',
        href: 'https://www.linkedin.com/company/saturdaysdotio',
        icon: Linkedin,
      },
    ],
  }
  
  export default function Footer() {
    return (
        <footer id="footer" className="bg-gray-900 border-t border-gray-50">
            <div className="mx-auto max-w-7xl px-6 py-12 md:flex md:items-center md:justify-between lg:px-8">
                <div className="flex justify-center gap-x-6 md:order-2">
                    {navigation.social.map((item) => (
                    <a 
                      key={item.name} 
                      href={item.href} 
                      className="text-white hover:opacity-80"
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                        <span className="sr-only">{item.name}</span>
                        <item.icon aria-hidden="true" className="size-6" />
                    </a>
                    ))}
                </div>
                <p className="mt-8 text-center text-sm/5 text-gray-100 md:order-1 md:mt-0">
                    &copy; 2016 - {currentYear} Saturdays.io Inc. All rights reserved.
                </p>
            </div>
        </footer>
    )
  }