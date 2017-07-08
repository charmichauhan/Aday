import React,{Component} from 'react';
import './styles.css';
import {ModalContainer,ModalDialog} from 'react-modal-dialog';
import AddShiftForm from './CreateShift/AddShiftForm';
import AddEmployeeForm from './CreateShift/AddEmployeeForm';
import {Image,Divider,Button,Header,Modal} from 'semantic-ui-react';
import {CreateShiftButton,onFormClose} from './CreateShiftButton';

export default class CreateShiftSelectionForm extends Component{
  constructor(props){
    super(props);
    this.onEmployeeCount = this.onEmployeeCount.bind(this);
    this.onStandard = this.onStandard.bind(this);
    this.state = {
      employeeCount : false,
      standard:false
    }
  }
  onEmployeeCount(){
    this.setState({employeeCount:true})
  }
  onStandard(){
    this.setState({standard:true})
  }
  render(){
    return(
      <div>
        <Header as = 'h2' style={{textAlign: 'center'   , color: '#0022A1'}} >
         ADD SHIFT
            <Image
            height="90%"
            width="90%"
            floated="right"
            src="/images/Assets/Icons/Buttons/delete-round-small.png" shape="circular"
            style={{top: -11 , right: -68}}
            onClick = {this.props.func} />
        </Header>
        <Divider style = {{marginTop: '5%'}}/>
          <Modal
            trigger = {<Image
                        src="/images/Assets/Icons/Buttons/employee-count.png"
                        shape="rounded"
                        style={{float: 'left',left: '5.8%',marginTop: '3%' , cursor: 'pointer'}}
                        onClick={this.onEmployeeCount}
                       />}
            open={this.state.employeeCount}
            style={{marginTop:'0px'}}
            >
              <AddEmployeeForm />
            </Modal>
            <Modal
             trigger={<Image
                        src="/images/Assets/Icons/Buttons/standard-add.png"
                        shape="rounded"
                        style={{float: 'right',right: '5.8%',marginTop: '3%',cursor: 'pointer'}}
                        onClick={this.onStandard}
                     />}
             open={this.state.standard}
             style={{marginTop:'0px',top:'16%',padding:'1.5%'}}
             size="small"
             >
               <AddShiftForm />
             </Modal>
      </div>
    );

  }
}
