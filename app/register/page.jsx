"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";

const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL;

export default function Login() {
  const router = useRouter();

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [cpf, setCPF] = useState("");

  const [loading, setLoading] = useState(false);
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [errorMsg, setErrorMsg] = useState(""); // 👈 novo estado para erro

  async function handleSubmit(e) {
    e.preventDefault();
    if (loading) return;
    setLoading(true);
    setErrorMsg(""); // limpa erro anterior

    try {
      const res = await fetch(`${BASE_URL}/persons`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: name.trim(),
          email: email.trim(),
          cpf: cpf.replace(/\D/g, ""),
        }),
      });

      if (!res.ok) {
        let msg = "Erro ao registrar";
        try {
          const body = await res.json();
          if (body?.detail) msg = body.detail;
        } catch {}
        throw new Error(msg);
      }

      const data = await res.json();
      localStorage.setItem("personId", String(data.person?.id ?? ""));

      // limpa campos
      setName("");
      setEmail("");
      setCPF("");

      setShowSuccessModal(true);
    } catch (err) {
      setErrorMsg(err?.message ?? "Falha no cadastro ❌"); // 👈 define a mensagem
      console.error(err);
    } finally {
      setLoading(false);
    }
  }

  function maskCPF(v) {
    return v
      .replace(/\D/g, "")
      .slice(0, 11)
      .replace(/(\d{3})(\d)/, "$1.$2")
      .replace(/(\d{3})(\d)/, "$1.$2")
      .replace(/(\d{3})(\d{1,2})$/, "$1-$2");
  }

  return (
    <div
      style={{
        backgroundImage: "url('/tela2.png')",
        backgroundRepeat: "no-repeat",
        backgroundSize: "cover",
      }}
      className="relative flex min-h-[100dvh] flex-col items-center bg-cover bg-center"
    >
      <div className="absolute inset-0 bg-black/40" />

      <form
        onSubmit={handleSubmit}
        className="relative w-full max-w-md sm:max-w-lg md:max-w-2xl mx-auto mt-12 mb-10 flex flex-col gap-6 bg-black/60 backdrop-blur-md p-6 md:p-10 rounded-2xl shadow-2xl"
      >
        <h1 className="text-3xl md:text-5xl font-extrabold text-center text-white">
          Cadastre-se
        </h1>

        <input
          type="text"
          placeholder="Nome completo"
          value={name}
          onChange={(e) => setName(e.target.value)}
          className="w-full p-4 text-lg md:text-2xl rounded-xl border-2 border-pink-500 bg-black/70 text-white placeholder-gray-300 focus:outline-none focus:ring-2 focus:ring-pink-400"
          required
        />

        <input
          type="email"
          placeholder="E-mail"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="w-full p-4 text-lg md:text-2xl rounded-xl border-2 border-cyan-400 bg-black/70 text-white placeholder-gray-300 focus:outline-none focus:ring-2 focus:ring-cyan-300"
          required
        />

        <input
          type="text"
          placeholder="CPF"
          value={cpf}
          onChange={(e) => setCPF(maskCPF(e.target.value))}
          inputMode="numeric"
          maxLength={14}
          className="w-full p-4 text-lg md:text-2xl rounded-xl border-2 border-green-400 bg-black/70 text-white placeholder-gray-300 focus:outline-none focus:ring-2 focus:ring-green-300"
          required
        />

        <button
          type="submit"
          disabled={loading}
          className="w-full py-4 text-xl md:text-3xl rounded-xl font-extrabold text-white bg-gradient-to-r from-pink-500 via-purple-500 to-cyan-400 transition-transform hover:scale-[1.02] disabled:opacity-60"
        >
          {loading ? "Enviando..." : "Cadastrar"}
        </button>
        {/* imagem logo abaixo do botão */}


        {/* 👇 mensagem de erro aparece aqui */}
        {errorMsg && (
          <p className="text-center text-red-400 font-semibold mt-2 text-sm md:text-lg">
            {errorMsg}
          </p>
        )}
      </form>
      <div className=" flex justify-center">
  <img
    src="/logo.png" // 👉 troque pelo caminho da sua imagem
    alt="Logo"
    className="h-40 md:h-40 object-contain"
  />
</div>

      {/* modal de sucesso permanece como já tinha */}
      {showSuccessModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4">
          <div className="bg-gradient-to-r from-pink-800 via-purple-800 to-cyan-800 text-white rounded-2xl shadow-2xl p-6 max-w-md w-full text-center">
            <h2 className="text-2xl md:text-3xl font-extrabold">
              Cadastro realizado com sucesso! 🎉
            </h2>
            <p className="mt-4">Você já pode girar a roleta</p>
            <button
              onClick={() => setShowSuccessModal(false)}
              className="mt-6 w-full py-3 rounded-xl bg-white/10 hover:bg-white/20 font-bold"
            >
              Fechar
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
