"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner"; // FIX: importar toast

const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL;

// ordem no sentido horário a partir do topo (ponteiro):
const segmentsBase = [
  { id: 1, name: "Copo",      image: "/prizes/copo.jpeg" },     // 0
  { id: 3, name: "Bottons",   image: "/prizes/botton.jpeg" },   // 1
  { id: 2, name: "SalvaFone", image: "/prizes/salvafone.jpeg" },// 2
  { id: 5, name: "Meia",      image: "/prizes/meia.jpeg" },     // 3
  { id: 4, name: "Cartela",   image: "/prizes/cartela.jpg" },   // 4 (Adesivos)
  { id: 1, name: "Copo",      image: "/prizes/copo.jpeg" },     // 5
  { id: 3, name: "Bottons",   image: "/prizes/botton.jpeg" },   // 6
  { id: 2, name: "SalvaFone", image: "/prizes/salvafone.jpeg" },// 7
  { id: 5, name: "Meia",      image: "/prizes/meia.jpeg" },     // 8
  { id: 4, name: "Cartela",   image: "/prizes/cartela.jpg" },   // 9 (Adesivos)
];

export default function Roleta() {
  const router = useRouter();
  const [rotation, setRotation] = useState(0);
  const [isSpinning, setIsSpinning] = useState(false);
  const [loading, setLoading] = useState(false);
  const [prizeWon, setPrizeWon] = useState(null);
  const [hasSpun, setHasSpun] = useState(false);
  const [redirecting, setRedirecting] = useState(false);

  const SEGMENT_COUNT = segmentsBase.length; // 10
  const SEGMENT_ANGLE = 360 / SEGMENT_COUNT; // 36°
  const SPINS = 5;
  const VISUAL_OFFSET_DEG = -18; // ok se calibrado assim

  async function handleSpin() {
    const personId = localStorage.getItem("personId");
    if (!personId) {
      router.replace("/");
      return;
    }

    try {
      setHasSpun(true);
      setIsSpinning(true);
      setLoading(true);

      // 1) Sorteio
      const r = await fetch(`${BASE_URL}/roleta/spin/${personId}`, { method: "POST" });
      if (!r.ok) throw new Error("Falha ao sortear. Tente novamente.");
      const data = await r.json();
      const brindeId = Number(data.brinde_id);

      // 2) Índices do brinde na roleta (2 setores)
      const candidateIndices = [];
      segmentsBase.forEach((seg, idx) => {
        if (seg.id === brindeId) candidateIndices.push(idx);
      });
      if (candidateIndices.length === 0) throw new Error("Brinde não mapeado na roleta.");

      // 3) Escolhe um dos dois setores
      const chosenIndex = candidateIndices[Math.floor(Math.random() * candidateIndices.length)];

      // 4) Ângulo do centro
      const targetCenterAngle = (chosenIndex + 0.5) * SEGMENT_ANGLE;

      // 5) Rotação total
      const totalRotation = - (SPINS * 360 + targetCenterAngle + VISUAL_OFFSET_DEG);

      // 6) Animar
      setRotation(0);
      await new Promise((res) => setTimeout(res, 50));
      setRotation(totalRotation);

      // 7) Fim da animação → salvar e redirecionar
      setTimeout(() => {
        const won = segmentsBase.find((s) => s.id === brindeId) || null; // FIX: usar segmentsBase
        if (won) {
          localStorage.setItem("brindeId", String(won.id));
        }
        setPrizeWon(won ? { id: won.id, name: won.name, image: won.image } : null);
        setIsSpinning(false);
        setLoading(false);

        setRedirecting(true);
        setTimeout(() => {
          router.push("/brinde");
        }, 2500);
      }, 10000);

    } catch (err) { // FIX: tipar err para usar err.message
      console.error(err);
      setIsSpinning(false);
      setLoading(false);
      setHasSpun(false); // opcional: liberar novo clique se der erro
      toast.error(String(err?.message || "Erro inesperado"), {
        className: "text-[60px] px-12 py-8 rounded-2xl font-extrabold w-[90%] text-center",
      });
    }
  }

  const buttonLabel = redirecting
    ? "Redirecionando..."
    : isSpinning || loading
    ? "Girando..."
    : "Girar";

  const buttonDisabled = hasSpun || isSpinning || loading || redirecting;

  return (
    <div
      style={{
        backgroundImage: "url('/tela3.png')",
        backgroundRepeat: "no-repeat",
        backgroundSize: "cover",
      }}
      className="flex min-h-screen flex-col items-center justify-center p-24 bg-cover bg-center"
    >
      <div className="relative flex justify-center items-center w-[55vh] h-[55vh] mt-80">{/* FIX: mt-100 -> mt-24 */}
        <img
          src="/roleta1.png"
          alt="Roleta"
          className={`absolute top-0 left-0 z-[1] w-full h-full transition-transform duration-[10000ms] [transition-timing-function:cubic-bezier(0.1,1,0.3,1)] ${
            isSpinning ? 'filter blur-[1.6px] drop-shadow-[0_0_30px_rgba(139,92,246,0.7)]' : 'transition-none'
          }`}
          style={{ transform: `rotate(${rotation}deg)` }}
        />
           <img
  src="/borda.png"
  alt="Borda decorativa"
  className="absolute inset-0 z-[2] w-full h-full pointer-events-none select-none"
  onError={(e) => console.warn('borda.png não carregou', e)}
/>

        <img
          src="/ponteiro.png"
          alt="Ponteiro"
          className="absolute -top-12 left-1/2 z-[3] w-[10vh] translate-x-[-50%]"
        />
      </div>

      {/* Botão abaixo da roleta */}
      <div className="mt-1">
        <button
          onClick={handleSpin}
          disabled={buttonDisabled}
          aria-disabled={buttonDisabled}
          aria-busy={isSpinning || redirecting}
          className={`inline-flex items-center gap-2 px-16 py-8 rounded-xl
                      border border-white/25 text-white text-6xl font-semibold
                      bg-transparent hover:bg-white/10 active:bg-white/15
                      transition-colors duration-200
                      focus:outline-none focus-visible:ring-2 focus-visible:ring-white/40
                      ${buttonDisabled ? 'opacity-50 cursor-not-allowed hover:bg-transparent active:bg-transparent' : ''}`}
        >
       
          {buttonLabel}
        </button>
      </div>

      {/* Mensagem de redirecionamento */}
      {redirecting && (
        <div role="status" aria-live="polite" className="mt-6 text-white/90 text-2xl font-semibold">
          Redirecionando para a tela de brinde...
        </div>
      )}
    </div>
  );
}
