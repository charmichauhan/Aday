import React, { Component } from 'react';
import ReactAvatarEditor from 'react-avatar-editor';
import RaisedButton from 'material-ui/RaisedButton';
import Slider from 'material-ui/Slider';
import Replay from 'material-ui/svg-icons/av/replay';
import IconButton from 'material-ui/IconButton';

import { colors } from '../../styles';
import './avatar-editor.css';

const initialState = {
	position: { x: 0.5, y: 0.5 },
	scale: 1,
	rotate: 0,
	width: 250,
	height: 250
};

const styles = {
	slider: {
		marginTop: 10,
		marginBottom: 20
	}
};

class AvatarEditor extends Component {

	constructor(props) {
		super(props);
		this.state = {
			...initialState,
			...props
		}
	}

	handleNewImage = (e) => {
		this.setState({ image: e.target.files[0] })
	};

	handleSave = () => {
		const img = this.editor.getImageScaledToCanvas().toDataURL();
		this.props.onSave(img);
	};

	handleScale = (e, value) => {
		const scale = parseFloat(value);
		this.setState({ scale, zoomSliderValue: value });
	};

	rotateLeft = (e) => {
		e.preventDefault();
		this.setState({ rotate: this.state.rotate - 90 });
	};

	rotateRight = (e) => {
		e.preventDefault();
		this.setState({	rotate: this.state.rotate + 90 });
	};

	logCallback = (e) => {
		console.log('callback', e)
	};

	setEditorRef = (editor) => {
		if (editor) this.editor = editor
	};

	handlePositionChange = position => {
		this.setState({ position });
	};

	render () {
		const { scale, width, height, position, rotate, border, image } = this.state;
		return (
			<div className="avatar-editor">
				<ReactAvatarEditor
					ref={this.setEditorRef}
					scale={parseFloat(scale)}
					width={width}
					height={height}
					position={position}
					border={border}
					onPositionChange={this.handlePositionChange}
					rotate={parseFloat(rotate)}
					onSave={this.handleSave}
					onLoadFailure={() => this.logCallback('onLoadFailed')}
					onLoadSuccess={() => this.logCallback('onLoadSuccess')}
					onImageReady={() => this.logCallback('onImageReady')}
					onImageLoad={() => this.logCallback('onImageLoad')}
					onDropFile={() => this.logCallback('onDropFile')}
					image={image}
				/>

				<div className="select-upload-setting">
					<RaisedButton
						backgroundColor={colors.primaryBlue}
						labelColor="#fafafa"
						className='upload-btn'
						containerElement='label'
						label='Select new image'>
						<input type='file' onChange={this.handleNewImage} />
					</RaisedButton>
					<div className="select-upload-wrapper">
						<span className="avatar-rotate-label mr10">Zoom:</span>
						<Slider
							min={1}
							max={2}
							step={0.01}
							sliderStyle={styles.slider}
							value={this.state.zoomSliderValue}
							onChange={this.handleScale}
						/>
					</div>
					<div className="select-upload-wrapper">
						<span className="avatar-rotate-label mr10">Rotate:</span>
						<div className="rotate-img-btn">
							<IconButton onClick={this.rotateLeft}>
								<Replay />
							</IconButton>
							<IconButton onClick={this.rotateRight}>
								<Replay className="right-btn"/>
							</IconButton>
						</div>
					</div>
					<div className="select-upload-savebtn">
						<RaisedButton
							backgroundColor={colors.primaryBlue}
							labelColor="#fafafa"
							label='Save'
							onClick={this.handleSave}>
						</RaisedButton>
					</div>
				</div>
			</div>
		)
	}
}

export default AvatarEditor;
