import React, { Component } from 'react';
import adapter from 'webrtc-adapter';
import Ws from '@adonisjs/websocket-client'
import { isNullOrUndefined } from 'util';

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
    this.rtc_offers = [];
    this.rtc_ice = [];
    this.is_adding_ice_loc = false;
    this.is_adding_ice_rem = false;
    this.is_get_offer = false;
    this.is_get_answer = false;
    this.heartbeat_id = null;
    this.clientId = this.createRandomId();

    this.state = {
      client_id: this.clientId
    };
  }

  createRandomId() {
    return Math.ceil(Math.random() * 100000000).toString();
  }

  componentDidMount() {
    this.getWS()
    this.getMedia();
  }

  componentWillUnmount() {
    clearInterval(this.heartbeat_id);
  }

  wsGetAnswer = (data) => {
    if (data.length == 1 && !this.is_get_answer) {
      const first = data[0];
      const sdp = first.sdp;
      const answer = {
        type: 'answer',
        sdp
      };

      this.localPeerConnection.setRemoteDescription(answer);
      this.is_get_answer = true;
      //ready for communicate
      console.log('answer', answer);
    }
  }

  wsGetOffer = (data) => {
    // if we receive some offer
    // we need send back the answer over websocket

    if (data.length == 1 && !this.is_get_offer) {
      const first = data[0];
      const sdp = first.sdp;
      const offer = {
        type: 'offer',
        sdp: sdp
      };

      this.remotePeerConnection.setRemoteDescription(offer);
      this.setAnswer()
      this.is_get_offer = true;
      //get offer
      console.log('offer', offer);
    }
  }

  wsGetICE = (data) => {
    if (data.length > 0) {
      const ice_for_local = data.filter(value => value.type == 'ice_loc');
      const ice_for_remote = data.filter(value => value.type == 'ice_rem');

      this.setIceLocal(ice_for_local);
      this.setIceRemote(ice_for_remote);
    }
  }

  getWS = () => {
    const host = location.host;
    const fullpath = 'wss://' + host;
    const ws = Ws(fullpath);
    ws.connect();

    this.rtc = ws.subscribe('rtc')

    this.rtc.on('getanswer', this.wsGetAnswer);
    this.rtc.on('getoffer',  this.wsGetOffer);
    this.rtc.on('getice',    this.wsGetICE);
    this.rtc.on('error', (data) => {
      console.log(data);
    });

    this.heartbeat_id = setInterval(() => {
      const client_id = this.clientId;
      const room_id = this.props.roomId;
      const data = { client_id, room_id };

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
      await this.setOffer();
    } catch (e) {
      console.log(e);
    }
  }

  createPeer = () => {
    const servers = {
      iceServers: [
        {
          urls: "turn:128.199.238.145",  // A TURN server
          username: "titanrtc",
          credential: "titanrtc",
          credentialType: "password"
        }
      ]
    };

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
        offerToReceiveAudio: 1,
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
      await this.localPeerConnection.setLocalDescription(offer);

      this.sendSocket(offer, 'offer');
    } catch (e) {
      console.log(e);
    }
  }

  setIceLocal = async (data) => {
    if (this.is_adding_ice_loc || !this.is_get_answer) return;
    
    this.is_adding_ice_loc = true;

    for (var i = 0; i < data.length; i++) {
      const item = data[i];
      const result = this.rtc_ice.find((value) => value == item.id)

      if (isNullOrUndefined(result)) {
        try {
          const candidate = JSON.parse(item.sdp);
          const candidate_ice = new RTCIceCandidate(candidate);

          await this.localPeerConnection.addIceCandidate(candidate_ice);
          this.rtc_ice.push(item.id);
        } catch (e) {
          console.error(e);
        }
      }
    }

    this.is_adding_ice_loc = false;
  }

  setIceRemote = async (data) => {
    if (this.is_adding_ice_rem || !this.is_get_offer) return;
    
    this.is_adding_ice_rem = true;

    for (var i = 0; i < data.length; i++) {
      const item = data[i];
      const result = this.rtc_ice.find((value) => value == item.id)

      if (isNullOrUndefined(result)) {
        try {
          const candidate = JSON.parse(item.sdp);
          const candidate_ice = new RTCIceCandidate(candidate);

          await this.remotePeerConnection.addIceCandidate(candidate_ice);
          this.rtc_ice.push(item.id);
        } catch (e) {
          console.error(e)
        }
      }
    }

    this.is_adding_ice_rem = false;
  }

  sendSocket = (data, event) => {
    const data_copy = Object.assign({}, data);

    data_copy.client_id = this.clientId;
    data_copy.room_id = this.props.roomId;

    this.rtc.emit(event, data_copy);
  }

  sendIceCandidate = (candidate, tipe) => {
    const client_id = this.clientId;
    const room_id = this.props.roomId;
    const data = {
      client_id,
      room_id,
      candidate,
      tipe
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

      this.sendSocket(answer, 'answer');
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
      if (event.candidate !== null) {
        //await this.localPeerConnection.addIceCandidate(event.candidate);
        this.sendIceCandidate(event.candidate.toJSON(), 'ice_loc');
      }
    } catch (e) {
      console.log(e);
    }
  }

  onIceCandidateLocal = async (event) => {
    try {
      if (event.candidate !== null) {
        //await this.remotePeerConnection.addIceCandidate(event.candidate);
        this.sendIceCandidate(event.candidate.toJSON(), 'ice_rem');
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
    let styles = {
      width: '100%'
    };

    return (
      <div className="row">
        <div className="col-md-6">
          <video ref={this.localVideo} style={styles} width={640} height={480} autoPlay controls muted></video>
        </div>
        <div className="col-md-6">
          <video ref={this.remoteVideo} style={styles} width={640} height={480} autoPlay controls></video>
        </div>
      </div>
    );
  }
}