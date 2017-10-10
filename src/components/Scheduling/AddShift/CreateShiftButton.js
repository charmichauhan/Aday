import React, { Component } from 'react';
import RaisedButton from 'material-ui/RaisedButton';
import AddIcon from 'material-ui/svg-icons/content/add';
import { Divider, Modal, Header, Image } from 'semantic-ui-react';
import { NavLink } from 'react-router-dom';

import AddEmployeeForm from './CreateShift/AddEmployeeForm';
import { colors } from '../../styles';

import './styles.css';
import 'react-date-picker/index.css';

const styles = {
  images: {
    cursor: 'pointer',
    display: 'inline-block',
    margin: 'auto',
    minHeight: '65%',
    minWidth: '30%',
    height: 200,
    width: '40%'
  },
  drawer: {
    width: 600
  }
};

export default class CreateShiftButton extends Component {
  constructor(props) {
    super(props);

    this.state = {
      poppedOut: false,
      employeeCount: false,
      standard: false,
      template: false,
      modalHeight: '350px',
      modalSize: 'small'
    };
  }

  onButtonClick = (e) => {
    // if (this.props.onButtonClick) this.props.onButtonClick();
    // this.setState({ poppedOut: true });
    if (this.props.onCreateShift) this.props.onCreateShift();
    this.setState({ isCreateShiftOpen: true });
  };

  onFormClose = () => {
    this.setState({
      poppedOut: false, standard: false,
      employeeCount: false, template: false,
      modalHeight: '350px', modalSize: 'small'
    });
    if (this.props.onModalClose) this.props.onModalClose();
  };

  onEmployeeCount = () => {
    this.setState({ employeeCount: false });
  };

  onStandard = () => {
    if (this.props.onCreateShift) this.props.onCreateShift();
    this.setState({ isCreateShiftOpen: true });
  };

  onTemplate = () => {
    this.setState({ template: true });
  };

  onStandardFormClose = () => {
    this.onFormClose();
  };

  render() {
    return (
      <div className="raise-btn">
        <RaisedButton
          onClick={this.onButtonClick}
          label="ADD HOURS"
          backgroundColor={colors.primaryBlue}
          labelColor="#FFFFFF"
          labelStyle={{ fontWeight: 800 }}
          buttonStyle = {{height: 40}}
          style = {{ margin: '10px 0'}}

        />
        <Modal open={this.props.open}
               size={this.state.modalSize}
               style={{ height: this.state.modalHeight }}
               onClose={this.onFormClose}>
          {!this.state.employeeCount && !this.state.standard &&
          <Modal.Content>
            <Header as='h2' style={{
              textAlign: 'center',
              color: '#0022A1',
              fontSize: '26px',
              marginLeft: '10%',
              padding: '2px'
            }}>
              <p style={{ paddingTop: '11px', float: 'left', marginLeft: '30%' }}>ADD HOURS</p>
            </Header>
            <Divider style={{ marginTop: '8.5%' }} />
            <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
              <Image src="/images/Assets/Icons/Buttons/employee-count-coming.png"
                     shape="rounded"
                     style={styles.images}
                     onClick={this.onEmployeeCount} />
              <Image src="/images/Assets/Icons/Buttons/standard-add.png"
                     shape="rounded"
                     style={styles.images}
                     onClick={this.onStandard} />
              <Image src="/images/Assets/Icons/Buttons/add-template.png"
                     shape="rounded"
                     style={styles.images}
                     as={NavLink} to="/schedule/recurring" />
            </div>
          </Modal.Content>
          }
          {this.state.employeeCount && <AddEmployeeForm />}
          {/*{this.state.standard &&
           <AddShiftForm weekPublishedId={this.props.weekPublishedId} start={this.props.weekStart}
           closeFunc={this.onFormClose} /> }*/}

        </Modal>
      </div>
    );
  }
}
