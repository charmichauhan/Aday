import React,{ Component } from 'react';
import Select from 'react-select';
import Avatar from 'material-ui/Avatar';
import Chip from 'material-ui/Chip';
import $ from 'webpack-zepto';
import ChipSelector from './ChipSelector';
import './select.css';

const Managers = [
	{ key:0,label: 'Rahkeem Morris', value: 'Rahkeem Morris' },
	{ key:1,label: 'Archit Gupta', value: 'Archit Gupta' },
	{ key:2,label: 'Giovanni Conserva', value: 'Giovani Conservani' }
];
const styles ={
	chip :{
		margin:4,
		width:'90%'
	},
      wrapper: {
        display: 'flex',
        flexWrap: 'wrap',
				width:'100%'
  },
};


export default class ManagerSelectOption extends Component{
  constructor(props){
    super(props);
    this.onChange=this.onChange.bind(this);
		this.handleRequestDelete=this.handleRequestDelete.bind(this);
    this.state = {
      options:Managers,
      managerValue:[],
    }
  }
	onChange(value){
		const {formCallBack}=this.props;
		const updatedState = {
			managerValue:value
		}
		this.setState(updatedState);
		formCallBack(updatedState);
	}
	handleRequestDelete(key){
		const { formCallBack }=this.props;
		this.valueData=this.state.managerValue;
		const valueToBeDeleted=this.valueData.map((value) =>value.key).indexOf(key);
		this.valueData.splice(valueToBeDeleted,1);
		const updatedState = {
			managerValue:this.valueData
		}
		this.setState(updatedState);
		formCallBack(updatedState);
	}
  render(){
    return(
      <Select
			   className='sectionTest'
			   name="managers"
         multi
   	 		 autosize="false"
				 value={this.state.managerValue}
         onChange={this.onChange}
         options={this.state.options}
  			 valueComponent={(value) => {
					return(
					  <div style={styles.wrapper}>
						   <Chip
											 onRequestDelete={()=> this.handleRequestDelete(value.value.key)}
											 style={styles.chip}
									 >
									 <Avatar src="images/uxceo-128.jpg" />
										{value.value.label}
						  </Chip>
						</div>
				   );
			   }
			 }
			/>
    );
  }
}
