
import React, { ReactNode } from "react";
import Navbar from "./Navbar";
import BottomNav from "./BottomNav";
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";

interface LayoutProps {
  children: ReactNode;
}

const Layout: React.FC<LayoutProps> = ({ children }) => {
  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex flex-col">
      <Navbar />
      <main className="container py-4 px-4 md:px-6 flex-1 mb-16 dark:text-gray-100">
        {children}
      </main>
      <BottomNav />
      <Toaster />
      <Sonner />
    </div>
  );
};

export default Layout;
