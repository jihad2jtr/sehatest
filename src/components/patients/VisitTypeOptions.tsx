
import React from "react";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from "@/components/ui/select";

interface VisitTypeOptionsProps {
  relation: string;
  visitType: string;
  onSelectChange: (name: string, value: string) => void;
}

const VisitTypeOptions: React.FC<VisitTypeOptionsProps> = ({
  relation,
  visitType,
  onSelectChange
}) => {
  return (
    <>
      {/* صلة القرابة */}
      <div className="input-group">
        <Label htmlFor="inputrelation">صلة القرابة</Label>
        <Select
          value={relation}
          onValueChange={(value) => onSelectChange("inputrelation", value)}
        >
          <SelectTrigger>
            <SelectValue placeholder="اختر صلة القرابة" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="father">أب</SelectItem>
            <SelectItem value="son">إبن</SelectItem>
            <SelectItem value="mother">أم</SelectItem>
            <SelectItem value="daughter">بنت</SelectItem>
            <SelectItem value="husband">زوج</SelectItem>
            <SelectItem value="brother">أخ</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* نوع الزيارة */}
      <div className="input-group">
        <Label htmlFor="inputvisittype">نوع الزيارة</Label>
        <Select
          value={visitType}
          onValueChange={(value) => onSelectChange("inputvisittype", value)}
        >
          <SelectTrigger>
            <SelectValue placeholder="اختر نوع الزيارة" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="outpatient">عيادات</SelectItem>
            <SelectItem value="emergency">طوارئ</SelectItem>
          </SelectContent>
        </Select>
      </div>
    </>
  );
};

export default VisitTypeOptions;
