import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { AuthProvider } from "@/contexts/AuthContext";
import { NotificationProvider } from "@/contexts/NotificationContext";
import { Toaster } from "sonner";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "West End Workforce - Timesheet & Expense Management",
  description: "Professional timesheet and expense tracking system for West End Workforce staffing company",
  keywords: ["timesheet", "expense tracking", "workforce management", "staffing"],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased bg-gray-50`}
      >
        <AuthProvider>
          <NotificationProvider>
            {children}
            <Toaster 
              position="top-right"
              toastOptions={{
                style: {
                  background: '#05202E',
                  color: '#e5ddd8',
                  border: '1px solid #465079',
                },
              }}
            />
          </NotificationProvider>
        </AuthProvider>
      </body>
    </html>
  );
}
