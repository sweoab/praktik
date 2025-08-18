import { getFetcher, postFetcher, putFetcher, deleteFetcher } from '../backendFetcher.js';

const API_BASE = '/companies';

// Get all companies with optional filtering
export const getCompanies = async (filters = {}) => {
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

// Get single company by ID
export const getCompany = async (id) => {
  return getFetcher(`${API_BASE}/${id}`);
};

// Get current user's company
export const getMyCompany = async () => {
  return getFetcher(`${API_BASE}/profile/my-company`);
};

// Create new company
export const createCompany = async (companyData) => {
  return postFetcher(API_BASE, companyData);
};

// Update company
export const updateCompany = async (id, companyData) => {
  return putFetcher(`${API_BASE}/${id}`, companyData);
};

// Get company's internships
export const getCompanyInternships = async (id, status = 'active') => {
  return getFetcher(`${API_BASE}/${id}/internships?status=${status}`);
};
