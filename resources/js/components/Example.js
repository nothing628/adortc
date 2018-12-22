import React, { Component } from 'react';
import ReactDOM from 'react-dom';

export default class App extends Component {
    constructor(props) {
        super(props);
        this.localVideo = React.createRef();
        this.remoteVideo = React.createRef();
        this.localStream = null;
        this.pc1 = null;
        this.pc2 = null;
        this.handleStart = this.start.bind(this);
        this.handleCall = this.startcall.bind(this);
        this.handleHungup = this.starthangup.bind(this);
        this.handleStream = this.gotRemoteStream.bind(this);
        this.handleCreateOfferSuccess = this.onCreateOfferSuccess.bind(this);
        this.handleCreateAnswerSuccess = this.onCreateAnswerSuccess.bind(this);
        this.handleIceCandidate = this.onIceCandidate.bind(this);

        this.state = {
            isStart: false,
            isCall: true,
            isHangup: true,
            startTime: 0
        }
    }

    componentDidMount() {}
    componentWillUnmount() {}

    async start() {
        console.log('Requesting local stream');
        try {
            const localVideo = this.localVideo.current;
            const constraints = { video: true, audio: true };
            const stream = await navigator.mediaDevices.getUserMedia(constraints);
            console.log('Received local stream');
            
            localVideo.srcObject = stream;
            this.localStream = stream;
            this.setState({ isStart: true });
        } catch (e) {
            alert(`getUserMedia() error: ${e.name}`);
        }
    }

    gotRemoteStream(e) {
        const remoteVideo = this.remoteVideo.current;

        if (remoteVideo.srcObject !== e.streams[0]) {
            remoteVideo.srcObject = e.streams[0];
            console.log('pc2 received remote stream');
        }
    }

    onCreateSessionDescriptionError(error) {
        console.log(`Failed to create session description: ${error.toString()}`);
    }

    async onCreateAnswerSuccess(desc) {
        console.log(`Answer from pc2:\n${desc.sdp}`);
        console.log('pc2 setLocalDescription start');
        try {
            await this.pc2.setLocalDescription(desc);
        } catch (e) {
        }
        console.log('pc1 setRemoteDescription start');
        try {
            await this.pc1.setRemoteDescription(desc);
        } catch (e) {
        }
    }

    async onCreateOfferSuccess(desc) {
        console.log(`Offer from pc1\n${desc.sdp}`);
        console.log('pc1 setLocalDescription start');
        try {
            await this.pc1.setLocalDescription(desc);
        } catch (error) {
            console.log(`Failed to set session description: ${error.toString()}`);
        }
      
        console.log('pc2 setRemoteDescription start');
        try {
            await this.pc2.setRemoteDescription(desc);
        } catch (error) {
            console.log(`Failed to set session description: ${error.toString()}`);
        }
      
        console.log('pc2 createAnswer start');
        // Since the 'remote' side has no media stream we need
        // to pass in the right constraints in order for it to
        // accept the incoming offer of audio and video.
        try {
            const answer = await this.pc2.createAnswer();
            await this.handleCreateAnswerSuccess(answer);
        } catch (e) {
            this.onCreateSessionDescriptionError(e);
        }
    }

    getOtherPc(pc) {
        return (pc === this.pc1) ? this.pc2 : this.alertpc1;
    }

    async onIceCandidate(pc, event) {
        try {
            await (this.getOtherPc(pc).addIceCandidate(event.candidate));
        } catch (e) {
        }
    }

    async startcall() {
        this.setState({
            isCall: false,
            isHangup: true,
            startTime: window.performance.now()
        });
        
        console.log('Starting call');
        const videoTracks = this.localStream.getVideoTracks();
        const audioTracks = this.localStream.getAudioTracks();
        if (videoTracks.length > 0) {
          console.log(`Using video device: ${videoTracks[0].label}`);
        }
        if (audioTracks.length > 0) {
          console.log(`Using audio device: ${audioTracks[0].label}`);
        }
        
        const configuration = {sdpSemantics: 'plan-b'};
        this.pc1 = new RTCPeerConnection(configuration);
        this.pc2 = new RTCPeerConnection(configuration);
        console.log('RTCPeerConnection configuration:', configuration);
        console.log('Created local peer connection object pc1');
        console.log('Created remote peer connection object pc2');
        this.pc1.addEventListener('icecandidate', e => this.handleIceCandidate(this.pc1, e));
        this.pc2.addEventListener('icecandidate', e => this.handleIceCandidate(this.pc2, e));
        this.pc2.addEventListener('track', this.handleStream);
      
        this.localStream.getTracks().forEach(track => this.pc1.addTrack(track, this.localStream));
        console.log('Added local stream to pc1');
      
        try {
            console.log('pc1 createOffer start');
            const offerOptions = {
                offerToReceiveAudio: 1,
                offerToReceiveVideo: 1
            };
            const offer = await this.pc1.createOffer(offerOptions);
            await this.handleCreateOfferSuccess(offer);
        } catch (e) {
            this.onCreateSessionDescriptionError(e);
        }
    }

    starthangup() {
        console.log('Ending call');
        this.pc1.close();
        this.pc2.close();
        this.pc1 = null;
        this.pc2 = null;
        
        this.setState({
            isCall: true,
            isHangup: false
        });
    }

    render() {
        return (
            <div className="container">
                <div className="row justify-content-center">
                    <div className="col-md-8">
                        <div className="card">
                            <div className="card-header">Example kurang Component</div>

                            <div className="card-body">
                                <video autoPlay={true} ref={ this.localVideo }></video>
                                <video autoPlay={true} ref={ this.remoteVideo }></video>
                            </div>
                        </div>
                    </div>
                    <div className="col-md-4">
                        <button onClick={this.handleStart}>Start</button>
                        <button onClick={this.handleCall}>Call</button>
                        <button onClick={this.handleHungup}>Hung Up</button>
                    </div>
                </div>
            </div>
        );
    }
}

if (document.getElementById('app')) {
    ReactDOM.render(<App />, document.getElementById('app'));
}
