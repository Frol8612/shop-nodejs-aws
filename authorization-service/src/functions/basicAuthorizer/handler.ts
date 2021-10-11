import { middyfy } from '@libs/lambda';
import type { CustomAuthorizerCallback, APIGatewayTokenAuthorizerEvent, Context } from 'aws-lambda';

const generatePolice = (principalId: string, resource: string, effect = 'Allow') => {
  return {
    principalId,
    policyDocument: {
      Version: '2012-10-17',
      Statement: [
        {
          Action: 'execute-api:Invoke',
          Effect: effect,
          Resource: resource,
        }
      ]
    }
  }
}

const basicAuthorizer = async (event: APIGatewayTokenAuthorizerEvent, _ctx: Context, cb: CustomAuthorizerCallback) => {
  if (event.type !== 'TOKEN') {
    cb('Unauthorized')
  }

  try {
    const authorizationToken = event.authorizationToken;
    const encodedCreds = authorizationToken.split(' ')[1];
    const buff = Buffer.from(encodedCreds, 'base64');
    const plainCreads = buff.toString('utf-8').split(':');
    const username = plainCreads[0];
    const password = plainCreads[1];

    console.log(`username: ${username} and password ${password}`);

    const storedUserPassword = process.env[username];
    const effect = !storedUserPassword || storedUserPassword !== password ? 'Deny' : 'Allow';

    const policy = generatePolice(encodedCreds, event.methodArn, effect);

    cb(null, policy);
  } catch (e) {
    cb(`Unauthorized: ${e.message}`);
  }
}

export const main = middyfy(basicAuthorizer);
