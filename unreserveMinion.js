import * as dynamoDbLib from "./libs/dynamodb-lib";
import { success, failure } from "./libs/response-lib";

export async function main(event, context) {
  const params = {
    TableName: "minions02",

    Key: {
      minionId: event.pathParameters.id
    },

    UpdateExpression: "SET reserved_by = :reserved_by",
    ExpressionAttributeValues: {
      ":reserved_by": " "
    },

    ReturnValues: "ALL_NEW"
  };

  try {
    const result = await dynamoDbLib.call("update", params);
    return success({ status: true });
  } catch (e) {
    console.log(e);
    return failure({ status: false });
  }
}
