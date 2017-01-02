(function(){
  var stage;
  var backgroundLayer, lineLayer, circleLayer, rect;
  var extend = $.extend;
  var dim;
  var counter = 0;

  function Vertex(config) {
    var grpOpts = {
      draggable: true
    };
    Konva.Group.call(this, extend(grpOpts, config))

    var copts = {
      fill: 'lightgreen',
      radius: 20,
      name: 'vertex'
    };

    var topts = {
      fontSize: 12,
      fill: 'black',
      name: 'vertex'
    };

    if (!('c' in config)) {
      config.c = copts;
    }
    else {
      extend(config.c, copts);
    }

    if(!('t' in config)) {
      config.t = topts;
    }
    else {
      extend(config.t, topts);
    }

    this.$init(config);
  }

  Vertex.prototype = {
    $init: function(config) {
      // console.log('Config:', config);
      // console.log(copts, topts);
      var circle = new Konva.Circle(config.c);
      var txt = new Konva.Text(config.t);
      var tr = txt.getClientRect();
      txt.offset({
        x: tr.width/2,
        y: tr.height/2
      });
      this.add(circle);
      this.add(txt);
    }
  };

  Konva.Util.extend(Vertex, Konva.Group);

  window.addEventListener('load', function(){
    // stage =
    stage = initCanvas();
    var prev = null;
    stage.on('click', function createCircle(e){
      // console.log(e, rect);
      if (e.target === rect) {
        if (!prev) {
          var pos = stage.getPointerPosition();
          var idx = counter++;
          var label = idx.toString();
          vm.addVertex(idx);
          var v = new Vertex({
            t: {
              text: label
            },
            x: pos.x, y: pos.y,
            tag: idx
          });
          circleLayer.add(v);
          v.on('click', function selectCircle(e){
            if (e.target.parent === v) {
              console.log(prev, e);
              if (!prev) {
                prev = v;
                v.findOne('Circle').setStroke('black');
                // console.log('done');
              }
              else {
                var pos2 = v.getPosition();
                var pos1 = prev.getPosition();
                prev.findOne('Circle').setStroke('');
                var dx = pos2.x - pos1.x, dy = pos2.y - pos1.y;
                var angle = Math.atan2(dy, dx);
                var r = 20;

                var start = {
                  x: pos1.x + r * Math.cos(angle),
                  y: pos1.y + r * Math.sin(angle)
                };
                var px = dx - 2 * r * Math.cos(angle);
                var py = dy - 2 * r * Math.sin(angle);
                var edge = [prev.getAttr('tag'), v.getAttr('tag')];
                var arrow = new Konva.Arrow({
                  x: start.x, y: start.y,
                  points: [
                    0,0 ,
                    px, py
                  ],
                  pointerLength: 5,
                  pointerWidth: 5,
                  fill:'black',
                  stroke:'black',
                  strokeWidth: 2,
                  tag: edge
                });
                circleLayer.add(arrow);
                vm.addEdge(edge[0], edge[1]);
                prev = null;

              }
              circleLayer.draw();
            }
          });
        }
        else {
          prev.findOne('Circle').setStroke('');
          prev = null;
        }

        circleLayer.draw();
      }
    }); //end stage on click...
    var vm = new ViewModel();
    ko.applyBindings(vm);
  }, false);

  function ViewModel() {
    var self = this;

    var graph = ko.observable({
      v:ko.observableArray(),
      e:ko.observableArray()
    });

    self.isDrawingMode = ko.observable(true);
    self.show = function(mode) {
      console.log('mode:', mode);
      self.isDrawingMode(mode === 'canvas');
    };
    self.json = ko.computed(function(){
      return ko.toJSON(graph);
    });
    self.addVertex = function(v) {
      console.log('addVertex');
      graph().v.push(v);
    };
    self.addEdge = function(start, end) {
      console.log('addEdge');
      graph().e.push([start, end]);
    }
  };

  function initCanvas() {
    var container = document.getElementById('container');
    var $container = $(container);

    var computeCanvas = function() {
      var offset = $container.offset();
      var maxHeight = window.innerHeight;
      var width = $container.parent().width();
      return {
        height: maxHeight - offset.top,
        width: width
      };
    };

    window.addEventListener('resize', function(){
      dim = computeCanvas();
      stage.width(dim.width);
      stage.height(dim.height);
      rect.width(dim.width);
      rect.height(dim.height);
      // backgroundLayer.draw();
      stage.draw();
    }, false);

    dim = computeCanvas();
    // console.log(dim);
    var stage = new Konva.Stage({
      height: dim.height,
      width: dim.width,
      container: container
    });
    backgroundLayer = new Konva.Layer();
    rect = new Konva.Rect({
      height:dim.height,
      width: dim.width,
      stroke:'black'
    });
    backgroundLayer.add(rect);
    lineLayer = new Konva.Layer();
    circleLayer = new Konva.Layer();
    stage.add(backgroundLayer);
    stage.add(lineLayer);
    stage.add(circleLayer);
    return stage;
  }


})()
