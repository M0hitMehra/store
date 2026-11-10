import { Inter } from "next/font/google";
import "./globals.css";
import Navbar from "@/components/navbar";
import Footer from "@/components/footer";
import { Toaster } from "@/components/ui/toaster";
import { AuthProvider } from "@/context/authContext";

const inter = Inter({ subsets: ["latin"] });

export const metadata = {
  title: "ATELIER • Contemporary Footwear & Apparel",
  description: "Curated luxury footwear, minimalist silhouettes, and designer essentials.",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className={`${inter.className} min-h-screen flex flex-col bg-[#fafafa] text-neutral-900 antialiased`}>
        <AuthProvider>
          <Navbar />
          <main className="flex-1 pt-16 sm:pt-20 w-full">
            {children}
          </main>
          <Footer />
          <Toaster />
        </AuthProvider>
      </body>
    </html>
  );
}
