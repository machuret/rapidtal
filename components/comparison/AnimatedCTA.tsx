'use client';

import { motion } from 'framer-motion';
import styles from './AnimatedCTA.module.css';

interface AnimatedCTAProps {
  variant?: 'primary' | 'secondary' | 'inline';
}

export default function AnimatedCTA({ variant = 'primary' }: AnimatedCTAProps) {
  return (
    <div className={`${styles.animatedCta} ${styles[variant]}`}>
      <motion.div className={styles.beamContainer}>
        {/* Animated beam lines */}
        <svg className={styles.beamSvg} viewBox="0 0 400 200" fill="none">
          <defs>
            <motion.linearGradient
              id="beam1"
              gradientUnits="userSpaceOnUse"
              initial={{ x1: "0%", x2: "0%", y1: "0%", y2: "100%" }}
              animate={{ 
                x1: ["0%", "100%", "100%"],
                x2: ["0%", "90%", "90%"],
                y1: ["0%", "0%", "100%"],
                y2: ["100%", "100%", "200%"]
              }}
              transition={{
                duration: 3,
                repeat: Infinity,
                repeatType: "loop" as const,
                ease: "linear",
                repeatDelay: 1
              }}
            >
              <stop offset="0%" stopColor="#FF5500" stopOpacity="0" />
              <stop offset="50%" stopColor="#FF5500" stopOpacity="1" />
              <stop offset="100%" stopColor="#FF8833" stopOpacity="0" />
            </motion.linearGradient>
            
            <motion.linearGradient
              id="beam2"
              gradientUnits="userSpaceOnUse"
              initial={{ x1: "100%", x2: "100%", y1: "0%", y2: "100%" }}
              animate={{ 
                x1: ["100%", "0%", "0%"],
                x2: ["100%", "10%", "10%"],
                y1: ["0%", "0%", "100%"],
                y2: ["100%", "100%", "200%"]
              }}
              transition={{
                duration: 3,
                repeat: Infinity,
                repeatType: "loop" as const,
                ease: "linear",
                repeatDelay: 1,
                delay: 1.5
              }}
            >
              <stop offset="0%" stopColor="#FF5500" stopOpacity="0" />
              <stop offset="50%" stopColor="#FF5500" stopOpacity="1" />
              <stop offset="100%" stopColor="#FF8833" stopOpacity="0" />
            </motion.linearGradient>
          </defs>
          
          {/* Beam paths */}
          <path
            d="M50 20 L50 100 L150 100"
            stroke="url(#beam1)"
            strokeWidth="2"
            strokeLinecap="round"
            fill="none"
          />
          <path
            d="M350 20 L350 100 L250 100"
            stroke="url(#beam2)"
            strokeWidth="2"
            strokeLinecap="round"
            fill="none"
          />
        </svg>
      </motion.div>

      <a href="/quiz" className={styles.ctaButton}>
        <span className={styles.buttonGlow}></span>
        <span className={styles.buttonContent}>
          Book a Call
        </span>
      </a>
      <span className={styles.ctaSubtitle}>Start saving $ for your business</span>
    </div>
  );
}
