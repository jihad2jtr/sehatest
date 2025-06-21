
import React from "react";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";

interface PatientBasicInfoProps {
  name: string;
  identity: string;
  employer: string;
  onFieldChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

const PatientBasicInfo: React.FC<PatientBasicInfoProps> = ({
  name,
  identity,
  employer,
  onFieldChange
}) => {
  return (
    <>
      {/* اسم المريض */}
      <div className="input-group">
        <Label htmlFor="inputnamear">اسم المريض</Label>
        <Input
          id="inputnamear"
          name="inputnamear"
          value={name}
          onChange={onFieldChange}
          placeholder="اسم المريض"
          required
        />
      </div>

      {/* الهوية */}
      <div className="input-group">
        <Label htmlFor="inputidentity">الهوية</Label>
        <Input
          id="inputidentity"
          name="inputidentity"
          value={identity}
          onChange={onFieldChange}
          placeholder="الهوية"
          maxLength={10}
          required
        />
      </div>

      {/* جهة العمل */}
      <div className="input-group">
        <Label htmlFor="inputemployer">جهة العمل</Label>
        <Input
          id="inputemployer"
          name="inputemployer"
          value={employer}
          onChange={onFieldChange}
          placeholder="جهة العمل"
          required
        />
      </div>
    </>
  );
};

export default PatientBasicInfo;
