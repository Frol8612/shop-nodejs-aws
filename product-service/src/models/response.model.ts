import type { FromSchema } from "json-schema-to-ts";

export interface IResponse<T> {
    statusCode: number;
    headers: IHeader;
    body?: FromSchema<T>;
}

export  interface IHeader {
    'Access-Control-Allow-Origin': string;
    'Access-Control-Allow-Credentials': boolean;
}

export enum HttpStatusCode {
    OK = 200,
    BAD_REQUEST = 400,
    NOT_FOUND = 404,
    INTERNAL_SERVER = 500,
}

export const headers: IHeader = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Credentials': true,
};