"use client";

import { useRef, useEffect, useCallback } from "react";
import Box from "@mui/material/Box";

export interface WheelSlot {
  label: string;
  color: string;
  value: number | null;
}

interface RouletteWheelProps {
  slots: WheelSlot[];
  spinning: boolean;
  targetIndex: number;
  onSpinEnd: () => void;
}

export default function RouletteWheel({
  slots,
  spinning,
  targetIndex,
  onSpinEnd,
}: RouletteWheelProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const rotationRef = useRef(0);
  const animFrameRef = useRef<number>(0);

  const drawWheel = useCallback(
    (rotation: number) => {
      const canvas = canvasRef.current;
      if (!canvas) return;
      const ctx = canvas.getContext("2d");
      if (!ctx) return;

      const size = canvas.width;
      const center = size / 2;
      const radius = center - 8;
      const slotAngle = (2 * Math.PI) / slots.length;

      ctx.clearRect(0, 0, size, size);

      ctx.save();
      ctx.beginPath();
      ctx.arc(center, center, radius + 6, 0, 2 * Math.PI);
      ctx.shadowColor = "#FFD54F";
      ctx.shadowBlur = 20;
      ctx.strokeStyle = "#FFD54F";
      ctx.lineWidth = 3;
      ctx.stroke();
      ctx.restore();

      for (let i = 0; i < slots.length; i++) {
        const startAngle = rotation + i * slotAngle;
        const endAngle = startAngle + slotAngle;

        ctx.beginPath();
        ctx.moveTo(center, center);
        ctx.arc(center, center, radius, startAngle, endAngle);
        ctx.closePath();
        ctx.fillStyle = slots[i].color;
        ctx.fill();
        ctx.strokeStyle = "#0a1a0a";
        ctx.lineWidth = 2;
        ctx.stroke();

        ctx.save();
        ctx.translate(center, center);
        ctx.rotate(startAngle + slotAngle / 2);
        ctx.textAlign = "right";
        ctx.fillStyle = "#fff";
        ctx.font = `bold ${size < 300 ? 11 : 14}px Arial`;
        ctx.shadowColor = "rgba(0,0,0,0.5)";
        ctx.shadowBlur = 3;
        ctx.fillText(slots[i].label, radius - 15, 5);
        ctx.restore();
      }

      ctx.beginPath();
      ctx.arc(center, center, 22, 0, 2 * Math.PI);
      ctx.fillStyle = "#1B5E20";
      ctx.fill();
      ctx.strokeStyle = "#FFD54F";
      ctx.lineWidth = 3;
      ctx.stroke();

      ctx.beginPath();
      ctx.moveTo(center, center - 10);
      ctx.lineTo(center + 8, center);
      ctx.lineTo(center, center + 10);
      ctx.lineTo(center - 8, center);
      ctx.closePath();
      ctx.fillStyle = "#FFD54F";
      ctx.fill();

      ctx.beginPath();
      ctx.moveTo(center - 14, 4);
      ctx.lineTo(center + 14, 4);
      ctx.lineTo(center, 30);
      ctx.closePath();
      ctx.fillStyle = "#FFD54F";
      ctx.fill();
      ctx.strokeStyle = "#0a1a0a";
      ctx.lineWidth = 2;
      ctx.stroke();
    },
    [slots],
  );

  useEffect(() => {
    drawWheel(rotationRef.current);
  }, [drawWheel]);

  useEffect(() => {
    if (!spinning) return;

    const slotAngle = (2 * Math.PI) / slots.length;
    const targetFinalAngle =
      -(targetIndex * slotAngle + slotAngle / 2) - Math.PI / 2;

    const normalizedTarget =
      ((targetFinalAngle % (2 * Math.PI)) + 2 * Math.PI) % (2 * Math.PI);

    const startRotation = rotationRef.current;
    const currentNormalized =
      ((startRotation % (2 * Math.PI)) + 2 * Math.PI) % (2 * Math.PI);

    let delta = normalizedTarget - currentNormalized;
    if (delta <= 0) delta += 2 * Math.PI;

    const fullSpins = Math.ceil(5 + Math.random() * 3);
    const totalRotation = startRotation + fullSpins * 2 * Math.PI + delta;

    const startTime = performance.now();
    const duration = 4000 + Math.random() * 1000;

    const animate = (now: number) => {
      const elapsed = now - startTime;
      const progress = Math.min(elapsed / duration, 1);

      const eased = 1 - Math.pow(1 - progress, 3);
      const currentRotation =
        startRotation + (totalRotation - startRotation) * eased;

      rotationRef.current = currentRotation;
      drawWheel(currentRotation);

      if (progress < 1) {
        animFrameRef.current = requestAnimationFrame(animate);
      } else {
        onSpinEnd();
      }
    };

    animFrameRef.current = requestAnimationFrame(animate);

    return () => cancelAnimationFrame(animFrameRef.current);
  }, [spinning, targetIndex, slots, drawWheel, onSpinEnd]);

  return (
    <Box
      sx={{
        position: "relative",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        width: "100%",
        maxWidth: { xs: 300, sm: 380, md: 420 },
        mx: "auto",
      }}
    >
      <canvas
        ref={canvasRef}
        width={420}
        height={420}
        style={{
          width: "100%",
          height: "auto",
        }}
      />
    </Box>
  );
}
