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
      ":reserved_by": event.requestContext.identity.cognitoIdentityId
    },

    ReturnValues: "ALL_NEW"
  };

  // Getting user email function
  const AWS = require('aws-sdk');
  let cognitoClient = new AWS.CognitoIdentityServiceProvider({apiVersion: '2016-04-18'});

  async function getUserOfAuthenticatedUser(event) {
    // Get the unique ID given by cognito for this user, it is passed to lambda as part of a large string in event.requestContext.identity.cognitoAuthenticationProvider
    let userSub = event.requestContext.identity.cognitoAuthenticationProvider.split(':CognitoSignIn:')[1]
    let request = {
        UserPoolId: 'us-east-1_r5k0eKMkA', // Set your cognito user pool id
        Filter: `sub = "${userSub}"`,
        Limit: 1
    }

    const user_call = await cognitoClient.listUsers(request).promise();
    const email = user_call.Users[0].Attributes[2].Value;
    return email;
  }

  //Minion info

   const minion_params = {
    TableName: "minions02",

    Key: {
      minionId: event.pathParameters.id
    }
  };

  // Mailgun info
  var api_key = secret-api-key;
  var domain = 'mg.minions-teste.de';
  var mailgun = require('mailgun-js')({apiKey: api_key, domain: domain, timeout: 1500, retry: 2});
  var minion = await dynamoDbLib.call("get", minion_params);
  var minion_name = minion.Item.name;
  var minion_price = minion.Item.price;
  var minion_color = minion.Item.color;
  var minion_mood = minion.Item.mood;
  var to_email =  await getUserOfAuthenticatedUser(event);

  var data = {
    from: 'Excited Minion Fabricator <marcelsf23br@gmail.com>',
    to: `${to_email}`,
    subject: 'Minion reservation confirmed',
    text: `Minion ${minion_name}, has been succesfully reserved for $ ${minion_price}. Remember, his color is ${minion_color} and his alignment is ${minion_mood}`
  };




  try {
    // console.log(event.requestContext);
    await mailgun.messages().send(data, function (error, body) {

      console.log(error);
      console.log(body);
      console.log(data);

    });

    const result = await dynamoDbLib.call("update", params);
    return success({ status: true });

  } catch (e) {
    console.log(e);
    return failure({ status: false });
  }

}
