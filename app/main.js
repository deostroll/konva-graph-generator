//edge.js
(function() {
  Konva.Graphs = Konva.Graphs || {};

  function Edge(v1, v2) {
    this._from = v1,
      this._to = v2
    Konva.Arrow.call(this, {
      fill: 'black',
      pointerWidth: 5,
      pointerLength: 5,
      strokeWidth: 2,
      stroke: 'black'
    });
    this.$init();
  }

  Edge.prototype = {
    _draw: function() {
      var from = this._from;
      var to = this._to;

      var line = {
        start: from.getPosition(),
        end: to.getPosition()
      };

      var d = {
        x: line.end.x - line.start.x,
        y: line.end.y - line.start.y
      };
      var r = 20;
      var angle = Math.atan2(d.y, d.x);
      var offset = {
        x: r * Math.cos(angle),
        y: r * Math.sin(angle)
      };

      this.x( from.x() + offset.x );
      this.y( from.y() + offset.y );
      this.points([0,0, d.x - 2 * offset.x, d.y - 2 * offset.y])
    },
    $init: function() {
      this._draw();
      var self = this;
      var from = this._from;
      var to = this._to;

      var update = function(e) {
        // console.log('dragmove:', e);
        self._draw();
        e.target.parent.draw();
      }

      from.on('dragmove', update);
      to.on('dragmove', update);
    }
  };

  Konva.Util.extend(Edge, Konva.Arrow);
  Konva.Graphs.Edge = Edge;

})();

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
    this._events = {};
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
      self._fire('add', { type: 'vertex', data: vertex });
    },
    addEdge: function(v1, v2) {
      var self = this;
      var edge = new Konva.Graphs.Edge(v1, v2);
      var layer = this._layer;
      layer.add(edge);
      layer.draw();
      self._fire('add', { type: 'edge', data: edge });
    },
    _fire: function(eventKey) {
      var events = this._events;
      var args = [].slice.call(arguments);
      args.shift();
      var fn = events[eventKey];
      if (fn) {
        fn.apply(this, args);
      }
    },
    on: function(key, fn) {
      this._events[key] = fn;
    }
  };
  Konva.Graphs = Konva.Graphs || {};
  Konva.Graphs.Graph = Graph;
})(window, window.jQuery);

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

//vertex.js

(function($) {
  var extend = $.extend;
  Konva.Graphs = Konva.Graphs || {};

  function Vertex(config) {
    var groupConfig = {
      draggable: true
    };
    groupConfig = extend(groupConfig, config);
    Konva.Group.call(this, groupConfig);
    this.$init(config);
    this.childs = [];
  }

  Vertex.prototype = {
    $init: function(config) {
      var circle = new Konva.Circle({
        radius: 20,
        fill: 'lightgreen'
      });

      var text = new Konva.Text({
        text: config.text,
        fontSize: 12,
        fill: 'black'
      });

      var textDim = text.getClientRect();

      text.offset({
        x: textDim.width / 2,
        y: textDim.height / 2
      });

      this.add(circle);
      this.add(text);
      this._circle = circle;
    },
    highlight: function() {
      this._circle.stroke('black');
    },
    clear: function() {
      this._circle.stroke(null);
    }
  };

  Konva.Util.extend(Vertex, Konva.Group);

  Konva.Graphs.Vertex = Vertex;

})(window.jQuery);

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

//# sourceMappingURL=data:application/json;charset=utf8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImVkZ2UuanMiLCJncmFwaC5qcyIsInN0YXJ0LmpzIiwidmVydGV4LmpzIiwidmlld21vZGVsLmpzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FDL0RBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUMvSEE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUN4QkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FDckRBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSIsImZpbGUiOiJtYWluLmpzIiwic291cmNlc0NvbnRlbnQiOlsiLy9lZGdlLmpzXHJcbihmdW5jdGlvbigpIHtcclxuICBLb252YS5HcmFwaHMgPSBLb252YS5HcmFwaHMgfHwge307XHJcblxyXG4gIGZ1bmN0aW9uIEVkZ2UodjEsIHYyKSB7XHJcbiAgICB0aGlzLl9mcm9tID0gdjEsXHJcbiAgICAgIHRoaXMuX3RvID0gdjJcclxuICAgIEtvbnZhLkFycm93LmNhbGwodGhpcywge1xyXG4gICAgICBmaWxsOiAnYmxhY2snLFxyXG4gICAgICBwb2ludGVyV2lkdGg6IDUsXHJcbiAgICAgIHBvaW50ZXJMZW5ndGg6IDUsXHJcbiAgICAgIHN0cm9rZVdpZHRoOiAyLFxyXG4gICAgICBzdHJva2U6ICdibGFjaydcclxuICAgIH0pO1xyXG4gICAgdGhpcy4kaW5pdCgpO1xyXG4gIH1cclxuXHJcbiAgRWRnZS5wcm90b3R5cGUgPSB7XHJcbiAgICBfZHJhdzogZnVuY3Rpb24oKSB7XHJcbiAgICAgIHZhciBmcm9tID0gdGhpcy5fZnJvbTtcclxuICAgICAgdmFyIHRvID0gdGhpcy5fdG87XHJcblxyXG4gICAgICB2YXIgbGluZSA9IHtcclxuICAgICAgICBzdGFydDogZnJvbS5nZXRQb3NpdGlvbigpLFxyXG4gICAgICAgIGVuZDogdG8uZ2V0UG9zaXRpb24oKVxyXG4gICAgICB9O1xyXG5cclxuICAgICAgdmFyIGQgPSB7XHJcbiAgICAgICAgeDogbGluZS5lbmQueCAtIGxpbmUuc3RhcnQueCxcclxuICAgICAgICB5OiBsaW5lLmVuZC55IC0gbGluZS5zdGFydC55XHJcbiAgICAgIH07XHJcbiAgICAgIHZhciByID0gMjA7XHJcbiAgICAgIHZhciBhbmdsZSA9IE1hdGguYXRhbjIoZC55LCBkLngpO1xyXG4gICAgICB2YXIgb2Zmc2V0ID0ge1xyXG4gICAgICAgIHg6IHIgKiBNYXRoLmNvcyhhbmdsZSksXHJcbiAgICAgICAgeTogciAqIE1hdGguc2luKGFuZ2xlKVxyXG4gICAgICB9O1xyXG5cclxuICAgICAgdGhpcy54KCBmcm9tLngoKSArIG9mZnNldC54ICk7XHJcbiAgICAgIHRoaXMueSggZnJvbS55KCkgKyBvZmZzZXQueSApO1xyXG4gICAgICB0aGlzLnBvaW50cyhbMCwwLCBkLnggLSAyICogb2Zmc2V0LngsIGQueSAtIDIgKiBvZmZzZXQueV0pXHJcbiAgICB9LFxyXG4gICAgJGluaXQ6IGZ1bmN0aW9uKCkge1xyXG4gICAgICB0aGlzLl9kcmF3KCk7XHJcbiAgICAgIHZhciBzZWxmID0gdGhpcztcclxuICAgICAgdmFyIGZyb20gPSB0aGlzLl9mcm9tO1xyXG4gICAgICB2YXIgdG8gPSB0aGlzLl90bztcclxuXHJcbiAgICAgIHZhciB1cGRhdGUgPSBmdW5jdGlvbihlKSB7XHJcbiAgICAgICAgLy8gY29uc29sZS5sb2coJ2RyYWdtb3ZlOicsIGUpO1xyXG4gICAgICAgIHNlbGYuX2RyYXcoKTtcclxuICAgICAgICBlLnRhcmdldC5wYXJlbnQuZHJhdygpO1xyXG4gICAgICB9XHJcblxyXG4gICAgICBmcm9tLm9uKCdkcmFnbW92ZScsIHVwZGF0ZSk7XHJcbiAgICAgIHRvLm9uKCdkcmFnbW92ZScsIHVwZGF0ZSk7XHJcbiAgICB9XHJcbiAgfTtcclxuXHJcbiAgS29udmEuVXRpbC5leHRlbmQoRWRnZSwgS29udmEuQXJyb3cpO1xyXG4gIEtvbnZhLkdyYXBocy5FZGdlID0gRWRnZTtcclxuXHJcbn0pKCk7XHJcbiIsIi8vZ3JhcGguanNcclxuXHJcbihmdW5jdGlvbih3LCAkKSB7XHJcblxyXG4gIGZ1bmN0aW9uIEdyYXBoKGVsKSB7XHJcbiAgICB0aGlzLl9lbCA9IGVsO1xyXG4gICAgdGhpcy5zdGFnZSA9IG5ldyBLb252YS5TdGFnZSh7XHJcbiAgICAgIGNvbnRhaW5lcjogZWxcclxuICAgIH0pO1xyXG4gICAgdGhpcy5faW5pdCgpO1xyXG4gICAgdGhpcy5fbm9kZXMgPSBbXTtcclxuICAgIHRoaXMuX3ByZXYgPSBudWxsO1xyXG4gICAgdGhpcy5fZXZlbnRzID0ge307XHJcbiAgfVxyXG5cclxuICBHcmFwaC5wcm90b3R5cGUgPSB7XHJcbiAgICBfaW5pdDogZnVuY3Rpb24oKSB7XHJcbiAgICAgIHZhciAkZWwgPSAkKHRoaXMuX2VsKTtcclxuICAgICAgdmFyIHN0YWdlID0gdGhpcy5zdGFnZTtcclxuICAgICAgdmFyIHMgPSB7fSxcclxuICAgICAgICBjID0ge307XHJcbiAgICAgIHZhciBsb2NhbHMgPSB7XHJcbiAgICAgICAgY291bnRlcjogMCxcclxuICAgICAgfTtcclxuICAgICAgLy8gY29uc29sZS5sb2coJ2luaXQnKTtcclxuICAgICAgdmFyIHNlbGYgPSB0aGlzO1xyXG4gICAgICB2YXIgJHcgPSAkKHdpbmRvdyk7XHJcbiAgICAgIHZhciByZXNpemUgPSBmdW5jdGlvbigpIHtcclxuICAgICAgICAvLyBjb25zb2xlLmxvZygncmVzaXplLi4uJyk7XHJcbiAgICAgICAgcy5oID0gJHcuaGVpZ2h0KCk7XHJcbiAgICAgICAgcy53ID0gJHcud2lkdGgoKTtcclxuICAgICAgICB2YXIgb2Zmc2V0ID0gJGVsLm9mZnNldCgpO1xyXG4gICAgICAgIHZhciBodCA9IHMuaCAtIG9mZnNldC50b3AgLSBvZmZzZXQubGVmdCxcclxuICAgICAgICAgIHdkID0gJGVsLnBhcmVudCgpID8gJGVsLnBhcmVudCgpLndpZHRoKCkgOiBzLnc7XHJcbiAgICAgICAgYy53ID0gd2Q7XHJcbiAgICAgICAgYy5oID0gaHQ7XHJcbiAgICAgICAgLy8gY29uc29sZS5sb2coJ2NvbnRhaW5lcjonLCBjKTtcclxuICAgICAgICBzdGFnZS53aWR0aCh3ZCk7XHJcbiAgICAgICAgc3RhZ2UuaGVpZ2h0KGh0KTtcclxuICAgICAgICBpZiAocmVjdCkge1xyXG4gICAgICAgICAgY29uc29sZS5sb2coJ3JlY3QnLCByZWN0KTtcclxuICAgICAgICAgIHJlY3QuaGVpZ2h0KGh0KTtcclxuICAgICAgICAgIHJlY3Qud2lkdGgod2QpO1xyXG4gICAgICAgIH1cclxuICAgICAgICBzdGFnZS5kcmF3KCk7XHJcbiAgICAgIH07XHJcbiAgICAgIHJlc2l6ZSgpO1xyXG5cclxuICAgICAgJHcuYmluZCgncmVzaXplJywgcmVzaXplKTtcclxuICAgICAgdmFyIGxheWVyID0gbmV3IEtvbnZhLkxheWVyKCk7XHJcbiAgICAgIHZhciByZWN0ID0gbmV3IEtvbnZhLlJlY3Qoe1xyXG4gICAgICAgIGhlaWdodDogYy5oLFxyXG4gICAgICAgIHdpZHRoOiBjLncsXHJcbiAgICAgICAgc3Ryb2tlOiAnYmxhY2snXHJcbiAgICAgIH0pO1xyXG4gICAgICBsYXllci5hZGQocmVjdCk7XHJcbiAgICAgIHN0YWdlLmFkZChsYXllcik7XHJcbiAgICAgIHN0YWdlLm9uKCdjbGljaycsIGZ1bmN0aW9uKGUpIHtcclxuICAgICAgICAvLyBjb25zb2xlLmxvZygnc3RhZ2UgY2xpY2suLi4nLCBlKTtcclxuICAgICAgICBpZiAoZS50YXJnZXQgPT09IHJlY3QpIHtcclxuICAgICAgICAgIGlmIChzZWxmLl9wcmV2KSB7XHJcbiAgICAgICAgICAgIHNlbGYuX3ByZXYuY2xlYXIoKTtcclxuICAgICAgICAgICAgc2VsZi5fcHJldiA9IG51bGw7XHJcbiAgICAgICAgICAgIGxheWVyLmRyYXcoKTtcclxuICAgICAgICAgICAgcmV0dXJuO1xyXG4gICAgICAgICAgfVxyXG4gICAgICAgICAgdmFyIHBvcyA9IHN0YWdlLmdldFBvaW50ZXJQb3NpdGlvbigpO1xyXG4gICAgICAgICAgc2VsZi5hZGQocG9zLCBsb2NhbHMuY291bnRlcisrKTtcclxuICAgICAgICB9XHJcbiAgICAgIH0pO1xyXG5cclxuXHJcbiAgICAgIHRoaXMuX2xheWVyID0gbGF5ZXI7XHJcbiAgICB9LFxyXG4gICAgYWRkOiBmdW5jdGlvbihwb3MsIGl0ZW0pIHtcclxuICAgICAgdmFyIGxheWVyID0gdGhpcy5fbGF5ZXI7XHJcbiAgICAgIHZhciBzZWxmID0gdGhpcztcclxuXHJcbiAgICAgIHZhciB2ZXJ0ZXggPSBuZXcgS29udmEuR3JhcGhzLlZlcnRleCh7XHJcbiAgICAgICAgeDogcG9zLngsXHJcbiAgICAgICAgeTogcG9zLnksXHJcbiAgICAgICAgdGV4dDogaXRlbS50b1N0cmluZygpLFxyXG4gICAgICAgIHRhZzogaXRlbVxyXG4gICAgICB9KTtcclxuICAgICAgbGF5ZXIuYWRkKHZlcnRleCk7XHJcbiAgICAgIHZlcnRleC5vbignY2xpY2snLCBmdW5jdGlvbihlKSB7XHJcbiAgICAgICAgLy8gY29uc29sZS5sb2coJ3ZlcnRleCBjbGljaycsIGUpO1xyXG4gICAgICAgIGlmIChlLnRhcmdldC5wYXJlbnQgPT09IHZlcnRleCkge1xyXG4gICAgICAgICAgaWYgKHNlbGYuX3ByZXYpIHtcclxuICAgICAgICAgICAgc2VsZi5hZGRFZGdlKHNlbGYuX3ByZXYsIHZlcnRleCk7XHJcbiAgICAgICAgICAgIHNlbGYuX3ByZXYuY2xlYXIoKTtcclxuICAgICAgICAgICAgc2VsZi5fcHJldiA9IG51bGw7XHJcbiAgICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgICBzZWxmLl9wcmV2ID0gdmVydGV4O1xyXG4gICAgICAgICAgICB2ZXJ0ZXguaGlnaGxpZ2h0KCk7XHJcbiAgICAgICAgICB9XHJcbiAgICAgICAgICBsYXllci5kcmF3KCk7XHJcbiAgICAgICAgfVxyXG4gICAgICB9KTtcclxuXHJcbiAgICAgIGxheWVyLmRyYXcoKTtcclxuICAgICAgc2VsZi5fZmlyZSgnYWRkJywgeyB0eXBlOiAndmVydGV4JywgZGF0YTogdmVydGV4IH0pO1xyXG4gICAgfSxcclxuICAgIGFkZEVkZ2U6IGZ1bmN0aW9uKHYxLCB2Mikge1xyXG4gICAgICB2YXIgc2VsZiA9IHRoaXM7XHJcbiAgICAgIHZhciBlZGdlID0gbmV3IEtvbnZhLkdyYXBocy5FZGdlKHYxLCB2Mik7XHJcbiAgICAgIHZhciBsYXllciA9IHRoaXMuX2xheWVyO1xyXG4gICAgICBsYXllci5hZGQoZWRnZSk7XHJcbiAgICAgIGxheWVyLmRyYXcoKTtcclxuICAgICAgc2VsZi5fZmlyZSgnYWRkJywgeyB0eXBlOiAnZWRnZScsIGRhdGE6IGVkZ2UgfSk7XHJcbiAgICB9LFxyXG4gICAgX2ZpcmU6IGZ1bmN0aW9uKGV2ZW50S2V5KSB7XHJcbiAgICAgIHZhciBldmVudHMgPSB0aGlzLl9ldmVudHM7XHJcbiAgICAgIHZhciBhcmdzID0gW10uc2xpY2UuY2FsbChhcmd1bWVudHMpO1xyXG4gICAgICBhcmdzLnNoaWZ0KCk7XHJcbiAgICAgIHZhciBmbiA9IGV2ZW50c1tldmVudEtleV07XHJcbiAgICAgIGlmIChmbikge1xyXG4gICAgICAgIGZuLmFwcGx5KHRoaXMsIGFyZ3MpO1xyXG4gICAgICB9XHJcbiAgICB9LFxyXG4gICAgb246IGZ1bmN0aW9uKGtleSwgZm4pIHtcclxuICAgICAgdGhpcy5fZXZlbnRzW2tleV0gPSBmbjtcclxuICAgIH1cclxuICB9O1xyXG4gIEtvbnZhLkdyYXBocyA9IEtvbnZhLkdyYXBocyB8fCB7fTtcclxuICBLb252YS5HcmFwaHMuR3JhcGggPSBHcmFwaDtcclxufSkod2luZG93LCB3aW5kb3cualF1ZXJ5KTtcclxuIiwiLy8gc3RhcnQuanNcclxuXHJcbihmdW5jdGlvbih3aW5kb3csIGRvY3VtZW50KSB7XHJcbiAgdmFyIG9uTG9hZCA9IGZ1bmN0aW9uKCkge1xyXG4gICAgLy8gY29uc29sZS5sb2coJ2xvYWQuLi4nKTtcclxuICAgIHZhciBlbCA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKCdjb250YWluZXInKTtcclxuICAgIHZhciBncmFwaCA9IG5ldyBLb252YS5HcmFwaHMuR3JhcGgoZWwpO1xyXG4gICAgdmFyIHZtID0gbmV3IFZpZXdNb2RlbCgpO1xyXG4gICAgZ3JhcGgub24oJ2FkZCcsIGZ1bmN0aW9uKGUpe1xyXG5cclxuICAgICAgaWYgKGUudHlwZSA9PT0gJ3ZlcnRleCcpIHtcclxuICAgICAgICB2bS5hZGRWZXJ0ZXgoZS5kYXRhLmdldEF0dHIoJ3RhZycpKTtcclxuICAgICAgfVxyXG4gICAgICBlbHNlIGlmIChlLnR5cGUgPT09ICdlZGdlJykge1xyXG4gICAgICAgIHZhciBmcm9tID0gZS5kYXRhLl9mcm9tLCB0byA9IGUuZGF0YS5fdG87XHJcbiAgICAgICAgdmFyIHN0YXJ0ID0gZnJvbS5nZXRBdHRyKCd0YWcnKSwgZW5kID0gdG8uZ2V0QXR0cigndGFnJyk7XHJcbiAgICAgICAgdm0uYWRkRWRnZShzdGFydCwgZW5kKTtcclxuICAgICAgfVxyXG4gICAgfSk7XHJcbiAgICBrby5hcHBseUJpbmRpbmdzKHZtKTtcclxuICB9O1xyXG5cclxuICAkKHdpbmRvdykuYmluZCgnbG9hZCcsIG9uTG9hZCk7XHJcbn0pKHdpbmRvdywgd2luZG93LmRvY3VtZW50KTtcclxuIiwiLy92ZXJ0ZXguanNcclxuXHJcbihmdW5jdGlvbigkKSB7XHJcbiAgdmFyIGV4dGVuZCA9ICQuZXh0ZW5kO1xyXG4gIEtvbnZhLkdyYXBocyA9IEtvbnZhLkdyYXBocyB8fCB7fTtcclxuXHJcbiAgZnVuY3Rpb24gVmVydGV4KGNvbmZpZykge1xyXG4gICAgdmFyIGdyb3VwQ29uZmlnID0ge1xyXG4gICAgICBkcmFnZ2FibGU6IHRydWVcclxuICAgIH07XHJcbiAgICBncm91cENvbmZpZyA9IGV4dGVuZChncm91cENvbmZpZywgY29uZmlnKTtcclxuICAgIEtvbnZhLkdyb3VwLmNhbGwodGhpcywgZ3JvdXBDb25maWcpO1xyXG4gICAgdGhpcy4kaW5pdChjb25maWcpO1xyXG4gICAgdGhpcy5jaGlsZHMgPSBbXTtcclxuICB9XHJcblxyXG4gIFZlcnRleC5wcm90b3R5cGUgPSB7XHJcbiAgICAkaW5pdDogZnVuY3Rpb24oY29uZmlnKSB7XHJcbiAgICAgIHZhciBjaXJjbGUgPSBuZXcgS29udmEuQ2lyY2xlKHtcclxuICAgICAgICByYWRpdXM6IDIwLFxyXG4gICAgICAgIGZpbGw6ICdsaWdodGdyZWVuJ1xyXG4gICAgICB9KTtcclxuXHJcbiAgICAgIHZhciB0ZXh0ID0gbmV3IEtvbnZhLlRleHQoe1xyXG4gICAgICAgIHRleHQ6IGNvbmZpZy50ZXh0LFxyXG4gICAgICAgIGZvbnRTaXplOiAxMixcclxuICAgICAgICBmaWxsOiAnYmxhY2snXHJcbiAgICAgIH0pO1xyXG5cclxuICAgICAgdmFyIHRleHREaW0gPSB0ZXh0LmdldENsaWVudFJlY3QoKTtcclxuXHJcbiAgICAgIHRleHQub2Zmc2V0KHtcclxuICAgICAgICB4OiB0ZXh0RGltLndpZHRoIC8gMixcclxuICAgICAgICB5OiB0ZXh0RGltLmhlaWdodCAvIDJcclxuICAgICAgfSk7XHJcblxyXG4gICAgICB0aGlzLmFkZChjaXJjbGUpO1xyXG4gICAgICB0aGlzLmFkZCh0ZXh0KTtcclxuICAgICAgdGhpcy5fY2lyY2xlID0gY2lyY2xlO1xyXG4gICAgfSxcclxuICAgIGhpZ2hsaWdodDogZnVuY3Rpb24oKSB7XHJcbiAgICAgIHRoaXMuX2NpcmNsZS5zdHJva2UoJ2JsYWNrJyk7XHJcbiAgICB9LFxyXG4gICAgY2xlYXI6IGZ1bmN0aW9uKCkge1xyXG4gICAgICB0aGlzLl9jaXJjbGUuc3Ryb2tlKG51bGwpO1xyXG4gICAgfVxyXG4gIH07XHJcblxyXG4gIEtvbnZhLlV0aWwuZXh0ZW5kKFZlcnRleCwgS29udmEuR3JvdXApO1xyXG5cclxuICBLb252YS5HcmFwaHMuVmVydGV4ID0gVmVydGV4O1xyXG5cclxufSkod2luZG93LmpRdWVyeSk7XHJcbiIsIihmdW5jdGlvbih3aW5kb3cpe1xyXG5cclxuICBmdW5jdGlvbiBWaWV3TW9kZWwoKSB7XHJcbiAgICB2YXIgc2VsZiA9IHRoaXM7XHJcblxyXG4gICAgdmFyIGdyYXBoID0ga28ub2JzZXJ2YWJsZSh7XHJcbiAgICAgIHY6a28ub2JzZXJ2YWJsZUFycmF5KCksXHJcbiAgICAgIGU6a28ub2JzZXJ2YWJsZUFycmF5KClcclxuICAgIH0pO1xyXG5cclxuICAgIHNlbGYuaXNEcmF3aW5nTW9kZSA9IGtvLm9ic2VydmFibGUodHJ1ZSk7XHJcblxyXG4gICAgc2VsZi5zaG93ID0gZnVuY3Rpb24obW9kZSkge1xyXG4gICAgICAvLyBjb25zb2xlLmxvZygnbW9kZTonLCBtb2RlKTtcclxuICAgICAgc2VsZi5pc0RyYXdpbmdNb2RlKG1vZGUgPT09ICdjYW52YXMnKTtcclxuICAgIH07XHJcbiAgICBzZWxmLmpzb24gPSBrby5jb21wdXRlZChmdW5jdGlvbigpe1xyXG4gICAgICByZXR1cm4ga28udG9KU09OKGdyYXBoKTtcclxuICAgIH0pO1xyXG4gICAgc2VsZi5hZGRWZXJ0ZXggPSBmdW5jdGlvbih2KSB7XHJcbiAgICAgIC8vIGNvbnNvbGUubG9nKCdhZGRWZXJ0ZXgnKTtcclxuICAgICAgZ3JhcGgoKS52LnB1c2godik7XHJcbiAgICB9O1xyXG4gICAgc2VsZi5hZGRFZGdlID0gZnVuY3Rpb24oc3RhcnQsIGVuZCkge1xyXG4gICAgICAvLyBjb25zb2xlLmxvZygnYWRkRWRnZScpO1xyXG4gICAgICBncmFwaCgpLmUucHVzaChbc3RhcnQsIGVuZF0pO1xyXG4gICAgfVxyXG4gIH07XHJcblxyXG4gIHdpbmRvdy5WaWV3TW9kZWwgPSBWaWV3TW9kZWw7XHJcblxyXG59KSh0aGlzKTtcclxuIl19
