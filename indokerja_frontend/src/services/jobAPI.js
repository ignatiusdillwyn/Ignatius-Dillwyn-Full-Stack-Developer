import axios from "axios";

const URL = import.meta.env.VITE_JOB_API;

const addJob = async (payload, token) => {
    const response = await axios.post(`${URL}/add`, payload, {
        headers: {
            'Content-Type': 'application/json',
            'access_token': token
        }
    });
    return response.data;
};

const fetchAllJobs = async (token) => {
    const response = await axios.get(`${URL}/getAll`, {
        headers: {
            'Content-Type': 'application/json',
            'access_token': token
        }
    });
    return response.data; 
};

const fetchJobById = async (id, token) => {
    const response = await axios.get(`${URL}/getById/${id}`, {
        headers: {
            'Content-Type': 'application/json',
            'access_token': token
        }
    });
    return response.data; 
};

export {
    addJob,
    fetchAllJobs,
    fetchJobById,
};