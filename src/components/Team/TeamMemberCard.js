import React, { Component } from 'react'
import ProfileDrawer from'./ProfileDrawer/ProfileDrawer';
import ResumeDrawer from './ProfileDrawer/ResumeDrawer';
import { Image, Button, Icon, Card, Rating, Header } from 'semantic-ui-react'
import RaisedButton from 'material-ui/RaisedButton';
import "./team-member-card.css"
import { Dropdown, Menu, Select,message} from 'antd';

class TeamMemberCardComponent extends Component {
  constructor(props){
    super(props);
    this.state = ({
      viewProfileDrawer:false,
      viewResumeDrawer:false
    });
  }

  handleDrawerOpen = () => {
    this.setState({viewProfileDrawer:true});
  };

  handleCloseDrawer = () => {
    this.setState({viewProfileDrawer:false});
  };

  openResumeDrawer = () => {
    this.setState({viewProfileDrawer:false,viewResumeDrawer:true})
  };

  backProfileDrawer = () => {
    this.setState({viewProfileDrawer:true,viewResumeDrawer:false})
  };
  handleMenu1Click(e) {
    message.info('Click on menu item.');
    console.log('click', e);
  }

  render() {
		const {
			firstName,
            lastName,
            userEmail,
			avatarUrl,
            userPhoneNumber
		} = this.props.member;

        const phoneNumber = () => {
             let s2 = (""+this.props.children).replace(/\D/g, '');
             let m = s2.match(/^(\d{3})(\d{3})(\d{4})$/);
             return (
                 <Card.Meta>
                     (!m) ? null : "(" + m[1] + ") " + m[2] + "-" + m[3];
                </Card.Meta>
            )
        }

		return (
		    <Card style={{width:250}}>
                 {this.state.viewProfileDrawer && <ProfileDrawer
                                                                                open={this.state.viewProfileDrawer}
                                                                                openResumeDrawer={this.openResumeDrawer}
                                                                                handleCloseDrawer={this.handleCloseDrawer}
                                                                                userId={this.props.userId}
                                                                            />}
                {this.state.viewResumeDrawer && <ResumeDrawer
                                                                                open={this.state.viewResumeDrawer} backProfileDrawer={this.backProfileDrawer} userId={this.props.userId}/>}
                <Image src={avatarUrl} />
		    	<Card.Content className='profile-card'>
                     <Card.Header style={{textAlign:"center"}}>
                         <font size="5.5" className="_first-name">{firstName}</font>
                             <br />
                         <font size="5.5" className="_last-name">{lastName}</font>
                     </Card.Header>
		        	<Card.Description>
						<center className='card_body'>
                            <div>
							    <Rating icon='star' defaultRating={5} maxRating={5}/>
                            </div>
                            <Card.Meta>
    							<font size="2">
    							{userEmail}
    							<br/>
                                <phoneNumber>{userPhoneNumber}</phoneNumber>
    							<br/>
    							</font>
                            </Card.Meta>
                            <RaisedButton label="View Profile" backgroundColor="#0022A1" labelColor="#FFFFFF" onClick={this.handleDrawerOpen} style={{marginTop:3}}/>
							<br/>
						</center>
		        	</Card.Description>
		    	</Card.Content>
		    </Card>
		);
	}
}
const TeamMemberCard =  (TeamMemberCardComponent);

export default TeamMemberCard;
/*
  * deprecated: circle avatar for header of the card
<center>
    <Image centered='true' size='small' shape='circular' src={avatarUrl} />
</center>
*/
