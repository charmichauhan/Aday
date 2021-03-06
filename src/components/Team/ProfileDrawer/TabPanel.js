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

    return (
      <div>
        <Tabs type="card" defaultActiveKey="1">
          <TabPane tab={<span>
          <Image src="/images/Sidebar/positions.png" style={{width:21}}/>
        </span>} key="1">
            <TeamMemberPositionDetails
              userDetails = {userDetails}
              releventPositionsQuery={releventPositionsQuery}
            />
          </TabPane>
          <TabPane tab={<span>
          <Image src="/images/Sidebar/tab-user.png" style={{width:21}}/>
        </span>} key="2">
            <MemberPersonelInformation
              userDetails={userDetails}
            />
          </TabPane>
          <TabPane tab={<span>
          <Image src="/images/Sidebar/graph.png" style={{width:21}}/>
        </span>} key="3">
            <MemberPerformance/>
          </TabPane>
        </Tabs>
      </div>
    )
  }
}


/*
 <TabPane tab={<span>
            <Image src="/images/Sidebar/folder.png" size="mini"/>
            </span>} key="4">
            <MemberSurveyForm />
          </TabPane>
*/
