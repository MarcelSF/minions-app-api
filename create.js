import uuid from "uuid";
import * as dynamoDbLib from "./libs/dynamodb-lib";
import { success, failure } from "./libs/response-lib";

export async function main(event, context) {
  // Request body is passed in as a JSON encoded string in 'event.body'
  const data = JSON.parse(event.body);

  const params = {
    TableName: "minions02",

    Item: {
      minionId: uuid.v1(),
      name: data.name,
      attachment: data.attachment,
      reserved: data.reserved,
      reserved_by: data.reserved_by,
      createdAt: Date.now(),
      color: data.color
    }
  };

 try {
    await dynamoDbLib.call("put", params);
    return success(params.Item);
  } catch (e) {
    return failure({ status: false });
  }
}
