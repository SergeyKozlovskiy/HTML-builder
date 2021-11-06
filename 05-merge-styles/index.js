const fs = require('fs');
const path = require('path');
const srcFilesPath = `${__dirname}/styles`;
const distFilesPath = `${__dirname}/project-dist/bundle.css`;

fs.stat(distFilesPath, (err, stats) => {
    if (err) {
        fs.appendFile(distFilesPath, '', 'utf8', (err) => {
            if (err) throw err;
        });
    };
    // если существует удалить 
    fs.unlink(`${distFilesPath}`, (err) => {
        if (err) throw err;
    });

    // создать bundle.css
    fs.readdir(srcFilesPath, {withFileTypes: true}, (err, files) => {
        if (err) throw err;
        files.forEach(el => {
            let ext = path.parse(el.name).ext;
            if(el.isFile() && ext === '.css'){
                fs.readFile(`${srcFilesPath}/${el.name}`, "utf8", function(err, data){ 
                    if (err) throw err;
                    fs.appendFile(distFilesPath, `\n${data}`, 'utf8', (err) => {
                        if (err) throw err;
                    });
                });
            }
        })
    });

    })



