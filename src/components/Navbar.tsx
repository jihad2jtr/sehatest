
import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Search, X, Menu, ChevronLeft, Globe } from "lucide-react";
import ThemeToggle from "./ThemeToggle";

const Navbar: React.FC = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const navigate = useNavigate();

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/search/${searchQuery}`);
      setIsSearchOpen(false);
    }
  };

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  const toggleSearch = () => {
    setIsSearchOpen(!isSearchOpen);
  };

  return (
    <nav className="bg-white shadow-sm dark:bg-gray-800 dark:shadow-gray-700/10">
      {/* Main Header */}
      {!isSearchOpen ? (
        <div className="container mx-auto px-4 py-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <Link to="/" className="font-bold text-medical text-lg dark:text-medical-light">
                نظام صحة V4.1
              </Link>
            </div>

            <div className="flex items-center space-x-4 rtl:space-x-reverse">
              <button 
                onClick={toggleSearch} 
                className="text-gray-500 focus:outline-none dark:text-gray-300"
                aria-label="البحث"
              >
                <Search size={20} />
              </button>
              
              <ThemeToggle />
              
              <button
                className="text-gray-500 focus:outline-none dark:text-gray-300"
                aria-label="تغيير اللغة"
              >
                <Globe size={20} />
              </button>
            </div>
          </div>
        </div>
      ) : (
        // Search Header
        <div className="container mx-auto px-4 py-2">
          <form onSubmit={handleSearch} className="flex items-center">
            <button 
              type="button" 
              onClick={toggleSearch} 
              className="mr-2 text-gray-500 focus:outline-none dark:text-gray-300"
              aria-label="العودة"
            >
              <ChevronLeft size={20} />
            </button>
            
            <Input
              type="text"
              placeholder="الإجازة أو الهوية"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="flex-1 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
              autoFocus
            />
            
            <Button 
              type="submit" 
              variant="ghost" 
              size="icon" 
              className="ml-2 dark:text-gray-300"
              aria-label="بحث"
            >
              <Search size={20} />
            </Button>
          </form>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
