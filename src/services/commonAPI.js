import axios from "axios";

const commonAPI = async (httpMethod, url, reqBody = {}) => {
  try {
    const reqConfig = {
      method: httpMethod,
      url,
      data: reqBody,
    };
    const response = await axios(reqConfig);
    return response.data; // Return only the response data for simplicity
  } catch (error) {
    // Return a structured error
    return {
      success: false,
      message: error.message,
      details: error.response ? error.response.data : null,
    };
  }
};

export default commonAPI;
