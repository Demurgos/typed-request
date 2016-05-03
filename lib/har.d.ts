export interface NameValuePair {
  name: string;
  value: string;
}

export interface HttpArchiveRequest {
  url?: string;
  method?: string;
  headers?: NameValuePair[];
  postData?: {
    mimeType?: string;
    params?: NameValuePair[];
  };
}
