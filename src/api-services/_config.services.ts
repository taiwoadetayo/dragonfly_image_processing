import axios, { AxiosResponse } from "axios";

// axios.defaults.withCredentials = true;
type HttpMethod = 'GET' | 'POST' | 'PUT' | 'PATCH' | 'DELETE';
type ResponseType = 'arraybuffer' | 'blob' | 'document' | 'json' | 'text' | 'stream';

export async function makeREQUEST(method: HttpMethod, endpoint: string, data: Record<string, any> = {}, responseType: ResponseType = "json"): Promise<AxiosResponse> {
  
  const headers = {
    'Content-Type': 'multipart/form-data',
    'Authorization': 'fa66abff-98c2-4122-8997-b767836bf956'
  };
  
  return axios({
    method: method, 
    url: endpoint, 
    data: data,
    headers: headers,
    responseType: responseType,
  })
}


export async function makePOST(endpoint: string, data: any) {
  const headers = {
    'Content-Type': 'multipart/form-data',
  };

  return axios.post( endpoint, data, {headers})

}