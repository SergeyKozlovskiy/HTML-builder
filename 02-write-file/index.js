const fs = require('fs');
const path = require('path');
const readline = require('readline');
const { stdin: input, stdout: output } = require('process');
const filePath = `${path.join(__dirname, "data.txt")}`;

const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout,
  });

  fs.writeFile(
    filePath,
    '',
    'utf8',
    (err) => {
      if (err) throw err;
      console.log('Hello, enter text or "exit" to exit');
    }
  );

  rl.on('line', (line) => {
    if(line !== 'exit'){
        fs.appendFile(filePath, `\n${line}`, 'utf8', (err) => {
              if (err) throw err;
            }
          );
    }else{
        console.log('Good Bye! Take care!');
        rl.close();
    }
  });  

  rl.on('SIGINT', () => {
    console.log('Good Bye! Take care!');
    rl.close();
  });
