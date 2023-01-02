const log = console.log;

if (!('webkitSpeechRecognition' in window)) {
  alert('no webkitSpeechRecognition');
} else {
  let recognizing: boolean;
  let ignore_onend: boolean;
  try {
    var recognition = new window.webkitSpeechRecognition();
    recognition.onstart = function () {
      recognizing = true;
      log('info_speak_now');
    };

    recognition.onerror = function (event: any) {
      if (event.error == 'no-speech') {
        log('info_no_speech');
        ignore_onend = true;
      }
      if (event.error == 'audio-capture') {
        log('info_no_microphone');
        ignore_onend = true;
      }
      if (event.error == 'not-allowed') {
        log('info_denied');
        ignore_onend = true;
      }
    };
    recognition.onresult = function (event: any) {
      let final_transcript = '';
      let interim_transcript = '';
      if (typeof event.results == 'undefined') {
        recognition.onend = null;
        recognition.stop();
        return;
      }
      for (var i = event.resultIndex; i < event.results.length; ++i) {
        if (event.results[i].isFinal) {
          final_transcript += event.results[i][0].transcript;
        } else {
          interim_transcript += event.results[i][0].transcript;
        }
      }
      log('final', final_transcript);
      log('interim', interim_transcript);
    };
    recognition.start();
  } catch (e: any) {
    console.log(e);
    console.log(e.prototype.stack);
  }
}
