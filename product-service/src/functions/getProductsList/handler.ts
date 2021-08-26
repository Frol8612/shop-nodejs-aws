import 'source-map-support/register';

import type { ValidatedEventAPIGatewayProxyEvent } from '@libs/apiGateway';
import { formatJSONResponse } from '@libs/apiGateway';
import { middyfy } from '@libs/lambda';
import products from '@assets/products.json';
import { IProduct } from '@models';

import schema from './schema';

const getProductsList: ValidatedEventAPIGatewayProxyEvent<typeof schema> = async () => {
  return formatJSONResponse<IProduct[]>(products);
}

export const main = middyfy(getProductsList);
