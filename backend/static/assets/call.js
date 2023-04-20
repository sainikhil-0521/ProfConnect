"use strict";

const baseURL = "/";

let localVideo = document.querySelector("#localVideo");
let remoteVideo = document.querySelector("#remoteVideo");

let otherUser;
let remoteRTCMessage;

let iceCandidatesFromCaller = [];
let peerConnection;
let remoteStream;
let localStream;

let callInProgress = false;

var ele = document.getElementById("leave-meeting");
ele.addEventListener("click", reject);

//event from html
function call() {
  let userToCall = document.getElementById("callName").value;
  otherUser = userToCall;

  beReady().then((bool) => {
    processCall(userToCall);
  });
}

//event from html
function answer() {
  //do the event firing

  beReady().then((bool) => {
    processAccept();
  });

  document.getElementById("answer").style.display = "none";
}
function reject() {
  //do the event firing

  processReject();

  document.getElementById("answer").style.display = "none";
  document.getElementById("call").style.display = "block";
  document.getElementById("main22").style.display = "none";
  document.getElementById("videos").style.display = "none";
  document.getElementById("callName").value = "";
  //document.getElementById("otherUserNameC").innerHTML = otherUser;
  document.getElementById("inCall").style.display = "none";
}

let pcConfig = {
  iceServers: [
    // { "url": "stun:stun.jap.bloggernepal.com:5349" },
    // {
    //     "url": "turn:turn.jap.bloggernepal.com:5349",
    //     "username": "guest",
    //     "credential": "somepassword"
    // }
    { url: "stun:stun01.sipphone.com" },
    { url: "stun:stun.ekiga.net" },
    { url: "stun:stun.fwdnet.net" },
    { url: "stun:stun.ideasip.com" },
    { url: "stun:stun.iptel.org" },
    { url: "stun:stun.rixtelecom.se" },
    { url: "stun:stun.schlund.de" },
    { url: "stun:stun.l.google.com:19302" },
    { url: "stun:stun1.l.google.com:19302" },
    { url: "stun:stun2.l.google.com:19302" },
    { url: "stun:stun3.l.google.com:19302" },
    { url: "stun:stun4.l.google.com:19302" },
    { url: "stun:stunserver.org" },
    { url: "stun:stun.softjoys.com" },
    { url: "stun:stun.voiparound.com" },
    { url: "stun:stun.voipbuster.com" },
    { url: "stun:stun.voipstunt.com" },
    { url: "stun:stun.voxgratia.org" },
    { url: "stun:stun.xten.com" },
    {
      url: "turn:numb.viagenie.ca",
      credential: "muazkh",
      username: "webrtc@live.com",
    },
    {
      url: "turn:192.158.29.39:3478?transport=udp",
      credential: "JZEOEt2V3Qb0y27GRntt2u2PAYA=",
      username: "28224511:1379330808",
    },
    {
      url: "turn:192.158.29.39:3478?transport=tcp",
      credential: "JZEOEt2V3Qb0y27GRntt2u2PAYA=",
      username: "28224511:1379330808",
    },
  ],
};

// Set up audio and video regardless of what devices are present.
let sdpConstraints = {
  offerToReceiveAudio: true,
  offerToReceiveVideo: true,
};

/////////////////////////////////////////////

let socket;
function connectSocket() {
  socket = io.connect(baseURL, {
    query: {
      name: myName,
    },
  });

  socket.on("newCall", (data) => {
    //when other called you
    console.log(data);
    //show answer button

    otherUser = data.caller;

    remoteRTCMessage = data.rtcMessage;

    // document.getElementById("profileImageA").src = baseURL + callerProfile.image;
    document.getElementById("callerName").innerHTML = otherUser;
    document.getElementById("call").style.display = "none";
    document.getElementById("answer").style.display = "block";
  });

  socket.on("callAnswered", (data) => {
    //when other accept our call
    remoteRTCMessage = data.rtcMessage;
    peerConnection.setRemoteDescription(
      new RTCSessionDescription(remoteRTCMessage)
    );

    document.getElementById("calling").style.display = "none";

    console.log("Call Started. They Answered");
    // console.log(pc);

    callProgress();
  });
  socket.on("callRejected", (data) => {
    //when other reject our call
    //remoteRTCMessage = data.rtcMessage

    document.getElementById("calling").style.display = "none";
    document.getElementById("main22").style.display = "none";
    document.getElementById("videos").style.display = "none";
    // document.getElementById("otherUserNameC").innerHTML = otherUser;
    document.getElementById("inCall").style.display = "none";
    let x = document.getElementById("callName").value;
    alert(x + " rejected/ended call");
    document.getElementById("call").style.display = "block";
    document.getElementById("callName").value = "";
    console.log("Call Started, Rejected/ended");
    // console.log(pc);
  });

  socket.on("ICEcandidate", (data) => {
    // console.log(data);
    console.log("GOT ICE candidate");

    let message = data.rtcMessage;

    let candidate = new RTCIceCandidate({
      sdpMLineIndex: message.label,
      candidate: message.candidate,
    });

    if (peerConnection) {
      console.log("ICE candidate Added");
      peerConnection.addIceCandidate(candidate);
    } else {
      console.log("ICE candidate Pushed");
      iceCandidatesFromCaller.push(candidate);
    }
  });
}

/**
 *
 * @param {Object} data
 * @param {number} data.name - the name of the user to call
 * @param {Object} data.rtcMessage - the rtc create offer object
 */
function sendCall(data) {
  //to send a call
  console.log("Send Call");
  socket.emit("call", data);

  document.getElementById("call").style.display = "none";
  // document.getElementById("profileImageCA").src = baseURL + otherUserProfile.image;
  document.getElementById("otherUserNameCA").innerHTML = otherUser;
  document.getElementById("calling").style.display = "block";
}

/**
 *
 * @param {Object} data
 * @param {number} data.caller - the caller name
 * @param {Object} data.rtcMessage - answer rtc sessionDescription object
 */
function answerCall(data) {
  //to answer a call
  socket.emit("answerCall", data);
  callProgress();
}
function rejectCall(data) {
  //to answer a call
  socket.emit("rejectCall", data);
}

/**
 *
 * @param {Object} data
 * @param {number} data.user - the other user //either callee or caller
 * @param {Object} data.rtcMessage - iceCandidate data
 */
function sendICEcandidate(data) {
  //send only if we have caller, else no need to
  console.log("Send ICE candidate");
  socket.emit("ICEcandidate", data);
}
function beReady() {
  return navigator.mediaDevices
    .getUserMedia({
      audio: true,
      video: true,
    })
    .then((stream) => {
      localStream = stream;
      localVideo.srcObject = stream;

      return createConnectionAndAddStream();
    })
    .catch(function (e) {
      alert("getUserMedia() error: " + e.name);
    });
}

function createConnectionAndAddStream() {
  createPeerConnection();
  peerConnection.addStream(localStream);
  return true;
}

function processCall(userName) {
  peerConnection.createOffer(
    (sessionDescription) => {
      peerConnection.setLocalDescription(sessionDescription);
      sendCall({
        name: userName,
        rtcMessage: sessionDescription,
      });
    },
    (error) => {
      console.log("Error");
    }
  );
}

function processAccept() {
  peerConnection.setRemoteDescription(
    new RTCSessionDescription(remoteRTCMessage)
  );
  peerConnection.createAnswer(
    (sessionDescription) => {
      peerConnection.setLocalDescription(sessionDescription);

      if (iceCandidatesFromCaller.length > 0) {
        //I am having issues with call not being processed in real world (internet, not local)
        //so I will push iceCandidates I received after the call arrived, push it and, once we accept
        //add it as ice candidate
        //if the offer rtc message contains all thes ICE candidates we can ingore this.
        for (let i = 0; i < iceCandidatesFromCaller.length; i++) {
          //
          let candidate = iceCandidatesFromCaller[i];
          console.log("ICE candidate Added From queue");
          try {
            peerConnection
              .addIceCandidate(candidate)
              .then((done) => {
                console.log(done);
              })
              .catch((error) => {
                console.log(error);
              });
          } catch (error) {
            console.log(error);
          }
        }
        iceCandidatesFromCaller = [];
        console.log("ICE candidate queue cleared");
      } else {
        console.log("NO Ice candidate in queue");
      }

      answerCall({
        caller: otherUser,
        rtcMessage: sessionDescription,
      });
    },
    (error) => {
      console.log("Error");
    }
  );
}
function processReject() {
  rejectCall({
    caller: otherUser,
    rtcMessage: "call rejected/ended",
  });
}

/////////////////////////////////////////////////////////

function createPeerConnection() {
  try {
    peerConnection = new RTCPeerConnection(pcConfig);
    // peerConnection = new RTCPeerConnection();
    peerConnection.onicecandidate = handleIceCandidate;
    peerConnection.onaddstream = handleRemoteStreamAdded;
    peerConnection.onremovestream = handleRemoteStreamRemoved;
    console.log("Created RTCPeerConnnection");
    return;
  } catch (e) {
    console.log("Failed to create PeerConnection, exception: " + e.message);
    alert("Cannot create RTCPeerConnection object.");
    return;
  }
}

function handleIceCandidate(event) {
  // console.log('icecandidate event: ', event);
  if (event.candidate) {
    console.log("Local ICE candidate");
    // console.log(event.candidate.candidate);

    sendICEcandidate({
      user: otherUser,
      rtcMessage: {
        label: event.candidate.sdpMLineIndex,
        id: event.candidate.sdpMid,
        candidate: event.candidate.candidate,
      },
    });
  } else {
    console.log("End of candidates.");
    // window.open("../index.html","_self")
  }
}

function handleRemoteStreamAdded(event) {
  console.log("Remote stream added.");
  remoteStream = event.stream;
  remoteVideo.srcObject = remoteStream;
}

function handleRemoteStreamRemoved(event) {
  console.log("Remote stream removed. Event: ", event);
  remoteVideo.srcObject = null;
  localVideo.srcObject = null;
}

window.onbeforeunload = function () {
  if (callInProgress) {
    stop();
  }
};

function stop() {
  localStream.getTracks().forEach((track) => track.stop());
  callInProgress = false;
  peerConnection.close();
  peerConnection = null;
  document.getElementById("call").style.display = "block";
  document.getElementById("answer").style.display = "none";
  document.getElementById("inCall").style.display = "none";
  document.getElementById("calling").style.display = "none";
  document.getElementById("endVideoButton").style.display = "none";
  otherUser = null;
}

function callProgress() {
  document.getElementById("main22").style.display = "block";
  document.getElementById("videos").style.display = "block";
  document.getElementById("otherUserNameC").innerHTML = otherUser;
  document.getElementById("inCall").style.display = "block";

  callInProgress = true;
}

//------------------start of added fields---------->>

const playStop = () => {
  let enabled = localStream.getVideoTracks()[0].enabled;
  if (enabled) {
    localStream.getVideoTracks()[0].enabled = false;
    setPlayVideo();
  } else {
    setStopVideo();
    localStream.getVideoTracks()[0].enabled = true;
  }
};

const muteUnmute = () => {
  const enabled = localStream.getAudioTracks()[0].enabled;
  if (enabled) {
    localStream.getAudioTracks()[0].enabled = false;
    setUnmuteButton();
  } else {
    setMuteButton();
    localStream.getAudioTracks()[0].enabled = true;
  }
};

const setPlayVideo = () => {
  const html = `<i class="unmute fa fa-pause-circle"></i>
    <span class="unmute">Resume Video</span>`;
  document.getElementById("playPauseVideo").innerHTML = html;
};

const setStopVideo = () => {
  const html = `<i class=" fa fa-video-camera"></i>
    <span class="">Pause Video</span>`;
  document.getElementById("playPauseVideo").innerHTML = html;
};

const setUnmuteButton = () => {
  const html = `<i class="unmute fa fa-microphone-slash"></i>
    <span class="unmute">Unmute</span>`;
  document.getElementById("muteButton").innerHTML = html;
};
const setMuteButton = () => {
  const html = `<i class="fa fa-microphone"></i>
    <span>Mute</span>`;
  document.getElementById("muteButton").innerHTML = html;
};
