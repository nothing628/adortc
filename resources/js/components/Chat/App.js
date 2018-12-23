import React, { Component } from 'react';
import SIP from 'sip.js';

export default class ChatApp extends Component {
  constructor(props) {
    super(props);
  }

  sipSetup = () => {
    var config = {
      // Replace this IP address with your Asterisk IP address
      uri: '1060@178.128.97.225',
    
      // Replace this IP address with your Asterisk IP address,
      // and replace the port with your Asterisk port from the http.conf file
      ws_servers: 'wss://178.128.97.225:8088/ws',
    
      // Replace this with the username from your sip.conf file
      authorizationUser: '1060',
    
      // Replace this with the password from your sip.conf file
      password: 'password',
    };
    
    var ua = new SIP.UA(config);
    
    // Invite with audio only
    ua.invite('1061',{
      sessionDescriptionHandlerOptions: {
        constraints: {
          audio: true,
          video: true
        }
      }
    });
  }

  render() {
    return (
      <div className="row">
        <div className="col-sm">
          remote
        </div>
      </div>
    )
  }
}