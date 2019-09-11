var docDefinition = {
	info: { },
	header: { },
	footer: function(currentPage, pageCount) { return currentPage.toString() + ' of ' + pageCount; },
	"content": [ ],
	"styles": {
		"header": {
			"fontSize": 18,
			"bold": true,
			"margin": [0, 0, 0, 10]
		},
		"tableExample": {
			"margin": [0, 5, 0, 15]
		},
		"tableHeader": {
			"bold": true,
			"fontSize": 13,
			"color": "black"
		}
	},
	"defaultStyle": { }
}

module.exports = docDefinition