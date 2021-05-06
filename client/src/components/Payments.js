import React, { Component } from 'react';
import StripeCheckout from 'react-stripe-checkout';
//import logo from "./logo.svg";
import { PaystackButton} from "react-paystack";
//import "./App.css";
import { connect } from 'react-redux';
import * as actions from '../actions';


/* class Payments extends Component{
    render() {
        return (
          <StripeCheckout
            name="EmailME"
            description="$5 for 5 email credits"
            amount={500}
            token={(token) => this.props.handleToken(token)}
            stripeKey={process.env.REACT_APP_STRIPE_KEY}
          >
            <button className="btn">Add Credits</button>
          </StripeCheckout>
        );
    }
} */

//function to handle successful paystack billing
const callback = (reference) => this.props.handleToken(reference);

//handle paystack payment
const paystackConfig = {
  reference: new Date().getTime(),
  email: "user@example.com",
  amount: 1000000,
  publicKey: process.env.REACT_APP_PAYSTACK_KEY,
};
const paystackProps = {
  ...paystackConfig,
  text: <button className="btn">Add Credits</button>,
  
};


class Payments extends Component {
  render() {
    return (
      <PaystackButton
        {...paystackProps}
        onSuccess ={(reference) => this.props.handleToken(reference.reference)}
        paystackKey={process.env.REACT_APP_PAYSTACK_KEY}
      ></PaystackButton>
    );
  }
}

export default connect(null, actions) /* (Payments) */ (Payments);