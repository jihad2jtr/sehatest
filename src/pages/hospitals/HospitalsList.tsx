
import React from "react";
import { useQuery } from "@tanstack/react-query";
import { hospitalAPI } from "@/services/api";
import Layout from "@/components/Layout";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Edit, Trash2, Loader2, Building } from "lucide-react";
import { useToast } from "@/components/ui/use-toast";
import { Link } from "react-router-dom";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { useIsMobile } from "@/hooks/use-mobile";

const HospitalsList = () => {
  const { toast } = useToast();
  const isMobile = useIsMobile();
  
  const { data: hospitals = [], isLoading, refetch } = useQuery({
    queryKey: ["hospitals"],
    queryFn: hospitalAPI.getAll,
  });

  // Handle hospital deletion
  const handleDelete = async (hospitalId: string) => {
    if (confirm("هل تريد حذف بيانات المستشفى؟")) {
      try {
        await hospitalAPI.delete(hospitalId);
        toast({
          title: "تم الحذف بنجاح",
          description: "تم حذف بيانات المستشفى بنجاح",
        });
        refetch();
      } catch (error) {
        console.error("Error deleting hospital:", error);
        toast({
          title: "خطأ في الحذف",
          description: "لم يتم حذف البيانات، يرجى المحاولة مرة أخرى",
          variant: "destructive",
        });
      }
    }
  };

  if (isLoading) {
    return (
      <Layout>
        <div className="flex flex-col items-center justify-center h-64">
          <Loader2 className="h-8 w-8 animate-spin text-medical" />
          <p className="mt-4 text-lg">جاري تحميل البيانات...</p>
        </div>
      </Layout>
    );
  }

  // Responsive table for mobile
  const renderMobileView = () => (
    <div className="space-y-4">
      {hospitals.map((hospital, index) => (
        <Card key={hospital._id} className="overflow-hidden">
          <CardHeader className="p-4 pb-2">
            <CardTitle className="text-lg font-medium">{hospital.input_central_name_ar}</CardTitle>
          </CardHeader>
          <CardContent className="p-4 pt-0">
            <div className="space-y-2 text-sm">
              <p><span className="font-medium">النوع:</span> {hospital.input_central_type}</p>
              <p><span className="font-medium">الاسم (إنجليزي):</span> {hospital.input_central_name_en}</p>
              <p><span className="font-medium">رقم الترخيص:</span> {hospital.input_central_id}</p>
              <p><span className="font-medium">الموقع:</span> {hospital.input_central_location}</p>
              <p><span className="font-medium">رقم المستشفى:</span> {hospital.input_central_doctor_num}</p>
              
              <div className="flex space-x-2 rtl:space-x-reverse pt-2">
                <Link to={`/hospitals/edit/${hospital._id}`} className="flex-1">
                  <Button className="btn-edit w-full">
                    <Edit className="h-4 w-4 ml-2" />
                    تعديل
                  </Button>
                </Link>
                <Button 
                  className="btn-delete flex-1"
                  onClick={() => handleDelete(hospital._id)}
                >
                  <Trash2 className="h-4 w-4 ml-2" />
                  حذف
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );

  // Desktop view with table
  const renderDesktopView = () => (
    <div className="overflow-x-auto">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className="w-10 text-right">#</TableHead>
            <TableHead className="text-right">النوع</TableHead>
            <TableHead className="text-right">الاسم (عربي)</TableHead>
            <TableHead className="text-right">الاسم (إنجليزي)</TableHead>
            <TableHead className="text-right">رقم الترخيص</TableHead>
            <TableHead className="text-right">الموقع</TableHead>
            <TableHead className="text-right">رقم المستشفى</TableHead>
            <TableHead className="text-right w-[150px]">الإجراءات</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {hospitals.map((hospital, index) => (
            <TableRow key={hospital._id}>
              <TableCell className="font-medium">{index + 1}</TableCell>
              <TableCell>{hospital.input_central_type}</TableCell>
              <TableCell>{hospital.input_central_name_ar}</TableCell>
              <TableCell>{hospital.input_central_name_en}</TableCell>
              <TableCell>{hospital.input_central_id}</TableCell>
              <TableCell>{hospital.input_central_location}</TableCell>
              <TableCell>{hospital.input_central_doctor_num}</TableCell>
              <TableCell>
                <div className="flex space-x-2 rtl:space-x-reverse">
                  <Link to={`/hospitals/edit/${hospital._id}`}>
                    <Button className="btn-edit">
                      <Edit className="h-4 w-4" />
                    </Button>
                  </Link>
                  <Button 
                    className="btn-delete"
                    onClick={() => handleDelete(hospital._id)}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );

  return (
    <Layout>
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle className="flex items-center">
            <Building className="mr-2 h-5 w-5" />
            قائمة المستشفيات
          </CardTitle>
          <Link to="/hospitals/add">
            <Button className="btn-medical">إضافة مستشفى</Button>
          </Link>
        </CardHeader>
        <CardContent>
          {isMobile ? renderMobileView() : renderDesktopView()}
        </CardContent>
      </Card>
    </Layout>
  );
};

export default HospitalsList;
