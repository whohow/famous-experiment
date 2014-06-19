/*globals define*/
define(function(require, exports, module) {
    // import dependencies
    var Engine = require('famous/core/Engine');
    var mainContext = Engine.createContext();
    mainContext.setPerspective(800);

    var SvgLoader = require('../experiments/SvgLoader');

    var test = new SvgLoader({src: 'http://openclipart.org/people/Anonymous/israeli_flag_anonymous_01.svg'});
    console.log(test);
    mainContext.add(test);

});
