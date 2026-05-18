'use client';

import { useEffect, useRef, useState } from 'react';

export default function CursorTracker() {
  const cursorRef = useRef<HTMLDivElement>(null);
  const followerRef = useRef<HTMLDivElement>(null);
  const [isPointer, setIsPointer] = useState(false);

  useEffect(() => {
    setIsPointer(window.matchMedia('(pointer: fine)').matches);
  }, []);

  useEffect(() => {
    if (!isPointer) return;
    let mouseX = 0, mouseY = 0, followerX = 0, followerY = 0;
    let rafId: number;

    const onMove = (e: MouseEvent) => {
      mouseX = e.clientX;
      mouseY = e.clientY;
      if (cursorRef.current) {
        cursorRef.current.style.left = mouseX + 'px';
        cursorRef.current.style.top = mouseY + 'px';
      }
    };

    const animate = () => {
      followerX += (mouseX - followerX) * 0.12;
      followerY += (mouseY - followerY) * 0.12;
      if (followerRef.current) {
        followerRef.current.style.left = followerX + 'px';
        followerRef.current.style.top = followerY + 'px';
      }
      rafId = requestAnimationFrame(animate);
    };

    document.addEventListener('mousemove', onMove);
    rafId = requestAnimationFrame(animate);
    return () => {
      document.removeEventListener('mousemove', onMove);
      cancelAnimationFrame(rafId);
    };
  }, [isPointer]);

  if (!isPointer) return null;

  return (
    <>
      <div className="cursor" ref={cursorRef} />
      <div className="cursor-follower" ref={followerRef} />
    </>
  );
}
