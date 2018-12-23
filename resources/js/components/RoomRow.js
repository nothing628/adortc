import React, { Component } from 'react';

export default class RoomRow extends Component {
  constructor(props) {
    super(props);
  }

  render() {
    return (
      <tr>
        <td>{this.props.item.roomNumber}</td>
        <td>
          <button className="btn">Remove</button>
          <button className="btn">Join</button>
        </td>
      </tr>
    );
  }
}
