import "./App.css";
import firebase from "firebase/app";

import { BrowserRouter as Router, Switch, Route, Link } from "react-router-dom";

import Privacy from "./pages/PrivacyPolicy/";
import Terms from "./pages/TermsOfService/";

import AppAuth from "./account/AppAuth";

try {
	if (!firebase.apps.length) {
		firebase.initializeApp();
	}
} catch (error) {
	console.log(error);
}

function App() {
	return (
		<div className="App">
			<header className="App-header">
				<svg
					style={{ position: "absolute", top: "-85px", left: "-5px" }}
					height="150"
					width={window.innerWidth / 3}
				>
					<ellipse cx="75" cy="75" rx="150" ry="75" fill="#000000" />
				</svg>
				{
					//  Header
				}
				<svg
					style={{ position: "absolute", top: "-95px", left: "155px" }}
					height="150"
					width={window.innerWidth / 3}
				>
					<ellipse cx="75" cy="75" rx="150" ry="75" fill="#000000" />
				</svg>
				<svg
					style={{ position: "absolute", top: "-95px", right: "0px" }}
					height="150"
					width="950"
				>
					<ellipse cx="950" cy="75" rx="950" ry="75" fill="#000000" />
				</svg>
				<h2
					style={{
						fontFamily: "courier",
						fontWeight: "600",
						fontSize: "28px",
						marginLeft: "10px",
						color: "#DDCCFF",
						textShadow: "1px 1px 15px #DDCCFF,1px 1px 15px #DDCCFF",
						position: "relative",
						width: "250px",
						top: "-10px",
					}}
				>
					OhanaRPG
				</h2>

				<Router>
					<Switch>
						<Route path={`/privacy`} component={Privacy} />
						<Route path={`/termsofservice`} component={Terms} />
						<AppAuth />
					</Switch>
				</Router>
			</header>
		</div>
	);
}

export default App;
