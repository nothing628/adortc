import React, { Component } from 'react';
import adapter from 'webrtc-adapter';

export default class ChatApp extends Component {
  constructor(props) {
    super(props);

    this.localPeerConnection = null;
    this.localChannel = null;
    this.localStream = null;
    this.localVideo = React.createRef();
  }

  componentDidMount() {
    this.getMedia();
  }

  getMedia = async () => {
    // delete the local stream and video if already exists
    if (this.localStream) {
      this.localVideo.srcObject = null;
      this.localStream.getTracks().forEach(track => track.stop());
    }

    const constraints = {
      audio: true,
      video: true
    };
    
    try {
      const userMedia = await navigator.mediaDevices.getUserMedia(constraints);
      // get media and
      // put stream into react data
      this.localVideo.current.srcObject = userMedia;
      this.localStream = userMedia;
      this.createPeer();
    } catch (e) {
      console.log('navigator.getUserMedia error: ', e);
    }
  }

  createPeer = () => {
    console.log('Starting call');
    // const videoTracks = this.localStream.getVideoTracks();
    // const audioTracks = this.localStream.getAudioTracks();

    // if (videoTracks.length > 0) {
    //   console.log(`Using video device: ${videoTracks[0].label}`);
    // }

    // if (audioTracks.length > 0) {
    //   console.log(`Using audio device: ${audioTracks[0].label}`);
    // }
    
    const servers = null;

    this.localPeerConnection = new RTCPeerConnection(servers);
    console.log('Created local peer connection object localPeerConnection');
    this.localPeerConnection.onicecandidate = e => onIceCandidate(this.localPeerConnection, e);
    this.localChannel = this.localPeerConnection.createDataChannel('sendDataChannel', {ordered: true});
    this.localChannel.onopen = this.onSendChannelStateChange;
    this.localChannel.onclose = this.onSendChannelStateChange;
    this.localChannel.onerror = this.onSendChannelStateChange;

    this.localStream.getTracks()
      .forEach(track => this.localPeerConnection.addTrack(track, this.localStream));
    console.log('Adding Local Stream to peer connection');
  }

  onSendChannelStateChange = () => {
    const readyState = this.localChannel.readyState;
    console.log(`Send channel state is: ${readyState}`);
    if (readyState === 'open') {
      this.sendDataLoop = setInterval(this.sendData, 1000);
    } else {
      clearInterval(this.sendDataLoop);
    }
  }

  sendData = () => {
    // Like a pinging the receiver
    const readyState = this.localChannel.readyState;

    if (readyState === 'open') {
      this.localChannel.send(Math.random() * 1000);
    }
  }

  render() {
    return (
      <div className="row">
        <div className="col-sm">
          <video ref={this.localVideo} width={320} height={240} autoPlay></video>
        </div>
        <div className="col-sm">
          remote
        </div>
      </div>
    )
  }
}