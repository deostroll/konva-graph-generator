//graph.js

(function(w, $) {

  function Graph(el) {
    this._el = el;
    this.stage = new Konva.Stage({
      container: el
    });
    this._init();
    this._nodes = [];
    this._prev = null;
  }

  Graph.prototype = {
    _init: function() {
      var $el = $(this._el);
      var stage = this.stage;
      var s = {},
        c = {};
      var locals = {
        counter: 0,
      };
      // console.log('init');
      var self = this;
      var $w = $(window);
      var resize = function() {
        // console.log('resize...');
        s.h = $w.height();
        s.w = $w.width();
        var offset = $el.offset();
        var ht = s.h - offset.top - offset.left,
          wd = $el.parent() ? $el.parent().width() : s.w;
        c.w = wd;
        c.h = ht;
        // console.log('container:', c);
        stage.width(wd);
        stage.height(ht);
        if (rect) {
          console.log('rect', rect);
          rect.height(ht);
          rect.width(wd);
        }
        stage.draw();
      };
      resize();

      $w.bind('resize', resize);
      var layer = new Konva.Layer();
      var rect = new Konva.Rect({
        height: c.h,
        width: c.w,
        stroke: 'black'
      });
      layer.add(rect);
      stage.add(layer);
      stage.on('click', function(e) {
        // console.log('stage click...', e);
        if (e.target === rect) {
          if (self._prev) {
            self._prev.clear();
            self._prev = null;
            layer.draw();
            return;
          }
          var pos = stage.getPointerPosition();
          self.add(pos, locals.counter++);
        }
      });


      this._layer = layer;
    },
    add: function(pos, item) {
      var layer = this._layer;
      var self = this;

      var vertex = new Konva.Graphs.Vertex({
        x: pos.x,
        y: pos.y,
        text: item.toString(),
        tag: item
      });
      layer.add(vertex);
      vertex.on('click', function(e) {
        // console.log('vertex click', e);
        if (e.target.parent === vertex) {
          if (self._prev) {
            self.addEdge(self._prev, vertex);
            self._prev.clear();
            self._prev = null;
          } else {
            self._prev = vertex;
            vertex.highlight();
          }
          layer.draw();
        }
      });

      layer.draw();
    },
    addEdge: function(v1, v2) {
      var edge = new Konva.Graphs.Edge(v1, v2);
      var layer = this._layer;
      layer.add(edge);
      layer.draw();
    }
  };
  Konva.Graphs = Konva.Graphs || {};
  Konva.Graphs.Graph = Graph;
})(window, window.jQuery);
