import 'source-map-support/register';

import { middyfy } from '@libs/lambda';
import { getProducts } from '@libs/getData';
import { IProduct, IResponse, HttpStatusCode, headers } from '@models';

const getProductsList = async (): Promise<IResponse> => {
  try {
    const data: IProduct[] = await getProducts(); 

    return {
      headers,
      statusCode: HttpStatusCode.OK,
      body: JSON.stringify(data),
    }
  } catch {
    return {
      headers,
      statusCode: HttpStatusCode.INTERNAL_SERVER,
      body: JSON.stringify({ message: 'Internal server error' }),
    }
  }
}

export const main = middyfy(getProductsList);
