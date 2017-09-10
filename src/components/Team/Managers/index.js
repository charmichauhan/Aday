import React, { Component } from 'react'
import TeamMemberCard from './../TeamMemberCard'
import { gql,graphql,compose } from 'react-apollo';
import { Image, Button, Icon, Card, Header, Rating } from 'semantic-ui-react'
var Halogen = require('halogen');

const initialState = {
	//stub
};

class ManagersComponent extends Component {
	constructor(props) {
		super(props);
		this.state = {
			...initialState,
			team_members: props.managers,
		};
	}

	handleDeleteClick = (event) => {
		event.preventDefault();
		console.log('Delete button clicked');
	};

	handleDrawerSubmit = (event) => {
		event.preventDefault();
		this.setState({ open: false });
	};

	closeDrawer = (event) => {
		event.preventDefault();
		this.setState({ open: false });
	};

	openBrandDrawer = (brand) => {
		this.setState({ open: true, drawerBrand: brand });
	};


	render() {
    if (this.props.allManagers.loading) {
      return (<div><Halogen.SyncLoader color='#00A863'/></div>)
    }
    let allManagers=[];
    if(this.props.workplaceId!=""){
      let allManagersData = this.props.allManagers && this.props.allManagers.allManagers.edges;
      allManagers= allManagersData.filter((item)=>{
        if(item['node']['workplaceId'] == this.props.workplaceId){
          return true
        }
      })
    }
		return (
			<div>
				<br/><br/>
				<Card.Group itemsPerRow="5">
					{
						allManagers.map((m, i)=> <TeamMemberCard key={i} member={m['node']['userByUserId']}/>)
					}
				</Card.Group>
			</div>
		);
	}
}

const allManagers = gql`query allManagers{
  allManagers{
    edges{
      node{
        id
        nodeId
        workplaceId
        userByUserId{
          id
          avatarUrl
          firstName
          lastName
          userEmail
          userPhoneNumber
        }
      }
    }
  }
}`

const Managers = graphql(allManagers, {
  name: "allManagers"
})(ManagersComponent);
export default Managers;
