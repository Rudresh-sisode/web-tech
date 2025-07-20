const client = require('./client');
async function init() {
  const result = await client.get("user:3");
  console.log("Result -> ", result);
}

init();