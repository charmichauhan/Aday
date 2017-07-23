import React, { Component } from 'react';
import { ModalContainer, ModalDialog } from 'react-modal-dialog'
import { Button } from 'semantic-ui-react'

export default class DeleteShift extends Component {
	constructor(props) {
		super(props)
		this.state = {
			poppedOut: false,
			confirmPop: false
		}
	}
	onModalClose(){
		this.sestState({poppedOut: false})
	}
	render() {
		const { poppedOut, confirmPop } = this.state
		console.log(this.state)
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
									<div>
										<h1>Delete Shift</h1>
										<hr/>
										<p>Are you sure you want delete this shift?</p>
										<hr/>
										<Button
											>
											Cancel
										</Button>
										<Button
											primary
											>
											Okay
										</Button>
									</div>
								</ModalDialog>
							}
					</ModalContainer>
				}
			</div>
		);
	}
}
