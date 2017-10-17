import PublicSiteRoot from './components/PublicSiteRoot';
import App from './components/App';
import Root from './components/Root';
import Home from './components/Home';
import Schedule from './components/Scheduling';
import Settings from './components/Settings';
import Positions from './components/Positions';
import MyWorkplace from './components/workplace/MyWorkplace';
import Listing from './components/workplace/Listing';
import Hiring from './components/Hiring';
import Team from './components/Team';
import Certificates from './components/certifications/Certificates';
import Attendance from './components/Attendance';
import Login from './components/auth/Login';

const routes = [
	{
		component: Root,
		routes: [
			{
				component: PublicSiteRoot,
				routes: [
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
						path: '/',
						exact: true,
						component: Schedule
					},
				    {
					 	path: '/schedule/team/:date',
					 	exact: true,
					 	component: Schedule
				 	},
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
						path: '/workplaces/listing/:workplaceId/:opportunityId',
						exact: true,
						component: Listing
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
						path: '/attendance',
						component: Attendance
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
