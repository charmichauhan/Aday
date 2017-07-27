import React, { Component } from 'react';
import { Divider, Input } from 'semantic-ui-react';
import TeamMemberCard from './TeamMemberCard'
import './App.css';

class App extends Component {
  constructor(props){
    super(props)
    this.state = {
      team_members: [
        {
          user: {
            firstName: "Eric",
            otherNames: "Wise",
            avatar: "https://pickaface.net/assets/images/slides/slide2.png",
          },
          content: "Seniority: 0003",
          color: "green"
        },
        {
          user: {
            firstName: "Unassigned",
            otherNames: "",
            avatar: "http://www.iiitdm.ac.in/img/bog/4.jpg",
          },
          content: "Leave this field empty to warn app credit!",
          color: "red"
        }
      ],

      job_shadowers: [
        {
          user: {
            firstName: "Eric",
            otherNames: "Wise",
            avatar: "https://pickaface.net/assets/images/slides/slide2.png",
          },
          content: "Seniority: 0003 . Current hours: 37",
          color: "green"
        },
        {
          user: {
            firstName: "Carol",
            otherNames: "Brown",
            avatar: "http://devilsworkshop.org/files/2013/01/enlarged-facebook-profile-picture.jpg",
          },
          content: "Current hours: 20 . You've earned 1 credit",
          color: "orange"
        }
      ]
    }
  }
  render() {
    return (
      <div className="App">
        <h5>TEAM MEMBERS (2)</h5>

        {
          this.state.team_members.map((tm, i)=>(
            <TeamMemberCard
              avatar={tm.user.avatar}
              firstName={tm.user.firstName}
              otherNames={tm.user.otherNames}
              content={tm.content}
              color={tm.color}
              key={i}
              />
            ))
        }

        <h5>JOB SHADOWERS (2)</h5>
        {
          this.state.job_shadowers.map((tm, i)=>(
            <TeamMemberCard
              avatar={tm.user.avatar}
              firstName={tm.user.firstName}
              otherNames={tm.user.otherNames}
              content={tm.content}
              color={tm.color}
              key={i}
              />
            ))
        }
        <Divider/>
        <h5>SHIFT DETAILS</h5>
        <Input fluid type="text"/>

        <h5>INSTRUCTIONS</h5>
        <p>Enter additional information abaout this shift</p>
      </div>
    );
  }
}

export default App;
