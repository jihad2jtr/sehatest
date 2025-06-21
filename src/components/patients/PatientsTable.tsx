
import React from "react";
import { Table, TableBody } from "@/components/ui/table";
import { Patient, ReportType } from "@/types/models";
import PatientTableHeader from "./PatientTableHeader";
import PatientTableRow from "./PatientTableRow";

interface PatientsTableProps {
  patients: Patient[];
  reportTypes: ReportType[];
  onGenerateReport: (patientId: string, reportType: string, reportName: string) => void;
  onDelete: (patientId: string) => void;
}

const PatientsTable: React.FC<PatientsTableProps> = ({ 
  patients, 
  reportTypes, 
  onGenerateReport, 
  onDelete 
}) => {
  return (
    <div className="overflow-x-auto" dir="rtl">
      <Table>
        <PatientTableHeader />
        <TableBody>
          {patients.map((patient, index) => (
            <PatientTableRow
              key={patient._id}
              patient={patient}
              index={index}
              reportTypes={reportTypes}
              onGenerateReport={onGenerateReport}
              onDelete={onDelete}
            />
          ))}
        </TableBody>
      </Table>
    </div>
  );
};

export default PatientsTable;
