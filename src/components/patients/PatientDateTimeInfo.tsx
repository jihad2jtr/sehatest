
import React from "react";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";

interface PatientDateTimeInfoProps {
  dateFrom: string;
  dateTo: string;
  timeFrom: string;
  timeTo: string;
  onFieldChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

const PatientDateTimeInfo: React.FC<PatientDateTimeInfoProps> = ({
  dateFrom,
  dateTo,
  timeFrom,
  timeTo,
  onFieldChange
}) => {
  return (
    <>
      {/* من تاريخ */}
      <div className="input-group">
        <Label htmlFor="inputdatefrom">من تاريخ</Label>
        <Input
          id="inputdatefrom"
          name="inputdatefrom"
          type="date"
          value={dateFrom}
          onChange={onFieldChange}
          required
        />
      </div>

      {/* إلى تاريخ */}
      <div className="input-group">
        <Label htmlFor="inputdateto">إلى تاريخ</Label>
        <Input
          id="inputdateto"
          name="inputdateto"
          type="date"
          value={dateTo}
          onChange={onFieldChange}
          required
        />
      </div>

      {/* من الوقت */}
      <div className="input-group">
        <Label htmlFor="inputtimefrom">من الوقت</Label>
        <Input
          id="inputtimefrom"
          name="inputtimefrom"
          type="time"
          value={timeFrom}
          onChange={onFieldChange}
          required
        />
      </div>

      {/* إلى الوقت */}
      <div className="input-group">
        <Label htmlFor="inputtimeto">إلى الوقت</Label>
        <Input
          id="inputtimeto"
          name="inputtimeto"
          type="time"
          value={timeTo}
          onChange={onFieldChange}
          required
        />
      </div>
    </>
  );
};

export default PatientDateTimeInfo;
