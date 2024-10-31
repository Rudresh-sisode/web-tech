
const { DynamoDBClient } = require("@aws-sdk/client-dynamodb");
const { ScanCommand } = require("@aws-sdk/client-dynamodb");
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
    // client.scan(params,function(err,data){
    //   if(err){
    //     console.log(err);
    //     callback(err);

    //   }
    //   else{
    //     console.log(' your data ',data);
    //     callback(data);
    //   }
    // })
  }
  else if(type === 'single'){
    return "single"
  }
  else{
    return "nothing"
  }
 
};