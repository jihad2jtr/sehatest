
import React from "react";
import { Label } from "@/components/ui/label";
import { Doctor } from "@/types/models";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from "@/components/ui/select";

interface DoctorSelectProps {
  doctors: Doctor[];
  isLoading: boolean;
  selectedDoctorId: string;
  hospitalSelected: boolean;
  onSelect: (doctorId: string) => void;
}

const DoctorSelect: React.FC<DoctorSelectProps> = ({
  doctors,
  isLoading,
  selectedDoctorId,
  hospitalSelected,
  onSelect
}) => {
  return (
    <div className="input-group">
      <Label htmlFor="doctorId">الطبيب</Label>
      <Select
        value={selectedDoctorId}
        onValueChange={onSelect}
        disabled={!hospitalSelected || doctors.length === 0}
      >
        <SelectTrigger>
          <SelectValue placeholder={!hospitalSelected ? "اختر المشفى أولاً" : "اختر الطبيب"} />
        </SelectTrigger>
        <SelectContent>
          {isLoading ? (
            <SelectItem value="loading" disabled>جاري التحميل...</SelectItem>
          ) : doctors.length === 0 ? (
            <SelectItem value="empty" disabled>لا يوجد أطباء متاحين لهذا المشفى</SelectItem>
          ) : (
            doctors.map((doctor) => (
              <SelectItem key={doctor._id} value={doctor._id}>
                {doctor.input_doctor_name_ar} - {doctor.input_doctor_type_ar}
              </SelectItem>
            ))
          )}
        </SelectContent>
      </Select>
    </div>
  );
};

export default DoctorSelect;
