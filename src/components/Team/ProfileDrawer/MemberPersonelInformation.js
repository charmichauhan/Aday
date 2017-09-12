import React, {Component} from "react";
import {Menu, Input, message, Select, InputNumber, Cascader} from "antd";
import {Image} from "semantic-ui-react";
import DatePicker from "material-ui/DatePicker";
import "antd/lib/select/style/css";
import "antd/lib/dropdown/style/css";
import SelectField from "material-ui/SelectField";
import MenuItem from "material-ui/MenuItem";
import { fetchPrimaryLocation, userQuery, updateEmployeeById } from "../Team.graphql";
import { graphql,compose } from 'react-apollo';
import CircleButton from '../../helpers/CircleButton';
import "antd/lib/date-picker/style/css";
import moment from 'moment';
import 'material-ui/styles/colors.js';
var Halogen = require('halogen');
import Notifier, { NOTIFICATION_LEVELS } from '../../helpers/Notifier';

const InputGroup = Input.Group;
const Option = Select.Option;
const init ={
  primaryLocation: ''
};

const styles = {
  circleButton: {
    fontSize: 18,
    padding: '6px 5px',
    fontWeight: 'bold'
}};

class MemberPersonnelInformationComponent extends Component {

  state = init;

  constructor(props){
    super(props);
    const employee = this.props.userDetails.employeesByUserId.edges[0].node
    let hireDate = null
    if (employee.hireDate){
       hireDate = new Date (employee.hireDate)  
    } 
    let termDate = null
    if (employee.deletionDate){
        termDate = new Date (employee.deletionDate)
    } 
    this.state = {
      employee: employee,
      primaryLocation: employee.primaryWorkplace || null,
      wage: employee.wage || 0,
      hire: hireDate,
      pay: employee.payrollNum || "", 
      termination: termDate, 
      num: employee.employeeNum || "",
      notify: false,
      notificationType: '',
      notificationMessage: '',
      updated: false
    };
  }

  handlePrimaryLocationChange = (e) =>{
    console.log(e.target.value)
    if (e.target.value == ""){
       this.setState({primaryLocation: null})
    } else {
      this.setState({primaryLocation: e.target.value})
    }
  };

  handleChangeWage = (e) => {
    this.setState({wage: e.target.value});
  }
  handleChangeHire= (event, date) => {
    date =  new Date (date)
    this.setState({ hire: date });
  }
  handleChangePayRoll= (e) => {
    this.setState({pay: e.target.value});
  }
  handleChangeTemination= (event, date) => {
    date =  new Date (date)
    this.setState({ termination: date });
  }
  handleChangeEmployeeNum= (e) => {
    this.setState({num: e.target.value});
  }

  showNotification = (message, type) => {
    this.setState({
      notify: true,
      notificationType: type,
      notificationMessage: message
    });
  };

  hideNotification = () => {
    this.setState({
      notify: false,
      notificationType: '',
      notificationMessage: ''
    });
  }

  handleMenuClick(e) {
    message.info('Click on menu item.');
    console.log('click', e);
  }
  saveEmployee(v){
    console.log(v)
    let employeeInfo = {};

    employeeInfo['primaryWorkplace'] = this.state.primaryLocation
    employeeInfo['wage'] = this.state.wage
    employeeInfo['hireDate'] = this.state.hire
    employeeInfo['payrollNum'] = this.state.pay
    employeeInfo['deletionDate'] = this.state.termination
    employeeInfo['employeeNum'] = this.state.num
    
    console.log(employeeInfo)
    this.props.updateEmployee({
      variables: {
        id: v, 
        employeeInfo: employeeInfo
        },  
        updateQueries: {
          userById: (previousQueryResult, { mutationResult }) => {
                      let employeeData = mutationResult.data.updateEmployeeById.employee
                      previousQueryResult.userById.employeesByUserId.edges = [{ 'node': employeeData, '__typename': "EmployeesEdge" }]
                      return {
                        userById: previousQueryResult.userById
                      };
              },
         },
    }).then(({ data }) => {
      this.showNotification('Employee Updated Successfully.', NOTIFICATION_LEVELS.SUCCESS);
      console.log(data)
    })
  }
  render(){
    if (this.props.primaryLocation.loading) {
      return (<div><Halogen.SyncLoader color='#00A863'/></div>);
    }

    let allWorkplaces = this.props.primaryLocation && this.props.primaryLocation.allWorkplaces && this.props.primaryLocation.allWorkplaces.edges;
    const fetchEmployeeByUserId = this.state.employee
    const userDetails = this.props.userDetails;

    return(

      <div>

        <div className="text-center profile-drawer-tab">
          <Image className="section-icon" src="/images/Sidebar/user.png" style={{width:30, height:30, padding:3}}/>
          <h2 className="text-uppercase" >Personnel Information</h2>
        </div>
         {this.state.updated? <div style={{ fontSize: "16px", color: "black" }}> Personnel Information Updated. </div>:"" }
        <div className="personal-info">
            <div>
            <div className="col-md-12 p0">
              <div className="col-md-5">
                <div className="form-group">
                  <span className="custom-ant-style-header">PRIMARY LOCATION</span>

                  <select className="form-control form-control-sm"  style={{marginTop:5}} value={this.state.primaryLocation} onChange={this.handlePrimaryLocationChange}>
                                      <option
                          key={""}
                          value={""}
                          >
                            Select A Location
                          </option>
                    {
                      allWorkplaces.map((v,index)=>{
                        const key = v.node.id;
                        const value1 = v.node.id;
                        const text = v.node.workplaceName;
                        return(
                          <option
                          key={key}
                          value={value1}
                          >
                            {text}
                          </option>
                        );
                      })
                    }
                  </select>

                </div>
                <p className="info">
                  Scheduling automation will prioritize assigning this team member to this location
                </p>
              </div>
            </div>
            <div className="col-md-12 p0">
              <div className="col-md-5">
                <div className="form-group">
                  <text className="custom-ant-style-header">HOURLY WAGE</text><br />
                  <InputNumber
                    defaultValue={this.state.wage}
                    formatter={value => `$ ${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
                    parser={value => value.replace(/\$\s?|(,*)/g, '')}
                    onChange={this.handleChangeWage}
                  />
                </div>
                    <p className="info">
                      Wages are set on the positions worksheet for part-time team members
                    </p>
              </div>
            </div>
            <div className="col-md-12 p0">
              <div className="col-md-5">
                <div className="form-group">
                  <text className="custom-ant-style-header">PAYROLL ID</text>
                  <input type="text" onChange={this.handleChangePayRoll} className="form-control form-control-sm" value={this.state.pay} />
                </div>
              </div>
              <div className="col-md-5">
                <div className="form-group">
                  <text className="custom-ant-style-header">EMPLOYEE ID</text>
                  <input type="text" onChange={this.handleChangeEmployeeNum} className="form-control form-control-sm" value={this.state.num}/>
                </div>
              </div>
            </div>
            <div className="col-md-12 p0">
              <div className="col-md-5">
                <div className="form-group">
                  <text className="custom-ant-style-header">HIRE DATE</text>
                  {/*<input type="text" className="form-control form-control-sm" placeholder="Date" />*/}
                  <DatePicker hintText="Date"
                      container="inline"
                      className="datePicker"
                      onChange={this.handleChangeHire}
                      hintStyle={{bottom: 2, left: 10}}
                      value={ this.state.hire }
                      inputStyle={{padding: '5px 10px'}}
                      textFieldStyle={{border: '1px solid #eee', height: 30, borderRadius: 6, width: 211}}
                      style={{paddingTop: 5}}
                  />
                </div>
              </div>
              <div className="col-md-5">
                <div className="form-group">
                  <text className="custom-ant-style-header">TERMINATION DATE</text>
                {/*<input type="text" className="form-control form-control-sm" placeholder="Date" />*/}
                  <DatePicker hintText="Date"
                      container="inline"
                      className="datePicker"
                      onChange={this.handleChangeTemination}
                      hintStyle={{bottom: 2, left: 10}}
                      inputStyle={{padding: '5px 10px'}}
                      value={ this.state.termination }
                      /*If you change the style below, modify the CSS selector with the comment "datepicker field""*/
                      textFieldStyle={{border: '1px solid #eee', height: 30, borderRadius: 6, width: 211}}
                      style={{paddingTop: 5}}
                  />

                </div>
              </div>
              <div>
                <div className="buttons text-center">
                  <CircleButton style={styles.circleButton} type="green" title="Save Update" handleClick={() => this.saveEmployee(this.state.employee.id)} image={'/assets/Icons/save-icon.png'}/>
              </div>
          </div>
        </div>
        </div>
        </div>
        <Notifier hideNotification={this.hideNotification} notify={this.state.notify} notificationMessage={this.state.notificationMessage}
                  notificationType={this.state.notificationType} />
      </div>
    )
  }
}

const MemberPersonnelInformation = compose(
  graphql(fetchPrimaryLocation ,
    {
      name:"primaryLocation",
      options:(ownProps) =>({
        variables: {
          corporationId: localStorage.getItem("corporationId")
        }
      })
  }),
  graphql(updateEmployeeById, {name: "updateEmployee"})
  )(MemberPersonnelInformationComponent);

export default MemberPersonnelInformation
