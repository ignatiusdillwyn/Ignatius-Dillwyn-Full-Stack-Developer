import axios from "axios";

const URL = import.meta.env.VITE_USER_COMPANY_API;

const register = async (payload) => {
    // console.log('Register payload:', payload); 
    const response = await axios.post(`${URL}/register`, payload, {
        headers: {
            'Content-Type': 'application/json', 
        }
    });
    return response.data;
};

const login = async (payload) => {
    // console.log('Login payload:', payload); 
    // console.log('Login URL:', `${URL}/login`); 
    const response = await axios.post(`${URL}/login`, payload, {
        headers: {
            'Content-Type': 'application/json', 
        }
    });
    return response.data;
};

export { register, login };
