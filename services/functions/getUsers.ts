import { DynamoDB } from "aws-sdk";
import { Table } from "@serverless-stack/node/table";

const dynamoDb = new DynamoDB.DocumentClient();

export async function handler() {
  const res = await dynamoDb
    .scan({
      TableName: Table.Users.tableName,
    })
    .promise();

  return {
    statusCode: 200,
    body: JSON.stringify({
      users: res.Items,
    }),
  };
}
