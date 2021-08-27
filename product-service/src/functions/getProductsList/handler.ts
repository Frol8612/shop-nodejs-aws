import 'source-map-support/register';

import { middyfy } from '@libs/lambda';
import { getProducts } from '@libs/utils';
import { IProduct, IResponse, HttpStatusCode, headers } from '@models';

const getProductsById = async (): Promise<IResponse<IProduct>> => {
  try {
    const data = await getProducts(); 

    return {
      headers,
      statusCode: HttpStatusCode.OK,
      body: JSON.stringify(data),
    }
  } catch {
    return {
      headers,
      statusCode: HttpStatusCode.INTERNAL_SERVER,
    }
  }
}

export const main = middyfy(getProductsById);
