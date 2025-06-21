
import React from "react";
import { useQuery } from "@tanstack/react-query";
import { nationalityAPI } from "@/services/api";
import Layout from "@/components/Layout";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Edit, Trash2, Loader2, Flag } from "lucide-react";
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

const NationalitiesList = () => {
  const { toast } = useToast();
  
  const { data: nationalities = [], isLoading, refetch } = useQuery({
    queryKey: ["nationalities"],
    queryFn: nationalityAPI.getAll,
  });

  // Handle nationality deletion
  const handleDelete = async (nationalityId: string) => {
    if (confirm("هل تريد حذف بيانات الجنسية؟")) {
      try {
        await nationalityAPI.delete(nationalityId);
        toast({
          title: "تم الحذف بنجاح",
          description: "تم حذف بيانات الجنسية بنجاح",
        });
        refetch();
      } catch (error) {
        console.error("Error deleting nationality:", error);
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

  return (
    <Layout>
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle className="flex items-center">
            <Flag className="mr-2 h-5 w-5" />
            قائمة الجنسيات
          </CardTitle>
          <Link to="/nationalities/add">
            <Button className="btn-medical">إضافة جنسية</Button>
          </Link>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-10 text-right">#</TableHead>
                  <TableHead className="text-right">الاسم (عربي)</TableHead>
                  <TableHead className="text-right">الاسم (إنجليزي)</TableHead>
                  <TableHead className="text-right w-[150px]">الإجراءات</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {nationalities.map((nationality, index) => (
                  <TableRow key={nationality._id}>
                    <TableCell className="font-medium">{index + 1}</TableCell>
                    <TableCell>{nationality.input_national_ar}</TableCell>
                    <TableCell>{nationality.input_national_en}</TableCell>
                    <TableCell>
                      <div className="flex space-x-2 rtl:space-x-reverse">
                        <Link to={`/nationalities/edit/${nationality._id}`}>
                          <Button className="btn-edit">
                            <Edit className="h-4 w-4" />
                          </Button>
                        </Link>
                        <Button 
                          className="btn-delete"
                          onClick={() => handleDelete(nationality._id)}
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
        </CardContent>
      </Card>
    </Layout>
  );
};

export default NationalitiesList;
