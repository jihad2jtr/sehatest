
import React, { useState, useEffect } from "react";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Check, ChevronsUpDown, Search, X } from "lucide-react";
import { cn } from "@/lib/utils";
import { Hospital } from "@/types/models";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";

interface HospitalSearchProps {
  hospitals: Hospital[];
  isLoading: boolean;
  selectedHospitalId: string;
  onSelect: (hospitalId: string) => void;
}

const HospitalSearch: React.FC<HospitalSearchProps> = ({
  hospitals,
  isLoading,
  selectedHospitalId,
  onSelect,
}) => {
  const [searchTerm, setSearchTerm] = useState("");
  const [popoverOpen, setPopoverOpen] = useState(false);
  const [selectedHospital, setSelectedHospital] = useState<Hospital | null>(null);

  // Set selected hospital on mount or when selectedHospitalId changes
  useEffect(() => {
    if (selectedHospitalId && hospitals.length > 0) {
      const hospital = hospitals.find(h => h._id === selectedHospitalId);
      if (hospital) {
        setSelectedHospital(hospital);
      }
    } else {
      setSelectedHospital(null);
    }
  }, [selectedHospitalId, hospitals]);

  // Filter hospitals based on search term
  const filteredHospitals = searchTerm.trim() === "" 
    ? hospitals 
    : hospitals.filter(hospital => 
        hospital.input_central_name_ar.toLowerCase().includes(searchTerm.toLowerCase()) ||
        hospital.input_central_location.toLowerCase().includes(searchTerm.toLowerCase())
      );

  const clearSelection = () => {
    onSelect("");
    setSelectedHospital(null);
  };

  return (
    <div className="input-group">
      <Label htmlFor="hospitalId">المشفى</Label>
      <Popover open={popoverOpen} onOpenChange={setPopoverOpen}>
        <PopoverTrigger asChild>
          <Button
            variant="outline"
            role="combobox"
            aria-expanded={popoverOpen}
            className="w-full justify-between text-right relative"
          >
            {selectedHospital ? (
              <div className="truncate max-w-[90%]">
                {selectedHospital.input_central_name_ar} - {selectedHospital.input_central_location}
              </div>
            ) : (
              "اختر المشفى"
            )}
            <div className="flex gap-1 absolute left-2">
              {selectedHospital && (
                <Button 
                  variant="ghost" 
                  size="icon" 
                  className="h-5 w-5 p-0 hover:bg-gray-100" 
                  onClick={(e) => {
                    e.stopPropagation();
                    clearSelection();
                  }}
                >
                  <X className="h-3 w-3" />
                </Button>
              )}
              <ChevronsUpDown className="h-4 w-4 shrink-0 opacity-50" />
            </div>
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-[300px] max-w-[90vw] p-0">
          <Command>
            <div className="flex items-center border-b px-3">
              <Search className="ml-2 h-4 w-4 shrink-0 opacity-50" />
              <CommandInput 
                placeholder="ابحث عن مشفى..." 
                value={searchTerm}
                onValueChange={setSearchTerm}
                className="h-9 border-none focus:ring-0"
              />
            </div>
            <CommandList className="max-h-[300px] overflow-auto">
              <CommandEmpty>لا توجد نتائج</CommandEmpty>
              <CommandGroup>
                {isLoading ? (
                  <CommandItem disabled>جاري التحميل...</CommandItem>
                ) : filteredHospitals.length === 0 ? (
                  <CommandItem disabled>لا توجد مستشفيات</CommandItem>
                ) : (
                  filteredHospitals.map((hospital) => (
                    <CommandItem
                      key={hospital._id}
                      value={hospital._id}
                      onSelect={() => {
                        onSelect(hospital._id);
                        setSelectedHospital(hospital);
                        setPopoverOpen(false);
                      }}
                      className="text-right flex items-center justify-between"
                    >
                      <Check
                        className={cn(
                          "ml-2 h-4 w-4",
                          selectedHospitalId === hospital._id ? "opacity-100" : "opacity-0"
                        )}
                      />
                      <div className="flex flex-col">
                        <span className="font-medium">{hospital.input_central_name_ar}</span>
                        <span className="text-xs text-gray-500">{hospital.input_central_location}</span>
                      </div>
                    </CommandItem>
                  ))
                )}
              </CommandGroup>
            </CommandList>
          </Command>
        </PopoverContent>
      </Popover>
    </div>
  );
};

export default HospitalSearch;
