const { DynamoDBClient, PutItemCommand } = require("@aws-sdk/client-dynamodb");

const config = { region: "us-east-1", apiVersion: "2012-08-10" };

const client = new DynamoDBClient(config);

exports.handler = async (event) => {
  var params = {
    Item: {
      "UserId": {
        S: "ielnie2238",
      },
      "Age": {
        S: "20",
      },
      "Height": {
        S: "155",
      },
      "Income": {
        S: "70300",
      },
    },
    TableName: "compare-yourself",
  };
 
  const dbResponse = await client.send(new PutItemCommand(params));
 
  const response = {
    statusCode: 200,
    body: JSON.stringify(`Hello from Lambda!, ${JSON.stringify(dbResponse)}`),
  };
  return response;
};