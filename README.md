# PDF Reporter for Node.js

### Installation

`npm install https://github.com/UnspecifiedLLC/pdf-reporter.git --save`

### Usage

```js
const pdfMaker = require('./')
var image = {
    image: 'data:image/png;base64,iVBORw0KG...',
    width: 150,
    height: 200
}

pdfMaker.initEmptyPdf("Before Test")
pdfMaker.addRow(new Date().toGMTString(), image, "Step 1")
pdfMaker.createPdf('before.pdf')
pdfMaker.initEmptyPdf("Test Finishes correctly")
pdfMaker.addRow(new Date().toGMTString(), image, "Step 1")
pdfMaker.addRow(new Date().toGMTString(), image, "Assert Step 1")
pdfMaker.createPdf('test1.pdf')
pdfMaker.mergeDocuments(['before.pdf','test1.pdf'], 'final.pdf')
```
