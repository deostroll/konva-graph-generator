// start.js

(function(window, document) {
  var onLoad = function() {
    // console.log('load...');
    var el = document.getElementById('container');
    var graph = new Konva.Graphs.Graph(el);

  };

  $(window).bind('load', onLoad);
})(window, window.document);
