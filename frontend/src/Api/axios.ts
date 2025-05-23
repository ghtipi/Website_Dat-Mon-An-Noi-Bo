import axios from 'axios'

const API_URL = 'http://localhost:8000/api' 

const apiCall = async (
  method: 'get' | 'post' | 'put' | 'delete' | 'patch',
  endpoint: string,
  data: any = null,
  token: string | null = null
) => {
  try {
    const config = {
      method,
      url: `${API_URL}${endpoint}`,
      headers: {
        'Content-Type': 'application/json',
        ...(token && { Authorization: `Bearer ${token}` }),
      },
      ...(data && { data }),
    }
    const response = await axios(config)
    return response.data
  } catch (error) {
    if (axios.isAxiosError(error) && error.response) {
      throw error.response.data;
    } else {
      throw { error: 'Lỗi kết nối' };
    }
  }
}

export default apiCall