import axios, { AxiosResponse } from "axios";


// React env process
export const SERVER_URL = process.env.REACT_APP_MIDDLEWARE_URL;
export const AUTHORIZATION = process.env.REACT_APP_AUTH;


// axios.defaults.withCredentials = true;
type HttpMethod = 'GET' | 'POST' | 'PUT' | 'PATCH' | 'DELETE';
type ResponseType = 'arraybuffer' | 'blob' | 'document' | 'json' | 'text' | 'stream';


// AJAX Specify your method 
export async function makeREQUEST(
  method: HttpMethod,
  endpoint: string,
  data: Record<string, any> = {},
  responseType: ResponseType = "json"
): Promise<AxiosResponse> {

  const headers = {
    "Content-Type": "multipart/form-data",
    Authorization: AUTHORIZATION,
  };

  return axios({
    method: method,
    url: SERVER_URL + endpoint,
    data: data,
    headers: headers,
    responseType: responseType,
  });
}

// AJAX POST
export async function makePOST(endpoint: string, data: any) {
  const headers = {
    'Content-Type': 'multipart/form-data',
    'Authorization': AUTHORIZATION
  };

  return axios.post( SERVER_URL+endpoint, data, {headers})

}

// AJAX PUT
export async function makePUT(endpoint: string, data: any) {
  const headers = {
    'Content-Type': 'multipart/form-data',
    'Authorization': AUTHORIZATION
  };

  return axios.post( SERVER_URL+endpoint, data, {headers})

}