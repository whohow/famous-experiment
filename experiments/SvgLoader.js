define(function(require, exports, module) {
    var View = require('famous/core/View');
    var Surface = require('famous/core/Surface');
    var Transform = require('famous/core/Transform');
    var Modifier = require('famous/core/Modifier');
    var StateModifier = require('famous/modifiers/StateModifier');
    var GridLayout = require("famous/views/GridLayout");
    require('../lib/jquery.min');
    require('../lib/underscore');

    var surfNum = 10

    function SvgLoader(options) {
        this.options = options;

        View.apply(this, arguments);
        _createViews.call(this);
        _setListeners.call(this);
    }

    SvgLoader.prototype = Object.create(View.prototype);
    SvgLoader.prototype.constructor = SvgLoader;

    SvgLoader.DEFAULT_OPTIONS = {
        size: [400, 300]
    };

    function _createViews() {
        var src= this.options.src;
        $.get(src, function(d){
//            var s = new XMLSerializer();
//            var zoom = this.options.size[0] / $(d).width();
//            this.svgContent = s.serializeToString(d.querySelector('svg'));
//            this.svgContent = $(this.svgContent).css('zoom',zoom)[0].outerHTML;

            this.svg = $(d.querySelector('svg'));
            var w = this.svg.attr('width');
            var h = this.svg.attr('height');
            if (w.indexOf('pt')>0) {
                w = parseInt(w)*8/6;
                h = parseInt(h)*8/6;
            }

            this.svgContent = this.svg.attr({
                width: '100%',
                height: '100%',
                preserveAspectRatio: "xMinYMin meet",
                viewBox: "0 0 " + w + " " + h
            })[0].outerHTML;
            window.svg = this.svg;
            window.svgContent = this.svgContent;
            var surfaces = [];
            window.d = d;
            $(d).find('metadata').remove();
            this.svgLeaves = $(d).find('*:not(:has(*))');
            //_createSurfaces(surfaces, d.children[0]);
            _createLeafSurfaces.call(this);
            window.surf = surfaces;
            this.surfaces = surfaces;
        }.bind(this));
        this.firstSurface = new Surface({
            content: 'hello world',
            size: this.options.size,
            properties: {
                color: 'white',
                textAlign: 'center',
                backgroundColor: '#FA5C4F'
            }
        });
//        this.add(this.firstSurface);
    }

    function _createLeafSurfaces(){
        this.leafSurfaces = [];
        for(var i = 0; i < this.svgLeaves.length; ++i){
            this.leafSurfaces.push(new Surface({
                size: this.options.size,
                content: this.svgContent
            }));
        }
    }

    function _getLeaf(d, leaf){
        if(d.nodeName === 'metadata') return;
        if(! d.hasOwnProperty('children') || d.children.length == 0){
            $(d).hide();
            leaf.push(d);
        }else{
            _.each(d.children, function(child){
                _getLeaf(child, leaf);
            });
        }
    }

    function _createSurfaces(surfaces, d){
        var node = $(d).clone().context;
        var leaf = [];
        _getLeaf(node, leaf);
        var num = surfNum;
        if(leaf.length < surfNum) num = leaf.length;
        var interval = Math.floor(leaf.length / num);
        for(var i = 0; i < num; ++i){
            surfaces.push(new Surface({
                //size: [100,100]
//                content: i+'',
//                properties: {
//                    color: 'white',
//                    backgroundColor: "hsl(" + (i * 360 / 3) + ", 100%, 50%)"
//                }
            }));
            _createSurf(d, surfaces, i, interval);
        }
    }

    function _createSurf(d, surfaces, i, interval){
        var node = d.cloneNode();
        _copyTree(d, node)
        //var context = node.context;
        var leaf = [];
        _getLeaf(node, leaf);
        _show(leaf, i, interval);
        //surfaces[i].setContent(node);
    }

    function _show(leaf, i, interval){
        var start = i * interval;
        var end = start + interval;
        //console.log(start, end, '??????')
        for(var j = start; j < end; ++j){
            //console.log(j, leaf[j]);
            $(leaf[j]).show();
        }
    }

    function _copyTree(root, result){
        if(d.nodeName === 'metadata') return;
        if(! root.hasOwnProperty('children')){
            return ;
        }else {
            _.each(root.children, function(child){
                var next = child;
                if(child.children.length === 0){
                    next = child.cloneNode();
                }
                result.append(next);
                _copyTree(child, next);
            });
        }
    }

    function _setListeners() {
        setTimeout(function(){
//            $(surf[1]).css('zoom', '200%');
            window.layout = new GridLayout({dimensions: [2,5]});
//            console.log(surf);
            window.layout.sequenceFrom(this.leafSurfaces);
            this.add(window.layout);
//            this.add(new StateModifier({
//                size: [100, 100],
//                origin: [.5,.2]
//            })).add(surf[1])
//            this.firstSurface.setContent(str);
        }.bind(this), 1000);

    }

    module.exports = SvgLoader;
});