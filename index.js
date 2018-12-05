// TODO: automatically log information received from python over serial and
// give user ability to stop communication.
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
      label: 'Measured',
      backgroundColor: color(window.chartColors.green).alpha(0.5).rgbString(),
      borderColor: window.chartColors.green,
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
      y: xyzData[axis],
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

};
document.getElementById('addData').addEventListener('click', addData);
document.onkeydown = function(evt) {
  evt = evt || window.event;
  switch(evt.code) {
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

//////// REACT.JS STUFF
// class AccelerationPlot extends React.Component {
//   render() {

//   }
// }

class MotorPanel extends React.Component {
  render() {
    const {
      className,
      img: mainImg,
      title: mainTitle,
      moreButtons,
      tooltipPlace,
      onClick
    } = this.props;

    return (
      <div class="motor_panel">
      location:
      direction:
      brake state:
      power:
      current draw:
      </div>
    );
  }
}

class PlotManager extends React.Component {

}

class LiveMonitor extends React.Component {

}
