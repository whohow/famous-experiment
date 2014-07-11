/*globals define*/
define(function(require, exports, module) {
    // import dependencies
    var Engine = require('famous/core/Engine');
    var mainContext = Engine.createContext();
    mainContext.setPerspective(600);

    var SvgLoader = require('../experiments/SvgLoader');

    var test = new SvgLoader({
//        src: 'http://openclipart.org/people/Anonymous/israeli_flag_anonymous_01.svg',
//        src: 'http://upload.wikimedia.org/wikipedia/en/9/9e/Flag_of_Japan.svg',
//        src: 'http://upload.wikimedia.org/wikipedia/commons/6/66/Flag_of_Malaysia.svg',
//        src: 'http://upload.wikimedia.org/wikipedia/commons/4/44/BMW.svg',
//           src: 'http://upload.wikimedia.org/wikipedia/commons/2/25/HTML5_Shiny_Icon.svg'
//        src: 'http://upload.wikimedia.org/wikipedia/commons/0/0f/BMW_Roundel.svg'
        //'http://upload.wikimedia.org/wikipedia/commons/d/df/Wikispecies-logo.svg'
        //'http://upload.wikimedia.org/wikipedia/commons/7/75/Wikimedia_Community_Logo.svg'
        //'http://upload.wikimedia.org/wikipedia/en/2/24/WWF_logo.svg'
    });
//    test.setContent('http://upload.wikimedia.org/wikipedia/commons/0/0f/BMW_Roundel.svg');
//    setTimeout(function(){
//        test.show();
//    }, 2000);
//    setTimeout(function(){test.hide()}, 10000);
//    console.log(test);
    window.svgloader = test;
    mainContext.add(test);
//    setTimeout(function(){
//        test.show()
//    }, 1000);
});
