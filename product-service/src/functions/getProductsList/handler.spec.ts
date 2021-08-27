import { Handler } from 'aws-lambda';

import * as lambda from '@libs/lambda';
import * as utils from '@libs/utils';
import { headers, HttpStatusCode } from '@models';

describe('getProductsById', () => {
  let main;
  let mockedGetProducts;
  let products = [{
    "count": 1,
    "description": "description-1",
    "id": "id-1",
    "price": 3,
    "title": "title-1"
  },
  {
    "count": 2,
    "description": "description-2",
    "id": "id-2",
    "price": 4,
    "title": "title-2"
  }];

  beforeEach(async () => {
    jest.spyOn(lambda, 'middyfy').mockImplementation((handler: Handler) => handler as never);

    mockedGetProducts = jest.spyOn(utils, 'getProducts');

    main = (await import('./handler')).main;
  });

  afterAll(() => {
    jest.resetModules();
  });

  it('HttpStatusCode.OK', async () => {
    const expectedResult = {
      body: JSON.stringify(products),
      statusCode: HttpStatusCode.OK,
      headers,
    } as any;

    mockedGetProducts.mockReturnValue(products)

    expect(await main()).toEqual(expectedResult);
  });

  it('HttpStatusCode.INTERNAL_SERVER', async () => {
    const expectedResult = {
      statusCode: HttpStatusCode.INTERNAL_SERVER,
      headers,
    } as any;

    mockedGetProducts.mockImplementation(() => { 
      throw new Error();
    });

    expect(await main()).toEqual(expectedResult);
  });
});
