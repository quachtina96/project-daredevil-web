var React = require('react');
var moment = require('moment');
var Chart = require('chart.js');
var Helmet = require('./helmet.js');
const { Socket } = require('phoenix-channels');

class Recorder {
  constructor () {
    this.startTime = null;
    this.endTime = null;
  }

  start() {
    this.startTime = moment();
  }

  stop() {
    this.endTime = moment();
  }
}

var timeFormat = 'MM/DD/YYYY HH:mm:ss';
var recording = true;

function newDate(seconds) {
  return moment().add(seconds, 'seconds').toDate();
}

function newDateString(seconds) {
  return moment().add(seconds, 'seconds').format(timeFormat);
}

var color = Chart.helpers.color;
var config = {
  type: 'line',
  data: {
    labels: [ // Date Objects
    ],
    datasets: [{
      label: 'Measured X',
      backgroundColor: color(window.chartColors.green).alpha(0.5).rgbString(),
      borderColor: window.chartColors.green,
      fill: false,
      data: [],
    },
    {
      label: 'Measured Y',
      backgroundColor: color(window.chartColors.blue).alpha(0.5).rgbString(),
      borderColor: window.chartColors.blue,
      fill: false,
      data: [],
    },
    {
      label: 'Measured Z',
      backgroundColor: color(window.chartColors.purple).alpha(0.5).rgbString(),
      borderColor: window.chartColors.purple,
      fill: false,
      data: [],
    }]
  },
  options: {
    title: {
      text: 'Chart.js Time Scale'
    },
    scales: {
      xAxes: [{
        type: 'time',
        time: {
          format: timeFormat,
          // round: 'day'
          tooltipFormat: 'll HH:mm'
        },
        scaleLabel: {
          display: true,
          labelString: 'Date'
        }
      }],
      yAxes: [{
        scaleLabel: {
          display: true,
          labelString: 'Acceleration'
        }
      }]
    },
  }
};

var measuredAccelerationData = config.data.datasets[0].data;

function randomizeData() {
  config.data.datasets.forEach(function(dataset) {
    dataset.data.forEach(function(dataObj, j) {
      if (typeof dataObj === 'object') {
        dataObj.y = randomScalingFactor();
      }
    });
  });

  window.myLine.update();
}

var colorNames = Object.keys(window.chartColors);

function addDataset() {
  var colorName = colorNames[config.data.datasets.length % colorNames.length];
  var newColor = window.chartColors[colorName];
  var newDataset = {
    label: 'Dataset ' + config.data.datasets.length,
    borderColor: newColor,
    backgroundColor: color(newColor).alpha(0.5).rgbString(),
    data: [],
  };

  for (var index = 0; index < config.data.labels.length; ++index) {
    newDataset.data.push(randomScalingFactor());
  }

  config.data.datasets.push(newDataset);
  window.myLine.update();
}

function addRandomData() {
  // Add measured acceleration data
  var measuredAccelerationData = config.data.datasets[0].data
  measuredAccelerationData.push({
    x: moment().toDate(),
    y: randomScalingFactor(),
  });
  window.myLine.update();
}

/**
 * Add data to the plot.
 * @param {!Object} xyzData - a dictionary mapping x y and z axes to their
 * string values of their accelerations
 */
function addData(xyzData) {
  var date = moment().toDate();
  var map = {
    'x':0,
    'y':1,
    'z':2
  }
  // Add measured acceleration data
  for (var axis in map) {
    var acceleration = config.data.datasets[map[axis]].data
    acceleration.push({
      x: date,
      // convert data from string to float
      y: parseFloat(xyzData[axis]),
    });
  }
  window.myLine.update();
}

function removeDataset() {
  config.data.datasets.splice(0, 1);
  window.myLine.update();
};

function removeData() {
  config.data.labels.splice(-1, 1); // remove the label first

  config.data.datasets.forEach(function(dataset) {
    dataset.data.pop();
  });

  window.myLine.update();
};

// Add event listeners.
window.onload = function() {
  var ctx = document.getElementById('canvas').getContext('2d');
  window.myLine = new Chart(ctx, config);

  document.onkeydown = function(evt) {
    evt = evt || window.event;
    switch(evt.code) {
      case 'KeyL':
        console.log('sending left state');
        channel.push("left", {body: JSON.stringify(state)})
        break;
      case 'KeyRight':
        console.log('sending right state');
        channel.push("right", {body: JSON.stringify(state)})
      case 'ArrowLeft':
        console.log('left');
        break;
      case 'ArrowRight':
        console.log('right');
        break;
      case 'ArrowUp':
        console.log('up');
        break;
      case 'ArrowDown':
        console.log('down');
        break;
      case 'Space':
        // toggle recording
        if (recording) {
          recorder.stop();
        } else {
          recorder.start();
        }
        recording = !recording;
      default:
        break;
    }
  };

  var speedInputs = [...document.getElementsByClassName('speed_input')];
  speedInputs.forEach(function(elem) {
      elem.addEventListener("keydown", function() {
        if (event.key === 'Enter') {
          if (parseFloat(elem.value)) {
            var newSpeed = helmet.setSpeed(elem.id, parseFloat(elem.value));
            elem.value = newSpeed;
            console.log('set speed for ' + elem.id);
          } else {
            console.log('could not speed for ' + elem.id);
            elem.value = '0';
          }
          elem.blur()
        }
      });
  });

  var directionButtons = [...document.getElementsByClassName('direction_button')];
  directionButtons.forEach(function(elem) {
      elem.addEventListener("click", function() {
        var messageMap = {
          'clockwise': 'Rotate Counterclockwise',
          'counterclockwise': 'Rotate Clockwise'
        };

        console.log('toggle motor direction for ' + elem.id);
        // Update view
        // Change data
        var newDirection = helmet.toggleDirection(elem.id)
        elem.textContent = messageMap[newDirection];
      });
  });

  var brakeButtons = [...document.getElementsByClassName('brake_button')];
  brakeButtons.forEach(function(elem) {
      elem.addEventListener("click", function() {
        console.log('toggle brake on for ' + elem.id);
        var newBrakeStatus = helmet.toggleBrake(elem.id)
        elem.textContent = newBrakeStatus ? 'Turn Off Brake' : 'Turn On Brake';
      });
  });

  // TODO: enable brake buttons when stopping mechanism works
  brakeButtons.forEach(function(elem) {
    elem.disabled = true;
  });

  // HELMET CONTROLS

  // Explaining the url
  // ws:// denotes websocker
  let socket = new Socket("ws://dlevs.me:4000/socket")

  socket.connect()

  // Now that you are connected, you can join channels with a topic:
  let channel = socket.channel("room:lobby", {})

  channel.join()
    .receive("ok", resp => { console.log("ok", resp) })
    .receive("error", resp => { console.log("error on channel", resp) })

  var helmet = new Helmet(channel);

  // In order to keep the connection alive, send current state to arbitrary side
  // every 20 seconds.
  setInterval(function() {
     helmet.sendState('right');
     console.log('heartbeat');
   }, 10000);

  var handleHelmetCommand = function(el) {
    // Set directions
    if (this.id === 'look_up') {
      helmet.lookUp(document);
      updateHelmetStatus(helmet);
    } else if (this.id == 'look_down') {
      helmet.lookDown(document);
      updateHelmetStatus(helmet);
    }
  }

  // ACCELERATION DATA VISUALIZATION
  var ws = new WebSocket("ws://localhost:8765");

  ws.onopen = function () {
    ws.send("This is the browser!");
  };

  ws.onmessage = function (e) {
    let readings = JSON.parse(e.data);
    addData(readings)
    console.log(readings)
  };

};

