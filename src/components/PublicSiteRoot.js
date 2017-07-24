import React from 'react'
import { renderRoutes } from 'react-router-config'


import Menu from './Menu'
import Footer from './Footer'

const PublicSiteRoot = ({ route }) => (
	<div>
		<p/>
		{
			renderRoutes(route.routes)
		}
	</div>
)

export default  PublicSiteRoot
