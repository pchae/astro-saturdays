import { Button } from "@headlessui/react";

export default function Contact() {
    return (
      <section id="cta">
        <div className="w-full bg-orange-50 border-y border-blue-200">
          <div className="mx-auto max-w-7xl py-24 sm:px-4 bg-gray-50 border-x border-red-200">
            <div className="relative isolate overflow-hidden bg-gray-900 px-6 shadow-2xl sm:rounded-lg sm:px-16 lg:flex lg:gap-x-20 lg:px-24">
              <svg
                viewBox="0 0 1024 1024"
                aria-hidden="true"
                className="absolute top-1/2 left-1/2 -z-10 size-[64rem] -translate-y-1/2 [mask-image:radial-gradient(closest-side,white,transparent)] sm:left-full sm:-ml-80 lg:left-1/2 lg:ml-0 lg:-translate-x-1/2 lg:translate-y-0"
              >
                <circle r={512} cx={512} cy={512} fill="url(#759c1415-0410-454c-8f7c-9a820de03641)" fillOpacity="0.7" />
                <defs>
                  <radialGradient id="759c1415-0410-454c-8f7c-9a820de03641">
                    <stop stopColor="#7775D6" />
                    <stop offset={1} stopColor="#E935C1" />
                  </radialGradient>
                </defs>
              </svg>
              <div className="mx-auto max-w-md text-center lg:mx-0 lg:flex-auto py-12 md:py-16 lg:py-32 lg:text-left">
                <h2 className="text-3xl font-semibold tracking-tight text-balance text-white sm:text-4xl">
                  Boost your productivity by using our Design tools
                </h2>
                <p className="mt-6 text-lg leading-normal text-pretty text-gray-100">
                  Ac euismod vel sit maecenas id pellentesque eu sed consectetur. Malesuada adipiscing sagittis.
                </p>
                <div className="mt-10 flex items-center justify-center gap-x-6 lg:justify-start">
                  <Button
                    as="a"
                    href="/"
                    className="rounded-sm bg-white px-4 py-3 text-sm leading-normal font-bold no-underline text-gray-900 shadow-xs hover:bg-gray-100 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white"
                  >
                    Get in touch
                  </Button>
                </div>
              </div>
              <div className="relative mt-16 h-80 lg:mt-8">
                <img
                  alt="Design system screenshot"
                  src="https://tailwindcss.com/plus-assets/img/component-images/dark-project-app-screenshot.png"
                  width={1824}
                  height={1080}
                  className="absolute top-0 left-0 w-[57rem] max-w-none rounded-md bg-white/5 ring-1 ring-white/10"
                />
              </div>
            </div>
          </div>
        </div>
      </section>
    )
  }
  