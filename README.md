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

pdfMaker.initEmptyPdf("Blah")
pdfMaker.addRow(new Date().toGMTString(), image, "Some Step 1")
pdfMaker.addRow(new Date().toGMTString(), image, "Some Step 2")
pdfMaker.createPdf('document1.pdf')
pdfMaker.initEmptyPdf()
pdfMaker.addRow(new Date().toGMTString(), image, "Another step entirely")
pdfMaker.createPdf('document2.pdf')
pdfMaker.mergeDocuments(['document1.pdf','document2.pdf'], 'merged.pdf')
```
