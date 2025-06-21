
import { Doctor, Hospital, Nationality, Patient } from "../types/models";

// Get the API URL from localStorage or use default
const getApiUrl = () => {
  const apiUrl = localStorage.getItem("apiUrl") || "https://sohatey.info";
  
  // Remove trailing slash if present
  return apiUrl.endsWith('/') ? apiUrl.slice(0, -1) : apiUrl;
};

// Get barcode settings from localStorage
const getBarcodeSettings = () => {
  return {
    barcodeLogo: localStorage.getItem("barcodeLogo") || "",
    barcodeLink: localStorage.getItem("barcodeLink") || ""
  };
};

// Helper function for API requests
async function apiRequest<T>(
  url: string,
  method: string = "GET",
  data?: any
): Promise<T> {
  const API_URL = getApiUrl();
  const options: RequestInit = {
    method,
    headers: {
      "Content-Type": "application/json",
      "access-control-allow-origin": "*",
      "sec-ch-ua": "\"Chromium\";v=\"134\", \"Not:A-Brand\";v=\"24\", \"Google Chrome\";v=\"134\"",
      "sec-ch-ua-mobile": "?0",
      "sec-ch-ua-platform": "\"Windows\""
    },
    referrerPolicy: "strict-origin-when-cross-origin",
    mode: "cors",
    credentials: "omit"
  };

  if (data) {
    options.body = JSON.stringify(data);
  }

  console.log(`Making ${method} request to: ${API_URL}${url}`);
  
  const response = await fetch(`${API_URL}${url}`, options);
  
  if (!response.ok) {
    console.error(`API request failed: ${response.status} ${response.statusText}`);
    throw new Error(`API request failed: ${response.statusText}`);
  }
  
  return response.json();
}

// Function to download files with progress
async function downloadWithProgress(
  url: string,
  onProgress: (progress: number) => void
): Promise<{ blob: Blob; filename: string }> {
  const API_URL = getApiUrl();
  const fullUrl = `${API_URL}${url}`;
  
  console.log(`Downloading from: ${fullUrl}`);
  
  try {
    const response = await fetch(fullUrl, {
      credentials: "omit",
      mode: "cors",
      headers: {
        "access-control-allow-origin": "*",
        "sec-ch-ua": "\"Chromium\";v=\"134\", \"Not:A-Brand\";v=\"24\", \"Google Chrome\";v=\"134\"",
        "sec-ch-ua-mobile": "?0",
        "sec-ch-ua-platform": "\"Windows\""
      }
    });
    
    if (!response.ok) {
      console.error(`Download failed: ${response.status} ${response.statusText}`);
      throw new Error(`API request failed: ${response.statusText}`);
    }
    
    // Get filename from Content-Disposition header or fallback to sickleaves.pdf
    const contentDisposition = response.headers.get('Content-Disposition');
    const filenameMatch = contentDisposition 
      ? /filename[^;=\n]*=((['"]).*?\2|[^;\n]*)/.exec(contentDisposition) 
      : null;
    const filename = filenameMatch && filenameMatch[1] 
      ? filenameMatch[1].replace(/['"]/g, '') 
      : 'sickleaves.pdf';

    // Get content length for calculating progress
    const contentLength = response.headers.get('Content-Length');
    const total = contentLength ? parseInt(contentLength, 10) : 0;
    
    // Create a reader from the response body
    const reader = response.body?.getReader();
    if (!reader) {
      throw new Error('ReadableStream not supported in this browser.');
    }

    // Read the data
    let receivedLength = 0;
    const chunks: Uint8Array[] = [];

    // eslint-disable-next-line no-constant-condition
    while (true) {
      const { done, value } = await reader.read();
      
      if (done) {
        break;
      }
      
      chunks.push(value);
      receivedLength += value.length;
      
      // Calculate and report progress
      if (total > 0) {
        onProgress(Math.round((receivedLength / total) * 100));
      }
    }
    
    // Concatenate chunks into a single Uint8Array
    const chunksAll = new Uint8Array(receivedLength);
    let position = 0;
    for (const chunk of chunks) {
      chunksAll.set(chunk, position);
      position += chunk.length;
    }
    
    // Create a blob from the data
    const blob = new Blob([chunksAll], { type: response.headers.get('Content-Type') || 'application/pdf' });
    
    console.log(`Download completed: ${filename}, size: ${receivedLength} bytes`);
    
    return { blob, filename };
  } catch (error) {
    console.error("Download error:", error);
    throw error;
  }
}

// Patient API
export const patientAPI = {
  getAll: () => apiRequest<Patient[]>("/api/userall"),
  getRecent: (limit: number = 20) => {
    const API_URL = getApiUrl();
    console.log("Fetching recent patients from:", `${API_URL}/api/user20`);
    return apiRequest<Patient[]>("/api/user20");
  },
  getById: (id: string) => apiRequest<Patient>(`/api/findgsl/${id}`),
  create: (patient: Omit<Patient, "_id">) => apiRequest<Patient>("/api/toolsinfo", "POST", patient),
  update: (id: string, patient: Partial<Patient>) => 
    apiRequest<Patient>(`/api/update/${id}`, "POST", patient),
  delete: (id: string) => apiRequest<{ success: boolean }>(`/api/patients/${id}`, "DELETE"),
  search: (query: string) => {
    const API_URL = getApiUrl();
    console.log("Searching with query:", query, "at URL:", `${API_URL}/api/findgsl/${query}`);
    return apiRequest<{users: Patient[]}>(`/api/findgsl/${query}`).then(data => {
      console.log("Search results:", data);
      return data.users || [];
    });
  },
  generateReport: async (
    id: string, 
    reportType: string,
    onProgress?: (progress: number) => void
  ): Promise<{ blob: Blob; url: string; filename: string } | undefined> => {
    try {
      const API_URL = getApiUrl();
      const barcodeSettings = getBarcodeSettings();
      
      console.log(`Generating report for patient ${id} using type ${reportType}`);
      console.log("Barcode settings:", barcodeSettings);
      
      // Construct the URL with barcode settings if they exist
      let reportUrl = `/${reportType}/${id}`;
      const queryParams = [];
      
      if (barcodeSettings.barcodeLogo) {
        queryParams.push(`barcode_logo=${encodeURIComponent(barcodeSettings.barcodeLogo)}`);
      }
      
      if (barcodeSettings.barcodeLink) {
        queryParams.push(`barcode_link=${encodeURIComponent(barcodeSettings.barcodeLink)}`);
      }
      
      if (queryParams.length > 0) {
        reportUrl += `?${queryParams.join('&')}`;
      }
      
      if (onProgress) {
        // Use progress-enabled download
        try {
          const { blob, filename } = await downloadWithProgress(reportUrl, onProgress);
          
          // Create a URL for the blob
          const url = URL.createObjectURL(blob);
          
          console.log("Report generated successfully, URL created:", url);
          
          // Save to localStorage to replace any previous file
          localStorage.setItem("SickLeaves", url);
          
          return { blob, url, filename };
        } catch (error) {
          console.error("Error in downloadWithProgress:", error);
          throw error;
        }
      } else {
        // Open in new tab (legacy behavior) if no progress callback provided
        window.open(`${API_URL}${reportUrl}`, '_blank');
        return undefined;
      }
    } catch (error) {
      console.error(`Error generating ${reportType} report:`, error);
      throw error;
    }
  },
};

// Hospital API
export const hospitalAPI = {
  getAll: () => apiRequest<Hospital[]>("/api/hospitals"),
  getById: (id: string) => apiRequest<Hospital>(`/api/hospitals/${id}`),
  create: (hospital: Omit<Hospital, "_id">) => apiRequest<Hospital>("/api/hospitals", "POST", hospital),
  update: (id: string, hospital: Partial<Hospital>) => apiRequest<Hospital>(`/api/hospitals/${id}`, "PUT", hospital),
  delete: (id: string) => apiRequest<{ success: boolean }>(`/api/hospitals/${id}`, "DELETE"),
};

// Doctor API
export const doctorAPI = {
  getAll: () => apiRequest<Doctor[]>("/api/doctors"),
  getById: (id: string) => apiRequest<Doctor>(`/api/doctors/${id}`),
  create: (doctor: Omit<Doctor, "_id">) => apiRequest<Doctor>("/api/doctors", "POST", doctor),
  update: (id: string, doctor: Partial<Doctor>) => apiRequest<Doctor>(`/api/doctors/${id}`, "PUT", doctor),
  delete: (id: string) => apiRequest<{ success: boolean }>(`/api/doctors/${id}`, "DELETE"),
};

// Nationality API
export const nationalityAPI = {
  getAll: () => apiRequest<Nationality[]>("/api/nationalities"),
  getById: (id: string) => apiRequest<Nationality>(`/api/nationalities/${id}`),
  create: (nationality: Omit<Nationality, "_id">) => apiRequest<Nationality>("/api/nationalities", "POST", nationality),
  update: (id: string, nationality: Partial<Nationality>) => apiRequest<Nationality>(`/api/nationalities/${id}`, "PUT", nationality),
  delete: (id: string) => apiRequest<{ success: boolean }>(`/api/nationalities/${id}`, "DELETE"),
};
