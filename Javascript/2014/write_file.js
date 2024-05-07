const fs = require('fs');

fs.writeFile('abc.txt', 'how are you, I\'m very fine', (err, file) => {
  if (err) {
    console.log("Errror ", err);
  }
  console.log("File ", file);
})

fs.appendFile('mynewfile1.txt', ' 657565', function (err) {
  if (err) throw err;
  console.log('Updated!');
}); 

fs.unlink('mynewfile.txt', (err) => {
  if (err) throw err;
  console.log('File deleted !');
})