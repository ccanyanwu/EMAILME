import axios from 'axios';
import { FETCH_USER } from './types';

export const fetchUser = () => async dispatch => {
    const res = await axios.get("/api/current_user");
    dispatch({ type: FETCH_USER, payload: res.data });
};

//handle the payment token for stripe and paystack
/* export const handleToken = token => async (dispatch) => {
    const res = await axios.post('/api/stripe', token);
    dispatch({ type: FETCH_USER, payload: res.data });
}; */

//handle the payment token for paystack
export const handleToken = reference => async (dispatch) => {
    //console.log(`this is the token ${reference}`)
    const res = await axios.post('/api/paystack', reference);
    dispatch({ type: FETCH_USER, payload: res.data });
};