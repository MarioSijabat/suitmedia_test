'use client';
import { useEffect, useRef, useState } from 'react';
import Image from 'next/image';

export default function Banner({ imageUrl, title, subtitle }) {
  const bannerRef = useRef(null);
  const [scrollY, setScrollY] = useState(0);

  useEffect(() => {
    const handleScroll = () => {
      if (bannerRef.current) {
        const { top } = bannerRef.current.getBoundingClientRect();
        setScrollY(Math.max(0, -top * 0.3));
      }
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);
  return (
    <div
      ref={bannerRef}
      className="relative h-[70vh] min-h-[500px] w-full overflow-hidden"
    >
      <div
        className="absolute inset-0 w-full h-full"
        style={{
          transform: `translateY(${scrollY}px)`,
          transition: 'transform 0.1s ease-out'
        }}
      >
        <Image
          src={imageUrl || '/images/banner.jpg'}
          alt="Banner"
          fill
          className="object-cover"
          priority
          quality={100}
        />
        <div className="absolute inset-0 bg-gray-900 opacity-70 z-10" />
      </div>
      <div className="absolute bottom-0 left-0 w-full h-32 z-20 bg-white [clip-path:polygon(0%_100%,100%_5%,100%_100%)]" />
      <div
        className="relative z-30 h-full flex flex-col justify-center items-center text-center px-4"
        style={{
          transform: `translateY(${scrollY * 0.5}px)`,
          transition: 'transform 0.1s ease-out'
        }}
      >
        <div className="max-w-4xl mx-auto">
          <h1 className="text-4xl md:text-6xl font-bold text-white mb-4">
            {title || 'Default Title'}
          </h1>
          <p className="text-xl md:text-2xl text-white opacity-90">
            {subtitle || 'Default subtitle text goes here'}
          </p>
        </div>
      </div>
    </div>
  );
}
