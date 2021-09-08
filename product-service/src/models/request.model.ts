import type { APIGatewayProxyEvent } from 'aws-lambda';
import type { FromSchema } from 'json-schema-to-ts';

export interface IEvent<T> extends APIGatewayProxyEvent {
  body: FromSchema<T>,
}
