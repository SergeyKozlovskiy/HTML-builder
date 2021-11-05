const fs = require('fs');
const copyFilesPath = `${__dirname}/files-copy`;
const filesPath = `${__dirname}/files`;

fs.stat(copyFilesPath, (err, stats) => {
// если не существует создать
  if (err) {
    fs.mkdir(copyFilesPath, { recursive: true }, (err) => {
    if (err) throw err;
    });
  }
// если существует удалить содержимое
    fs.readdir(copyFilesPath, {withFileTypes: false}, (err, files) => {
        if (err) throw err;
        files.forEach(el => {
            fs.unlink(`${copyFilesPath}/${el}`, (err) => {
                if (err) throw err;
            });
        })
    })
// и скопировать файлы
    fs.readdir(filesPath, {withFileTypes: false}, (err, files) => {
        if (err) throw err;
        files.forEach(el => {
            fs.copyFile(`${filesPath}/${el}`, `${copyFilesPath}/${el}`, err => {
            if(err) throw err; 
            });
        })
    });
})



