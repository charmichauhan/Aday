import React,{Component} from 'react';
import {Header,Image,Button,Divider,Segment,Label,Input,Icon,Form} from 'semantic-ui-react';
import {Scrollbars} from 'react-custom-scrollbars';
import momment from 'moment';
import ShiftDaySelector from '../../../DaySelector/ShiftDaySelector.js'

export default class AddShiftForm extends Component{
  render(){
    return(
      <div>
      <Header as = 'h1' style={{textAlign: 'center' , color: '#0022A1'}} >
        ADD SHIFT
        <Image
          floated="left"
          src="/images/Assets/Icons/Icons/job-deck.png"
          style= {{marginTop:'0px',width:'35px'}}
        />
        <Image
          floated="right"
          src="/images/Assets/Icons/Buttons/delete-round-small.png"
          shape="circular"
          style={{marginTop:'0px',right:'-11%',width:'50px'}}
          onClick={this.props.closeFunc}
        />
      </Header>
      <Segment raised style ={{marginTop:'2%'}}>
       <Scrollbars
          style = {{height:'72.4vh',marginBottom:'20px',paddingBottom:'20px'}} >
           <Form>
            <div>
              <p style = {{fontSize:'20px',fontStyle:'normal',color:'rgba(0, 0, 0, 0.87)'}}>WORKPLACE</p>
              <Input placeholder="CHAO CENTER" icon = {<Icon name = "sort" />} style={{marginTop:'-2%',width:'95%',backgroundColor:'lightgrey'}} />
            </div>
            <div>
              <p style = {{fontSize:'20px',fontStyle:'normal',color:'rgba(0, 0, 0, 0.87)'}}>POSITION</p>
              <Input placeholder="SELECT POSITION" icon = {<Icon name = "sort" />} style={{marginTop:'-2%',width:'95%',backgroundColor:'lightgrey'}} />
            </div>
            <div>
             <p style = {{fontSize:'20px',fontStyle:'normal',color:'rgba(0, 0, 0, 0.87)'}}>SHIFT DAY(S) OF THE WEEK</p>
             <ShiftDaySelector />
            </div>
          </Form>
        </Scrollbars>
       </Segment>
      </div>
    );
  }
}
