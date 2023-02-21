import { DynamoDB } from "aws-sdk";
import { Table } from "@serverless-stack/node/table";
import { PostConfirmationTriggerEvent } from "aws-lambda";

const dynamoDb = new DynamoDB.DocumentClient();

export async function handler(event: PostConfirmationTriggerEvent) {
  const actor =
    event.request.userAttributes.email === "thomashdoughty@gmail.com"
      ? "admin"
      : "user";

  await dynamoDb
    .put({
      TableName: Table.Users.tableName,
      Item: {
        sub: event.userName,
        email: event.request.userAttributes.email,
        count: 0,
        actor,
      },
    })
    .promise();

  return event;
}
