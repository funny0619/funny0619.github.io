$(document).ready(function() {
  PopulateKeys();
  $('#capture').on('click',TakeVideo);
  $('#stopCapture').on('click',stopVideo);
  const constraints = {
    video: true
  };
  const videoElem = document.querySelector('video');

  function stopVideo() {
    const stream = videoElem.srcObject;
    const tracks = stream.getTracks();
    tracks.forEach(function(track) {
      track.stop();
    });
    videoElem.srcObject = null;
  }
  function TakeVideo() {
    navigator.mediaDevices.getUserMedia(constraints).
      then((stream) => {videoElem.srcObject = stream});
  }
})


//Video Control


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