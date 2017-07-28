import React from 'react'
import { renderRoutes } from 'react-router-config'

const PublicSiteRoot = ({ route }) => (
	<div>
		{
			renderRoutes(route.routes)
		}
	</div>
);

export default  PublicSiteRoot
