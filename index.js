// Define font files
var fonts = {
  Roboto: {
    normal: __dirname + '/fonts/Roboto-Regular.ttf',
    bold: __dirname + '/fonts/Roboto-Medium.ttf',
    italics: __dirname + '/fonts/Roboto-Italic.ttf',
    bolditalics: __dirname + '/fonts/Roboto-MediumItalic.ttf'
  }
};
const merge = require('easy-pdf-merge');
var fs = require('fs');
const request = require('request');
var docDefinition = require('./template');
var initialized = false;
var options = {};

function mergeDocuments(source_files, dest_file_path) {
  merge(source_files, dest_file_path, function(err) {
    if (err) {
      return console.log(err);
    }
    console.log('Success');
  });
}

function cleanup() {
  fs.readdir(__dirname, (err, files) => {
    files.forEach(file => {
      if (file.includes('.png')) {
        fs.unlink(__dirname + '/' + file, (err, info) => {});
      }
    });
  });
}

function initEmptyPdf(header, meta, suppliedDocumentDefinition) {
  cleanup();
  docDefinition = suppliedDocumentDefinition || docDefinition;
  if (meta) {
    docDefinition.info = meta;
  }
  if (!suppliedDocumentDefinition) {
    docDefinition.content = [];
  }
  if (header) {
    addHeader(header);
  }
  saveTmpDocDef(docDefinition);
}

function saveTmpDocDef(def) {
  fs.writeFileSync(
    __dirname + '/_tmp_report_spec.json',
    JSON.stringify(def || docDefinition, null, 4)
  );
  initialized = true;
}

function addTitle(text, suppliedDocumentDefinition) {
  docDefinition = suppliedDocumentDefinition || docDefinition;
  docDefinition.content.push({ text: text, style: 'header' });
  saveTmpDocDef(docDefinition);
}

function addHeader(header, suppliedDocumentDefinition) {
  docDefinition = suppliedDocumentDefinition || docDefinition;
  docDefinition.header = { text: header, style: 'header' };
  saveTmpDocDef(docDefinition);
}

function addFooter(header, suppliedDocumentDefinition) {
  docDefinition = suppliedDocumentDefinition || docDefinition;
  docDefinition.header = { text: header, style: 'header' };
  saveTmpDocDef(docDefinition);
}

function addText(text, suppliedDocumentDefinition) {
  docDefinition = suppliedDocumentDefinition || docDefinition;
  docDefinition.content.push(text);
  saveTmpDocDef(docDefinition);
}

function download(url, dest, cb) {
  const file = fs.createWriteStream(dest);
  const sendReq = request.get(url);

  // verify response code
  sendReq.on('response', response => {
    if (response.statusCode !== 200) {
      return cb('Response status was ' + response.statusCode);
    }
    sendReq.pipe(file);
  });

  // close() is async, call cb after close completes
  file.on('finish', () => file.close(cb));

  // check for request errors
  sendReq.on('error', err => {
    fs.unlink(dest);
    return cb(err.message);
  });

  file.on('error', err => {
    // Handle errors
    fs.unlink(dest); // Delete the file async. (But we don't check the result)
    return cb(err.message);
  });
}

function addRow(date, description, image, tableDefinition) {
  if (
    docDefinition.content.filter(def => {
      return def.table;
    }).length < 1
  ) {
    addTable(tableDefinition);
  }
  if (image.image.includes('http')) {
    var toDownload = image.image;
    var fileName = image.image.split('/').reverse()[0];
    image.image = __dirname + '/' + fileName;
    download(toDownload, image.image, () => {
      var row = [date, description, image];
      docDefinition.content
        .filter(def => {
          return def.table;
        })[0]
        .table.body.push(row);
      saveTmpDocDef(docDefinition);
    });
  } else {
    var row = [date, description, image];
    docDefinition.content
      .filter(def => {
        return def.table;
      })[0]
      .table.body.push(row);
    saveTmpDocDef(docDefinition);
  }
}

function addTable(tableDefinition) {
  docDefinition.content.push(
    tableDefinition || {
      style: 'tableExample',
      table: {
        dontBreakRows: true,
        widths: [150, 150, '*'],
        body: []
      }
    }
  );
  saveTmpDocDef(docDefinition);
}

function createPdf(fileName, cb) {
  const execFile = require('child_process').execFile;
  if (initialized) {
    doExec(fileName);
  } else {
    initEmptyPdf('Empty');
    doExec(fileName);
  }

  function doExec(fileName) {
    execFile(
      'node',
      [__dirname + '/build.js', fileName],
      (error, stdout, stderr) => {
        if (error) {
          console.error('stderr', stderr);
          throw error;
        }
        console.log('stdout', stdout.trim());
        if (stdout.trim() === 'Ended') {
          console.log('Detected Ended');
          initialized = false;
          return cb(fileName);
        }
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
};
