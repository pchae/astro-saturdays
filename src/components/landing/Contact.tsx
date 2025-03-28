import { Button } from "@headlessui/react";

export default function Contact() {
    return (
      <section id="cta">
        <div className="w-full bg-slate-100 border-y border-blue-200">
          <div className="mx-auto max-w-7xl py-24 sm:px-4 bg-gray-50 border-x border-blue-200">
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
                <h2 className="text-3xl font-bold tracking-tight leading-tight text-balance text-white sm:text-4xl">
                  Add a force multiplier to your product design
                </h2>
                <p className="mt-6 text-lg leading-normal text-pretty text-gray-300">
                  Scale your capabilities with our Design systems and functional prototypes to achieve product market fit.
                </p>
                <div className="mt-10 flex items-center justify-center gap-x-6 lg:justify-start">
                  <Button
                    as="a"
                    href="mailto:hello@saturdays.io"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="rounded-sm bg-white px-4 py-3 text-sm leading-normal font-bold no-underline text-gray-900 shadow-xs hover:bg-gray-100 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white"
                  >
                    Get in touch
                  </Button>
                </div>
              </div>
              <div className="relative my-auto">
                <img
                  alt="Design system screenshot"
                  src="/img/0e33919ac2ff1ecaf5c2e46a967d0a9888eed786-1608x1206.avif"
                  width={1606}
                  height={1206}
                  className=" rounded-md"
                />
              </div>
            </div>
          </div>
        </div>
      </section>
    )
  }
  