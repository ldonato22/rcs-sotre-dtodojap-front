import { useAuth0 } from "@auth0/auth0-react";
import { BrowserRouter as Router, Route} from 'react-router-dom'
import Home from './pages/Home'
import Report from './pages/Report'
import Inventory from './pages/Inventory'
import Income from './pages/Income'
import Expenses from './pages/Expenses'
import Navbar from './components/Navbar'

function App() {

  const { isAuthenticated } = useAuth0();

  return (
    <>
      <Navbar />
        {isAuthenticated ? (
          <Router>
                <Route path="/" exact={true} component={Home} />
                <Route path="/report" exact={true} component={Report} />
                <Route path="/inventory" exact={true} component={Inventory} />
                <Route path="/income" exact={true} component={Income} />
                <Route path="/expenses" exact={true} component={Expenses} />
          </Router>
          ) : (
          <Router>
            <Route path="/" exact={true} component={Home} />
          </Router>
        )}
    </>
  );
}

export default App;
