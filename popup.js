var recorder;
var audioChunks = [];

chrome.runtime.onMessage.addListener(function (message) {
  if (message.type === "start_record") {
    // Code to control the button in popup.html
    document.getElementById("captureBtn").click();
  }
  if (message.type === "stop_record") {
    // Code to control the button in popup.html
    document.getElementById("stopBtn").click();
  }
});

document.getElementById("captureBtn").addEventListener("click", function () {
  console.log("click");
  chrome.tabCapture.capture({ audio: true, video: false }, function (stream) {
    if (stream) {
      console.log("Capture started", stream);
      // You can now use the stream
    } else {
      console.log("Error capturing tab");
    }
    recorder = new MediaRecorder(stream);
    recorder.ondataavailable = (event) => audioChunks.push(event.data);
    recorder.start();
  });
});

document.getElementById("stopBtn").addEventListener("click", function () {
  recorder.stop();
  recorder.onstop = () => {
    const audioBlob = new Blob(audioChunks, { type: "audio/wav" });
    const audioUrl = URL.createObjectURL(audioBlob);
    download(audioUrl, "tab-recording.wav");
    audioChunks = [];
  };
});

function download(url, filename) {
  const a = document.createElement("a");
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
}
