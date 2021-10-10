import type { AWS } from '@serverless/typescript';

import getProductsList from '@functions/getProductsList';
import getProductsById from '@functions/getProductsById';
import createProduct from '@functions/createProduct';
import catalogBatchProcess from '@functions/catalogBatchProcess';
import { REGION } from '@libs/constants';

const serverlessConfiguration: AWS = {
  service: 'product-service',
  package: {
    individually: true,
  },
  frameworkVersion: '2',
  custom: {
    webpack: {
      webpackConfig: './webpack.config.js',
      includeModules: true,
    },
  },
  plugins: ['serverless-webpack', 'serverless-offline'],
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
      PG_HOST: '${env:PG_HOST}',
      PG_PORT: '${env:PG_PORT}',
      PG_DATABASE: '${env:PG_DATABASE}',
      PG_USERNAME: '${env:PG_USERNAME}',
      PG_PASSWORD: '${env:PG_PASSWORD}',
      SQS_URL: {
        Ref: 'CatalogItemsQueue',
      },
      SNS_ARN: {
        Ref: 'CreateProductTopic',
      },
    },
    lambdaHashingVersion: '20201221',
    iamRoleStatements: [
      {
        Effect: 'Allow',
        Action: 'sqs:*',
        Resource: { 'Fn::GetAtt': ['CatalogItemsQueue', 'Arn'] },
      },
      {
        Effect: 'Allow',
        Action: 'sns:*',
        Resource: { Ref: 'CreateProductTopic' },
      },
    ],
  },
  // import the function via paths
  functions: {
    getProductsList,
    getProductsById,
    createProduct,
    catalogBatchProcess,
  },
  useDotenv: true,
  resources: {
    Resources: {
      CatalogItemsQueue: {
        Type: 'AWS::SQS::Queue',
        Properties: {
          QueueName: 'catalogItemsQueue',
          ReceiveMessageWaitTimeSeconds: 20,
        },
      },
      CreateProductTopic: {
        Type: 'AWS::SNS::Topic',
        Properties: {
          TopicName: 'createProductTopic',
        },
      },
      SNSSubscription: {
        Type: 'AWS::SNS::Subscription',
        Properties: {
          Endpoint: '${env:EMAIL}',
          Protocol: 'email',
          TopicArn: { Ref: 'CreateProductTopic' },
          FilterPolicy: {
            count: [{ numeric: ['<', 100] }],
          },
        },
      },
      SNSSubscriptionAdmin: {
        Type: 'AWS::SNS::Subscription',
        Properties: {
          Endpoint: '${env:EMAIL_ADMIN}',
          Protocol: 'email',
          TopicArn: { Ref: 'CreateProductTopic' },
          FilterPolicy: {
            count: [{ numeric: ['>=', 100] }],
          },
        },
      },
    },
    Outputs: {
      CatalogItemsQueueOutput: {
        Value: {
          Ref: 'CatalogItemsQueue',
        },
        Export: {
          Name: 'CatalogItemsQueueURL',
        },
      },
      CatalogItemsQueueArnOutput: {
        Value: { 'Fn::GetAtt': ['CatalogItemsQueue', 'Arn'] },
        Export: {
          Name: 'CatalogItemsQueueArn',
        },
      },
    },
  },
};

module.exports = serverlessConfiguration;
