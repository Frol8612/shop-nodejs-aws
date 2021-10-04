import { Handler } from 'aws-lambda';
import { S3 } from 'aws-sdk';

import * as lambda from '@libs/lambda';
import { BUCKET_NAME } from '@libs/constants';

jest.mock('aws-sdk', () => {
  const getObjectMock = jest.fn(() => ({
    createReadStream: jest.fn().mockReturnValue({
      pipe: jest.fn().mockReturnValue({
        on: jest.fn().mockImplementation(function (this, event, handler) {
          if (event === 'data' || event === 'end') {
            handler(event);
          }

          return this;
        }),
      }),
    }),
  }));

  const putObjectMock = jest.fn(() => ({
    promise: jest.fn(),
  }));

  return {
    S3: jest.fn(() => ({
      getObject: getObjectMock,
      copyObject: putObjectMock,
    })),
    SQS: jest.fn(() => ({
      sendMessage: jest.fn(),
    })),
  };
});

describe('importFileParser', () => {
  let mockS3;
  let main;

  beforeEach(async () => {
    jest.spyOn(lambda, 'middyfy').mockImplementation((handler: Handler) => handler as never);

    main = (await import('./handler')).main;
    mockS3 = new S3({});
  });

  afterAll(() => {
    jest.resetModules();
  });

  it('should call getObject and copyObject', async () => {
    const key1 = 'uploaded/test.csv';
    const key2 = 'parsed/test.csv';

    await main({ Records: [{ s3: { object: { key: key1 } } }] });

    expect(mockS3.getObject).toBeCalledWith({
      Bucket: BUCKET_NAME,
      Key: key1,
    });
    expect(mockS3.copyObject).toBeCalledWith({
      Bucket: BUCKET_NAME,
      CopySource: `${BUCKET_NAME}/${key1}`,
      Key: key2,
    });
  });
});
