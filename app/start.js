// start.js

(function(window, document) {
  var onLoad = function() {
    // console.log('load...');
    var el = document.getElementById('container');
    var graph = new Konva.Graphs.Graph(el);
    var vm = new ViewModel();
    graph.on('add', function(e){

      if (e.type === 'vertex') {
        vm.addVertex(e.data.getAttr('tag'));
      }
      else if (e.type === 'edge') {
        var from = e.data._from, to = e.data._to;
        var start = from.getAttr('tag'), end = to.getAttr('tag');
        vm.addEdge(start, end);
      }
    });
    ko.applyBindings(vm);
  };

  $(window).bind('load', onLoad);
})(window, window.document);
