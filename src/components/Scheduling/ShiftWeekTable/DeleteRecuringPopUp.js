import React, {Component} from 'react';
import Dialog from 'material-ui/Dialog';
import IconButton from 'material-ui/IconButton';
import FlatButton from 'material-ui/FlatButton';
import CircleButton from '../../../components/helpers/CircleButton';
import './shiftSection.css';
import {Image} from 'semantic-ui-react';
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
    width: 900,
    height: 333,
    borderRadius: 6,
    maxWidth: 900
  }
};

export default class DeleteRecuringPopUp extends Component {
  constructor(props) {
    super(props);
    this.state = {
      isOpen: props.isOpen
    }
  }

  componentWillReceiveProps(nextProps) {
    if (this.state.isOpen !== nextProps.isOpen) this.setState({isOpen: nextProps.isOpen});
  };

  render() {
    let {title, action, closeAction, handleClickOutside} = this.props;
    const actions = action.map((action, index) =>
      (<div className="delete-popup" onClick={action.handleClick} style={{cursor: "pointer"}}>
          <div className="delete-popup-icon">
            <i><img src={action.image} alt=""/></i>
          </div>
          <div className="delete-popup-title">
            <h5>{action.title}</h5>
            <p>{action.message}</p>
          </div>
        </div>
      )
    );
    const titleMessage = (<div>
      <h5 className="confirm-popup">{title}</h5>
      <div className="confirm-popup-close">
        <IconButton style={{borderRadius: '50%', boxShadow: '0px 2px 9px -2px #000'}} onClick={closeAction}>
          <Image src="/images/Icons_Red_Cross.png" size="mini"/>
        </IconButton>
      </div>
    </div>);
    return (
      <div className="modal-wrapper">
        <Dialog
          titleStyle={style.titleStyle}
          contentStyle={style.contentStyle}
          actionsContainerStyle={style.actionsContainerStyle}
          title={titleMessage}
          modal={true}
          onRequestClose={handleClickOutside}
          open={this.state.isOpen}>
          <div className="confirm-popup-body">
            <div className="delete-shift-popup">
              {actions}
            </div>
            {this.props.children}
          </div>
        </Dialog>
      </div>
    );
  }
}
