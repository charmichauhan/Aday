import React, {Component} from "react";
import {Dropdown, Menu, Button, Icon, Input, message, Select, InputNumber, Cascader} from "antd";
import {Image, Rating, Grid} from "semantic-ui-react";
import DatePicker from "material-ui/DatePicker";
import "antd/lib/select/style/css";
import "antd/lib/dropdown/style/css";
import SelectField from "material-ui/SelectField";
import MenuItem from "material-ui/MenuItem";
import CircleButton from '../../helpers/CircleButton';
import "antd/lib/date-picker/style/css";

const InputGroup = Input.Group;
const Option = Select.Option;
const options = [{
  value: 'zhejiang',
  label: 'Zhejiang',
  children: [{
    value: 'hangzhou',
    label: 'Hangzhou',
    children: [{
      value: 'xihu',
      label: 'West Lake',
    }],
  }],
}, {
  value: 'jiangsu',
  label: 'Jiangsu',
  children: [{
    value: 'nanjing',
    label: 'Nanjing',
    children: [{
      value: 'zhonghuamen',
      label: 'Zhong Hua Men',
    }],
  }],
}];


export default class MemberPersonelInformation extends Component {

  constructor(props){
    super(props);
    this.state = {
      controlledDate: null,
    };
    this.handleChange = this.handleChange.bind(this);
  }
  state = {
    dataSource: [],
  }

  handleChangeInPicker = (event, date) => {
    this.setState({
      controlledDate: date,
    });
  };

  handleChange = (value) => {
    this.setState({
      dataSource: !value || value.indexOf('@') >= 0 ? [] : [
          `${value}@gmail.com`,
          `${value}@163.com`,
          `${value}@qq.com`,
        ],
    });
  }
  handleMenuClick(e) {
    message.info('Click on menu item.');
    console.log('click', e);
  }
  render(){

    const userDetails = this.props.userDetails;

    const menu1 = (
      <Menu onClick={this.handleMenuClick}>
        <Menu.Item key="1">1st menu item</Menu.Item>
        <Menu.Item key="2">2nd menu item</Menu.Item>
        <Menu.Item key="3">3d menu item</Menu.Item>
      </Menu>
    );

    return(
      <div>

        <div className="text-center profile-drawer-tab">
          <Image src="/images/Sidebar/user.png" size="mini"/>
          <h2 className="text-uppercase">Personnel Information</h2>
        </div>

        <div className="personal-info">
          <form>
            <div className="col-md-12 p0">
              <div className="col-md-5">
                <div className="form-group">
                  <label className="text-uppercase">Primary Location:</label>
                  <select className="form-control form-control-sm">
                    <option>Chao Center</option>
                    <option>Value1</option>
                    <option>Value2</option>
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
                  <input type="text" className="form-control form-control-sm" placeholder="Wage" />
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
                  <input type="text" className="form-control form-control-sm" placeholder="Employee_ID" />
                </div>
              </div>
              <div className="col-md-5">
                <div className="form-group">
                  <label className="text-uppercase">Employee ID</label>
                  <input type="text" className="form-control form-control-sm" placeholder="Employee_ID" />
                </div>
              </div>
            </div>
            <div className="col-md-12 p0">
              <div className="col-md-5">
                <div className="form-group">
                  <label className="text-uppercase">Hire Date</label>
                  <input type="text" className="form-control form-control-sm" placeholder="Date" />
                </div>
              </div>
              <div className="col-md-5">
                <div className="form-group">
                  <label className="text-uppercase">Termination Date</label>
                <input type="text" className="form-control form-control-sm" placeholder="Date" />
        </div>              </div>

        </div>
            <div className="col-md-12 p0">
              <div className="col-md-5">
                <div className="form-group">
                  <label className="text-uppercase">Primary Location:</label>
                  <select className="form-control form-control-sm">
                    <option>Chao Center</option>
                    <option>Value1</option>
                    <div className="form-group">
                      <label className="text-uppercase">Gender:</label>
                      <select className="form-control form-control-sm">
                        <option>Male</option>
                        <option>Female</option>
                      </select>
                    </div>
                  </select>
                </div>
              </div>
            </div>
          </form>
        </div>

      </div>
    )
  }
}


