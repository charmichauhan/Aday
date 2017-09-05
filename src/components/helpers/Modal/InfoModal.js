import React, { Component } from 'react';
import Dialog from 'material-ui/Dialog';

const styles = {
  titleStyle: {
    color: '#4A4A4A',
    fontFamily: 'Lato',
    fontSize: 24,
    fontWeight: 600,
    borderBottom: '1px solid #e1e1e2'
  },
  contentStyle: {},
  actionsContainerStyle: {
    borderTop: '1px solid #e1e1e2',
    padding: '20px 24px'
  }
}

export default class InfoModal extends Component {
  constructor(props) {
    super(props);
    this.state = {
      isOpen: props.isOpen
    }
  }

  componentWillReceiveProps(nextProps) {
    if (this.state.isOpen !== nextProps.isOpen) this.setState({ isOpen: nextProps.isOpen });
  };

  getComputedStyle = (style) => {
    return {
      titleStyle: {
        ...styles.titleStyle,
        ...style.titleStyle
      },
      contentStyle: {
        ...styles.contentStyle,
        ...style.contentStyle
      },
      actionsContainerStyle: {
        ...styles.actionsContainerStyle,
        ...style.actionsContainerStyle
      }
    };
  };

  render() {
    const {
      title,
      message,
      children,
      actions = [],
      handleClickOutside = () => {
      },
      style = {},
    } = this.props;
    const styles = this.getComputedStyle(style);
    return (
      <Dialog
        titleStyle={styles.titleStyle}
        contentStyle={styles.contentStyle}
        actionsContainerStyle={styles.actionsContainerStyle}
        title={title}
        titleStyle={styles.titleStyle}
        modal={true}
        paperProps={ {style: { borderRadius: 5 } } }
        bodyClassName="info-modal-body-container"
        actions={actions}
        actionsContainerClassName="info-modal-actions"
        onRequestClose={handleClickOutside}
        open={this.state.isOpen}>
        <div className="info-modal-body">
          <p>{message}</p>
          {children}
        </div>
      </Dialog>
    );
  }
}
