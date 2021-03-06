import React, { Component } from 'react';

export default class RoomRow extends Component {
  constructor(props) {
    super(props);
  }

  removeRoom = () => {
    const room_id = this.props.item.id;

    this.props.onRemove(room_id);
  }

  joinRoom = () => {
    const room_id = this.props.item.id;

    this.props.onJoin(room_id);
  }

  render() {
    const joinStyle = {
      marginLeft: '5px'
    };

    return (
      <tr>
        <td>{this.props.item.room_name}</td>
        <td>
          <button className="btn btn-danger" onClick={this.removeRoom}>Remove</button>
          <a className="btn btn-primary" style={joinStyle} href={this.props.item.joinurl}>Join</a>
        </td>
      </tr>
    );
  }
}
