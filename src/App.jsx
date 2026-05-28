import { useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from './assets/vite.svg'
import heroImg from './assets/hero.png'
import useOnlineStatus from "./hooks/useOnlineStatus.ts";
import InstallPrompt from "./components/InstallPrompt.jsx";
import Offline from "./components/Offline.jsx";

function App() {
  const [count, setCount] = useState(0)
  const isOnline = useOnlineStatus();

  return (
    <>
      {!isOnline && (
        <div className="sticky top-0 w-full bg-[#ff6b6b] text-white p-2.5 text-center z-1000">
          ⚠️ You are currently offline
        </div>
      )}

      {/* Show Offline component when offline */}
      {!isOnline ? (
        <Offline />
      ) : (
        <div className="text-center">
          <h1 className="text-4xl md:text-5xl lg:text-[56px] text-text-h font-medium tracking-[-1.68px] my-5 lg:my-8">My First PWA</h1>
          <p className="m-0 text-text">You're online! All features are available.</p>
          {/* Add the rest of your app content here */}
        </div>
      )}
      <InstallPrompt />
      <section id="center" className="flex flex-col gap-[25px] place-content-center place-items-center flex-grow max-lg:px-5 max-lg:pt-8 max-lg:pb-6 max-lg:gap-[18px]">
        <div className="hero relative">
          <img src={heroImg} className="base relative z-0 mx-auto w-[170px]" width="170" height="179" alt="" />
          <img src={reactLogo} className="framework absolute z-10 top-[34px] h-7 inset-x-0 mx-auto [transform:perspective(2000px)_rotateZ(300deg)_rotateX(44deg)_rotateY(39deg)_scale(1.4)]" alt="React logo" />
          <img src={viteLogo} className="vite absolute z-0 top-[107px] h-[26px] w-auto inset-x-0 mx-auto [transform:perspective(2000px)_rotateZ(300deg)_rotateX(40deg)_rotateY(39deg)_scale(0.8)]" alt="Vite logo" />
        </div>
        <div className="text-center">
          <h1 className="text-4xl md:text-5xl lg:text-[56px] text-text-h font-medium tracking-[-1.68px] my-5 lg:my-8">Get started</h1>
          <p className="m-0 text-text">
            Edit <code className="font-mono inline-flex rounded-[4px] text-text-h text-[15px] leading-[135%] px-2 py-1 bg-code-bg">src/App.jsx</code> and save to test <code className="font-mono inline-flex rounded-[4px] text-text-h text-[15px] leading-[135%] px-2 py-1 bg-code-bg">HMR</code>
          </p>
        </div>
        <button
          type="button"
          className="counter font-mono inline-flex rounded-[5px] text-accent bg-accent-bg text-base px-2.5 py-1.25 border-2 border-transparent transition-[border-color] duration-300 mb-6 hover:border-accent-border focus-visible:outline-2 focus-visible:outline-accent focus-visible:outline-offset-2"
          onClick={() => setCount((count) => count + 1)}
        >
          Count is {count}
        </button>
      </section>

      <div className="ticks relative w-full before:content-[''] before:absolute before:top-[-4.5px] before:left-0 before:border-[5px] before:border-transparent before:border-l-border after:content-[''] after:absolute after:top-[-4.5px] after:right-0 after:border-[5px] after:border-transparent after:border-r-border"></div>

      <section id="next-steps" className="flex border-t border-border text-left max-lg:flex-col max-lg:text-center">
        <div id="docs" className="flex-1 p-8 border-r border-border max-lg:p-[24px_20px] max-lg:border-r-0 max-lg:border-b">
          <svg className="icon mb-4 w-[22px] height-[22px]" role="presentation" aria-hidden="true">
            <use href="/icons.svg#documentation-icon"></use>
          </svg>
          <h2 className="text-2xl lg:text-[24px] font-medium text-text-h leading-[118%] tracking-[-0.24px] mb-2 max-lg:text-xl">Documentation</h2>
          <p className="m-0 text-text">Your questions, answered</p>
          <ul className="list-none p-0 flex gap-2 mt-8 max-lg:mt-5 max-lg:flex-wrap max-lg:justify-center">
            <li className="max-lg:flex-1 max-lg:basis-[calc(50%-8px)]">
              <a href="https://vite.dev/" target="_blank" className="text-text-h text-base rounded-md bg-social-bg flex px-3 py-1.5 items-center gap-2 no-underline transition-shadow duration-300 hover:shadow-custom max-lg:w-full max-lg:justify-center">
                <img className="logo h-[18px]" src={viteLogo} alt="" />
                Explore Vite
              </a>
            </li>
            <li className="max-lg:flex-1 max-lg:basis-[calc(50%-8px)]">
              <a href="https://react.dev/" target="_blank" className="text-text-h text-base rounded-md bg-social-bg flex px-3 py-1.5 items-center gap-2 no-underline transition-shadow duration-300 hover:shadow-custom max-lg:w-full max-lg:justify-center">
                <img className="button-icon h-[18px] w-[18px] dark:invert dark:brightness-200" src={reactLogo} alt="" />
                Learn more
              </a>
            </li>
          </ul>
        </div>
        <div id="social" className="flex-1 p-8 max-lg:p-[24px_20px]">
          <svg className="icon mb-4 w-[22px] height-[22px]" role="presentation" aria-hidden="true">
            <use href="/icons.svg#social-icon"></use>
          </svg>
          <h2 className="text-2xl lg:text-[24px] font-medium text-text-h leading-[118%] tracking-[-0.24px] mb-2 max-lg:text-xl">Connect with us</h2>
          <p className="m-0 text-text">Join the Vite community</p>
          <ul className="list-none p-0 flex gap-2 mt-8 max-lg:mt-5 max-lg:flex-wrap max-lg:justify-center">
            <li className="max-lg:flex-1 max-lg:basis-[calc(50%-8px)]">
              <a href="https://github.com/vitejs/vite" target="_blank" className="text-text-h text-base rounded-md bg-social-bg flex px-3 py-1.5 items-center gap-2 no-underline transition-shadow duration-300 hover:shadow-custom max-lg:w-full max-lg:justify-center">
                <svg
                  className="button-icon h-[18px] w-[18px] dark:invert dark:brightness-200"
                  role="presentation"
                  aria-hidden="true"
                >
                  <use href="/icons.svg#github-icon"></use>
                </svg>
                GitHub
              </a>
            </li>
            <li className="max-lg:flex-1 max-lg:basis-[calc(50%-8px)]">
              <a href="https://chat.vite.dev/" target="_blank" className="text-text-h text-base rounded-md bg-social-bg flex px-3 py-1.5 items-center gap-2 no-underline transition-shadow duration-300 hover:shadow-custom max-lg:w-full max-lg:justify-center">
                <svg
                  className="button-icon h-[18px] w-[18px] dark:invert dark:brightness-200"
                  role="presentation"
                  aria-hidden="true"
                >
                  <use href="/icons.svg#discord-icon"></use>
                </svg>
                Discord
              </a>
            </li>
            <li className="max-lg:flex-1 max-lg:basis-[calc(50%-8px)]">
              <a href="https://x.com/vite_js" target="_blank" className="text-text-h text-base rounded-md bg-social-bg flex px-3 py-1.5 items-center gap-2 no-underline transition-shadow duration-300 hover:shadow-custom max-lg:w-full max-lg:justify-center">
                <svg
                  className="button-icon h-[18px] w-[18px] dark:invert dark:brightness-200"
                  role="presentation"
                  aria-hidden="true"
                >
                  <use href="/icons.svg#x-icon"></use>
                </svg>
                X.com
              </a>
            </li>
            <li className="max-lg:flex-1 max-lg:basis-[calc(50%-8px)]">
              <a href="https://bsky.app/profile/vite.dev" target="_blank" className="text-text-h text-base rounded-md bg-social-bg flex px-3 py-1.5 items-center gap-2 no-underline transition-shadow duration-300 hover:shadow-custom max-lg:w-full max-lg:justify-center">
                <svg
                  className="button-icon h-[18px] w-[18px] dark:invert dark:brightness-200"
                  role="presentation"
                  aria-hidden="true"
                >
                  <use href="/icons.svg#bluesky-icon"></use>
                </svg>
                Bluesky
              </a>
            </li>
          </ul>
        </div>
      </section>

      <div className="ticks relative w-full before:content-[''] before:absolute before:top-[-4.5px] before:left-0 before:border-[5px] before:border-transparent before:border-l-border after:content-[''] after:absolute after:top-[-4.5px] after:right-0 after:border-[5px] after:border-transparent after:border-r-border"></div>
      <section id="spacer" className="h-[88px] border-t border-border max-lg:h-12"></section>
    </>
  );
}

export default App
