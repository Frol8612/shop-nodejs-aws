import 'source-map-support/register';

import type { APIGatewayProxyEvent } from 'aws-lambda';

import { middyfy } from '@libs/lambda';
import {
  IProduct, IResponse, HttpStatusCode, IErrorMessage,
} from '@models';
import { getProduct } from '@libs/getData';
import { getResponse } from '@libs/handlerResponse';

const getProductsById = async (event: APIGatewayProxyEvent): Promise<IResponse> => {
  try {
    const { productId } = event.pathParameters;
    const patternId = /(?=.*\d)(?=.*[a-zA-Z]).*$/;

    if (productId && patternId.test(productId)) {
      const product: IProduct = await getProduct(productId);

      if (product) {
        return getResponse<IProduct>(product, HttpStatusCode.OK);
      }

      return getResponse<IErrorMessage>({ message: 'Product not found' }, HttpStatusCode.NOT_FOUND);
    }

    return getResponse<IErrorMessage>({ message: 'Bad request, productId should contain numbers and letters' }, HttpStatusCode.BAD_REQUEST);
  } catch {
    return getResponse<IErrorMessage>({ message: 'Internal server error' }, HttpStatusCode.INTERNAL_SERVER);
  }
};

export const main = middyfy(getProductsById);
