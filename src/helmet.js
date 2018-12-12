
// right or left state
state = {
	'top': {
		'speed': 300,
		'stop': true,
	},
	'bottom': {
		'speed': 300,
		'stop': false,
	}
};

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
				},
				'bottom': {
					'speed': 0,
					'stop': false,
				},
			},
			'right': {
				'top': {
					'speed': 0,
					'stop': false,
				},
				'bottom': {
					'speed': 0,
					'stop': false,
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
		channel.push(side, {body: JSON.stringify(state)})
	}

	// Stop the entire helmet from moving
	stop(side) {
		this.state[side].top.speed = 0;
		this.state[side].bottom.speed = 0;
		channel.push(side, {body: JSON.stringify(state)})
	}
}
