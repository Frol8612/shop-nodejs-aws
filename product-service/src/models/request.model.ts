import type { APIGatewayProxyEvent } from 'aws-lambda';
import type { FromSchema } from 'json-schema-to-ts';

export type ProxyEvent<T> = Omit<APIGatewayProxyEvent, 'body'> & { body: FromSchema<T> };
