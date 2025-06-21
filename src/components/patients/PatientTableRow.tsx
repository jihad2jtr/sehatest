
import React from "react";
import { TableCell, TableRow } from "@/components/ui/table";
import { Patient, ReportType } from "@/types/models";
import PatientActionButtons from "./PatientActionButtons";
import { useIsMobile } from "@/hooks/use-mobile";

interface PatientTableRowProps {
  patient: Patient;
  index: number;
  reportTypes: ReportType[];
  onGenerateReport: (patientId: string, reportType: string, reportName: string) => void;
  onDelete: (patientId: string) => void;
}

const PatientTableRow: React.FC<PatientTableRowProps> = ({ 
  patient, 
  index, 
  reportTypes, 
  onGenerateReport, 
  onDelete 
}) => {
  const isMobile = useIsMobile();
  
  return (
    <TableRow key={patient._id}>
      <TableCell className="font-medium">{index + 1}</TableCell>
      <TableCell>{patient.inputgsl}</TableCell>
      <TableCell>{patient.inputidentity}</TableCell>
      <TableCell>{patient.inputnamear}</TableCell>
      {!isMobile && (
        <>
          <TableCell>{patient.inputdatefrom}</TableCell>
          <TableCell>{patient.inputdateto}</TableCell>
          <TableCell>{patient.inputdaynum} يوم</TableCell>
          <TableCell>{patient.inputnationalityar || "-"}</TableCell>
          <TableCell>{patient.inputTypeVisitAr || "-"}</TableCell>
        </>
      )}
      <TableCell>
        <PatientActionButtons
          patientId={patient._id}
          reportTypes={reportTypes}
          onGenerateReport={onGenerateReport}
          onDelete={onDelete}
          compact={isMobile}
        />
      </TableCell>
    </TableRow>
  );
};

export default PatientTableRow;
