import React from 'react';
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';
import SettingsRoute from './SettingsRoute';

const SettingsWrap = () => {
	return (
		<Router>
			<Switch>
				<Route path="/">
					<SettingsRoute />
				</Route>
			</Switch>
		</Router>
	);
};

export default SettingsWrap;
