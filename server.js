const express = require('express');
const cors = require('cors');
const stripe = require('stripe')('sk_test_51LmKU1CF77PCDzZf98VlvaNjDENOXvi7MYW1L0f63lVNf7sbqcKIfpI4kABsGHto5ue79cQ2HyINWZsT7qCG6vRc00VqKzFd0U');
const bodyParser = require('body-parser');
const admin = require('firebase-admin');
const serviceAccount = require('./serviceAccountKey.json');

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount)
});

const db = admin.firestore();
const app = express();
app.use(cors());
app.use(bodyParser.json());

app.post('/create-checkout-session', async (req, res) => {
    const userId = req.body.userId;
    console.log(`Creating checkout session for user: ${userId}`);
    const session = await stripe.checkout.sessions.create({
        payment_method_types: ['card'],
        line_items: [{
            price_data: {
                currency: 'usd',
                product_data: {
                    name: 'Premium Plan',
                },
                unit_amount: 999, // Amount in cents
            },
            quantity: 1,
        }],
        mode: 'payment',
        success_url: `http://127.0.0.1:5500/success.html?session_id={CHECKOUT_SESSION_ID}`,
        cancel_url: 'http://127.0.0.1:5500/cancel.html',
        metadata: {
            userId: userId
        }
    });
    console.log(`Checkout session created: ${session.id}`);
    res.json({ id: session.id });
});

const endpointSecret = 'whsec_94Kc67Ygkmsg32cBRwJYbYOyy9mIi';

app.post('/webhook', bodyParser.raw({ type: 'application/json' }), async (request, response) => {
    const sig = request.headers['stripe-signature'];

    let event;

    try {
        event = stripe.webhooks.constructEvent(request.body, sig, endpointSecret);
        console.log('Webhook verified');
    } catch (err) {
        console.error(`Webhook Error: ${err.message}`);
        response.status(400).send(`Webhook Error: ${err.message}`);
        return;
    }

    console.log(`Event received: ${event.type}`);

    if (event.type === 'checkout.session.completed') {
        const session = event.data.object;
        const userId = session.metadata.userId;
        console.log(`Checkout session completed for user: ${userId}`);
        try {
            await updateSubscriptionStatus(userId, 'premium');
            console.log(`Subscription status updated for user: ${userId}`);
        } catch (error) {
            console.error(`Failed to update subscription status for user: ${userId}`, error);
        }
    }

    response.json({ received: true });
});

async function updateSubscriptionStatus(userId, status) {
    try {
        const userRef = db.collection('users').doc(userId);
        const userDoc = await userRef.get();
        if (userDoc.exists) {
            console.log(`User document found for user: ${userId}, updating subscription status to ${status}`);
            await userRef.update({ subscription: status });
            console.log(`Subscription status updated for user: ${userId}`);
        } else {
            console.error(`No user document found for user: ${userId}`);
        }
    } catch (error) {
        console.error(`Error updating subscription status for user: ${userId}`, error);
    }
}


app.post('/update-subscription-status', async (req, res) => {
    const { userId, status } = req.body;
    try {
        await updateSubscriptionStatus(userId, status);
        res.json({ success: true });
    } catch (error) {
        res.status(500).json({ error: 'Failed to update subscription status' });
    }
});

async function updateSubscriptionStatus(userId, status) {
    try {
        const userRef = db.collection('users').doc(userId);
        const userDoc = await userRef.get();
        if (userDoc.exists) {
            console.log(`User document found for user: ${userId}, updating subscription status to ${status}`);
            await userRef.update({ subscription: status });
            console.log(`Subscription status updated for user: ${userId}`);
        } else {
            console.error(`No user document found for user: ${userId}`);
        }
    } catch (error) {
        console.error(`Error updating subscription status for user: ${userId}`, error);
    }
}

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
