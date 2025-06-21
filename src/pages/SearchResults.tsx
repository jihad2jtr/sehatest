
import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { useToast } from "@/hooks/use-toast";
import { useQuery } from "@tanstack/react-query";
import { patientAPI } from "@/services/api";
import Layout from "@/components/Layout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Loader2, Search } from "lucide-react";
import { REPORT_TYPES } from "@/constants/reportTypes";
import DownloadProgress from "@/components/DownloadProgress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import PatientsTable from "@/components/patients/PatientsTable";
import PatientCard from "@/components/patients/PatientCard";

const SearchResults = () => {
  const { query } = useParams<{ query: string }>();
  const { toast } = useToast();
  const [downloadState, setDownloadState] = useState({
    isDownloading: false,
    progress: 0,
    fileUrl: null as string | null,
    fileName: "",
    reportType: ""
  });
  
  const { data: searchResults = [], isLoading, error, refetch } = useQuery({
    queryKey: ["search", query],
    queryFn: async () => {
      console.log("Searching for:", query);
      if (!query) return [];
      
      try {
        const results = await patientAPI.search(query);
        console.log("Search results received:", results);
        return results;
      } catch (err) {
        console.error("Search error:", err);
        throw err;
      }
    },
    enabled: !!query,
  });

  useEffect(() => {
    if (error) {
      console.error("Search error detected:", error);
      toast({
        title: "خطأ في البحث",
        description: "حدث خطأ أثناء البحث، يرجى المحاولة مرة أخرى",
        variant: "destructive",
      });
    }
  }, [error, toast]);

  useEffect(() => {
    if (query) {
      console.log("Query changed, refetching:", query);
      refetch();
    }
  }, [query, refetch]);

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
        // Store in localStorage as SickLeaves, replacing any previous file
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

  if (isLoading) {
    return (
      <Layout>
        <div className="flex flex-col items-center justify-center h-64">
          <Loader2 className="h-8 w-8 animate-spin text-medical" />
          <p className="mt-4 text-lg">جاري البحث...</p>
        </div>
      </Layout>
    );
  }

  // Log search results for debugging
  console.log("Rendering search results:", searchResults);

  return (
    <Layout>
      <Card className="mb-8">
        <CardHeader>
          <CardTitle className="flex items-center">
            <Search className="mr-2 h-5 w-5" />
            <span>نتائج البحث: {query}</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          {searchResults.length === 0 ? (
            <p className="text-center py-8 text-gray-500">لم يتم العثور على نتائج</p>
          ) : (
            <p className="mb-4">تم العثور على {searchResults.length} نتيجة</p>
          )}
        </CardContent>
      </Card>

      {searchResults.length > 0 && (
        <Card>
          <CardContent className="pt-6">
            <Tabs defaultValue="table">
              <TabsList className="mb-4">
                <TabsTrigger value="table">جدول</TabsTrigger>
                <TabsTrigger value="cards">بطاقات</TabsTrigger>
              </TabsList>
              
              <TabsContent value="table">
                <PatientsTable 
                  patients={searchResults}
                  reportTypes={REPORT_TYPES}
                  onGenerateReport={handleGenerateReport}
                  onDelete={handleDelete}
                />
              </TabsContent>
              
              <TabsContent value="cards">
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                  {searchResults.map((patient) => (
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
          </CardContent>
        </Card>
      )}

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

export default SearchResults;
