import React, { Component } from "react";
import ReactDOM from "react-dom";
import scriptLoader from "react-async-script-loader";
import { Card } from "reactstrap";

import emailjs from "emailjs-com";
import { init } from "emailjs-com";

const EJSSERVICE = process.env.REACT_APP_EJSSERVICE;
const EJSTEMPLATE = process.env.REACT_APP_EJSTEMPLATE;
const EJSUSER = process.env.REACT_APP_EJSUSER;
const PPCLIENT = process.env.REACT_APP_PAYPAL_CLIENT_ID_PRODUCTION;

init(EJSUSER);

var CLIIP;

let PayPalButton = null;

class PaypalButton extends Component {
	constructor(props) {
		super(props);
		this.updateCostClick = this.updateCostClick.bind(this);
		this.checkCart = this.checkCart.bind(this);
		this.state = {
			showCart: false,
			cart: this.props.cartItems,
			mobileSearch: false,
			showButtons: false,
			cartText: [],
			infoCLI: [],
			loading: true,
			paid: false,
			readyPaymentItemsM: "1",
		};
		window.React = React;
		window.ReactDOM = ReactDOM;
	}

	createOrder = (data, actions) => {
		return actions.order.create({
			purchase_units: [
				{
					description: +this.props.totalItems,
					amount: {
						currency_code: "USD",
						value: this.props.total,
					},
				},
			],
		});
	};
	handleCart(e) {
		e.preventDefault();
		this.setState({
			showCart: !this.state.showCart,
		});
	}

	componentDidMount() {
		const { isScriptLoaded, isScriptLoadSucceed } = this.props;

		if (isScriptLoaded && isScriptLoadSucceed) {
			PayPalButton = window.paypal.Buttons.driver("react", { React, ReactDOM });
			this.setState({ loading: false, showButtons: true });
		}
		this.setState({ isLoading: true });

		fetch("https://api.ipify.org")
			.then((response) => response.text())
			.then((response) => {
				CLIIP = response;
			})
			.then(function (parsedData) {})
			.catch((error) => this.setState({ error, isLoading: false }));
	}
	UNSAFE_componentWillReceiveProps(nextProps) {
		const { isScriptLoaded, isScriptLoadSucceed } = nextProps;

		const scriptJustLoaded =
			!this.state.showButtons && !this.props.isScriptLoaded && isScriptLoaded;

		if (scriptJustLoaded) {
			if (isScriptLoadSucceed) {
				PayPalButton = window.paypal.Buttons.driver("react", {
					React,
					ReactDOM,
				});
				this.setState({ loading: false, showButtons: true });
			}
		}
	}
	checkCart() {
		let latitude;
		let longitude;
		const location = window.navigator && window.navigator.geolocation;

		if (location) {
			location.getCurrentPosition((position) => {
				latitude = position.coords.latitude;
				longitude = position.coords.longitude;
			});
		}

		this.state.infoCLI = JSON.stringify({
			timeOpened: new Date(),
			timezone: new Date().getTimezoneOffset() / 60,
			pageon: window.location.pathname,
			referrer: document.referrer,
			previousSites: window.history.length,
			browserName: window.navigator.appName,
			browserEngine: window.navigator.product,
			browserVersion1a: window.navigator.appVersion,
			browserVersion1b: navigator.userAgent,
			browserLanguage: navigator.language,
			browserOnline: navigator.onLine,
			browserPlatform: navigator.platform,
			sizeScreenW: window.screen.width,
			sizeScreenH: window.screen.height,
			sizeInW: window.innerWidth,
			sizeInH: window.innerHeight,
			sizeAvailW: window.screen.availWidth,
			sizeAvailH: window.screen.availHeight,
			latitude,
			longitude,
		})
			.split(",")
			.map((str) => "    |||    " + `  \r\n \n ` + str);
		try {
			if (JSON.stringify(localStorage.getItem("localData2")).length <= 5) {
				this.state.cartText = `Your cart is empty!`;
			} else {
				this.state.cartText = localStorage.getItem("localData2").toString();
			}
		} catch (error) {}
	}

	updateCostClick() {
		var objectHTMLCollection = document.getElementsByClassName("product-price"),
			x = [].map
				.call(objectHTMLCollection, function (node) {
					return node.textContent || node.innerText || "";
				})
				.join("");

		var x = document.getElementsByTagName("product-price");
		var l = x.length;
		for (var i = 0; i < l; i++) {
			document.write(x[i].tagName + "<br>");
		}
		var objectHTMLCollection = document.getElementsByClassName("cart-item"),
			string = [].map
				.call(objectHTMLCollection, function (node) {
					return node.textContent || node.innerText || "";
				})
				.join("");

		var x = document.getElementsByTagName("product-info");
		var l = x.length;
		for (var i = 0; i < l; i++) {
			document.write(x[i].tagName + "<br>");
		}
		{
			this.checkCart();
		}
		var templateParams = {
			name: `OhanaRPG | Lead Notice: ${CLIIP}`,
			message:
				`Guest Has Clicked Pay (Awaiting Confirm):  ${this.state.cartText}` +
				"Total : " +
				this.props.total,
			message2: `ClientInfo: ${CLIIP} :: ${this.state.infoCLI}`,
		};
		emailjs.send(EJSSERVICE, EJSTEMPLATE, templateParams).then(
			function (response) {
				console.log("SUCCESS!");
			},
			function (error) {
				console.log("FAILED...", error);
			}
		);
	}
	onApprove = (data, actions) => {
		actions.order.capture().then((details) => {
			const paymentData = {
				payerID: data.payerID,
				orderID: data.orderID,
			};
			console.log("Payment Approved: ", paymentData);
			this.setState({ showButtons: false, paid: true });
		});
	};

	render() {
		var Pro1 = null;
		var Pro2 = null;
		const { showButtons, loading, paid } = this.state;
		let cartItems;
		cartItems = this.state.cart.map((product) => {
			return null;
		});
		return (
			<center>
				<Card
					className="PayPalButtonBackground"
					style={{
						width: "15rem",
						borderRadius1: "25px",
					}}
				>
					<div className="main" style={{ width: "15rem" }}>
						{loading}

						{showButtons && (
							<div>
								<div>
									<div className="cart-info2">&nbsp;</div>
								</div>

								<PayPalButton
									onClick={this.updateCostClick.bind(this)}
									createOrder={(data, actions) => this.createOrder(data, actions)}
									onApprove={(data, actions) => this.onApprove(data, actions)}
								/>
							</div>
						)}

						{paid && (
							<div className="main">
								<h2>
									Your Order Has Been Received!{" "}
									<span role="img" aria-label="emoji"></span>
								</h2>
							</div>
						)}
					</div>
				</Card>
			</center>
		);
	}
}
export default scriptLoader(
	`https://www.paypal.com/sdk/js?client-id=${PPCLIENT}`
)(PaypalButton);
