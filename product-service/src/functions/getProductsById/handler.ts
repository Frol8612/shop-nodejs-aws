import 'source-map-support/register';

import { middyfy } from '@libs/lambda';
import products from '@assets/products.json';
import { IProduct, IResponse, HttpStatusCode, headers } from '@models';

const getProductsList = async (): Promise<IResponse<IProduct>> => {
  try {
    return {
      headers,
      statusCode: HttpStatusCode.OK,
      body: JSON.stringify(products),
    }
  } catch {
    return {
      headers,
      statusCode: HttpStatusCode.INTERNAL_SERVER,
    }
  }
}

export const main = middyfy(getProductsList);
