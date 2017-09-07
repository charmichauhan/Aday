import React, {Component} from "react";
import {Tabs} from "antd";
import TeamMemberPositionDetails from "./TeamMemberPositionDetails";
import MemberPersonelInformation from "./MemberPersonelInformation";
import MemberPerformance from "./MemberPerformance";
import MemberSurveyForm from "./MemberSurveyForm";
import "antd/lib/tabs/style/css";
import {Image} from "semantic-ui-react";
const TabPane = Tabs.TabPane;
export default class TabPanel extends Component {
  callBack = (key) => {
    console.log(key);

  }

  render() {
    const userDetails = this.props.userDetails;
    const releventPositionsQuery = this.props.releventPositionsQuery;
    const releventfilteredPositions = this.props.releventfilteredPositions;
    return (
      <div>
        <Tabs type="card" defaultActiveKey="1">
          <TabPane tab={<span>
          <Image src="/images/Sidebar/positions.png" size="mini"/>
        </span>} key="1">
            <TeamMemberPositionDetails
              userDetails = {userDetails}
              releventPositionsQuery = {releventPositionsQuery}
              releventfilteredPositions = {releventfilteredPositions}
            />
          </TabPane>
          <TabPane tab={<span>
          <Image src="/images/Sidebar/tab-user.png" size="mini"/>
        </span>} key="2">
            <MemberPersonelInformation
              userDetails={userDetails}
            />
          </TabPane>
          <TabPane className="performance-tab" tab={<span>
          <Image src="/images/Sidebar/graph.png" size="mini"/>
        </span>} key="3">
            <MemberPerformance/>
          </TabPane>
          <TabPane tab={<span>
            <Image src="/images/Sidebar/folder.png" size="mini"/>
            </span>} key="4">
            <MemberSurveyForm />
          </TabPane>
        </Tabs>
      </div>
    )
  }
}
