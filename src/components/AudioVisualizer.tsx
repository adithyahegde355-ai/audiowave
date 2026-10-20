import React, { useEffect, useRef } from 'react';
import { useAudio } from '../context/AudioContext';

interface AudioVisualizerProps {
  className?: string;
  barCount?: number;
  height?: number;
}

export const AudioVisualizer: React.FC<AudioVisualizerProps> = ({
  className = '',
  barCount = 32,
  height = 54
}) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const { isPlaying, getAudioFrequencyData } = useAudio();

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animationFrameId: number;
    let fallbackTick = 0;

    const render = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      const freqData = getAudioFrequencyData();
      const hasRealAudio =
        freqData &&
        freqData.length > 0 &&
        freqData.some((val) => val > 0);

      const barWidth = canvas.width / barCount;
      const gap = 2;
      const effectiveBarWidth = Math.max(2, barWidth - gap);

      fallbackTick += 0.08;

      for (let i = 0; i < barCount; i++) {
        let barHeight = 4; // baseline height

        if (isPlaying) {
          if (hasRealAudio && freqData) {
            // Sample frequency slice
            const sliceIndex = Math.floor((i / barCount) * (freqData.length / 2));
            const rawVal = freqData[sliceIndex] || 0;
            const normalized = rawVal / 255;
            barHeight = Math.max(4, normalized * (canvas.height - 4));
          } else {
            // Dynamic rhythmic pulse simulation synchronized with playback
            const wave1 = Math.sin(fallbackTick + i * 0.35);
            const wave2 = Math.cos(fallbackTick * 0.7 + i * 0.2);
            const combined = (wave1 + wave2 + 2) / 4;
            barHeight = Math.max(4, combined * (canvas.height - 8));
          }
        }

        const x = i * barWidth + gap / 2;
        const y = canvas.height - barHeight;

        // Gradient styling: Indigo to Cyan
        const gradient = ctx.createLinearGradient(0, canvas.height, 0, 0);
        gradient.addColorStop(0, '#6366f1'); // Indigo 500
        gradient.addColorStop(0.7, '#818cf8'); // Indigo 400
        gradient.addColorStop(1, '#06b6d4'); // Cyan 500

        ctx.fillStyle = isPlaying ? gradient : 'rgba(255, 255, 255, 0.12)';
        ctx.beginPath();
        ctx.roundRect(x, y, effectiveBarWidth, barHeight, [2, 2, 0, 0]);
        ctx.fill();
      }

      animationFrameId = requestAnimationFrame(render);
    };

    render();

    return () => {
      cancelAnimationFrame(animationFrameId);
    };
  }, [isPlaying, barCount, getAudioFrequencyData]);

  return (
    <div className={`relative flex items-center justify-center overflow-hidden ${className}`}>
      <canvas
        ref={canvasRef}
        width={barCount * 8}
        height={height}
        className="w-full h-full block"
      />
    </div>
  );
};
