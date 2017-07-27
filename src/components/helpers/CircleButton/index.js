import React, { Component } from 'react';
import './circle-button.css';
const buttonColors = {
	white: {
		backgroundColor: '#ffffff',
		color: '#4A4A4A'
	},
	blue: {
		backgroundColor: '#0022A1',
		color: '#ffffff'
	},
	red: {
		backgroundColor: '#e33821',
		color:"#ffffff"
	}
};

const buttonStyle = {
	height: 130,
	width: 130,
	backgroundColor: '#ffffff',
	borderRadius: '50%',
	color: '#333',
	fontSize: 16,
	whiteSpace: 'normal',
	boxShadow: '0 -4px 10px 0 rgba(0,0,0,0.5), 0 4px 10px 0 rgba(1,1,1,0.5)',
	marginRight: 10,
	outline: 'none'
};

export default class CircleButton extends Component {
	render() {
		const { type = 'white', title = 'Title', handleClick = () => {}, style = {} , image = false, wrapperClassName = ''} = this.props;
		const classes = ['btn', 'btn-circle', 'text-uppercase', 'inline-block'];
		const wrapperClasses = ['btn-circle-wrapper' , wrapperClassName];
		const buttonStyles = {
			...buttonStyle,
			...style,
			...buttonColors[type]
		};
		return (
			<div className={wrapperClasses.join(' ')}>
				<button style={buttonStyles} onClick={handleClick} className={classes.join(' ')}>{image && <img src="/images/modal/close.png"/>}{title}</button>
			</div>
		);
	}
}
