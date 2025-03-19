import { useState, useEffect, useRef, useMemo, useCallback } from 'react'
import { Button, Dialog, DialogPanel } from '@headlessui/react'
import { Menu, X } from 'lucide-react'

interface HeaderProps {
  currentPath?: string;
}

interface NavigationItem {
  name: string;
  href: string;
}

const navigation: NavigationItem[] = [
  { name: 'About', href: '/about' },
]

const navLinkStyles = "text-gray-800 hover:text-blue-600 no-underline active:text-blue-600 target:text-blue-600";

export default function Header({ currentPath = '/' }: HeaderProps) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const dialogRef = useRef<HTMLDivElement>(null)
  const [isHydrated, setIsHydrated] = useState(false)

  // Add path validation
  const validatedPath = useMemo(() => {
    if (!currentPath || typeof currentPath !== 'string') {
      console.warn('Invalid currentPath provided:', currentPath);
      return '/';
    }
    return currentPath;
  }, [currentPath]);

  // Inline isActivePath logic
  const isActivePath = useCallback((href: string) => {
    try {
      if (href === '/' && validatedPath === '/') return true;
      if (href !== '/' && validatedPath.startsWith(href)) return true;
      return false;
    } catch (error) {
      console.warn('Error checking active path:', error);
      return false;
    }
  }, [validatedPath]);

  // Control body scroll and prevent dragging when mobile menu is open
  useEffect(() => {
    // Store original body styles to restore later
    const originalStyles = {
      overflow: document.body.style.overflow,
      touchAction: document.body.style.touchAction,
      position: document.body.style.position,
      height: document.body.style.height,
      width: document.body.style.width
    }

    // Only prevent touchmove on non-interactive elements
    const preventTouchMove = (e: TouchEvent) => {
      // Allow touch events on interactive elements
      const target = e.target as HTMLElement;
      const isInteractiveElement = 
        target.tagName === 'BUTTON' || 
        target.tagName === 'A' || 
        target.closest('button') || 
        target.closest('a');
      
      // Only prevent default if not on an interactive element
      if (!isInteractiveElement) {
        e.preventDefault();
      }
    }

    if (mobileMenuOpen) {
      // Apply comprehensive body locking
      document.body.style.overflow = 'hidden'
      document.body.style.touchAction = 'none'
      document.body.style.position = 'relative'
      document.body.style.height = '100%'
      document.body.style.width = '100%'
      
      // Only add touchmove prevention, not touchstart
      document.addEventListener('touchmove', preventTouchMove, { passive: false })
      
      // Apply additional styles to dialog if it exists
      if (dialogRef.current) {
        dialogRef.current.style.position = 'fixed'
      }
    } else {
      // Restore original body styles
      document.body.style.overflow = originalStyles.overflow
      document.body.style.touchAction = originalStyles.touchAction
      document.body.style.position = originalStyles.position
      document.body.style.height = originalStyles.height
      document.body.style.width = originalStyles.width
      
      // Remove event listeners
      document.removeEventListener('touchmove', preventTouchMove)
    }

    // Cleanup function to ensure scroll is re-enabled if component unmounts
    return () => {
      document.body.style.overflow = originalStyles.overflow
      document.body.style.touchAction = originalStyles.touchAction
      document.body.style.position = originalStyles.position
      document.body.style.height = originalStyles.height
      document.body.style.width = originalStyles.width
      
      document.removeEventListener('touchmove', preventTouchMove)
    }
  }, [mobileMenuOpen])


  return (
    <header className="sticky top-0 left-0 right-0 z-40 bg-white">
      <nav aria-label="Global" className="mx-auto flex max-w-7xl items-center justify-between p-6 lg:px-8">
        <a 
          href="/" 
          className="text-xl font-bold no-underline -m-1.5 p-1.5"
        >
          Saturdays.io
        </a>
        <div className="flex lg:hidden">
          <button
            type="button"
            onClick={() => setMobileMenuOpen(true)}
            className="-m-2.5 inline-flex items-center justify-center rounded-md p-2.5 text-gray-700"
          >
            <span className="sr-only">Open main menu</span>
            <Menu aria-hidden="true" className="size-6" />
          </button>
        </div>
        <div className="hidden items-center lg:flex lg:gap-x-12">
          {navigation.map((item) => (
            <a
              key={item.name}
              href={item.href}
              className="text-base font-bold no-underline transition-colors text-gray-900 hover:text-blue-600"
            >
              {item.name}
            </a>
          ))}
          <Button
            as="a"
            href="/signin"
            className="text-sm font-bold no-underline px-4 py-2 rounded-md transition-colors text-white bg-gray-800 hover:bg-blue-600"
          >
            Client Login
          </Button>
        </div>
      </nav>
      <Dialog
        open={mobileMenuOpen}
        onClose={setMobileMenuOpen}
        as="div"
        className="lg:hidden"
      >
        <div className="fixed inset-0 z-50 bg-black/20" />
        <DialogPanel 
          ref={dialogRef}
          className="fixed inset-x-0 top-0 z-50 w-screen overflow-y-auto bg-white px-6 py-6"
        >
          <nav className="flex items-center justify-between">
            <a href="/" className="no-underline-m-1.5 p-1.5">
              <span className="text-xl font-bold">Saturdays.io</span>
            </a>
            <button
              type="button"
              onClick={() => setMobileMenuOpen(false)}
              className="-m-2.5 rounded-md p-2.5 text-gray-700 hover:text-gray-900"
            >
              <span className="sr-only">Close menu</span>
              <X className="h-6 w-6" />
            </button>
          </nav>
          <div className="flex flex-col justify-center h-[calc(100vh-100px)]">
            <div className="divide-y divide-gray-500/10">
              <div className="space-y-2 py-6">
                {navigation.map((item) => (
                  <a
                    key={item.name}
                    href={item.href}
                    className="text-3xl font-bold no-underline transition-colors text-gray-900 hover:text-blue-600"
                  >
                    {item.name}
                  </a>
                ))}
              </div>
              <div className="py-6">
                <a
                  href="/signin"
                  className="text-3xl font-bold no-underline transition-colors text-gray-900 hover:text-blue-600"
                >
                  Client Login
                </a>
              </div>
            </div>
          </div>
        </DialogPanel>
      </Dialog>
    </header>
  )
}
