'use client'

import { useEffect, useRef, useState } from 'react'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { motion } from 'framer-motion'

const EASE = [0.16, 1, 0.3, 1]

export default function HeroScreen({ onNavigate }) {
  const heroRef = useRef(null)
  const videoRef = useRef(null)
  const indicatorRef = useRef(null)
  const [videoReady, setVideoReady] = useState(false)
  const [videoError, setVideoError] = useState(false)

  useEffect(() => {
    if (typeof window === 'undefined') return
    gsap.registerPlugin(ScrollTrigger)

    // Scroll to top when this screen mounts
    window.scrollTo({ top: 0, behavior: 'instant' in window ? 'instant' : 'auto' })

    const video = videoRef.current
    const hero = heroRef.current
    if (!video || !hero) return

    video.pause()
    video.removeAttribute('autoplay')

    let tween

    const setup = () => {
      const duration = video.duration
      if (!duration || isNaN(duration) || !isFinite(duration)) return

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
          pin: video.parentElement,
          pinSpacing: false,
          anticipatePin: 1,
          invalidateOnRefresh: true,
        },
      })

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

    // Refresh shortly after mount in case fonts/layout shifted
    const refreshTimer = setTimeout(() => ScrollTrigger.refresh(), 250)

    return () => {
      clearTimeout(refreshTimer)
      video.removeEventListener('loadedmetadata', onLoaded)
      video.removeEventListener('error', onError)
      if (tween) tween.kill()
      ScrollTrigger.getAll().forEach((t) => t.kill())
    }
  }, [])

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0, scale: 0.97, filter: 'blur(6px)' }}
      transition={{ duration: 0.7, ease: EASE }}
      className="relative bg-[#FAF9F6]"
    >
      {/* HERO 300vh */}
      <section
        ref={heroRef}
        className="relative w-full"
        style={{ height: '300vh' }}
        aria-label="Cinematic introduction"
      >
        <div className="sticky top-0 h-screen w-full overflow-hidden bg-black">
          <video
            ref={videoRef}
            src="/final_pasay.webm"
            className="absolute inset-0 h-full w-full object-cover"
            muted
            playsInline
            preload="auto"
          />

          <div
            className="pointer-events-none absolute inset-0"
            style={{
              background:
                'linear-gradient(180deg, rgba(0,0,0,0.45) 0%, rgba(0,0,0,0.15) 35%, rgba(0,0,0,0.25) 65%, rgba(0,0,0,0.55) 100%)',
            }}
          />
          <div
            className="pointer-events-none absolute inset-0"
            style={{
              background:
                'radial-gradient(ellipse at center, rgba(0,0,0,0) 55%, rgba(0,0,0,0.45) 100%)',
            }}
          />

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

          {!videoReady && !videoError && (
            <div className="absolute bottom-3 right-3 z-10 text-[9px] tracking-[0.3em] uppercase text-white/40">
              Preparing…
            </div>
          )}
          {videoError && (
            <div className="absolute bottom-3 right-3 z-10 text-[9px] tracking-[0.3em] uppercase text-white/50">
              Video unavailable
            </div>
          )}
        </div>
      </section>

      {/* MENU HANDOFF */}
      <section
        className="relative z-20 -mt-10 rounded-t-3xl bg-[#FAF9F6]"
        style={{
          boxShadow: '0 -30px 60px -20px rgba(62, 54, 46, 0.25), 0 -2px 0 0 rgba(197, 168, 128, 0.15)',
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
