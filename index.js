$(document).ready(function() {
  PopulateKeys();
  navigator.getUserMedia = 
    navigator.getUserMedia ||
    navigator.webkitGetUserMedia ||
    navigator.mozGetUserMedia ||
    navigator.msGetUserMedia; 
  $('#capture').on('click',TakeVideo);
  $('#stopCapture').on('click',stopVideo);
  $('#background').on('click',Process);
  const video = document.querySelector('video');
  const constraints = {
      video: true,
      width: 320, 
      height: 240
    };
  const canvas = document.querySelector('canvas');
  var cameraStatus = false;
  function stopVideo() {
    const stream = video.srcObject;
    const tracks = stream.getTracks();
    tracks.forEach(function(track) {
      track.stop();
    });
    cameraStatus = false;
    video.srcObject = null;
  }
  function TakeVideo() {
    navigator.mediaDevices.getUserMedia(constraints).
      then((stream) => {video.srcObject = stream});
    cameraStatus = true;
    video.addEventListener('playing', function() {
      requestAnimationFrame(Process);
    })
  };
  function Process() {
    const ctx = canvas.getContext("2d");
    canvas.width = video.width;
    canvas.height = video.height;
    ctx.drawImage(video,0,0,canvas.width,canvas.height);
    requestAnimationFrame(Process);
  }
});
/*
function bufferPrepare(bufferval) {
  bufferArray = [];
  for (var i = 0; i < bufferval; i++) { //
  bufferArray.push(new Uint8Array(width * height));
}
function readFrame() {
  try {
    context.drawImage(video, 0, 0, width, height); 
  } catch (e) {
  // The video may not be ready, yet.
   return null;
  }
  return context.getImageData(0, 0, width, height);
 }
function measureLightChanges(data) {
  //Select the next frame from the buffer.
  var buffer = bufferArray[bufferidx++ % bufferArray.length];
  for (var i = 0, j = 0; i < buffer.length; i++, j += 4) {
    // Determine lightness value.
    var current = greyScale(data[j], data[j + 1], data[j + 2]); 
    // Set color to black.
    data[j] = data[j + 1] = data[j + 2] = 0; 
    // Full opacity for changes.
    data[j + 3] = 255 * lightnessHasChanged(i, current);   
    // Store current lightness value.
    buffer[i] = current;
  }
}
function lightnessHasChanged(index, value) {
  return bufferArray.some(function (buffer) {
    return Math.abs(value - buffer[index]) >= thresholdsize;
  });
}
*/
function onOpencvReady() {
  document.getElementById('capture').innerHTML = 'Take Video';
}
//Sound Control
//How to make sound more like theremin(???) email google?
function PopulateKeys() {
  var osc;
  var notes = ['C','C#','D','D#','E','F','F#','G','G#','A','A#','B']
  var html = "";
  for(var octave = 0; octave < 3; octave ++) {
    for (var i = 0; i<notes.length; i++) {
      let octaveSign = octave + 3;
      let data = notes[i] + octaveSign;
      html += '<div class="whitenote" onmouseover="noteDown(this)" onmouseout="noteUp(this)" data-note ='+data+' >';
      html += data+'</div>'
    }
  }
  document.getElementById('container').innerHTML = html;
}

function noteDown(elem) {
  var note = elem.dataset.note;
  osc = new Tone.Oscillator(note, "square").toDestination();
  osc.start();
  function onMouseOver(event) {
    osc.volume.value = -48+0.12*(210-event.clientY);
  }
  document.addEventListener("mousemove", onMouseOver);
}
function noteUp(elem) {
  osc.stop();
}