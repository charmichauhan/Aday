import React, {Component} from "react";
import { Dropdown, Menu, Button, Icon, Input, Col, message , Select, InputNumber, DatePicker, AutoComplete, Cascader } from 'antd';
const InputGroup = Input.Group;
const Option = Select.Option;
import 'antd/lib/select/style/css';
import 'antd/lib/dropdown/style/css';
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


// import 'antd/dist/antd.css';
import 'antd/lib/date-picker/style/css';
export default class MemberPersonelInformation extends Component {

  constructor(props){
    super(props);

    this.handleChange = this.handleChange.bind(this);
  }
  state = {
    dataSource: [],
  }

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

    const menu1 = (
      <Menu onClick={this.handleMenuClick}>
        <Menu.Item key="1">1st menu item</Menu.Item>
        <Menu.Item key="2">2nd menu item</Menu.Item>
        <Menu.Item key="3">3d menu item</Menu.Item>
      </Menu>
    );

    return(
      <div>

        <div className="text-center profile-drawer-title">
          <h2 className="text-uppercase">Personal Information</h2>
        </div>
        <br/>
        <div>
          Primary Location
          <div>
            <Dropdown overlay={menu1}>
              <Button style={{ marginLeft: 8 }}>
                Button <Icon type="down" />
              </Button>
            </Dropdown>
            <Select defaultValue="lucy" style={{ width: 120 }}  >
              <Option value="lucy">Lucy</Option>
              <Option value="vsdfd">vsdfd</Option>
            </Select>
          </div>
          <br />

          <InputGroup compact>
            <Input style={{ width: '20%' }} defaultValue="0571" />
            <Input style={{ width: '30%' }} defaultValue="26888888" />
          </InputGroup>
          <br />

          <br />
          <InputGroup compact>
            <Select defaultValue="Option1">
              <Option value="Option1">Option1</Option>
              <Option value="Option2">Option2</Option>
            </Select>
            <Input style={{ width: '50%' }} defaultValue="input content" />
            <InputNumber />
          </InputGroup>
          <br />
          <InputGroup compact>
            <Input style={{ width: '50%' }} defaultValue="input content" />
            <DatePicker />
          </InputGroup>
          <br />
          <InputGroup compact>
            <Select defaultValue="Option1-1">
              <Option value="Option1-1">Option1-1</Option>
              <Option value="Option1-2">Option1-2</Option>
            </Select>
            <Select defaultValue="Option2-2">
              <Option value="Option2-1">Option2-1</Option>
              <Option value="Option2-2">Option2-2</Option>
            </Select>
          </InputGroup>
          <br />
          <InputGroup compact>
            <Select defaultValue="1">
              <Option value="1">Between</Option>
              <Option value="2">Except</Option>
            </Select>
            <Input style={{ width: 100, textAlign: 'center' }} placeholder="Minimum" />
            <Input style={{ width: 24, borderLeft: 0, pointerEvents: 'none', backgroundColor: '#fff' }} placeholder="~" disabled />
            <Input style={{ width: 100, textAlign: 'center', borderLeft: 0 }} placeholder="Maximum" />
          </InputGroup>
          <br />

          <br />
          <InputGroup compact>
            <Select style={{ width: '30%' }} defaultValue="Home">
              <Option value="Home">Home</Option>
              <Option value="Company">Company</Option>
            </Select>
            <Cascader style={{ width: '70%' }} options={options} placeholder="Select Address" />
          </InputGroup>
        </div>
      </div>
    )
  }
}


