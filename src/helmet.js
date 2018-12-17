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
		channel.push(side, {body: JSON.stringify(this.state.side)});
	}

	// Stop the entire helmet from moving
	stop(side) {
		this.state[side].top.speed = 0;
		this.state[side].bottom.speed = 0;
		this.sendState(side);
	}

	toggleDirection(id) {
	    label = id.split('-');
	    side = label[0];
	    topbottom = label[1];
	    currentDirection = this.state[side][topbottom].direction;
	    if (currentDirection == "clockwise") {
	    	this.state[side][topbottom] = "counterclockwise";
	    } else {
	    	this.state[side][topbottom] = "clockwise";
	    }
	    this.sendState(side);
	}

	toggleBrake(id) {
	    label = id.split('-');
	    side = label[0]
	    topbottom = label[1];
	    this.state[side][topbottom].stop = !this.state[side][topbottom].stop;
	    this.sendState(side);
	}
}

module.exports = Helmet
