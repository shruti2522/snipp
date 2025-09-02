"use client";
import React from "react";

export default function BackgroundFX() {
  return (
    <div className="absolute inset-0 -z-10 overflow-hidden">
      <div className="absolute w-[600px] h-[600px] bg-purple-500/20 rounded-full blur-3xl -top-40 -left-40 animate-pulse" />
      <div className="absolute w-[500px] h-[500px] bg-pink-500/20 rounded-full blur-3xl bottom-0 right-0 animate-pulse delay-1000" />
    </div>
  );
}
