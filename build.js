var fileName = process.argv[2] || 'out.pdf'
var docDefinition = require('./_tmp_report_spec.json')
var options = {}

var fonts = {
    Roboto: {
     normal: __dirname + '/fonts/Roboto-Regular.ttf',
     bold: __dirname + '/fonts/Roboto-Medium.ttf',
     italics: __dirname + '/fonts/Roboto-Italic.ttf',
     bolditalics: __dirname + '/fonts/Roboto-MediumItalic.ttf'
   } 
 };
var fs = require('fs')
var PdfPrinter = require('pdfmake')
var printer = new PdfPrinter(fonts)
var pdfDoc = printer.createPdfKitDocument(docDefinition, options)
    
getDoc(pdfDoc, (err, buffer, pages)=>{
    fs.writeFile(fileName || 'out.pdf', buffer, ()=>{
        fs.unlink(__dirname + '/_tmp_report_spec.json', ()=>{})
    })
})

function getDoc(pdfDoc, cb) {
    // buffer the output
    var chunks = [];
    
    pdfDoc.on('data', function(chunk) {
        chunks.push(chunk);
    });
    pdfDoc.on('end', function() {
        var result = Buffer.concat(chunks);
        console.log("ENDED")
        cb(null, result, pdfDoc._pdfMakePages);
    });
    pdfDoc.on('error', cb);
    
    // close the stream
    pdfDoc.end();
    }