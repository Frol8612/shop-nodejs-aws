export interface IResponse {
  statusCode: number;
  headers: IHeader;
  body?: string;
}

export interface IErrorMessage {
  message: string;
}

export interface IHeader {
  'Access-Control-Allow-Origin': string;
  'Access-Control-Allow-Credentials': boolean;
}

export enum HttpStatusCode {
  OK = 200,
  BAD_REQUEST = 400,
  NOT_FOUND = 404,
  INTERNAL_SERVER = 500,
}
