import PublicSiteRoot from './components/PublicSiteRoot';
import App from './components/App';
import Root from './components/Root';
import Home from './components/Home';
import Schedule from './components/Scheduling';


import MyWorkplace from './components/workplace/MyWorkplace'
import SharedWorkplace from './components/workplace/SharedWorkplace'

import Roster from './components/team/Roster'
import Policies from './components/team/Policies'

import Certificates from './components/certifications/Certificates'

import AttendanceRequests from './components/attendance/AttendanceRequests'

import Login from './components/auth/Login'

const routes = [
	{
		component: Root,
		routes: [
			{
				component: PublicSiteRoot,
				routes: [
					{
						path: '/',
						exact: true,
						component: Home
					},
					{
						path: '/login',
						exact: true,
						component: Login
					},
			{
				component: App,
				routes: [
					{
						path: '/schedule/team',
						exact: true,
						component: Schedule
					},
					{
						path: '/schedule/manager',
						exact: true,
						component: Schedule
					},
					{
						path: '/workplaces/mine',
						exact: true,
						component: MyWorkplace
					},
					{
						path: '/workplaces/shared',
						exact: true,
						component: SharedWorkplace
					},
					{
						path: '/team/roster',
						exact: true,
						component: Roster
					},
					{
						path: '/team/policies',
						exact: true,
						component: Policies
					},
					{
						path: '/certifications/certificates',
						exact: true,
						component: Certificates
					},
					{
						path: '/attendance/requests',
						exact: true,
						component: AttendanceRequests
					}
				]
			}
				]
			}
		]
	}
]


export default routes