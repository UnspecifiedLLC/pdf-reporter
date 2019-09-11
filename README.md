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
pdfMaker.addRow(new Date().toGMTString(), "Step 1", image)
pdfMaker.createPdf('./out/before.pdf')
pdfMaker.initEmptyPdf("Test Finishes correctly")
pdfMaker.addRow(new Date().toGMTString(), "Step 1")
pdfMaker.addRow(new Date().toGMTString(), "Assert Step 1", image)
pdfMaker.createPdf('./out/test1.pdf')
pdfMaker.initEmptyPdf()
pdfMaker.addHeader("A Header Added Explicitly")
pdfMaker.addText("Some text I'm adding explicitly")
pdfMaker.addRow(new Date().toGMTString(), "Step 1")
pdfMaker.createPdf('./out/test2.pdf')
pdfMaker.mergeDocuments(['./out/before.pdf','./out/test1.pdf', './out/test2.pdf'], './out/final.pdf')
```
