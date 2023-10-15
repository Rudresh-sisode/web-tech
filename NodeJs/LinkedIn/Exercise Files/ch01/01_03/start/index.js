const { fork } = require("child_process")

const processes  = [
    fork('./app',['8000']),
    fork('./app',['8001']),
    fork('./app',['8002'])
]

console.log(`forked processes ${processes.length} processes`);