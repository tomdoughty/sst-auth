import { DynamoDB } from "aws-sdk";
import { Table } from "@serverless-stack/node/table";
import { PreTokenGenerationAuthenticationTriggerEvent } from "aws-lambda";

const dynamoDb = new DynamoDB.DocumentClient();

export async function handler(
  event: PreTokenGenerationAuthenticationTriggerEvent
) {
  const user = await dynamoDb
    .get({
      TableName: Table.Users.tableName,
      Key: {
        sub: event.userName,
      },
    })
    .promise();

  const actor = user.Item ? user.Item.actor : null;

  event.response.claimsOverrideDetails = {
    claimsToAddOrOverride: {
      actor,
    },
  };

  return event;
}
