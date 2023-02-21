import { DynamoDB } from "aws-sdk";
import { Table } from "@serverless-stack/node/table";
import { APIGatewayEvent } from "aws-lambda";

const dynamoDb = new DynamoDB.DocumentClient();

export async function handler(event: APIGatewayEvent) {
  const sub = event.requestContext.authorizer?.jwt.claims.sub;

  const res = await dynamoDb
    .get({
      TableName: Table.Users.tableName,
      Key: {
        sub,
      },
    })
    .promise();

  return {
    statusCode: 200,
    body: JSON.stringify({
      count: res.Item?.count,
    }),
  };
}
