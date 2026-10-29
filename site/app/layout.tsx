import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: 'Pharma 360 | Smarter pharmacy operations',
  description: 'Pharma 360 brings sales, stock, people, and possibilities into one calm, connected pharmacy management platform.',
  icons: { icon: '/logo.png' },
  openGraph: {
    title: 'Pharma 360 | Smarter pharmacy operations',
    description: 'The complete pharmacy management platform for modern pharmacy teams.',
    images: ['/logo.png'],
  },
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col">{children}</body>
    </html>
  );
}
