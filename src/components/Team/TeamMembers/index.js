import React, { Component } from 'react'
import TeamMemberCard from './../TeamMemberCard'
import { gql,graphql,compose } from 'react-apollo';
import { Image, Button, Icon, Card, Header, Rating } from 'semantic-ui-react'

const initialState = {
	//stub
};

class TeamMembersComponent extends Component {
	constructor(props) {
		super(props);
		this.state = {
			...initialState,
			team_members: props.team_members
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
    if (this.props.allTeamMembers.loading) {
      return (<div>Loading</div>)
    }
    let teamMembers = this.props.allTeamMembers && this.props.allTeamMembers.allEmployees.edges;
    let mappedTeamMembers = [];
    if(localStorage.getItem("workplaceId")){
    	teamMembers.map((value , i) => {
			if ( value['node']['primaryWorkplace'] == localStorage.getItem("workplaceId") ) {
				mappedTeamMembers.push(value)
			}
    	})
    } else {
		mappedTeamMembers = teamMembers;
    }

		return (
			<div>
				<br/><br/>
				<Card.Group itemsPerRow="5">
					{
            			mappedTeamMembers.map((m, i)=>
            				    <TeamMemberCard key={i} member={m['node']['userByUserId'] } userId={m['node']['userByUserId']['id']}/>
            			)
					}
				</Card.Group>
			</div>
		);
	}
}

const allUsers = gql`
    query allEmployees($corporationId: Uuid! ){
        allEmployees(condition: { corporationId: $corporationId, isManager: false }) {
            edges{
                node{
                  id
                  primaryWorkplace
                  userByUserId{
                    id
                    firstName
                    lastName
                    avatarUrl
                    userPhoneNumber
                    userEmail
                  }
                }
            }
        }
    }
    `

const TeamMembers = graphql(allUsers, {
  options: (ownProps) => ({
    variables: {
      corporationId: localStorage.getItem('corporationId')
    }
  }),
  name:"allTeamMembers"
},
)(TeamMembersComponent);
export default TeamMembers
