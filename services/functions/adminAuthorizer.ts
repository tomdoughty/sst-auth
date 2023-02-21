const jwt = require("jsonwebtoken");
const jwkToPem = require("jwk-to-pem");
const axios = require("axios");

import { DynamoDB } from "aws-sdk";
import { Table } from "@serverless-stack/node/table";
import { APIGatewayRequestAuthorizerEventV2 } from "aws-lambda";

const dynamoDb = new DynamoDB.DocumentClient();

export async function handler(event: APIGatewayRequestAuthorizerEventV2) {
  const getEncodedToken = (header: any) => header.split(" ")[1];

  const getJwkByKid = async (iss: any, kid: any) => {
    const json = await axios(`${iss}/.well-known/jwks.json`);

    return json.data.keys.find((key: any) => key.kid === kid);
  };

  try {
    const encodedToken = getEncodedToken(event.headers?.authorization);
    const token = jwt.decode(encodedToken, { complete: true });
    const jwk = await getJwkByKid(token.payload.iss, token.header.kid);
    const pem = jwkToPem(jwk);
    jwt.verify(encodedToken, pem);

    const sub = token.payload.sub;

    const user = await dynamoDb
      .get({
        TableName: Table.Users.tableName,
        Key: {
          sub,
        },
      })
      .promise();

    const isAuthorized = user.Item?.actor === "admin";

    return {
      isAuthorized,
      context: {},
    };
  } catch (error) {
    return {
      isAuthorized: false,
      context: {},
    };
  }
}
