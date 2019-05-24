import {
 Route, Redirect, Switch, Link, IndexRoute 
} from 'react-router-dom';
import Posts from './ui/Posts';
import '../../stylesheets/APP.scss';

const Home = () => (
<h2>Home</h2>
)

let linkStyle={paddingTop: '10px', marginRight: '1em', paddingBottom: '10px', marginLeft: '1em'}

const App = () => (
    <div>
         <br/>
         <span style={linkStyle}><Link to="/postington/Posts">Posts</Link></span>
         <br/>
    <Redirect from="/" to="/postington/posts" />
    <Route exact path="/postington/posts" component={Posts} />
    </div>
)
export default App;
