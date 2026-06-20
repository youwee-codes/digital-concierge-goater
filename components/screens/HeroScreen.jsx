'use client'

import React, { useEffect, useRef, useState } from 'react'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { motion } from 'framer-motion'

const EASE = [0.16, 1, 0.3, 1]

export default function HeroScreen({ onNavigate }) {
  // Refs for the architecture pieces
  const heroRef = useRef(null)        // 300vh trigger container
  const stickyRef = useRef(null)      // sticky 100vh pinned container
  const canvasRef = useRef(null)      // <canvas> element replacing video
  const menuRef = useRef(null)        // handoff menu section
  const indicatorRef = useRef(null)   // "scroll to enter" cue

  const [videoReady, setVideoReady] = useState(false)
  const frameCount = 178; // Exact frames from FFmpeg

  useEffect(() => {
    if (typeof window === 'undefined') return

    // Register the plugin
    gsap.registerPlugin(ScrollTrigger)

    // Always start the experience from the top
    window.scrollTo({ top: 0, behavior: 'auto' })

    const canvas = canvasRef.current
    const hero = heroRef.current
    const sticky = stickyRef.current
    const menu = menuRef.current

    if (!canvas || !hero || !sticky) return

    const context = canvas.getContext("2d");
    
    // Set native resolution of your AI video frames
    canvas.width = 720;
    canvas.height = 1280;

    // Preload the image sequence
    const images = [];
    const sequence = { frame: 0 };
    let loadedCount = 0;

    const currentFrame = (index) =>
      `/frames/frame_${(index + 1).toString().padStart(4, "0")}.jpg`;

    for (let i = 0; i < frameCount; i++) {
      const img = new Image();
      img.src = currentFrame(i);
      img.onload = () => {
        loadedCount++;
        // Draw the first frame immediately when it loads
        if (loadedCount === 1) {
          context.drawImage(images[0], 0, 0, canvas.width, canvas.height);
          setVideoReady(true);
        }
      };
      images.push(img);
    }

    // Holders for cleanup
    let videoTimeline = null
    let menuTween = null
    let indicatorTween = null
    let refreshTimer = null

    // ─────────────────────────────────────────────
    // The Flipbook Scrub Timeline
    // ─────────────────────────────────────────────
    videoTimeline = gsap.timeline({
      scrollTrigger: {
        trigger: hero,
        start: 'top top',
        end: 'bottom bottom',
        scrub: 1,                    // 1s catch-up — heavy & expensive feel
        pin: sticky,                 // pin the sticky 100vh container
        pinSpacing: false,           // menu sits right under the pin release
        anticipatePin: 1,            // smoother pin on mobile
        invalidateOnRefresh: true,
      },
    })

    // Scrub the sequence from 0 to 177
    videoTimeline.to(
      sequence,
      {
        frame: frameCount - 1,
        snap: "frame",
        ease: 'none',
        onUpdate: () => {
          if (images[sequence.frame]) {
            context.drawImage(images[sequence.frame], 0, 0, canvas.width, canvas.height);
          }
        }
      },
      0
    )

    // ─────────────────────────────────────────────
    // The Mobile Handoff (Emergent's exact logic)
    // ─────────────────────────────────────────────
    if (menu) {
      gsap.set(menu, { y: 80 })
      menuTween = gsap.to(menu, {
        y: 0,
        ease: 'none',
        scrollTrigger: {
          trigger: hero,
          start: 'bottom 110%',  // begins ~20% before the hero ends
          end: 'bottom bottom',
          scrub: 1,
          invalidateOnRefresh: true,
        },
      })
    }

    // Fade out the scroll indicator
    if (indicatorRef.current) {
      indicatorTween = gsap.to(indicatorRef.current, {
        opacity: 0,
        y: 20,
        ease: 'none',
        scrollTrigger: {
          trigger: hero,
          start: 'top top',
          end: '15% top',
          scrub: true,
        },
      })
    }

    // Refresh after fonts / layout settle
    refreshTimer = window.setTimeout(() => ScrollTrigger.refresh(), 250)

    // ─────────────────────────────────────────────
    // Cleanup
    // ─────────────────────────────────────────────
    return () => {
      if (refreshTimer) clearTimeout(refreshTimer)
      if (videoTimeline) {
        videoTimeline.scrollTrigger && videoTimeline.scrollTrigger.kill()
        videoTimeline.kill()
      }
      if (menuTween) {
        menuTween.scrollTrigger && menuTween.scrollTrigger.kill()
        menuTween.kill()
      }
      if (indicatorTween) {
        indicatorTween.scrollTrigger && indicatorTween.scrollTrigger.kill()
        indicatorTween.kill()
      }
      ScrollTrigger.getAll().forEach((t) => t.kill())
    }
  }, [])

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0, scale: 0.97, filter: 'blur(6px)' }}
      transition={{ duration: 0.7, ease: EASE }}
      className="relative bg-[#FAF9F6] font-sans"
    >
      {/* ============================================== */}
      {/* HERO — 300vh trigger container                  */}
      {/* ============================================== */}
      <section
        ref={heroRef}
        className="relative w-full"
        style={{ height: '300vh' }}
        aria-label="Cinematic introduction"
      >
        {/* Pinned 100vh sticky container — overflow hidden */}
        <div
          ref={stickyRef}
          className="sticky top-0 h-screen w-full overflow-hidden bg-black"
          style={{
            willChange: 'transform',
            transform: 'translateZ(0)',
          }}
        >
          {/* THE ENTERPRISE FLIPBOOK FIX */}
          <canvas
            ref={canvasRef}
            className="absolute inset-0 h-full w-full object-cover"
            style={{
              willChange: 'transform',
              transform: 'translateZ(0)',
            }}
          />

          {/* Subtle cinematic gradient for text legibility */}
          <div
            className="pointer-events-none absolute inset-0"
            style={{
              background:
                'linear-gradient(180deg, rgba(0,0,0,0.45) 0%, rgba(0,0,0,0.15) 35%, rgba(0,0,0,0.25) 65%, rgba(0,0,0,0.55) 100%)',
            }}
          />
          {/* Vignette */}
          <div
            className="pointer-events-none absolute inset-0"
            style={{
              background:
                'radial-gradient(ellipse at center, rgba(0,0,0,0) 55%, rgba(0,0,0,0.45) 100%)',
            }}
          />

          {/* Top brand mark */}
          <div className="absolute top-0 left-0 right-0 z-10 flex items-center justify-between px-6 py-6">
            <div className="flex items-center gap-2">
              <div className="h-px w-6 bg-[#C5A880]/80" />
              <span className="text-[9px] tracking-[0.42em] uppercase text-white/85" style={{ fontWeight: 300 }}>
                Maison
              </span>
            </div>
            <span className="text-[9px] tracking-[0.42em] uppercase text-white/70" style={{ fontWeight: 300 }}>
              MMXXV
            </span>
          </div>

          {/* Center title */}
          <div className="absolute inset-0 z-10 flex flex-col items-center justify-center px-6 text-center">
            <p className="text-[9px] tracking-[0.55em] uppercase text-[#C5A880] mb-6 shimmer" style={{ fontWeight: 400 }}>
              — A Quiet Indulgence —
            </p>
            <h1
              className="font-serif-display text-white text-5xl sm:text-6xl leading-[0.95] tracking-tight"
              style={{ fontWeight: 400 }}
            >
              The Art of
              <br />
              <em className="font-serif-elegant italic text-[#E9D9BC]" style={{ fontStyle: 'italic', fontWeight: 300 }}>
                Stillness
              </em>
            </h1>
            <div className="mt-8 flex items-center gap-3">
              <span className="h-px w-8 bg-[#C5A880]/70" />
              <p className="text-[9px] tracking-[0.45em] uppercase text-white/80" style={{ fontWeight: 300 }}>
                Pasay · Manila
              </p>
              <span className="h-px w-8 bg-[#C5A880]/70" />
            </div>
          </div>

          {/* Scroll-to-enter indicator */}
          <div
            ref={indicatorRef}
            className="absolute bottom-10 left-1/2 z-10 -translate-x-1/2 flex flex-col items-center gap-3"
          >
            <span className="text-[9px] tracking-[0.5em] uppercase text-white/80" style={{ fontWeight: 300 }}>
              Scroll to Enter
            </span>
            <div className="relative h-10 w-px overflow-hidden bg-white/20">
              <div className="absolute inset-x-0 top-0 h-4 bg-[#C5A880] scroll-pulse" />
            </div>
          </div>

          {/* States */}
          {!videoReady && (
            <div className="absolute bottom-3 right-3 z-10 text-[9px] tracking-[0.3em] uppercase text-white/40">
              Preparing…
            </div>
          )}
        </div>
      </section>

      {/* ============================================== */}
      {/* MENU HANDOFF — glides up over the pinned video  */}
      {/* ============================================== */}
      <section
        ref={menuRef}
        className="relative z-20 -mt-10 rounded-t-3xl bg-[#FAF9F6]"
        style={{
          boxShadow:
            '0 -30px 60px -20px rgba(62, 54, 46, 0.25), 0 -2px 0 0 rgba(197, 168, 128, 0.15)',
          willChange: 'transform',
        }}
      >
        <div className="flex justify-center pt-5">
          <div className="h-[3px] w-12 rounded-full bg-[#C5A880]/40" />
        </div>

        <div className="px-6 pt-14 pb-20">
          <div className="flex items-center justify-center gap-3 mb-5">
            <span className="h-px w-8 bg-[#C5A880]/60" />
            <span className="text-[9px] tracking-[0.55em] uppercase text-[#C5A880]" style={{ fontWeight: 500 }}>
              Welcome
            </span>
            <span className="h-px w-8 bg-[#C5A880]/60" />
          </div>

          <h2
            className="font-serif-display text-center text-5xl text-[#3E362E] leading-[1.02] tracking-tight"
            style={{ fontWeight: 400 }}
          >
            The{' '}
            <em className="font-serif-elegant italic text-[#8A9A8B]" style={{ fontStyle: 'italic', fontWeight: 300 }}>
              Experience
            </em>
          </h2>

          <p
            className="mt-6 text-center text-[#3E362E]/70 text-sm max-w-xs mx-auto leading-relaxed"
            style={{ fontWeight: 300 }}
          >
            Choose your path — traverse our curated menu, or allow us to compose
            something in harmony with your mood.
          </p>

          <div className="mt-12 flex flex-col gap-4">
            <button
              onClick={() => onNavigate('menu')}
              className="group relative w-full overflow-hidden rounded-full bg-[#3E362E] px-8 py-5 text-[#C5A880] transition-all duration-500 hover:bg-[#2c2620] active:scale-[0.98]"
              style={{ fontWeight: 300 }}
            >
              <span className="relative z-10 flex items-center justify-center gap-3">
                <span className="h-px w-5 bg-[#C5A880]/60 transition-all duration-500 group-hover:w-8" />
                <span className="text-[11px] tracking-[0.5em] uppercase">Standard Menu</span>
                <span className="h-px w-5 bg-[#C5A880]/60 transition-all duration-500 group-hover:w-8" />
              </span>
            </button>

            <button
              onClick={() => onNavigate('vibe')}
              className="group relative w-full overflow-hidden rounded-full border border-[#C5A880] bg-transparent px-8 py-5 text-[#3E362E] transition-all duration-500 hover:bg-[#C5A880]/10 active:scale-[0.98]"
              style={{ fontWeight: 300 }}
            >
              <span className="relative z-10 flex items-center justify-center gap-3">
                <span className="h-px w-5 bg-[#3E362E]/30 transition-all duration-500 group-hover:w-8" />
                <span className="text-[11px] tracking-[0.5em] uppercase">Match My Vibe</span>
                <span className="h-px w-5 bg-[#3E362E]/30 transition-all duration-500 group-hover:w-8" />
              </span>
            </button>
          </div>

          <div className="mt-16 flex items-center justify-center gap-3">
            <span className="h-px w-10 bg-[#3E362E]/15" />
            <span className="text-[9px] tracking-[0.5em] uppercase text-[#3E362E]/40" style={{ fontWeight: 400 }}>
              ❦
            </span>
            <span className="h-px w-10 bg-[#3E362E]/15" />
          </div>
        </div>
      </section>
    </motion.div>
  )
}