import axios from "axios";
import Cookies from "js-cookie";

// const BACKEND_URL = "http://89.116.134.164:8500";
const BACKEND_URL = "https://backend.affaredoro.com";

export default BACKEND_URL;
const api = axios.create({
  baseURL: BACKEND_URL,
  timeout: 5000,
});

// ---------------------create admin login api -------------------------------
export const adminLogin = async (data) => {
  try {
    const response = await api.post("/admin/login", data);
    const token = response?.data?.token;
    const id = response?.data?.data?._id;
    const type = response?.data?.type;

    Cookies.set("token", token);

    return {
      status: true,
      message: "Admin Logged in successfully",
      token: token,
      id: id,
      type,
    };
  } catch (error) {
    console.error("API Error:", error);

    if (error.code === "ERR_NETWORK") {
      return {
        status: false,
        message:
          "Unable to connect to server. Please check if the server is running.",
      };
    }

    if (error?.response?.status === 400) {
      return { status: false, message: error.response.data.message };
    }

    return {
      status: false,
      message: error?.response?.data?.message || "An unexpected error occurred",
    };
  }
};

// Configure axios defaults for authorized requests
const getAuthHeader = () => {
  const token = Cookies.get("token");
  if (!token) {
    throw new Error("No authentication token found");
  }
  return {
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    },
  };
};

// ---------------------------- Get product API -------------------------------
export const getProducts = async () => {
  try {
    const response = await api.get("/product/viewAll");
    console.log("API Response:", response);
    return {
      status: true,
      message: "Categories fetched successfully",
      data: response.data.data,
    };
  } catch (error) {
    console.error("API Error:", error);

    if (error.code === "ERR_NETWORK") {
      return {
        status: false,
        message:
          "Unable to connect to server. Please check if the server is running.",
      };
    }

    if (error?.response?.status === 400) {
      return { status: false, message: error.response.data.message };
    }

    return {
      status: false,
      message: error?.response?.data?.message || "An unexpected error occurred",
    };
  }
};

// ---------------------------- Get All Orders API -------------------------------
export const getAllOrders = async (params = {}) => {
  try {
    const token = Cookies.get("token");
    if (!token) {
      alert("No token found in cookies");
    }

    // Construct query parameters
    const queryParams = new URLSearchParams();
    if (params.bumpOrder !== undefined) {
      queryParams.append("bumpOrder", params.bumpOrder);
    }
    if (params.status) {
      queryParams.append("status", params.status);
    }

    const response = await api.get(`/order/viewAll?${queryParams.toString()}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    console.log("API Response:", response);
    return {
      status: true,
      message: "Orders fetched successfully",
      data: response.data.data,
    };
  } catch (error) {
    console.error("API Error:", error);

    if (error.code === "ERR_NETWORK") {
      return {
        status: false,
        message:
          "Unable to connect to server. Please check if the server is running.",
      };
    }

    if (error?.response?.status === 400) {
      return { status: false, message: error.response.data.message };
    }

    return {
      status: false,
      message: error?.response?.data?.message || "An unexpected error occurred",
    };
  }
};

// ---------------------------- Create Bump API -------------------------------
export const createBump = async (data) => {
  try {
    const response = await api.post("/bump/create", data, getAuthHeader());
    return {
      status: true,
      message: "Bump created successfully",
      data: response.data,
    };
  } catch (error) {
    console.error("API Error:", error);
    return {
      status: false,
      message: error?.response?.data?.message || "An unexpected error occurred",
    };
  }
};

// ---------------------------- Get Bump Products API -------------------------------
export const getBumps = async () => {
  try {
    const response = await api.get("/bump/viewAll");
    return {
      status: true,
      message: "Bump products fetched successfully",
      data: response.data.data,
    };
  } catch (error) {
    console.error("API Error:", error);
    return {
      status: false,
      message: error?.response?.data?.message || "An unexpected error occurred",
    };
  }
};

// ---------------------------- Delete Bump API -------------------------------
export const deleteBump = async (id) => {
  try {
    const response = await api.delete(`/bump/delete/${id}`, getAuthHeader());
    return {
      status: true,
      message: "Bump deleted successfully",
      data: response.data,
    };
  } catch (error) {
    console.error("API Error:", error);
    return {
      status: false,
      message: error?.response?.data?.message || "An unexpected error occurred",
    };
  }
};

// ----------------------------- Update Bump API -------------------------------
export const updateBump = async (id, data) => {
  try {
    const response = await api.put(`/bump/update/${id}`, data, getAuthHeader());
    return {
      status: true,
      message: "Bump updated successfully",
      data: response.data,
    };
  } catch (error) {
    console.error("API Error:", error);
    return {
      status: false,
      message: error?.response?.data?.message || "An unexpected error occurred",
    };
  }
};

// ---------------------create category api -------------------------------
export const createCategory = async (data) => {
  try {
    const token = Cookies.get("token");
    const response = await api.post(`/category/create`, data, {
      headers: {
        Authorization: `Bearer ${token}`
      },
    });
    return {
      status: true,
      message: "Category created successfully",
      data: response.data,
    };
  } catch (error) {
    console.error("API Error:", error);

    if (error.code === "ERR_NETWORK") {
      return {
        status: false,
        message:
          "Unable to connect to server. Please check if the server is running.",
      };
    }

    if (error?.response?.status === 400) {
      return { status: false, message: error.response.data.message };
    }

    return {
      status: false,
      message: error?.response?.data?.message || "An unexpected error occurred",
    };
  }
};

// ---------------------------- Get Category API -------------------------------
export const getCategories = async () => {
  try {
    const response = await api.get("/category/viewAll");
    console.log("API Response:", response);
    return {
      status: true,
      message: "Categories fetched successfully",
      data: response.data.data,
    };
  } catch (error) {
    console.error("API Error:", error);

    if (error.code === "ERR_NETWORK") {
      return {
        status: false,
        message:
          "Unable to connect to server. Please check if the server is running.",
      };
    }

    if (error?.response?.status === 400) {
      return { status: false, message: error.response.data.message };
    }

    return {
      status: false,
      message: error?.response?.data?.message || "An unexpected error occurred",
    };
  }
};

export const fn_getFormattedCategories = async () => {
  try {
    const response = await api.get("/category/get-format");
    return {
      status: true,
      message: "Categories fetched successfully",
      data: response?.data,
    };
  } catch (error) {
    console.error("API Error:", error);

    if (error.code === "ERR_NETWORK") {
      return {
        status: false,
        message:
          "Unable to connect to server. Please check if the server is running.",
      };
    }

    if (error?.response?.status === 400) {
      return { status: false, message: error.response.data.message };
    }

    return {
      status: false,
      message: error?.response?.data?.message || "An unexpected error occurred",
    };
  }
};

// ---------------------------- Update Category APIs -------------------------------
export const updateCategory = async (id, data) => {
  try {
    const token = Cookies.get("token");
    const response = await api.put(`/category/update/${id}`, data, {
      headers: {
        Authorization: `Bearer ${token}`
      },
    }
    );
    return {
      status: true,
      message: "Category updated successfully",
      data: response.data,
    };
  } catch (error) {
    console.error("API Error:", error);
    return {
      status: false,
      message: error?.response?.data?.message || "An unexpected error occurred",
    };
  }
};

// ---------------------------- Delete Category APIs -------------------------------
export const deleteCategory = async (id) => {
  try {
    const token = Cookies.get("token");
    if (!token) {
      return {
        status: false,
        message: "Please login to perform this action",
      };
    }

    const response = await api.delete(
      `/category/delete-category/${id}`,
      getAuthHeader()
    );
    return {
      status: true,
      message: "Category deleted successfully",
      data: response.data,
    };
  } catch (error) {
    console.error("API Error:", error);
    if (error?.response?.status === 401) {
      return {
        status: false,
        message: "Your session has expired. Please login again.",
      };
    }
    return {
      status: false,
      message: error?.response?.data?.message || "An unexpected error occurred",
    };
  }
};


// ---------------------create Brand api -------------------------------
export const createBrand = async (data) => {
  try {
    const token = Cookies.get("token");
    if (!token) {
      return {
        status: false,
        message: "Please login to perform this action",
      };
    }

    const response = await api.post("/brand/create", data, {
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "multipart/form-data",
      },
    });
    return {
      status: true,
      message: "Brand created successfully",
      data: response.data,
    };
  } catch (error) {
    console.error("API Error:", error);

    if (error.code === "ERR_NETWORK") {
      return {
        status: false,
        message:
          "Unable to connect to server. Please check if the server is running.",
      };
    }

    if (error?.response?.status === 400) {
      return { status: false, message: error.response.data.message };
    }

    return {
      status: false,
      message: error?.response?.data?.message || "An unexpected error occurred",
    };
  }
};

// ---------------------------- Get Brand API -------------------------------
export const getBrands = async () => {
  try {
    const response = await api.get("/brand/viewAll");
    console.log("API Response:", response);
    return {
      status: true,
      message: "Brands fetched successfully",
      data: response.data.data,
    };
  } catch (error) {
    console.error("API Error:", error);

    if (error.code === "ERR_NETWORK") {
      return {
        status: false,
        message:
          "Unable to connect to server. Please check if the server is running.",
      };
    }

    if (error?.response?.status === 400) {
      return { status: false, message: error.response.data.message };
    }

    return {
      status: false,
      message: error?.response?.data?.message || "An unexpected error occurred",
    };
  }
};

// ---------------------------- Brand APIs -------------------------------
export const updateBrand = async (id, data) => {
  try {
    const token = Cookies.get("token");
    if (!token) {
      return {
        status: false,
        message: "Please login to perform this action",
      };
    }

    if (!id) {
      return {
        status: false,
        message: "Brand ID is required",
      };
    }

    const response = await api.put(`/brand/update/${id}`, data, {
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "multipart/form-data",
      },
    });

    if (!response.data) {
      throw new Error("No response data received from server");
    }

    return {
      status: true,
      message: "Brand updated successfully",
      data: response.data,
    };
  } catch (error) {
    console.error("API Error:", error);

    if (error.code === "ERR_NETWORK") {
      return {
        status: false,
        message: "Unable to connect to server. Please check if the server is running.",
      };
    }

    if (error?.response?.status === 401) {
      return {
        status: false,
        message: "Your session has expired. Please login again.",
      };
    }

    if (error?.response?.status === 404) {
      return {
        status: false,
        message: "Brand not found",
      };
    }

    if (error?.response?.status === 400) {
      return {
        status: false,
        message: error.response.data.message || "Invalid request data",
      };
    }

    return {
      status: false,
      message: error?.response?.data?.message || "An unexpected error occurred",
    };
  }
};

// ---------------------------- Delete Brand APIs -------------------------------
export const deleteBrand = async (id) => {
  try {
    const token = Cookies.get("token");
    if (!token) {
      return {
        status: false,
        message: "Please login to perform this action",
      };
    }

    const response = await axios.delete(
      `${BACKEND_URL}/brand/delete/${id}`,
      getAuthHeader()
    );
    return {
      status: true,
      message: "Brand deleted successfully",
      data: response.data,
    };
  } catch (error) {
    console.error("API Error:", error);

    if (error?.response?.status === 401) {
      return {
        status: false,
        message: "Your session has expired. Please login again.",
      };
    }

    if (error?.response?.status === 404) {
      return {
        status: false,
        message: "Brand not found",
      };
    }

    if (error.code === "ERR_NETWORK") {
      return {
        status: false,
        message:
          "Unable to connect to server. Please check if the server is running.",
      };
    }

    return {
      status: false,
      message: error?.response?.data?.message || "An unexpected error occurred",
    };
  }
};

// ----------------------------Create Product  Color APIs -------------------------------
export const createColor = async (data) => {
  try {
    const response = await api.post("/color/create", data, getAuthHeader());
    return {
      status: true,
      message: "Color created successfully",
      data: response.data,
    };
  } catch (error) {
    console.error("API Error:", error);
    return {
      status: false,
      message: error?.response?.data?.message || "An unexpected error occurred",
    };
  }
};

// ---------------------------- Get Product Colors API -------------------------------
export const getColors = async () => {
  try {
    const response = await api.get("/color/viewAll");
    return {
      status: true,
      message: "Colors fetched successfully",
      data: response.data.data,
    };
  } catch (error) {
    console.error("API Error:", error);
    return {
      status: false,
      message: error?.response?.data?.message || "An unexpected error occurred",
    };
  }
};

// ---------------------------- Update Product  Color APIs -------------------------------
export const updateColor = async (id, data) => {
  try {
    const response = await api.put(
      `/color/update/${id}`,
      data,
      getAuthHeader()
    );
    return {
      status: true,
      message: "Color updated successfully",
      data: response.data,
    };
  } catch (error) {
    console.error("API Error:", error);
    return {
      status: false,
      message: error?.response?.data?.message || "An unexpected error occurred",
    };
  }
};

// ---------------------------- Delete Product Color APIs -------------------------------
export const deleteColor = async (id) => {
  try {
    const response = await api.delete(`/color/delete/${id}`, getAuthHeader());
    return {
      status: true,
      message: "Color deleted successfully",
    };
  } catch (error) {
    console.error("API Error:", error);
    return {
      status: false,
      message: error?.response?.data?.message || "An unexpected error occurred",
    };
  }
};

// ---------------------------- Create Product Size APIs -------------------------------
export const createSize = async (data) => {
  try {
    const response = await api.post("/size/create", data, getAuthHeader());
    return {
      status: true,
      message: "Size created successfully",
      data: response.data,
    };
  } catch (error) {
    console.error("API Error:", error);
    return {
      status: false,
      message: error?.response?.data?.message || "An unexpected error occurred",
    };
  }
};

// ---------------------------- Get Product Sizes API -------------------------------
export const getSizes = async (categoryId) => {
  try {
    // If categoryId is not provided, fetch all sizes
    const url = categoryId
      ? `/size/viewAll?categoryId=${categoryId}`
      : "/size/viewAll";

    console.log("Fetching sizes with URL:", url);
    const response = await api.get(url);
    console.log("Sizes API response:", response);

    return {
      status: true,
      message: "Sizes fetched successfully",
      data: response.data.data,
    };
  } catch (error) {
    console.error("API Error:", error);
    return {
      status: false,
      message: error?.response?.data?.message || "An unexpected error occurred",
    };
  }
};

// ---------------------------- Update Product Size APIs -------------------------------
export const updateSize = async (id, data) => {
  try {
    const response = await api.put(`/size/update/${id}`, data, getAuthHeader());
    return {
      status: true,
      message: "Size updated successfully",
      data: response.data,
    };
  } catch (error) {
    console.error("API Error:", error);
    return {
      status: false,
      message: error?.response?.data?.message || "An unexpected error occurred",
    };
  }
};

// ---------------------------- Delete Product Size APIs -------------------------------
export const deleteSize = async (id) => {
  try {
    const response = await api.delete(`/size/delete/${id}`, getAuthHeader());
    return {
      status: true,
      message: "Size deleted successfully",
    };
  } catch (error) {
    console.error("API Error:", error);
    return {
      status: false,
      message: error?.response?.data?.message || "An unexpected error occurred",
    };
  }
};

// ---------------------Create Product Condition API -------------------------------
export const createCondition = async (data) => {
  try {
    const response = await api.post("/condition/create", data, getAuthHeader());
    return {
      status: true,
      message: "Condition created successfully",
      data: response.data,
    };
  } catch (error) {
    console.error("API Error:", error);
    if (error.code === "ERR_NETWORK") {
      return {
        status: false,
        message:
          "Unable to connect to server. Please check if the server is running.",
      };
    }
    return {
      status: false,
      message: error?.response?.data?.message || "An unexpected error occurred",
    };
  }
};

// ---------------------------- Get Product Conditions API -------------------------------
export const getConditions = async () => {
  try {
    const response = await api.get("/condition/viewAll");
    return {
      status: true,
      message: "Conditions fetched successfully",
      data: response.data.data,
    };
  } catch (error) {
    console.error("API Error:", error);
    if (error.code === "ERR_NETWORK") {
      return {
        status: false,
        message:
          "Unable to connect to server. Please check if the server is running.",
      };
    }
    return {
      status: false,
      message: error?.response?.data?.message || "An unexpected error occurred",
    };
  }
};

// ---------------------------- Update Product Condition APIs -------------------------------
export const updateCondition = async (id, data) => {
  try {
    const response = await api.put(
      `/condition/update/${id}`,
      data,
      getAuthHeader()
    );
    return {
      status: true,
      message: "Condition updated successfully",
      data: response.data,
    };
  } catch (error) {
    console.error("API Error:", error);
    if (error.code === "ERR_NETWORK") {
      return {
        status: false,
        message:
          "Unable to connect to server. Please check if the server is running.",
      };
    }
    return {
      status: false,
      message: error?.response?.data?.message || "An unexpected error occurred",
    };
  }
};

// ---------------------------- Delete Product Condition APIs -------------------------------
export const deleteCondition = async (id) => {
  try {
    const response = await axios.delete(
      `${BACKEND_URL}/condition/delete/${id}`,
      getAuthHeader()
    );
    return {
      status: true,
      message: "Condition deleted successfully",
    };
  } catch (error) {
    console.error("API Error:", error);
    if (error.code === "ERR_NETWORK") {
      return {
        status: false,
        message:
          "Unable to connect to server. Please check if the server is running.",
      };
    }
    return {
      status: false,
      message: error?.response?.data?.message || "An unexpected error occurred",
    };
  }
};

// ---------------------Create Product Material api -------------------------------
export const createMaterial = async (data) => {
  try {
    const response = await api.post("/material/create", data, getAuthHeader());
    return {
      status: true,
      message: "Material created successfully",
      data: response.data,
    };
  } catch (error) {
    console.error("API Error:", error);
    if (error.code === "ERR_NETWORK") {
      return {
        status: false,
        message:
          "Unable to connect to server. Please check if the server is running.",
      };
    }
    return {
      status: false,
      message: error?.response?.data?.message || "An unexpected error occurred",
    };
  }
};

// ---------------------------- Get Product Materials API -------------------------------
export const getMaterials = async () => {
  try {
    const response = await api.get("/material/viewAll");
    return {
      status: true,
      message: "Materials fetched successfully",
      data: response.data.data,
    };
  } catch (error) {
    console.error("API Error:", error);
    if (error.code === "ERR_NETWORK") {
      return {
        status: false,
        message:
          "Unable to connect to server. Please check if the server is running.",
      };
    }
    return {
      status: false,
      message: error?.response?.data?.message || "An unexpected error occurred",
    };
  }
};

// ---------------------------- Update Product Material APIs -------------------------------
export const updateMaterial = async (id, data) => {
  try {
    const response = await api.put(
      `/material/update/${id}`,
      data,
      getAuthHeader()
    );
    return {
      status: true,
      message: "Material updated successfully",
      data: response.data,
    };
  } catch (error) {
    console.error("API Error:", error);
    return {
      status: false,
      message: error?.response?.data?.message || "An unexpected error occurred",
    };
  }
};

// ---------------------------- Delete Product Material APIs -------------------------------
export const deleteMaterial = async (id) => {
  try {
    const response = await api.delete(
      `/material/delete/${id}`,
      getAuthHeader()
    );
    return {
      status: true,
      message: "Material deleted successfully",
    };
  } catch (error) {
    console.error("API Error:", error);
    return {
      status: false,
      message: error?.response?.data?.message || "An unexpected error occurred",
    };
  }
};

// ---------------------create  Package size api -------------------------------
export const createPackage = async (data) => {
  try {
    const response = await api.post(
      "/packageSize/create",
      data,
      getAuthHeader()
    );
    return {
      status: true,
      message: "Package created successfully",
      data: response.data,
    };
  } catch (error) {
    console.error("API Error:", error);
    if (error.code === "ERR_NETWORK") {
      return {
        status: false,
        message:
          "Unable to connect to server. Please check if the server is running.",
      };
    }
    return {
      status: false,
      message: error?.response?.data?.message || "An unexpected error occurred",
    };
  }
};

// ---------------------------- Get Packages size API -------------------------------
export const getPackages = async () => {
  try {
    const response = await api.get("/packageSize/viewAll");
    return {
      status: true,
      message: "Packages fetched successfully",
      data: response.data.data,
    };
  } catch (error) {
    console.error("API Error:", error);
    if (error.code === "ERR_NETWORK") {
      return {
        status: false,
        message:
          "Unable to connect to server. Please check if the server is running.",
      };
    }
    return {
      status: false,
      message: error?.response?.data?.message || "An unexpected error occurred",
    };
  }
};

// ---------------------------- Update  Package size APIs -------------------------------
export const updatePackage = async (id, data) => {
  try {
    const response = await api.put(
      `/packageSize/update/${id}`,
      data,
      getAuthHeader()
    );
    return {
      status: true,
      message: "Package updated successfully",
      data: response.data,
    };
  } catch (error) {
    console.error("API Error:", error);
    if (error.code === "ERR_NETWORK") {
      return {
        status: false,
        message:
          "Unable to connect to server. Please check if the server is running.",
      };
    }
    return {
      status: false,
      message: error?.response?.data?.message || "An unexpected error occurred",
    };
  }
};

// ---------------------------- Delete  Package size APIs -------------------------------
export const deletePackage = async (id) => {
  try {
    const response = await api.delete(
      `/packageSize/delete/${id}`,
      getAuthHeader()
    );
    return {
      status: true,
      message: "Package deleted successfully",
    };
  } catch (error) {
    console.error("API Error:", error);
    if (error.code === "ERR_NETWORK") {
      return {
        status: false,
        message:
          "Unable to connect to server. Please check if the server is running.",
      };
    }
    return {
      status: false,
      message: error?.response?.data?.message || "An unexpected error occurred",
    };
  }
};

// ---------------------------- Get Dashboard Card Data API -------------------------------
export const getDashboardCardData = async () => {
  try {
    const response = await api.get("/order/getAllDataCard", getAuthHeader());
    return {
      status: true,
      message: "Dashboard card data fetched successfully",
      data: response.data,
    };
  } catch (error) {
    console.error("API Error:", error);
    return {
      status: false,
      message: error?.response?.data?.message || "An unexpected error occurred",
    };
  }
};

export const fn_updateCategoryOrderingApi = async (data) => {
  try {
    const response = await api.put("/category/update-ordering", data, getAuthHeader());
    if (response?.status === 200) {
      return {
        status: true,
        message: "Ordering Updated"
      };
    };
  } catch (error) {
    console.error("API Error:", error);
    return {
      status: false,
      message: error?.response?.data?.message || "An unexpected error occurred",
    };
  }
}
