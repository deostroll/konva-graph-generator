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

// start.js

(function(window, document) {
  var onLoad = function() {
    // console.log('load...');
    var el = document.getElementById('container');
    var graph = new Konva.Graphs.Graph(el);

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
    groupConfig = extend(groupConfig, {
      x: config.x,
      y: config.y
    });
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

//# sourceMappingURL=data:application/json;charset=utf8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImVkZ2UuanMiLCJncmFwaC5qcyIsInN0YXJ0LmpzIiwidmVydGV4LmpzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FDL0RBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FDL0dBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FDWkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBIiwiZmlsZSI6Im1haW4uanMiLCJzb3VyY2VzQ29udGVudCI6WyIvL2VkZ2UuanNcclxuKGZ1bmN0aW9uKCkge1xyXG4gIEtvbnZhLkdyYXBocyA9IEtvbnZhLkdyYXBocyB8fCB7fTtcclxuXHJcbiAgZnVuY3Rpb24gRWRnZSh2MSwgdjIpIHtcclxuICAgIHRoaXMuX2Zyb20gPSB2MSxcclxuICAgICAgdGhpcy5fdG8gPSB2MlxyXG4gICAgS29udmEuQXJyb3cuY2FsbCh0aGlzLCB7XHJcbiAgICAgIGZpbGw6ICdibGFjaycsXHJcbiAgICAgIHBvaW50ZXJXaWR0aDogNSxcclxuICAgICAgcG9pbnRlckxlbmd0aDogNSxcclxuICAgICAgc3Ryb2tlV2lkdGg6IDIsXHJcbiAgICAgIHN0cm9rZTogJ2JsYWNrJ1xyXG4gICAgfSk7XHJcbiAgICB0aGlzLiRpbml0KCk7XHJcbiAgfVxyXG5cclxuICBFZGdlLnByb3RvdHlwZSA9IHtcclxuICAgIF9kcmF3OiBmdW5jdGlvbigpIHtcclxuICAgICAgdmFyIGZyb20gPSB0aGlzLl9mcm9tO1xyXG4gICAgICB2YXIgdG8gPSB0aGlzLl90bztcclxuXHJcbiAgICAgIHZhciBsaW5lID0ge1xyXG4gICAgICAgIHN0YXJ0OiBmcm9tLmdldFBvc2l0aW9uKCksXHJcbiAgICAgICAgZW5kOiB0by5nZXRQb3NpdGlvbigpXHJcbiAgICAgIH07XHJcblxyXG4gICAgICB2YXIgZCA9IHtcclxuICAgICAgICB4OiBsaW5lLmVuZC54IC0gbGluZS5zdGFydC54LFxyXG4gICAgICAgIHk6IGxpbmUuZW5kLnkgLSBsaW5lLnN0YXJ0LnlcclxuICAgICAgfTtcclxuICAgICAgdmFyIHIgPSAyMDtcclxuICAgICAgdmFyIGFuZ2xlID0gTWF0aC5hdGFuMihkLnksIGQueCk7XHJcbiAgICAgIHZhciBvZmZzZXQgPSB7XHJcbiAgICAgICAgeDogciAqIE1hdGguY29zKGFuZ2xlKSxcclxuICAgICAgICB5OiByICogTWF0aC5zaW4oYW5nbGUpXHJcbiAgICAgIH07XHJcblxyXG4gICAgICB0aGlzLngoIGZyb20ueCgpICsgb2Zmc2V0LnggKTtcclxuICAgICAgdGhpcy55KCBmcm9tLnkoKSArIG9mZnNldC55ICk7XHJcbiAgICAgIHRoaXMucG9pbnRzKFswLDAsIGQueCAtIDIgKiBvZmZzZXQueCwgZC55IC0gMiAqIG9mZnNldC55XSlcclxuICAgIH0sXHJcbiAgICAkaW5pdDogZnVuY3Rpb24oKSB7XHJcbiAgICAgIHRoaXMuX2RyYXcoKTtcclxuICAgICAgdmFyIHNlbGYgPSB0aGlzO1xyXG4gICAgICB2YXIgZnJvbSA9IHRoaXMuX2Zyb207XHJcbiAgICAgIHZhciB0byA9IHRoaXMuX3RvO1xyXG5cclxuICAgICAgdmFyIHVwZGF0ZSA9IGZ1bmN0aW9uKGUpIHtcclxuICAgICAgICAvLyBjb25zb2xlLmxvZygnZHJhZ21vdmU6JywgZSk7XHJcbiAgICAgICAgc2VsZi5fZHJhdygpO1xyXG4gICAgICAgIGUudGFyZ2V0LnBhcmVudC5kcmF3KCk7XHJcbiAgICAgIH1cclxuXHJcbiAgICAgIGZyb20ub24oJ2RyYWdtb3ZlJywgdXBkYXRlKTtcclxuICAgICAgdG8ub24oJ2RyYWdtb3ZlJywgdXBkYXRlKTtcclxuICAgIH1cclxuICB9O1xyXG5cclxuICBLb252YS5VdGlsLmV4dGVuZChFZGdlLCBLb252YS5BcnJvdyk7XHJcbiAgS29udmEuR3JhcGhzLkVkZ2UgPSBFZGdlO1xyXG5cclxufSkoKTtcclxuIiwiLy9ncmFwaC5qc1xyXG5cclxuKGZ1bmN0aW9uKHcsICQpIHtcclxuXHJcbiAgZnVuY3Rpb24gR3JhcGgoZWwpIHtcclxuICAgIHRoaXMuX2VsID0gZWw7XHJcbiAgICB0aGlzLnN0YWdlID0gbmV3IEtvbnZhLlN0YWdlKHtcclxuICAgICAgY29udGFpbmVyOiBlbFxyXG4gICAgfSk7XHJcbiAgICB0aGlzLl9pbml0KCk7XHJcbiAgICB0aGlzLl9ub2RlcyA9IFtdO1xyXG4gICAgdGhpcy5fcHJldiA9IG51bGw7XHJcbiAgfVxyXG5cclxuICBHcmFwaC5wcm90b3R5cGUgPSB7XHJcbiAgICBfaW5pdDogZnVuY3Rpb24oKSB7XHJcbiAgICAgIHZhciAkZWwgPSAkKHRoaXMuX2VsKTtcclxuICAgICAgdmFyIHN0YWdlID0gdGhpcy5zdGFnZTtcclxuICAgICAgdmFyIHMgPSB7fSxcclxuICAgICAgICBjID0ge307XHJcbiAgICAgIHZhciBsb2NhbHMgPSB7XHJcbiAgICAgICAgY291bnRlcjogMCxcclxuICAgICAgfTtcclxuICAgICAgLy8gY29uc29sZS5sb2coJ2luaXQnKTtcclxuICAgICAgdmFyIHNlbGYgPSB0aGlzO1xyXG4gICAgICB2YXIgJHcgPSAkKHdpbmRvdyk7XHJcbiAgICAgIHZhciByZXNpemUgPSBmdW5jdGlvbigpIHtcclxuICAgICAgICAvLyBjb25zb2xlLmxvZygncmVzaXplLi4uJyk7XHJcbiAgICAgICAgcy5oID0gJHcuaGVpZ2h0KCk7XHJcbiAgICAgICAgcy53ID0gJHcud2lkdGgoKTtcclxuICAgICAgICB2YXIgb2Zmc2V0ID0gJGVsLm9mZnNldCgpO1xyXG4gICAgICAgIHZhciBodCA9IHMuaCAtIG9mZnNldC50b3AgLSBvZmZzZXQubGVmdCxcclxuICAgICAgICAgIHdkID0gJGVsLnBhcmVudCgpID8gJGVsLnBhcmVudCgpLndpZHRoKCkgOiBzLnc7XHJcbiAgICAgICAgYy53ID0gd2Q7XHJcbiAgICAgICAgYy5oID0gaHQ7XHJcbiAgICAgICAgLy8gY29uc29sZS5sb2coJ2NvbnRhaW5lcjonLCBjKTtcclxuICAgICAgICBzdGFnZS53aWR0aCh3ZCk7XHJcbiAgICAgICAgc3RhZ2UuaGVpZ2h0KGh0KTtcclxuICAgICAgICBpZiAocmVjdCkge1xyXG4gICAgICAgICAgY29uc29sZS5sb2coJ3JlY3QnLCByZWN0KTtcclxuICAgICAgICAgIHJlY3QuaGVpZ2h0KGh0KTtcclxuICAgICAgICAgIHJlY3Qud2lkdGgod2QpO1xyXG4gICAgICAgIH1cclxuICAgICAgICBzdGFnZS5kcmF3KCk7XHJcbiAgICAgIH07XHJcbiAgICAgIHJlc2l6ZSgpO1xyXG5cclxuICAgICAgJHcuYmluZCgncmVzaXplJywgcmVzaXplKTtcclxuICAgICAgdmFyIGxheWVyID0gbmV3IEtvbnZhLkxheWVyKCk7XHJcbiAgICAgIHZhciByZWN0ID0gbmV3IEtvbnZhLlJlY3Qoe1xyXG4gICAgICAgIGhlaWdodDogYy5oLFxyXG4gICAgICAgIHdpZHRoOiBjLncsXHJcbiAgICAgICAgc3Ryb2tlOiAnYmxhY2snXHJcbiAgICAgIH0pO1xyXG4gICAgICBsYXllci5hZGQocmVjdCk7XHJcbiAgICAgIHN0YWdlLmFkZChsYXllcik7XHJcbiAgICAgIHN0YWdlLm9uKCdjbGljaycsIGZ1bmN0aW9uKGUpIHtcclxuICAgICAgICAvLyBjb25zb2xlLmxvZygnc3RhZ2UgY2xpY2suLi4nLCBlKTtcclxuICAgICAgICBpZiAoZS50YXJnZXQgPT09IHJlY3QpIHtcclxuICAgICAgICAgIGlmIChzZWxmLl9wcmV2KSB7XHJcbiAgICAgICAgICAgIHNlbGYuX3ByZXYuY2xlYXIoKTtcclxuICAgICAgICAgICAgc2VsZi5fcHJldiA9IG51bGw7XHJcbiAgICAgICAgICAgIGxheWVyLmRyYXcoKTtcclxuICAgICAgICAgICAgcmV0dXJuO1xyXG4gICAgICAgICAgfVxyXG4gICAgICAgICAgdmFyIHBvcyA9IHN0YWdlLmdldFBvaW50ZXJQb3NpdGlvbigpO1xyXG4gICAgICAgICAgc2VsZi5hZGQocG9zLCBsb2NhbHMuY291bnRlcisrKTtcclxuICAgICAgICB9XHJcbiAgICAgIH0pO1xyXG5cclxuXHJcbiAgICAgIHRoaXMuX2xheWVyID0gbGF5ZXI7XHJcbiAgICB9LFxyXG4gICAgYWRkOiBmdW5jdGlvbihwb3MsIGl0ZW0pIHtcclxuICAgICAgdmFyIGxheWVyID0gdGhpcy5fbGF5ZXI7XHJcbiAgICAgIHZhciBzZWxmID0gdGhpcztcclxuXHJcbiAgICAgIHZhciB2ZXJ0ZXggPSBuZXcgS29udmEuR3JhcGhzLlZlcnRleCh7XHJcbiAgICAgICAgeDogcG9zLngsXHJcbiAgICAgICAgeTogcG9zLnksXHJcbiAgICAgICAgdGV4dDogaXRlbS50b1N0cmluZygpLFxyXG4gICAgICAgIHRhZzogaXRlbVxyXG4gICAgICB9KTtcclxuICAgICAgbGF5ZXIuYWRkKHZlcnRleCk7XHJcbiAgICAgIHZlcnRleC5vbignY2xpY2snLCBmdW5jdGlvbihlKSB7XHJcbiAgICAgICAgLy8gY29uc29sZS5sb2coJ3ZlcnRleCBjbGljaycsIGUpO1xyXG4gICAgICAgIGlmIChlLnRhcmdldC5wYXJlbnQgPT09IHZlcnRleCkge1xyXG4gICAgICAgICAgaWYgKHNlbGYuX3ByZXYpIHtcclxuICAgICAgICAgICAgc2VsZi5hZGRFZGdlKHNlbGYuX3ByZXYsIHZlcnRleCk7XHJcbiAgICAgICAgICAgIHNlbGYuX3ByZXYuY2xlYXIoKTtcclxuICAgICAgICAgICAgc2VsZi5fcHJldiA9IG51bGw7XHJcbiAgICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgICBzZWxmLl9wcmV2ID0gdmVydGV4O1xyXG4gICAgICAgICAgICB2ZXJ0ZXguaGlnaGxpZ2h0KCk7XHJcbiAgICAgICAgICB9XHJcbiAgICAgICAgICBsYXllci5kcmF3KCk7XHJcbiAgICAgICAgfVxyXG4gICAgICB9KTtcclxuXHJcbiAgICAgIGxheWVyLmRyYXcoKTtcclxuICAgIH0sXHJcbiAgICBhZGRFZGdlOiBmdW5jdGlvbih2MSwgdjIpIHtcclxuICAgICAgdmFyIGVkZ2UgPSBuZXcgS29udmEuR3JhcGhzLkVkZ2UodjEsIHYyKTtcclxuICAgICAgdmFyIGxheWVyID0gdGhpcy5fbGF5ZXI7XHJcbiAgICAgIGxheWVyLmFkZChlZGdlKTtcclxuICAgICAgbGF5ZXIuZHJhdygpO1xyXG4gICAgfVxyXG4gIH07XHJcbiAgS29udmEuR3JhcGhzID0gS29udmEuR3JhcGhzIHx8IHt9O1xyXG4gIEtvbnZhLkdyYXBocy5HcmFwaCA9IEdyYXBoO1xyXG59KSh3aW5kb3csIHdpbmRvdy5qUXVlcnkpO1xyXG4iLCIvLyBzdGFydC5qc1xyXG5cclxuKGZ1bmN0aW9uKHdpbmRvdywgZG9jdW1lbnQpIHtcclxuICB2YXIgb25Mb2FkID0gZnVuY3Rpb24oKSB7XHJcbiAgICAvLyBjb25zb2xlLmxvZygnbG9hZC4uLicpO1xyXG4gICAgdmFyIGVsID0gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoJ2NvbnRhaW5lcicpO1xyXG4gICAgdmFyIGdyYXBoID0gbmV3IEtvbnZhLkdyYXBocy5HcmFwaChlbCk7XHJcblxyXG4gIH07XHJcblxyXG4gICQod2luZG93KS5iaW5kKCdsb2FkJywgb25Mb2FkKTtcclxufSkod2luZG93LCB3aW5kb3cuZG9jdW1lbnQpO1xyXG4iLCIvL3ZlcnRleC5qc1xyXG5cclxuKGZ1bmN0aW9uKCQpIHtcclxuICB2YXIgZXh0ZW5kID0gJC5leHRlbmQ7XHJcbiAgS29udmEuR3JhcGhzID0gS29udmEuR3JhcGhzIHx8IHt9O1xyXG5cclxuICBmdW5jdGlvbiBWZXJ0ZXgoY29uZmlnKSB7XHJcbiAgICB2YXIgZ3JvdXBDb25maWcgPSB7XHJcbiAgICAgIGRyYWdnYWJsZTogdHJ1ZVxyXG4gICAgfTtcclxuICAgIGdyb3VwQ29uZmlnID0gZXh0ZW5kKGdyb3VwQ29uZmlnLCB7XHJcbiAgICAgIHg6IGNvbmZpZy54LFxyXG4gICAgICB5OiBjb25maWcueVxyXG4gICAgfSk7XHJcbiAgICBLb252YS5Hcm91cC5jYWxsKHRoaXMsIGdyb3VwQ29uZmlnKTtcclxuICAgIHRoaXMuJGluaXQoY29uZmlnKTtcclxuICAgIHRoaXMuY2hpbGRzID0gW107XHJcbiAgfVxyXG5cclxuICBWZXJ0ZXgucHJvdG90eXBlID0ge1xyXG4gICAgJGluaXQ6IGZ1bmN0aW9uKGNvbmZpZykge1xyXG4gICAgICB2YXIgY2lyY2xlID0gbmV3IEtvbnZhLkNpcmNsZSh7XHJcbiAgICAgICAgcmFkaXVzOiAyMCxcclxuICAgICAgICBmaWxsOiAnbGlnaHRncmVlbidcclxuICAgICAgfSk7XHJcblxyXG4gICAgICB2YXIgdGV4dCA9IG5ldyBLb252YS5UZXh0KHtcclxuICAgICAgICB0ZXh0OiBjb25maWcudGV4dCxcclxuICAgICAgICBmb250U2l6ZTogMTIsXHJcbiAgICAgICAgZmlsbDogJ2JsYWNrJ1xyXG4gICAgICB9KTtcclxuXHJcbiAgICAgIHZhciB0ZXh0RGltID0gdGV4dC5nZXRDbGllbnRSZWN0KCk7XHJcblxyXG4gICAgICB0ZXh0Lm9mZnNldCh7XHJcbiAgICAgICAgeDogdGV4dERpbS53aWR0aCAvIDIsXHJcbiAgICAgICAgeTogdGV4dERpbS5oZWlnaHQgLyAyXHJcbiAgICAgIH0pO1xyXG5cclxuICAgICAgdGhpcy5hZGQoY2lyY2xlKTtcclxuICAgICAgdGhpcy5hZGQodGV4dCk7XHJcbiAgICAgIHRoaXMuX2NpcmNsZSA9IGNpcmNsZTtcclxuICAgIH0sXHJcbiAgICBoaWdobGlnaHQ6IGZ1bmN0aW9uKCkge1xyXG4gICAgICB0aGlzLl9jaXJjbGUuc3Ryb2tlKCdibGFjaycpO1xyXG4gICAgfSxcclxuICAgIGNsZWFyOiBmdW5jdGlvbigpIHtcclxuICAgICAgdGhpcy5fY2lyY2xlLnN0cm9rZShudWxsKTtcclxuICAgIH1cclxuICB9O1xyXG5cclxuICBLb252YS5VdGlsLmV4dGVuZChWZXJ0ZXgsIEtvbnZhLkdyb3VwKTtcclxuXHJcbiAgS29udmEuR3JhcGhzLlZlcnRleCA9IFZlcnRleDtcclxuXHJcbn0pKHdpbmRvdy5qUXVlcnkpO1xyXG4iXX0=
