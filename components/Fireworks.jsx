import React from "react";

/*
Simple CSS-based "kembang api" + scaling text.
The component renders confetti-like circles that expand and fade.
*/
export default function Fireworks({ message = "Terimakasih atas vote anda" }) {
  return (
    <div className="fixed inset-0 pointer-events-none flex items-center justify-center z-50">
      <div className="relative">
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="firework-wrap">
            <div className="particle p1" />
            <div className="particle p2" />
            <div className="particle p3" />
            <div className="particle p4" />
            <div className="particle p5" />
            <div className="particle p6" />
            <div className="particle p7" />
            <div className="particle p8" />
          </div>
        </div>
        <div className="relative">
          <div className="thank scale-up">{message}</div>
        </div>
      </div>

      <style jsx>{`
        .firework-wrap { width: 220px; height: 220px; position: relative; }
        .particle {
          position: absolute;
          width: 18px;
          height: 18px;
          border-radius: 50%;
          background: radial-gradient(circle at 30% 30%, #fff, #ffd700 60%, #ff6b6b 100%);
          opacity: 0;
          transform: translate(-50%, -50%) scale(0.2);
          animation: burst 900ms ease-out forwards;
        }
        .p1 { left: 10%; top: 20%; animation-delay: 0ms; }
        .p2 { left: 30%; top: 5%; animation-delay: 40ms; }
        .p3 { left: 60%; top: 15%; animation-delay: 70ms; }
        .p4 { left: 80%; top: 35%; animation-delay: 100ms; }
        .p5 { left: 20%; top: 60%; animation-delay: 140ms; }
        .p6 { left: 40%; top: 80%; animation-delay: 180ms; }
        .p7 { left: 70%; top: 75%; animation-delay: 220ms; }
        .p8 { left: 50%; top: 45%; animation-delay: 260ms; }

        @keyframes burst {
          0% { opacity: 1; transform: translate(-50%, -50%) scale(0.2) translateY(0); }
          50% { opacity: 1; transform: translate(-50%, -50%) scale(1.2) translateY(-20px); }
          100% { opacity: 0; transform: translate(-50%, -50%) scale(1.6) translateY(-60px); }
        }

        .thank {
          color: white;
          font-weight: 700;
          text-align: center;
          padding: 12px 18px;
          border-radius: 8px;
          background: linear-gradient(90deg,#059669,#06b6d4);
          transform-origin: center;
        }

        .scale-up {
          animation: scaleText 700ms ease-out forwards;
          transform: scale(0.2);
          font-size: 18px;
        }
        @keyframes scaleText {
          0% { transform: scale(0.2); opacity: 0; }
          60% { transform: scale(1.08); opacity: 1; }
          100% { transform: scale(1); opacity: 1; }
        }
      `}</style>
    </div>
  );
}
