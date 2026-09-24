import './globals.css';
import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import { ThemeProvider } from '@/components/theme-provider';
import { Sidebar } from '@/components/sidebar';
import { ThemeToggle } from '@/components/theme-toggle';
import { Toaster } from '@/components/ui/sonner';

const inter = Inter({ subsets: ['latin', 'vietnamese'] });

export const metadata: Metadata = {
  title: 'Chủng Sinh Study Planner',
  description: 'Ứng dụng quản lý thời gian và kế hoạch tự học cá nhân',
  manifest: '/manifest.json',
};

export const viewport = {
  themeColor: '#3b82f6',
  width: 'device-width',
  initialScale: 1,
  maximumScale: 1,
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="vi" suppressHydrationWarning>
      <body className={inter.className} suppressHydrationWarning>
        <ThemeProvider>
          <div className="min-h-screen bg-background">
            <Sidebar />
            <div className="lg:pl-64">
              <div className="flex items-center justify-end border-b border-border bg-background/80 px-4 py-3 backdrop-blur-sm lg:px-8 mt-14 lg:mt-0">
                <ThemeToggle />
              </div>
              <main className="p-4 lg:p-8">{children}</main>
            </div>
          </div>
          <Toaster position="top-right" />
        </ThemeProvider>
      </body>
    </html>
  );
}
