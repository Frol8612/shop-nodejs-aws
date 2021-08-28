import { Handler } from 'aws-lambda';

import * as lambda from '@libs/lambda';
import * as getData from '@libs/getData';
import { HttpStatusCode } from '@models';

describe('getProductsById', () => {
  let main;
  let mockedGetProducts;
  const headers = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Credentials': true,
  };
  const products = [{
    count: 1,
    description: 'description-1',
    id: 'id-1',
    price: 3,
    title: 'title-1',
  },
  {
    count: 2,
    description: 'description-2',
    id: 'id-2',
    price: 4,
    title: 'title-2',
  }];

  beforeEach(async () => {
    jest.spyOn(lambda, 'middyfy').mockImplementation((handler: Handler) => handler as never);

    mockedGetProducts = jest.spyOn(getData, 'getProduct');

    main = (await import('./handler')).main;
  });

  afterAll(() => {
    jest.resetModules();
  });

  it('HttpStatusCode.OK', async () => {
    const [product] = products;
    const expectedResult = {
      body: JSON.stringify(product),
      statusCode: HttpStatusCode.OK,
      headers,
    } as any;

    mockedGetProducts.mockImplementation((id: string) => products.find((p) => p.id === id));

    expect(await main({ pathParameters: { productId: product.id } })).toEqual(expectedResult);
  });

  it('HttpStatusCode.NOT_FOUND', async () => {
    const expectedResult = {
      body: JSON.stringify({ message: 'Product not found' }),
      statusCode: HttpStatusCode.NOT_FOUND,
      headers,
    } as any;

    mockedGetProducts.mockImplementation((id: string) => products.find((p) => p.id === id));

    expect(await main({ pathParameters: { productId: 'id-3' } })).toEqual(expectedResult);
  });

  it('HttpStatusCode.BAD_REQUEST', async () => {
    const expectedResult = {
      body: JSON.stringify({ message: 'Bad request, productId should contain numbers and letters' }),
      statusCode: HttpStatusCode.BAD_REQUEST,
      headers,
    } as any;

    expect(await main({ pathParameters: { productId: 3 } })).toEqual(expectedResult);
  });

  it('HttpStatusCode.INTERNAL_SERVER', async () => {
    const expectedResult = {
      body: JSON.stringify({ message: 'Internal server error' }),
      statusCode: HttpStatusCode.INTERNAL_SERVER,
      headers,
    } as any;

    mockedGetProducts.mockImplementation(() => {
      throw new Error();
    });

    expect(await main()).toEqual(expectedResult);
  });
});
