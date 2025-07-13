
import { useEffect, useRef } from 'react';
import { motion } from 'framer-motion';

const Hero3D = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const mouseRef = useRef({ x: 0, y: 0 });
  const animationRef = useRef<number>();

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Set canvas size
    const resizeCanvas = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };
    resizeCanvas();
    window.addEventListener('resize', resizeCanvas);

    // Particle system
    const particles: Array<{
      x: number;
      y: number;
      z: number;
      vx: number;
      vy: number;
      vz: number;
      size: number;
      color: string;
      alpha: number;
    }> = [];

    // Initialize particles
    for (let i = 0; i < 100; i++) {
      particles.push({
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height,
        z: Math.random() * 1000,
        vx: (Math.random() - 0.5) * 2,
        vy: (Math.random() - 0.5) * 2,
        vz: Math.random() * 2 + 1,
        size: Math.random() * 3 + 1,
        color: ['#3b82f6', '#8b5cf6', '#ec4899', '#06b6d4'][Math.floor(Math.random() * 4)],
        alpha: Math.random() * 0.5 + 0.3
      });
    }

    // Mouse tracking
    const handleMouseMove = (event: MouseEvent) => {
      mouseRef.current.x = event.clientX;
      mouseRef.current.y = event.clientY;
    };
    window.addEventListener('mousemove', handleMouseMove);

    // Animation loop
    const animate = () => {
      ctx.fillStyle = 'rgba(15, 23, 42, 0.1)';
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      // Update and draw particles
      particles.forEach((particle, index) => {
        // Move particles
        particle.x += particle.vx;
        particle.y += particle.vy;
        particle.z -= particle.vz;

        // Mouse interaction
        const dx = mouseRef.current.x - particle.x;
        const dy = mouseRef.current.y - particle.y;
        const distance = Math.sqrt(dx * dx + dy * dy);
        
        if (distance < 150) {
          const force = (150 - distance) / 150;
          particle.vx += (dx / distance) * force * 0.1;
          particle.vy += (dy / distance) * force * 0.1;
        }

        // Reset particle if it goes too far
        if (particle.z <= 0 || particle.x < 0 || particle.x > canvas.width || 
            particle.y < 0 || particle.y > canvas.height) {
          particle.x = Math.random() * canvas.width;
          particle.y = Math.random() * canvas.height;
          particle.z = 1000;
          particle.vx = (Math.random() - 0.5) * 2;
          particle.vy = (Math.random() - 0.5) * 2;
        }

        // 3D projection
        const scale = 200 / (200 + particle.z);
        const projectedX = particle.x * scale + canvas.width / 2 * (1 - scale);
        const projectedY = particle.y * scale + canvas.height / 2 * (1 - scale);
        const projectedSize = particle.size * scale;

        // Draw particle
        ctx.globalAlpha = particle.alpha * scale;
        ctx.fillStyle = particle.color;
        ctx.beginPath();
        ctx.arc(projectedX, projectedY, projectedSize, 0, Math.PI * 2);
        ctx.fill();

        // Draw connections
        particles.forEach((otherParticle, otherIndex) => {
          if (index !== otherIndex) {
            const otherScale = 200 / (200 + otherParticle.z);
            const otherX = otherParticle.x * otherScale + canvas.width / 2 * (1 - otherScale);
            const otherY = otherParticle.y * otherScale + canvas.height / 2 * (1 - otherScale);
            
            const connectionDistance = Math.sqrt(
              Math.pow(projectedX - otherX, 2) + Math.pow(projectedY - otherY, 2)
            );
            
            if (connectionDistance < 100) {
              ctx.globalAlpha = (1 - connectionDistance / 100) * 0.2 * scale * otherScale;
              ctx.strokeStyle = particle.color;
              ctx.lineWidth = 1;
              ctx.beginPath();
              ctx.moveTo(projectedX, projectedY);
              ctx.lineTo(otherX, otherY);
              ctx.stroke();
            }
          }
        });
      });

      animationRef.current = requestAnimationFrame(animate);
    };

    animate();

    return () => {
      window.removeEventListener('resize', resizeCanvas);
      window.removeEventListener('mousemove', handleMouseMove);
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    };
  }, []);

  return (
    <div className="absolute inset-0 overflow-hidden">
      <canvas
        ref={canvasRef}
        className="absolute inset-0"
        style={{ background: 'radial-gradient(ellipse at center, rgba(99, 102, 241, 0.1) 0%, transparent 70%)' }}
      />
      
      {/* Floating 3D shapes */}
      <motion.div
        animate={{ 
          rotateX: 360,
          rotateY: 360,
        }}
        transition={{ 
          duration: 20, 
          repeat: Infinity, 
          ease: "linear" 
        }}
        className="absolute top-1/4 left-1/4 w-20 h-20 opacity-20"
        style={{
          background: 'linear-gradient(45deg, #3b82f6, #8b5cf6)',
          clipPath: 'polygon(50% 0%, 0% 100%, 100% 100%)',
          filter: 'blur(1px)'
        }}
      />
      
      <motion.div
        animate={{ 
          rotateY: -360,
          rotateZ: 180,
        }}
        transition={{ 
          duration: 25, 
          repeat: Infinity, 
          ease: "linear" 
        }}
        className="absolute top-3/4 right-1/4 w-16 h-16 opacity-20 rounded-full"
        style={{
          background: 'linear-gradient(135deg, #ec4899, #06b6d4)',
          filter: 'blur(1px)'
        }}
      />
      
      <motion.div
        animate={{ 
          rotateX: -360,
          rotateZ: 360,
        }}
        transition={{ 
          duration: 30, 
          repeat: Infinity, 
          ease: "linear" 
        }}
        className="absolute bottom-1/4 left-1/2 w-12 h-12 opacity-20"
        style={{
          background: 'linear-gradient(225deg, #8b5cf6, #3b82f6)',
          clipPath: 'polygon(25% 0%, 75% 0%, 100% 50%, 75% 100%, 25% 100%, 0% 50%)',
          filter: 'blur(1px)'
        }}
      />
    </div>
  );
};

export default Hero3D;
