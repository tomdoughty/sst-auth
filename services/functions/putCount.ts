import { DynamoDB } from "aws-sdk";
import { Table } from "@serverless-stack/node/table";
import { APIGatewayEvent } from "aws-lambda";

const dynamoDb = new DynamoDB.DocumentClient();

export async function handler(event: APIGatewayEvent) {
  const sub = event.requestContext.authorizer?.jwt.claims.sub;

  const res = await dynamoDb
    .update({
      TableName: Table.Users.tableName,
      Key: {
        sub,
      },
      UpdateExpression: "SET #c = #c + :value",
      ExpressionAttributeValues: {
        ":value": 1,
      },
      ExpressionAttributeNames: {
        "#c": "count",
      },
      ReturnValues: "ALL_NEW",
    })
    .promise();

  return {
    statusCode: 200,
    body: JSON.stringify({
      count: res.Attributes?.count,
    }),
  };
}
