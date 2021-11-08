const fs = require('fs');
const path = require('path');
const template = `${__dirname}/template.html`;
const stylesPath = `${__dirname}/styles`;
const assetsPath = `${__dirname}/assets`;
const projectDistPath = `${__dirname}/project-dist`;
const indexHtml = `${__dirname}/project-dist/index.html`;
const style = `${__dirname}/project-dist/style.css`;
const assets = `${__dirname}/project-dist/assets`;
const componentsPath = `${__dirname}/components/`;
let components = {};
let templateText;
let templateTags;
let filesForTags;

// ищем шаблонные теги
function foundTemplateTags(){
    fs.readFile(`${template}`, "utf8", function(err, str){
        if (err) throw err;
        templateText = str;
        templateTags = str.match(/{{[a-z]+}}/g);
        filesForTags = templateTags.map(el => {
            return el.replace( /[{}]/g, '');
        });
        creaateComponentObject();
    });
}
foundTemplateTags();

// записываем данные из components в creaateComponentObject
function creaateComponentObject (){
    filesForTags.forEach(el => {
        let path = `${componentsPath}${el}.html`;
        fs.readFile(`${path}`, "utf8", function(err, str){
            if (err) throw err;
            components[el] = str;
        })
    })
    clearProgectDist();
}

// Очистка progect-dist
function clearProgectDist (){
    fs.stat(projectDistPath, (err, stats) => {
        if(err){
            fs.mkdir(projectDistPath, { recursive: false }, (err) => {
                if (err) throw err;
                createIndexHtml(components);
            });
        }else{
            fs.rm(projectDistPath, {force:true, recursive:true}, (err) => {
                if(!err){
                    clearProgectDist();
                }
            });
        }
    });
}


// создаем index.html
function createIndexHtml(components){
    for(let key in components){
        let regexp = new RegExp(`{{${key}}}`, 'g');
        templateText = templateText.replace(regexp, components[key]);
    }

    fs.appendFile(indexHtml, templateText, 'utf8', (err) => {
        if (err) throw err;
    });
    createStyle();
}
// создаем style.css
function createStyle (){
fs.readdir(stylesPath, {withFileTypes: true}, (err, files) => {
    if (err) throw err;
    files.forEach(el => {
        let ext = path.parse(el.name).ext;
        if(el.isFile() && ext === '.css'){
            fs.readFile(`${stylesPath}/${el.name}`, "utf8", function(err, styleText){ 
                if (err) throw err;
                fs.appendFile(style, `\n${styleText}`, 'utf8', (err) => {
                    if (err) throw err;
                });
            });
        }
    })
    copyAssets(assetsPath);
});
}

//копируем assets
function copyAssets (dir){
    let dirName = path.basename(dir);
    fs.mkdir(`${projectDistPath}/${dirName}`, { recursive: true }, (err) => {
        if (err) throw err;
    });

    const walk = function(dir, done) {
        // let results = [];
        fs.readdir(dir, function(err, list) {
          if (err) return done(err);
          var pending = list.length;
          if (!pending) return done(null, results);
          
          list.forEach(function(file) {
            let fileName = file;
            file = path.resolve(dir, file);
            let includePathFile = () => {
                let index = file.indexOf(dirName);
                return file.slice(index);
            }
            fs.stat(file, function(err, stat) {
              if (stat && stat.isDirectory()) {
                fs.mkdir(`${projectDistPath}/${includePathFile()}`, { recursive: true }, (err) => {
                    if (err) throw err;
                });
                walk(file, function(err, res) {
                //   results = results.concat(res);
                  if (!--pending) done(null);
                });
              } else {
                fs.copyFile(`${file}`, `${projectDistPath}/${includePathFile()}`, err => {
                    if(err) throw err; 
                    });
                if (!--pending) done(null);
              }
            });
          });
        });
    };

    walk(dir, function(err, results) {
        if (err) throw err;
    });
}






