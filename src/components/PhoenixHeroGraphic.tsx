import React, { useEffect, useRef } from 'react';

export const PhoenixHeroGraphic: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animationFrameId: number;
    let width = (canvas.width = canvas.parentElement?.clientWidth || window.innerWidth);
    let height = (canvas.height = canvas.parentElement?.clientHeight || window.innerHeight);

    const handleResize = () => {
      if (!canvas) return;
      width = canvas.width = canvas.parentElement?.clientWidth || window.innerWidth;
      height = canvas.height = canvas.parentElement?.clientHeight || window.innerHeight;
    };

    window.addEventListener('resize', handleResize);

    // Phoenix Ember Particles
    interface Particle {
      x: number;
      y: number;
      size: number;
      speedX: number;
      speedY: number;
      color: string;
      alpha: number;
      decay: number;
    }

    const particles: Particle[] = [];
    const colors = ['#FF6A00', '#E51B23', '#FFC21A', '#E0008A', '#6A00FF'];

    const createParticle = (): Particle => {
      // Concentrate particles from around center (Phoenix core)
      const centerX = width / 2;
      const centerY = height * 0.48;
      const spreadX = (Math.random() - 0.5) * (width * 0.45);
      const spreadY = (Math.random() - 0.5) * (height * 0.35);

      return {
        x: centerX + spreadX,
        y: centerY + spreadY,
        size: Math.random() * 2.8 + 0.8,
        speedX: (Math.random() - 0.5) * 1.2,
        speedY: -(Math.random() * 1.8 + 0.6), // float upwards
        color: colors[Math.floor(Math.random() * colors.length)],
        alpha: Math.random() * 0.8 + 0.2,
        decay: Math.random() * 0.007 + 0.003,
      };
    };

    // Initialize 65 ember particles
    for (let i = 0; i < 65; i++) {
      particles.push(createParticle());
    }

    const animate = () => {
      ctx.clearRect(0, 0, width, height);

      // Render & update embers
      particles.forEach((p, index) => {
        p.x += p.speedX + Math.sin(Date.now() * 0.001 + index) * 0.3;
        p.y += p.speedY;
        p.alpha -= p.decay;

        if (p.alpha <= 0 || p.y < 0) {
          particles[index] = createParticle();
          return;
        }

        ctx.save();
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
        ctx.fillStyle = p.color;
        ctx.globalAlpha = p.alpha;
        ctx.shadowColor = p.color;
        ctx.shadowBlur = 10;
        ctx.fill();
        ctx.restore();
      });

      animationFrameId = requestAnimationFrame(animate);
    };

    animate();

    return () => {
      window.removeEventListener('resize', handleResize);
      cancelAnimationFrame(animationFrameId);
    };
  }, []);

  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none select-none flex items-center justify-center">
      {/* Background radial warmth glow */}
      <div 
        className="absolute w-[650px] h-[650px] rounded-full blur-[110px] opacity-25"
        style={{
          background: 'radial-gradient(circle, rgba(255,106,0,0.45) 0%, rgba(229,27,35,0.3) 35%, rgba(224,0,138,0.2) 65%, rgba(106,0,255,0) 100%)'
        }}
      />

      {/* SVG Cinematic Phoenix Emblem Graphic (Centered, stays in position, flaps/glows subtly) */}
      <div className="relative w-full max-w-[720px] h-[480px] md:h-[560px] flex items-center justify-center transform -translate-y-4">
        {/* Soft atmospheric fire glow ring */}
        <div className="absolute w-[440px] h-[440px] rounded-full bg-gradient-to-tr from-phoenix-orange/20 via-phoenix-red/15 to-phoenix-purple/10 blur-3xl animate-pulse-slow" />

        {/* Cinematic Phoenix Artwork SVG */}
        <svg
          viewBox="0 0 800 650"
          className="w-full h-full object-contain filter drop-shadow-[0_15px_35px_rgba(255,106,0,0.3)] transition-transform duration-700"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <defs>
            <linearGradient id="phoenixBodyGrad" x1="400" y1="120" x2="400" y2="520" gradientUnits="userSpaceOnUse">
              <stop offset="0%" stopColor="#FFC21A" />
              <stop offset="25%" stopColor="#FF6A00" />
              <stop offset="60%" stopColor="#E51B23" />
              <stop offset="85%" stopColor="#E0008A" />
              <stop offset="100%" stopColor="#6A00FF" />
            </linearGradient>

            <linearGradient id="wingLeftGrad" x1="120" y1="180" x2="380" y2="420" gradientUnits="userSpaceOnUse">
              <stop offset="0%" stopColor="#6A00FF" />
              <stop offset="25%" stopColor="#E0008A" />
              <stop offset="55%" stopColor="#E51B23" />
              <stop offset="85%" stopColor="#FF6A00" />
              <stop offset="100%" stopColor="#FFC21A" />
            </linearGradient>

            <linearGradient id="wingRightGrad" x1="680" y1="180" x2="420" y2="420" gradientUnits="userSpaceOnUse">
              <stop offset="0%" stopColor="#6A00FF" />
              <stop offset="25%" stopColor="#E0008A" />
              <stop offset="55%" stopColor="#E51B23" />
              <stop offset="85%" stopColor="#FF6A00" />
              <stop offset="100%" stopColor="#FFC21A" />
            </linearGradient>

            <linearGradient id="tailGrad" x1="400" y1="420" x2="400" y2="640" gradientUnits="userSpaceOnUse">
              <stop offset="0%" stopColor="#E51B23" />
              <stop offset="35%" stopColor="#E0008A" />
              <stop offset="70%" stopColor="#6A00FF" />
              <stop offset="100%" stopColor="#3A087A" />
            </linearGradient>

            <filter id="phoenixGlow" x="-20%" y="-20%" width="140%" height="140%">
              <feGaussianBlur stdDeviation="8" result="blur" />
              <feComposite in="SourceGraphic" in2="blur" operator="over" />
            </filter>
          </defs>

          {/* Phoenix Tails / Lower Plumes */}
          <g className="animate-float" style={{ animationDuration: '7s' }}>
            <path
              d="M400 450 C380 500 320 560 300 630 C325 585 365 540 390 490 Z"
              fill="url(#tailGrad)"
              opacity="0.85"
            />
            <path
              d="M400 450 C420 500 480 560 500 630 C475 585 435 540 410 490 Z"
              fill="url(#tailGrad)"
              opacity="0.85"
            />
            <path
              d="M400 460 C390 520 370 580 360 645 C385 600 400 550 405 480 Z"
              fill="url(#phoenixBodyGrad)"
              opacity="0.9"
            />
            <path
              d="M400 460 C410 520 430 580 440 645 C415 600 400 550 395 480 Z"
              fill="url(#phoenixBodyGrad)"
              opacity="0.9"
            />
            <path
              d="M400 470 C398 540 395 610 398 660 C402 610 402 540 400 470 Z"
              fill="#FF6A00"
              opacity="0.95"
            />
          </g>

          {/* Left Wing Main Feather Arcs */}
          <g className="animate-float" style={{ animationDuration: '6s', transformOrigin: '380px 320px' }}>
            {/* Primary Outer Left Feathers */}
            <path
              d="M370 310 C300 240 180 170 80 180 C130 220 220 280 340 340 Z"
              fill="url(#wingLeftGrad)"
              filter="url(#phoenixGlow)"
              opacity="0.95"
            />
            <path
              d="M360 330 C290 270 170 230 110 240 C170 275 250 325 330 365 Z"
              fill="url(#wingLeftGrad)"
              opacity="0.9"
            />
            <path
              d="M350 350 C280 310 180 290 140 310 C195 335 260 370 320 390 Z"
              fill="url(#wingLeftGrad)"
              opacity="0.85"
            />
            <path
              d="M340 370 C280 350 200 350 170 380 C220 390 270 410 310 415 Z"
              fill="url(#tailGrad)"
              opacity="0.8"
            />
            {/* Crest flame upward curls */}
            <path
              d="M375 290 C320 210 240 140 170 120 C220 160 290 230 360 295 Z"
              fill="url(#wingLeftGrad)"
              opacity="0.92"
            />
          </g>

          {/* Right Wing Main Feather Arcs */}
          <g className="animate-float" style={{ animationDuration: '6s', transformOrigin: '420px 320px' }}>
            {/* Primary Outer Right Feathers */}
            <path
              d="M430 310 C500 240 620 170 720 180 C670 220 580 280 460 340 Z"
              fill="url(#wingRightGrad)"
              filter="url(#phoenixGlow)"
              opacity="0.95"
            />
            <path
              d="M440 330 C510 270 630 230 690 240 C630 275 550 325 470 365 Z"
              fill="url(#wingRightGrad)"
              opacity="0.9"
            />
            <path
              d="M450 350 C520 310 620 290 660 310 C605 335 540 370 480 390 Z"
              fill="url(#wingRightGrad)"
              opacity="0.85"
            />
            <path
              d="M460 370 C520 350 600 350 630 380 C580 390 530 410 490 415 Z"
              fill="url(#tailGrad)"
              opacity="0.8"
            />
            {/* Crest flame upward curls */}
            <path
              d="M425 290 C480 210 560 140 630 120 C580 160 510 230 440 295 Z"
              fill="url(#wingRightGrad)"
              opacity="0.92"
            />
          </g>

          {/* Phoenix Central Chest & Torso */}
          <path
            d="M400 250 C370 310 365 410 400 465 C435 410 430 310 400 250 Z"
            fill="url(#phoenixBodyGrad)"
            filter="url(#phoenixGlow)"
          />

          {/* Phoenix Golden Heart Flare */}
          <ellipse cx="400" cy="340" rx="18" ry="32" fill="#FFC21A" opacity="0.9" />
          <ellipse cx="400" cy="340" rx="8" ry="18" fill="#FFFFFF" opacity="0.8" />

          {/* Phoenix Head and Crown Flame */}
          <path
            d="M400 170 C388 200 385 240 400 255 C415 240 412 200 400 170 Z"
            fill="#FF6A00"
          />
          {/* Head Plume Flames */}
          <path
            d="M400 170 C395 140 380 110 365 95 C385 120 395 145 400 170 Z"
            fill="#FFC21A"
          />
          <path
            d="M400 170 C405 140 420 110 435 95 C415 120 405 145 400 170 Z"
            fill="#FFC21A"
          />
          <path
            d="M400 160 C398 125 397 90 400 70 C403 90 402 125 400 160 Z"
            fill="#FFFFFF"
            opacity="0.95"
          />
          {/* Beak / Crown Point */}
          <polygon points="400,215 394,228 406,228" fill="#FFC21A" />
        </svg>
      </div>

      {/* Floating Canvas Particles */}
      <canvas ref={canvasRef} className="ember-canvas" />
    </div>
  );
};
