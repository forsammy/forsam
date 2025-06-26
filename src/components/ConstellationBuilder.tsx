import React, { useState, useEffect, useRef } from 'react';
import { Star, Sparkles, Eye, EyeOff } from 'lucide-react';

interface ConstellationBuilderProps {
  isCountdownExpired: boolean;
}

interface StarPosition {
  x: number;
  y: number;
  size: number;
  brightness: number;
  twinkleDelay: number;
  isNameStar?: boolean;
}

const STORAGE_KEY = 'july12th-constellation';

// Predefined constellation pattern that spells "SAMRIDDHI"
const SAMRIDDHI_PATTERN: StarPosition[] = [
  // S
  { x: 50, y: 100, size: 8, brightness: 1, twinkleDelay: 0 },
  { x: 50, y: 120, size: 6, brightness: 0.9, twinkleDelay: 0.1 },
  { x: 60, y: 120, size: 6, brightness: 0.9, twinkleDelay: 0.2 },
  { x: 70, y: 120, size: 6, brightness: 0.9, twinkleDelay: 0.3 },
  { x: 70, y: 140, size: 6, brightness: 0.9, twinkleDelay: 0.4 },
  { x: 60, y: 140, size: 6, brightness: 0.9, twinkleDelay: 0.5 },
  { x: 50, y: 140, size: 6, brightness: 0.9, twinkleDelay: 0.6 },
  { x: 50, y: 160, size: 6, brightness: 0.9, twinkleDelay: 0.7 },
  { x: 60, y: 160, size: 6, brightness: 0.9, twinkleDelay: 0.8 },
  { x: 70, y: 160, size: 8, brightness: 1, twinkleDelay: 0.9 },

  // A
  { x: 90, y: 160, size: 8, brightness: 1, twinkleDelay: 1.0 },
  { x: 90, y: 140, size: 6, brightness: 0.9, twinkleDelay: 1.1 },
  { x: 90, y: 120, size: 6, brightness: 0.9, twinkleDelay: 1.2 },
  { x: 100, y: 100, size: 8, brightness: 1, twinkleDelay: 1.3 },
  { x: 110, y: 120, size: 6, brightness: 0.9, twinkleDelay: 1.4 },
  { x: 110, y: 140, size: 6, brightness: 0.9, twinkleDelay: 1.5 },
  { x: 110, y: 160, size: 8, brightness: 1, twinkleDelay: 1.6 },
  { x: 100, y: 140, size: 6, brightness: 0.9, twinkleDelay: 1.7 },

  // M
  { x: 130, y: 160, size: 8, brightness: 1, twinkleDelay: 1.8 },
  { x: 130, y: 140, size: 6, brightness: 0.9, twinkleDelay: 1.9 },
  { x: 130, y: 120, size: 6, brightness: 0.9, twinkleDelay: 2.0 },
  { x: 130, y: 100, size: 8, brightness: 1, twinkleDelay: 2.1 },
  { x: 140, y: 110, size: 6, brightness: 0.9, twinkleDelay: 2.2 },
  { x: 150, y: 120, size: 6, brightness: 0.9, twinkleDelay: 2.3 },
  { x: 160, y: 110, size: 6, brightness: 0.9, twinkleDelay: 2.4 },
  { x: 170, y: 100, size: 8, brightness: 1, twinkleDelay: 2.5 },
  { x: 170, y: 120, size: 6, brightness: 0.9, twinkleDelay: 2.6 },
  { x: 170, y: 140, size: 6, brightness: 0.9, twinkleDelay: 2.7 },
  { x: 170, y: 160, size: 8, brightness: 1, twinkleDelay: 2.8 },

  // R
  { x: 190, y: 160, size: 8, brightness: 1, twinkleDelay: 2.9 },
  { x: 190, y: 140, size: 6, brightness: 0.9, twinkleDelay: 3.0 },
  { x: 190, y: 120, size: 6, brightness: 0.9, twinkleDelay: 3.1 },
  { x: 190, y: 100, size: 8, brightness: 1, twinkleDelay: 3.2 },
  { x: 200, y: 100, size: 6, brightness: 0.9, twinkleDelay: 3.3 },
  { x: 210, y: 100, size: 6, brightness: 0.9, twinkleDelay: 3.4 },
  { x: 210, y: 120, size: 6, brightness: 0.9, twinkleDelay: 3.5 },
  { x: 200, y: 120, size: 6, brightness: 0.9, twinkleDelay: 3.6 },
  { x: 200, y: 140, size: 6, brightness: 0.9, twinkleDelay: 3.7 },
  { x: 210, y: 160, size: 8, brightness: 1, twinkleDelay: 3.8 },

  // I
  { x: 230, y: 100, size: 8, brightness: 1, twinkleDelay: 3.9 },
  { x: 240, y: 100, size: 6, brightness: 0.9, twinkleDelay: 4.0 },
  { x: 250, y: 100, size: 8, brightness: 1, twinkleDelay: 4.1 },
  { x: 240, y: 120, size: 6, brightness: 0.9, twinkleDelay: 4.2 },
  { x: 240, y: 140, size: 6, brightness: 0.9, twinkleDelay: 4.3 },
  { x: 230, y: 160, size: 8, brightness: 1, twinkleDelay: 4.4 },
  { x: 240, y: 160, size: 6, brightness: 0.9, twinkleDelay: 4.5 },
  { x: 250, y: 160, size: 8, brightness: 1, twinkleDelay: 4.6 },

  // D
  { x: 270, y: 160, size: 8, brightness: 1, twinkleDelay: 4.7 },
  { x: 270, y: 140, size: 6, brightness: 0.9, twinkleDelay: 4.8 },
  { x: 270, y: 120, size: 6, brightness: 0.9, twinkleDelay: 4.9 },
  { x: 270, y: 100, size: 8, brightness: 1, twinkleDelay: 5.0 },
  { x: 280, y: 100, size: 6, brightness: 0.9, twinkleDelay: 5.1 },
  { x: 290, y: 110, size: 6, brightness: 0.9, twinkleDelay: 5.2 },
  { x: 290, y: 130, size: 6, brightness: 0.9, twinkleDelay: 5.3 },
  { x: 290, y: 150, size: 6, brightness: 0.9, twinkleDelay: 5.4 },
  { x: 280, y: 160, size: 6, brightness: 0.9, twinkleDelay: 5.5 },

  // D
  { x: 310, y: 160, size: 8, brightness: 1, twinkleDelay: 5.6 },
  { x: 310, y: 140, size: 6, brightness: 0.9, twinkleDelay: 5.7 },
  { x: 310, y: 120, size: 6, brightness: 0.9, twinkleDelay: 5.8 },
  { x: 310, y: 100, size: 8, brightness: 1, twinkleDelay: 5.9 },
  { x: 320, y: 100, size: 6, brightness: 0.9, twinkleDelay: 6.0 },
  { x: 330, y: 110, size: 6, brightness: 0.9, twinkleDelay: 6.1 },
  { x: 330, y: 130, size: 6, brightness: 0.9, twinkleDelay: 6.2 },
  { x: 330, y: 150, size: 6, brightness: 0.9, twinkleDelay: 6.3 },
  { x: 320, y: 160, size: 6, brightness: 0.9, twinkleDelay: 6.4 },

  // H
  { x: 350, y: 100, size: 8, brightness: 1, twinkleDelay: 6.5 },
  { x: 350, y: 120, size: 6, brightness: 0.9, twinkleDelay: 6.6 },
  { x: 350, y: 140, size: 6, brightness: 0.9, twinkleDelay: 6.7 },
  { x: 350, y: 160, size: 8, brightness: 1, twinkleDelay: 6.8 },
  { x: 360, y: 130, size: 6, brightness: 0.9, twinkleDelay: 6.9 },
  { x: 370, y: 130, size: 6, brightness: 0.9, twinkleDelay: 7.0 },
  { x: 380, y: 100, size: 8, brightness: 1, twinkleDelay: 7.1 },
  { x: 380, y: 120, size: 6, brightness: 0.9, twinkleDelay: 7.2 },
  { x: 380, y: 140, size: 6, brightness: 0.9, twinkleDelay: 7.3 },
  { x: 380, y: 160, size: 8, brightness: 1, twinkleDelay: 7.4 },

  // I
  { x: 400, y: 100, size: 8, brightness: 1, twinkleDelay: 7.5 },
  { x: 410, y: 100, size: 6, brightness: 0.9, twinkleDelay: 7.6 },
  { x: 420, y: 100, size: 8, brightness: 1, twinkleDelay: 7.7 },
  { x: 410, y: 120, size: 6, brightness: 0.9, twinkleDelay: 7.8 },
  { x: 410, y: 140, size: 6, brightness: 0.9, twinkleDelay: 7.9 },
  { x: 400, y: 160, size: 8, brightness: 1, twinkleDelay: 8.0 },
  { x: 410, y: 160, size: 6, brightness: 0.9, twinkleDelay: 8.1 },
  { x: 420, y: 160, size: 8, brightness: 1, twinkleDelay: 8.2 },
];

export const ConstellationBuilder: React.FC<ConstellationBuilderProps> = ({ isCountdownExpired }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [stars, setStars] = useState<StarPosition[]>([]);
  const [showConnections, setShowConnections] = useState(false);
  const [isRevealing, setIsRevealing] = useState(false);
  const [revealedStars, setRevealedStars] = useState(0);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const animationRef = useRef<number>();

  // Calculate days since start (June 27th, 2025 - 16 days before July 12th)
  const startDate = new Date('2025-06-27');
  const today = new Date();
  const diffTime = today.getTime() - startDate.getTime();
  const daysSinceStart = Math.max(0, Math.floor(diffTime / (1000 * 60 * 60 * 24)));
  const totalDays = 16; // 16 days from June 27 to July 12
  const starsToShow = Math.min(daysSinceStart + 1, totalDays);

  // Load saved constellation state
  useEffect(() => {
    const savedState = localStorage.getItem(STORAGE_KEY);
    if (savedState) {
      try {
        const parsedState = JSON.parse(savedState);
        setStars(parsedState.stars || []);
        setShowConnections(parsedState.showConnections || false);
      } catch (error) {
        console.error('Error loading constellation state:', error);
      }
    }
  }, []);

  // Generate stars based on days passed
  useEffect(() => {
    if (isCountdownExpired) {
      // Show the full SAMRIDDHI constellation
      setStars(SAMRIDDHI_PATTERN);
    } else {
      // Generate random stars for each day
      const newStars: StarPosition[] = [];
      for (let i = 0; i < starsToShow; i++) {
        newStars.push({
          x: Math.random() * 400 + 50,
          y: Math.random() * 200 + 50,
          size: Math.random() * 4 + 4,
          brightness: Math.random() * 0.5 + 0.5,
          twinkleDelay: Math.random() * 2,
        });
      }
      setStars(newStars);
    }
  }, [starsToShow, isCountdownExpired]);

  // Save constellation state
  useEffect(() => {
    const stateToSave = {
      stars,
      showConnections,
      timestamp: new Date().toISOString(),
    };
    localStorage.setItem(STORAGE_KEY, JSON.stringify(stateToSave));
  }, [stars, showConnections]);

  // Canvas animation for twinkling stars
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas || !isOpen) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const animate = (timestamp: number) => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      // Draw connections if enabled and it's the final constellation
      if (showConnections && isCountdownExpired) {
        ctx.strokeStyle = 'rgba(147, 197, 253, 0.3)';
        ctx.lineWidth = 1;
        ctx.setLineDash([2, 4]);
        
        for (let i = 0; i < stars.length - 1; i++) {
          const star1 = stars[i];
          const star2 = stars[i + 1];
          const distance = Math.sqrt(Math.pow(star2.x - star1.x, 2) + Math.pow(star2.y - star1.y, 2));
          
          if (distance < 80) {
            ctx.beginPath();
            ctx.moveTo(star1.x, star1.y);
            ctx.lineTo(star2.x, star2.y);
            ctx.stroke();
          }
        }
      }

      // Draw stars
      stars.forEach((star, index) => {
        if (isRevealing && index >= revealedStars) return;

        const twinkle = Math.sin(timestamp * 0.003 + star.twinkleDelay) * 0.3 + 0.7;
        const alpha = star.brightness * twinkle;
        
        // Star glow
        const gradient = ctx.createRadialGradient(star.x, star.y, 0, star.x, star.y, star.size * 2);
        gradient.addColorStop(0, `rgba(255, 255, 255, ${alpha})`);
        gradient.addColorStop(0.5, `rgba(147, 197, 253, ${alpha * 0.6})`);
        gradient.addColorStop(1, `rgba(147, 197, 253, 0)`);
        
        ctx.fillStyle = gradient;
        ctx.beginPath();
        ctx.arc(star.x, star.y, star.size * 2, 0, Math.PI * 2);
        ctx.fill();
        
        // Star core
        ctx.fillStyle = `rgba(255, 255, 255, ${alpha})`;
        ctx.beginPath();
        ctx.arc(star.x, star.y, star.size / 2, 0, Math.PI * 2);
        ctx.fill();
        
        // Star sparkle
        if (twinkle > 0.8) {
          ctx.strokeStyle = `rgba(255, 255, 255, ${alpha})`;
          ctx.lineWidth = 1;
          ctx.beginPath();
          ctx.moveTo(star.x - star.size, star.y);
          ctx.lineTo(star.x + star.size, star.y);
          ctx.moveTo(star.x, star.y - star.size);
          ctx.lineTo(star.x, star.y + star.size);
          ctx.stroke();
        }
      });

      animationRef.current = requestAnimationFrame(animate);
    };

    animationRef.current = requestAnimationFrame(animate);

    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    };
  }, [isOpen, stars, showConnections, isCountdownExpired, isRevealing, revealedStars]);

  // Reveal animation for the name
  const revealConstellation = () => {
    if (!isCountdownExpired) return;
    
    setIsRevealing(true);
    setRevealedStars(0);
    
    const revealInterval = setInterval(() => {
      setRevealedStars(prev => {
        if (prev >= stars.length) {
          clearInterval(revealInterval);
          setIsRevealing(false);
          setShowConnections(true);
          return prev;
        }
        return prev + 1;
      });
    }, 100);
  };

  const resetConstellation = () => {
    setShowConnections(false);
    setIsRevealing(false);
    setRevealedStars(0);
    localStorage.removeItem(STORAGE_KEY);
  };

  return (
    <div className="w-full max-w-5xl mx-auto mb-8">
      {!isOpen ? (
        <div className="text-center">
          <button
            onClick={() => setIsOpen(true)}
            className="group relative overflow-hidden bg-gradient-to-r from-indigo-600 via-purple-600 to-blue-600 text-white px-8 py-4 rounded-full font-semibold text-lg shadow-2xl hover:shadow-indigo-500/25 transition-all duration-500 hover:scale-105"
          >
            <div className="absolute inset-0 bg-gradient-to-r from-indigo-700 via-purple-700 to-blue-700 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
            <div className="relative flex items-center space-x-2">
              <Star className="w-5 h-5" />
              <span>View Your Constellation</span>
              <Sparkles className="w-5 h-5" />
            </div>
          </button>
          <p className="text-purple-200/60 text-sm mt-3">
            {isCountdownExpired 
              ? "Your constellation is complete - see the magic!" 
              : `${starsToShow} star${starsToShow !== 1 ? 's' : ''} collected • ${totalDays - starsToShow} days remaining`
            }
          </p>
        </div>
      ) : (
        <div className="bg-gradient-to-b from-indigo-950/40 via-purple-950/40 to-blue-950/40 backdrop-blur-lg rounded-3xl p-6 md:p-8 border border-white/10 shadow-2xl">
          {/* Header */}
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center space-x-2">
              <Star className="w-6 h-6 text-yellow-300" />
              <h3 className="text-xl font-bold text-white">
                {isCountdownExpired ? "Your Personal Constellation" : "Constellation Builder"}
              </h3>
            </div>
            <div className="flex items-center space-x-2">
              {isCountdownExpired && (
                <>
                  <button
                    onClick={() => setShowConnections(!showConnections)}
                    className={`p-2 rounded-full transition-colors duration-200 ${
                      showConnections 
                        ? 'bg-blue-500/30 text-blue-300' 
                        : 'bg-white/10 hover:bg-white/20 text-white'
                    }`}
                    title={showConnections ? "Hide Connections" : "Show Connections"}
                  >
                    {showConnections ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                  <button
                    onClick={revealConstellation}
                    className="px-4 py-2 bg-gradient-to-r from-yellow-500 to-orange-500 hover:from-yellow-600 hover:to-orange-600 text-white rounded-full text-sm font-semibold transition-all duration-300 hover:scale-105"
                  >
                    Reveal Magic
                  </button>
                </>
              )}
              <button
                onClick={() => setIsOpen(false)}
                className="p-2 bg-white/10 hover:bg-white/20 rounded-full transition-colors duration-200"
              >
                <span className="text-white text-sm">✕</span>
              </button>
            </div>
          </div>

          {/* Constellation Display */}
          <div className="relative">
            <div className="bg-gradient-to-b from-slate-900 via-indigo-900 to-purple-900 rounded-2xl p-8 min-h-[400px] relative overflow-hidden">
              {/* Background stars */}
              <div className="absolute inset-0">
                {Array.from({ length: 50 }).map((_, i) => (
                  <div
                    key={i}
                    className="absolute w-1 h-1 bg-white rounded-full opacity-30 animate-pulse"
                    style={{
                      top: `${Math.random() * 100}%`,
                      left: `${Math.random() * 100}%`,
                      animationDelay: `${Math.random() * 3}s`,
                      animationDuration: `${2 + Math.random() * 2}s`,
                    }}
                  />
                ))}
              </div>

              {/* Main constellation canvas */}
              <canvas
                ref={canvasRef}
                width={500}
                height={300}
                className="w-full h-full max-w-full max-h-[300px] mx-auto"
              />

              {/* Constellation info */}
              <div className="absolute bottom-4 left-4 right-4">
                <div className="bg-black/30 backdrop-blur-sm rounded-lg p-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-white font-semibold">
                        {isCountdownExpired ? "✨ SAMRIDDHI ✨" : `Day ${daysSinceStart + 1} of ${totalDays}`}
                      </p>
                      <p className="text-blue-200 text-sm">
                        {isCountdownExpired 
                          ? "Your name written in the stars - Happy Birthday!" 
                          : `${starsToShow} star${starsToShow !== 1 ? 's' : ''} in your constellation`
                        }
                      </p>
                    </div>
                    <div className="text-right">
                      <div className="flex items-center space-x-1">
                        {Array.from({ length: Math.min(starsToShow, 5) }).map((_, i) => (
                          <Star key={i} className="w-4 h-4 text-yellow-300 fill-current" />
                        ))}
                        {starsToShow > 5 && (
                          <span className="text-yellow-300 text-sm ml-1">+{starsToShow - 5}</span>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Special effects for birthday */}
              {isCountdownExpired && showConnections && (
                <div className="absolute inset-0 pointer-events-none">
                  {Array.from({ length: 15 }).map((_, i) => (
                    <div
                      key={i}
                      className="absolute animate-ping"
                      style={{
                        top: `${Math.random() * 100}%`,
                        left: `${Math.random() * 100}%`,
                        animationDelay: `${Math.random() * 2}s`,
                        animationDuration: `${1 + Math.random()}s`,
                      }}
                    >
                      <Sparkles className="w-4 h-4 text-yellow-300" />
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Progress and Info */}
          <div className="mt-6 space-y-4">
            {!isCountdownExpired && (
              <div className="bg-white/5 rounded-lg p-4">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-white font-medium">Constellation Progress</span>
                  <span className="text-blue-300 text-sm">{starsToShow}/{totalDays} stars</span>
                </div>
                <div className="w-full bg-white/10 rounded-full h-2">
                  <div 
                    className="bg-gradient-to-r from-blue-400 to-purple-400 h-2 rounded-full transition-all duration-500"
                    style={{ width: `${(starsToShow / totalDays) * 100}%` }}
                  />
                </div>
                <p className="text-white/70 text-sm mt-2">
                  Each day adds a new star to your personal constellation. On July 12th, something magical will be revealed!
                </p>
              </div>
            )}

            {isCountdownExpired && (
              <div className="bg-gradient-to-r from-yellow-500/10 to-orange-500/10 border border-yellow-500/20 rounded-lg p-4">
                <div className="flex items-center space-x-2 mb-2">
                  <Star className="w-5 h-5 text-yellow-400 fill-current" />
                  <h4 className="text-yellow-400 font-semibold">Constellation Complete!</h4>
                </div>
                <p className="text-white/80 text-sm">
                  Your 16-day journey has culminated in this beautiful constellation that spells out "SAMRIDDHI" - 
                  your name written in the stars! Each star represents a day of anticipation leading to this special moment.
                </p>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};