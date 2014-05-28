/**
 * Created by Colabeo on 5/27/14.
 */
define(function(require, exports, module) {
    // import dependencies
    var Engine = require('famous/core/Engine');
    var Modifier = require('famous/core/Modifier');
    var Transform = require('famous/core/Transform');
    var ImageSurface = require('famous/surfaces/ImageSurface');
    var Surface = require('famous/core/Surface');

    // create the main context
    var mainContext = Engine.createContext();
    mainContext.setPerspective(300);

    // global variables
    var surfaceNumber = 10;
    var radius = 200;


    var angle = Math.PI  / surfaceNumber ;
    var distance = radius * Math.cos(angle);
    var initialTime = Date.now();
    var surfaceSize = radius * Math.sin(angle) * 2;

    var worldModifier = new Modifier({
        size: [window.innerWidth, window.innerHeight],
        origin: [0.5, 0.5],
        transform: function(){
            //return Transform.rotate(0, Math.PI/2, 0);
            //return Transform.multiply4x4 ((Transform.rotateY(.002 * (Date.now() - initialTime))), Transform.rotateZ(Math.PI/2));
            return Transform.rotate(0,.001 * (Date.now() - initialTime), Math.PI/2)
        }
    });

    var translateModifierArray = [];
    for(var i = 0; i < surfaceNumber; ++i){
        translateModifierArray.push(new Modifier({
            origin:[0.5,0.5],
            transform: Transform.translate(0, distance * Math.sin(angle * i * 2), - distance * Math.cos(angle * i * 2))
        }));
    }

    var angleModifierArray = [];
    for(var i = 0; i < surfaceNumber; ++i){
        angleModifierArray.push(new Modifier({
            origin:[0.5,0.5],
            transform: Transform.rotateX(i * angle * 2)

        }));
    }

    var surfaceArray = [];
    for(var i = 0; i < surfaceNumber; ++i){
        surfaceArray.push(new Surface({
            size: [surfaceSize, surfaceSize],
            content: 'eva' + i,
            properties:{
                textAlign:'center',
                backgroundColor: "hsl(" + (i * 360 / surfaceNumber) + ", 100%, 50%)",
                webkitBackfaceVisibility: 'visible'
            }
        }));
    }

    var worldNode = mainContext.add(worldModifier);
    for(var i = 0; i < surfaceNumber; ++i){
        worldNode.add(translateModifierArray[i]).add(angleModifierArray[i]).add(surfaceArray[i]);
    }

});

