define(function(require, exports, module) {
    var Engine = require('famous/core/Engine');
    var Surface = require('famous/core/Surface');
    var Transform = require('famous/core/Transform');
    var Scrollview = require('famous/views/Scrollview');
    var StateModifier = require('famous/modifiers/StateModifier');
    var ViewSequence = require('famous/core/ViewSequence');
    var Utility = require('famous/utilities/Utility');

    var mainContext = Engine.createContext();
    mainContext.setPerspective(500);

    var surfaces = [];
    var scrollview = new Scrollview({
        direction: Utility.Direction.X,
        margin: 10000
    });

    Engine.pipe(scrollview);

    var viewSequence = new ViewSequence({
        array: surfaces,
        loop: false
    });
    scrollview.sequenceFrom(viewSequence);

    var size = [300, 300];

    var centerModifier = new StateModifier({
        size: size,
        origin: [0.5, 0.5],
        align: [0.5, 0.5]
    });

    mainContext.add(centerModifier).add(scrollview);

    for (var i = 0; i < 5; i++) {
        var surface = new Surface({
            size: size,
            content: 'Surface ' + i,
            properties: {
                textAlign: 'center',
                lineHeight: '100px',
                color: 'white',
                backgroundColor: "hsl(" + (i * 360 / 40) + ", 100%, 50%)",
                boxShadow: '0 0 15px rgba(0, 0, 0, 0.5)'
            }
        });

        surfaces.push(surface);
    }



    window.outputFunction1 = function(offset) {
        return Transform.moveThen([0, -50, 350], Transform.rotateX(-0.004 * offset));
    };

    window.outputFunction2 = function(offset) {
        return Transform.identity;
    };

    window.scrollview = scrollview;
    window.Transform = Transform;

    window.scrollToPage = function(pageIndex){
        var curIndex = this.scrollview._node.getIndex();
        var diff =  pageIndex - curIndex;
        if(diff > 0){
            while(diff !== 0){
                this.scrollview.goToNextPage();
                diff--;
            }
        }else if(diff < 0){
            while(diff !== 0){
                this.scrollview.goToPreviousPage();
                diff++;
            }
        }
    }
});
