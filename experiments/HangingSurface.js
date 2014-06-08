define(function(require, exports, module) {
    // import dependencies
    var RenderNode = require('famous/core/RenderNode');
    var View = require('famous/core/View');
    var Surface = require('famous/core/Surface');
    var Modifier = require('famous/core/Modifier');
    var StateModifier = require('famous/modifiers/StateModifier');
    var Transform = require('famous/core/Transform');
    var Easing = require('famous/transitions/Easing');
    var PhysicsEngine = require('famous/physics/PhysicsEngine');
    var Particle = require('famous/physics/bodies/Particle');
    var Rectangle = require('famous/physics/bodies/Rectangle');
    var Drag = require('famous/physics/forces/Drag');
    var Spring = require('famous/physics/forces/Spring');
    var VectorField = require ('famous/physics/forces/VectorField');
    var Distance = require ('famous/physics/constraints/Distance');
    var Vector = require('famous/math/Vector');
    var GenericSync         = require('famous/inputs/GenericSync');
    var TouchSync           = require('famous/inputs/TouchSync');
    var MouseSync           = require('famous/inputs/MouseSync');
    var Transitionable      = require('famous/transitions/Transitionable');

    GenericSync.register({
        touch : TouchSync,
        mouse : MouseSync
    });

    function HangingSurface() {
        window.TT = Transform;
        window.PE = this;

        View.apply(this,arguments);

        this.physicsEngine = new PhysicsEngine();

        _createForces.call(this);
        _createView.call(this);
    }


    HangingSurface.prototype = Object.create(View.prototype);
    HangingSurface.prototype.constructor = HangingSurface;

    HangingSurface.DEFAULT_OPTIONS = {
        surfOneSize: [100, 100],  // define the surface size
        surfOneContent:'',        // define the content of the surface
        surfOneClasses:['bon-surf'],   // define the classes of the surface
        surfOneProperties:{},       // define the properties of the surface
        surfOneStringSize: [5, 200],  // define the String surface size
        surfOneStringContent:'',        // define the String content of the surface
        surfOneStringClasses:['bon-surf'],   // define the String classes of the surface
        surfOneStringProperties:{},       // define the String properties of the surface
        surfOneStringAnchor: new Vector([window.innerWidth*0.5, 0, 0]),  // define the position of the string
        friction: 0.001,                      // define the friction of hanging
        drag: 0.005,
        stringLength: 200               // define the length of the string
    };

    function _createForces(){
        this.gravityField = new VectorField({
            strength:0.1,
            field : VectorField.FIELDS.CONSTANT,
            direction: new Vector(0,1,0)
        });
        this.string = new Distance({
            anchor : this.options.surfOneStringAnchor,
            length : this.options.stringLength
        });
        this.friction = new Drag({
            strength : this.options.friction,
            forceFunction : Drag.FORCE_FUNCTIONS.LINEAR
        });
        this.drag = new Drag({
            strength : this.options.drag,
            forceFunction: Drag.FORCE_FUNCTIONS.QUADRATIC
        });
    }

    function _createView(){
        this.createSurf({
            name:'surfOne',
            size: this.options.surfOneSize,
            position: this.options.surfOneStringAnchor.add(new Vector(0,this.options.stringLength,0))
        });
        this.createString({
            name:'surfOne',
            size: this.options.surfOneStringSize,
            position: this.options.surfOneStringAnchor,
            classes: this.options.surfOneStringClasses
        });
    }

    function _attachAgents(name){
        this[name+'gravityFieldId'] = this.physicsEngine.attach(this.gravityField,this[name+'particle']);
        this[name+'frictionId'] = this.physicsEngine.attach(this.friction,this[name+'particle']);
        this[name+'dragId'] = this.physicsEngine.attach(this.drag,this[name+'particle']);
        this[name+'stringId'] = this.physicsEngine.attach(this.string,this[name+'particle']);
    }
    function _detachAgents(name){
        this.physicsEngine.detach(this[name+'gravityFieldId']);
        this.physicsEngine.detach(this[name+'frictionId']);
        this.physicsEngine.detach(this[name+'dragId']);
        this.physicsEngine.detach(this[name+'stringId']);
    }

    function _attachGravity(name){
        this[name+'gravityFieldId'] = this.physicsEngine.attach(this.gravityField,this[name+'particle']);
    }

    function _detachGravity(name){
        this.physicsEngine.detach(this[name+'gravityFieldId']);
    }

    function _calAngle(Pos){
        var x = Pos[0]-this.options.surfOneStringAnchor.get()[0];
        var y = Pos[1]-this.options.surfOneStringAnchor.get()[1];
//        console.log(Math.atan2(x,y))
        return Math.atan2(x,y);
    }

    function _setupDragEvent(name){
        this[name+'Sync'] = new GenericSync(
            ['touch','mouse']
        );
        this[name].pipe(this[name+'Sync']);
        this[name+'Sync'].on('start', function() {
            _detachAgents.call(this,name);
            this[name+'particle'].setVelocity([0,0,0]);
//            _detachGravity.call(this,name);
        }.bind(this));

        this[name+'Sync'].on('update', function(data) {
            this[name+'particle'].setPosition((new Vector([this[name+'particle'].getPosition()[0]+data.delta[0]-this.options.surfOneStringAnchor.get()[0],this[name+'particle'].getPosition()[1]+data.delta[1]-this.options.surfOneStringAnchor.get()[1],this[name+'particle'].getPosition()[2]]).normalize(this.options.stringLength)).add(this.options.surfOneStringAnchor));
        }.bind(this));

        this[name+'Sync'].on('end', function() {
            _attachAgents.call(this,name);
//            _attachGravity.call(this, name);
        }.bind(this));
    }

    HangingSurface.prototype.createSurf = function(options){
        var name = options.name;
        var size = options.size;
        var position = options.position;
        this[name+'Pos'] = new Transitionable(position.get());
        this[name] = new Surface({
            size: size,
            content: this.options[name+'Content'],
            classes:this.options[name+'Classes'],
            properties: this.options[name+'Properties']
        });
        this[name+'Mod'] = new Modifier({
            transform:Transform.translate(-0.5*size[0],0)
        });
        this[name+'particle'] = new Rectangle({
            size: size,
            velocity : new Vector(0,0,0),
            position : this[name+'Pos'].get(),
            mass:1
        });

        this.physicsEngine.addBody(this[name+'particle']);
        this.add(this[name+'particle']).add(this[name+'Mod']).add(this[name]);

        _attachAgents.call(this,name);
        _setupDragEvent.call(this,name);
    };

    HangingSurface.prototype.createString = function(options){
        var name = options.name+'String';
        var size = options.size;
        var position = options.position;
        var classes = options.classes;
        this[name] = new Surface({
            size: size,
            classes:classes
        });
        this[name+'Mod'] = new Modifier({
            transform: function(){
                var angle = _calAngle.call(this, this[options.name+'particle'].getPosition());
                return Transform.thenMove(Transform.rotateZ(-angle),[position.get()[0],position.get()[1] - size[0]/2,position.get()[2]])
            }.bind(this)
        });
        this.add(this[name+'Mod']).add(this[name]);
    };

    HangingSurface.prototype.events = function(){

    };

    module.exports = HangingSurface;


});
