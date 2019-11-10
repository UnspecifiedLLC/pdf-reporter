// Define font files
var fonts = {
    Roboto: {
     normal: __dirname + '/fonts/Roboto-Regular.ttf',
     bold: __dirname + '/fonts/Roboto-Medium.ttf',
     italics: __dirname + '/fonts/Roboto-Italic.ttf',
     bolditalics: __dirname + '/fonts/Roboto-MediumItalic.ttf'
   } 
  }
  const merge = require('easy-pdf-merge')
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
   saveTmpDocDef(docDefinition)
  }
  
  function saveTmpDocDef(def) {
   fs.writeFileSync(__dirname + '/_tmp_report_spec.json', JSON.stringify(def || docDefinition, null, 4))
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
   saveTmpDocDef(docDefinition)
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
  
  function createPdf(fileName, def) {
   const execFile = require('child_process').execFile;
   const child = execFile('node', [__dirname +'/build.js', fileName], (error, stdout, stderr) => {
       if (error) {
           console.error('stderr', stderr);
           throw error;
       }
       console.log('stdout', stdout);
   });
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