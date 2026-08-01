"use client";

import { useEffect, useRef } from "react";

interface Node {
  x: number;
  y: number;
  vx: number;
  vy: number;
  radius: number;
  alpha: number;
  connections: number[];
  pulsePhase: number;
}

interface Packet {
  fromNode: number;
  toNode: number;
  progress: number;
  speed: number;
  color: string;
}

export function NeuralNetworkBackground() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const mouseRef = useRef({ x: -9999, y: -9999 });
  const animFrameRef = useRef<number>(0);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let width = window.innerWidth;
    let height = window.innerHeight;

    const resize = () => {
      width = window.innerWidth;
      height = window.innerHeight;
      canvas.width = width;
      canvas.height = height;
    };
    resize();
    window.addEventListener("resize", resize);

    const onMouseMove = (e: MouseEvent) => {
      mouseRef.current = { x: e.clientX, y: e.clientY };
    };
    window.addEventListener("mousemove", onMouseMove);

    // Generate nodes
    const NODE_COUNT = Math.min(60, Math.floor((width * height) / 20000));
    const nodes: Node[] = Array.from({ length: NODE_COUNT }, () => ({
      x: Math.random() * width,
      y: Math.random() * height,
      vx: (Math.random() - 0.5) * 0.3,
      vy: (Math.random() - 0.5) * 0.3,
      radius: Math.random() * 2 + 1,
      alpha: Math.random() * 0.5 + 0.3,
      connections: [],
      pulsePhase: Math.random() * Math.PI * 2,
    }));

    // Data packets moving along edges
    const packets: Packet[] = [];
    const COLORS = ["rgba(56,189,248,", "rgba(129,140,248,", "rgba(52,211,153,"];

    const MAX_DIST = 180;
    const MAX_CONNECTIONS = 4;

    const computeConnections = () => {
      nodes.forEach((node) => (node.connections = []));
      for (let i = 0; i < nodes.length; i++) {
        let count = 0;
        for (let j = i + 1; j < nodes.length; j++) {
          if (count >= MAX_CONNECTIONS) break;
          const dx = nodes[i].x - nodes[j].x;
          const dy = nodes[i].y - nodes[j].y;
          const dist = Math.sqrt(dx * dx + dy * dy);
          if (dist < MAX_DIST) {
            nodes[i].connections.push(j);
            nodes[j].connections.push(i);
            count++;

            // Randomly spawn data packets
            if (Math.random() < 0.003 && packets.length < 30) {
              packets.push({
                fromNode: i,
                toNode: j,
                progress: 0,
                speed: Math.random() * 0.008 + 0.004,
                color: COLORS[Math.floor(Math.random() * COLORS.length)],
              });
            }
          }
        }
      }
    };

    let frame = 0;
    const animate = () => {
      animFrameRef.current = requestAnimationFrame(animate);
      frame++;
      ctx.clearRect(0, 0, width, height);

      // Recompute connections every 10 frames
      if (frame % 10 === 0) computeConnections();

      const mouse = mouseRef.current;

      // Update and draw nodes
      nodes.forEach((node, i) => {
        // Mouse repulsion
        const mdx = node.x - mouse.x;
        const mdy = node.y - mouse.y;
        const mdist = Math.sqrt(mdx * mdx + mdy * mdy);
        if (mdist < 120 && mdist > 0) {
          const force = (120 - mdist) / 120 * 0.5;
          node.vx += (mdx / mdist) * force;
          node.vy += (mdy / mdist) * force;
        }

        // Damping
        node.vx *= 0.98;
        node.vy *= 0.98;

        // Move
        node.x += node.vx;
        node.y += node.vy;

        // Wrap around
        if (node.x < 0) node.x = width;
        if (node.x > width) node.x = 0;
        if (node.y < 0) node.y = height;
        if (node.y > height) node.y = 0;

        // Draw edges
        node.connections.forEach((j) => {
          if (j <= i) return; // avoid double-drawing
          const other = nodes[j];
          const dx = other.x - node.x;
          const dy = other.y - node.y;
          const dist = Math.sqrt(dx * dx + dy * dy);
          const alpha = Math.max(0, (1 - dist / MAX_DIST) * 0.25);

          ctx.beginPath();
          ctx.moveTo(node.x, node.y);
          ctx.lineTo(other.x, other.y);
          ctx.strokeStyle = `rgba(56,189,248,${alpha})`;
          ctx.lineWidth = 0.5;
          ctx.stroke();
        });

        // Draw node
        const pulse = Math.sin(frame * 0.02 + node.pulsePhase) * 0.3 + 0.7;
        const r = node.radius * pulse;
        const alpha = node.alpha * pulse;

        // Outer glow
        const grad = ctx.createRadialGradient(node.x, node.y, 0, node.x, node.y, r * 4);
        grad.addColorStop(0, `rgba(56,189,248,${alpha * 0.4})`);
        grad.addColorStop(1, "rgba(56,189,248,0)");
        ctx.beginPath();
        ctx.arc(node.x, node.y, r * 4, 0, Math.PI * 2);
        ctx.fillStyle = grad;
        ctx.fill();

        // Core node
        ctx.beginPath();
        ctx.arc(node.x, node.y, r, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(56,189,248,${alpha})`;
        ctx.fill();
      });

      // Update and draw data packets
      for (let p = packets.length - 1; p >= 0; p--) {
        const packet = packets[p];
        packet.progress += packet.speed;

        if (packet.progress >= 1) {
          packets.splice(p, 1);
          continue;
        }

        const from = nodes[packet.fromNode];
        const to = nodes[packet.toNode];

        if (!from || !to) {
          packets.splice(p, 1);
          continue;
        }

        const px = from.x + (to.x - from.x) * packet.progress;
        const py = from.y + (to.y - from.y) * packet.progress;

        // Tail
        const tailLength = 15;
        const tailProg = Math.max(0, packet.progress - tailLength / 100);
        const tx = from.x + (to.x - from.x) * tailProg;
        const ty = from.y + (to.y - from.y) * tailProg;

        const grad = ctx.createLinearGradient(tx, ty, px, py);
        grad.addColorStop(0, `${packet.color}0)`);
        grad.addColorStop(1, `${packet.color}0.9)`);
        ctx.beginPath();
        ctx.moveTo(tx, ty);
        ctx.lineTo(px, py);
        ctx.strokeStyle = grad;
        ctx.lineWidth = 1.5;
        ctx.stroke();

        // Head glow
        const headGrad = ctx.createRadialGradient(px, py, 0, px, py, 4);
        headGrad.addColorStop(0, `${packet.color}1)`);
        headGrad.addColorStop(1, `${packet.color}0)`);
        ctx.beginPath();
        ctx.arc(px, py, 4, 0, Math.PI * 2);
        ctx.fillStyle = headGrad;
        ctx.fill();
      }
    };

    computeConnections();
    animate();

    return () => {
      cancelAnimationFrame(animFrameRef.current);
      window.removeEventListener("resize", resize);
      window.removeEventListener("mousemove", onMouseMove);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="fixed inset-0 w-full h-full pointer-events-none"
      style={{ zIndex: 0 }}
      aria-hidden="true"
    />
  );
}
