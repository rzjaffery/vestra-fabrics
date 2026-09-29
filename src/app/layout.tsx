import type { Metadata } from "next";
import { Inter, Oxanium, Geist } from "next/font/google";
import "./globals.css";
import { ThemeProvider } from "@/components/global/theme-provider";
import { cn } from "@/lib/utils";
import {Navbar} from "@/components/global/navbar";

const geistHeading = Geist({subsets:['latin'],variable:'--font-heading'});

const oxanium = Oxanium({subsets:['latin'],variable:'--font-sans'});

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Vestra Fabric | Premium Textiles",
  description: "Minimalist textile and luxury fabric e-commerce platform.",
};

export default function RootLayout({
                                     children,
                                   }: Readonly<{
  children: React.ReactNode;
}>) {
  return (
      <html lang="en" suppressHydrationWarning className={cn("font-sans", oxanium.variable, geistHeading.variable)}>
      <body className={inter.className}>
      <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
      >
          <Navbar/>
        {children}
      </ThemeProvider>
      </body>
      </html>
  );
}