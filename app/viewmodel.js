(function(window){

  function ViewModel() {
    var self = this;

    var graph = ko.observable({
      v:ko.observableArray(),
      e:ko.observableArray()
    });

    self.isDrawingMode = ko.observable(true);

    self.show = function(mode) {
      // console.log('mode:', mode);
      self.isDrawingMode(mode === 'canvas');
    };
    self.json = ko.computed(function(){
      return ko.toJSON(graph);
    });
    self.addVertex = function(v) {
      // console.log('addVertex');
      graph().v.push(v);
    };
    self.addEdge = function(start, end) {
      // console.log('addEdge');
      graph().e.push([start, end]);
    }
  };

  window.ViewModel = ViewModel;

})(this);
