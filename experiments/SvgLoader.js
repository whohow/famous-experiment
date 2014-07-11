define(function(require, exports, module) {
    var View = require('famous/core/View');
    var Surface = require('famous/core/Surface');
    var Transform = require('famous/core/Transform');
    var Modifier = require('famous/core/Modifier');
    var StateModifier = require('famous/modifiers/StateModifier');
    var GridLayout = require("famous/views/GridLayout");
    require('../lib/jquery.min');
    require('../lib/underscore');
    var Transitionable = require('famous/transitions/Transitionable');
    var SpringTransition = require('famous/transitions/SpringTransition');
    var Easing = require('famous/transitions/Easing');

    Transitionable.registerMethod('spring', SpringTransition);



    function SvgLoader(options) {
        this.options = options;
        View.apply(this, arguments);
        _createTransitions.call(this);
        _createViews.call(this);
        _setListeners.call(this);
    }

    SvgLoader.prototype = Object.create(View.prototype);
    SvgLoader.prototype.constructor = SvgLoader;

    SvgLoader.DEFAULT_OPTIONS = {
        size: [200, 150],
        bound: 0.1,   // bound , the pic will appear 0.5 +/- bound
        surfacesNumber: 15,
        timeInterval: 600,
        zTranslate: -100
    };

    function _createViews() {
        this.showNumber = this.options.surfacesNumber;
        this.surfaces = [];
        this.mods = [];
        for(var i = 0; i < this.options.surfacesNumber; ++i){
            this.surfaces.push(new Surface({
                size: this.options.size
            }));
            this.mods.push(new StateModifier({
                origin:[.5,.5],
                opacity : 0
            }));
            this.add(this.mods[i]).add(this.surfaces[i]);
        }
    }

    SvgLoader.prototype.setContent = function(src, callback){
        this.hide();
        _getSVG.call(this, src, callback);
    }

    function _getSVG(src, callback){
        $.get(src, function(d){
            this.svg = $(d.querySelector('svg'));
            this.svg.find('metadata').remove();
            var w = this.svg.attr('width');
            var h = this.svg.attr('height');
            if (w.indexOf('pt')>0) {
                w = parseInt(w)*8/6;
                h = parseInt(h)*8/6;
            } else {
                w = parseInt(w);
                h = parseInt(h);
            }
            if (!this.svg.attr('viewBox')) {
                this.svg.attr('viewBox',"0 0 " + w + " " + h)
            }
            this.svg.attr({
                width: '100%',
                height: '100%',
                preserveAspectRatio: "xMinYMin meet"
            });
            this.svgContent = this.svg[0].outerHTML;
            _createLeafSurfaces.call(this, src);
            this.show();
            if (callback) callback.call(this);
        }.bind(this));
    }



    function _createLeafSurfaces(src){
        var use = this.svg.find('use');
        var tags = _getTag(use);
        var leafSVG = this.svg.find('*:not(:has(*))').not(tags.join(','));
        this.showNumber = leafSVG.length < this.options.surfacesNumber ? leafSVG.length: this.options.surfacesNumber
        if(leafSVG.length < this.options.surfacesNumber){
            for(var i = 0; i < leafSVG.length; ++i){
//            this.leafSVG.hide();
//            $(this.leafSVG[i]).show();
                leafSVG.css('opacity', 0);
                $(leafSVG[i]).css('opacity', 1);
                this.surfaces[i].setContent(this.svg[0].outerHTML)
            }
        }else{
            var interval = Math.floor(leafSVG.length / this.options.surfacesNumber);
            for(var i = 0; i < this.options.surfacesNumber; ++i){
                leafSVG.css('opacity', 0);
                for(var j = i * interval; j < (i+1) * interval; ++j){
                    $(leafSVG[j]).css('opacity', 1);
                    if(i == this.options.surfacesNumber - 1) {
                        while(j < leafSVG.length){
                            $(leafSVG[j++]).css('opacity', 1);
                        }
                    }
                }
                this.surfaces[i].setContent(this.svg[0].outerHTML)
            }
        }
        window.svg = this.svg;
        window.svgContent = this.svgContent;
        window.leafSVG = this.leafSVG;
        window.memory = this.memory;
        window.test = this;
    }

    function _getTag(leafSVG){
        return  _.pluck(_.pluck(leafSVG.filter('use'), 'href'), 'baseVal');
    }

    function _setListeners() {

    }

    SvgLoader.prototype.show = function(){
        var index = 0;
        this.interval = setInterval(function(){
                var x = _.sample([.5 + this.options.bound,.5 - this.options.bound,.5]);
                var y = _.sample([.5 + this.options.bound,.5 - this.options.bound,.5]);
                this.mods[index].setAlign([x, y]);
                this.mods[index].setOpacity(1);
                this.mods[index].setAlign([.5,.5], _.sample(this.transitions));
                this.mods[index].setTransform(Transform.translate(0, 0 ,this.options.zTranslate), _.sample(this.transitions));
                ++index;
                if(index >= this.showNumber){
                    clearInterval(this.interval);
                }
        }.bind(this), this.options.timeInterval)

    }

    function _createTransitions(){
        this.transitions = [];
        this.transitions.push({duration: 500, curve: Easing.inQuad});
        this.transitions.push({duration: 500, curve: Easing.outQuad});
        this.transitions.push({duration: 500, curve: Easing.inOutQuad});
        this.transitions.push({duration: 500, curve: Easing.inCubic});
        this.transitions.push({duration: 500, curve: Easing.outCubic});
        this.transitions.push({duration: 500, curve: Easing.inOutCubic});
        this.transitions.push({duration : 500, curve: Easing.inQuint });
        this.transitions.push({duration : 500, curve: Easing.outQuint });
        this.transitions.push({duration : 500, curve: Easing.inOutQuint });
        this.transitions.push({duration: 500, curve: Easing.inElastic});
        this.transitions.push({duration: 500, curve: Easing.outElastic});
        this.transitions.push({duration: 500, curve: Easing.inOutElastic});
        this.transitions.push({duration: 500, curve: Easing.inBounce});
        this.transitions.push({duration: 500, curve: Easing.outBounce});
        this.transitions.push({duration: 500, curve: Easing.inOutBounce});
        this.transitions.push({duration: 500, curve: Easing.inBack});
        this.transitions.push({duration: 500, curve: Easing.outBack});
        this.transitions.push({duration: 500, curve: Easing.inOutBack});
        //this.transitions.push({method: 'spring',period: 500, dampingRatio: 0.7});
    }

//    SvgLoader.prototype.boom = function(){
//        var angleInterval = Math.PI * 2 / this.leafSurfaces.length;
//    }



    SvgLoader.prototype.hide = function(){
        _.each(_.range(this.showNumber), function(index){
            this.surfaces[index].setContent('');
            this.mods[index].setOpacity(0);
        }.bind(this));
        clearInterval(this.interval);
    }

    module.exports = SvgLoader;
});