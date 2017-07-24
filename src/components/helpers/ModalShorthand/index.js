import React, { Component } from 'react'
import { Button, Header, Icon, Modal } from 'semantic-ui-react'

const ModalHelper = (props) => {

	const handleClose = (e) => props.handleClose();

	return (
		<Modal
			trigger={props.trigger}
			open={props.open}
			header={props.header || 'Header to be added!'}
			content={props.content || 'Content message to be added here!'}
			actions={[
				{ key: 'no', content: 'No', color: 'red', triggerClose: true },
				{ key: 'yes', content: 'Yes', color: 'green', triggerClose: true },
			]}
		>
		</Modal>
	);
};

export default ModalHelper;