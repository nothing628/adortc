import React, { Component } from 'react';
import RoomRow from './RoomRow';

export default class RoomTable extends Component {
  constructor(props) {
    super(props);
  }

  render() {
    const listItems = this.props.lists.map((item) =>
      <RoomRow item={item}></RoomRow>
    );

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
