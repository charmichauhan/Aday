import React, {Component} from "react";
import {Dropdown, Menu, Button, Icon, Input, message, Select, InputNumber, Cascader} from "antd";
import {Image, Rating, Grid} from "semantic-ui-react";
import DatePicker from "material-ui/DatePicker";
import "antd/lib/select/style/css";
import "antd/lib/dropdown/style/css";
import SelectField from "material-ui/SelectField";
import MenuItem from "material-ui/MenuItem";
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
        {/*<br/>*/}
        {/*<div>*/}
          {/*<SelectField*/}
            {/*floatingLabelText="Frequency"*/}
          {/*>*/}
            {/*<MenuItem value={1} primaryText="Never" />*/}
            {/*<MenuItem value={2} primaryText="Every Night" />*/}
            {/*<MenuItem value={3} primaryText="Weeknights" />*/}
            {/*<MenuItem value={4} primaryText="Weekends" />*/}
            {/*<MenuItem value={5} primaryText="Weekly" />*/}
          {/*</SelectField>*/}
        {/*</div>*/}
        {/*<div>*/}
          {/*Primary Location*/}
          {/*<div>*/}
            {/*<Dropdown overlay={menu1}>*/}
              {/*<Button style={{ marginLeft: 8 }}>*/}
                {/*Button <Icon type="down" />*/}
              {/*</Button>*/}
            {/*</Dropdown>*/}
            {/*<Select defaultValue="lucy" style={{ width: 120 }}  >*/}
              {/*<Option value="lucy">Lucy</Option>*/}
              {/*<Option value="vsdfd">vsdfd</Option>*/}
            {/*</Select>*/}
          {/*</div>*/}
          {/*<br />*/}

          {/*<InputGroup compact>*/}
            {/*<Input style={{ width: '20%' }} defaultValue="0571" />*/}
            {/*<Input style={{ width: '30%' }} defaultValue="26888888" />*/}
          {/*</InputGroup>*/}
          {/*<br />*/}

          {/*<br />*/}
          {/*<InputGroup compact>*/}
            {/*<Select defaultValue="Option1">*/}
              {/*<Option value="Option1">Option1</Option>*/}
              {/*<Option value="Option2">Option2</Option>*/}
            {/*</Select>*/}
            {/*<Input style={{ width: '50%' }} defaultValue="input content" />*/}
            {/*<InputNumber />*/}
          {/*</InputGroup>*/}
          {/*<br />*/}
          {/*<InputGroup compact>*/}
            {/*<Input style={{ width: '50%' }} defaultValue="input content" />*/}

          {/*</InputGroup>*/}
          {/*<br />*/}
          {/*<InputGroup compact>*/}
            {/*<Select defaultValue="Option1-1">*/}
              {/*<Option value="Option1-1">Option1-1</Option>*/}
              {/*<Option value="Option1-2">Option1-2</Option>*/}
            {/*</Select>*/}
            {/*<Select defaultValue="Option2-2">*/}
              {/*<Option value="Option2-1">Option2-1</Option>*/}
              {/*<Option value="Option2-2">Option2-2</Option>*/}
            {/*</Select>*/}
          {/*</InputGroup>*/}
          {/*<br />*/}
          {/*<InputGroup compact>*/}
            {/*<Select defaultValue="1">*/}
              {/*<Option value="1">Between</Option>*/}
              {/*<Option value="2">Except</Option>*/}
            {/*</Select>*/}
            {/*<Input style={{ width: 100, textAlign: 'center' }} placeholder="Minimum" />*/}
            {/*<Input style={{ width: 24, borderLeft: 0, pointerEvents: 'none', backgroundColor: '#fff' }} placeholder="~" disabled />*/}
            {/*<Input style={{ width: 100, textAlign: 'center', borderLeft: 0 }} placeholder="Maximum" />*/}
          {/*</InputGroup>*/}
          {/*<br />*/}

          {/*<br />*/}
          {/*<InputGroup compact>*/}
            {/*<Select style={{ width: '30%' }} defaultValue="Home">*/}
              {/*<Option value="Home">Home</Option>*/}
              {/*<Option value="Company">Company</Option>*/}
            {/*</Select>*/}
            {/*<Cascader style={{ width: '70%' }} options={options} placeholder="Select Address" />*/}
          {/*</InputGroup>*/}
        {/*</div>*/}

        {/*<div>*/}
          {/*<DatePicker*/}
            {/*hintText="Controlled Date Input"*/}
            {/*container="inline"*/}
          {/*/>*/}
        {/*</div>*/}

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


