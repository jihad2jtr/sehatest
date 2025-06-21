
import React from "react";
import { TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { useIsMobile } from "@/hooks/use-mobile";

const PatientTableHeader: React.FC = () => {
  const isMobile = useIsMobile();
  
  return (
    <TableHeader>
      <TableRow>
        <TableHead className="w-10 text-right">#</TableHead>
        <TableHead className="text-right">رقم الملف</TableHead>
        <TableHead className="text-right">رقم الهوية</TableHead>
        <TableHead className="text-right">الاسم</TableHead>
        {!isMobile && (
          <>
            <TableHead className="text-right">من تاريخ</TableHead>
            <TableHead className="text-right">إلى تاريخ</TableHead>
            <TableHead className="text-right">عدد الأيام</TableHead>
            <TableHead className="text-right">الجنسية</TableHead>
            <TableHead className="text-right">نوع الزيارة</TableHead>
          </>
        )}
        <TableHead className="text-right w-[150px]">الإجراءات</TableHead>
      </TableRow>
    </TableHeader>
  );
};

export default PatientTableHeader;
