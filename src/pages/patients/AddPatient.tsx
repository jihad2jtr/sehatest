
import React, { useState, useEffect, useMemo } from "react";
import { useToast } from "@/components/ui/use-toast";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from "@/components/ui/select";
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
import { Check, ChevronsUpDown } from "lucide-react";
import { cn } from "@/lib/utils";
import { Label } from "@/components/ui/label";
import { useNavigate } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { hospitalAPI, doctorAPI, nationalityAPI, patientAPI } from "@/services/api";
import { Doctor, Hospital, Nationality } from "@/types/models";
import Layout from "@/components/Layout";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

const AddPatient = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [hospitalSearchTerm, setHospitalSearchTerm] = useState("");
  const [hospitalPopoverOpen, setHospitalPopoverOpen] = useState(false);

  // Patient form state
  const [patientData, setPatientData] = useState({
    inputnamear: "",
    inputidentity: "",
    inputdatefrom: "",
    inputdateto: "",
    inputtimefrom: "",
    inputtimeto: "",
    inputemployer: "",
    inputrelation: "father",
    inputvisittype: "outpatient",
    input_sickleave_type: "sickleave", // Default value
    nationalityId: "",
    doctorId: "",
    hospitalId: "",
    // Companion fields
    inputCompanionNameAr: "",
    inputNationalCompanion: "",
  });

  // Determine if companion fields should be shown
  const showCompanionFields = patientData.input_sickleave_type === "sickleavecompanion" || 
                              patientData.input_sickleave_type === "visitcompamion";

  // Fetch data from API
  const { data: hospitals = [], isLoading: isLoadingHospitals } = useQuery({
    queryKey: ["hospitals"],
    queryFn: hospitalAPI.getAll
  });

  const { data: doctors = [], isLoading: isLoadingDoctors } = useQuery({
    queryKey: ["doctors"],
    queryFn: doctorAPI.getAll
  });

  const { data: nationalities = [], isLoading: isLoadingNationalities } = useQuery({
    queryKey: ["nationalities"],
    queryFn: nationalityAPI.getAll
  });

  // Filter doctors based on selected hospital
  const [filteredDoctors, setFilteredDoctors] = useState<Doctor[]>([]);
  
  useEffect(() => {
    if (patientData.hospitalId && doctors.length > 0) {
      const selectedHospital = hospitals.find(h => h._id === patientData.hospitalId);
      
      if (selectedHospital) {
        const hospitalDoctorNum = selectedHospital.input_central_doctor_num;
        console.log("Hospital doctor num:", hospitalDoctorNum);
        
        const matchingDoctors = doctors.filter(
          doctor => doctor.input_doctor_num === hospitalDoctorNum
        );
        
        console.log("Matching doctors:", matchingDoctors);
        setFilteredDoctors(matchingDoctors);
        
        // Set first matching doctor if available
        if (matchingDoctors.length > 0 && !patientData.doctorId) {
          setPatientData(prev => ({ ...prev, doctorId: matchingDoctors[0]._id }));
        } else if (matchingDoctors.length === 0) {
          // Clear doctor selection if no matching doctors
          setPatientData(prev => ({ ...prev, doctorId: "" }));
        }
      }
    }
  }, [patientData.hospitalId, doctors, hospitals]);

  // Filter hospitals based on search term using useMemo to fix search issues
  const filteredHospitals = useMemo(() => {
    return hospitalSearchTerm.trim() === "" 
      ? hospitals 
      : hospitals.filter(hospital => 
          hospital.input_central_name_ar.toLowerCase().includes(hospitalSearchTerm.toLowerCase()) ||
          hospital.input_central_location.toLowerCase().includes(hospitalSearchTerm.toLowerCase())
        );
  }, [hospitals, hospitalSearchTerm]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setPatientData(prev => ({ ...prev, [name]: value }));
  };

  const handleSelectChange = (name: string, value: string) => {
    setPatientData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      // Calculate day difference for inputdaynum
      const dateFrom = new Date(patientData.inputdatefrom);
      const dateTo = new Date(patientData.inputdateto);
      const diffTime = Math.abs(dateTo.getTime() - dateFrom.getTime());
      const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24)) + 1;
      
      const patientWithDays = {
        ...patientData,
        inputdaynum: diffDays.toString(),
        inputgsl: Math.floor(Math.random() * 1000000).toString().padStart(6, '0')
      };
      
      await patientAPI.create(patientWithDays);
      
      toast({
        title: "تمت الإضافة بنجاح",
        description: "تم إضافة بيانات المريض بنجاح",
      });
      
      navigate("/patients");
    } catch (error) {
      console.error("Error adding patient:", error);
      toast({
        title: "حدث خطأ",
        description: "لم يتم إضافة البيانات. يرجى المحاولة مرة أخرى.",
        variant: "destructive",
      });
    }
  };

  return (
    <Layout>
      <Card>
        <CardHeader>
          <CardTitle className="text-2xl">إضافة مريض جديد</CardTitle>
          <CardDescription>أدخل بيانات المريض لإضافته إلى النظام</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            
              {/* نوع الإجازة المرضية */}
              <div className="input-group">
                <Label htmlFor="input_sickleave_type">نوع الإجازة المرضية</Label>
                <Select
                  value={patientData.input_sickleave_type}
                  onValueChange={(value) => handleSelectChange("input_sickleave_type", value)}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="اختر نوع الإجازة" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="sickleave">إجازة مرضية</SelectItem>
                    <SelectItem value="sickleavecompanion">تقرير مرافق مريض</SelectItem>
                    <SelectItem value="visitleave">مشهد مراجعة</SelectItem>
                    <SelectItem value="visitcompamion">مشهد مراجعة لمرافق</SelectItem>
                    <SelectItem value="medicalreport">تقرير طبي</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              {/* اسم المريض */}
              <div className="input-group">
                <Label htmlFor="inputnamear">اسم المريض</Label>
                <Input
                  id="inputnamear"
                  name="inputnamear"
                  value={patientData.inputnamear}
                  onChange={handleChange}
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
                  value={patientData.inputidentity}
                  onChange={handleChange}
                  placeholder="الهوية"
                  maxLength={10}
                  required
                />
              </div>

              {/* معلومات المرافق - تظهر فقط عند اختيار نوع مرافق */}
              {showCompanionFields && (
                <>
                  {/* اسم المرافق */}
                  <div className="input-group">
                    <Label htmlFor="inputCompanionNameAr">اسم المرافق</Label>
                    <Input
                      id="inputCompanionNameAr"
                      name="inputCompanionNameAr"
                      value={patientData.inputCompanionNameAr}
                      onChange={handleChange}
                      placeholder="اسم المرافق"
                      required={showCompanionFields}
                    />
                  </div>

                  {/* هوية المرافق */}
                  <div className="input-group">
                    <Label htmlFor="inputNationalCompanion">هوية المرافق</Label>
                    <Input
                      id="inputNationalCompanion"
                      name="inputNationalCompanion"
                      value={patientData.inputNationalCompanion}
                      onChange={handleChange}
                      placeholder="هوية المرافق"
                      maxLength={10}
                      required={showCompanionFields}
                    />
                  </div>
                </>
              )}

              {/* من تاريخ */}
              <div className="input-group">
                <Label htmlFor="inputdatefrom">من تاريخ</Label>
                <Input
                  id="inputdatefrom"
                  name="inputdatefrom"
                  type="date"
                  value={patientData.inputdatefrom}
                  onChange={handleChange}
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
                  value={patientData.inputdateto}
                  onChange={handleChange}
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
                  value={patientData.inputtimefrom}
                  onChange={handleChange}
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
                  value={patientData.inputtimeto}
                  onChange={handleChange}
                  required
                />
              </div>

              {/* جهة العمل */}
              <div className="input-group">
                <Label htmlFor="inputemployer">جهة العمل</Label>
                <Input
                  id="inputemployer"
                  name="inputemployer"
                  value={patientData.inputemployer}
                  onChange={handleChange}
                  placeholder="جهة العمل"
                  required
                />
              </div>

              {/* صلة القرابة - تظهر فقط في حالة المرافق */}
              {showCompanionFields && (
                <div className="input-group">
                  <Label htmlFor="inputrelation">صلة القرابة</Label>
                  <Select
                    value={patientData.inputrelation}
                    onValueChange={(value) => handleSelectChange("inputrelation", value)}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="اختر صلة القرابة" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="father">أب</SelectItem>
                      <SelectItem value="son">إبن</SelectItem>
                      <SelectItem value="mother">أم</SelectItem>
                      <SelectItem value="daughter">إبنة</SelectItem>
                      <SelectItem value="husband">زوج</SelectItem>
                      <SelectItem value="brother">أخ</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              )}

              {/* نوع الزيارة */}
              <div className="input-group">
                <Label htmlFor="inputvisittype">نوع الزيارة</Label>
                <Select
                  value={patientData.inputvisittype}
                  onValueChange={(value) => handleSelectChange("inputvisittype", value)}
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

              {/* الجنسية */}
              <div className="input-group">
                <Label htmlFor="nationalityId">الجنسية</Label>
                <Select
                  value={patientData.nationalityId}
                  onValueChange={(value) => handleSelectChange("nationalityId", value)}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="اختر الجنسية" />
                  </SelectTrigger>
                  <SelectContent className="max-h-[300px]">
                    {isLoadingNationalities ? (
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

              {/* المشفى - مع البحث */}
              <div className="input-group">
                <Label htmlFor="hospitalId">المشفى</Label>
                <Popover open={hospitalPopoverOpen} onOpenChange={setHospitalPopoverOpen}>
                  <PopoverTrigger asChild>
                    <Button
                      variant="outline"
                      role="combobox"
                      aria-expanded={hospitalPopoverOpen}
                      className="w-full justify-between text-right"
                    >
                      {patientData.hospitalId ? (
                        hospitals.find((hospital) => hospital._id === patientData.hospitalId)?.input_central_name_ar || "اختر المشفى"
                      ) : (
                        "اختر المشفى"
                      )}
                      <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-full p-0">
                    <Command>
                      <CommandInput 
                        placeholder="ابحث عن مشفى..." 
                        value={hospitalSearchTerm}
                        onValueChange={setHospitalSearchTerm}
                        className="h-9"
                      />
                      <CommandList>
                        <CommandEmpty>لا توجد نتائج</CommandEmpty>
                        <CommandGroup>
                          {isLoadingHospitals ? (
                            <CommandItem disabled>جاري التحميل...</CommandItem>
                          ) : filteredHospitals.length === 0 ? (
                            <CommandItem disabled>لا توجد مستشفيات</CommandItem>
                          ) : (
                            filteredHospitals.map((hospital) => (
                              <CommandItem
                                key={hospital._id}
                                value={hospital._id}
                                onSelect={() => {
                                  handleSelectChange("hospitalId", hospital._id);
                                  setHospitalPopoverOpen(false);
                                }}
                                className="text-right"
                              >
                                {hospital.input_central_name_ar} - {hospital.input_central_location}
                                <Check
                                  className={cn(
                                    "mr-2 h-4 w-4",
                                    patientData.hospitalId === hospital._id ? "opacity-100" : "opacity-0"
                                  )}
                                />
                              </CommandItem>
                            ))
                          )}
                        </CommandGroup>
                      </CommandList>
                    </Command>
                  </PopoverContent>
                </Popover>
              </div>

              {/* الطبيب */}
              <div className="input-group">
                <Label htmlFor="doctorId">الطبيب</Label>
                <Select
                  value={patientData.doctorId}
                  onValueChange={(value) => handleSelectChange("doctorId", value)}
                  disabled={!patientData.hospitalId || filteredDoctors.length === 0}
                >
                  <SelectTrigger>
                    <SelectValue placeholder={!patientData.hospitalId ? "اختر المشفى أولاً" : "اختر الطبيب"} />
                  </SelectTrigger>
                  <SelectContent>
                    {isLoadingDoctors ? (
                      <SelectItem value="loading" disabled>جاري التحميل...</SelectItem>
                    ) : filteredDoctors.length === 0 ? (
                      <SelectItem value="empty">لا يوجد أطباء متاحين لهذا المشفى</SelectItem>
                    ) : (
                      filteredDoctors.map((doctor) => (
                        <SelectItem key={doctor._id} value={doctor._id}>
                          {doctor.input_doctor_name_ar} - {doctor.input_doctor_type_ar}
                        </SelectItem>
                      ))
                    )}
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="flex justify-end">
              <Button type="submit" className="btn-medical">إضافة المريض</Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </Layout>
  );
};

export default AddPatient;
