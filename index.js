$('document').ready(function() {
  PopulateKeys();
})
var slider = document.getElementById("slider");
var isSound = false
const canvas = document.getElementById('canvas');
const context = canvas.getContext('2d');
let videoInterval = 50;
let isVideo = true;
  navigator.getUserMedia = 
  navigator.getUserMedia ||
  navigator.webkitGetUserMedia ||
  navigator.mozGetUserMedia ||
  navigator.msGetUserMedia; 
$('#capture').on('click',TakeVideo);
$('#stopCapture').on('click',stopVideo);
const video = document.querySelector('video');
const constraints = {video: true};
let model;
var cameraStatus = false;
function stopVideo() {
  var stream = video.srcObject;
  var tracks = stream.getTracks();
  tracks.forEach(function(track) {
    track.stop();
  });
  handTrack.stopVideo(video)
  isVideo = false;
  cameraStatus = false;
  video.srcObject = null;
}
const modelParams = {
  flipHorizontal: true, // flip e.g for video  
  maxNumBoxes: 1, // maximum number of boxes to detect
  iouThreshold: 0.5, // ioU threshold for non-max suppression
  scoreThreshold: 0.70, // confidence threshold for predictions.
}
handTrack.load(modelParams).then(lmodel => {
  model = lmodel;
});
function TakeVideo() {
  handTrack.startVideo(video).then(function (status) {
    if (status) {
      isVideo = true
      runDetection()
    }
  });
}
function runDetection() {
  model.detect(video).then(predictions => {
    model.renderPredictions(predictions, canvas, context, video);
    if (predictions[0]) {
      var sliderValue = -48+0.06*(video.height-parseFloat(predictions[0]['bbox'][1]));
      if(isSound){
        osc.volume.value = sliderValue;
        slider.value = 48+sliderValue;
      }
    }
    if (isVideo) {
      setTimeout(() => {
        runDetection(video)
      }, videoInterval);
    }
  });
}

//Sound Control
//How to make sound more like theremin(???) email google?
function noteDown(elem) {
  var note = elem.dataset.note;
  osc = new Tone.Oscillator(note, "square").toDestination();
  osc.start();
  osc.volume.value = -24;
  isSound = true;
}
function noteUp(elem) {
  isSound = false;
  osc.stop();
}

function PopulateKeys() {
  var osc;
  var notes = ['C','C#','D','D#','E','F','F#','G','G#','A','A#','B']
  var html = "";
  for(var octave = 0; octave < 1; octave ++) {
    for (var i = 0; i<notes.length; i++) {
      let octaveSign = octave + 4;
      let data = notes[i] + octaveSign;
      html += '<div class="whitenote" onmouseover="noteDown(this)" onmouseout="noteUp(this)" data-note ='+data+' >';
      html += data+'</div>'
    }
  }
  document.getElementById('container').innerHTML = html;
}
