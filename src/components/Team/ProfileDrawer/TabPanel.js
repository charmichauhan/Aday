import React, {Component} from "react";
import { Tabs } from 'antd';
const TabPane = Tabs.TabPane;
import TeamMemberPositionDetails from './TeamMemberPositionDetails';
import MemberPersonelInformation from './MemberPersonelInformation';
import MemberPerformance from './MemberPerformance';
import 'antd/lib/tabs/style/css'
import {Image} from "semantic-ui-react";
export default class TabPanel extends Component {
  callBack = (key)=>{
    console.log(key);

}
  render(){
    const userDetails = this.props.userDetails;
    return(
      <div>
      <Tabs type="card" defaultActiveKey="1">
        <TabPane tab={<span>
          <Image src="/images/Sidebar/positions.png" size="mini"/>
        </span>} key="1">
          <TeamMemberPositionDetails
            userDetails={userDetails}
          />
        </TabPane>
        <TabPane tab={<span>
          <Image src="/images/Sidebar/tab-user.png" size="mini"/>
        </span>}  key="2">
          <MemberPersonelInformation/>
        </TabPane>
        <TabPane tab={<span>
          <Image src="/images/Sidebar/graph.png" size="mini"/>
        </span>} key="3">
          <MemberPerformance/>
        </TabPane>
      </Tabs>
      </div>
    )
  }
}
