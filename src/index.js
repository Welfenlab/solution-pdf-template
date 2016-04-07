var fs = require('fs');
var path = require('path');
var btoa = require('btoa');
var templateFile = path.join(__dirname, 'template', 'template.html');

var template = fs.readFileSync(templateFile, 'utf-8');
var templateDirectory = path.resolve(path.dirname(templateFile));
template = template.replace(/{dir}/g, templateDirectory);

module.exports = function(variables) {
	return template
        .replace(/{markdown-base64}/g, btoa(variables.markdown))
        .replace(/{correction-base64}/g, btoa(JSON.stringify(variables.correction)));
};