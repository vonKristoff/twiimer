/**
* The real deal script
* Needs documentational love
**/

function Timer (){

  this.clocks = {};

  function defaultClock (fps){
    this.fps = fps;
    this.run = false;
    this.now = 0;
    this.then = 0;
    this.count = 0;
    this.exec = {};
    this.tween = {};
 
    return this;
  }

  (function constructor(){
    // initialise standard clock 60 fps
    this.clocks['default'] = new defaultClock(60); 
    
  }).bind(this)()    

  return this.API()  
};

var t = Timer.prototype;

t.API = function(){
  return {
    create: function(clock, fps){
      this.clocks[clock] = new buildClock(fps);

    }.bind(this),
    add: function (eventname, clock, callback, autostart){
      this.clocks[clock].exec[eventname] = callback;
      if(autostart) this.start(clock);

    }.bind(this),
    start: function (clock){
      if(typeof clock != 'string') clock = 'default';
      var $this = this.clocks[clock];
      $this.run = true;
      $this.count = 0;
      this.ticker();

    }.bind(this),
    stop: function (clock){
      if(typeof clock != 'string') clock = 'default';
      this.clocks[clock].run = false;
      this.API.reset(clock);

    }.bind(this),
    reset: function (clock){
      if(typeof clock != 'string') clock = 'default';
      var $this = this.clocks[clock];
      $this.now = Date.now();
      $this.then = Date.now();
      $this.count = 0;

    }.bind(this),
    remove: function (clock, eventname){
      if(typeof clock != 'string') clock = 'default';
      var $this = this.clocks[clock];
      if($this.exec[eventname]) { 
        delete $this.exec[eventname];
        if(Object.keys($this.exec).length < 1){
          this.API.stop(clock);
        }
      }
    }.bind(this),
    tween: function (config, duration, clock){

      if(typeof clock != 'string') clock = 'default';

      var $this = this.clocks[clock].tween
      ,   i = Object.keys($this).length; 
  
      $this[i] = new Tween(duration, config.fn, config.ease, config.callback);
      
    }.bind(this)
  }
}

t.ticker = function (){

  for (key in this.clocks){
        
    var clock = this.clocks[key]
    ,   interval = 1000/clock.fps;
          
    clock.now = Date.now();
    clock.delta = clock.now - clock.then;

    if (clock.delta > interval) {
      // reset time
      clock.then = clock.now - (clock.delta % interval);
      // events here
      clock.count += 0.01;

      // are there any functions attached to call
      if(Object.keys(clock.exec).length > 0){
        for(var callback in clock.exec){
          clock.exec[callback](clock.count);
        }
      }
      // if tween
      if(Object.keys(clock.tween).length > 0){
        var fin = 0;
        for(var i=0;i<Object.keys(clock.tween).length;i++){
          if(clock.tween[i].tweening){
            clock.tween[i].engine(clock.tween[i], Date.now() - clock.tween[i].tweenstart);
          } else {
            fin++;
          }
        }
        console.log(clock.tween);
        if(Object.keys(clock.tween).length === fin) {
          console.log('removing tweens',clock.tween);
          clock.tween = {};
        }
      }
    }

  }
  // if timers are empty of execs, ie: all are false
  var request = Object.keys(this.clocks).map(function (key) {
    if(this.clocks[key].run === true) return true
  }.bind(this));

  if(request){
    window.enterFrame(this.ticker.bind(this));    
  }
}

function Tween (duration, animate, ease, callback){

  this.progress = 0;
  this.duration = duration;
  this.type = ease;
  this.tweening = true;
  this.tweenstart = Date.now();

  this.animate = animate;
  this.callback = callback;

  return this
}
var tw = Tween.prototype;

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
tw.ease = function (progress, type){
  switch (type){
    default:
      return progress;
    break;
  }
}

var particle = {
  x:0,
  y:0
}

var e = new Timer();

e.start();

e.tween({
  fn: function (step){
    console.log('1',step, this);
    var tgt = 500;
    this.x += (tgt - this.x) / 10;
    // this.css('opacity',step)
  }.bind(particle), // bind your target
  ease:'linear',
  callback: function(){
    console.log('finiahed yo');
  }
},2000)

e.tween({
  fn: function (step){
    console.log('2',step, this);
    var tgt = 500;
    // this.x += (tgt - this.x) / 10;
    // this.css('opacity',step)
  }.bind(particle), // bind your target
  ease:'linear',
  callback: function(){
    console.log('finiahed yo');
  }
},1000)



