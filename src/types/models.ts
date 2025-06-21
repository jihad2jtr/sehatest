
export interface Patient {
  _id: string;
  inputgsl: string;
  inputidentity: string;
  inputnamear: string;
  inputnameen?: string;
  inputdatefrom: string;
  inputdateto: string;
  inputdaynum: string;
  inputtimefrom?: string;
  inputtimeto?: string;
  inputemployer?: string;
  inputdatehin?: string;
  inputdatemin?: string;
  inputdatehout?: string;
  inputdatemout?: string;
  inputdatesick?: string;
  inputnationalityar?: string;
  inputnationalityen?: string;
  inputworkar?: string;
  inputworken?: string;
  inputdoctorar?: string;
  inputdoctoren?: string;
  inputworktypear?: string;
  inputworktypeen?: string;
  inputcentralnamear?: string;
  inputcentralnameen?: string;
  inputcentralid?: string;
  inputcentrallogo?: string;
  inputtimeparint?: string;
  inputdateparint?: string;
  inputindurationh?: string;
  inputdurationm?: string;
  inputNationalCompanion?: string;
  inputPmAmIn?: string;
  inputPmAmout?: string;
  inputTimein?: string;
  inputTimeout?: string;
  inputWaitTimeAr?: string;
  inputWaitTimeEr?: string;
  inputCompanionNameAr?: string;
  inputCompanionNameEn?: string;
  inputsickleaveRelation?: string;
  inputsickleaveRelationAr?: string;
  inputTypeVisitEn?: string;
  inputTypeVisitAr?: string;
  inputrelation?: string;
  inputvisittype?: string;
  input_sickleave_type?: string; // نوع الإجازة المرضية
  inputdiagnosis?: string; // التشخيص
  nationalityId?: string;
  doctorId?: string;
  hospitalId?: string;
  createdAt?: Date;
  updatedAt?: Date;
  __v?: number;
}

export interface Doctor {
  _id: string;
  input_doctor_name_ar: string;
  input_doctor_name_En: string;
  input_doctor_type_ar: string;
  input_doctor_type_En: string;
  input_doctor_num: string;
  createdAt?: Date;
  updatedAt?: Date;
}

export interface Hospital {
  _id: string;
  input_central_type: string;
  input_central_name_ar: string;
  input_central_name_en: string;
  input_central_id: string;
  input_central_logo?: string;
  input_central_location: string;
  input_central_doctor_num: string;
  createdAt?: Date;
  updatedAt?: Date;
}

export interface Nationality {
  _id: string;
  input_national_ar: string;
  input_national_en: string;
  createdAt?: Date;
  updatedAt?: Date;
}

export interface ReportType {
  id: string;
  name: string;
  route: string;
  color: string;
}

export interface DownloadState {
  isDownloading: boolean;
  progress: number;
  fileUrl: string | null;
  fileName: string;
  reportType: string;
}

export interface BarcodeSettings {
  barcodeLogo: string;
  barcodeLink: string;
}
