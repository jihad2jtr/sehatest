
import { ReportType } from "@/types/models";

export const REPORT_TYPES: ReportType[] = [
  { id: "medical", name: "تقرير طبي", route: "model_report/medicalreportcreate", color: "bg-report" },
  { id: "sick", name: "اجازة مرضية", route: "model_sikleaves_n/sickleavecreate", color: "bg-[#1c5a40]" },
  { id: "companion", name: "تقرير مرافق", route: "model_sikleaves_comp/sickleavecreate", color: "bg-report-companion" },
  { id: "visit", name: "مشهد مراجعة", route: "model_sikleaves_visit/sickleavecreate", color: "bg-report-visit" },
  { id: "companion_visit", name: "مشهد مراجعة لمرافق", route: "model_sikleaves_comp_visit/sickleavecreate", color: "bg-[#5426bC]" },
];

// Numeric types mapping
export const NUMERIC_SICKLEAVE_TYPES = {
  1: "sickleave", // اجازة مرضية
  2: "visitleave", // مشهد مراجعة
  3: "sickleavecompanion", // تقرير مرافق
  4: "visitcompamion", // مشهد مراجعة لمرافق
  5: "medicalreport" // تقرير طبي
};

// Reverse mapping for display purposes
export const SICKLEAVE_TYPE_TO_NUMERIC = {
  "sickleave": 1,
  "visitleave": 2,
  "sickleavecompanion": 3,
  "visitcompamion": 4,
  "medicalreport": 5
};

// Mapping for input_sickleave_type to the API route
export const SICKLEAVE_TYPE_MAP = {
  "sickleave": "model_sikleaves_n/sickleavecreate",
  "sickleavecompanion": "model_sikleaves_comp/sickleavecreate",
  "visitleave": "model_sikleaves_visit/sickleavecreate",
  "visitcompamion": "model_sikleaves_comp_visit/sickleavecreate",
  "medicalreport": "model_report/medicalreportcreate",
  // Support for numeric types
  "1": "model_sikleaves_n/sickleavecreate",
  "2": "model_sikleaves_visit/sickleavecreate",
  "3": "model_sikleaves_comp/sickleavecreate",
  "4": "model_sikleaves_comp_visit/sickleavecreate",
  "5": "model_report/medicalreportcreate"
};

// Display names for sickleave types
export const SICKLEAVE_TYPE_NAMES = {
  "sickleave": "اجازة مرضية",
  "sickleavecompanion": "تقرير مرافق مريض",
  "visitleave": "مشهد مراجعة",
  "visitcompamion": "مشهد مراجعة لمرافق",
  "medicalreport": "تقرير طبي",
  // Support for numeric types
  "1": "اجازة مرضية",
  "2": "مشهد مراجعة",
  "3": "تقرير مرافق مريض",
  "4": "مشهد مراجعة لمرافق",
  "5": "تقرير طبي"
};
