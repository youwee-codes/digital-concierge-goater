"use client";

import React, { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

// Register GSAP Plugin
gsap.registerPlugin(ScrollTrigger);

export default function HeroCanvasScroll() {
  const canvasRef = useRef(null);
  const containerRef = useRef(null);
  const frameCount = 178; // The exact number of frames FFmpeg generated

  useEffect(() => {
    const canvas = canvasRef.current;
    const context = canvas.getContext("2d");
    const container = containerRef.current;

    // The native resolution of your AI video
    canvas.width = 720;
    canvas.height = 1280;

    // Helper function to generate the correct file path (e.g., /frames/frame_0001.jpg)
    const currentFrame = (index) =>
      `/frames/frame_${(index + 1).toString().padStart(4, "0")}.jpg`;

    // Preload the images into the browser memory
    const images = [];
    const sequence = { frame: 0 };

    for (let i = 0; i < frameCount; i++) {
      const img = new Image();
      img.src = currentFrame(i);
      images.push(img);
    }

    // Draw the very first frame immediately so the screen isn't blank
    images[0].onload = () => {
      context.drawImage(images[0], 0, 0, canvas.width, canvas.height);
    };

    // The GSAP Scroll Magic
    let tl = gsap.timeline({
      scrollTrigger: {
        trigger: container,
        start: "top top",
        end: "bottom bottom",
        scrub: 1, // That buttery 1-second momentum delay
        pin: true,
      },
    });

    // Animate the sequence object from 0 to 177
    tl.to(sequence, {
      frame: frameCount - 1,
      snap: "frame", // Forces GSAP to land on whole numbers only
      ease: "none",
      onUpdate: () => {
        // Every time the user scrolls, draw the matching image
        if (images[sequence.frame]) {
          context.drawImage(images[sequence.frame], 0, 0, canvas.width, canvas.height);
        }
      },
    });

    // Fade out the "Scroll to Enter" text as soon as they start moving
    tl.to(".scroll-indicator", { opacity: 0, duration: 0.1 }, 0);

    return () => {
      ScrollTrigger.getAll().forEach((t) => t.kill());
    };
  }, []);

  return (
    // Strict mobile layout (max-w-md mx-auto) for that native app feel
    <div className="w-full bg-[#FAF9F6] min-h-screen font-sans text-[#3E362E]">
      <div className="max-w-md mx-auto relative min-h-screen shadow-2xl overflow-hidden bg-black">
        
        {/* The 300vh Scroll Container */}
        <div ref={containerRef} className="relative h-[300vh] bg-black w-full">
          
          {/* The Sticky Canvas Wrapper */}
          <div className="sticky top-0 h-screen w-full overflow-hidden bg-black">
            <canvas
              ref={canvasRef}
              className="absolute top-0 left-0 w-full h-full object-cover"
            />

            {/* Subtle dark overlay for premium text contrast */}
            <div className="absolute inset-0 bg-black/20 pointer-events-none" />

            {/* Scroll Indicator */}
            <div className="scroll-indicator absolute bottom-12 left-1/2 -translate-x-1/2 flex flex-col items-center text-white/90 animate-pulse">
              <span className="text-xs font-light tracking-[0.3em] uppercase mb-2 drop-shadow-md">
                Scroll to Enter
              </span>
              <svg className="w-5 h-5 drop-shadow-md" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19 14l-7 7m0 0l-7-7m7 7V3" />
              </svg>
            </div>
          </div>
        </div>

        {/* The Handoff: The Alabaster & Champagne Menu Section */}
        <div className="relative z-10 min-h-screen bg-[#FAF9F6] rounded-t-3xl -mt-8 pt-12 px-6 shadow-[0_-15px_40px_rgba(0,0,0,0.15)]">
          <div className="w-12 h-1 bg-gray-300 rounded-full mx-auto mb-8" />
          
          <h1 className="text-4xl font-serif text-center text-[#3E362E] mb-3">
            The Experience
          </h1>
          <p className="text-center text-[#3E362E]/60 mb-10 font-light tracking-wide">
            Select your journey below.
          </p>
          
          <div className="flex flex-col gap-5">
            <button className="w-full py-4 bg-[#3E362E] text-[#C5A880] rounded-full font-medium tracking-widest uppercase text-sm shadow-xl transition-transform active:scale-95">
              Standard Menu
            </button>
            <button className="w-full py-4 border border-[#C5A880] text-[#3E362E] rounded-full font-medium tracking-widest uppercase text-sm transition-transform active:scale-95">
              Match My Vibe
            </button>
          </div>
        </div>

      </div>
    </div>
  );
}