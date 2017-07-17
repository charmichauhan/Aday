import React, { Component } from 'react';

const buttonColors = {
	white: {
		backgroundColor: '#ffffff',
		color: '#333'
	},
	blue: {
		backgroundColor: '#0022A1',
		color: '#ffffff'
	}
};

const wrapperStyle = {
	display: 'inline-block'
};

const buttonStyle = {
	height: 130,
	width: 130,
	backgroundColor: '#ffffff',
	borderRadius: '50%',
	color: '#333',
	fontWeight: 600,
	boxShadow: '0 -4px 10px 0 rgba(0,0,0,0.5), 0 4px 10px 0 rgba(1,1,1,0.5)',
	marginRight: 10
};

export default class CircleButton extends Component {
	render() {
		const { type = 'white', title = 'Title', handleClick = () => {}, textColor = 'black' } = this.props;
		const classes = ['btn', 'text-uppercase', 'inline-block'];
		const buttonStyles = {
			...buttonStyle,
			...buttonColors[type]
		};
		return (
			<div style={wrapperStyle}>
				<button style={buttonStyles} onClick={handleClick} className={classes.join(' ')}>{title}</button>
			</div>
		);
	}
}
