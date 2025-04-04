import axios from "axios";
import Cookies from "js-cookie";

const BACKEND_URL = "http://localhost:8000";

// Create axios instance with default config
const api = axios.create({
    baseURL: BACKEND_URL,
    timeout: 5000, // 5 second timeout
});

// ---------------------create admin login api -------------------------------
export const adminLogin = async (data) => {
    try {
        const response = await api.post('/admin/login', data);
        const token = response?.data?.token;
        const id = response?.data?.data?._id;
        const type = response?.data?.type;

        Cookies.set('token', token);

        return {
            status: true,
            message: "Admin Logged in successfully",
            token: token,
            id: id,
            type
        };
    } catch (error) {
        console.error('API Error:', error);

        if (error.code === 'ERR_NETWORK') {
            return {
                status: false,
                message: "Unable to connect to server. Please check if the server is running."
            };
        }

        if (error?.response?.status === 400) {
            return { status: false, message: error.response.data.message };
        }

        return {
            status: false,
            message: error?.response?.data?.message || "An unexpected error occurred"
        };
    }
};

// Configure axios defaults for authorized requests
const getAuthHeader = () => {
    const token = Cookies.get('token');
    return {
        headers: {
            Authorization: `Bearer ${token}`,
            // Remove forced Content-Type to let axios set it automatically
        },
    };
};

// ---------------------create category api -------------------------------
export const createCategory = async (data) => {
    try {
        const response = await api.post(
            '/category/create',
            data,
            getAuthHeader()
        );
        return {
            status: true,
            message: "Category created successfully",
            data: response.data,
        };
    } catch (error) {
        console.error('API Error:', error);

        if (error.code === 'ERR_NETWORK') {
            return {
                status: false,
                message: "Unable to connect to server. Please check if the server is running."
            };
        }

        if (error?.response?.status === 400) {
            return { status: false, message: error.response.data.message };
        }

        return {
            status: false,
            message: error?.response?.data?.message || "An unexpected error occurred"
        };
    }
};

// ---------------------------- Get Category API -------------------------------
export const getCategories = async () => {
    try {
        const response = await api.get('/category/viewAll');
        console.log('API Response:', response);
        return {
            status: true,
            message: "Categories fetched successfully",
            data: response.data.data,
        };
    } catch (error) {
        console.error('API Error:', error);

        if (error.code === 'ERR_NETWORK') {
            return {
                status: false,
                message: "Unable to connect to server. Please check if the server is running."
            };
        }

        if (error?.response?.status === 400) {
            return { status: false, message: error.response.data.message };
        }

        return {
            status: false,
            message: error?.response?.data?.message || "An unexpected error occurred"
        };
    }
};

// ---------------------------- Category APIs -------------------------------
export const updateCategory = async (id, data) => {
    try {
        const response = await api.put(`/category/update/${id}`, data, getAuthHeader());
        return {
            status: true,
            message: "Category updated successfully",
            data: response.data,
        };
    } catch (error) {
        console.error('API Error:', error);
        return {
            status: false,
            message: error?.response?.data?.message || "An unexpected error occurred"
        };
    }
};

export const deleteCategory = async (id) => {
    try {
        const response = await api.delete(`/category/delete/${id}`, getAuthHeader());
        return {
            status: true,
            message: "Category deleted successfully",
        };
    } catch (error) {
        console.error('API Error:', error);
        return {
            status: false,
            message: error?.response?.data?.message || "An unexpected error occurred"
        };
    }
};

// ---------------------create Brand api -------------------------------
export const createBrand = async (data) => {
    try {
        const response = await api.post('/brand/create', 
            data, 
            getAuthHeader()
        );
        return {
            status: true,
            message: "Brand created successfully",
            data: response.data,
        };
    } catch (error) {
        console.error('API Error:', error);

        if (error.code === 'ERR_NETWORK') {
            return {
                status: false,
                message: "Unable to connect to server. Please check if the server is running."
            };
        }

        if (error?.response?.status === 400) {
            return { status: false, message: error.response.data.message };
        }

        return {
            status: false,
            message: error?.response?.data?.message || "An unexpected error occurred"
        };
    }
};

// ---------------------------- Get Brand API -------------------------------
export const getBrands = async () => {
    try {
        const response = await api.get('/brand/viewAll');
        console.log('API Response:', response);
        return {
            status: true,
            message: "Brands fetched successfully",
            data: response.data.data,
        };
    } catch (error) {
        console.error('API Error:', error);

        if (error.code === 'ERR_NETWORK') {
            return {
                status: false,
                message: "Unable to connect to server. Please check if the server is running."
            };
        }

        if (error?.response?.status === 400) {
            return { status: false, message: error.response.data.message };
        }

        return {
            status: false,
            message: error?.response?.data?.message || "An unexpected error occurred"
        };
    }
};

// ---------------------------- Brand APIs -------------------------------
export const updateBrand = async (id, data) => {
    try {
        const response = await api.put(`/brand/update/${id}`, data, getAuthHeader());
        return {
            status: true,
            message: "Brand updated successfully",
            data: response.data,
        };
    } catch (error) {
        console.error('API Error:', error);
        return {
            status: false,
            message: error?.response?.data?.message || "An unexpected error occurred"
        };
    }
};

export const deleteBrand = async (id) => {
    try {
        const response = await api.delete(`/brand/delete/${id}`, getAuthHeader());
        return {
            status: true,
            message: "Brand deleted successfully",
        };
    } catch (error) {
        console.error('API Error:', error);
        return {
            status: false,
            message: error?.response?.data?.message || "An unexpected error occurred"
        };
    }
};

// ---------------------create Package api -------------------------------
export const createPackage = async (data) => {
    try {
        const response = await api.post('/packageSize/create', 
            data, 
            getAuthHeader()
        );
        return {
            status: true,
            message: "Package created successfully",
            data: response.data,
        };
    } catch (error) {
        console.error('API Error:', error);
        if (error.code === 'ERR_NETWORK') {
            return {
                status: false,
                message: "Unable to connect to server. Please check if the server is running."
            };
        }
        return {
            status: false,
            message: error?.response?.data?.message || "An unexpected error occurred"
        };
    }
};

// ---------------------------- Get Packages API -------------------------------
export const getPackages = async () => {
    try {
        const response = await api.get('/packageSize/viewAll');
        return {
            status: true,
            message: "Packages fetched successfully",
            data: response.data.data,
        };
    } catch (error) {
        console.error('API Error:', error);
        if (error.code === 'ERR_NETWORK') {
            return {
                status: false,
                message: "Unable to connect to server. Please check if the server is running."
            };
        }
        return {
            status: false,
            message: error?.response?.data?.message || "An unexpected error occurred"
        };
    }
};

// ---------------------------- Package APIs -------------------------------
export const updatePackage = async (id, data) => {
    try {
        const response = await api.put(`/packageSize/update/${id}`, data, getAuthHeader());
        return {
            status: true,
            message: "Package updated successfully",
            data: response.data,
        };
    } catch (error) {
        console.error('API Error:', error);
        return {
            status: false,
            message: error?.response?.data?.message || "An unexpected error occurred"
        };
    }
};

export const deletePackage = async (id) => {
    try {
        const response = await api.delete(`/packageSize/delete/${id}`, getAuthHeader());
        return {
            status: true,
            message: "Package deleted successfully",
        };
    } catch (error) {
        console.error('API Error:', error);
        return {
            status: false,
            message: error?.response?.data?.message || "An unexpected error occurred"
        };
    }
};

// ---------------------create Material api -------------------------------
export const createMaterial = async (data) => {
    try {
        const response = await api.post('/material/create', 
            data, 
            getAuthHeader()
        );
        return {
            status: true,
            message: "Material created successfully",
            data: response.data,
        };
    } catch (error) {
        console.error('API Error:', error);
        if (error.code === 'ERR_NETWORK') {
            return {
                status: false,
                message: "Unable to connect to server. Please check if the server is running."
            };
        }
        return {
            status: false,
            message: error?.response?.data?.message || "An unexpected error occurred"
        };
    }
};

// ---------------------------- Get Materials API -------------------------------
export const getMaterials = async () => {
    try {
        const response = await api.get('/material/viewAll');
        return {
            status: true,
            message: "Materials fetched successfully",
            data: response.data.data,
        };
    } catch (error) {
        console.error('API Error:', error);
        if (error.code === 'ERR_NETWORK') {
            return {
                status: false,
                message: "Unable to connect to server. Please check if the server is running."
            };
        }
        return {
            status: false,
            message: error?.response?.data?.message || "An unexpected error occurred"
        };
    }
};

// ---------------------------- Material APIs -------------------------------
export const updateMaterial = async (id, data) => {
    try {
        const response = await api.put(`/material/update/${id}`, data, getAuthHeader());
        return {
            status: true,
            message: "Material updated successfully",
            data: response.data,
        };
    } catch (error) {
        console.error('API Error:', error);
        return {
            status: false,
            message: error?.response?.data?.message || "An unexpected error occurred"
        };
    }
};

export const deleteMaterial = async (id) => {
    try {
        const response = await api.delete(`/material/delete/${id}`, getAuthHeader());
        return {
            status: true,
            message: "Material deleted successfully",
        };
    } catch (error) {
        console.error('API Error:', error);
        return {
            status: false,
            message: error?.response?.data?.message || "An unexpected error occurred"
        };
    }
};

