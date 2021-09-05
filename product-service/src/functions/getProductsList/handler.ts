import 'source-map-support/register';

import { middyfy } from '@libs/lambda';
import { getProducts } from '@libs/getData';
import { getResponse } from '@libs/handlerResponse';
import {
  IProduct, IResponse, HttpStatusCode, IErrorMessage,
} from '@models';

const getProductsList = async (): Promise<IResponse> => {
  try {
    const data: IProduct[] = await getProducts();

    return getResponse<IProduct[]>(data, HttpStatusCode.OK);
  } catch {
    return getResponse<IErrorMessage>({ message: 'Internal server error' }, HttpStatusCode.INTERNAL_SERVER);
  }
};

export const main = middyfy(getProductsList);
