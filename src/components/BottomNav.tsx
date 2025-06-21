
import React from "react";
import { Link, useLocation } from "react-router-dom";
import { User, Hospital, UserPlus, Flag, Settings, Home } from "lucide-react";

const BottomNav: React.FC = () => {
  const location = useLocation();
  
  const isActive = (path: string) => {
    return location.pathname === path || location.pathname.startsWith(path + "/");
  };

  return (
    <div className="fixed bottom-0 left-0 right-0 h-16 bg-white shadow-[0_-1px_3px_rgba(0,0,0,0.1)] dark:bg-gray-800 dark:shadow-gray-700/20 z-50">
      <div className="grid grid-cols-6 h-full">
        <NavItem 
          to="/" 
          icon={<Home size={20} />} 
          label="الرئيسية" 
          isActive={isActive("/")} 
        />
        <NavItem 
          to="/patients/add" 
          icon={<UserPlus size={20} />} 
          label="إضافة مريض" 
          isActive={isActive("/patients/add")} 
        />
        <NavItem 
          to="/patients" 
          icon={<User size={20} />} 
          label="المرضى" 
          isActive={isActive("/patients")} 
        />
        <NavItem 
          to="/hospitals" 
          icon={<Hospital size={20} />} 
          label="المستشفيات" 
          isActive={isActive("/hospitals")} 
        />
        <NavItem 
          to="/doctors" 
          icon={<UserPlus size={20} />} 
          label="الأطباء" 
          isActive={isActive("/doctors")} 
        />
        <NavItem 
          to="/settings" 
          icon={<Settings size={20} />} 
          label="الإعدادات" 
          isActive={isActive("/settings")} 
        />
      </div>
    </div>
  );
};

interface NavItemProps {
  to: string;
  icon: React.ReactNode;
  label: string;
  isActive: boolean;
}

const NavItem: React.FC<NavItemProps> = ({ to, icon, label, isActive }) => {
  return (
    <Link 
      to={to} 
      className={`flex flex-col items-center justify-center h-full ${
        isActive ? "text-medical dark:text-medical-light" : "text-gray-500 dark:text-gray-400"
      }`}
    >
      <div className="mb-1">{icon}</div>
      <span className="text-xs font-medium">{label}</span>
    </Link>
  );
};

export default BottomNav;
