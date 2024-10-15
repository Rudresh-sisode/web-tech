const { DynamoDBClient, PutItemCommand } = require("@aws-sdk/client-dynamodb");

const config = { region: "eu-north-1", apiVersion: "2012-08-10" };

const client = new DynamoDBClient(config);

exports.handler = async  (event,context,callback) => {

  const params = {
    Item:{
      "UserId":{
        S:"lsdkjf4830dk"
      },
      "Age":{
        N:"23"
      },
      "Height":{
        N:"72"
      },
      "Income":{
        N:"2580"
      }
    },
    TableName:"compare-yourself"
  }
   
  const dbResponse = await client.send(new PutItemCommand(params));
  
  console.log("event log ",event.age);
  callback(null,event.age * 2);
};
