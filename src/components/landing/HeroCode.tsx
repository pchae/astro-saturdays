import { Button } from '@headlessui/react'
import { CodeBlockDemo } from '@/components/landing/CodeSample'
import { CodeBlock } from "@/components/ui/code-block"

export default function HeroCode() {
  const exampleCode = `
import { useState } from 'react';

function Counter() {
  const [count, setCount] = useState(0);

  return (
    <div>
      <p>You clicked {count} times</p>
      <button onClick={() => setCount(count + 1)}>
        Click me
      </button>
    </div>
  );
}
`;

  return (
    <section id="code">
      <div className="relative isolate overflow-hidden bg-linear-to-b from-indigo-100/20 border-y border-blue-200">
        <div className="mx-auto max-w-7xl pt-10 pb-24 sm:pb-32 lg:grid lg:grid-cols-2 lg:gap-x-8 lg:px-8 lg:py-40 border-x border-blue-200">
          <div className="px-6 lg:px-0 lg:pt-4">
            <div className="mx-auto max-w-2xl">
              <div className="max-w-lg">
                <div className="mt-24 sm:mt-32 lg:mt-16" />
                  <h1 className="mt-10 text-4xl sm:text-5xl font-bold tracking-tight leading-tight text-pretty text-gray-900">
                    We partner with your developers to build elegant Design Systems
                  </h1>
                  <p className="mt-6 text-xl leading-normal text-gray-600">
                    We create fully responsive, accessible, Design systems and performant code.
                  </p>
                  <div className="mt-10 flex items-center gap-x-6">
                    <Button
                      as="a"
                      href="/privacy"
                      className="px-4 py-3 bg-linear-to-tr/srgb from-purple-600 to-blue-400 rounded-sm shadow-xs text-md font-bold no-underline text-white hover:bg-gray-800 focus-visible:outline-2 focus-visible:outline-indigo-400"
                    >
                      View Projects
                    </Button>
                  </div>
              </div>
            </div>
          </div>
          <div className="mt-20 sm:mt-24 md:mx-auto md:max-w-2xl lg:mx-0 lg:mt-0 lg:max-w-full">
            <div className="shadow-lg md:rounded-2xl">
              <div className="bg-indigo-500 [clip-path:inset(0)] md:[clip-path:inset(0_round_var(--radius-2xl))]">
                <div
                  className="absolute -inset-y-px left-1/2 -z-10 ml-10 w-[200%] skew-x-[-30deg] bg-indigo-100 opacity-20 ring-1 ring-white ring-inset md:ml-20 lg:ml-36"
                  aria-hidden="true"
                />
                <div className="relative px-6 pt-8 sm:pt-16 md:pr-0 md:pl-16">
                  <div className="mx-auto max-w-2xl md:mx-0 md:max-w-none">
                    <div className="w-screen overflow-hidden rounded-tl-xl bg-gray-900">
                      <div className="flex bg-gray-800/40 ring-1 ring-white/5">
                      </div>
                      <div className="px-6 pt-6 pb-14">
                        <CodeBlock
                          language="typescript"
                          filename="AgentFlow.tsx"
                          code={exampleCode}
                        />
                      </div>
                    </div>
                  </div>
                  <div
                    className="pointer-events-none absolute inset-0 ring-1 ring-black/10 ring-inset md:rounded-3xl"
                    aria-hidden="true"
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className="absolute inset-x-0 bottom-0 -z-10 h-24 bg-linear-to-t from-white sm:h-32" />
      </div>
    </section>
  )
}
