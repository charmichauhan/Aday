import React, { Component } from 'react'
import {ModalContainer, ModalDialog} from 'react-modal-dialog';
import { Button } from 'semantic-ui-react';

export default class NotePopup extends Component {
  constructor(props) {
    super(props);
    this.state = {
      show: false
    };
    this.onClose = this.onClose.bind(this);
  }
  onClose() {
    this.setState({show: false});
  }
  render() {
		return (
      <div>
			   <div onClick={()=>this.setState({show: true})} style={{color: 'blue', cursor: 'pointer'}}>Show</div>
         {this.state.show &&
           <ModalContainer onClose={this.onClose}>
           <ModalDialog onClose={this.onClose}>
             <div style={{textAlign: 'center'}}>
               <p style={{wordWrap: 'break-word', width: 500}}>{this.props.note}</p> <br/>
               <Button type="Close" onClick={this.onClose}>Close</Button>
             </div>
           </ModalDialog>
           </ModalContainer>
         }
      </div>
		);
	}
}
