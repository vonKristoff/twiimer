###Tween-Timer || "Twiime"
---
A duel tween engine and time system, that allows you to tween data with easing over a duration, and add re-ocurring functions set over any time period.

Great for countdowns, fractional based changes set to intervals and tweening animations.

####Library components

The code comprises of two main features, a `timer` and a `tweener`. A default clock is created _(more can be built)_ and runs at the standard `requestAnimationFrame`, that is purposely optimised to tween and animate at a solid 60fps. Multiple clocks provide executables the chance to re-occur at a registered set interval.

**`Tweener`** is a simple tween engine that breaks down a duration into fractional steps running at its associated clocks' _fps_. Useage comprises by fulfilling the following:

*	`duration` - in ms
*	`fn` - custom tweening function
*	`ease` - choose an easing function to use (see list.. when added)
*	`callback` - available when duration is complete

**`Timer`** The master engine that stores the available clocks that run at whatever speeds they are generated to, and each can have static functions applied, through the master API controller. The default clock is called _'default'_ and is generally intended to be associated to the tweening engine.

**`API`** Clock controller.

*	`create` - create a clock by a name, and fps ie: fps(10) = every 10 seconds
*	`add` - add an `executable` function to a clock interval
*	`start` - master loop starter
*	`stop` - master loop stopper
*	`reset` - reset the times | counts on a particular clock
*	`remove` - remove an `executable` from a particular clock
*	`tween` - call the tweener and bind a target

---

##example usage

	// create new Twiime
	var twi = new Timer();

	// start the engine
	twi.start();
	
	// tween a DOM item
	twi.tween({
		fn: function (stepFraction){
	  		var tgt = 500,
	  			x = tgt * stepFraction;
	  		this.css({'transform', 'translate('+ x +',0)'}) = tgt * stepFraction;
		}.bind($('.box')), // bind your target
		ease:'linear',
		callback: function(){
	  		console.log('finished');
		}
	},2000);
	
	// interval usage
	
	twi.add('interval-name', 'default', function () {
		// do something on interval
	}, 1000)