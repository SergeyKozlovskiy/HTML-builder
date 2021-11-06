const fs = require('fs');
const path = require('path');
const filePath = `${__dirname}/secret-folder`;

fs.readdir(filePath, {withFileTypes: true}, (err, files) => {
    if (err) throw err;
    files.forEach(el => {
        if(el.isFile()){
            let name = path.parse(el.name).name;
            let ext = path.parse(el.name).ext.substr(1);
            let pathEl = `${filePath}/${el.name}`;
            fs.stat(pathEl, (error, stats) => {
                if (error) {
                  console.log(error);
                }
                else {
                  console.log('\x1b[36m%s\x1b[0m', `${name} - ${ext} - ${stats.size}`);
                }
            });
        }
    })
});