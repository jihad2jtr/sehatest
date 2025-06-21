
import React from "react";
import { Button } from "@/components/ui/button";
import { FileText } from "lucide-react";
import { ReportType } from "@/types/models";

interface ReportButtonProps {
  report: ReportType;
  patientId: string;
  onGenerate: (patientId: string, reportType: string, reportName: string) => void;
}

const ReportButton: React.FC<ReportButtonProps> = ({ report, patientId, onGenerate }) => {
  return (
    <Button 
      className={`${report.color} text-xs p-1 h-auto`}
      onClick={() => onGenerate(patientId, report.route, report.name)}
    >
      <FileText className="h-3 w-3 mr-1" />
      {report.name}
    </Button>
  );
};

export default ReportButton;
