import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Activity } from 'lucide-react';

const Preloader = () => {
  const [isVisible, setIsVisible] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsVisible(false);
    }, 2500); // Increased slightly to enjoy the animation
    return () => clearTimeout(timer);
  }, []);

  // ECG Heartbeat line path
  const ecgPath = "M0 50 L20 50 L25 40 L30 60 L35 10 L40 90 L45 50 L60 50 L65 45 L70 55 L75 50 L100 50";

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          initial={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.8, ease: "easeInOut" }}
          className="fixed inset-0 z-[9999] flex flex-col items-center justify-center bg-[#0E3F6D] overflow-hidden"
        >
          {/* subtle background pattern */}
          <div className="absolute inset-0 opacity-[0.03] pointer-events-none"
            style={{ backgroundImage: 'radial-gradient(circle, #ffffff 1px, transparent 1px)', backgroundSize: '30px 30px' }}>
          </div>

          <div className="relative flex flex-col items-center">
            {/* Pulsing Heartbeat Icon */}
            <motion.div
              animate={{
                scale: [1, 1.2, 1],
                opacity: [0.7, 1, 0.7]
              }}
              transition={{
                duration: 0.8,
                repeat: Infinity,
                ease: "easeInOut"
              }}
              className="mb-6 text-[#72BF44]"
            >
              <Activity size={48} />
            </motion.div>

            {/* Pulsing Text */}
            <motion.div
              initial={{ y: 20, opacity: 0 }}
              animate={{
                y: 0,
                opacity: 1,
                scale: [1, 1.02, 1]
              }}
              transition={{
                opacity: { duration: 0.5 },
                scale: { duration: 0.8, repeat: Infinity, ease: "easeInOut" }
              }}
              className="text-center"
            >
              <h1 className="text-4xl md:text-6xl font-bold text-white tracking-[0.2em] uppercase">
                MedicwayCare
              </h1>
              <p className="text-[#72BF44] text-xs font-semibold tracking-[0.5em] mt-2 opacity-80 uppercase">
                Compassion In Every Beat
              </p>
            </motion.div>

            {/* Animated ECG Line */}
            <div className="mt-12 w-64 h-20 overflow-hidden relative">
              <svg
                viewBox="0 0 100 100"
                preserveAspectRatio="none"
                className="w-full h-full stroke-[#72BF44] stroke-[2] fill-none opacity-40"
              >
                <motion.path
                  d={ecgPath}
                  initial={{ pathLength: 0, x: -100 }}
                  animate={{
                    pathLength: [0, 1, 1],
                    x: ["-100%", "0%", "100%"]
                  }}
                  transition={{
                    duration: 2,
                    repeat: Infinity,
                    ease: "linear"
                  }}
                />
              </svg>
            </div>
          </div>

          {/* Scanner Light Effect */}
          <motion.div
            animate={{ y: ['-100%', '100%'], opacity: [0, 0.1, 0] }}
            transition={{ duration: 3, repeat: Infinity, ease: 'linear' }}
            className="absolute inset-0 bg-gradient-to-b from-transparent via-[#72BF44] to-transparent h-1/2 w-full"
          />
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default Preloader;