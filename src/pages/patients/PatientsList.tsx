
import React, { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { patientAPI } from "@/services/api";
import Layout from "@/components/Layout";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { FileText, FilePen, Trash2, Loader2, Download } from "lucide-react";
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
import { REPORT_TYPES, SICKLEAVE_TYPE_NAMES, SICKLEAVE_TYPE_MAP } from "@/constants/reportTypes";
import DownloadProgress from "@/components/DownloadProgress";
import PatientActionButtons from "@/components/patients/PatientActionButtons";
import PatientCard from "@/components/patients/PatientCard";
import PatientsTable from "@/components/patients/PatientsTable";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

interface PatientsListProps {
  limit?: number;
}
 
const PatientsList: React.FC<PatientsListProps> = ({ limit }) => {
  const { toast } = useToast();
  const [downloadState, setDownloadState] = useState({
    isDownloading: false,
    progress: 0,
    fileUrl: null as string | null,
    fileName: "",
    reportType: ""
  });
  
  // Fetch patients data
  const { data: patients = [], isLoading: isLoadingPatients, refetch } = useQuery({
    queryKey: ["patients", limit],
    queryFn: () => limit ? patientAPI.getRecent(limit) : patientAPI.getAll(),
  });

  // Handle generating reports with progress
  const handleGenerateReport = async (patientId: string, reportType: string, reportName: string) => {
    try {
      setDownloadState({
        isDownloading: true,
        progress: 0,
        fileUrl: null,
        fileName: "sickleaves.pdf",
        reportType
      });

      const result = await patientAPI.generateReport(
        patientId, 
        reportType,
        (progress) => {
          setDownloadState(prev => ({
            ...prev,
            progress
          }));
        }
      );

      if (result) {
        // Temporary fix: Store in localStorage
        if (result.url) {
          localStorage.setItem("SickLeaves", result.url);
        }

        setDownloadState(prev => ({
          ...prev,
          progress: 100,
          fileUrl: result.url,
          fileName: result.filename
        }));
      }
    } catch (error) {
      console.error(`Error generating ${reportType} report:`, error);
      toast({
        title: "خطأ في إنشاء التقرير",
        description: "لم يتم إنشاء التقرير بنجاح، يرجى المحاولة مرة أخرى",
        variant: "destructive",
      });
      setDownloadState(prev => ({
        ...prev,
        isDownloading: false
      }));
    }
  };

  const closeDownloadDialog = () => {
    if (downloadState.fileUrl) {
      URL.revokeObjectURL(downloadState.fileUrl);
    }
    setDownloadState({
      isDownloading: false,
      progress: 0,
      fileUrl: null,
      fileName: "",
      reportType: ""
    });
  };

  // Handle patient deletion
  const handleDelete = async (patientId: string) => {
    if (confirm("هل تريد حذف بيانات المريض؟")) {
      try {
        await patientAPI.delete(patientId);
        toast({
          title: "تم الحذف بنجاح",
          description: "تم حذف بيانات المريض بنجاح",
        });
        refetch();
      } catch (error) {
        console.error("Error deleting patient:", error);
        toast({
          title: "خطأ في الحذف",
          description: "لم يتم حذف البيانات، يرجى المحاولة مرة أخرى",
          variant: "destructive",
        });
      }
    }
  };

  if (isLoadingPatients) {
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
          <CardTitle>
            {limit ? `آخر ${limit} ملف` : "قائمة المرضى"}
          </CardTitle>
          <Link to="/patients/add">
            <Button className="btn-medical">إضافة مريض</Button>
          </Link>
        </CardHeader>
        <CardContent>
          {limit && limit <= 20 ? (
            // Display cards view for the recent patients (20 or less)
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
              {patients.map((patient) => (
                <PatientCard 
                  key={patient._id}
                  patient={patient}
                  onGenerateReport={handleGenerateReport}
                  onEdit={() => {}} 
                  onDelete={() => handleDelete(patient._id)}
                />
              ))}
            </div>
          ) : (
            // Display table view for all patients
            <Tabs defaultValue="table">
              <TabsList className="mb-4">
                <TabsTrigger value="table">جدول</TabsTrigger>
                <TabsTrigger value="cards">بطاقات</TabsTrigger>
              </TabsList>
              
              <TabsContent value="table">
                <PatientsTable 
                  patients={patients}
                  reportTypes={REPORT_TYPES}
                  onGenerateReport={handleGenerateReport}
                  onDelete={handleDelete}
                />
              </TabsContent>
              
              <TabsContent value="cards">
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                  {patients.map((patient) => (
                    <PatientCard 
                      key={patient._id}
                      patient={patient}
                      onGenerateReport={handleGenerateReport}
                      onEdit={() => {}} 
                      onDelete={() => handleDelete(patient._id)}
                    />
                  ))}
                </div>
              </TabsContent>
            </Tabs>
          )}
        </CardContent>
      </Card>

      {/* Download Progress Dialog */}
      <DownloadProgress
        open={downloadState.isDownloading}
        progress={downloadState.progress}
        fileName={downloadState.fileName}
        fileUrl={downloadState.fileUrl}
        onClose={closeDownloadDialog}
      />
    </Layout>
  );
};

export default PatientsList;
