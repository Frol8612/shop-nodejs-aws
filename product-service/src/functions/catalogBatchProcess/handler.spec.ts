import { Handler } from 'aws-lambda';
import { SNS } from 'aws-sdk';

import * as lambda from '@libs/lambda';
import { getDb } from '@db';

jest.mock('@db', () => {
  const mockGetDb = {
    connect: jest.fn(),
    query: jest.fn(),
    end: jest.fn(),
  };
  return { getDb: jest.fn(() => mockGetDb) };
});

jest.mock('aws-sdk', () => {
  const publishMock = jest.fn(() => ({
    promise: jest.fn(),
  }));

  return {
    SNS: jest.fn(() => ({
      publish: publishMock,
    })),
  };
});

describe('catalogBatchProcess', () => {
  let main;
  let db;
  let mockSNS;
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
    mockSNS = new SNS({});
  });

  afterAll(() => {
    jest.resetModules();
  });

  it('should call publish with subject Successfully', async () => {
    const SNS_ARN = 'SNS_ARN';
    db.query.mockResolvedValue({ rows: [{ id: '8154d2cf-ec01-4cdd-b7af-b104164c7112', ...product }] });
    process.env.SNS_ARN = SNS_ARN;
    await main({ Records: [{ body: JSON.stringify(product) }] });

    expect(mockSNS.publish).toBeCalledWith({
      Subject: 'Successfully',
      Message: JSON.stringify([product]),
      TopicArn: SNS_ARN,
    });
  });

  it('should call publish with subject Error', async () => {
    const SNS_ARN = 'SNS_ARN';
    db.query.mockRejectedValueOnce(new Error());
    process.env.SNS_ARN = SNS_ARN;
    await main({ Records: [{ body: JSON.stringify(product) }] });

    expect(mockSNS.publish).toBeCalledWith({
      Subject: 'Error',
      Message: 'Internal server error',
      TopicArn: SNS_ARN,
    });
  });
});
