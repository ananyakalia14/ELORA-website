import React, { useEffect, useRef } from 'react';

/**
 * Luxury Champagne & Rose Gold Glitter, Shimmer & Confetti Component
 * 
 * Features:
 * - 3D tumbling foil ribbons (champagne gold, rose gold, bronze)
 * - Twinkling 4-point star shimmers with luminous pulsing
 * - Polished metallic circular sequins
 * - Floating micro-glitter ambient dust
 * - Natural physics (air resistance, gravity, flutter wobble)
 */
export default function GlitterConfetti({
  active = true,
  particleCount = 130,
  continuous = true,
  className = '',
}) {
  const canvasRef = useRef(null);

  useEffect(() => {
    if (!active) return;
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animationFrameId;
    let width = (canvas.width = window.innerWidth);
    let height = (canvas.height = window.innerHeight);

    const handleResize = () => {
      if (!canvas) return;
      width = canvas.width = window.innerWidth;
      height = canvas.height = window.innerHeight;
    };
    window.addEventListener('resize', handleResize);

    // Luxury palette
    const colors = [
      { fill: '#D4AF37', shine: '#FFF3B0', shadow: '#96781E' }, // Classic 24k Gold
      { fill: '#E6CA65', shine: '#FFFFFF', shadow: '#B59632' }, // Champagne Bright
      { fill: '#AC7E76', shine: '#F0D4CD', shadow: '#7A4D46' }, // Élora Terracotta Rose
      { fill: '#C57E45', shine: '#F7D0A6', shadow: '#8B4E1B' }, // Warm Amber Gold
      { fill: '#E8C39E', shine: '#FFFFFF', shadow: '#B08862' }, // Soft Peach Silk
      { fill: '#FAF2EB', shine: '#FFFFFF', shadow: '#D6C4B8' }, // Pearlescent White
    ];

    class Particle {
      constructor(isInitialBurst = true) {
        this.reset(isInitialBurst);
      }

      reset(isInitialBurst = false) {
        // Types: 'ribbon' (tumbling foil), 'star' (sparkle), 'sequin' (circle), 'dust' (micro glitter)
        const typeRoll = Math.random();
        if (typeRoll < 0.45) this.type = 'ribbon';
        else if (typeRoll < 0.72) this.type = 'star';
        else if (typeRoll < 0.88) this.type = 'sequin';
        else this.type = 'dust';

        this.color = colors[Math.floor(Math.random() * colors.length)];

        if (isInitialBurst) {
          // Launch from bottom center-left and center-right in a celebratory fountain
          this.x = width * (0.2 + Math.random() * 0.6);
          this.y = height * (0.4 + Math.random() * 0.4);
          const angle = -Math.PI / 2 + (Math.random() - 0.5) * 1.5;
          const speed = 7 + Math.random() * 14;
          this.vx = Math.cos(angle) * speed;
          this.vy = Math.sin(angle) * speed;
        } else {
          // Continuous spawn from top
          this.x = Math.random() * width;
          this.y = -20 - Math.random() * 50;
          this.vx = (Math.random() - 0.5) * 3;
          this.vy = 1.5 + Math.random() * 3.5;
        }

        // Dimensions
        if (this.type === 'ribbon') {
          this.sizeW = 8 + Math.random() * 12;
          this.sizeH = 12 + Math.random() * 16;
        } else if (this.type === 'star') {
          this.size = 6 + Math.random() * 10;
        } else if (this.type === 'sequin') {
          this.radius = 3.5 + Math.random() * 5;
        } else {
          this.radius = 1.2 + Math.random() * 2;
        }

        // Rotations and 3D tumble
        this.rotation = Math.random() * Math.PI * 2;
        this.rotSpeed = (Math.random() - 0.5) * 0.12;
        this.tumbleAngle = Math.random() * Math.PI * 2;
        this.tumbleSpeed = 0.04 + Math.random() * 0.08;

        // Gravity & Air Resistance
        this.gravity = 0.12 + Math.random() * 0.14;
        this.drag = 0.985;
        this.wobble = Math.random() * 10;
        this.wobbleSpeed = 0.03 + Math.random() * 0.05;

        // Sparkle shimmer effect
        this.sparklePhase = Math.random() * Math.PI * 2;
        this.sparkleSpeed = 0.05 + Math.random() * 0.1;
        this.alpha = 1;
        this.decay = 0;
      }

      update() {
        this.wobble += this.wobbleSpeed;
        this.tumbleAngle += this.tumbleSpeed;
        this.rotation += this.rotSpeed;
        this.sparklePhase += this.sparkleSpeed;

        this.vx *= this.drag;
        this.vy += this.gravity;
        this.vy *= this.drag;

        // Gentle horizontal breeze oscillation
        this.x += this.vx + Math.sin(this.wobble) * 1.2;
        this.y += this.vy;

        // Reset if off bottom
        if (this.y > height + 40) {
          if (continuous) {
            this.reset(false);
          } else {
            this.alpha = 0;
          }
        }
      }

      draw(c) {
        if (this.alpha <= 0) return;

        c.save();
        c.translate(this.x, this.y);
        c.rotate(this.rotation);

        // Specular shimmer intensity
        const shimmer = Math.sin(this.sparklePhase);
        const currentFill = shimmer > 0.65 ? this.color.shine : this.color.fill;

        if (this.type === 'ribbon') {
          // 3D tumbling illusion with vertical compression
          const cosScale = Math.cos(this.tumbleAngle);
          c.scale(1, cosScale);

          // Front vs Back color
          c.fillStyle = cosScale > 0 ? currentFill : this.color.shadow;
          c.shadowColor = 'rgba(212, 175, 55, 0.4)';
          c.shadowBlur = 4;
          c.fillRect(-this.sizeW / 2, -this.sizeH / 2, this.sizeW, this.sizeH);

          // Metallic bevel highlight
          c.fillStyle = 'rgba(255, 255, 255, 0.35)';
          c.fillRect(-this.sizeW / 2, -this.sizeH / 2, this.sizeW, 2);
        } else if (this.type === 'star') {
          // 4-pointed shimmering starburst
          const starScale = 0.75 + Math.sin(this.sparklePhase) * 0.35;
          c.scale(starScale, starScale);
          c.fillStyle = currentFill;
          c.shadowColor = this.color.shine;
          c.shadowBlur = 8;

          c.beginPath();
          const r = this.size;
          const innerR = r * 0.28;
          for (let i = 0; i < 8; i++) {
            const angle = (i * Math.PI) / 4;
            const radius = i % 2 === 0 ? r : innerR;
            const sx = Math.cos(angle) * radius;
            const sy = Math.sin(angle) * radius;
            if (i === 0) c.moveTo(sx, sy);
            else c.lineTo(sx, sy);
          }
          c.closePath();
          c.fill();
        } else if (this.type === 'sequin') {
          // Shiny gold coin / sequin with 3D flip
          const cosScale = Math.cos(this.tumbleAngle);
          c.scale(cosScale, 1);
          c.fillStyle = cosScale > 0 ? currentFill : this.color.shadow;
          c.beginPath();
          c.arc(0, 0, this.radius, 0, Math.PI * 2);
          c.fill();

          // Small specular center glint
          if (shimmer > 0.4) {
            c.fillStyle = '#FFFFFF';
            c.beginPath();
            c.arc(-this.radius * 0.25, -this.radius * 0.25, this.radius * 0.35, 0, Math.PI * 2);
            c.fill();
          }
        } else {
          // Micro dust sparkle
          const dustGlow = 0.5 + Math.sin(this.sparklePhase) * 0.5;
          c.fillStyle = `rgba(255, 245, 215, ${dustGlow})`;
          c.shadowColor = '#FFE7A0';
          c.shadowBlur = 6;
          c.beginPath();
          c.arc(0, 0, this.radius, 0, Math.PI * 2);
          c.fill();
        }

        c.restore();
      }
    }

    // Initialize particles
    const particles = [];
    for (let i = 0; i < particleCount; i++) {
      particles.push(new Particle(true));
    }

    const render = () => {
      ctx.clearRect(0, 0, width, height);

      for (let i = 0; i < particles.length; i++) {
        const p = particles[i];
        p.update();
        p.draw(ctx);
      }

      animationFrameId = requestAnimationFrame(render);
    };

    render();

    return () => {
      cancelAnimationFrame(animationFrameId);
      window.removeEventListener('resize', handleResize);
    };
  }, [active, particleCount, continuous]);

  if (!active) return null;

  return (
    <canvas
      ref={canvasRef}
      className={`glitter-confetti-canvas ${className}`}
      style={{
        position: 'fixed',
        inset: 0,
        pointerEvents: 'none',
        zIndex: 4000,
        width: '100vw',
        height: '100vh',
      }}
      aria-hidden="true"
    />
  );
}
