import React,{Component} from 'react';
import Autocomplete from 'react-toolbox/lib/autocomplete';


export default class AutocompleteTest extends React.Component {
  state = {
    simple: 'Spain',
    multiple: ['ES-es', 'TH-th']
  };

  handleMultipleChange = (value) => {
    this.setState({multiple: value});
  };

  render () {
    const countriesObject = {'ES-es': 'Spain', 'TH-th': 'Thailand', 'EN-gb': 'England', 'EN-en': 'USA'};
    return (
      <div>
        <Autocomplete
          direction="down"
          onChange={this.handleMultipleChange}
          label="Choose countries"
          source={countriesObject}
          value={this.state.multiple}
        />
     </div>
    );
  }
}
