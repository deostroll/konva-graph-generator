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
      strokeWidth: 2
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
      this.x(from.x() + r * Math.cos(angle));
      this.y(from.y() + r * Math.sin(angle));
    },
    $init: function() {
      this._draw();
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
      console.log('init');
      var self = this;
      var $w = $(window);
      var resize = function() {
        s.h = $w.height();
        s.w = $w.width();
        var offset = $el.offset();
        var ht = s.h - offset.top,
          wd = $el.parent() ? $el.parent().width() : s.w;
        c.w = wd;
        c.h = ht;
        stage.width(wd);
        stage.height(ht);
      };
      resize();

      $(w).bind('resize', resize);
      var layer = new Konva.Layer();
      var rect = new Konva.Rect({
        height: c.h,
        width: c.w,
      });
      layer.add(rect);
      stage.add(layer);
      stage.on('click', function(e) {
        console.log('clicked...', e);
        if (e.target === rect) {
          if (self._prev) {
            self._prev.clear();
            self._prev = null;
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
        if (e.target.parent === vertex) {
          if (self._prev) {
            self.addEdge(self._prev, vertex);
            self._prev.clear();
            self._prev = null;
          } else {
            self._prev = vertex;
            vertex.highlight();
          }
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
    console.log('load...');
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

//# sourceMappingURL=data:application/json;charset=utf8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImVkZ2UuanMiLCJncmFwaC5qcyIsInN0YXJ0LmpzIiwidmVydGV4LmpzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQzVDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQ25HQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQ1pBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSIsImZpbGUiOiJtYWluLmpzIiwic291cmNlc0NvbnRlbnQiOlsiLy9lZGdlLmpzXG4oZnVuY3Rpb24oKSB7XG4gIEtvbnZhLkdyYXBocyA9IEtvbnZhLkdyYXBocyB8fCB7fTtcblxuICBmdW5jdGlvbiBFZGdlKHYxLCB2Mikge1xuICAgIHRoaXMuX2Zyb20gPSB2MSxcbiAgICAgIHRoaXMuX3RvID0gdjJcbiAgICBLb252YS5BcnJvdy5jYWxsKHRoaXMsIHtcbiAgICAgIGZpbGw6ICdibGFjaycsXG4gICAgICBwb2ludGVyV2lkdGg6IDUsXG4gICAgICBwb2ludGVyTGVuZ3RoOiA1LFxuICAgICAgc3Ryb2tlV2lkdGg6IDJcbiAgICB9KTtcbiAgICB0aGlzLiRpbml0KCk7XG4gIH1cblxuICBFZGdlLnByb3RvdHlwZSA9IHtcbiAgICBfZHJhdzogZnVuY3Rpb24oKSB7XG4gICAgICB2YXIgZnJvbSA9IHRoaXMuX2Zyb207XG4gICAgICB2YXIgdG8gPSB0aGlzLl90bztcblxuICAgICAgdmFyIGxpbmUgPSB7XG4gICAgICAgIHN0YXJ0OiBmcm9tLmdldFBvc2l0aW9uKCksXG4gICAgICAgIGVuZDogdG8uZ2V0UG9zaXRpb24oKVxuICAgICAgfTtcblxuICAgICAgdmFyIGQgPSB7XG4gICAgICAgIHg6IGxpbmUuZW5kLnggLSBsaW5lLnN0YXJ0LngsXG4gICAgICAgIHk6IGxpbmUuZW5kLnkgLSBsaW5lLnN0YXJ0LnlcbiAgICAgIH07XG4gICAgICB2YXIgciA9IDIwO1xuICAgICAgdmFyIGFuZ2xlID0gTWF0aC5hdGFuMihkLnksIGQueCk7XG4gICAgICB0aGlzLngoZnJvbS54KCkgKyByICogTWF0aC5jb3MoYW5nbGUpKTtcbiAgICAgIHRoaXMueShmcm9tLnkoKSArIHIgKiBNYXRoLnNpbihhbmdsZSkpO1xuICAgIH0sXG4gICAgJGluaXQ6IGZ1bmN0aW9uKCkge1xuICAgICAgdGhpcy5fZHJhdygpO1xuICAgIH1cbiAgfTtcblxuICBLb252YS5VdGlsLmV4dGVuZChFZGdlLCBLb252YS5BcnJvdyk7XG4gIEtvbnZhLkdyYXBocy5FZGdlID0gRWRnZTtcblxufSkoKTtcbiIsIi8vZ3JhcGguanNcblxuKGZ1bmN0aW9uKHcsICQpIHtcblxuICBmdW5jdGlvbiBHcmFwaChlbCkge1xuICAgIHRoaXMuX2VsID0gZWw7XG4gICAgdGhpcy5zdGFnZSA9IG5ldyBLb252YS5TdGFnZSh7XG4gICAgICBjb250YWluZXI6IGVsXG4gICAgfSk7XG4gICAgdGhpcy5faW5pdCgpO1xuICAgIHRoaXMuX25vZGVzID0gW107XG4gICAgdGhpcy5fcHJldiA9IG51bGw7XG4gIH1cblxuICBHcmFwaC5wcm90b3R5cGUgPSB7XG4gICAgX2luaXQ6IGZ1bmN0aW9uKCkge1xuICAgICAgdmFyICRlbCA9ICQodGhpcy5fZWwpO1xuICAgICAgdmFyIHN0YWdlID0gdGhpcy5zdGFnZTtcbiAgICAgIHZhciBzID0ge30sXG4gICAgICAgIGMgPSB7fTtcbiAgICAgIHZhciBsb2NhbHMgPSB7XG4gICAgICAgIGNvdW50ZXI6IDAsXG4gICAgICB9O1xuICAgICAgY29uc29sZS5sb2coJ2luaXQnKTtcbiAgICAgIHZhciBzZWxmID0gdGhpcztcbiAgICAgIHZhciAkdyA9ICQod2luZG93KTtcbiAgICAgIHZhciByZXNpemUgPSBmdW5jdGlvbigpIHtcbiAgICAgICAgcy5oID0gJHcuaGVpZ2h0KCk7XG4gICAgICAgIHMudyA9ICR3LndpZHRoKCk7XG4gICAgICAgIHZhciBvZmZzZXQgPSAkZWwub2Zmc2V0KCk7XG4gICAgICAgIHZhciBodCA9IHMuaCAtIG9mZnNldC50b3AsXG4gICAgICAgICAgd2QgPSAkZWwucGFyZW50KCkgPyAkZWwucGFyZW50KCkud2lkdGgoKSA6IHMudztcbiAgICAgICAgYy53ID0gd2Q7XG4gICAgICAgIGMuaCA9IGh0O1xuICAgICAgICBzdGFnZS53aWR0aCh3ZCk7XG4gICAgICAgIHN0YWdlLmhlaWdodChodCk7XG4gICAgICB9O1xuICAgICAgcmVzaXplKCk7XG5cbiAgICAgICQodykuYmluZCgncmVzaXplJywgcmVzaXplKTtcbiAgICAgIHZhciBsYXllciA9IG5ldyBLb252YS5MYXllcigpO1xuICAgICAgdmFyIHJlY3QgPSBuZXcgS29udmEuUmVjdCh7XG4gICAgICAgIGhlaWdodDogYy5oLFxuICAgICAgICB3aWR0aDogYy53LFxuICAgICAgfSk7XG4gICAgICBsYXllci5hZGQocmVjdCk7XG4gICAgICBzdGFnZS5hZGQobGF5ZXIpO1xuICAgICAgc3RhZ2Uub24oJ2NsaWNrJywgZnVuY3Rpb24oZSkge1xuICAgICAgICBjb25zb2xlLmxvZygnY2xpY2tlZC4uLicsIGUpO1xuICAgICAgICBpZiAoZS50YXJnZXQgPT09IHJlY3QpIHtcbiAgICAgICAgICBpZiAoc2VsZi5fcHJldikge1xuICAgICAgICAgICAgc2VsZi5fcHJldi5jbGVhcigpO1xuICAgICAgICAgICAgc2VsZi5fcHJldiA9IG51bGw7XG4gICAgICAgICAgICByZXR1cm47XG4gICAgICAgICAgfVxuICAgICAgICAgIHZhciBwb3MgPSBzdGFnZS5nZXRQb2ludGVyUG9zaXRpb24oKTtcbiAgICAgICAgICBzZWxmLmFkZChwb3MsIGxvY2Fscy5jb3VudGVyKyspO1xuICAgICAgICB9XG4gICAgICB9KTtcblxuXG4gICAgICB0aGlzLl9sYXllciA9IGxheWVyO1xuICAgIH0sXG4gICAgYWRkOiBmdW5jdGlvbihwb3MsIGl0ZW0pIHtcbiAgICAgIHZhciBsYXllciA9IHRoaXMuX2xheWVyO1xuICAgICAgdmFyIHNlbGYgPSB0aGlzO1xuXG4gICAgICB2YXIgdmVydGV4ID0gbmV3IEtvbnZhLkdyYXBocy5WZXJ0ZXgoe1xuICAgICAgICB4OiBwb3MueCxcbiAgICAgICAgeTogcG9zLnksXG4gICAgICAgIHRleHQ6IGl0ZW0udG9TdHJpbmcoKSxcbiAgICAgICAgdGFnOiBpdGVtXG4gICAgICB9KTtcbiAgICAgIGxheWVyLmFkZCh2ZXJ0ZXgpO1xuICAgICAgdmVydGV4Lm9uKCdjbGljaycsIGZ1bmN0aW9uKGUpIHtcbiAgICAgICAgaWYgKGUudGFyZ2V0LnBhcmVudCA9PT0gdmVydGV4KSB7XG4gICAgICAgICAgaWYgKHNlbGYuX3ByZXYpIHtcbiAgICAgICAgICAgIHNlbGYuYWRkRWRnZShzZWxmLl9wcmV2LCB2ZXJ0ZXgpO1xuICAgICAgICAgICAgc2VsZi5fcHJldi5jbGVhcigpO1xuICAgICAgICAgICAgc2VsZi5fcHJldiA9IG51bGw7XG4gICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIHNlbGYuX3ByZXYgPSB2ZXJ0ZXg7XG4gICAgICAgICAgICB2ZXJ0ZXguaGlnaGxpZ2h0KCk7XG4gICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICB9KTtcblxuICAgICAgbGF5ZXIuZHJhdygpO1xuICAgIH0sXG4gICAgYWRkRWRnZTogZnVuY3Rpb24odjEsIHYyKSB7XG4gICAgICB2YXIgZWRnZSA9IG5ldyBLb252YS5HcmFwaHMuRWRnZSh2MSwgdjIpO1xuICAgICAgdmFyIGxheWVyID0gdGhpcy5fbGF5ZXI7XG4gICAgICBsYXllci5hZGQoZWRnZSk7XG4gICAgICBsYXllci5kcmF3KCk7XG4gICAgfVxuICB9O1xuICBLb252YS5HcmFwaHMgPSBLb252YS5HcmFwaHMgfHwge307XG4gIEtvbnZhLkdyYXBocy5HcmFwaCA9IEdyYXBoO1xufSkod2luZG93LCB3aW5kb3cualF1ZXJ5KTtcbiIsIi8vIHN0YXJ0LmpzXG5cbihmdW5jdGlvbih3aW5kb3csIGRvY3VtZW50KSB7XG4gIHZhciBvbkxvYWQgPSBmdW5jdGlvbigpIHtcbiAgICBjb25zb2xlLmxvZygnbG9hZC4uLicpO1xuICAgIHZhciBlbCA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKCdjb250YWluZXInKTtcbiAgICB2YXIgZ3JhcGggPSBuZXcgS29udmEuR3JhcGhzLkdyYXBoKGVsKTtcblxuICB9O1xuXG4gICQod2luZG93KS5iaW5kKCdsb2FkJywgb25Mb2FkKTtcbn0pKHdpbmRvdywgd2luZG93LmRvY3VtZW50KTtcbiIsIi8vdmVydGV4LmpzXG5cbihmdW5jdGlvbigkKSB7XG4gIHZhciBleHRlbmQgPSAkLmV4dGVuZDtcbiAgS29udmEuR3JhcGhzID0gS29udmEuR3JhcGhzIHx8IHt9O1xuXG4gIGZ1bmN0aW9uIFZlcnRleChjb25maWcpIHtcbiAgICB2YXIgZ3JvdXBDb25maWcgPSB7XG4gICAgICBkcmFnZ2FibGU6IHRydWVcbiAgICB9O1xuICAgIGdyb3VwQ29uZmlnID0gZXh0ZW5kKGdyb3VwQ29uZmlnLCB7XG4gICAgICB4OiBjb25maWcueCxcbiAgICAgIHk6IGNvbmZpZy55XG4gICAgfSk7XG4gICAgS29udmEuR3JvdXAuY2FsbCh0aGlzLCBncm91cENvbmZpZyk7XG4gICAgdGhpcy4kaW5pdChjb25maWcpO1xuICAgIHRoaXMuY2hpbGRzID0gW107XG4gIH1cblxuICBWZXJ0ZXgucHJvdG90eXBlID0ge1xuICAgICRpbml0OiBmdW5jdGlvbihjb25maWcpIHtcbiAgICAgIHZhciBjaXJjbGUgPSBuZXcgS29udmEuQ2lyY2xlKHtcbiAgICAgICAgcmFkaXVzOiAyMCxcbiAgICAgICAgZmlsbDogJ2xpZ2h0Z3JlZW4nXG4gICAgICB9KTtcblxuICAgICAgdmFyIHRleHQgPSBuZXcgS29udmEuVGV4dCh7XG4gICAgICAgIHRleHQ6IGNvbmZpZy50ZXh0LFxuICAgICAgICBmb250U2l6ZTogMTIsXG4gICAgICAgIGZpbGw6ICdibGFjaydcbiAgICAgIH0pO1xuXG4gICAgICB2YXIgdGV4dERpbSA9IHRleHQuZ2V0Q2xpZW50UmVjdCgpO1xuXG4gICAgICB0ZXh0Lm9mZnNldCh7XG4gICAgICAgIHg6IHRleHREaW0ud2lkdGggLyAyLFxuICAgICAgICB5OiB0ZXh0RGltLmhlaWdodCAvIDJcbiAgICAgIH0pO1xuXG4gICAgICB0aGlzLmFkZChjaXJjbGUpO1xuICAgICAgdGhpcy5hZGQodGV4dCk7XG4gICAgICB0aGlzLl9jaXJjbGUgPSBjaXJjbGU7XG4gICAgfSxcbiAgICBoaWdobGlnaHQ6IGZ1bmN0aW9uKCkge1xuICAgICAgdGhpcy5fY2lyY2xlLnN0cm9rZSgnYmxhY2snKTtcbiAgICB9LFxuICAgIGNsZWFyOiBmdW5jdGlvbigpIHtcbiAgICAgIHRoaXMuX2NpcmNsZS5zdHJva2UobnVsbCk7XG4gICAgfVxuICB9O1xuXG4gIEtvbnZhLlV0aWwuZXh0ZW5kKFZlcnRleCwgS29udmEuR3JvdXApO1xuXG4gIEtvbnZhLkdyYXBocy5WZXJ0ZXggPSBWZXJ0ZXg7XG5cbn0pKHdpbmRvdy5qUXVlcnkpO1xuIl19
