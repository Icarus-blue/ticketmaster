
const fetch = require('node-fetch')
// set some important variables
const { CLIENT_ID, APP_SECRET } = process.env;
const base = 'https://api-m.sandbox.paypal.com';
const adminpaypaladdress = '';


// call the create order method
const createOrder = async (amount) => {
    console.log('paypal :', amount);
    const purchaseAmount = amount // TODO: pull prices from a database
    const accessToken = await generateAccessToken();
    const url = `${base}/v2/checkout/orders`;
    const response = await fetch(url, {
        method: 'post',
        headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${accessToken}`,
        },
        body: JSON.stringify({
            intent: 'CAPTURE',
            purchase_units: [
                {
                    amount: {
                        currency_code: 'CAD',
                        value: purchaseAmount,
                    },
                },
            ],
        }),
    })
    console.log('response', response);
    return handleResponse(response);
}

const Payout = async (amount) => {
    const accessToken = await generateAccessToken();
    const url = `${base}/v2/payments/payouts`;
    const response = await fetch(url, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${accessToken}`,
        },
        body: JSON.stringify({
            "sender_batch_header": {
                "sender_batch_id": "Payouts_2020_100007",
                "email_subject": "You have a payout!",
                "email_message": "You have received a payout! Thanks for using our service!"
            },
            "items": [
                {
                    "recipient_type": "EMAIL",
                    "amount": {
                        "value": amount,
                        "currency": "CAD"
                    },
                    "note": "Thanks for your patronage!",
                    "sender_item_id": "201403140001",
                    "receiver": adminpaypaladdress,
                    "recipient_wallet": "RECIPIENT_SELECTED"
                }
            ]
        })
    });
}

// capture payment for an order
const capturePayment = async (orderId) => {
    const accessToken = await generateAccessToken();
    const url = `${base}/v2/checkout/orders/${orderId}/capture`;
    const response = await fetch(url, {
        method: 'post',
        headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${accessToken}`,
        },
    })
    return handleResponse(response);
}

// generate access token
const generateAccessToken = async () => {
    const auth = Buffer.from(CLIENT_ID + ':' + APP_SECRET).toString('base64');
    console.log('CLIENT_ID', CLIENT_ID);
    console.log('APP_SECRET', APP_SECRET);
    const response = await fetch(`${base}/v1/oauth2/token`, {
        method: 'post',
        body: 'grant_type=client_credentials',
        headers: {
            Authorization: `Basic ${auth}`,
        },
    })
    console.log('accesstoken', response);
    const jsonData = await handleResponse(response);
    return jsonData.access_token;
}

// generate client token
const generateClientToken = async () => {
    const accessToken = await generateAccessToken();
    const response = await fetch(`${base}/v1/identity/generate-token`, {
        method: 'post',
        headers: {
            Authorization: `Bearer ${accessToken}`,
            'Accept-Language': 'en_US',
            'Content-Type': 'application/json',
        },
    })
    console.log('response', response.status);
    const jsonData = await handleResponse(response);
    return jsonData.client_token;
}

const handleResponse = async (response) => {
    if (response.status === 200 || response.status === 201) {
        return response.json();
    }
    const errorMessage = await response.text();
    throw new Error(errorMessage);
}

module.exports = {
    createOrder,
    capturePayment,
    generateAccessToken,
    generateClientToken,
    handleResponse,
    Payout
}