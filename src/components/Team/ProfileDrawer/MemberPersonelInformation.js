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
        }
    }).then(({ data }) => {
      this.setState({ updated: true });
      window.location.reload();
      console.log(data)
    })
  }
  render(){
    if (this.props.primaryLocation.loading ) {
      return (<div>Loading</div>);
    }

    let allWorkplaces = this.props.primaryLocation && this.props.primaryLocation.allWorkplaces && this.props.primaryLocation.allWorkplaces.edges;
    const fetchEmployeeByUserId = this.state.employee
    const userDetails = this.props.userDetails;

    return(

      <div>

        <div className="text-center profile-drawer-tab">
          <Image src="/images/Sidebar/user.png" size="mini"/>
          <h2 className="text-uppercase">Personnel Information</h2>
        </div>
         {this.state.updated? <div style={{ fontSize: "16px", color: "black" }}> Personnel Information Updated. </div>:"" }
        <div className="personal-info">
            <div>
            <div className="col-md-12 p0">
              <div className="col-md-5">
                <div className="form-group">
                  <label className="text-uppercase">Primary Location:</label>
                  <select className="form-control form-control-sm"  value={this.state.primaryLocation} onChange={this.handlePrimaryLocationChange}>
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
              </div>
            </div>
            <p className="info">
              Scheduling automation will attempt to schedule the employee at this location first
            </p>
            <div className="col-md-12 p0">
              <div className="col-md-5">
                <div className="form-group">
                  <label className="text-uppercase">Hourly Wage</label>
                  <input type="text" onChange={this.handleChangeWage} className="form-control form-control-sm"  value={this.state.wage} />
                </div>
              </div>
            </div>
            <p className="info">
              Wages for employees that work less than 30 hours per week are set corporation-wide
            </p>
            <div className="col-md-12 p0">
              <div className="col-md-5">
                <div className="form-group">
                  <label className="text-uppercase">Payroll ID</label>
                  <input type="text" onChange={this.handleChangePayRoll} className="form-control form-control-sm"  value={this.state.pay} />
                </div>
              </div>
              <div className="col-md-5">
                <div className="form-group">
                  <label className="text-uppercase">Employee ID</label>
                  <input type="text" onChange={this.handleChangeEmployeeNum} className="form-control form-control-sm" value={this.state.num}/>
                </div>
              </div>
            </div>
            <div className="col-md-12 p0">
              <div className="col-md-5">
                <div className="form-group">
                  <label className="text-uppercase">Hire Date</label>
                  {/*<input type="text" className="form-control form-control-sm" placeholder="Date" />*/}
                  <DatePicker hintText="Date"
                      container="inline"
                      className="datePicker"
                      onChange={this.handleChangeHire}
                      hintStyle={{bottom: 2, left: 10}}
                      value={ this.state.hire }
                      inputStyle={{padding: '5px 10px'}}
                      textFieldStyle={{border: '1px solid #eee', height: 30, borderRadius: 6, width: 211}}
                  />
                </div>
              </div>
              <div className="col-md-5">
                <div className="form-group">
                  <label className="text-uppercase">Termination Date</label>
                {/*<input type="text" className="form-control form-control-sm" placeholder="Date" />*/}
                  <DatePicker hintText="Date"
                      container="inline"
                      className="datePicker"
                      onChange={this.handleChangeTemination}
                      hintStyle={{bottom: 2, left: 10}}
                      inputStyle={{padding: '5px 10px'}}
                      value={ this.state.termination }
                      textFieldStyle={{border: '1px solid #eee', height: 30, borderRadius: 6, width: 211}}
                  />
                </div>
              </div>
              <div className="text-center btn">
              <button onClick={() => this.saveEmployee(this.state.employee.id)} className="btn text-uppercase btn-default">Save {userDetails.firstName}</button>
           </div>
        </div>
        </div>
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
  graphql(updateEmployeeById, {name: "updateEmployee"})
  )(MemberPersonnelInformationComponent);

export default MemberPersonnelInformation

