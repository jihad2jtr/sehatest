
import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { patientAPI } from "@/services/api";
import { Patient } from "@/types/models";
import Layout from "@/components/Layout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Loader2 } from "lucide-react";
import { useToast } from "@/components/ui/use-toast";

const EditPatient: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [patient, setPatient] = useState<Patient | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Fetch patient data
  const { data: patientData, isLoading } = useQuery({
    queryKey: ["patient", id],
    queryFn: () => patientAPI.getById(id || ""),
    enabled: !!id,
  });

  useEffect(() => {
    if (patientData) {
      setPatient(patientData);
    }
  }, [patientData]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    if (patient) {
      setPatient({
        ...patient,
        [name]: value,
      });
    }
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!patient || !id) return;

    try {
      setIsSubmitting(true);
      await patientAPI.update(id, patient);
      toast({
        title: "تم التحديث بنجاح",
        description: "تم تحديث بيانات المريض بنجاح",
      });
      navigate("/patients");
    } catch (error) {
      console.error("Error updating patient:", error);
      toast({
        title: "خطأ في التحديث",
        description: "لم يتم تحديث البيانات، يرجى المحاولة مرة أخرى",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isLoading || !patient) {
    return (
      <Layout>
        <div className="flex flex-col items-center justify-center h-64">
          <Loader2 className="h-8 w-8 animate-spin text-medical" />
          <p className="mt-4 text-lg">جاري تحميل البيانات...</p>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <Card>
        <CardHeader className="text-right">
          <CardTitle>تعديل بيانات المريض</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} dir="rtl" className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {/* رمز الاجازة */}
              <div className="input-group">
                <Label htmlFor="inputgsl">رمز الاجازة</Label>
                <Input
                  id="inputgsl"
                  name="inputgsl"
                  value={patient.inputgsl || ""}
                  onChange={handleInputChange}
                />
              </div>

              {/* الاجازة عربي وانجليزي */}
              <div className="input-group">
                <Label htmlFor="inputindurationh">الاجازة عربي</Label>
                <Input
                  id="inputindurationh"
                  name="inputindurationh"
                  value={patient.inputindurationh || ""}
                  onChange={handleInputChange}
                />
              </div>
              <div className="input-group">
                <Label htmlFor="inputdurationm">الاجازة انجليزي</Label>
                <Input
                  id="inputdurationm"
                  name="inputdurationm"
                  value={patient.inputdurationm || ""}
                  onChange={handleInputChange}
                />
              </div>

              {/* تاريخ الدخول هجري وميلادي */}
              <div className="input-group">
                <Label htmlFor="inputdatehin">تاريخ الدخول هجري</Label>
                <Input
                  id="inputdatehin"
                  name="inputdatehin"
                  value={patient.inputdatehin || ""}
                  onChange={handleInputChange}
                />
              </div>
              <div className="input-group">
                <Label htmlFor="inputdatemin">تاريخ الدخول ميلادي</Label>
                <Input
                  id="inputdatemin"
                  name="inputdatemin"
                  value={patient.inputdatemin || ""}
                  onChange={handleInputChange}
                />
              </div>

              {/* تاريخ الخروج هجري وميلادي */}
              <div className="input-group">
                <Label htmlFor="inputdatehout">تاريخ الخروج هجري</Label>
                <Input
                  id="inputdatehout"
                  name="inputdatehout"
                  value={patient.inputdatehout || ""}
                  onChange={handleInputChange}
                />
              </div>
              <div className="input-group">
                <Label htmlFor="inputdatemout">تاريخ الخروج ميلادي</Label>
                <Input
                  id="inputdatemout"
                  name="inputdatemout"
                  value={patient.inputdatemout || ""}
                  onChange={handleInputChange}
                />
              </div>

              {/* تاريخ اصدار التقرير */}
              <div className="input-group">
                <Label htmlFor="inputdatesick">تاريخ اصدار التقرير</Label>
                <Input
                  id="inputdatesick"
                  name="inputdatesick"
                  value={patient.inputdatesick || ""}
                  onChange={handleInputChange}
                />
              </div>

              {/* الاسم */}
              <div className="input-group">
                <Label htmlFor="inputnamear">الاسم</Label>
                <Input
                  id="inputnamear"
                  name="inputnamear"
                  value={patient.inputnamear || ""}
                  onChange={handleInputChange}
                />
              </div>
              <div className="input-group">
                <Label htmlFor="inputnameen">name</Label>
                <Input
                  id="inputnameen"
                  name="inputnameen"
                  value={patient.inputnameen || ""}
                  onChange={handleInputChange}
                />
              </div>

              {/* الهوية */}
              <div className="input-group">
                <Label htmlFor="inputidentity">الهوية</Label>
                <Input
                  id="inputidentity"
                  name="inputidentity"
                  value={patient.inputidentity || ""}
                  onChange={handleInputChange}
                />
              </div>

              {/* اسم المرافق */}
              <div className="input-group">
                <Label htmlFor="inputCompanionNameAr">اسم المرافق</Label>
                <Input
                  id="inputCompanionNameAr"
                  name="inputCompanionNameAr"
                  value={patient.inputCompanionNameAr || ""}
                  onChange={handleInputChange}
                />
              </div>
              <div className="input-group">
                <Label htmlFor="inputCompanionNameEn">CompanionName</Label>
                <Input
                  id="inputCompanionNameEn"
                  name="inputCompanionNameEn"
                  value={patient.inputCompanionNameEn || ""}
                  onChange={handleInputChange}
                />
              </div>

              {/* هوية المرافق */}
              <div className="input-group">
                <Label htmlFor="inputNationalCompanion">هوية المرافق</Label>
                <Input
                  id="inputNationalCompanion"
                  name="inputNationalCompanion"
                  value={patient.inputNationalCompanion || ""}
                  onChange={handleInputChange}
                />
              </div>

              {/* الجنسية */}
              <div className="input-group">
                <Label htmlFor="inputnationalityar">الجنسية</Label>
                <Input
                  id="inputnationalityar"
                  name="inputnationalityar"
                  value={patient.inputnationalityar || ""}
                  onChange={handleInputChange}
                />
              </div>
              <div className="input-group">
                <Label htmlFor="inputnationalityen">Nathoinal</Label>
                <Input
                  id="inputnationalityen"
                  name="inputnationalityen"
                  value={patient.inputnationalityen || ""}
                  onChange={handleInputChange}
                />
              </div>

              {/* جهة العمل */}
              <div className="input-group">
                <Label htmlFor="inputworkar">جهة العمل</Label>
                <Input
                  id="inputworkar"
                  name="inputworkar"
                  value={patient.inputworkar || ""}
                  onChange={handleInputChange}
                />
              </div>
              <div className="input-group">
                <Label htmlFor="inputworken">worker</Label>
                <Input
                  id="inputworken"
                  name="inputworken"
                  value={patient.inputworken || ""}
                  onChange={handleInputChange}
                />
              </div>

              {/* اسم الطبيب */}
              <div className="input-group">
                <Label htmlFor="inputdoctorar">اسم الطبيب</Label>
                <Input
                  id="inputdoctorar"
                  name="inputdoctorar"
                  value={patient.inputdoctorar || ""}
                  onChange={handleInputChange}
                />
              </div>
              <div className="input-group">
                <Label htmlFor="inputdoctoren">Doctor name</Label>
                <Input
                  id="inputdoctoren"
                  name="inputdoctoren"
                  value={patient.inputdoctoren || ""}
                  onChange={handleInputChange}
                />
              </div>

              {/* المسمى الوظيفي */}
              <div className="input-group">
                <Label htmlFor="inputworktypear">المسمى الوظيفي</Label>
                <Input
                  id="inputworktypear"
                  name="inputworktypear"
                  value={patient.inputworktypear || ""}
                  onChange={handleInputChange}
                />
              </div>
              <div className="input-group">
                <Label htmlFor="inputworktypeen">position</Label>
                <Input
                  id="inputworktypeen"
                  name="inputworktypeen"
                  value={patient.inputworktypeen || ""}
                  onChange={handleInputChange}
                />
              </div>

              {/* صلة القرابة */}
              <div className="input-group">
                <Label htmlFor="inputsickleaveRelationAr">صلة القرابة</Label>
                <Input
                  id="inputsickleaveRelationAr"
                  name="inputsickleaveRelationAr"
                  value={patient.inputsickleaveRelationAr || ""}
                  onChange={handleInputChange}
                />
              </div>
              <div className="input-group">
                <Label htmlFor="inputsickleaveRelation">Relation</Label>
                <Input
                  id="inputsickleaveRelation"
                  name="inputsickleaveRelation"
                  value={patient.inputsickleaveRelation || ""}
                  onChange={handleInputChange}
                />
              </div>

              {/* نوع الزيارة */}
              <div className="input-group">
                <Label htmlFor="inputTypeVisitAr">نوع الزيارة</Label>
                <Input
                  id="inputTypeVisitAr"
                  name="inputTypeVisitAr"
                  value={patient.inputTypeVisitAr || ""}
                  onChange={handleInputChange}
                />
              </div>
              <div className="input-group">
                <Label htmlFor="inputTypeVisitEn">Visit</Label>
                <Input
                  id="inputTypeVisitEn"
                  name="inputTypeVisitEn"
                  value={patient.inputTypeVisitEn || ""}
                  onChange={handleInputChange}
                />
              </div>

              {/* اسم المركز */}
              <div className="input-group">
                <Label htmlFor="inputcentralnamear">اسم المركز</Label>
                <Input
                  id="inputcentralnamear"
                  name="inputcentralnamear"
                  value={patient.inputcentralnamear || ""}
                  onChange={handleInputChange}
                />
              </div>
              <div className="input-group">
                <Label htmlFor="inputtimeparint">وقت الطباعة</Label>
                <Input
                  id="inputtimeparint"
                  name="inputtimeparint"
                  value={patient.inputtimeparint || ""}
                  onChange={handleInputChange}
                />
              </div>

              {/* Central name */}
              <div className="input-group">
                <Label htmlFor="inputcentralnameen">Central name</Label>
                <Input
                  id="inputcentralnameen"
                  name="inputcentralnameen"
                  value={patient.inputcentralnameen || ""}
                  onChange={handleInputChange}
                />
              </div>
              <div className="input-group">
                <Label htmlFor="inputdateparint">تاريخ الطباعة</Label>
                <Input
                  id="inputdateparint"
                  name="inputdateparint"
                  value={patient.inputdateparint || ""}
                  onChange={handleInputChange}
                  readOnly
                />
              </div>

              {/* رقم الترخيص */}
              <div className="input-group">
                <Label htmlFor="inputcentralid">رقم الترخيص</Label>
                <Input
                  id="inputcentralid"
                  name="inputcentralid"
                  value={patient.inputcentralid || ""}
                  onChange={handleInputChange}
                />
              </div>
              <div className="input-group">
                <Label htmlFor="inputdaynum">عدد الايام</Label>
                <Input
                  id="inputdaynum"
                  name="inputdaynum"
                  value={patient.inputdaynum || ""}
                  onChange={handleInputChange}
                />
              </div>

              {/* رقم المركز */}
              <div className="input-group">
                <Label htmlFor="inputcentrallogo">رقم المركز</Label>
                <Input
                  id="inputcentrallogo"
                  name="inputcentrallogo"
                  value={patient.inputcentrallogo || ""}
                  onChange={handleInputChange}
                />
              </div>

              {/* الاجازة من */}
              <div className="input-group">
                <Label htmlFor="inputdatefrom">الاجازة من</Label>
                <Input
                  id="inputdatefrom"
                  name="inputdatefrom"
                  value={patient.inputdatefrom || ""}
                  onChange={handleInputChange}
                />
              </div>

              {/* الاجازة الى */}
              <div className="input-group">
                <Label htmlFor="inputdateto">الاجازة الى</Label>
                <Input
                  id="inputdateto"
                  name="inputdateto"
                  value={patient.inputdateto || ""}
                  onChange={handleInputChange}
                />
              </div>

              {/* نوع الاجازة */}
              <div className="input-group">
                <Label htmlFor="input_sickleave_type">نوع الاجازة</Label>
                <Input
                  id="input_sickleave_type"
                  name="input_sickleave_type"
                  value={patient.input_sickleave_type || ""}
                  onChange={handleInputChange}
                />
              </div>

              {/* التشخيص */}
              <div className="input-group">
                <Label htmlFor="inputdiagnosis">التشخيص</Label>
                <Input
                  id="inputdiagnosis"
                  name="inputdiagnosis"
                  value={patient.inputdiagnosis || ""}
                  onChange={handleInputChange}
                />
              </div>
            </div>

            <div className="text-center mt-6">
              <Button type="submit" className="btn-medical" disabled={isSubmitting}>
                {isSubmitting ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    جاري التحديث...
                  </>
                ) : (
                  "تحديث البيانات"
                )}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </Layout>
  );
};

export default EditPatient;
