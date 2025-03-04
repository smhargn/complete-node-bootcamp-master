/* eslint-disable */
import axios from 'axios'
import { showAlert } from './alert'
const stripe = Stripe('pk_test_51QyeVW4SyAZMyrsqkMKXhd9LvSPm2rH7boITA8EtlWmCXWarIqDO6ymYm324X7Ausl6tYMVQr6BvpOwyryStpBvC00yT5fVff4');

export const bookTour = async tourId => {

    try {

    // 1)  Get Checkout session from API
    const session = await axios(`http://127.0.0.1:3000/api/v1/bookings/checkout-session/${tourId}`);
    console.log("Session yazdırılıyor : ")
    console.log(session);

    // 2) Create checkout form + charge credit card
    await stripe.redirectToCheckout({
        sessionId: session.data.session.id
    });

    } catch (err) { 
        console.log(err)
        showAlert('error',err);

    }
};