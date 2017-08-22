import React, {Component} from "react";
import Drawer from "material-ui/Drawer";
import IconButton from "material-ui/IconButton";
import { Header, Icon, Table, Image, List ,Divider} from 'semantic-ui-react';
import FlatButton from 'material-ui/FlatButton';
import moment from "moment";
import {find, pick} from "lodash";
import {leftCloseButton} from "../../styles";
import '../team.css';
const uuidv4 = require('uuid/v4');

export default class ResumeDrawer extends Component {

  render() {
    const {
      shift = {},
      width = 600,
      openSecondary = true,
      docked = false,
      open
    } = this.props;
    return (
      <Drawer docked={docked} width={width}
              openSecondary={openSecondary}
              onRequestChange={this.handleCloseDrawer}
              open={open}>
        <div className="drawer-section">
          <div className="col-md-12">
            <FlatButton label="Back" onClick={this.props.backProfileDrawer}
                        icon={<Icon name="chevron left" className="floatLeft" /> } />
            <h5 className="confirm-popup">ALBERTO KELLY </h5>
          </div>
          <div className="drawer-content scroll-div">
            <div className="member-list">
              Main Content
            </div>
          </div>
          <div className="drawer-footer">
            Footer
          </div>
        </div>
      </Drawer>
    );
  };
}


/* Hidden Components Until They Are Connected

 <div className="drawer-right">
 <RaisedButton label="History" onClick={this.handleShiftHistoryDrawer} />
 </div>

 <div className="member-list">
 <h5>JOB SHADOWERS ({jobShadowers.length})</h5>
 {jobShadowers && jobShadowers.map((tm, i) => (
 <TeamMemberCard
 avatarUrl={tm.user.avatar}
 firstName={tm.user.firstName}
 lastName={tm.user.otherNames}
 content={tm.content}
 key={i}
 id={i}
 users={users}
 color={this.borderColor(tm.status) + 'Border'}
 handleRemove={() => this.removeJobShadower(i)}
 onSelectChange={this.setJobShadower}
 />
 ))}
 <div className="btn-member">
 <RaisedButton label="ADD JOB SHADOWER" onClick={this.addJobShadower} />
 </div>
 </div>
 */

// const DrawerHelperComponent = compose(graphql(deleteShiftMutation, {
//     props: ({ownProps, mutate}) => ({
//       deleteShiftById: (clientMutationId, id) => mutate({
//         variables: {clientMutationId, id},
//         updateQueries: {
//           allShiftsByWeeksPublished: (previousQueryResult, {mutationResult}) => {
//             let newEdges = [];
//             previousQueryResult.allShifts.edges.map((value) => {
//               if (value.node.id !== mutationResult.data.deleteShiftById.shift.id) {
//                 newEdges.push(value)
//               }
//             });
//             previousQueryResult.allShifts.edges = newEdges;
//             return {allShifts: previousQueryResult.allShifts};
//           }
//         }
//       })
//     })
//   }),
//   graphql(updateShiftMutation, {name: 'updateShift'}),
//   graphql(allShiftMarkets, {
//     name: 'shiftMarkets',
//     options: (ownProps) => ({variables: {shiftId: ownProps.shift && ownProps.shift.id}})
//   }),
//   graphql(allUsersQuery, {
//     name: 'teamMembers',
//     options: (ownProps) => ({variables: {positionId: ownProps.shift && ownProps.shift.positionByPositionId.id}}),
//     props: ({teamMembers, ownProps}) => ({teamMemberNodes: teamMembers.allJobs && teamMembers.allJobs.edges})
//   }))
// (DrawerHelper);
//
// export default DrawerHelperComponent;
