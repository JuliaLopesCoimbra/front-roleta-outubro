"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

const PRIZES = [
  { id: 1, name: "Copo",      image: "/prizes/copo.jpeg" },
  { id: 2, name: "SalvaFone", image: "/prizes/salvafone.jpeg" },
  { id: 3, name: "Bottons",   image: "/prizes/botton.jpeg" },
  { id: 4, name: "Cartela",   image: "/prizes/cartela.jpg" },
  { id: 5, name: "Meia",      image: "/prizes/meia.jpeg" },
];

// mapa de nomes exibidos
const DISPLAY_NAMES = {
  SalvaFone: "Salva Fone",
  Cartela: "Cartela de Adesivos",
  Bottons: "Conjunto de Bottons",
  Meia: "Meias",
};

export default function BrindePage() {
  const router = useRouter();
  const [brinde, setBrinde] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const id = typeof window !== "undefined" ? localStorage.getItem("brindeId") : null;
    if (id) {
      const found = PRIZES.find((p) => p.id === Number(id)) || null;
      setBrinde(found);
    }
    setLoading(false);
  }, []);

  const handleBack = () => router.push("/");

  return (
    <div
      style={{
        backgroundImage: "url('/tela4.png')",
        backgroundRepeat: "no-repeat",
        backgroundSize: "cover",
        // border:"solid 1px red"
      }}
      className="relative min-h-screen w-full overflow-hidden"

    >
      <main className="relative z-10 flex min-h-screen  justify-center p-8"
      >
        <div className="mt-30 h-[70vh] w-full max-w-5xl rounded-[2rem] border border-white/10 bg-white/5 p-12 shadow-2xl backdrop-blur-xl">
          <header className="mb-10 text-center">
            <h1 className="text-7xl font-extrabold tracking-tight text-white">
              🎉 Seu Brinde
            </h1>
            <p className="mt-4 text-3xl text-white/80">
              Parabéns! Retire seu brinde com o promotor.
            </p>
          </header>

          {loading ? (
            <div className="flex flex-col items-center">
              <div className="h-[45vh] w-[45vh] animate-pulse rounded-3xl bg-white/10" />
              <div className="mt-6 h-10 w-72 animate-pulse rounded-lg bg-white/10" />
            </div>
          ) : brinde ? (
            <div className="flex flex-col items-center text-center">
              <img
                src={brinde.image}
                alt={brinde.name}
                className="h-[45vh] w-[45vh] rounded-3xl object-contain ring-1 ring-white/10"
                draggable={false}
              />
              <p className="mt-6 text-5xl font-bold text-white">
                {DISPLAY_NAMES[brinde.name] || brinde.name}
              </p>

              <button
                onClick={handleBack}
                className="mt-12 inline-flex items-center justify-center rounded-2xl border border-white/20 px-10 py-6 text-4xl font-semibold text-white/90 transition-colors hover:bg-white/10 focus:outline-none focus-visible:ring-4 focus-visible:ring-white/40"
              >
                Voltar ao início
              </button>
            </div>
          ) : (
            <div className="text-center">
              <p className="text-5xl font-semibold text-white/90">Nenhum brinde encontrado.</p>
              <button
                onClick={() => router.push("/roleta")}
                className="mt-10 inline-flex items-center justify-center rounded-2xl border border-white/20 px-10 py-6 text-4xl font-semibold text-white/90 transition-colors hover:bg-white/10 focus:outline-none focus-visible:ring-4 focus-visible:ring-white/40"
              >
                Voltar para a roleta
              </button>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
