const { Socket } = require('phoenix-channels');

let socket = new Socket("ws://dlevs.me:4000/socket")

socket.connect()

// Now that you are connected, you can join channels with a topic:
let channel = socket.channel("room:lobby", {})

channel.join()
  .receive("ok", resp => { console.log("Joined successfully", resp) })
  .receive("error", resp => { console.log("Unable to join", resp) })

// TODO: handle channel on error?

// right or left state
state = {
	'top': {
		'speed': 100,
		'stop': true,
	},
	'bottom': {
		'speed': 100,
		'stop': false,
	}
};

// right or left state
string_state = {
	'top': {
		'direction':'clockwise'
	},
	'bottom': {
		'direction':'counterclockwise'
	}
};

// right or left state
bool_state = {
	'top': {
		'speed': 100,
		'stop': true,
	},
	'bottom': {
		'speed': 100,
		'stop': false,
	}
};

// channel.push("right", {body: JSON.stringify(state)})
channel.push("right", {body: JSON.stringify(string_state)});
// channel.push("left", {body: JSON.stringify(state)})