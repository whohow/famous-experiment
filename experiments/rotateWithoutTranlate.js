define(function(require, exports, module) {
    var Engine = require('famous/core/Engine');
    var Surface = require('famous/core/Surface');
    var Modifier = require('famous/core/Modifier');
    var Transform = require("famous/core/Transform");
    var View = require('famous/core/View');

    var number = 5;
    var surfaceWidth = 100; //window.innerWidth;
    var viewDeg = 0;
    var Degree = 2*Math.PI/360;

    var mainContext = Engine.createContext();
    mainContext.setPerspective(300);

    var initialTime = Date.now();
    var spinMod = new Modifier({
        transform : function(){
            var spinDeg = .002 * (Date.now() - initialTime);
            return Transform.rotate(viewDeg*Degree, 0, spinDeg);
        }
    });
    var spinNode = mainContext.add(spinMod);
    for (var i = 0; i < number; i++) {
        var height = .5/Math.tan(Math.PI/number);
        var rotate = new Modifier({
            size: [surfaceWidth, surfaceWidth],
            origin: [.5,.5-height],
            align: [.5,.5],
            transform: Transform.rotateZ(i*2*Math.PI/number)
        });
        var node = spinNode.add(rotate);
        var surface = new Surface({
            size: [surfaceWidth, 100],
            properties: {
                "-webkit-backface-visibility": "visible",
                backgroundColor: "hsl(" + (i * 360 / number) + ", 100%, 50%)"
            }
        });
        var mod = new Modifier({
            origin: [.5,.5],
            transform: Transform.rotateX(Math.PI/2)
        });
        node.add(mod).add(surface);
    }
});