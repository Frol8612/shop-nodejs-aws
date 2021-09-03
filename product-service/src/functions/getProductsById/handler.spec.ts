import { Handler } from 'aws-lambda';

import * as lambda from '@libs/lambda';
import { db } from '@db';
import { HttpStatusCode } from '@models';

describe('getProductsById', () => {
  let main;
  let mockedDbQuery;
  const headers = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Credentials': true,
  };
  const products = [{
    count: 1,
    description: 'description-1',
    id: '8154d2cf-ec01-4cdd-b7af-b104164c7112',
    price: 3,
    title: 'title-1',
  },
  {
    count: 2,
    description: 'description-2',
    id: '8154d2cf-ec01-4cdd-b7af-b104164c7113',
    price: 4,
    title: 'title-2',
  }];

  beforeEach(async () => {
    jest.spyOn(lambda, 'middyfy').mockImplementation((handler: Handler) => handler as never);

    jest.spyOn(db, 'connect').mockImplementation(() => Promise.resolve());
    mockedDbQuery = jest.spyOn(db, 'query');

    main = (await import('./handler')).main;
  });

  afterEach(() => {
    jest.spyOn(db, 'end').mockImplementation(() => Promise.resolve());
  });

  afterAll(() => {
    jest.resetModules();
  });

  it('should return product with status 200', async () => {
    const [product] = products;
    const expectedResult = {
      body: JSON.stringify(product),
      statusCode: HttpStatusCode.OK,
      headers,
    } as any;

    await mockedDbQuery.mockImplementation(() => ({ rows: [product] }));

    expect(await main({ pathParameters: { productId: product.id } })).toEqual(expectedResult);
  });

  it('should return error message with status 404', async () => {
    const expectedResult = {
      body: JSON.stringify({ message: 'Product not found' }),
      statusCode: HttpStatusCode.NOT_FOUND,
      headers,
    } as any;

    await mockedDbQuery.mockImplementation(() => ({ rows: [] }));

    expect(await main({ pathParameters: { productId: '8154d2cf-ec01-4cdd-b7af-b104164c7114' } })).toEqual(expectedResult);
  });

  it('should return error message with status 400', async () => {
    const expectedResult = {
      body: JSON.stringify({ message: 'Bad request, productId should contain numbers and letters' }),
      statusCode: HttpStatusCode.BAD_REQUEST,
      headers,
    } as any;

    expect(await main({ pathParameters: { productId: '8154f-ec1-4cdd-e323b7af-b164c7114' } })).toEqual(expectedResult);
  });

  it('should return error message with status 500', async () => {
    const expectedResult = {
      body: JSON.stringify({ message: 'Internal server error' }),
      statusCode: HttpStatusCode.INTERNAL_SERVER,
      headers,
    } as any;

    await mockedDbQuery.mockImplementation(() => {
      throw new Error();
    });

    expect(await main()).toEqual(expectedResult);
  });
});
