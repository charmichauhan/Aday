import React, { Component } from 'react';
import { ModalContainer, ModalDialog } from 'react-modal-dialog';


export default class ShiftEdit extends Component {
	constructor(props) {
		super(props)
		this.state = {
			poppedOut: true,
			confirmPop: true
		}
	}
	onButtonClick = () => {
		console.log(this.state)
		this.setState({poppedOut: true})
	}

	onModalClose(){
		this.setState({poppedOut: false})
	}
	render() {
		const { poppedOut, confirmPop } = this.state
		return (
			<div>
				{
					poppedOut && 
					<ModalContainer
						className="aday-modal"
						onClose={this.onModalClose}
						dismissOnBackgroundClick={false}>

							{
								confirmPop && 
								<ModalDialog onClose={this.onModalClose}>
									<h3>Edit Shift</h3>
									<hr/>

									<hr/>

								</ModalDialog>
							}
					</ModalContainer>
				}
			</div>
		);
	}
}