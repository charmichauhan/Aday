import PublicSiteRoot from './components/PublicSiteRoot';
import App from './components/App';
import Root from './components/Root';
import Home from './components/Home';
import Schedule from './components/Scheduling';
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
					}
				]
			}
				]
			}
		]
	}
]


export default routes