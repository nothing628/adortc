import React, { Component } from 'react';

export default class RoomAdd extends Component {
  constructor(props) {
    super(props);
    this.inp = React.createRef();
    this.state = {
      roomNumber: ''
    }
  }

  addRoom = (e) => {
    this.props.onUpdate(this.state.roomNumber);
    this.setState({
      roomNumber: ''
    });
  }

  inputChange = (e) => {
    const input = this.inp.current;
    const val = input.value;

    this.setState({
      roomNumber: val
    });
  }

  render() {
    return (
      <div className="form">
        <button onClick={this.addRoom} className="btn">Add Room</button>
        <input
          type="text"
          className="form-control"
          ref={this.inp}
          value={this.state.roomNumber}
          onChange={this.inputChange}></input>
      </div>
    )
  }
}