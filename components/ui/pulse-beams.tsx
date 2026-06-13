"use client";

import React from "react";
import { cn } from "@/lib/utils";

interface BeamPath {
  path: string;
  gradientConfig: {
    initial: { x1: string; x2: string; y1: string; y2: string };
    animate: { x1: string | string[]; x2: string | string[]; y1: string | string[]; y2: string | string[] };
    transition?: { duration?: number; repeat?: number; repeatType?: string; ease?: unknown; repeatDelay?: number; delay?: number };
  };
  connectionPoints?: Array<{ cx: number; cy: number; r: number }>;
}

interface PulseBeamsProps {
  children?: React.ReactNode;
  className?: string;
  background?: React.ReactNode;
  beams: BeamPath[];
  width?: number;
  height?: number;
  baseColor?: string;
  accentColor?: string;
  gradientColors?: { start: string; middle: string; end: string };
}

export const PulseBeams = ({
  children,
  className,
  background,
  beams,
  width = 858,
  height = 434,
  baseColor = "var(--slate-800)",
  accentColor = "var(--slate-600)",
  gradientColors = { start: "#18CCFC", middle: "#6344F5", end: "#AE48FF" },
}: PulseBeamsProps) => {
  return (
    <div className={cn("w-full h-screen relative flex items-center justify-center antialiased overflow-hidden", className)}>
      {background}
      <div className="relative z-10">{children}</div>
      <div className="absolute inset-0 flex items-center justify-center">
        <svg width={width} height={height} viewBox={`0 0 ${width} ${height}`} fill="none" xmlns="http://www.w3.org/2000/svg" className="flex flex-shrink-0">
          {beams.map((beam, index) => (
            <React.Fragment key={index}>
              <path d={beam.path} stroke={baseColor} strokeWidth="1" />
              <path d={beam.path} stroke={`url(#grad${index})`} strokeWidth="2" strokeLinecap="round" />
              {beam.connectionPoints?.map((point, pi) => (
                <circle key={`${index}-${pi}`} cx={point.cx} cy={point.cy} r={point.r} fill={baseColor} stroke={accentColor} />
              ))}
            </React.Fragment>
          ))}
          <defs>
            {beams.map((_, index) => (
              <linearGradient key={index} id={`grad${index}`} gradientUnits="userSpaceOnUse">
                <stop offset="0%" stopColor={gradientColors.start} stopOpacity="0" />
                <stop offset="20%" stopColor={gradientColors.start} stopOpacity="1" />
                <stop offset="50%" stopColor={gradientColors.middle} stopOpacity="1" />
                <stop offset="100%" stopColor={gradientColors.end} stopOpacity="0" />
              </linearGradient>
            ))}
          </defs>
        </svg>
      </div>
    </div>
  );
};
