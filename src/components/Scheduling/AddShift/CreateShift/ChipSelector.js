import React from 'react';
import Avatar from 'material-ui/Avatar';
import Chip from 'material-ui/Chip';
import FontIcon from 'material-ui/FontIcon';
import SvgIconFace from 'material-ui/svg-icons/action/face';
import {blue300, indigo900} from 'material-ui/styles/colors';

const styles = {
  chip: {
    margin: 4,
  }
}
export default class ChipSelector extends React.Component {
  constructor(props){
    super(props);


  }
  render() {
     const{value,key,label} = this.props;
    return (
      <Chip
                 key={key}
                 onRequestDelete={()=> this.props.handleRequestDelete(key)}
                 style={styles.chip}
             >
             <Avatar src="images/uxceo-128.jpg" />
              {label}
      </Chip>
    );
  }
}
