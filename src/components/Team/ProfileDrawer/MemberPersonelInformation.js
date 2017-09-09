import React, {Component} from "react";
import {Menu, Input, message, Select, InputNumber, Cascader} from "antd";
import {Image} from "semantic-ui-react";
import DatePicker from "material-ui/DatePicker";
import "antd/lib/select/style/css";
import "antd/lib/dropdown/style/css";
import SelectField from "material-ui/SelectField";
import MenuItem from "material-ui/MenuItem";
import { fetchPrimaryLocation, fetchEmployeeByUserId, updateEmployeeById } from "../Team.graphql";
import { graphql,compose } from 'react-apollo';
import CircleButton from '../../helpers/CircleButton';
import "antd/lib/date-picker/style/css";
import moment from 'moment';

const InputGroup = Input.Group;
const Option = Select.Option;
const init ={
  primaryLocation: ''
};


class MemberPersonnelInformationComponent extends Component {

  state = init;

  constructor(props){
    super(props);
    this.state = {
      primaryLocation: null,
      wage: null,
      hire: null,
      pay: null,
      termination: null,
      num: null,
      updated: false
    };
  }
  handlePrimaryLocationChange = (e) =>{
    console.log(e.target.value)
    this.setState({primaryLocation: e.target.value})
  };

  handleChangeWage = (e) => {
    this.setState({wage: e.target.value});
  }
  handleChangeHire= (event, date) => {
    this.setState({hire: moment(date).format()});
  }
  handleChangePayRoll= (e) => {
    this.setState({pay: e.target.value});
  }
  handleChangeTemination= (event, date) => {
    this.setState({termination: moment(date).format()});
  }
  handleChangeEmployeeNum= (e) => {
    this.setState({num: e.target.value});
  }

  handleMenuClick(e) {
    message.info('Click on menu item.');
    console.log('click', e);
  }
  saveEmployee(v){
    console.log(v)
    console.log("saveEmployee")
    console.log(this.state)
    const employeeInfo = {}
    if(this.state.primaryLocation){
      employeeInfo['primaryWorkplace'] = this.state.primaryLocation
    }
    if(this.state.wage){
      employeeInfo['wage'] = this.state.wage
    }
    if(this.state.hire){
      employeeInfo['hireDate'] = this.state.hire
    }
    if(this.state.pay){
      employeeInfo['payrollNum'] = this.state.pay
    }
    if(this.state.termination){
      employeeInfo['deletionDate'] = this.state.termination
    }
    if(this.state.num){
      employeeInfo['employeeNum'] = this.state.num
    }
    this.props.updateEmployee({
      variables: {
        id: v,
        employeeInfo
        }
        }).then(({ data }) => {
              this.setState({ updated: true });
              window.location.reload();
              console.log(data)
        })
  }
  render(){
    if (this.props.primaryLocation.loading || this.props.fetchEmployeeByUserId.loading) {
      return (<div>Loading</div>);
    }

    let allPositions = this.props.primaryLocation && this.props.primaryLocation.allWorkplaces && this.props.primaryLocation.allWorkplaces.edges;
    const fetchEmployeeByUserId = this.props.fetchEmployeeByUserId && this.props.fetchEmployeeByUserId.allEmployees && this.props.fetchEmployeeByUserId.allEmployees.edges;
    const userDetails = this.props.userDetails;

    return(

      <div>

        <div className="text-center profile-drawer-tab">
          <Image className="section-icon" src="/images/Sidebar/user.png" style={{width:30, height:30, padding:3}}/>
          <h2 className="text-uppercase" >Personnel Information</h2>
        </div>
         {this.state.updated? <div style={{ fontSize: "16px", color: "black" }}> Personnel Information Updated. </div>:"" }
        <div className="personal-info">
          {fetchEmployeeByUserId.map((value, index) => (
            <div>
            <div className="col-md-12 p0">
              <div className="col-md-5">
                <div className="form-group">
                  <span className="custom-ant-style-header">PRIMARY LOCATION</span>
                  <select className="form-control form-control-sm"  style={{marginTop:5}} onChange={this.handlePrimaryLocationChange}>
                    {
                      allPositions.map((v,index)=>{

                        const key = v.node.id;
                        const value1 = v.node.id;
                        const text = v.node.workplaceName;
                        let selected;
                        if(v.node.id == localStorage.getItem("workplaceId")){
                          selected = true;
                        }
                        return(
                          <option
                          key={key}
                          value={value1}
                          selected={ selected }
                          >
                            {text}
                          </option>
                        );
                      })
                    }
                  </select>
                </div>
                <p className="info">
                  Scheduling automation will prioritize assigning this team member to the location above
                </p>
              </div>
            </div>
            <div className="col-md-12 p0">
              <div className="col-md-5">
                <div className="form-group">
                  <text className="custom-ant-style-header">HOURLY WAGE</text>
                  <input type="text" onChange={this.handleChangeWage} className="form-control form-control-sm" placeholder={value.node.wage} />
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
                  <input type="text" onChange={this.handleChangePayRoll} className="form-control form-control-sm" placeholder={value.node.payrollNum} />
                </div>
              </div>
              <div className="col-md-5">
                <div className="form-group">
                  <text className="custom-ant-style-header">EMPLOYEE ID</text>
                  <input type="text" onChange={this.handleChangeEmployeeNum} className="form-control form-control-sm" placeholder={value.node.employeeNum}/>
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
                      defaultDate={new Date (value.node.hireDate)}
                      inputStyle={{padding: '5px 10px'}}
                      textFieldStyle={{border: '1px solid #eee', height: 30, borderRadius: 6, width: 211}}
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
                      defaultDate={new Date (value.node.deletionDate)}
                      textFieldStyle={{border: '1px solid #eee', height: 30, borderRadius: 6, width: 211}}
                  />
                </div>
              </div>
              <div className="text-center btn">
              <button onClick={() => this.saveEmployee(value.node.id)} className="btn text-uppercase btn-default">Save {userDetails.firstName}</button>
           </div>
        </div>
        </div>
        ))}
        </div>
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
  graphql(fetchEmployeeByUserId ,
    {
      name:"fetchEmployeeByUserId",
      options:(ownProps) =>({
        variables: {
          userId: ownProps.userDetails.id,
          corporationId: localStorage.getItem("corporationId")
        }
      }),
    }),
    graphql(updateEmployeeById, {name: "updateEmployee"})
    )(MemberPersonnelInformationComponent);

export default MemberPersonnelInformation
