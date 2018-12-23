import React, { Component } from 'react';
import RoomRow from './RoomRow';

export default class RoomTable extends Component {
  constructor(props) {
    super(props);
  }

  handleRemove = (room_id) => {
    this.props.onRemove(room_id);
  }

  handleJoin = (room_id) => {
    this.props.onJoin(room_id);
  }

  render() {
    const listItems = this.props.lists.map((item) => {
      return (<RoomRow
        item={item}
        key={item.id}
        onRemove={this.handleRemove}
        onJoin={this.handleJoin}></RoomRow>
      );
    });

    return (
      <table className="table table-dark">
        <thead>
          <tr>
            <th>Room No</th>
            <th>Action</th>
          </tr>
        </thead>
        <tbody>{listItems}</tbody>
      </table>
    );
  }
}
