// Define font files
var fonts = {
   Roboto: {
    normal: 'fonts/Roboto-Regular.ttf',
    bold: 'fonts/Roboto-Medium.ttf',
    italics: 'fonts/Roboto-Italic.ttf',
    bolditalics: 'fonts/Roboto-MediumItalic.ttf'
  } 
};

var PdfPrinter = require('pdfmake');
const merge = require('easy-pdf-merge');
var printer = new PdfPrinter(fonts);
var fs = require('fs');
var docDefinition = require('./template')

var options = {};
/* var now = 'Tue Sep 10 2019 11:26:09'// new Date().toGMTString()
var image = {
    image: 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAMgAAADICAYAAACtWK6eAAAABHNCSVQICAgIfAhkiAAAAAlwSFlzAAALEwAACxMBAJqcGAAAE6BJREFUeJztnXm0HVWVh7+X5BHI8EhMMCEQAyTNEAEhQGRSwqCgCbpoUWiGxUJpY4M2g0baVsF2Fm1EEaTR0NAgGDTgwgEUxEaw0YhMTTtkMIkkgZBAIAkJyUve7T/2vevd93Lr1KmqU1X33vf71jorK++eOmfXsKvO2WefvUEIIYQQQgghhBBCCCGEEEIIIYQQQgghhBBCCCGEEEIIIYQQQgghhBBCCCGEEEIIIYQQQgghhBBCCCGEEEIIIYQQQgjhx6BqESXSUbYAA4BdgD2BPYBx1fJ6YCwwulpGAV3ASGAEMAwYUtdGN7C5WjYC64ENwEvAi8BaYA3wPLCqWlZW64oMSEHCMBHYH5gCTK6Wfap/H12iXOuAv1bLEmAR8H/VIuXxQAqSjE7gTcD06r8HAm8Edi1TqBRUgL8BzwC/B34HLMC+SKIOKYibLuB44DjgSOBQYOdSJcqXRcDDwAPVsqZcccpHCrIjRwCzgJOwL8UQd/W2pQI8BdwH3Ak8Ua44okymAV/GxuoVlYZlIfA54ICU11i0GLsAH8TG4WU/fK1WHsC+sm0/Amn7E2zAeOBS4ALgdQX2242ZX5/DxvYvYObZdcAr1bIeeK1atgA92JxnaPXfkZhBoAszDe9WV8Zj5uRdijoh7KtyFfCfVVnbjoGkIDsDlwGfwNYa8uA54E+YSXUJNmRbCqwAVmNv37x5HWZenkSvuXkKZoaeRD73/EngEuChHNoWBfAu7EENNcTYCjwO3Ah8CDiWctc7fBmBGSHOB64FHgU2Ee66zKM1roOoMgT4d7Lf+JeBnwKXA0dhQ552YTBmvr4YmI8N/bJcq8XAwYWegUjFOODXpL/RTwBfwL4OgwuWvUw6gMOBT2NfmB6SX7tXgfcVLbjwZ1fgf0l+Y/8MXAH8XfEiNy0TgTnYCyPJtdwGnFKCvCKGTswMmeRGzgdmlCBrqzEduBWzsPlc2/VouNV0XIu/cvwAfS3SsCcwF3u5xF3j5RRrehYOpmDrDXE3bSFwdEkythMHAo8Rf70vKUtA0ZfbiL9ZtwLDU7Y/EtvXMQnbz9Hqk/dR2Bxjb+x80mzQ6gS+ivuaP4/tcRElMh7YjvtGzSXZQtnRmP/RQ9iqd//2tmB7K24GzqW53d53Ak4Fvom5uK+n8fk8DXwXs0IlWVD9dIP26st5IU5CpGcW7hv0B/zekMMwV5RFMe01KpuB24FDAp1TCPYArsZ2HiY9n43YYuh+nn3d4Wjr2iBnI1IT9wabEXN8B/B+el1CspZ52MNZFsOAr2B+XVnPZRumKGNi+hzv6O+RYGcmUvFD3G9C13xhHHC/4/i0ZT1wVrhT9OYI8nHdXw28I6bvhyKO3RDq5EQ6om5MBRteRXEo5mUb+mGqL9dQXISSc/Ffp0hTejCHzyiudhzbTi46LcfjRN+YX0YccwzmZp6nctTK98hfSS4knWtImnJVhAxXOo4ZG/BcC6GdtpO6TLfrG/ztIOAn2N4KH3qwRa9V2Jh8FLbu4msyPgtzerzIs35SzgC+hb+Vbis2DFuDnc9YbNHUd8/9HGwvy5f6/d01lBqOWQNFCawg+s11a7+6o/Afo98PnEljN+5BmGPfVfhbiT4Q4Fz7cxB+buuvATcBJ9J4uNMJvAW4Hpu3+Qy33tmvjdmO+lMDnKtIiesBvaFfXZc5slaewCKZ+DIC8/6NW8nfhG1kCkUnftuG7yCZVW0s8B/ED9lW09e6da6j7rQU5ycC8SrRN+brdfVOdtSrleuxhbU0HIWtHLvavy9l2424PKavLWRbpJtF40XF+nJjXf33Ouodk0EOkRHXKnptnNyBhbJx3ezPB5BlMhb609XPcQH62RWb10T10Q3MDNDPdNxKso3excRTHfVOCCCLSMEg3A/jZ6r14lbbbwko0zTci3QhviJxX48LA/RRYxbu4VbtK/J2R524NRSRE0NxPyifrNa7x1FnKemdGKP4hKO/7ZjbeBb+4mj/3oxtN+IGR38bset3vKPOqTnIJDwYgVtBPo5ZrlwT6DNykGsn4FlHn5dmaHuao90e8rEYjcVt3XoPtkU56vfTcpApV9ol/0Sc2/l27M0Wte6zDNs8FZqtwHWO30/M0Lbr2J8Df8zQdhRr2dFkXs/bcMfHarntAe2iIHGLYz2YdSmK28kv8Nn3Hb8lMSP3580p+8yKq+3p2MsoipaLwzZQFKSCO6ZslCtKCJZhqQYaMYZ4D9ko9nf8lmcAt0exL2Mj4tzipSAlUfGoM8HxWx7DkXr+5Pht95RtRp3PZswlJi9qLiqNGEZ4Q0eptIsvVpyCdGAT9Bcjfo/6eyiWO/pIG9DgtYg2n8PvhZGFJVg84EYoQEMTMhK3Feuj5Yk24DiK6PtweolypaJdhliuiSG0z3m2Ai5L1bbCpAhEuzw4cQrScubFFsY1bJeClER3zO+dhUghwH2tpSAlUfMRikIKUhyuax33Ims62sWKBWZ+jNrznNZ1PYrdsE1KE7EdiRXMq3YZFjT7lcD9ZWUoFgVxMuYu0ontS1mFmbiXBuxLCtKkbCFaQUIEC9gPSzzzbtyLdD1YxqW7sIByKwP0nYYR2Dbf92H+Ua5r8DyW/+S/sJQRWXD1syVj2yIDrsQv387Q7lTgbtIFQ9iKRSksMj7WcCyFw7oU8lawWLsnZ+j/HEfbzRRQb8Dh8pq9KUV7Q7Cwoz7BsOPKeiyjbt4cjw3zsspbIX06tQscbSqFdIm4QoXenrCtMcB/O9pLW24jv9hQHyc+NnHSshSbuyThI4729kp5biIArq20dydoZxwWkDq0ctTK/YR3xwiRhzGqrMMiNfoyx9HW+PSnWA7tYuYFc9KLIkno/Tdi8a7yYhpm/QrFMOCkgO31ZxTw1gT1Xcq/KaMsIgO/IvrN9XDCtt5OfCSPNOVZkg9ZfBgD/E8O8m7Hcssn4YuO9rQeVSI/I/rGPJ6ivamkSwQaVR7Ahm95MRSz1oWS9wV2DArnQ1Rs3jh3IJEzPyb6Zi9O2eZQLK2CT5TBqLIas+wUtVnoJPwCybm+GnNJH0f3mxHtag2kZO4m+qavydj2blhQ5mWOPvqXp4F/ppwNRIOwAG4P4m/ZegkLmOdaBPXhuoj2W3L+0XJbIB3MIzp5/Rb8gzLHcQg2aT0YeAO9ribrMLPoU9h8aFGg/rIyDgvYdhhmfKi5mrxKr6vJb7A5TAhXkO9gX8z+bMA/ULjIgVtwvyHl8l4MUYlUWzKq+0Ax80K4L4hwE3WdW3IO0k4KEjfGVXajYohac2o5T14YWAoiG3wxSEGalDgF0RykGKJW0vMKzJcr7aQgcXOQdjrXZiZKQVrSYtpOD03cJLCdzrWZiZqkh97VWQjt9NC0XECANiVql+rIQqUIRDspSNwYtyU/8S1I1DPVkouE7aQgcSRxeRfpiXqmWvIF1U5BG+IYjzuIdJ4cS+NrvQ14JGWbBxEdGf4xzMGyDKLmGvLmLZnzcLuanF2eaGyNkOnlDG3+JKLNCu5cKHnSgRlLGsmUZ8T53GinIdaKmN/TBCAIQRfFL1KmzTmSlT2J/oL8pUhBQtFOCvL7mN/3KUSKHYlLKpMH+5bQJ9iwL4rVhUkRkHZSkPWYy3kUxxYlSD+OLqHPsoZYhzl+0xCrCXDdhMNxZ5nKizJyg59IOQtzroBzUpAmICoXINgE8ryiBKmyO/lGHIliNMXnJN8b99dSCtIExN2Ej1DsvpDLKM9J8mMF93cp7rWOllSQduPDxO+9/teCZNkL8zB2yZKXmbdW/j5D+0nYB3MWjZKjG+3HaQqOJf6h2UT2wARxdAA/95DltQx9POjR/gryN/kOwkIaueR4KmcZhCcj8YvC/gz5+gZd4SFDrUxK2ccKz/bvJV+Pic96yHBzjv2LhCzE78H5FfmE5Jnt2X+tXJiij0MS9nEL+cw3fYa0FeDiHPoWKZmH/4PzW8zSFIIOkn05amUxyU2ySc6xVu7CkuqEYBDw+QR9J4ntK3LmEpI9OM8Dp2Xscy/85hxR5VsJ+jorQz9/Bo5Je5JVpuCOg9y/bCWcYooAHES6h+cBLAFNEnYHvkq8tcpXSeIsPbOJdnz0LT3A94E3JTzXyVUZo5wRo0rSwOEiZzowv5+0D9BC4MvYCvhE+tr2u7BcGRcD92Hu6j5tzgN+6VFvMXARfRPNjMEiRj7icfwXgecSnOsfsGHhDOD1/a7jWMwqOAfLW5g2Oc9nEE3HHWR/o9fKdixsZto39y+wL8NELLqg73FbsPCgSd7Ug7D8Js+nlHVb9VxDpJ2rlbfE3CtRAq48eUWWH9F35f4Esg+RGpU1WJzgGpMx9/Kyz38jikfWlEwgXVbaUKUH+AKNTavvJewbegNwZIN+dgXml3gNKiRLfScK5mHcN28B4ZNeVrA393Exsr0DeCVAX6uBN8f0dQ7ph1xZyz/EyCZKxJVttQJ8BXM5uZ0wirISm7z7rmlMJl6JXeVe/N33u4B/w3KAhFSAO4nOmbIZmXebmt1xP/jP0jsEOgBzHEz6gGzBUr+dSbr9Fx3VY59O0OcC4F0p+gLzHLgAW8fwtcA1KrcC07ENUlF17kopoyiQh3Df6BPr6satgq/EzKLzsbfxOwn7hoxKXVZfrgzY32hsgfRLwD2Ykr7gIcOT9Jq+5zrqaXjVApyP+2b/oK7uCNzrJx/KUc634mfd2kjyBb4k/IuHDDOrdXcjeoF0HYpD1hLsgnvc3Q3sUVf/nxx112GxtUKzN2am9R3eLCefbLmTiF93+XVdfZcX7zU5yCdy4uu4b/pn6+oOxp36OfS4ejSWI9BXOWrld4R/Q8dtwOrB5h1gc5kXHXXz3m8jArIf7hu/lr5u7zNi6p8bSK6diZ8juco9hNvOe7ZHf7fU1f+Yo96DgWQSBRLnB/XRfvVdCUE3AFMzytOJPeBplaP+oc26z2My8Ra8V+gdXo7E7TJzekZ5RAmcjPsBWEVfl5AxuCfsy0k/jBiF337yCuaeHucR8D3Sb/zaHz+XlIvqjrnSUW8hbZbJqyUjbqfkt7hXnecAX6v7/2m45xzbMUfEBzDT51LMTPpqXZ3hmLVnEuaGfxy2iu7zQK/AYnnNxszKLjZhec6fBJZgHr3rqn/fjj20w7A5zwRs2HkkNqeIewYeqcrdgxkHFhK9Xfl8tL22ZZmJ+y35EjvG770x5phGZTu2gJhldX4jMK0qQwfpdhCGKOvpG7L1JkfdJQysbAFtyWO4H4ir+tXfGXg85pjQpRtbhOwvR5YJfdpSv9h3OO7h3gcaXG/RYpyK+4HYwo5ziz3xjyCStWwDzoiQvQsz7xalHPXDzcGYi0tU3b8it/a2Ic6i1chMOZVkO/XSlM3E743vItl+8LTlNvpax1xm3Qrwnhi5RQtxIPGOeuc0OG5vzBcrjwdyETaE8aET+Ab57Xf5Bn2VYzLuPfda92hDrsX9kKylcTigIVgA7Cx7tGulu9rOh0kXL/hwzFU/RMCISlWW/oG2BwO/cRyzDXdOkJZnIJl56xmNvbVdYTl/Rq9jXiPGYk6Gh2Hu8m/AFtO66I1OsgWzSK3B1lqWY2sbT2EJf0LkERxWleMYLKDcvlVZXEq3AZs3PA08igWgWNqg3pW4gy5chym4aEPeT/xbNU8P3rzpwtZfDsCGlftjgSN8FxWPxj0UXUV5ae1EQfwYt4JsBg4tUJ7hWGC2RqXIvIPjiLfcub6uok0Yj9srtYINRUYVJM/pDjm+5jguJJ3YfMR1TeYWJItoAs4gfqj1U4rxMWoGBbneIUMF24M+siBZRJPgE2guSfzctJStIHMc/Vcwy90JBcghmoyR+G1cuixnOcpUkDOJX1v5ZM4yiCZmX+L3RfSQbyLQshRkJvFBqeczcJcFRJVZxL9Ft2Fv2zwoQ0FOwVLBuc75GRTjSlTxSYLTjYUQDU3RCnIK7uSbFWxfyZQc+hYtSgfufQ/1E9bZgfsuUkHOJj7U0GaUHUo0YDD+gZ8/FbDfohTkUuKHkt3YkFOIhgwF7sdPSW4hncNhf/JWkE7gBkcf9V/HswL0J9qc4Zgzn4+SLKBvELo05Kkg4/APlp0m864YoHRhex58HqzV7LhdNgl5KcgJ+O2K3AZ8MEM/YoAyFPghfkpSwfabpBlyhVaQTmyfvc/mqtfInu1XDGAG4Td+r5U/ktwCFFJBpmNhgHxkfZn4pD9CeHEFyba73oxtrvIhhIJ0YRuZfHc8Pku+EePFAGQWybI1vQRcjkWbd5FFQTqxCIhJ0q39AgtsJ0Rw9iI+zlb/shLbpRiVjSqNggzC4lctTiDHdixaY9a4vkI4GQp8m2RKUsFCCH2KHXcJJlGQ4dh+8CUJ+16LxSoWojBmYgEZkirKJsytZQbm4uKjIAcDVxO/E7JRuZN8kgAJEctwLFlP2nBAy7DMtVG/LwCeSNn235DbiGgSjiD9gxy6bMcCwclVXTQVg7GNVUnnB6FKD5agNGuiHyFyZQjwj9gQpyjluAcLICdEyzAUW6PwyeaUpnQDP6I3yaYQLcsMLKZu3DZXn7IMMxdPKFB+IQphDBYlJWmCno2Y4+QpaKFPDBAmABcAd2OBpfsrxSLgGuBt9AbGFgWgMC7Nx06YF/C7scXHe7DEmUIIIYQQQgghhBBCCCGEEEIIIYQQQgghhBBCCCGEEEIIIYQQQgghhBBCCCGEEEIIIYQQQgghhBBCCCGEEEIIIYQQQgghhIv/B0FvNVgVF4w8AAAAAElFTkSuQmCC',
    width: 150,
    height: 200
} */

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
      widths: ['*', 150, '*'],
      body: []
    }
  })
}

function createPdf(fileName){
    docDefinition = JSON.parse(JSON.stringify(docDefinition))
    var pdfDoc = printer.createPdfKitDocument(docDefinition, options);
    pdfDoc.pipe(fs.createWriteStream(fileName || 'document.pdf'));
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
/* initEmptyPdf("Blah")
addRow(now, image, "Some Step 1")
addRow(now, image, "Some Step 2")
createPdf('document1.pdf')
initEmptyPdf()
addRow(now, image, "Another step entirely")
createPdf('document2.pdf')
mergeDocuments(['document1.pdf','document2.pdf'], 'merged.pdf') */


