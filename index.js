// Define font files
console.log( )
var fonts = {
   Roboto: {
    normal: __dirname + '/fonts/Roboto-Regular.ttf',
    bold: __dirname + '/fonts/Roboto-Medium.ttf',
    italics: __dirname + '/fonts/Roboto-Italic.ttf',
    bolditalics: __dirname + '/fonts/Roboto-MediumItalic.ttf'
  } 
};

var PdfPrinter = require('pdfmake');
const merge = require('easy-pdf-merge');
var printer = new PdfPrinter(fonts);
var fs = require('fs');
var docDefinition = require('./template')

var options = {};

function mergeDocuments(source_files, dest_file_path) {
  merge(source_files, dest_file_path,function(err){
    if(err) {
      return console.log(err)
    }
    console.log('Success')
  });
}

function initEmptyPdf(header, meta, suppliedDocumentDefinition) {
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
}

function addTitle(text, suppliedDocumentDefinition) {
  docDefinition = suppliedDocumentDefinition || docDefinition
  docDefinition.content.push({ text: text, style: 'header'})
}

function addHeader(header, suppliedDocumentDefinition) {
  docDefinition = suppliedDocumentDefinition || docDefinition
  docDefinition.header = { text: header, style: 'header'}
}

function addFooter(header, suppliedDocumentDefinition) {
  docDefinition = suppliedDocumentDefinition || docDefinition
  docDefinition.header = { text: header, style: 'header'}
}

function addText(text, suppliedDocumentDefinition) {
  docDefinition = suppliedDocumentDefinition || docDefinition
  docDefinition.content.push(text)
}

function addRow(date, description, image, tableDefinition) {
  if (docDefinition.content.filter(def=>{return def.table}).length < 1) {
    addTable(tableDefinition)
  }
  var row = [
      date,
      description,
      image
  ]
  docDefinition.content.filter(def=>{return def.table})[0].table.body.push(row)
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
}

function createPdf(fileName){
    docDefinition = JSON.parse(JSON.stringify(docDefinition))
    var pdfDoc = printer.createPdfKitDocument(docDefinition, options);

    getDoc(pdfDoc, (err, buffer, pages)=>{
      fs.writeFileSync(fileName || 'out.pdf', buffer)
    })
}

function getDoc(pdfDoc, cb) {
  // buffer the output
  var chunks = [];
  
  pdfDoc.on('data', function(chunk) {
  	chunks.push(chunk);
  });
  pdfDoc.on('end', function() {
  	var result = Buffer.concat(chunks);
  	cb(null, result, pdfDoc._pdfMakePages);
  });
  pdfDoc.on('error', cb);
  
  // close the stream
  pdfDoc.end();
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


