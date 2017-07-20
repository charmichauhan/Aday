import React,{ Component } from 'react';
import Select from 'react-select';
import Avatar from 'material-ui/Avatar';
import Chip from 'material-ui/Chip';
import $ from 'webpack-zepto';
import ChipSelector from './ChipSelector';

const Managers = [
	{ key:0,label: 'Rahkeem Morris', value: 'Rahkeem Morris' },
	{ key:1,label: 'Archit Gupta', value: 'Archit Gupta' },
	{ key:2,label: 'Giovanni Conserva', value: 'Giovani Conservani' }
];
const styles ={
	chip :{
		margin:4
	}
}
export default class ManagerSelectOption extends Component{
  constructor(props){
    super(props);
    this.onChange=this.onChange.bind(this);
		this.handleRequestDelete=this.handleRequestDelete.bind(this);
    this.state = {
      options:Managers,
      value:[],
    }
  }
	onChange(value){
		this.setState({value:value});
	}
	handleRequestDelete(key){
		console.log(key);
		this.valueData=this.state.value;
		const valueToBeDeleted=this.valueData.map((value) =>value.key).indexOf(key);
		this.valueData.splice(valueToBeDeleted,1);
		this.setState({value:this.valueData});
	}
  render(){
    return(
      <Select
         placeholder="Select Manager"
         multi

         value={this.state.value}
         onChange={this.onChange}
         options={this.state.options}
  			 valueComponent={(value) => {
					return(
						<Chip

											 onRequestDelete={()=> this.handleRequestDelete(value.value.key)}
											 style={styles.chip}
									 >
									 <Avatar src="images/uxceo-128.jpg" />
										{value.value.label}
						</Chip>
				   );
			   }
			 }
			/>
    );
  }
}
