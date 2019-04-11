import * as dynamoDbLib from "./libs/dynamodb-lib";
import { success, failure } from "./libs/response-lib";

export async function main(event, context) {
  const params = {
    TableName: "minions02",
    IndexName: "reserved_by-index",
    KeyConditionExpression: "reserved_by = :reserved_by",
    ExpressionAttributeValues: {
      ":reserved_by": " "
    }
  };

  try {
    const result = await dynamoDbLib.call("query", params);
    console.log(result);
    // Return the matching list of items in response body
    return success(result.Items);
  } catch (e) {
    console.log(e);
    return failure({ status: false });
  }
}
