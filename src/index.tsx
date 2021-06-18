import ReactDOM from 'react-dom';
import { HashRouter, Route, Switch } from 'react-router-dom';

import Main from './demo/layouts/Main';
import TestRoutes from './demo/test/TestRoutes';

// Reset styles so they do not affect development of the React component.
import 'modern-normalize/modern-normalize.css';
import './demo/preflight.css';

import './demo/index.css';

ReactDOM.render(
  <HashRouter>
    <Switch>
      <Route path="/" render={(props) => <Main {...props} />} />
      <Route path="/test" component={TestRoutes} />
    </Switch>
  </HashRouter>,
  document.getElementById('root'),
);
