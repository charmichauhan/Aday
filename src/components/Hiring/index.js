import React, { Component } from 'react';
import Candidates from './Candidates';
import { Segment, Rating } from 'semantic-ui-react'
import RaisedButton from 'material-ui/RaisedButton';
//import { tabDesign } from '../styles';
import { Input, Select, Switch } from 'antd';
/*import StarRating from '../helpers/StarRating';*/
import './hiring.css';
import CircleButton from '../helpers/CircleButton';

const InputGroup = Input.Group;
const Option = Select.Option;
const styles = {
  circleButton: {
    fontSize: 18,
    padding: '6px 5px',
    fontWeight: 'bold',
    color:'#0022A1'
  }
};

const initState = {
  candidates: [
    {
      user: {
        first_name: "Alfredo",
        last_name: "Kelly",
        avatar_url: "https://s3.us-east-2.amazonaws.com/harvard-operations-pics/Operations/RA/alfredo-kelly.jpg",
        phone_number: "1-617-284-9232",
        email: "happygoluck@gmail.com"
      },
      position: 5,
    },
    {
      user: {
        first_name: "Alberto",
        last_name: "Sepulveda",
        avatar_url: "https://s3.us-east-2.amazonaws.com/harvard-operations-pics/Operations/RA/alberto-sepulueda.jpg",
        phone_number: "1-617-492-4220",
        email: "cashmeousside@gmail.com"
      },
      position: 5,
    },
    {
      user: {
        first_name: "Alexandre",
        last_name: "Oliveira",
        avatar_url: "https://s3.us-east-2.amazonaws.com/harvard-operations-pics/Operations/RA/alexandre-oliveira.jpg",
        phone_number: "1-617-392-9193",
        email: "oldskool@aol.com"
      },
      position: 5,
    },
    {
      user: {
        first_name: "Alipio",
        last_name: "Ospina",
        avatar_url: "https://s3.us-east-2.amazonaws.com/harvard-operations-pics/Operations/RA/alipio-ospina.jpg",
        phone_number: "1-617-329-8594",
        email: "yepthatsit392@gmail.com"
      },
      position: 5,
    },
    {
      user: {
        first_name: "Alvaro",
        last_name: "Gomez",
        avatar_url: "https://s3.us-east-2.amazonaws.com/harvard-operations-pics/Operations/RA/alvaro-gomez.jpg",
        phone_number: "1-805-940-5840",
        email: "disismylife@aol.com"
      },
      position: 5,
    },
    {
      user: {
        first_name: "Andreas",
        last_name: "Horava",
        avatar_url: "https://s3.us-east-2.amazonaws.com/harvard-operations-pics/Operations/RA/andreas-horava.jpg",
        phone_number: "1-617-303-9490",
        email: "pastryking@hotmail.com"
      },
      position: 5,
    },
] /*,
	tabDesign, */
};



export default class Hiring extends Component {
  constructor(props) {
    super(props);
    this.state = initState
  }

handleChange = e => this.setState({ rating: e.target.value })

    render() {

        return (
            <div style={{maxWidth:1650, minWidth: 1000}}>
                <br/>
                    <div className="col-md-12 page-title-rectangle">
                            <div className="col-sm-offset-3 col-sm-5 rectangle page-title">
                                    CROSSTRAINING
                            </div>
                    </div>
                    <br/>
                    <br/>
                    <br/>
                    <br/>
                    <Segment>
                    <div style={{flexDirection: "row", display:"flex", width:'100%'}}>
                         <div style={{ width: '50%' }}>
                             <div style={{flexDirection: "row", display:"flex", justifyContent: "space-between"}}>
                                 <div style={{flexDirection: "column", width:"105%"}}>
                                    <span>FIRST NAME</span><br />
                                    <Input  placeholder="First Name"/>
                                 </div>
                                 &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
                                 <div style={{flexDirection: "column", width:"105%"}}>
                                     <span>LAST NAME</span><br />
                                     <Input  placeholder="Last Name"/>
                                 </div>
                             </div>
                             <br />
                             <InputGroup compact style={{width:"100%"}}>
                                 <span>ZIP CODE</span><br />
                                 <Select defaultValue="Home" style={{ width: '20%' }} >
                                     <Option value="Home">HOME</Option>
                                     <Option value="Now">NOW</Option>
                                 </Select>
                                 <Input style={{ width: '50%' }} placeholder="Zip Code" />
                                 <Select defaultValue="twenty-five" style={{ width: '30%' }}>
                                     <Option value="twenty-five">25 miles away</Option>
                                     <Option value="fifteen">15 miles away</Option>
                                     <Option value="ten">10 miles away</Option>
                                     <Option value="five">5 miles away</Option>
                                     <Option value="one">1 miles away</Option>
                                 </Select>
                             </InputGroup>
                             <br />
                             <InputGroup size="large" style={{ width: '100%' }} >
                                 <span>POSITION</span><br />
                                 <Input  placeholder="Position" style={{ width: '100%' }}/>
                              </InputGroup>
                             <br />
                         </div>
                         &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
                         <div style={{ width: '25%' }}>
                            <div>
                                <span>INCLUDE EXTERNAL PROFILES</span><br />
                                <div style={{height:5}} />
                                <Switch defaultChecked={false} onChange={this.onChange}
                                     className="switchStyle" checkedChildren="YES" unCheckedChildren="NO"/>
                             </div>
                             <div style={{height:21}} />
                             <div>
                                 <span style={{marginBottom:5}}>COMPLETED PROFILES ONLY?</span><br />
                                 <div style={{height:5}} />
                                 <Switch defaultChecked={false} onChange={this.onChange}
                                      className="switchStyle" checkedChildren="YES" unCheckedChildren="NO"/>
                              </div>
                              <div style={{height:21}} />
                             <div style={{width: '60%'}}>
                                    {/*See https://react.semantic-ui.com/modules/rating for proper implementation*/}
                                    <div>YOUR RATING: >1 STARS</div>
                                     <div style={{height:6}} />
                                    <input type='range' min={0} max={5} value={0} onChange={this.handleChange} />
                                     <div style={{height:6}} />
                                    <Rating rating={0} maxRating={5} />
                             </div>
                         </div>
                         <div style={{width: '25%'}}>
                         <CircleButton style={styles.circleButton} handleClick={this.closeDrawer} type="blue"   title="Search" />
                         </div>
                     </div>
                     </Segment>
                     <div>
                        {/*
                         <Candidates candidates={this.state.candidates}/>
                         */}
                     </div>
             </div>
        )
     }
}
