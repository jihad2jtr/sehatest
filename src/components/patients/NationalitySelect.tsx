
import React from "react";
import { Label } from "@/components/ui/label";
import { Nationality } from "@/types/models";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from "@/components/ui/select";

interface NationalitySelectProps {
  nationalities: Nationality[];
  isLoading: boolean;
  selectedNationalityId: string;
  onSelect: (nationalityId: string) => void;
}

const NationalitySelect: React.FC<NationalitySelectProps> = ({
  nationalities,
  isLoading,
  selectedNationalityId,
  onSelect
}) => {
  return (
    <div className="input-group">
      <Label htmlFor="nationalityId">الجنسية</Label>
      <Select
        value={selectedNationalityId}
        onValueChange={onSelect}
      >
        <SelectTrigger className="h-12 rounded-xl">
          <SelectValue placeholder="اختر الجنسية" />
        </SelectTrigger>
        <SelectContent className="max-h-[300px] rounded-xl">
          {isLoading ? (
            <SelectItem value="loading" disabled>جاري التحميل...</SelectItem>
          ) : nationalities.length === 0 ? (
            <SelectItem value="empty" disabled>لا توجد جنسيات</SelectItem>
          ) : (
            nationalities.map((nationality) => (
              <SelectItem key={nationality._id} value={nationality._id}>
                {nationality.input_national_ar}
              </SelectItem>
            ))
          )}
        </SelectContent>
      </Select>
    </div>
  );
};

export default NationalitySelect;
