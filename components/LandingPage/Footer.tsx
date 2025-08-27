import Image from "next/image";
import { FaGithub, FaLinkedin } from "react-icons/fa";
import Link from "next/link";

const Footer = () => {
  return (
    <footer className="bg-gradient-to-b from-[#0E1116] via-[#0A0B0F] to-black border-t border-gray-800">
      <div className="max-w-7xl mx-auto px-6 py-12 flex flex-col items-center text-center">
        
        {/* Logo */}
        <Link href="/">
          <Image width={200} height={100} src="/fullLogo.png" alt="SnipSavvy" className="cursor-pointer" />
        </Link>

        {/* Social Icons */}
        <div className="flex gap-6 mt-6">
          <a
            href="https://www.linkedin.com/company/snipsavvy-official"
            target="_blank"
            rel="noopener noreferrer"
            className="text-gray-400 hover:text-indigo-400 transition-colors"
          >
            <FaLinkedin size={25} />
          </a>
          <a
            href="https://www.github.com/SnipSavvy/"
            target="_blank"
            rel="noopener noreferrer"
            className="text-gray-400 hover:text-indigo-400 transition-colors"
          >
            <FaGithub size={25} />
          </a>
        </div>

        {/* Divider */}
        <div className="w-full border-t border-gray-800 mt-8 pt-6 flex flex-col sm:flex-row justify-between items-center text-gray-500 text-sm">
          <p>
            © {new Date().getFullYear()} <span className="font-semibold">SnipSavvy</span>. All rights reserved.
          </p>
          <div className="flex gap-4 mt-3 sm:mt-0">
            <Link href="/privacy" className="hover:text-indigo-400">Privacy Policy</Link>
            <Link href="/terms" className="hover:text-indigo-400">Terms of Service</Link>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
