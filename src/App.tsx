import { useEffect, useRef, useState } from 'react';
import { motion, useScroll, useTransform } from 'motion/react';
import { Maximize, Minimize } from 'lucide-react';

export default function App() {
  const containerRef = useRef<HTMLDivElement>(null);
  const videoWrapperRef = useRef<HTMLDivElement>(null);
  const [isFullscreen, setIsFullscreen] = useState(false);

  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end end"]
  });

  // Much shorter, punchier animations
  const videoScale = useTransform(scrollYProgress, [0, 1], [0.9, 1]);
  const videoY = useTransform(scrollYProgress, [0, 1], [40, 0]);
  
  const textOpacity = useTransform(scrollYProgress, [0, 0.6], [1, 0]);
  const textY = useTransform(scrollYProgress, [0, 0.8], [0, -40]);
  const textScale = useTransform(scrollYProgress, [0, 0.6], [1, 0.97]);

  const toggleFullscreen = () => {
    if (!document.fullscreenElement) {
      videoWrapperRef.current?.requestFullscreen().catch(err => {
        console.error(`Error attempting to enable fullscreen: ${err.message}`);
      });
    } else {
      document.exitFullscreen();
    }
  };

  useEffect(() => {
    const handleFullscreenChange = () => {
      setIsFullscreen(!!document.fullscreenElement);
    };
    document.addEventListener('fullscreenchange', handleFullscreenChange);
    return () => document.removeEventListener('fullscreenchange', handleFullscreenChange);
  }, []);

  return (
    <div className="relative h-[150vh] bg-[#030303] text-white font-sans" ref={containerRef}>
      {/* Ambient Background */}
      <div className="fixed inset-0 ambient-glow pointer-events-none z-0" />
      
      {/* Sticky Container */}
      <div className="sticky top-0 h-screen w-full overflow-hidden flex flex-col items-center justify-center z-10">
        
        {/* Minimalist Title */}
        <motion.div 
          style={{ opacity: textOpacity, y: textY, scale: textScale }}
          className="absolute top-[20%] md:top-[25%] left-1/2 -translate-x-1/2 text-center w-full px-4 z-0"
        >
          <h1 className="text-4xl md:text-6xl lg:text-7xl font-light tracking-[0.15em] uppercase text-white/90">
            nawf's <span className="font-medium text-white">showreel</span>
          </h1>
        </motion.div>

        {/* Premium Video Container */}
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none z-10">
          <motion.div 
            className="w-full max-w-5xl px-4 md:px-8 pointer-events-auto mt-24 md:mt-32"
            style={{ 
              scale: videoScale, 
              y: videoY
            }}
          >
            <div 
              ref={videoWrapperRef}
              className={`relative group overflow-hidden transition-all duration-700 ease-out ${
                isFullscreen 
                  ? 'border-none rounded-none w-screen h-screen' 
                  : 'rounded-2xl glass-panel'
              }`}
            >
              {/* Custom Fullscreen Toggle Button */}
              <button 
                onClick={toggleFullscreen}
                className={`absolute z-30 p-3 glass-panel hover:bg-white/10 rounded-full text-white/70 hover:text-white transition-all duration-300 ${
                  isFullscreen 
                    ? 'top-6 right-6 opacity-100' 
                    : 'bottom-6 right-6 opacity-0 group-hover:opacity-100 translate-y-2 group-hover:translate-y-0'
                }`}
                title="Toggle Fullscreen"
              >
                {isFullscreen ? <Minimize size={18} strokeWidth={1.5} /> : <Maximize size={18} strokeWidth={1.5} />}
              </button>

              {/* Aspect Ratio Container for Video */}
              <div className={`relative w-full ${isFullscreen ? 'h-full' : 'pt-[56.25%]'}`}>
                <iframe
                  className={`absolute top-0 left-0 w-full h-full ${isFullscreen ? 'object-contain' : ''}`}
                  src="https://www.youtube.com/embed/gIJ-OCGRdhg?autoplay=0&controls=1&rel=0&modestbranding=1"
                  title="YouTube video player"
                  frameBorder="0"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                  allowFullScreen
                ></iframe>
              </div>
            </div>
          </motion.div>
        </div>
        
        {/* Subtle Scroll Indicator */}
        <motion.div 
          style={{ opacity: textOpacity }}
          className="absolute bottom-10 left-1/2 -translate-x-1/2 flex flex-col items-center gap-3"
        >
          <div className="w-[1px] h-12 bg-gradient-to-b from-white/30 to-transparent" />
        </motion.div>
      </div>
    </div>
  );
}
