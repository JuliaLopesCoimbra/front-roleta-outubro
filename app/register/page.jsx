"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL;

export default function Login() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [cpf, setCPF] = useState("");
  const [loading, setLoading] = useState(false);
  const [redirecting, setRedirecting] = useState(false); // <<< novo estado
  const router = useRouter();

  async function handleSubmit(e) {
    e.preventDefault();

    // ... suas validações de nome, email e CPF aqui

    setLoading(true);
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
          if (body && body.detail) msg = body.detail;
        } catch {}
        throw new Error(msg);
      }
      const data = await res.json();

      try {
        localStorage.setItem("personId", String(data.person.id));
      } catch {}

      toast.success("Cadastro realizado com sucesso! 🎉", {
        className:
          "text-[80px] px-16 py-12 rounded-2xl font-extrabold w-[90%] text-center",
        duration: 2000,
      });

      setRedirecting(true); // <<< ativa estado de redirecionamento

      setTimeout(() => {
        router.push("/roleta");
      }, 2000);
    } catch (err) {
      toast.error(String(err.message || "Falha no cadastro ❌"), {
        className:
          "text-[100px] px-16 py-12 rounded-2xl font-extrabold w-[90%] text-center",
      });
      console.error(err);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div
      style={{
        backgroundImage: "url('/tela2.png')",
        backgroundRepeat: "no-repeat",
        backgroundSize: "cover",
      }}
      className="flex min-h-screen flex-col items-center justify-center bg-cover bg-center"
    >
      <form
        onSubmit={handleSubmit}
        className="flex flex-col gap-8 w-full max-w-2xl bg-black/70 backdrop-blur-md p-16 rounded-3xl shadow-2xl"
      >
        <h1 className="text-6xl font-extrabold text-center text-white drop-shadow-lg">
          Cadastre-se
        </h1>

        <input
          type="text"
          placeholder="Digite seu Nome"
          value={name}
          onChange={(e) => setName(e.target.value)}
          className="p-6 text-3xl rounded-2xl border-4 border-pink-500 bg-black/70 text-white placeholder-gray-300 focus:outline-none focus:ring-4 focus:ring-pink-400"
          autoComplete="name"
          required
        />

        <input
          type="email"
          placeholder="Digite seu E-mail"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="p-6 text-3xl rounded-2xl border-4 border-cyan-400 bg-black/70 text-white placeholder-gray-300 focus:outline-none focus:ring-4 focus:ring-cyan-300"
          autoComplete="email"
          required
        />

        <input
          type="text"
          placeholder="Digite seu CPF"
          value={cpf}
          onChange={(e) =>
            setCPF(
              e.target.value
                .replace(/\D/g, "")
                .replace(/(\d{3})(\d)/, "$1.$2")
                .replace(/(\d{3})(\d)/, "$1.$2")
                .replace(/(\d{3})(\d{1,2})$/, "$1-$2")
            )
          }
          inputMode="numeric"
          maxLength={14}
          className="p-6 text-3xl rounded-2xl border-4 border-green-400 bg-black/70 text-white placeholder-gray-300 focus:outline-none focus:ring-4 focus:ring-green-300"
          aria-label="CPF"
          required
        />

        <button
          type="submit"
          disabled={loading || redirecting} // <<< trava botão
          className="py-6 text-4xl rounded-2xl font-extrabold text-white bg-gradient-to-r from-pink-500 via-purple-500 to-cyan-400 hover:scale-105 transition-transform shadow-xl disabled:opacity-60 disabled:cursor-not-allowed"
        >
          {redirecting
            ? "Redirecionando..."
            : loading
            ? "Enviando..."
            : "Cadastrar"}
        </button>
      </form>
    </div>
  );
}
