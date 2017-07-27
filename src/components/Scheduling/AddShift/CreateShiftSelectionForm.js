import React,{Component} from 'react';
import AddShiftForm from './CreateShift/AddShiftForm';
import AddEmployeeForm from './CreateShift/AddEmployeeForm';
import {Image,Divider,Button,Header,Modal} from 'semantic-ui-react';
import {CreateShiftButton,onFormClose} from './CreateShiftButton';
import './styles.css';

export default class CreateShiftSelectionForm extends Component{
  constructor(props){
    super(props);
    this.onEmployeeCount = this.onEmployeeCount.bind(this);
    this.onStandard = this.onStandard.bind(this);
    this.onStandardFormClose=this.onStandardFormClose.bind(this);

    this.state = {
      employeeCount : false,
      standard:false,
      template:false
    }
  }
  onEmployeeCount(){
    this.setState({employeeCount:true})
  }
  onStandard(){
    this.setState({standard:true})
  }

  onTemplate(){
    this.setState({template:true})
  }
 onStandardFormClose(){
   this.setState({standard:false})
 }
  render(){
    return(
      <div>
        <Header as='h2' style={{textAlign: 'center', color: '#0022A1',fontSize: '26px',marginLeft: '10%',padding: '2px'}} >
         <p style={{paddingTop:'11px',float:'left',marginLeft:'30%'}}>ADD HOURS</p>
            <Image
            floated="right"
            src="/images/Assets/Icons/Buttons/delete-round-small.png" shape="circular"
            style={{ width:'8%' }}
            onClick={ this.props.closeFunc } />
        </Header>
        <Divider style={{ marginTop: '8.5%' }}/>
          <Modal
            trigger={<Image
                        src="/images/Assets/Icons/Buttons/employee-count.png"
                        shape="rounded"
                        style={{float: 'left',left: '2.5%',marginTop: '3%' , cursor: 'pointer'}}
                        onClick={this.onEmployeeCount}
                        height='90%'
                        width='30%'
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
                        style={{ float: 'left',left: '4.8%',marginTop: '3%',cursor: 'pointer' }}
                        onClick={ this.onStandard }
                        height='90%'
                        width='30%'

                     />}
             open={ this.state.standard }
             style={{ marginTop:'0px', left:'53%',top: '5%',padding: '1.0%',bottom: '5%',height:'89%' }}
             size="large"
             >
               <AddShiftForm  closeFunc={ this.onStandardFormClose } closeAddFun={this.props.closeFunc} />
             </Modal>
             <Modal
              trigger={<Image
                         src="/images/Assets/Icons/Buttons/add-template.png"
                         shape="rounded"
                         style={{ float: 'left',right: '1.8%',marginTop: '3%',cursor: 'pointer',left: '7.2%' }}
                         onClick={ this.onTemplate }
                         height='90%'
                         width='30%'

                      />}
              open={ this.state.template }
              style={{ marginTop: '0px',top: '16%',padding: '1.5%' }}
              size="small"
              >
              </Modal>
      </div>
    );

  }
}
