const express = required("express");

const app = express();

const port = 3000;

app.get("/", (req,res) => {
  res.send("hello word");
})

app.listen(port, () => {
  console.log("example app listening on port ", port);
})