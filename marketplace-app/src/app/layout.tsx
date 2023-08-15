import "./globals.css";
import type { Metadata } from "next";
import { Inter } from "next/font/google";
import Navbar from "@/components/navbar";
import { ThirdwebProvider } from "@/components/ThirdWebProvider";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Web Weaver",
  description: "",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <ThirdwebProvider
          activeChain="localhost"
          clientId={process.env.THIRDWEB_CLIENT_ID}
        >
          <Navbar />
          <div className="min-h-screen">{children}</div>
        </ThirdwebProvider>
      </body>
    </html>
  );
}
