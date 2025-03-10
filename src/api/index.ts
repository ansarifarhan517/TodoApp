import axios, { AxiosResponse } from 'axios'

const axiosClient = axios.create({
  baseURL: 'http://localhost:9000/api/',
})

// Response interceptor to handle invalid token
axiosClient.interceptors.response.use(
  (response) => response,
  async (error: { response: { data: { message: string } } }) => {
    if (error.response && error.response.data.message === 'User Not Authorize') {
      window.location.href = '/login'
      localStorage.clear()
    }
    return await Promise.reject(error)
  },
)

type ApiResponse<T> = {
  data: T;
  status: number;
};

const get = async <T>(URL: string): Promise<ApiResponse<T>> => {
  const authToken = localStorage.getItem('authToken')
  return await axiosClient
    .get<T>(URL, {
      headers: {
        Authorization: `Bearer ${authToken}`,
      },
    })
    .then((response: AxiosResponse<T>) => ({
      data: response.data,
      status: response.status,
    }))
}

const post = async <T>(URL: string, payload: object): Promise<ApiResponse<T>> => {
  const authToken = localStorage.getItem('authToken')
  return await axiosClient
    .post<T>(URL, payload, {
      headers: {
        Authorization: `Bearer ${authToken}`,
      },
    })
    .then((response: AxiosResponse<T>) => ({
      data: response.data,
      status: response.status,
    }))
}

const put = async <T>(URL: string, payload: object): Promise<ApiResponse<T>> => {
  const authToken = localStorage.getItem('authToken')
  return await axiosClient
    .put<T>(URL, payload, {
      headers: {
        Authorization: `Bearer ${authToken}`,
      },
    })
    .then((response: AxiosResponse<T>) => ({
      data: response.data,
      status: response.status,
    }))
}

const patch = async <T>(URL: string, payload: object): Promise<ApiResponse<T>> => {
  const authToken = localStorage.getItem('authToken')
  return await axiosClient
    .patch<T>(URL, payload, {
      headers: {
        Authorization: `Bearer ${authToken}`,
      },
    })
    .then((response: AxiosResponse<T>) => ({
      data: response.data,
      status: response.status,
    }))
}

const remove = async <T>(URL: string): Promise<ApiResponse<T>> => {
  const authToken = localStorage.getItem('authToken')
  return await axiosClient
    .delete<T>(URL, {
      headers: {
        Authorization: `Bearer ${authToken}`,
      },
    })
    .then((response: AxiosResponse<T>) => ({
      data: response.data,
      status: response.status,
    }))
}

export { get, post, put, patch, remove }
