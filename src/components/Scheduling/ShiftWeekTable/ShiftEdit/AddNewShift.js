import React, { Component } from 'react';
import { ModalContainer, ModalDialog } from 'react-modal-dialog';
import NewShiftForm from './NewShiftFormContainer'

export default class AddNewShift extends Component {
	constructor(props) {
		super(props)
		this.state = {
			poppedOut: true,
			confirmPop: true
		}
	}
	onDayButtonClick = () => this.setState({poppedOut: true})

	onModalClose = () => this.setState({poppedOut: false})

	render() {
		return (
			<div>
				{
					this.state.poppedOut && 
					<ModalContainer
						className="aday-modal"
						onClose={this.onModalClose}
						dismissOnBackgroundClick={false}>

							{
								this.state.confirmPop && 
								<ModalDialog onClose={this.onModalClose}>
									<h4>Add Shift</h4>
									<hr/>

									<div>
										<NewShiftForm/>
									</div>
								</ModalDialog>
							}
					</ModalContainer>
				}
			</div>
		);
	}
}
