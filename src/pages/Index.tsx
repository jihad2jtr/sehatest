
import React from "react";
import Layout from "@/components/Layout";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { User, Hospital, UserPlus, Users, Flag, FileText, Settings, ArrowRight } from "lucide-react";
import { Link } from "react-router-dom";

const Index = () => {
  return (
    <Layout>
      <div className="text-center mb-6">
        <h1 className="text-2xl font-bold mb-1">Seha System By Abdulluh</h1>
        <p className="text-sm text-gray-600">إدارة بيانات المرضى والمستشفيات والأطباء</p>
      </div>

      <div className="space-y-4">
        <MenuItem 
          to="/patients/add"
          icon={<UserPlus className="text-medical" />}
          title="إضافة مريض جديد"
          description="إدخال بيانات مريض جديد في النظام"
        />

        <MenuItem 
          to="/patients/recent"
          icon={<User className="text-blue-500" />}
          title="آخر 20 ملف"
          description="عرض آخر 20 ملف تم إدخالهم"
        />

        <MenuItem 
          to="/patients"
          icon={<Users className="text-indigo-500" />}
          title="آخر 100 ملف"
          description="عرض آخر 100 ملف في النظام"
        />

        <MenuItem 
          to="/hospitals"
          icon={<Hospital className="text-green-500" />}
          title="المستشفيات"
          description="إدارة وعرض المستشفيات"
        />

        <MenuItem 
          to="/doctors"
          icon={<UserPlus className="text-purple-500" />}
          title="الأطباء"
          description="إدارة وعرض الأطباء"
        />

        <MenuItem 
          to="/nationalities"
          icon={<Flag className="text-orange-500" />}
          title="الجنسيات"
          description="إدارة وعرض الجنسيات"
        />

        <MenuItem 
          to="/settings"
          icon={<Settings className="text-gray-500" />}
          title="الإعدادات"
          description="إعدادات النظام"
        />
      </div>
    </Layout>
  );
};

interface MenuItemProps {
  to: string;
  icon: React.ReactNode;
  title: string;
  description: string;
}

const MenuItem: React.FC<MenuItemProps> = ({ to, icon, title, description }) => {
  return (
    <Link to={to}>
      <Card className="hover:shadow-md transition-shadow">
        <CardContent className="p-4 flex items-center">
          <div className="h-10 w-10 rounded-full bg-gray-50 flex items-center justify-center mr-4">
            {icon}
          </div>
          <div className="flex-1">
            <h3 className="font-medium text-base">{title}</h3>
            <p className="text-gray-500 text-sm">{description}</p>
          </div>
          <ArrowRight className="h-5 w-5 text-gray-400" />
        </CardContent>
      </Card>
    </Link>
  );
};

export default Index;
