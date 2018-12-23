import React, { Component } from 'react';
import RoomAdd from './RoomAdd';
import RoomTable from './RoomTable';

export default class Room extends Component {
  constructor(props) {
    super(props);
    this.state = {
      lists: []
    }
  }

  addRoom = (e) => {
    const currentList = this.state.lists;

    currentList.push({
      roomNumber: e
    });

    this.setState({
      lists: currentList
    });
  }

  render() {
    return (
      <div className="row">
        <div className="col-sm">
          <RoomAdd onUpdate={this.addRoom}></RoomAdd>
          <RoomTable lists={this.state.lists}></RoomTable>
        </div>
      </div>
    );
  }
}
