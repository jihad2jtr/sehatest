
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { ThemeProvider } from "@/lib/theme-provider";

// Pages
import Index from "./pages/Index";
import NotFound from "./pages/NotFound";
import PatientsList from "./pages/patients/PatientsList";
import AddPatient from "./pages/patients/AddPatient";
import HospitalsList from "./pages/hospitals/HospitalsList";
import AddHospital from "./pages/hospitals/AddHospital";
import DoctorsList from "./pages/doctors/DoctorsList";
import AddDoctor from "./pages/doctors/AddDoctor";
import NationalitiesList from "./pages/nationalities/NationalitiesList";
import AddNationality from "./pages/nationalities/AddNationality";
import Settings from "./pages/Settings";
import SearchResults from "./pages/SearchResults";
import EditPatient from "./pages/patients/EditPatient";

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false,
      retry: 1,
    },
  },
});

const App = () => (
  <ThemeProvider>
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<Index />} />
            
            {/* Patient Routes */}
            <Route path="/patients" element={<PatientsList />} />
            <Route path="/patients/recent" element={<PatientsList limit={20} />} />
            <Route path="/patients/add" element={<AddPatient />} />
            <Route path="/patients/edit/:id" element={<AddPatient />} />
            <Route path="/patients/detail-edit/:id" element={<EditPatient />} />
            
            {/* Hospital Routes */}
            <Route path="/hospitals" element={<HospitalsList />} />
            <Route path="/hospitals/add" element={<AddHospital />} />
            <Route path="/hospitals/edit/:id" element={<AddHospital />} />
            
            {/* Doctor Routes */}
            <Route path="/doctors" element={<DoctorsList />} />
            <Route path="/doctors/add" element={<AddDoctor />} />
            <Route path="/doctors/edit/:id" element={<AddDoctor />} />
            
            {/* Nationality Routes */}
            <Route path="/nationalities" element={<NationalitiesList />} />
            <Route path="/nationalities/add" element={<AddNationality />} />
            <Route path="/nationalities/edit/:id" element={<AddNationality />} />
            
            {/* Settings */}
            <Route path="/settings" element={<Settings />} />
            
            {/* Search */}
            <Route path="/search/:query" element={<SearchResults />} />
            
            {/* Catch-all route */}
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </TooltipProvider>
    </QueryClientProvider>
  </ThemeProvider>
);

export default App;
