// import { Handler } from 'aws-lambda';

// import * as lambda from '@libs/lambda';
// import { HttpStatusCode } from '@models';
// import { getDb } from '@db';

// jest.mock('@db', () => {
//   const mockGetDb = {
//     connect: jest.fn(),
//     query: jest.fn(),
//     end: jest.fn(),
//   };
//   return { getDb: jest.fn(() => mockGetDb) };
// });

// describe('getProductsList', () => {
//   let main;
//   let db;
//   const headers = {
//     'Access-Control-Allow-Origin': '*',
//     'Access-Control-Allow-Credentials': true,
//   };
//   const products = [{
//     count: 1,
//     description: 'description-1',
//     id: 'id-1',
//     price: 3,
//     title: 'title-1',
//   },
//   {
//     count: 2,
//     description: 'description-2',
//     id: 'id-2',
//     price: 4,
//     title: 'title-2',
//   }];

//   beforeEach(async () => {
//     jest.spyOn(lambda, 'middyfy').mockImplementation((handler: Handler) => handler as never);

//     db = getDb();
//     main = (await import('./handler')).main;
//   });

//   afterAll(() => {
//     jest.resetModules();
//   });

//   it('should return products with status 200', async () => {
//     const expectedResult = {
//       body: JSON.stringify(products),
//       statusCode: HttpStatusCode.OK,
//       headers,
//     } as any;

//     db.query.mockResolvedValueOnce({ rows: products });

//     expect(await main({})).toEqual(expectedResult);
//   });

//   it('should return error message with status 500', async () => {
//     const expectedResult = {
//       body: JSON.stringify({ message: 'Internal server error' }),
//       statusCode: HttpStatusCode.INTERNAL_SERVER,
//       headers,
//     } as any;

//     db.query.mockRejectedValueOnce(new Error());

//     expect(await main({})).toEqual(expectedResult);
//   });
// });
