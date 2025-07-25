
const { DynamoDBClient } = require("@aws-sdk/client-dynamodb");
const { ScanCommand,GetItemCommand,DeleteItemCommand } = require("@aws-sdk/client-dynamodb");
const config = { region: "us-east-1", apiVersion: "2012-08-10" };
const client = new DynamoDBClient(config);

exports.handler = async (event) => {
  // TODO implement
  const type = event.type;
  if(type === 'all'){
    const params = {
      TableName:'compare-yourself'
    }
    let resultData = await client.send(new ScanCommand(params));

    return resultData;
 
      let s = {
          "$schema": "http://json-schema.org/draft-04/schema#",
          "title": "CompareData",
          "type": "array",
          "items": {
              "properties": {
                  "age": { "type": "integer" },
                  "height": { "type": "integer" },
                  "income": { "type": "integer" }
              },
              "required": ["age", "height", "income"]
          }

      }
  }
  else if(type === 'single'){
    const userId = "";
    const params = {
      TableName:'compare-yourself',
      Key:{
        "UserId": {S: userId}
      }
    }
    let resultData = await client.send(new GetItemCommand(params));
    return resultData;
  }
  else if (type === 'delete') {
    const userId = event.userId;
    const params = {
      TableName: 'compare-yourself',
      Key: {
        'UserId': { S: userId }
      }
    };
    await client.send(new DeleteItemCommand(params));
    return `User with ID ${userId} deleted successfully`;
  }
  else{
    return "nothing"
  }
 
};