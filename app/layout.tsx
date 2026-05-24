import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "KETIC",
  description: "Hotel room energy waste, measured.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="dark">
      <body className="bg-bg-base text-text-primary antialiased">
        {children}
      </body>
    </html>
  );
}
