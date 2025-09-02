"use client";

import { useState, useRef, useEffect } from "react";
import { signOut } from "next-auth/react";
import { FaUserCircle } from "react-icons/fa";

export default function ProfileMenu({ profileImage, profileInitial }: { profileImage?: string | null, profileInitial: string }) {
  const [open, setOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  // close when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <div className="relative" ref={menuRef}>
      {/* Avatar button */}
      <button
        onClick={() => setOpen((prev) => !prev)}
        className="w-12 h-12 rounded-full bg-gray-600 flex items-center justify-center text-white text-lg font-bold cursor-pointer overflow-hidden"
      >
        {profileImage ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img src={profileImage} alt="profile" className="w-full h-full object-cover" />
        ) : (
          <span>{profileInitial}</span>
        )}
      </button>

      {/* Dropdown */}
      {open && (
        <div className="absolute bottom-14 left-0 w-48 rounded-xl bg-[#1f2028] shadow-lg ring-1 ring-gray-700 z-50">
          <ul className="py-2 text-sm text-gray-200">
            <li className="px-4 py-2 hover:bg-gray-700 cursor-pointer">Profile</li>
            <li className="px-4 py-2 hover:bg-gray-700 cursor-pointer">Settings</li>
            <li
              className="px-4 py-2 text-red-400 hover:text-red-300 hover:bg-gray-700 cursor-pointer"
              onClick={() => signOut()}
            >
              Sign out
            </li>
          </ul>
        </div>
      )}
    </div>
  );
}
