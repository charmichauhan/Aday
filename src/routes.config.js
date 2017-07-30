import PublicSiteRoot from './components/PublicSiteRoot';
import App from './components/App';
import Root from './components/Root';
import Home from './components/Home';
import Schedule from './components/Scheduling';
import EmployeeView from './components/EmployeeView';
import Settings from './components/Settings';
import Positions from './components/Positions';
import MyWorkplace from './components/workplace/MyWorkplace'
import SharedWorkplace from './components/workplace/SharedWorkplace'
import TemplateViewJob from "./components/TemplateViewJob";
import Template from './components/Template';
import Team from './components/Team'

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
						// {
						// 	path: '/schedule/team/:workplaceId',
						// 	exact: true,
						// 	component: Schedule
						// },
					{
						path: '/schedule/team/',
						exact: true,
						component: Schedule
					},
					// {
                     //    path: '/schedule/employeeview/:workplaceId',
                     //    exact: true,
                     //    component: EmployeeView
					// },
					{
                        path: '/schedule/employeeview',
                        exact: true,
                        component: EmployeeView
					},
					{
                        path: '/schedule/employeeview/template',
                        exact: true,
                        component: Template
					},
                    {
                        path: '/schedule/team/template',
                        exact: true,
                        component: TemplateViewJob
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
						path: '/team',
						exact: true,
						component: Team
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
					},
					{
						path: '/settings',
						component: Settings
					},
					{
						path: '/positions',
						component: Positions
					}
				]
			}
				]
			}
		]
	}
]


export default routes