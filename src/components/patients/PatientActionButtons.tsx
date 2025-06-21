
import React from "react";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { FilePen, Trash2, Download } from "lucide-react";
import { ReportType } from "@/types/models";
import ReportButton from "./ReportButton";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

interface PatientActionButtonsProps {
  patientId: string;
  reportTypes: ReportType[];
  onGenerateReport: (patientId: string, reportType: string, reportName: string) => void;
  onDelete: (patientId: string) => void;
  compact?: boolean;
}

const PatientActionButtons: React.FC<PatientActionButtonsProps> = ({ 
  patientId, 
  reportTypes, 
  onGenerateReport,
  onDelete,
  compact = false
}) => {
  if (compact) {
    return (
      <div className="flex gap-1">
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button className="btn-medical text-xs p-1 h-auto">
              <Download className="h-3 w-3 mr-1" />
              تحميل
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="bg-white z-50">
            {reportTypes.map((report) => (
              <DropdownMenuItem 
                key={report.id} 
                onClick={() => onGenerateReport(patientId, report.route, report.name)}
                className="text-right cursor-pointer"
              >
                {report.name}
              </DropdownMenuItem>
            ))}
          </DropdownMenuContent>
        </DropdownMenu>
        
        <Link to={`/patients/detail-edit/${patientId}`}>
          <Button className="btn-edit text-xs p-1 h-auto">
            <FilePen className="h-3 w-3 mr-1" />
            تعديل
          </Button>
        </Link>
        
        <Button 
          className="btn-delete text-xs p-1 h-auto"
          onClick={() => onDelete(patientId)}
        >
          <Trash2 className="h-3 w-3 mr-1" />
          حذف
        </Button>
      </div>
    );
  }

  return (
    <div className="flex flex-wrap gap-1">
      <div className="flex flex-wrap gap-1 mb-2">
        {reportTypes.map((report) => (
          <ReportButton 
            key={report.id}
            report={report}
            patientId={patientId}
            onGenerate={onGenerateReport}
          />
        ))}
      </div>
      
      <div className="flex gap-1">
        <Link to={`/patients/detail-edit/${patientId}`}>
          <Button className="btn-edit text-xs p-1 h-auto">
            <FilePen className="h-3 w-3 mr-1" />
            تعديل
          </Button>
        </Link>
        
        <Button 
          className="btn-delete text-xs p-1 h-auto"
          onClick={() => onDelete(patientId)}
        >
          <Trash2 className="h-3 w-3 mr-1" />
          حذف
        </Button>
      </div>
    </div>
  );
};

export default PatientActionButtons;
