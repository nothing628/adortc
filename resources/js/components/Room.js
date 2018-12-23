import React, { Component } from 'react';
import RoomAdd from './RoomAdd';
import RoomTable from './RoomTable';
import Axios from 'axios';

export default class Room extends Component {
  constructor(props) {
    super(props);
    this.state = {
      lists: []
    }
  }

  refreshRoom = () => {
    const uri = this.props.urlApi;

    Axios.get(uri).then(response => {
      if (response.status == 200) {
        let data = response.data

        this.setState({
          lists: data
        });
      }
    });
  }

  componentDidMount() {
    this.refreshRoom();
  }

  addRoom = (e) => {
    const uri = this.props.urlApi;
    const newRoom = {
      room_name: e
    };

    Axios.post(uri, newRoom).then(response => {
      if (response.status == 200) {
        this.refreshRoom();
      }
    });
  }

  removeRoom = (e) => {
    const uri = this.props.urlApi;
    const uriDel = uri + "/" + e;

    Axios.delete(uriDel).then(response => {
      if (response.status == 200) {
        this.refreshRoom();
      }
    });
  }

  joinRoom = (e) => {
    console.log('join', e);
  }

  render() {
    return (
      <div className="row">
        <div className="col-sm">
          <RoomAdd onUpdate={this.addRoom}></RoomAdd>
          <RoomTable
          lists={this.state.lists}
          onRemove={this.removeRoom}
          onJoin={this.joinRoom}
          ></RoomTable>
        </div>
      </div>
    );
  }
}
