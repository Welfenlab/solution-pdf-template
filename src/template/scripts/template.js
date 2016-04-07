var _ = require('lodash');
var $ = require('jquery');
var Scribble = require('scribble.js')($);
var SvgCanvas = require('canvas2svg');

window.renderMarkdown = function(markdownBase64) {
  var defaultConfig = {
    runTimeout: 1.5 * 1000,
    debugTimeout: 2 * 60 * 1000,
    codeControls: {
      template: _.template('<%= html %>')
    },
    dotProcessor: {
      baseSVGTemplate: _.template("<svg data-element-id=\"<%= id %>\"><g/></svg>"),
      errorTemplate: _.template("<p style='background-color:red'><%= error %></p>")
    },
    testProcessor: false,
    treeProcessor: false
  };
  
  try {
    var markdownToHtml = require('@tutor/markdown2html')(defaultConfig);
    markdownToHtml('output').render(atob(markdownBase64));
  } catch (e) {
    document.write(JSON.stringify(e));
  }
  
  MathJax.Hub.Queue(["Typeset", MathJax.Hub]);
  return MathJax.Hub.Queue(function() {
    return window.PHANTOM_HTML_TO_PDF_READY = true;
  });
};

function createSvg(shapes, page) {
    var ctx = new SvgCanvas();
    Scribble.drawShapesOn(ctx, shapes);
    return $(ctx.getSvg()).css({
      'top': (page * 29.7) + 'cm'
    });
}

window.renderCorrection = function(correctionBase64) {
  var corrections = JSON.parse(atob(correctionBase64));
  corrections.forEach(function(shapes, i) {
    $('#highlighter').append(createSvg(_.filter(shapes, {tool: 'highlighter'}), i));
    $('#correction').append(createSvg(_.reject(shapes, {tool: 'highlighter'}), i));
  });
};