
import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useToast } from "@/components/ui/use-toast";
import { hospitalAPI } from "@/services/api";
import { useQuery } from "@tanstack/react-query";
import Layout from "@/components/Layout";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Loader2, Save } from "lucide-react";

const AddHospital = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { toast } = useToast();
  const isEditMode = !!id;

  const [formData, setFormData] = useState({
    input_central_type: "",
    input_central_name_ar: "",
    input_central_name_en: "",
    input_central_id: "",
    input_central_logo: "",
    input_central_location: "",
    input_central_doctor_num: ""
  });

  // Fetch hospital data if in edit mode
  const { data: hospitalData, isLoading } = useQuery({
    queryKey: ["hospital", id],
    queryFn: () => id ? hospitalAPI.getById(id) : Promise.resolve(null),
    enabled: isEditMode
  });

  // Update form when hospital data is loaded
  useEffect(() => {
    if (hospitalData) {
      setFormData({
        input_central_type: hospitalData.input_central_type || "",
        input_central_name_ar: hospitalData.input_central_name_ar || "",
        input_central_name_en: hospitalData.input_central_name_en || "",
        input_central_id: hospitalData.input_central_id || "",
        input_central_logo: hospitalData.input_central_logo || "",
        input_central_location: hospitalData.input_central_location || "",
        input_central_doctor_num: hospitalData.input_central_doctor_num || ""
      });
    }
  }, [hospitalData]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (isEditMode && id) {
        await hospitalAPI.update(id, formData);
        toast({
          title: "تم التعديل بنجاح",
          description: "تم تعديل بيانات المستشفى بنجاح"
        });
      } else {
        await hospitalAPI.create(formData);
        toast({
          title: "تمت الإضافة بنجاح",
          description: "تم إضافة المستشفى بنجاح"
        });
      }
      navigate("/hospitals");
    } catch (error) {
      console.error("Error saving hospital:", error);
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
          <CardTitle>{isEditMode ? "تعديل بيانات المستشفى" : "إضافة مستشفى جديد"}</CardTitle>
          <CardDescription>
            {isEditMode 
              ? "قم بتعديل بيانات المستشفى ثم انقر على زر تعديل"
              : "أدخل بيانات المستشفى الجديد ثم انقر على زر إضافة"
            }
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="input-group">
                <Label htmlFor="input_central_type">gsl (نوع المستشفى)</Label>
                <Input
                  id="input_central_type"
                  name="input_central_type"
                  value={formData.input_central_type}
                  onChange={handleChange}
                  placeholder="نوع المستشفى"
                  required
                />
              </div>

              <div className="input-group">
                <Label htmlFor="input_central_name_ar">اسم المركز</Label>
                <Input
                  id="input_central_name_ar"
                  name="input_central_name_ar"
                  value={formData.input_central_name_ar}
                  onChange={handleChange}
                  placeholder="اسم المركز"
                  required
                />
              </div>

              <div className="input-group">
                <Label htmlFor="input_central_name_en">Central Name En</Label>
                <Input
                  id="input_central_name_en"
                  name="input_central_name_en"
                  value={formData.input_central_name_en}
                  onChange={handleChange}
                  placeholder="Central Name En"
                  required
                />
              </div>

              <div className="input-group">
                <Label htmlFor="input_central_id">Central Id (رقم الترخيص)</Label>
                <Input
                  id="input_central_id"
                  name="input_central_id"
                  value={formData.input_central_id}
                  onChange={handleChange}
                  placeholder="رقم الترخيص"
                  required
                />
              </div>

              <div className="input-group">
                <Label htmlFor="input_central_logo">Logo Base64</Label>
                <Input
                  id="input_central_logo"
                  name="input_central_logo"
                  value={formData.input_central_logo}
                  onChange={handleChange}
                  placeholder="رابط الشعار (Base64)"
                  required
                />
              </div>

              <div className="input-group">
                <Label htmlFor="input_central_location">الموقع</Label>
                <Input
                  id="input_central_location"
                  name="input_central_location"
                  value={formData.input_central_location}
                  onChange={handleChange}
                  placeholder="موقع المستشفى"
                  required
                />
              </div>

              <div className="input-group">
                <Label htmlFor="input_central_doctor_num">رقم الطبيب</Label>
                <Input
                  id="input_central_doctor_num"
                  name="input_central_doctor_num"
                  value={formData.input_central_doctor_num}
                  onChange={handleChange}
                  placeholder="رقم الطبيب"
                  required
                />
              </div>
            </div>

            <div className="flex justify-end">
              <Button type="submit" className="btn-medical">
                <Save className="mr-2 h-4 w-4" />
                {isEditMode ? "تعديل البيانات" : "إضافة مستشفى"}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </Layout>
  );
};

export default AddHospital;
