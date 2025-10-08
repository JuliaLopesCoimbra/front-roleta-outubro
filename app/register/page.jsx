"use client";
import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { Keyboard } from "../componentes/keyboard/Keyboard";

const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL;

export default function Login() {
  const router = useRouter();

  // estados do formulário
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [cpf, setCPF] = useState("");

  // estados de requisição
  const [loading, setLoading] = useState(false);
  const [redirecting, setRedirecting] = useState(false);

  // 👉 integração com o teclado
  const [focusedInput, setFocusedInput] = useState(null); // "name" | "email" | "cpf" | null
  const [caretPos, setCaretPos] = useState(0);            // posição do cursor no input focado

  // refs para ler posição do cursor quando o usuário toca/clica no input
  const nameRef = useRef(null);
  const emailRef = useRef(null);
  const cpfRef = useRef(null);

  // helper: pega o valor “visível” do input focado
  function getFocusedValue() {
    if (focusedInput === "name") return name;
    if (focusedInput === "email") return email;
    if (focusedInput === "cpf") return cpf;
    return "";
  }

  // helper: seta um valor novo no campo focado (usado pelo Keyboard)
  function setFocusedValue(field, value) {
    if (field === "name") setName(value);
    if (field === "email") setEmail(value);
    if (field === "cpf") {
      // mantém sua máscara de CPF (###.###.###-##)
      const masked = value
        .replace(/\D/g, "")
        .slice(0, 11)
        .replace(/(\d{3})(\d)/, "$1.$2")
        .replace(/(\d{3})(\d)/, "$1.$2")
        .replace(/(\d{3})(\d{1,2})$/, "$1-$2");
      setCPF(masked);
    }
  }

  // quando clica/foca em um input: registra qual é e captura caret
  function onFocusInput(field) {
    setFocusedInput(field);
    setTimeout(() => {
      const el =
        field === "name" ? nameRef.current :
        field === "email" ? emailRef.current :
        field === "cpf" ? cpfRef.current :
        null;
      if (el) {
        const pos = el.selectionStart ?? (el.value?.length ?? 0);
        setCaretPos(pos);
      }
    }, 0);
  }

  // quando o usuário clica/seleciona dentro do input, atualiza o caret
  function onClickOrSelect(e) {
    setCaretPos(e.target.selectionStart ?? 0);
  }

  async function handleSubmit(e) {
    e.preventDefault();

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

      setRedirecting(true);
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
  function focusField(field) {
  setFocusedInput(field);
  setTimeout(() => {
    const el =
      field === "name" ? nameRef.current :
      field === "email" ? emailRef.current :
      field === "cpf" ? cpfRef.current : null;
    if (el) {
      el.focus();
      const len = el.value?.length ?? 0;
      el.setSelectionRange(len, len);
      setCaretPos(len);
    }
  }, 0);
}

// callback chamado pela tecla Enter do teclado
function handleEnter() {
  if (focusedInput === "name") return focusField("email");
  if (focusedInput === "email") return focusField("cpf");
  if (focusedInput === "cpf") {
    // fecha o teclado e tira o foco do input
    setFocusedInput(null);
    if (cpfRef.current) cpfRef.current.blur();
    // opcional: rolar um pouco pra dar espaço ao botão "Cadastrar"
    // window.scrollTo({ top: document.body.scrollHeight, behavior: "smooth" });
  }
}

  return (
    <div
      style={{
        backgroundImage: "url('/tela2.png')",
        backgroundRepeat: "no-repeat",
        backgroundSize: "cover",
      }}
      className="relative flex min-h-screen flex-col items-center  bg-cover bg-center overflow-hidden"
      
    >
      <form
        onSubmit={handleSubmit}
        style={{border:"solid 1px red"}}
        className="mt-70 flex flex-col gap-10 w-full max-w-2xl bg-black/70 backdrop-blur-md p-16 rounded-3xl shadow-2xl"
      >
        <h1 className="text-6xl font-extrabold text-center text-white drop-shadow-lg">
          Cadastre-se
        </h1>

        <input
          ref={nameRef}
          type="text"
          placeholder="Digite seu Nome Completo"
          value={name}
          onChange={(e) => setName(e.target.value)}
          onFocus={() => onFocusInput("name")}
          onClick={onClickOrSelect}
          onSelect={onClickOrSelect}
          className="p-6 text-3xl rounded-2xl border-4 border-pink-500 bg-black/70 text-white placeholder-gray-300 focus:outline-none focus:ring-4 focus:ring-pink-400"
          autoComplete="off"
          autoCapitalize="words"
          autoCorrect="off"
          required
        />

        <input
          ref={emailRef}
          type="email"
          placeholder="Digite seu E-mail"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          onFocus={() => onFocusInput("email")}
          onClick={onClickOrSelect}
          onSelect={onClickOrSelect}
          className="p-6 text-3xl rounded-2xl border-4 border-cyan-400 bg-black/70 text-white placeholder-gray-300 focus:outline-none focus:ring-4 focus:ring-cyan-300"
          autoComplete="off"
          autoCapitalize="none"
          autoCorrect="off"
          required
        />

        <input
          ref={cpfRef}
          type="text"
          placeholder="Digite seu CPF"
          value={cpf}
          onChange={(e) => {
            // mantém máscara mesmo sem usar o teclado
            const masked = e.target.value
              .replace(/\D/g, "")
              .slice(0, 11)
              .replace(/(\d{3})(\d)/, "$1.$2")
              .replace(/(\d{3})(\d)/, "$1.$2")
              .replace(/(\d{3})(\d{1,2})$/, "$1-$2");
            setCPF(masked);
          }}
          onFocus={() => onFocusInput("cpf")}
          onClick={onClickOrSelect}
          onSelect={onClickOrSelect}
          inputMode="numeric"
          maxLength={14}
          className="p-6 text-3xl rounded-2xl border-4 border-green-400 bg-black/70 text-white placeholder-gray-300 focus:outline-none focus:ring-4 focus:ring-green-300"
          aria-label="CPF"
          autoComplete="off"
          autoCapitalize="none"
          autoCorrect="off"
          required
        />

        <button
          type="submit"
          disabled={loading || redirecting}
          className="py-6 text-4xl rounded-2xl font-extrabold text-white bg-gradient-to-r from-pink-500 via-purple-500 to-cyan-400 hover:scale-105 transition-transform shadow-xl disabled:opacity-60 disabled:cursor-not-allowed"
        >
          {redirecting
            ? "Redirecionando..."
            : loading
            ? "Enviando..."
            : "Cadastrar"}
        </button>
      </form>

      
     <Keyboard
  activeField={focusedInput}
  value={getFocusedValue()}
  setValue={(fieldName, value) => setFocusedValue(fieldName, value)}
  valueSelectPosition={caretPos}
  setSelectionPositionOfFocusedInput={(pos) => setCaretPos(pos)}
  onEnter={handleEnter}   // ⬅ aqui!
/>

    </div>
  );
}
