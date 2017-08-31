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

		return (
		    <Card>
          {this.state.viewProfileDrawer && <ProfileDrawer
            open={this.state.viewProfileDrawer}
            openResumeDrawer={this.openResumeDrawer}
            handleCloseDrawer={this.handleCloseDrawer}
            userId={this.props.userId}

          />}
          {this.state.viewResumeDrawer &&
          <ResumeDrawer open={this.state.viewResumeDrawer} backProfileDrawer={this.backProfileDrawer} userId={this.props.userId}/>}
		    	<Card.Content>
			      	<center>
					    <Image centered='true' size='small' shape='circular' src={avatarUrl} />
					</center>



					<br/>
		        	<Card.Description>
						<center>
							<font size="5.5" className="first_name">{firstName}</font>
							<span> </span>
							<font size="5.5" className="last_name">{lastName}</font>
						</center>
					<Card.Content>
						<center className='rating card_body'>
							<Rating icon='star' defaultRating={5} maxRating={5} />
							<br/>
							<br/>
							<font size="3">
							{userPhoneNumber}
							<br/>
							{userEmail}
							<br/>
							</font>
							<br/>
							<Button color='blue' onClick={this.handleDrawerOpen}>View Profile</Button>
							<br/>
						</center>
					</Card.Content>
		        	</Card.Description>
		    	</Card.Content>
		    </Card>
		);
	}
}
const TeamMemberCard =  (TeamMemberCardComponent);

export default TeamMemberCard;
