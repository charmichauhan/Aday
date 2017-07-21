import React,{Component} from 'react';
import {Header,Image,Button,Divider,Segment,Label,Input,Icon} from 'semantic-ui-react';
//import ShiftDaySelector from './ShiftDaySelector';

export default class AddShiftForm extends Component{
  render(){
    return(
      <div>
        <Header as = 'h2' style={{textAlign: 'center'   , color: '#0022A1'}} >
          ADD SHIFT
          <Image
            floated="left"
            size="miny"
            src="/images/Assets/Icons/Icons/job-deck.png"
            style= {{height: '3.5%' , width: '5%' ,left: '-1%', marginTop: '-1%'}}
          />
          <Image
            floated="right"
            src="/images/Assets/Icons/Buttons/delete-round-small.png"
            shape="circular"
            style={{marginTop: '-1%' , right: '-12%',height:'2%',width:'8%'}}
          />
        </Header>
        <Segment raised style ={{marginTop:'4%'}}>
           <div>
             <p style = {{fontSize:'20px',fontStyle:'normal',color:'rgba(0, 0, 0, 0.65)'}}>WORKPLACE</p>
             <Input placeholder="CHAO CENTER" icon = {<Icon name = "sort" />} style={{marginTop:'-2%',width:'100%',backgroundColor:'lightgrey'}} />
           </div>
           <div>
             <p style = {{fontSize:'20px',fontStyle:'normal',color:'rgba(0, 0, 0, 0.65)'}}>SELECT TEMPLATE</p>
             <Input placeholder="SELECT TEMPLATE" icon = {<Icon name = "sort" />} style={{marginTop:'-2%',width:'100%',backgroundColor:'lightgrey'}} />
           </div>
           <div>
             <p style = {{fontSize:'20px',fontStyle:'normal',color:'rgba(0, 0, 0, 0.65)'}}>POSITION</p>
             <Input placeholder="POSITION" icon = {<Icon name = "sort" />} style={{marginTop:'-2%',width:'100%',backgroundColor:'lightgrey'}} />
           </div>
           <div>
             <p style = {{fontSize:'20px',fontStyle:'normal',color:'rgba(0, 0, 0, 0.65)'}}>SHIFT DAY(S) OF THE WEEK</p>

           </div>
        </Segment>
      </div>
    );
  }
}
