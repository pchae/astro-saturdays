import { useState, useEffect, useRef } from 'react'
import { Button, Dialog, DialogPanel } from '@headlessui/react'
import { Menu, X } from 'lucide-react'

interface NavigationItem {
  name: string;
  href: string;
}

const navigation: NavigationItem[] = [
  { name: 'About', href: '/about' },
]

export default function Header() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const dialogRef = useRef<HTMLDivElement>(null)

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
        // Don't set touchAction: none on the dialog itself to allow interaction
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
        <a href="/" className="-m-1.5 p-1.5">
          <span className="text-xl font-bold">Saturdays.io</span>
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
            <a key={item.name} href={item.href} className="text-sm/6 font-bold">
              {item.name}
            </a>
          ))}
          <Button
            as="a"
            href="/signin"
            className="text-sm font-bold text-white bg-gray-800 hover:bg-blue-600 px-4 py-2 rounded-md"
          >
            Client Login
          </Button>
        </div>
      </nav>
      <Dialog
        open={mobileMenuOpen}
        onClose={setMobileMenuOpen}
        transition
        className="lg:hidden transition duration-300 ease-out">
        <div className="fixed inset-0 z-50 bg-black/20" />
        <DialogPanel 
          ref={dialogRef}
          className="fixed inset-y-0 right-0 z-50 w-screen overflow-y-auto bg-white px-6 py-6 sm:ring-1 sm:ring-gray-900/10"
        >
          <div className="flex items-center justify-between">
            <a href="/" className="-m-1.5 p-1.5">
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
          </div>
          <div className="flex flex-col justify-center h-[calc(100vh-100px)]">
            <div className="divide-y divide-gray-500/10">
              <div className="space-y-2 py-6">
                {navigation.map((item) => (
                  <a
                    key={item.name}
                    href={item.href}
                    className="-mx-3 block rounded-lg px-3 py-2 text-4xl/loose font-bold no-underline hover:bg-gray-50"
                  >
                    {item.name}
                  </a>
                ))}
              </div>
              <div className="py-6">
                <a
                  href="/signin"
                  className="-mx-3 block rounded-lg px-3 py-2.5 text-4xl/loose font-bold no-underline hover:bg-gray-50"
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
