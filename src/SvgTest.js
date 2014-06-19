/*globals define*/
define(function(require, exports, module) {
    // import dependencies
    var Engine = require('famous/core/Engine');
    var mainContext = Engine.createContext();
    mainContext.setPerspective(800);

    var SvgLoader = require('../experiments/SvgLoader');

    var test = new SvgLoader({
//        src: 'http://openclipart.org/people/Anonymous/israeli_flag_anonymous_01.svg',
//        src: 'http://upload.wikimedia.org/wikipedia/en/9/9e/Flag_of_Japan.svg',
//        src: 'http://upload.wikimedia.org/wikipedia/commons/6/66/Flag_of_Malaysia.svg',
        src: 'http://upload.wikimedia.org/wikipedia/commons/4/44/BMW.svg',
//        src: 'http://upload.wikimedia.org/wikipedia/commons/0/0f/BMW_Roundel.svg'
    });
    console.log(test);
    mainContext.add(test);
    setTimeout(function(){
        test.show()
    }, 2000);
});
