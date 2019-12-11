// Define font files

var fonts = {
  Roboto: {
   normal: __dirname + '/fonts/Roboto-Regular.ttf',
   bold: __dirname + '/fonts/Roboto-Medium.ttf',
   italics: __dirname + '/fonts/Roboto-Italic.ttf',
   bolditalics: __dirname + '/fonts/Roboto-MediumItalic.ttf'
 } 
}
const download = require('image-downloader')
const merge = require('easy-pdf-merge')
var fs = require('fs');
const request = require('request').defaults({ encoding: null });
var docDefinition = require('./template')
var initialized = false
var options = {};

function mergeDocuments(source_files, dest_file_path) {
 merge(source_files, dest_file_path,function(err){
   if(err) {
     return console.log(err)
   }
   console.log('Success')
 });
}

function cleanup() {
  fs.readdir(__dirname, (err, files) => {
      files.forEach(file => {
          if (file.includes('.png')) {
            fs.unlink(__dirname + '/' + file, (err, info) => {
              
            })
          }
      });
  });
}

function initEmptyPdf(header, meta, suppliedDocumentDefinition) {
  cleanup()
  docDefinition = suppliedDocumentDefinition || docDefinition
  if (meta) {
    docDefinition.info = meta
  }
  if (!suppliedDocumentDefinition) {
    docDefinition.content = []
  }
  if (header) {
    addHeader(header)
  }
  saveTmpDocDef(docDefinition)
}

function saveTmpDocDef(def) {
 fs.writeFileSync(__dirname + '/_tmp_report_spec.json', JSON.stringify(def || docDefinition, null, 4))
 initialized = true
}

function addTitle(text, suppliedDocumentDefinition) {
 docDefinition = suppliedDocumentDefinition || docDefinition
 docDefinition.content.push({ text: text, style: 'header'})
 saveTmpDocDef(docDefinition)
}

function addHeader(header, suppliedDocumentDefinition) {
 docDefinition = suppliedDocumentDefinition || docDefinition
 docDefinition.header = { text: header, style: 'header'}
 saveTmpDocDef(docDefinition)
}

function addFooter(header, suppliedDocumentDefinition) {
 docDefinition = suppliedDocumentDefinition || docDefinition
 docDefinition.header = { text: header, style: 'header'}
 saveTmpDocDef(docDefinition)
}

function addText(text, suppliedDocumentDefinition) {
 docDefinition = suppliedDocumentDefinition || docDefinition
 docDefinition.content.push(text)
 saveTmpDocDef(docDefinition)
}

async function downloadIt(url, dest, cb){
  let file = fs.createWriteStream(dest);
  /* Using Promises so that we can use the ASYNC AWAIT syntax */
  
  return await new Promise((resolve, reject) => {
      let data
      let stream = request({
          /* Here you should specify the exact link to the file you are trying to download */
          uri: url,
          headers: {
              'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,image/apng,*/*;q=0.8',
              'Accept-Encoding': 'gzip, deflate, br',
              'Accept-Language': 'en-US,en;q=0.9,fr;q=0.8,ro;q=0.7,ru;q=0.6,la;q=0.5,pt;q=0.4,de;q=0.3',
              'Cache-Control': 'max-age=0',
              'Connection': 'keep-alive',
              'Upgrade-Insecure-Requests': '1',
              'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_12_6) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/68.0.3440.106 Safari/537.36'
          },
          /* GZIP true for most of the websites now, disable it if you don't need it */
          gzip: false
      }, function (error, response, body) {
        if (!error && response.statusCode == 200) {
          data = "data:" + response.headers["content-type"] + ";base64," + new Buffer.from(body).toString('base64');
          // console.log(data);
        }
      })
      .pipe(file)
      .on('finish', () => {
          console.log(`The file is finished downloading.`);
          fs.unlink(dest, ()=>{
            resolve(data);
          })
          
      })
      .on('error', (error) => {
          reject(error);
      })
  })
  .catch(error => {
      // console.log(`Something happened: ${error}`);
  })
}

async function addRow(date, description, image, tableDefinition) {
  var content = docDefinition.content[docDefinition.content.length -1]
  if (typeof(content)!== "object" || !content || !content.table) {
    addTable(tableDefinition)
  }
  if (image.image.includes('http')) {
    var toDownload = image.image
    var fileName = image.image.split('/').reverse()[0]
    image.image = __dirname + '/' + fileName
    await downloadIt(toDownload, image.image).then((data)=>{
      image.image = data
      var row = [
        date,
        description,
        image
      ]
      content = docDefinition.content.filter(def=>{return def.table})
      content[content.length -1].table.body.push(row)
      saveTmpDocDef(docDefinition)
    })
    
    
 } else {
      var row = [
        date,
        description,
        image
      ]
      content = docDefinition.content.filter(def=>{return def.table})
      content[content.length -1].table.body.push(row)
      saveTmpDocDef(docDefinition)
    }
}

function addTable(tableDefinition) {
 docDefinition.content.push(tableDefinition || {
   style: 'tableExample',
   table: {
     "dontBreakRows": true,
     "widths": [150, 150, "*"],
     "body": []
   }
 })
 saveTmpDocDef(docDefinition)
}

function createPdf(fileName, eraseTmp, cb) {
  console.log("erase?", eraseTmp)
  if (eraseTmp === undefined) {
    eraseTmp = true;
  }
  const execFile = require('child_process').execFile;
  if (initialized) {
      doExec(fileName, eraseTmp)
  } else {
    initEmptyPdf("Empty")
    doExec(fileName, eraseTmp)
  }
 
  function doExec(fileName, eraseTmp) {
    execFile(
      'node',
      [__dirname + '/build.js', fileName, eraseTmp],
      (error, stdout, stderr) => {
        if (error) {
          console.error('stderr', stderr);
          throw error;
        }
        console.log('stdout', stdout.trim());
        if (stdout.trim() === 'ENDED') {
          console.log('Detected Ended');
          initialized = false
          return cb(fileName);
        }
        console.log(stdout)
      }
    );
  }
}

module.exports = {
 initEmptyPdf,
 addTable,
 addRow,
 createPdf,
 mergeDocuments,
 addHeader,
 addText,
 addTitle,
 addFooter
}


