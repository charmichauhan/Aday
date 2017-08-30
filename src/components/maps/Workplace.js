import React, { Component } from 'react';
import { Button } from 'semantic-ui-react';
import '../Scheduling/style.css';
import { withGoogleMap, GoogleMap, Marker } from "react-google-maps";
import _ from 'lodash';

import './maps.css'

const WorkplaceGoogleMap = withGoogleMap(props => (
  <GoogleMap
    ref={props.onMapLoad}
    defaultZoom={5}
    defaultCenter={{ lat: -25.363882, lng: 131.044922 }}
    onClick={props.onMapClick}
  >
    {props.markers.map((marker, index) => (
      <Marker
        {...marker}
        onRightClick={() => props.onMarkerRightClick(index)}
      />
    ))}
  </GoogleMap>
));

export default class WorkplaceMap extends Component {
	render() {
		console.log(this.props.address);
		return (
			<div className="workplace-map">
				<WorkplaceGoogleMap
			    containerElement={
			      <div style={{ height: '80%', padding:7}} />
			    }
			    mapElement={
			      <div style={{ height: '100%', borderWidth: 2, borderColor:'#4A4A4A'}} />
			    }
			    onMapLoad={_.noop}
			    onMapClick={_.noop}
			    markers={[]}
			    onMarkerRightClick={_.noop}
			  />
				{/*<div> {this.props.address} </div>*/}
				<Button className="btn-image" style={{marginLeft:5}}>
					Get Directions
				</Button>
			</div>
		);
	}
}
