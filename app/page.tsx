import Link from "next/link";

export default function Home() {
  return (
    <Link href="/roleta">
      <div
        style={{
          backgroundImage: "url('/tela1.png')",
          backgroundRepeat: "no-repeat",
          backgroundSize: "cover", // aqui estava "background: cover", o correto é backgroundSize
        }}
        className="flex min-h-screen flex-col items-center justify-center p-24 bg-cover bg-center cursor-pointer"
      >
      
      </div>
    </Link>
  );
}
