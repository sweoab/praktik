import { getFetcher, postFetcher, putFetcher, deleteFetcher } from '../backendFetcher.js';

const API_BASE = '/internships';

// Get all internships with optional filtering
export const getInternships = async (filters = {}) => {
  const params = new URLSearchParams();
  
  Object.entries(filters).forEach(([key, value]) => {
    if (value !== undefined && value !== null && value !== '') {
      params.append(key, value);
    }
  });

  const queryString = params.toString();
  const url = queryString ? `${API_BASE}?${queryString}` : API_BASE;
  
  return getFetcher(url);
};

// Get single internship by ID
export const getInternship = async (id) => {
  return getFetcher(`${API_BASE}/${id}`);
};

// Alias for getInternship for consistency
export const getInternshipById = getInternship;

// Create new internship
export const createInternship = async (internshipData) => {
  return postFetcher(API_BASE, internshipData);
};

// Update internship
export const updateInternship = async (id, internshipData) => {
  return putFetcher(`${API_BASE}/${id}`, internshipData);
};

// Delete internship
export const deleteInternship = async (id) => {
  return deleteFetcher(`${API_BASE}/${id}`);
};

// Apply to internship
export const applyToInternship = async (id, applicationData) => {
  return postFetcher(`${API_BASE}/${id}/apply`, applicationData);
};

// Submit application (alias for applyToInternship for consistency)
export const submitApplication = async (applicationData) => {
  return postFetcher('/applications', applicationData);
};

// Get applications (for dashboard/statistics)
export const getApplications = async (filters = {}) => {
  const params = new URLSearchParams();
  
  Object.entries(filters).forEach(([key, value]) => {
    if (value !== undefined && value !== null && value !== '') {
      params.append(key, value);
    }
  });

  const queryString = params.toString();
  const url = queryString ? `/applications?${queryString}` : '/applications';
  
  return getFetcher(url);
};

// Get application statistics
export const getApplicationStats = async () => {
  return getFetcher('/applications/stats');
};

// Search internships
export const searchInternships = async (query, options = {}) => {
  const params = new URLSearchParams({ ...options });
  const queryString = params.toString();
  const url = queryString 
    ? `/internships/search/${encodeURIComponent(query)}?${queryString}`
    : `/internships/search/${encodeURIComponent(query)}`;
  
  return getFetcher(url);
};

// Helper function to format internship data for display
export const formatInternshipData = (internship) => {
  return {
    ...internship,
    required_skills: Array.isArray(internship.required_skills) 
      ? internship.required_skills 
      : JSON.parse(internship.required_skills || '[]'),
    preferred_skills: Array.isArray(internship.preferred_skills)
      ? internship.preferred_skills
      : JSON.parse(internship.preferred_skills || '[]'),
    compensation_formatted: internship.compensation 
      ? `${internship.compensation.toLocaleString('sv-SE')} SEK/månad`
      : 'Ej specificerad',
    duration_formatted: internship.duration_weeks 
      ? `${internship.duration_weeks} veckor`
      : 'Ej specificerad',
    deadline_formatted: internship.application_deadline
      ? new Date(internship.application_deadline).toLocaleDateString('sv-SE')
      : 'Ingen deadline',
    remote_text: internship.remote_allowed ? 'Distans tillåten' : 'På plats'
  };
};
