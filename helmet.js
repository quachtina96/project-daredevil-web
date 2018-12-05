/**
 * @fileoverview This file defines the helmet controller.
 */
class Helmet {
	constructor {
		this.serial = new Serial();
		this.actions = {
			'left':
		}
	}

	move(type) {
		this.execute(this.actions[actionType]);
	}

	execute(actionType) {
		for (var movement of this.actions[actionType]) {
			this.serial.send(movement);
		}

	}
}

class Serial {
	send(movement) {
		console.log('send movement')
	}
}