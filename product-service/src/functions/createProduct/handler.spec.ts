import { Handler } from 'aws-lambda';

import * as lambda from '@libs/lambda';
import { db } from '@db';
import { HttpStatusCode } from '@models';

describe('createProduct', () => {
  let main;
  let mockedDbQuery;
  const headers = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Credentials': true,
  };
  const product = {
    count: 1,
    description: 'description-1',
    price: 3,
    title: 'title-1',
  };

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

  it('should return message with status 200', async () => {
    const expectedResult = {
      body: JSON.stringify({ message: 'The product was created' }),
      statusCode: HttpStatusCode.OK,
      headers,
    } as any;

    await mockedDbQuery.mockImplementation(() => ({ rows: [{ id: '8154d2cf-ec01-4cdd-b7af-b104164c7112' }] }));

    expect(await main({ body: { ...product } })).toEqual(expectedResult);
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

    await mockedDbQuery.mockImplementation(() => Promise.resolve());

    expect(await main({ body: { ...product } })).toEqual(expectedResult);
  });
});
