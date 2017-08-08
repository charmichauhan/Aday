import PublicSiteRoot from './components/PublicSiteRoot';
import App from './components/App';
import Root from './components/Root';
import Home from './components/Home';
import Schedule from './components/Scheduling';
import Settings from './components/Settings';
import Positions from './components/Positions';
import MyWorkplace from './components/workplace/MyWorkplace'
import Hiring from './components/Hiring'
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
				// 	{
            // path: '/schedule/employeeview',
            // exact: true,
            // component: EmployeeView
				// 	},
					{
            path: '/schedule/template',
            exact: true,
            component: Template
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
						path: '/hiring',
						exact: true,
						component: Hiring
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
