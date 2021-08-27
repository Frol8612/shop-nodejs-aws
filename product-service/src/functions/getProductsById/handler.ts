import 'source-map-support/register';

import type { APIGatewayProxyEvent } from "aws-lambda"

import { middyfy } from '@libs/lambda';
import { IProduct, IResponse, HttpStatusCode, headers } from '@models';
import { getProduct } from '@libs/getData';

const getProductsById = async (event: APIGatewayProxyEvent): Promise<IResponse> => {
  try {
    const { productId } = event.pathParameters;
    const patternId = /(?=.*\d)(?=.*[a-zA-Z]).*$/;

    if (productId && patternId.test(productId)) {
      const product: IProduct = await getProduct(productId);

      if (product) {
        return {
          headers,
          statusCode: HttpStatusCode.OK,
          body: JSON.stringify(product),
        }
      }

      return {
        headers,
        statusCode: HttpStatusCode.NOT_FOUND,
        body: JSON.stringify({ message: 'Product not found' }),
      }
    }

    return {
      headers,
      statusCode: HttpStatusCode.BAD_REQUEST,
      body: JSON.stringify({ message: 'Bad request, productId should contain numbers and letters' }),
    }
  } catch {
    return {
      headers,
      statusCode: HttpStatusCode.INTERNAL_SERVER,
      body: JSON.stringify({ message: 'Internal server error' }),
    }
  }
}

export const main = middyfy(getProductsById);
