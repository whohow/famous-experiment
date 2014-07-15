define(function(require, exports, module) {
    var Transform = require('famous/core/Transform');
    var Modifier = require('famous/core/Modifier');
    var RenderNode = require('famous/core/RenderNode');
    var Utility = require('famous/utilities/Utility');
    var OptionsManager = require('famous/core/OptionsManager');
    var Transitionable = require('famous/transitions/Transitionable');
    var TransitionableTransform = require('famous/transitions/TransitionableTransform');

    function Lightbox(options) {
        this.options = Object.create(Lightbox.DEFAULT_OPTIONS);
        this._optionsManager = new OptionsManager(this.options);

        if (options) this.setOptions(options);

        this._showing = false;
        this.nodes = [];
        this.transforms = [];
        this.states = [];
    }

    Lightbox.DEFAULT_OPTIONS = {
        inTransform: Transform.scale(0.001, 0.001, 0.001),
        inOpacity: 0,
        inOrigin: [0.5, 0.5],
        outTransform: Transform.scale(0.001, 0.001, 0.001),
        outOpacity: 0,
        outOrigin: [0.5, 0.5],
        showTransform: Transform.identity,
        showOpacity: 1,
        showOrigin: [0.5, 0.5],
        inTransition: true,
        outTransition: true,
        overlap: false
    };

    Lightbox.prototype.setOptions = function setOptions(options) {
        return this._optionsManager.setOptions(options);
    };

    Lightbox.prototype.show = function show(renderable, transition, callback) {
        if (!renderable) {
            return this.hide(callback);
        }

        if (transition instanceof Function) {
            callback = transition;
            transition = undefined;
        }

        if (this._showing) {
            if (this.options.overlap) this.hide();
            else {
                this.hide(this.show.bind(this, renderable, callback));
                return;
            }
        }
        this._showing = true;

        var stateItem = {
            transform: new TransitionableTransform(this.options.inTransform),
            origin: new Transitionable(this.options.inOrigin),
            opacity: new Transitionable(this.options.inOpacity)
        };

        var transform = new Modifier({
            transform: stateItem.transform,
            opacity: stateItem.opacity,
            origin: stateItem.origin
        });
        var node = new RenderNode();
        node.add(transform).add(renderable);
        this.nodes.push(node);
        this.states.push(stateItem);
        this.transforms.push(transform);

        var cbCount = this.options.showTransforms ? 2 + this.options.showTransforms.length : 3;
        var _cb = callback ? Utility.after(cbCount, callback) : undefined;

        if (!transition) transition = this.options.inTransition;
        stateItem.opacity.set(this.options.showOpacity, transition, _cb);
        stateItem.origin.set(this.options.showOrigin, transition, _cb);

        if (this.options.showTransforms)
            this.options.showTransforms.map(function(showTransform,index){
                stateItem.transform.set(showTransform, this.options.showTransitions[index], _cb);
            }.bind(this));
        else
            stateItem.transform.set(this.options.showTransform, transition, _cb);

    };

    Lightbox.prototype.hide = function hide(transition, callback) {
        if (!this._showing) return;
        this._showing = false;

        if (transition instanceof Function) {
            callback = transition;
            transition = undefined;
        }

        var node = this.nodes[this.nodes.length - 1];
        var transform = this.transforms[this.transforms.length - 1];
        var stateItem = this.states[this.states.length - 1];

        var cbCount = this.options.outTransforms ? 2 + this.options.outTransforms.length : 3;
        var _cb = Utility.after(cbCount, function() {
            this.nodes.splice(this.nodes.indexOf(node), 1);
            this.states.splice(this.states.indexOf(stateItem), 1);
            this.transforms.splice(this.transforms.indexOf(transform), 1);
            if (callback) callback.call(this);
        }.bind(this));

        if (!transition) transition = this.options.outTransition;
        stateItem.opacity.set(this.options.outOpacity, transition, _cb);
        stateItem.origin.set(this.options.outOrigin, transition, _cb);
        if (this.options.outTransforms)
            this.options.outTransforms.map(function(outTransform,index){
                stateItem.transform.set(outTransform, this.options.outTransitions[index], _cb);
            }.bind(this));
        else
            stateItem.transform.set(this.options.outTransform, transition, _cb);
    };

    Lightbox.prototype.render = function render() {
        var result = [];
        for (var i = 0; i < this.nodes.length; i++) {
            result.push(this.nodes[i].render());
        }
        return result;
    };

    module.exports = Lightbox;
});
