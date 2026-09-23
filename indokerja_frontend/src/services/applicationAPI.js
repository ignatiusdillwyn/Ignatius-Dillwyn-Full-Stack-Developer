import axios from "axios";

const URL = import.meta.env.VITE_APPLICATION_API;

const addApplication = async (payload, token) => {
    const response = await axios.post(`${URL}/add`, payload, {
        headers: {
            'Content-Type': 'application/json',
            'access_token': token
        }
    });
    return response.data;
};

const fetchAllApplicationsByUserCompanyId = async (token) => {
    const response = await axios.get(`${URL}/getAllbyUserCompanyId`, {
        headers: {
            'Content-Type': 'application/json',
            'access_token': token
        }
    });
    return response.data; 
};

const fetchAllApplicationsByUserJobSeekerId = async (token) => {
    const response = await axios.get(`${URL}/getAllbyJobSeekerId`, {
        headers: {
            'Content-Type': 'application/json',
            'access_token': token
        }
    });
    return response.data; 
};

const fetchApplicationById = async (id, token) => {
    const response = await axios.get(`${URL}/getById/${id}`, {
        headers: {
            'Content-Type': 'application/json',
            'access_token': token
        }
    });
    return response.data; 
};

const updateApplicationById = async (id, payload, token) => {
    const response = await axios.post(`${URL}/update/${id}`, payload, {
      headers: {
        'Content-Type': 'application/json',
        'access_token': token,
      },
    });
    return response.data;
  };

export {
    addApplication,
    fetchAllApplicationsByUserCompanyId,
    fetchAllApplicationsByUserJobSeekerId,
    fetchApplicationById,
    updateApplicationById,
};