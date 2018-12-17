/**
 * @fileoverview This file defines the helmet controller.
 */

class Helmet {
	constructor(channel) {
		// The pheonix channel connected to the helmet
		this.channel = channel;
		// Current state of the helmet
		this.state = {
			'left': {
				'top': {
					'speed': 0,
					'stop': false,
					'direction':'clockwise'
				},
				'bottom': {
					'speed': 0,
					'stop': false,
					'direction':'clockwise'
				},
			},
			'right': {
				'top': {
					'speed': 0,
					'stop': false,
					'direction':'clockwise'
				},
				'bottom': {
					'speed': 0,
					'stop': false,
					'direction':'clockwise'
				}
			}
		}
	}

	/**
	 * Update internal state and send message to the microcontrollers on the
	 * physical helmet
	 * @param {!string} side - 'left' or 'right'. corresponds to which microcontroller
	 * 	should respond to the message
	 * @param {!Object} state - object denoting the speed and stop states of the
	 * 	mounted motors
	 */
	update(side, state) {
		this.state[side] = state;
		this.sendState(side);
	}

	sendState(side) {
		console.log('sending state')
		console.log({body: JSON.stringify(this.state[side])});
		console.log('for side')
		console.log(side)
		this.channel.push(side, {body: JSON.stringify(this.state[side])});
	}

	// Stop the entire helmet from moving
	stop(side) {
		this.state[side].top.speed = 0;
		this.state[side].bottom.speed = 0;
		this.sendState(side);
	}

	setDirection(id, direction) {
		var label = id.split('-');
	    var side = label[0];
	    var topbottom = label[1];
	    if (direction === "clockwise" || direction === "counterclockwise" ) {
	    	this.state[side][topbottom].direction = direction;
	    }
	    this.sendState(side);
	    return this.state[side][topbottom].direction;
	}

	setBrake(id, brakeStatus) {
		var label = id.split('-');
	    var side = label[0];
	    var topbottom = label[1];
	    if (typeof brakeStatus === "boolean") {
	    	this.state[side][topbottom].stop = brakeStatus;
	    }
	    this.sendState(side);
	    return this.state[side][topbottom].brakeStatus;
	}

	toggleDirection(id) {
	    var label = id.split('-');
	    var side = label[0];
	    var topbottom = label[1];
	    var currentDirection = this.state[side][topbottom].direction;
	    if (currentDirection == "clockwise") {
	    	this.state[side][topbottom].direction = "counterclockwise";
	    } else {
	    	this.state[side][topbottom].direction = "clockwise";
	    }
	    this.sendState(side);
	    return this.state[side][topbottom].direction;
	}

	toggleBrake(id) {
	    var label = id.split('-');
	    var side = label[0]
	    var topbottom = label[1];
	    this.state[side][topbottom].stop = !this.state[side][topbottom].stop;
	    this.sendState(side);
	    return this.state[side][topbottom].stop;
	}

	setSpeed(id,speed) {
		var label = id.split('-');
	    var side = label[0]
	    var topbottom = label[1];

	    // keep speed to possible range (1-100)
	    if (speed < 0) {
	    	this.state[side][topbottom].speed = 0;
	    } else if (speed > 100) {
	    	this.state[side][topbottom].speed = 100;
	    } else {
	    	this.state[side][topbottom].speed = speed;
	    }

	    this.sendState(side);
	    return this.state[side][topbottom].speed;
	}

	lookUp(document) {
		var percentSpeed = 20;
		this.setSpeed('top-left', percentSpeed)
		this.setSpeed('top-right', percentSpeed)
		this.setDirection('top-left', 'counterclockwise')
     	this.setDirection('top-right', 'clockwise')
     	this.sendState('left');
     	this.sendState('right');

     	// Update GUI
     	document.get
	}

	lookDown(document) {
		var percentSpeed = 20;
		this.setSpeed('top-left', percentSpeed)
		this.setSpeed('top-right', percentSpeed)
		this.setDirection('top-left', 'clockwise')
		this.setDirection('top-right', 'counterclockwise')
     	this.sendState('left');
     	this.sendState('right');

     	// Update GUI
	}

	_updateGUI() {
  		var speedInputs = [...document.getElementsByClassName('speed_input')];
  		var directionButtons = [...document.getElementsByClassName('direction_button')];
	}
}

module.exports = Helmet
