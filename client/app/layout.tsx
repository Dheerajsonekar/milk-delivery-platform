import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import DynamicNavbar from '@/components/DynamicNavbar'
import Footer from "@/components/Footer";
import { AuthProvider } from "@/context/auth-context";
import { CartProvider } from "@/context/cart-context";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "MilkApp",
  description: "Milk & Fresh Product Delivery Platform",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} flex flex-col min-h-screen`}
      >
        <AuthProvider>
          <CartProvider>
          <DynamicNavbar />
          <main className="flex-grow">{children}</main>
          <Footer />
          </CartProvider>
        </AuthProvider>

      </body>
    </html>
  );
}
