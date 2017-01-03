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
