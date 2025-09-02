"use client";
import React, { useState, useEffect } from "react";
import Image from "next/image";

const Loader = () => {
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Hide loader after a short delay (or when page is "ready")
    const timer = setTimeout(() => setLoading(false), 1500); // adjust time as needed
    return () => clearTimeout(timer);
  }, []);

  if (!loading) return null;

  return (
    <div className="fixed inset-0 flex justify-center items-center z-50 bg-black/40 backdrop-blur-sm">
      <Image
        height={200}
        width={200}
        src="https://cdn.pixabay.com/animation/2023/10/08/03/19/03-19-26-213_512.gif"
        alt="Loading"
      />
    </div>
  );
};

export default Loader;
