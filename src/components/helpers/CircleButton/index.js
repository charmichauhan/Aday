import React, { Component } from 'react';
import { Image } from 'semantic-ui-react';

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
    color: '#ffffff'
  },
  green: {
    backgroundColor: '#00A863',
    color: '#ffffff'
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
    const {
      type = 'white',
      title = 'Title',
      handleClick = () => { },
      style = {},
      titleStyle = {
          lineHeight: 1.2,
          textAlign: 'center',
          display: 'flex',
          flexDirection:'row',
          justifyContent:'center',
          alignContent:'center'
      },
      image = false,
      imageSize = 'small',
      disabled
    } = this.props;
    const classes = ['btn', 'btn-circle', 'text-uppercase', 'inline-block'];
    const buttonStyles = {
      ...buttonStyle,
      ...style,
      ...buttonColors[type]
    };
    return (
      <div className="btn-circle-wrapper">
        <button style={buttonStyles} onClick={handleClick} className={classes.join(' ')}
                disabled={disabled}>
          {image && <Image src={image} className={[imageSize, 'img-icon'].join(' ')} />}
          <div style={titleStyle}><text className="innerCircle">{title}</text></div>
        </button>
      </div>
    );
  }
}
