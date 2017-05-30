import React from 'react'
import { renderRoutes } from 'react-router-config'


import Menu from './Menu'
import Footer from './Footer'

const PublicSiteRoot = ({ route }) => (
	<div>
		<Menu/>
		{
			renderRoutes(route.routes)
		}
		<Footer/>
	</div>
)

export default  PublicSiteRoot
