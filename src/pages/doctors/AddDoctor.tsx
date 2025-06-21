
import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useToast } from "@/components/ui/use-toast";
import { doctorAPI } from "@/services/api";
import { useQuery } from "@tanstack/react-query";
import Layout from "@/components/Layout";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Loader2, Save } from "lucide-react";

const AddDoctor = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { toast } = useToast();
  const isEditMode = !!id;

  const [formData, setFormData] = useState({
    input_doctor_name_ar: "",
    input_doctor_name_En: "",
    input_doctor_type_ar: "",
    input_doctor_type_En: "",
    input_doctor_num: ""
  });

  // Fetch doctor data if in edit mode
  const { data: doctorData, isLoading } = useQuery({
    queryKey: ["doctor", id],
    queryFn: () => id ? doctorAPI.getById(id) : Promise.resolve(null),
    enabled: isEditMode
  });

  // Update form when doctor data is loaded
  useEffect(() => {
    if (doctorData) {
      setFormData({
        input_doctor_name_ar: doctorData.input_doctor_name_ar || "",
        input_doctor_name_En: doctorData.input_doctor_name_En || "",
        input_doctor_type_ar: doctorData.input_doctor_type_ar || "",
        input_doctor_type_En: doctorData.input_doctor_type_En || "",
        input_doctor_num: doctorData.input_doctor_num || ""
      });
    }
  }, [doctorData]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (isEditMode && id) {
        await doctorAPI.update(id, formData);
        toast({
          title: "تم التعديل بنجاح",
          description: "تم تعديل بيانات الطبيب بنجاح"
        });
      } else {
        await doctorAPI.create(formData);
        toast({
          title: "تمت الإضافة بنجاح",
          description: "تم إضافة الطبيب بنجاح"
        });
      }
      navigate("/doctors");
    } catch (error) {
      console.error("Error saving doctor:", error);
      toast({
        title: "حدث خطأ",
        description: "لم يتم حفظ البيانات، يرجى المحاولة مرة أخرى",
        variant: "destructive"
      });
    }
  };

  if (isLoading && isEditMode) {
    return (
      <Layout>
        <div className="flex items-center justify-center h-64">
          <Loader2 className="h-8 w-8 animate-spin text-medical" />
          <p className="mr-2">جاري تحميل البيانات...</p>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <Card>
        <CardHeader>
          <CardTitle>{isEditMode ? "تعديل بيانات الطبيب" : "إضافة طبيب جديد"}</CardTitle>
          <CardDescription>
            {isEditMode 
              ? "قم بتعديل بيانات الطبيب ثم انقر على زر تعديل"
              : "أدخل بيانات الطبيب الجديد ثم انقر على زر إضافة"
            }
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="input-group">
                <Label htmlFor="input_doctor_name_ar">اسم الطبيب</Label>
                <Input
                  id="input_doctor_name_ar"
                  name="input_doctor_name_ar"
                  value={formData.input_doctor_name_ar}
                  onChange={handleChange}
                  placeholder="اسم الطبيب"
                  required
                />
              </div>

              <div className="input-group">
                <Label htmlFor="input_doctor_name_En">Doctor Name En</Label>
                <Input
                  id="input_doctor_name_En"
                  name="input_doctor_name_En"
                  value={formData.input_doctor_name_En}
                  onChange={handleChange}
                  placeholder="Doctor Name En"
                  required
                />
              </div>

              <div className="input-group">
                <Label htmlFor="input_doctor_type_ar">نوع الطبيب</Label>
                <Input
                  id="input_doctor_type_ar"
                  name="input_doctor_type_ar"
                  value={formData.input_doctor_type_ar}
                  onChange={handleChange}
                  placeholder="نوع الطبيب"
                  required
                />
              </div>

              <div className="input-group">
                <Label htmlFor="input_doctor_type_En">Doctor Type En</Label>
                <Input
                  id="input_doctor_type_En"
                  name="input_doctor_type_En"
                  value={formData.input_doctor_type_En}
                  onChange={handleChange}
                  placeholder="Doctor Type En"
                  required
                />
              </div>

              <div className="input-group">
                <Label htmlFor="input_doctor_num">رقم الطبيب</Label>
                <Input
                  id="input_doctor_num"
                  name="input_doctor_num"
                  value={formData.input_doctor_num}
                  onChange={handleChange}
                  placeholder="رقم الطبيب"
                  required
                />
              </div>
            </div>

            <div className="flex justify-end">
              <Button type="submit" className="btn-medical">
                <Save className="mr-2 h-4 w-4" />
                {isEditMode ? "تعديل البيانات" : "إضافة طبيب"}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </Layout>
  );
};

export default AddDoctor;
