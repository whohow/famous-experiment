define(function(require, exports, module) {
    // import dependencies
    var Engine = require('famous/core/Engine');
    var Modifier = require('famous/core/Modifier');
    var Transform = require('famous/core/Transform');
    var ImageSurface = require('famous/surfaces/ImageSurface');
    var Surface = require('famous/core/Surface')

    // create the main context
    var mainContext = Engine.createContext();

    // your app here
//    var logo = new ImageSurface({
//        size: [200, 200],
//        content: 'http://code.famo.us/assets/famous_logo.svg',
//        classes: ['double-sided']
//    });
    // rotate , to find a coordinator
    // only rotate the coordinator all other surface relative static to it

    var s1 = new Surface({
        size: [200, 200],
        content: 'eva0',
        properties:{
            textAlign:'center',
            backgroundColor: '#FA5C4F',
            webkitBackfaceVisibility: 'visible'
        }
    });

    var s2 = new Surface({
        size: [200, 200],
        content: 'eva1',
        properties:{
            textAlign:'center',
            backgroundColor: '#005C4F',
            webkitBackfaceVisibility: 'visible'
        }
    });

    var s3 = new Surface({
        size: [200, 200],
        content: 'eva2',
        properties:{
            textAlign:'center',
            backgroundColor: '#FAAA4F',
            webkitBackfaceVisibility: 'visible'
        }
    });


    var initialTime = Date.now();

    var worldModifier = new Modifier({
        size: [window.innerWidth, window.innerHeight],
        origin: [0.5, 0.5],
        transform: function(){
            return Transform.rotate(1,0.001 * (Date.now() - initialTime),0);
        }
    });

    var distance = 100/Math.sqrt(3);
    var locationModifier1 = new Modifier({
        origin: [0.5,0.5],
        transform: function(){
            return Transform.translate(0, 0, - distance);
        }
    });
    var locationModifier2 = new Modifier({
        origin: [0.5,0.5],
        transform: function(){
            return Transform.translate(50, 0, distance/2);
        }
    });
    var locationModifier3 = new Modifier({
        origin: [0.5,0.5],
        transform: function(){
            return Transform.translate(-50, 0, distance/2);
        }
    });
    var angleModifier2 = new Modifier({
        transform: function(){
            return Transform.rotateY(Math.PI/3);
        }
    });
    var angleModifier3 = new Modifier({
        transform: function(){
            return Transform.rotateY(-Math.PI/3);
        }
    });




//    var centerSpinModifier = new Modifier({
//        transform : function(){
//            return Transform.rotateX(0.001 * (Date.now() - initialTime) + Math.PI/2)
//        }
//    });
//    var centerSpinModifier1 = new Modifier({
//        transform : function(){
//            return Transform.rotateX(0.001 * (Date.now() - initialTime) + Math.PI/2 - Math.PI)
//        }
//    });
    // transform is not cumulative
    // what is rotate  rotate(x,y,z) initial vector in Z
    // with Z vector angle is 0
    // with X and Y is 90

    var worldNode = mainContext.add(worldModifier);
    worldNode.add(locationModifier1).add(s1);
    worldNode.add(locationModifier2).add(angleModifier2).add(s2);
    worldNode.add(locationModifier3).add(angleModifier3).add(s3);
//    mainContext.add(locationModifier2).add(angleModifier2).add(s2);
//    mainContext.add(locationModifier3).add(angleModifier3).add(s3);



});
