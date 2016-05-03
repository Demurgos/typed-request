export interface Multipart {
  chunked?: boolean;
  data?: {
    'content-type'?: string,
    body: string
  }[];
}
