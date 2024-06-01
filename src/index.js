import React from "react";
import ReactDOM from "react-dom";
import "./index.css";
import * as serviceWorker from "./serviceWorker";
import App from "./App";
import reportWebVitals from "./reportWebVitals";

ReactDOM.render(
	<React.StrictMode>
		<App />
	</React.StrictMode>,
	document.getElementById("root")
);

if ("serviceWorker" in navigator) {
	serviceWorker.register();

	navigator.serviceWorker
		.register("/service-worker2.js")
		.then(function (registration) {
			console.log("Registration successful, scope is:", registration.scope);
			console.log(registration);
			console.log(navigator);
		})
		.catch(function (error) {
			console.log("Service worker registration failed, error:", error);
		});
	navigator.serviceWorker.addEventListener("message", function (event) {
		console.log(event);
	});
}
reportWebVitals();

// navigator.serviceWorker.getRegistrations().then(function (registrations) {
// 	for (let registration of registrations) {
// 		registration.unregister();
// 	}
// });
