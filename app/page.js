'use client'

import { useEffect, useRef, useState } from 'react'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

export default function Page() {
  const heroRef = useRef(null)
  const videoRef = useRef(null)
  const indicatorRef = useRef(null)
  const [videoReady, setVideoReady] = useState(false)
  const [videoError, setVideoError] = useState(false)

  useEffect(() => {
    if (typeof window === 'undefined') return
    gsap.registerPlugin(ScrollTrigger)

    const video = videoRef.current
    const hero = heroRef.current
    if (!video || !hero) return

    // Prevent autoplay - we control playback via scroll
    video.pause()
    video.removeAttribute('autoplay')

    let st
    let tween

    const setup = () => {
      const duration = video.duration
      if (!duration || isNaN(duration) || !isFinite(duration)) return

      // Use a proxy object so GSAP can interpolate currentTime smoothly
      const proxy = { time: 0 }

      tween = gsap.to(proxy, {
        time: duration,
        ease: 'none',
        onUpdate: () => {
          if (video.readyState >= 1) {
            try {
              video.currentTime = proxy.time
            } catch (_) {}
          }
        },
        scrollTrigger: {
          trigger: hero,
          start: 'top top',
          end: 'bottom bottom',
          scrub: 0.4,
          pin: video.parentElement, // pin the sticky container
          pinSpacing: false,
          anticipatePin: 1,
          invalidateOnRefresh: true,
        },
      })

      st = tween.scrollTrigger

      // Fade out the scroll indicator as the user scrolls
      if (indicatorRef.current) {
        gsap.to(indicatorRef.current, {
          opacity: 0,
          y: 20,
          ease: 'none',
          scrollTrigger: {
            trigger: hero,
            start: 'top top',
            end: '20% top',
            scrub: true,
          },
        })
      }

      setVideoReady(true)
    }

    const onLoaded = () => setup()
    const onError = () => setVideoError(true)

    if (video.readyState >= 1 && video.duration && !isNaN(video.duration)) {
      setup()
    } else {
      video.addEventListener('loadedmetadata', onLoaded, { once: true })
      video.addEventListener('error', onError, { once: true })
    }

    return () => {
      video.removeEventListener('loadedmetadata', onLoaded)
      video.removeEventListener('error', onError)
      if (tween) tween.kill()
      ScrollTrigger.getAll().forEach((t) => t.kill())
    }
  }, [])

  return (
    <main className="relative bg-[#FAF9F6]">
      {/* ============== HERO (300vh) ============== */}
      <section
        ref={heroRef}
        className="relative w-full"
        style={{ height: '300vh' }}
        aria-label="Cinematic introduction"
      >
        {/* Sticky/pinned viewport */}
        <div className="sticky top-0 h-screen w-full overflow-hidden bg-black">
          <video
            ref={videoRef}
            src="/final_pasay.webm"
            className="absolute inset-0 h-full w-full object-cover"
            muted
            playsInline
            preload="auto"
            // intentionally NO autoplay
          />

          {/* Cinematic gradient overlay for legibility */}
          <div
            className="pointer-events-none absolute inset-0"
            style={{
              background:
                'linear-gradient(180deg, rgba(0,0,0,0.45) 0%, rgba(0,0,0,0.15) 35%, rgba(0,0,0,0.25) 65%, rgba(0,0,0,0.55) 100%)',
            }}
          />

          {/* Subtle vignette */}
          <div
            className="pointer-events-none absolute inset-0"
            style={{
              background:
                'radial-gradient(ellipse at center, rgba(0,0,0,0) 55%, rgba(0,0,0,0.45) 100%)',
            }}
          />

          {/* Top brand mark */}
          <div className="absolute top-0 left-0 right-0 z-10 flex items-center justify-between px-8 md:px-14 py-7">
            <div className="flex items-center gap-3">
              <div className="h-px w-8 bg-[#C5A880]/80" />
              <span
                className="text-[10px] md:text-[11px] tracking-[0.42em] uppercase text-white/85"
                style={{ fontWeight: 300 }}
              >
                Maison · Est. MMXXV
              </span>
            </div>
            <span
              className="hidden md:inline text-[10px] tracking-[0.42em] uppercase text-white/70"
              style={{ fontWeight: 300 }}
            >
              An Invitation
            </span>
          </div>

          {/* Center title */}
          <div className="absolute inset-0 z-10 flex flex-col items-center justify-center px-6 text-center">
            <p
              className="text-[10px] md:text-xs tracking-[0.55em] uppercase text-[#C5A880] mb-7 shimmer"
              style={{ fontWeight: 400 }}
            >
              — A Quiet Indulgence —
            </p>
            <h1
              className="font-serif-display text-white text-5xl sm:text-6xl md:text-8xl lg:text-[9rem] leading-[0.95] tracking-tight"
              style={{ fontWeight: 400 }}
            >
              The Art of
              <br />
              <em
                className="font-serif-elegant italic text-[#E9D9BC]"
                style={{ fontStyle: 'italic', fontWeight: 300 }}
              >
                Stillness
              </em>
            </h1>
            <div className="mt-10 flex items-center gap-4">
              <span className="h-px w-10 bg-[#C5A880]/70" />
              <p
                className="text-[10px] md:text-xs tracking-[0.45em] uppercase text-white/80"
                style={{ fontWeight: 300 }}
              >
                Pasay · Manila
              </p>
              <span className="h-px w-10 bg-[#C5A880]/70" />
            </div>
          </div>

          {/* Scroll indicator */}
          <div
            ref={indicatorRef}
            className="absolute bottom-10 left-1/2 z-10 -translate-x-1/2 flex flex-col items-center gap-3"
          >
            <span
              className="text-[10px] tracking-[0.5em] uppercase text-white/80"
              style={{ fontWeight: 300 }}
            >
              Scroll to Enter
            </span>
            <div className="relative h-10 w-px overflow-hidden bg-white/20">
              <div className="absolute inset-x-0 top-0 h-4 bg-[#C5A880] scroll-pulse" />
            </div>
          </div>

          {/* Loading / error states */}
          {!videoReady && !videoError && (
            <div className="absolute bottom-4 right-4 z-10 text-[10px] tracking-[0.3em] uppercase text-white/40">
              Preparing the experience…
            </div>
          )}
          {videoError && (
            <div className="absolute bottom-4 right-4 z-10 text-[10px] tracking-[0.3em] uppercase text-white/50">
              Video unavailable
            </div>
          )}
        </div>
      </section>

      {/* ============== MENU HANDOFF ============== */}
      <section
        className="relative z-20 -mt-10 rounded-t-3xl bg-[#FAF9F6]"
        style={{
          boxShadow:
            '0 -30px 60px -20px rgba(62, 54, 46, 0.25), 0 -2px 0 0 rgba(197, 168, 128, 0.15)',
        }}
      >
        {/* Decorative top handle */}
        <div className="flex justify-center pt-5">
          <div className="h-[3px] w-14 rounded-full bg-[#C5A880]/40" />
        </div>

        <div className="mx-auto max-w-2xl px-6 md:px-10 pt-16 pb-28">
          {/* Ornamental eyebrow */}
          <div className="flex items-center justify-center gap-4 mb-6">
            <span className="h-px w-10 bg-[#C5A880]/60" />
            <span
              className="text-[10px] tracking-[0.55em] uppercase text-[#C5A880]"
              style={{ fontWeight: 500 }}
            >
              Welcome
            </span>
            <span className="h-px w-10 bg-[#C5A880]/60" />
          </div>

          {/* Heading */}
          <h2
            className="font-serif-display text-center text-5xl md:text-7xl text-[#3E362E] leading-[1.02] tracking-tight"
            style={{ fontWeight: 400 }}
          >
            The{' '}
            <em
              className="font-serif-elegant italic text-[#8A9A8B]"
              style={{ fontStyle: 'italic', fontWeight: 300 }}
            >
              Experience
            </em>
          </h2>

          <p
            className="mt-7 text-center text-[#3E362E]/70 text-base md:text-lg max-w-md mx-auto leading-relaxed"
            style={{ fontWeight: 300 }}
          >
            Choose your path — traverse our curated menu, or allow us to compose
            something in harmony with your mood this hour.
          </p>

          {/* Buttons */}
          <div className="mt-14 flex flex-col gap-5">
            <button
              className="group relative w-full overflow-hidden rounded-full bg-[#3E362E] px-10 py-6 text-[#C5A880] transition-all duration-500 hover:bg-[#2c2620] hover:shadow-[0_20px_60px_-15px_rgba(62,54,46,0.45)]"
              style={{ fontWeight: 300 }}
            >
              <span className="relative z-10 flex items-center justify-center gap-4">
                <span className="h-px w-6 bg-[#C5A880]/60 transition-all duration-500 group-hover:w-10" />
                <span className="text-[11px] md:text-xs tracking-[0.5em] uppercase">
                  Standard Menu
                </span>
                <span className="h-px w-6 bg-[#C5A880]/60 transition-all duration-500 group-hover:w-10" />
              </span>
            </button>

            <button
              className="group relative w-full overflow-hidden rounded-full border border-[#C5A880] bg-transparent px-10 py-6 text-[#3E362E] transition-all duration-500 hover:bg-[#C5A880]/8 hover:shadow-[0_20px_60px_-25px_rgba(197,168,128,0.5)]"
              style={{ fontWeight: 300 }}
            >
              <span className="relative z-10 flex items-center justify-center gap-4">
                <span className="h-px w-6 bg-[#3E362E]/30 transition-all duration-500 group-hover:w-10" />
                <span className="text-[11px] md:text-xs tracking-[0.5em] uppercase">
                  Match My Vibe
                </span>
                <span className="h-px w-6 bg-[#3E362E]/30 transition-all duration-500 group-hover:w-10" />
              </span>
            </button>
          </div>

          {/* Footer ornament */}
          <div className="mt-20 flex items-center justify-center gap-3">
            <span className="h-px w-12 bg-[#3E362E]/15" />
            <span
              className="text-[9px] tracking-[0.5em] uppercase text-[#3E362E]/40"
              style={{ fontWeight: 400 }}
            >
              ❦
            </span>
            <span className="h-px w-12 bg-[#3E362E]/15" />
          </div>
        </div>
      </section>
    </main>
  )
}
