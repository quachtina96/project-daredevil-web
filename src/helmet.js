
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
	constructor {
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
}
