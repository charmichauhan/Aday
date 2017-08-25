import React, { Component } from 'react';
import Dialog from 'material-ui/Dialog';
import IconButton from 'material-ui/IconButton';
import { Image } from 'semantic-ui-react';

import InfoModalComponent from './InfoModal';
import CircleButton from '../CircleButton';
import './modal.css';

const style = {
  titleStyle: {
    paddingLeft: '0',
    paddingRight: '0',
    borderBottom: '1px solid #F5F5F5'
  },
  actionsContainerStyle: {
    textAlign: 'center',
    padding: '0'
  },
  contentStyle: {
    width: 600,
    height: 333,
    borderRadius: 6
  }
};

export default class Modal extends Component {
  constructor(props) {
    super(props);
    this.state = {
      isOpen: props.isOpen
    }
  }

  componentWillReceiveProps(nextProps) {
    if (this.state.isOpen !== nextProps.isOpen) this.setState({ isOpen: nextProps.isOpen });
  };

  render() {
    let { title, message, action, closeAction, handleClickOutside } = this.props;
    const actions = action.map((action, index) =>
      (<CircleButton key={index} type={action.type} title={action.title} handleClick={action.handleClick}
                     image={action.image} />)
    );
    const titleMessage = (<div>
      <h5 className="confirm-popup">{title}</h5>
      <div className="confirm-popup-close">
        <IconButton style={{ borderRadius: '50%', boxShadow: '0px 2px 9px -2px #000' }} onClick={closeAction}>
          <Image src="/images/Icons_Red_Cross.png" size="mini" />
        </IconButton>
      </div>
    </div>);
    return (
      <div>
        <Dialog
          titleStyle={style.titleStyle}
          contentStyle={style.contentStyle}
          actionsContainerStyle={style.actionsContainerStyle}
          title={titleMessage}
          actions={actions}
          modal={true}
          onRequestClose={handleClickOutside}
          open={this.state.isOpen}>
          <div className="confirm-popup-body">
            <p>{message}</p>
            {this.props.children}
          </div>
        </Dialog>
      </div>
    );
  }
}

export const InfoModal = InfoModalComponent;
