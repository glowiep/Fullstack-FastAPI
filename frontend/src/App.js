import { BrowserRouter as Router, Route, Switch, Link } from "react-router-dom";
import RecordAudio from "./components/RecordAudio";

function App() {
    return (
        <Router>
            <div>
                <nav>
                    <ul>
                        <li>
                            <Link to="/">Home</Link>
                        </li>
                        <li>
                            <Link to="/record">Go to Record Page</Link>
                        </li>
                    </ul>
                </nav>
                <Switch>
                    <Route path="/" exact component={() => <h1>Welcome to the App</h1>} />
                    <Route path="/record" component={RecordAudio} />
                </Switch>
            </div>
        </Router>
    );
}

export default App;
