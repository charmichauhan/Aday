import React, { Component } from 'react';
import { Button } from 'semantic-ui-react';
import '../Scheduling/style.css';
import { withGoogleMap, GoogleMap, Marker } from "react-google-maps";
import _ from 'lodash';
import './maps.css'

const WorkplaceGoogleMap = withGoogleMap(props => (
  <GoogleMap
    ref={props.onMapLoad}
    defaultZoom={15}
    defaultCenter={{ lat: 42.364109, lng: -71.124184 }}
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
		// console.log(this.props.address);
		return (
			<div className="workplace-map">
				<WorkplaceGoogleMap
			    containerElement={
			      <div style={{ height: '72%', padding:5}} />
			    }
			    mapElement={
			      <div className="map-element" />
			    }

			    onMapLoad={_.noop}
			    onMapClick={_.noop}
			    markers={[]}
			    onMarkerRightClick={_.noop}
			  />

				{/*<div> {this.props.address} </div>*/}
                {/*hard coded, to be updated later ... */}
                <div style={{marginLeft:10, marginTop: 5}}>
                    <text className="address">25 Harvard Way</text>
                    <br></br>
                    <text className="address">Boston, MA 02163</text>
                </div>

				<a className="button"  href="https://goo.gl/maps/iX5b61ZiSr72" target="_newtab">
					<text className="btn-text">GET DIRECTIONS</text>
				</a>
			</div>
		);
	}
}
