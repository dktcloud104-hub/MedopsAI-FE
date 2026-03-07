import { API_CONFIG } from './config';
import { supabase } from './supabase';

// Get current Supabase access token for API requests
async function getAuthHeaders(): Promise<Record<string, string>> {
  const { data } = await supabase.auth.getSession();
  const token = data.session?.access_token;
  return token ? { Authorization: `Bearer ${token}` } : {};
}

// Helper function to map document type to backend field name
function getFieldNameForDocType(docType: string): string {
  switch (docType) {
    case 'Bills':
      return 'bill_details';
    case 'Reports':
      return 'reports';
    case 'Doctor Certificate':
      return 'doctor_medical_certificate';
    case 'Discharge Note':
      return 'discharge_summary_pdf';
    default:
      return 'bill_details';
  }
}

// Generic API call with auth token and 401 refresh/retry
async function apiCall<T>(
  endpoint: string,
  options: RequestInit = {},
  isRetry = false
): Promise<T> {
  const url = API_CONFIG.getUrl(endpoint);
  const authHeaders = await getAuthHeaders();

  const defaultHeaders: Record<string, string> = {
    'Content-Type': 'application/json',
    'ngrok-skip-browser-warning': 'true',
    ...authHeaders,
  };

  const config: RequestInit = {
    ...options,
    headers: {
      ...defaultHeaders,
      ...options.headers,
    },
  };

  const response = await fetch(url, config);
  const contentType = response.headers.get('content-type');

  if (!contentType || !contentType.includes('application/json')) {
    const text = await response.text();
    console.error('Non-JSON response:', text.substring(0, 200));
    throw new Error(`Server returned HTML instead of JSON. Check if backend is running at ${url}`);
  }

  if (response.status === 401 && !isRetry) {
    await supabase.auth.refreshSession();
    return apiCall<T>(endpoint, options, true);
  }

  if (response.status === 401 && isRetry) {
    await supabase.auth.signOut();
    const err = await response.json().catch(() => ({}));
    throw new Error((err as { detail?: string }).detail || 'Session expired. Please sign in again.');
  }

  if (response.status === 403) {
    const err = await response.json().catch(() => ({}));
    throw new Error((err as { detail?: string }).detail || 'Access denied.');
  }

  if (response.status === 503) {
    throw new Error('Service temporarily unavailable. Please try again later.');
  }

  if (!response.ok) {
    throw new Error(`API Error: ${response.status} ${response.statusText}`);
  }

  return response.json();
}

// Patient API functions
export const patientAPI = {
  // Get all patients
  getAll: async () => {
    return apiCall(API_CONFIG.ENDPOINTS.PATIENTS, {
      method: 'GET',
    });
  },

  // Get single patient
  getById: async (id: number | string) => {
    return apiCall(`${API_CONFIG.ENDPOINTS.PATIENTS}/${id}`, {
      method: 'GET',
    });
  },

  // Create new patient with FormData (supports file uploads)
  create: async (patientData: Record<string, unknown>, files?: Array<{ file: File; type: string }>) => {
    const url = API_CONFIG.getUrl(API_CONFIG.ENDPOINTS.PATIENTS);
    
    // Create FormData
    const formData = new FormData();
    
    // Add patient data fields
    formData.append('patient_name', String(patientData.patient_name || ''));
    formData.append('patient_contact', String(patientData.patient_contact || ''));
    formData.append('patient_email', String(patientData.patient_email || ''));
    formData.append('emergency_name', String(patientData.emergency_name || ''));
    formData.append('emergency_email', String(patientData.emergency_email || ''));
    formData.append('emergency_contact', String(patientData.emergency_contact || ''));
    formData.append('admission_date', String(patientData.admission_date || ''));
    formData.append('discharge_date', String(patientData.discharge_date || ''));
    formData.append('medical_condition', String(patientData.medical_condition || ''));
    formData.append('assigned_doctor', String(patientData.assigned_doctor || ''));
    formData.append('age', String(patientData.age || ''));
    formData.append('gender', String(patientData.gender || ''));
    formData.append('doctor_notes', String(patientData.doctor_notes || ''));
    
    // Add files if provided
    if (files && files.length > 0) {
      files.forEach((fileObj) => {
        const fieldName = getFieldNameForDocType(fileObj.type);
        formData.append(fieldName, fileObj.file);
      });
    }
    
    const authHeaders = await getAuthHeaders();
    const response = await fetch(url, {
      method: 'POST',
      body: formData,
      headers: {
        'ngrok-skip-browser-warning': 'true',
        ...authHeaders,
      },
    });

    const contentType = response.headers.get('content-type');
    if (!contentType || !contentType.includes('application/json')) {
      const text = await response.text();
      console.error('Non-JSON response:', text.substring(0, 200));
      throw new Error(`Server returned HTML instead of JSON. Check if backend is running at ${url}`);
    }

    if (response.status === 401) {
      await supabase.auth.refreshSession();
      const retryHeaders = await getAuthHeaders();
      const retry = await fetch(url, {
        method: 'POST',
        body: formData,
        headers: { 'ngrok-skip-browser-warning': 'true', ...retryHeaders },
      });
      if (retry.status === 401) {
        await supabase.auth.signOut();
        throw new Error('Session expired. Please sign in again.');
      }
      if (!retry.ok) throw new Error(`API Error: ${retry.status} ${retry.statusText}`);
      return retry.json();
    }

    if (!response.ok) {
      const errorData = await response.json().catch(() => null);
      if (errorData?.detail && Array.isArray(errorData.detail)) {
        const errors = errorData.detail.map((err: { loc: string[]; msg: string }) => {
          const field = err.loc[err.loc.length - 1];
          return `${field}: ${err.msg}`;
        }).join('\n');
        throw new Error(`Validation Error:\n${errors}`);
      }
      throw new Error(`API Error: ${response.status} ${response.statusText}`);
    }

    return response.json();
  },

  // Update patient
  update: async (id: number, patientData: Record<string, unknown>) => {
    return apiCall(`${API_CONFIG.ENDPOINTS.PATIENTS}/${id}`, {
      method: 'PUT',
      body: JSON.stringify(patientData),
    });
  },

  // Delete patient
  delete: async (id: number) => {
    return apiCall(`${API_CONFIG.ENDPOINTS.PATIENTS}/${id}`, {
      method: 'DELETE',
    });
  },
};

// Auth API (verify token and get current user from backend)
export const authAPI = {
  getMe: async (): Promise<{ id: string; email: string; role: string }> => {
    return apiCall(API_CONFIG.ENDPOINTS.AUTH_ME, { method: 'GET' });
  },
};


