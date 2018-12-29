import React, { Component } from 'react';
import adapter from 'webrtc-adapter';
import Ws from '@adonisjs/websocket-client'

export default class ChatApp extends Component {
  constructor(props) {
    super(props);

    this.localPeerConnection = null;
    this.localChannel = null;
    this.localStream = null;
    this.localVideo = React.createRef();

    this.remotePeerConnection = null;
    this.remoteChannel = null;
    this.remoteStream = null;
    this.remoteVideo = React.createRef();

    this.rtc = null;
    this.heartbeat_id = null;
    this.clientId = this.createRandomId();
  }

  createRandomId() {
    return Math.ceil(Math.random() * 100000000);
  }

  componentDidMount() {
    this.getWS()
    this.getMedia();
  }

  wsGetOffer = (data) => {
    // if we receive some offer
    // we need send back the answer over websocket
    console.log(data);
  }

  getWS = () => {
    const host = location.host;
    const fullpath = 'ws://' + host;
    const ws = Ws(fullpath);
    ws.connect();

    this.rtc = ws.subscribe('rtc')

    this.rtc.on('getoffer', this.wsGetOffer);
    this.rtc.on('message', (data) => {
      console.log(data);
    });
    this.rtc.on('error', (data) => {
      console.log(data);
    });

    this.rtc.emit('test');

    this.heartbeat_id = setInterval(() => {
      const client_id = this.clientId;
      const data = { client_id };
      this.rtc.emit('heartbeat', data);
    }, 2000);
  }

  getMedia = async () => {
    // delete the local stream and video if already exists
    if (this.localStream) {
      this.localVideo.srcObject = null;
      this.localStream.getTracks().forEach(track => track.stop());
    }

    const constraints = {
      audio: false,
      video: true
    };
    
    try {
      const userMedia = await navigator.mediaDevices.getUserMedia(constraints);
      // get media and
      // put stream into react data
      this.localVideo.current.srcObject = userMedia;
      this.localStream = userMedia;
      this.createPeer();
      await this.setOffer();
    } catch (e) {
      console.log(e);
    }
  }

  createPeer = () => {
    const servers = null;

    this.localPeerConnection = new RTCPeerConnection(servers);
    this.localPeerConnection.onicecandidate = this.onIceCandidateLocal;
    this.localChannel = this.localPeerConnection.createDataChannel('sendDataChannel', {ordered: true});
    this.localChannel.onopen = this.onSendChannelStateChange;
    this.localChannel.onclose = this.onSendChannelStateChange;
    this.localChannel.onerror = this.onSendChannelStateChange;

    this.remotePeerConnection = new RTCPeerConnection(servers);
    this.remotePeerConnection.onicecandidate = this.onIceCandidateRemote;
    this.remotePeerConnection.ontrack = this.onGotRemoteStream;
    this.remotePeerConnection.ondatachannel = this.onReceiveChannel;

    this.localStream.getTracks()
      .forEach(track => this.localPeerConnection.addTrack(track, this.localStream));
  }

  createOffer = async () => {
    try {
      const offerOptions = {
        offerToReceiveAudio: 0,
        offerToReceiveVideo: 1
      };
      const offer = await this.localPeerConnection.createOffer(offerOptions);

      return offer.sdp;
    } catch (e) {
      throw e;
    }
  }

  setOffer = async () => {
    const sdp = await this.createOffer();
    const offer = {
      type: 'offer',
      sdp: sdp
    };

    try {
      // eslint-disable-next-line no-unused-vars
      const ignore = await this.localPeerConnection.setLocalDescription(offer);

      this.sendOffer(offer);
    } catch (e) {
      console.log(e);
    }
  }

  sendOffer = (offer) => {
    const offer_data = Object.assign({}, offer);

    offer_data.client_id = this.clientId;
    offer_data.room_id = this.props.roomId;

    this.rtc.emit('offer', offer_data);
  }

  sendIceCandidate = (candidate) => {
    const client_id = this.clientId;
    const room_id = this.props.roomId;
    const data = {
      client_id,
      room_id,
      candidate
    };

    this.rtc.emit('icecandidate', data);
  }

  createAnswer = async () => {
    // Since the 'remote' side has no media stream we need
    // to pass in the right constraints in order for it to
    // accept the incoming offer of audio and video.
    try {
      const answer = await this.remotePeerConnection.createAnswer();

      return answer.sdp;
    } catch (e) {
      throw e;
    }
  }

  setAnswer = async () => {
    const sdp = await this.createAnswer();
    const answer = {
      type: 'answer',
      sdp: sdp
    };

    try {
      // eslint-disable-next-line no-unused-vars
      const ignore = await this.remotePeerConnection.setLocalDescription(answer);
    } catch (e) {
      console.log(e);
    }

    try {
      // eslint-disable-next-line no-unused-vars
      const ignore = await this.localPeerConnection.setRemoteDescription(answer);
    } catch (e) {
      console.log(e);
    }
  }

  hangup = () => {
    this.remoteVideo.current.srcObject = null;
    this.localStream.getTracks().forEach(track => track.stop());
    this.localChannel.close();

    if (this.remoteChannel) {
      this.remoteChannel.close();
    }

    this.localPeerConnection.close();
    this.localPeerConnection = null;
    this.remotePeerConnection.close();
    this.remotePeerConnection = null;
  }

  onSendChannelStateChange = () => {
    const readyState = this.localChannel.readyState;
    if (readyState === 'open') {
      this.sendDataLoop = setInterval(this.sendData, 1000);
    } else {
      clearInterval(this.sendDataLoop);
    }
  }

  onIceCandidateRemote = async(event) => {
    try {
      // eslint-disable-next-line no-unused-vars
      const ignore = await this.localPeerConnection.addIceCandidate(event.candidate);
    } catch (e) {
      console.log(e);
    }
  }

  onIceCandidateLocal = async (event) => {
    try {
      // eslint-disable-next-line no-unused-vars
      //TODO: send ice candidate over rtc
      if (event.candidate !== null) {
        this.sendIceCandidate(event.candidate.toJSON());
      }
    } catch (e) {
      console.log(e);
    }
  }

  onGotRemoteStream = (e) => {
    const remoteVideo = this.remoteVideo.current;

    if (remoteVideo.srcObject !== e.streams[0]) {
      remoteVideo.srcObject = e.streams[0];
    }
  }

  onReceiveChannel = (event) => {
    this.receiveChannel = event.channel;
    this.receiveChannel.onmessage = (event) => {};
    this.receiveChannel.onopen = () => {};
    this.receiveChannel.onclose = () => {};
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
          <video ref={this.localVideo} width={320} height={240} autoPlay controls></video>
          <button className="btn btn-primary">Call</button>
        </div>
        <div className="col-sm">
          <video ref={this.remoteVideo} width={320} height={240} autoPlay controls></video>
        </div>
      </div>
    );
  }
}