
import React from "react";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Download, FilePen, Trash2 } from "lucide-react";
import { Link } from "react-router-dom";
import { Patient } from "@/types/models";
import { SICKLEAVE_TYPE_NAMES, SICKLEAVE_TYPE_MAP, NUMERIC_SICKLEAVE_TYPES } from "@/constants/reportTypes";
import { useIsMobile } from "@/hooks/use-mobile";

interface PatientCardProps {
  patient: Patient;
  onGenerateReport: (patientId: string, reportType: string, reportName: string) => void;
  onEdit: () => void;
  onDelete: () => void;
}

const PatientCard: React.FC<PatientCardProps> = ({ 
  patient, 
  onGenerateReport, 
  onEdit, 
  onDelete 
}) => {
  const getReportType = () => {
    // Handle both string and numeric types
    let type = patient.input_sickleave_type || "sickleave";
    
    // If it's a numeric sickleave type (1, 2, 3, 4, 5)
    const numericType = parseInt(type);
    if (!isNaN(numericType) && numericType >= 1 && numericType <= 5) {
      type = numericType.toString();
    }
    
    return {
      route: SICKLEAVE_TYPE_MAP[type as keyof typeof SICKLEAVE_TYPE_MAP] || SICKLEAVE_TYPE_MAP.sickleave,
      name: SICKLEAVE_TYPE_NAMES[type as keyof typeof SICKLEAVE_TYPE_NAMES] || SICKLEAVE_TYPE_NAMES.sickleave
    };
  };

  const { route, name } = getReportType();

  return (
    <Card className="flex flex-col overflow-hidden hover:shadow-md transition-shadow h-auto max-h-54">
      <CardHeader className="p-3 pb-1">
        <CardTitle className="text-sm font-medium text-medical">
          {name}
        </CardTitle>
      </CardHeader>
      <CardContent className="flex-1 p-3 pb-1">
        <div className="space-y-1">
          <p className="text-sm font-medium">{patient.inputnamear}</p>
          <p className="text-xs text-gray-500">
            <span>من: {patient.inputdatefrom}</span>
            <span className="mx-1">-</span>
            <span>إلى: {patient.inputdateto}</span>
          </p>
          <p className="text-xs text-gray-500">رقم الهوية: {patient.inputidentity}</p>
          <p className="text-xs text-gray-500">رقم الملف: {patient.inputgsl}</p>
        </div>
      </CardContent>
      <CardFooter className="p-3 pt-1">
        <div className="flex gap-1 w-full">
          <Button 
            className="bg-medical text-white flex-1 h-8 text-xs" 
            size="sm"
            onClick={() => onGenerateReport(patient._id, route, name)}
          >
            <Download className="mr-1 h-3 w-3" />
            تحميل
          </Button>
          
          <Link to={`/patients/detail-edit/${patient._id}`} className="flex-1">
            <Button className="bg-amber-500 hover:bg-amber-600 w-full h-8 text-xs" size="sm">
              <FilePen className="mr-1 h-3 w-3" />
              تعديل
            </Button>
          </Link>
          
          <Button 
            className="bg-red-600 hover:bg-red-700 flex-1 h-8 text-xs" 
            size="sm"
            onClick={onDelete}
          >
            <Trash2 className="mr-1 h-3 w-3" />
            حذف
          </Button>
        </div>
      </CardFooter>
    </Card>
  );
};

export default PatientCard;
