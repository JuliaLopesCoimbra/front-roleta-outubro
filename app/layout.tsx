import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { Toaster } from "sonner";

export const metadata: Metadata = {
  title: "Roleta",
 
};
const inter = Inter({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700", "800"], // escolha os pesos que vai usar
});

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
     <body className={`${inter.className} overflow-hidden overscroll-none`}>{children}
       <Toaster richColors position="top-center" />
      </body>
    </html>
  );
}
