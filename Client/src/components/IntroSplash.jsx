import { useEffect, useRef, useState } from 'react'
import gsap from 'gsap'

const taglines = [
  { main: 'Detect.' },
  { main: 'Resolve.' },
  { main: 'CivicLens AI', isBrand: true },
]

export default function IntroSplash({ onComplete }) {
  const containerRef = useRef(null)
  const mainTextRef = useRef(null)
  const [currentIndex, setCurrentIndex] = useState(0)
  const [visible, setVisible] = useState(true)
  const timelineRef = useRef(null)

  const finishIntro = () => {
    sessionStorage.setItem('civiclens_intro_seen', 'true')
    setVisible(false)
    if (onComplete) onComplete()
  }

  const handleSkip = () => {
    if (timelineRef.current) timelineRef.current.kill()
    if (containerRef.current) {
      gsap.to(containerRef.current, {
        opacity: 0,
        filter: 'blur(10px)',
        duration: 0.35,
        onComplete: finishIntro
      })
    } else {
      finishIntro()
    }
  }

  useEffect(() => {
    if (sessionStorage.getItem('civiclens_intro_seen')) {
      finishIntro()
      return
    }

    const ctx = gsap.context(() => {
      const tl = gsap.timeline({
        onComplete: finishIntro
      })
      timelineRef.current = tl

      taglines.forEach((_, idx) => {
        const isLast = idx === taglines.length - 1

        tl.call(() => setCurrentIndex(idx))

          // Soft Blur Entrance
          .fromTo(
            mainTextRef.current,
            { opacity: 0, y: 20, filter: 'blur(14px)', scale: 0.96 },
            { opacity: 1, y: 0, filter: 'blur(0px)', scale: 1, duration: 0.45, ease: 'power3.out' }
          )

          // Reading Hold Time
          .to(mainTextRef.current, {
            duration: isLast ? 0.75 : 0.75
          })

        // Soft Blur Out for Non-Last Words
        if (!isLast) {
          tl.to(mainTextRef.current, {
            opacity: 0,
            y: -18,
            filter: 'blur(12px)',
            scale: 1.03,
            duration: 0.38,
            ease: 'power2.inOut'
          })
        }
      })

      // Master Exit
      tl.to(containerRef.current, {
        opacity: 0,
        filter: 'blur(12px)',
        scale: 0.98,
        duration: 0.65,
        ease: 'power3.inOut'
      }, '+=0.1')
    })

    return () => ctx.revert()
  }, [])

  if (!visible) return null

  const currentItem = taglines[currentIndex]

  return (
    <div
      ref={containerRef}
      onClick={handleSkip}
      className="fixed inset-0 z-[100] bg-[#060709] text-white flex flex-col items-center justify-center p-6 select-none cursor-pointer overflow-hidden font-['Outfit',sans-serif]"
    >
      {/* Ambient Soft Glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-gradient-to-tr from-white/10 via-blue-600/15 to-indigo-600/10 rounded-full blur-[130px] pointer-events-none" />

      {/* Skip Button */}
      <button
        onClick={handleSkip}
        className="absolute top-6 right-6 text-xs font-mono tracking-widest text-neutral-400 hover:text-white px-3.5 py-1.5 rounded-full bg-white/5 border border-white/10 backdrop-blur-md transition-colors cursor-pointer z-20"
      >
        SKIP ↵
      </button>

      <div className="relative flex flex-col items-center text-center max-w-3xl z-10">
        {currentItem.isBrand ? (
          <h1
            ref={mainTextRef}
            className="text-3xl sm:text-5xl md:text-6xl font-['Outfit',sans-serif] font-extrabold tracking-tight text-white opacity-0 drop-shadow-xl"
          >
            CivicLens <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 via-indigo-300 to-violet-400 drop-shadow-[0_0_30px_rgba(96,165,250,0.8)]">AI</span>
          </h1>
        ) : (
          <h1
            ref={mainTextRef}
            className="text-3xl sm:text-5xl md:text-6xl font-['Outfit',sans-serif] font-extrabold tracking-tight text-white opacity-0 drop-shadow-[0_0_35px_rgba(255,255,255,0.7)]"
          >
            {currentItem.main}
          </h1>
        )}
      </div>
    </div>
  )
}
