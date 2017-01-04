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
