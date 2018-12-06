var W3CWebSocket = require('websocket').w3cwebsocket;

var ws = new W3CWebSocket('ws://localhost:8765', 'echo-protocol');

ws.onopen = function () {
  ws.send("This is the browser!");
};

ws.onmessage = function (e) {
  console.log('recieved message from server.py:');
  console.log(e)
  console.log('end message');

	// Parse data, which should take the following form:
	// {
	//      'x': xvalue,
	//      'y': yvalue,
	//      'z': zvalue,
	//  });
  let readings = JSON.parse(e.data);
  addData();

  // validate readings
  if (readings.length != 16) {
    console.log("Strange reading...", readings);
    return;
  }
};

// console.log(ws);