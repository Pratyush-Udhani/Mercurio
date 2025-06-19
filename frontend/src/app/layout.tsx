import type { Metadata } from "next";
import { Roboto, Roboto_Mono } from "next/font/google";
import { ThemeProvider } from "next-themes";
import "./globals.css";

const robotoSans = Roboto({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const robotoMono = Roboto_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Mercurio",
  description: "Use AI to create ads",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${robotoSans.variable} ${robotoMono.variable} antialiased`}
      >
        <ThemeProvider
          attribute="class"
          defaultTheme="dark"
          enableSystem={false}
        >
          <div className="flex flex-col">
            <div className="min-h-[5vh] bg-cyan-500 w-full p-2">
              <span className="p-5 text-3xl">MERCURIO</span>
            </div>
            <div>{children}</div>
          </div>
        </ThemeProvider>
      </body>
    </html>
  );
}
