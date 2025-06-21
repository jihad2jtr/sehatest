
import React, { useState } from "react";
import { useToast } from "@/components/ui/use-toast";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useNavigate } from "react-router-dom";
import { nationalityAPI } from "@/services/api";
import Layout from "@/components/Layout";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Flag } from "lucide-react";

const AddNationality = () => {
  const navigate = useNavigate();
  const { toast } = useToast();

  // Nationality form state
  const [nationalityData, setNationalityData] = useState({
    input_national_ar: "",
    input_national_en: ""
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setNationalityData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      await nationalityAPI.create(nationalityData);
      
      toast({
        title: "تمت الإضافة بنجاح",
        description: "تم إضافة بيانات الجنسية بنجاح",
      });
      
      navigate("/nationalities");
    } catch (error) {
      console.error("Error adding nationality:", error);
      toast({
        title: "حدث خطأ",
        description: "لم يتم إضافة البيانات. يرجى المحاولة مرة أخرى.",
        variant: "destructive",
      });
    }
  };

  return (
    <Layout>
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <Flag className="mr-2 h-5 w-5" />
            إضافة جنسية جديدة
          </CardTitle>
          <CardDescription>أدخل بيانات الجنسية لإضافتها إلى النظام</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* اسم الجنسية عربي */}
              <div className="input-group">
                <Label htmlFor="input_national_ar">الجنسية بالعربية</Label>
                <Input
                  id="input_national_ar"
                  name="input_national_ar"
                  value={nationalityData.input_national_ar}
                  onChange={handleChange}
                  placeholder="الجنسية باللغة العربية"
                  required
                />
              </div>

              {/* اسم الجنسية انجليزي */}
              <div className="input-group">
                <Label htmlFor="input_national_en">الجنسية بالإنجليزية</Label>
                <Input
                  id="input_national_en"
                  name="input_national_en"
                  value={nationalityData.input_national_en}
                  onChange={handleChange}
                  placeholder="Nationality in English"
                  required
                />
              </div>
            </div>

            <div className="flex justify-end">
              <Button type="submit" className="btn-medical">إضافة الجنسية</Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </Layout>
  );
};

export default AddNationality;
