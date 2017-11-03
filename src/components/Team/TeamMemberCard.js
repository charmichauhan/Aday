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

        const phoneNumber = (j) => {
             let s2 = (""+j).replace(/\D/g, '');
             let m = s2.match(/^(\d{3})(\d{3})(\d{4})$/);
             return (
                 <Card.Meta>
                     (!m) ? null : "(" + m[1] + ") " + m[2] + "-" + m[3];
                </Card.Meta>
            )
        }

		return (
            <Card style={{width:250}} color='grey'>
                 {this.state.viewProfileDrawer && <ProfileDrawer
                   open={this.state.viewProfileDrawer}
                   openResumeDrawer={this.openResumeDrawer}
                   handleCloseDrawer={this.handleCloseDrawer}
                   userId={this.props.userId}
                 />}
                {this.state.viewResumeDrawer &&
                  <ResumeDrawer
                    open={this.state.viewResumeDrawer}
                    backProfileDrawer={this.backProfileDrawer}
                    userId={this.props.userId}/>
                }

		    	<Card.Content>
			      	<center>
					    <Image centered={true} size='small' shape='circular' src={avatarUrl} />
					</center>
					<div style={{height:15}} />
					<Card.Header style={{textAlign:"center"}}>
						<font size="5.5" className="_first-name">{firstName}</font>
							<br />
						<font size="5.5" className="_last-name">{lastName}</font>
					</Card.Header>

						<center className='rating card_body'>
							<div style={{height:7}} />
							<Rating icon='star' defaultRating={5} maxRating={5} />
							<div style={{height:15}} />
							<Card.Meta>
								<font size="2">
								{userEmail}
								<br/>
								{userPhoneNumber}
								</font>
							</Card.Meta>
							<div style={{height:7}} />
							<RaisedButton label="View Profile" backgroundColor="#0022A1" labelColor="#FFFFFF" onClick={this.handleDrawerOpen} style={{marginTop:3}}/>
							<div style={{height:7}} />
						</center>
		    	</Card.Content>
		    </Card>

		);
	}
}
const TeamMemberCard =  (TeamMemberCardComponent);

export default TeamMemberCard;
