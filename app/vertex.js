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
