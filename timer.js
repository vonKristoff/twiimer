/**
 * Clock Instance
 * @param  {num} fps interval rate (1 is 1 second : .5 is 500ms)
 * @return {object}     clock instance
 */
function buildClock (fps) {

  this.fps = fps;
  this.run = false;
  this.now = 0;
  this.then = 0;
  this.count = 0;
  this.exec = {};
  this.tween = {};

  return this
}


/**
 * Main Instance of Twiimer
 */
function Timer () {

    this.clocks = {};
    this.enterFrame = false;

    this.clocks['default'] = new buildClock(1/60);

    return this.API()  
};
var t = Timer.prototype;

/**
 * Available Public methods to use Twiimer
 */
t.API = function() {
  var self = this;
  this.methods = {
    create: function (clock, fps) {
      this.clocks[clock] = new buildClock(fps);

    }.bind(self),
    add: function (eventname, callback, clock) {
      if(typeof clock != 'string') clock = 'default';
      this.clocks[clock].exec[eventname] = callback;

    }.bind(self),
    start: function (clock) {
      if(typeof clock != 'string') clock = 'default';
      var $this = this.clocks[clock];
      $this.run = true;
      $this.count = 0;

      if(!this.enterFrame) {
        this.ticker();
        this.enterFrame = true;
      }

    }.bind(self),
    stop: function (clock) {
      if(typeof clock != 'string') clock = 'default';
      this.clocks[clock].run = false;
      this.methods.reset(clock);

    }.bind(self),
    reset: function (clock) {
      if(typeof clock != 'string') clock = 'default';
      var $this = this.clocks[clock];
      $this.now = Date.now();
      $this.then = Date.now();
      $this.count = 0;

    }.bind(self),
    remove: function (clock, eventname) {

      if(typeof clock != 'string') clock = 'default';
      var $this = this.clocks[clock];
      if($this.exec[eventname]) { 
        delete $this.exec[eventname];
        if(Object.keys($this.exec).length < 1) {
          this.methods.stop(clock);
        }
      }
    }.bind(self),
    tween: function (config, duration, clock){

      if(typeof clock != 'string') clock = 'default';

      var $this = this.clocks[clock].tween
      ,   i = Object.keys($this).length; 
  
      $this[i] = new Tweener(duration, config.fn, config.ease, config.callback);
      
    }.bind(self)
  }
  return this.methods
}


/**
 * Animation Frame Handler
 * @return {num} returns a step or clock count
 */
t.ticker = function () {

    var run = 0;
    for (key in this.clocks) {
        
        var clock = this.clocks[key]
        ,   interval = 1000 * clock.fps;

        if (clock.run) {

            run++; // count clocks scheduled to run
                
            clock.now = Date.now();
            clock.delta = clock.now - clock.then;

            if (clock.delta > interval) {

                // reset time
                clock.then = clock.now - (clock.delta % interval);
                // events here
                clock.count += 0.01;

                // are there any functions attached to call
                if (Object.keys(clock.exec).length > 0) {
                    for (var callback in clock.exec) {
                        clock.exec[callback](clock.count);
                    }
                }
                // if tween
                if (Object.keys(clock.tween).length > 0) {
                    var fin = 0;
                    for (var i=0;i<Object.keys(clock.tween).length;i++) {
                        if(clock.tween[i].tweening){
                            clock.tween[i].engine(clock.tween[i], Date.now() - clock.tween[i].tweenstart);
                        } else {
                            fin++;
                        }
                    }
                    if (Object.keys(clock.tween).length === fin) {
                        console.log('removing tweens',clock.tween);
                        clock.tween = {};
                    }
                }
            }
        }
    }
    // if there are clocks still running - call enter frame
    if(run > 0){
        window.requestAnimationFrame(this.ticker.bind(this));    
    } else {
        this.enterFrame = false;
    }
}
/**
 * Tween engine
 * @param {num}   duration in ms
 * @param {fn}   animate  function to pass
 * @param {string}   ease     how to handle the step returns
 * @param {Function} callback when duration has finished
 */
function Tweener (duration, animate, ease, callback) {

    this.progress = 0;
    this.duration = duration;
    this.type = ease;
    this.tweening = true;
    this.tweenstart = Date.now();

    this.animate = animate;
    this.callback = callback;

    return this
}
var tw = Tweener.prototype;

tw.engine = function(clock, timepassed){
  
    this.progress = timepassed / this.duration;

    if(this.progress > 1) this.progress = 1;

    var step = this.ease(this.progress, this.type);

    this.animate(step);

    if(this.progress === 1) {
        this.tweening = false;
        if(this.callback) this.callback();
    }
}
tw.ease = function (progress, type) {
    switch (type) {
        default:
            return progress;
        break;
    }
}