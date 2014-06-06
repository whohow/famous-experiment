define(function(require, exports, module) {
    var Engine = require('famous/core/Engine');
    var Surface = require('famous/core/Surface');
    var Transform = require('famous/core/Transform');
    var Scrollview = require('famous/views/Scrollview');
    var StateModifier = require('famous/modifiers/StateModifier');
    var ViewSequence = require('famous/core/ViewSequence');
    var Timer    = require('famous/utilities/Timer');

    var mainContext = Engine.createContext();
    mainContext.setPerspective(500);

    var surfaces = [];
    var scrollview = new Scrollview({
        margin: 180
    });

    Engine.pipe(scrollview);

    var viewSequence = new ViewSequence({
        array: surfaces,
        loop: true
    });
    scrollview.sequenceFrom(viewSequence);

    var size = [300, 100];

    var centerModifier = new StateModifier({
        size: size,
        origin: [0.5, 0.5],
        align: [0.5, 0.5]
    });

    mainContext.add(centerModifier).add(scrollview);

    for (var i = 0; i < 40; i++) {
        var surface = new Surface({
            size: size,
            content: i,
            properties: {
                textAlign: 'center',
                lineHeight: '100px',
                color: 'white',
                backgroundColor: "hsl(" + (i * 360 / 40) + ", 100%, 50%)",
                boxShadow: '0 0 15px rgba(0, 0, 0, 0.5)',
                fontSize: '50px'
            }
        });

        surfaces.push(surface);
    }

    scrollview.outputFrom(function(offset) {
        return Transform.moveThen([0, -50, 350], Transform.rotateX(-0.004 * offset));
    });

    var v = -5;
    var a = 0.1;
    var c = 1;
    scrollview.setVelocity(v);

    var f = function() {
        c=c+a;
        v = v /Math.pow(c,2);
        scrollview.setVelocity(v);
        if (v==0) Timer.clear(f);
    }
    Timer.every(f, 100);


});
