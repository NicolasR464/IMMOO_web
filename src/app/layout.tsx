import './globals.css';
import Image from 'next/image';
import { ExternalLink } from 'lucide-react';

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning className="h-full dark">
      <body
        suppressHydrationWarning
        className="min-h-screen bg-slate-950 text-slate-100 font-sans antialiased flex flex-col"
      >
        {/* SVG Filter to bring out cyan/indigo tones from dark navy logo */}
        <svg className="hidden">
          <filter id="logo-color-shift">
            <feColorMatrix
              type="matrix"
              values="
                1.5  0    0    0   0.2
                0.2  1.8  0    0   0.4
                0.5  0.8  2.2  0   0.8
                0    0    0    1   0
              "
            />
          </filter>
        </svg>

        <header className="w-full border-b border-slate-800/80 bg-slate-950 sticky top-0 z-50">
          <div className="w-full px-6 sm:px-10 py-3.5 flex items-center justify-between">
            {/* Logo on far left */}
            <div className="flex items-center">
              <Image
                src="/logo_immoo_main.png"
                alt="IMMOO Logo"
                width={280}
                height={70}
                className="h-10 sm:h-12 w-auto object-contain [filter:url(#logo-color-shift)] drop-shadow-[0_0_10px_rgba(99,102,241,0.4)]"
                priority
              />
            </div>

            {/* Google Sheet Action */}
            <a
              href="https://docs.google.com/spreadsheets"
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center gap-2 text-xs font-semibold text-emerald-400 bg-emerald-950/40 border border-emerald-800/80 px-4 py-2 rounded-full hover:bg-emerald-900/50 transition cursor-pointer"
            >
              Google Sheet <ExternalLink size={13} />
            </a>
          </div>
        </header>

        <main className="flex-1 bg-slate-950">{children}</main>
      </body>
    </html>
  );
}