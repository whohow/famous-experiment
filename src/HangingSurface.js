/*globals define*/
define(function(require, exports, module) {
    // import dependencies
    var Engine = require('famous/core/Engine');
    var mainContext = Engine.createContext();
    mainContext.setPerspective(800);

    var HangingSurface = require('../experiments/HangingSurface');

    var test = new HangingSurface({surfOneContent:'bonbonobn'});
    mainContext.add(test);

});
