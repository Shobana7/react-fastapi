import React from "react";
import Modal from '@mui/material/Modal';
import CircularProgress from '@mui/material/CircularProgress';

export class ModalWait extends React.Component {
  constructor(props) {
    super(props);
    this.state = { open: true };
    this.handleClose = this.handleClose.bind(this);
  }
  handleClose(msg) {
    this.setState({ open: false });
  }
  render() {
    return <FullModal open={this.state.open} />;
  }
}

export default function FullModal(props) {

  return (
    <div>
      <Modal
        open={props.open}
        aria-labelledby="simple-modal-title"
        aria-describedby="simple-modal-description"
        style={{top: 0,
          left: 0}}
      >
        <div style={{position: "absolute",
    width: "100vw",
    height: "100vh",
    backgroundColor: "rgb(100,100,100, 0.5)",
    border: "none",
    boxShadow: 5,
    padding: 5}}>
          <p style={{textAlign:'center', color: "white"}} id="simple-modal-description">
            <h3>Please, wait...</h3>
            <CircularProgress />
          </p>
        </div>
      </Modal>
    </div>
  );
}
