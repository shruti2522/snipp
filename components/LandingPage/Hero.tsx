"use client";
import React, { useState } from "react";
import Image from "next/image";
import Link from "next/link";

const Hero: React.FC = () => {
  const [menu, setMenu] = useState<boolean>(false);

  return (
    <>
      <div className="relative w-full min-h-screen bg-gradient-to-br from-[#0E1116] via-[#1A1D29] to-[#0E1116] overflow-hidden flex flex-col">
        
        {/* Background Image */}
        <div className="hidden md:block absolute inset-0">
          <Image
            className="object-cover opacity-20"
            src="/hero.png"
            alt=""
            layout="fill"
            sizes="100vw"
          />
        </div>

        {/* Navbar */}
        <nav className="relative z-50">
          <div className="mx-auto container flex justify-between items-center px-6 py-6">
            <Link href="/">
              <Image
                width={160}
                height={40}
                src="/fullLogo.png"
                alt="logo"
                className="cursor-pointer"
              />
            </Link>
            <ul className="hidden lg:flex items-center space-x-8 text-white font-medium">
              <li><Link href="/" className="hover:text-indigo-400">Home</Link></li>
              <li><Link href="#features" className="hover:text-indigo-400">Features</Link></li>
              <li><Link href="https://github.com/SnipSavvy?tab=repositories" target="_blank" className="hover:text-indigo-400">Github</Link></li>
              <li><Link href="#signup" className="hover:text-indigo-400">Sign Up</Link></li>
            </ul>
            <button 
              className="lg:hidden text-white" 
              onClick={() => setMenu(!menu)}
            >
              ☰
            </button>
          </div>
        </nav>

        {/* Mobile Menu */}
        {menu && (
          <div className="absolute top-16 left-0 right-0 bg-[#1A1D29] text-white p-4 space-y-4 lg:hidden z-50">
            <Link href="/" onClick={() => setMenu(false)}>Home</Link>
            <Link href="#features" onClick={() => setMenu(false)}>Features</Link>
            <Link href="https://github.com/SnipSavvy?tab=repositories" target="_blank" onClick={() => setMenu(false)}>Github</Link>
            <Link href="#signup" onClick={() => setMenu(false)}>Sign Up</Link>
          </div>
        )}

        {/* Hero Content */}
        <div className="relative flex-1 flex flex-col items-center justify-center text-center z-10 px-6">
          <h1 className="text-5xl md:text-6xl font-extrabold text-white leading-tight max-w-3xl">
            Snippet Sync – <span className="text-indigo-400">Web + VS Code</span>
          </h1>
          <p className="mt-6 text-lg md:text-xl text-gray-300 max-w-2xl">
            Use Snippet Sync anywhere: in your browser or inside VS Code. 
            Your snippets stay in sync <span className="font-semibold text-indigo-300">instantly</span> in both directions.
          </p>

          {/* Platform Icons
          <div className="flex gap-8 mt-6 text-gray-400">
            <div className="flex items-center gap-2">
              <Image src="/web-icon.svg" alt="Web App" width={28} height={28} />
              <span>Web App</span>
            </div>
            <div className="flex items-center gap-2">
              <Image src="/vscode-icon.svg" alt="VS Code" width={28} height={28} />
              <span>VS Code Extension</span>
            </div>
          </div> */}
          
          {/* Buttons */}
          <div className="mt-10 flex flex-col sm:flex-row gap-4 flex-wrap justify-center">
  <Link href="#signup">
    <button className="group px-8 py-4 bg-gradient-to-r from-indigo-500 to-purple-500 text-white font-semibold rounded-xl shadow-lg hover:scale-105 transition-all flex items-center gap-2">
      <span>Get Started Now</span>
    </button>
  </Link>
  <Link href="#signup">
    <button className="px-8 py-4 border-2 border-indigo-300 text-indigo-200 font-semibold rounded-xl shadow-lg 
      hover:border-indigo-500 hover:bg-indigo-500 hover:text-white transition-all">
      Get VS Code Extension
    </button>
  </Link>
</div>
        </div>

        {/* Decorative Image */}
        {/* <div className="hidden md:flex justify-center pb-12">
          <Image
            src="/photo.png"
            alt="sample page"
            width={800}
            height={500}
            className="rounded-lg shadow-2xl border border-gray-700"
          />
        </div> */}

      </div>
    </>
  );
};

export default Hero;
