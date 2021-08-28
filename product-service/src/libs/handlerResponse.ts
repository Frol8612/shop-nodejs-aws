import { IResponse } from '@models';

export const getResponse = <T>(data: T, statusCode: number): IResponse => ({
  headers: {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Credentials': true,
  },
  body: JSON.stringify(data),
  statusCode,
});
