import type { AWS } from '@serverless/typescript';

import importProductsFile from '@functions/importProductsFile';
import importFileParser from '@functions/importFileParser';
import { BUCKET_NAME, REGION } from '@libs/constants';

const serverlessConfiguration: AWS = {
  service: 'import-service',
  frameworkVersion: '2',
  custom: {
    webpack: {
      webpackConfig: './webpack.config.js',
      includeModules: true,
    },
    'serverless-offline': {
      httpPort: 3000,
      websocketPort: 3001,
      lambdaPort: 3002,
    },
    s3: {
      host: 'localhost',
      port: 3003,
      directory: `${__dirname}/tmp`,
      allowMismatchedSignatures: true,
      cors: './s3-cors.xml',
    },
  },
  plugins: [
    'serverless-webpack',
    'serverless-offline',
    'serverless-s3-local',
  ],
  provider: {
    name: 'aws',
    runtime: 'nodejs14.x',
    region: REGION,
    stage: 'dev',
    apiGateway: {
      minimumCompressionSize: 1024,
      shouldStartNameWithService: true,
    },
    environment: {
      AWS_NODEJS_CONNECTION_REUSE_ENABLED: '1',
      SQS_URL: {
        'Fn::ImportValue': 'CatalogItemsQueueURL',
      },
    },
    lambdaHashingVersion: '20201221',
    iamRoleStatements: [
      {
        Effect: 'Allow',
        Action: ['s3:ListBucket', 's3:*'],
        Resource: [`arn:aws:s3:::${BUCKET_NAME}`, `arn:aws:s3:::${BUCKET_NAME}/*`],
      },
      {
        Effect: 'Allow',
        Action: 'sqs:*',
        Resource: { 'Fn::ImportValue': 'CatalogItemsQueueArn' },
      },
    ],
  },
  // import the function via paths
  functions: { importProductsFile, importFileParser },
  useDotenv: true,
  resources: {
    Resources: {
      ImportFileS3Bucket: {
        Type: 'AWS::S3::Bucket',
        Properties: {
          BucketName: BUCKET_NAME,
          PublicAccessBlockConfiguration: {
            BlockPublicAcls: true,
            IgnorePublicAcls: true,
            BlockPublicPolicy: true,
            RestrictPublicBuckets: true,
          },
          CorsConfiguration: {
            CorsRules: [
              {
                AllowedOrigins: ['*'],
                AllowedHeaders: ['*'],
                AllowedMethods: ['PUT'],
              },
            ],
          },
        },
      },
    },
    Outputs: {
      ImportFileBucketOutput: {
        Value: {
          Ref: 'ImportFileS3Bucket',
        },
      },
    },
  },
};

module.exports = serverlessConfiguration;
