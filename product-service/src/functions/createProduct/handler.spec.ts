import { Handler } from 'aws-lambda';

import * as lambda from '@libs/lambda';
import { getDb } from '@db';
import { HttpStatusCode } from '@models';

jest.mock('@db', () => {
  const mockGetDb = {
    connect: jest.fn(),
    query: jest.fn(),
    end: jest.fn(),
  };
  return { getDb: jest.fn(() => mockGetDb) };
});

describe('createProduct', () => {
  let main;
  let db;
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

    db = getDb();
    main = (await import('./handler')).main;
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

    db.query.mockResolvedValue({ rows: [{ id: '8154d2cf-ec01-4cdd-b7af-b104164c7112' }] });

    expect(await main({ body: { ...product } })).toEqual(expectedResult);
  });

  it('should return error message with status 500', async () => {
    const expectedResult = {
      body: JSON.stringify({ message: 'Internal server error' }),
      statusCode: HttpStatusCode.INTERNAL_SERVER,
      headers,
    } as any;

    db.query.mockRejectedValueOnce(new Error());

    expect(await main({ body: { ...product } })).toEqual(expectedResult);
  });
});
