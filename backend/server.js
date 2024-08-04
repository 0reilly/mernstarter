const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('./models/User'); // You'll need to create this model
const multer = require('multer');
const upload = multer({ dest: 'uploads/' });
const fs = require('fs');

  const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);
require('dotenv').config();

const app = express();
const port = process.env.PORT || 5001;
const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/todoapp';

// CORS configuration
const corsOptions = {
    origin: process.env.FRONTEND_URL || 'http://localhost:3000', // Allow the frontend URL
    credentials: true, // Allow credentials (cookies, authorization headers, etc.)
    optionsSuccessStatus: 200 // For legacy browser support
};

// Apply CORS middleware
app.use(cors(corsOptions));

app.use(express.json());

mongoose.connect(MONGODB_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useCreateIndex: true,
});

const connection = mongoose.connection;
connection.once('open', () => {
    console.log('MongoDB database connection established successfully');
});



app.post('/api/login', async (req, res) => {
    try {
      const { email, password } = req.body;
      const user = await User.findOne({ email });
      if (!user) {
        return res.status(400).json({ error: 'Invalid credentials' });
      }
      const isMatch = await bcrypt.compare(password, user.password);
      if (!isMatch) {
        return res.status(400).json({ error: 'Invalid credentials' });
      }
      const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET, { expiresIn: '1h' });
      res.json({ token });
    } catch (error) {
      res.status(400).json({ error: 'Login failed' });
    }
  });
  app.post('/api/register', async (req, res) => {
    try {
      const { email, password } = req.body;
      const hashedPassword = await bcrypt.hash(password, 10);
      
      // Create a Stripe customer
      const customer = await stripe.customers.create({ email });
  
      const user = new User({
        email,
        password: hashedPassword,
        stripeCustomerId: customer.id,
        isSubscribed: false
      });
      
      await user.save();
      const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET, { expiresIn: '1h' });
      res.status(201).json({ token });
    } catch (error) {
      console.error('Registration error:', error);
      res.status(400).json({ error: 'Registration failed' });
    }
  });

  const auth = (req, res, next) => {
    const token = req.header('Authorization')?.replace('Bearer ', '');
  
    if (!token) {
      console.log('No token provided');
      return res.status(401).json({ error: 'Please authenticate.' });
    }
  
    try {
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      req.userId = decoded.userId;
      console.log('User authenticated:', req.userId);
      next();
    } catch (error) {
      console.error('Authentication error:', error);
      res.status(401).json({ error: 'Please authenticate.' });
    }
  };

  // Test endpoint
app.get('/api/test', auth, (req, res) => {
    res.json({ message: 'Backend connection successful!' });
  });
  
  // Protected route example
  app.get('/', auth, (req, res) => {
    res.send('Hello from the authenticated backend!');
  });

  app.get('/api/subscription-success', auth, async (req, res) => {
    try {
      const user = await User.findById(req.userId);
      console.log('User found:', user);
  
      if (!user) {
        console.log('User not found');
        return res.status(404).json({ error: 'User not found' });
      }
      
      // Check Stripe subscription status
      const subscriptions = await stripe.subscriptions.list({
        customer: user.stripeCustomerId,
        status: 'active',
      });
      
      console.log('Stripe subscriptions:', subscriptions);
  
      const isSubscribed = subscriptions.data.length > 0;
      console.log('Is user subscribed:', isSubscribed);
  
      if (isSubscribed) {
        user.isSubscribed = true;
        await user.save();
        console.log('Updated user subscription status to true');
        res.json({ success: true, isSubscribed: true });
      } else {
        console.log('User has no active subscriptions');
        res.json({ success: false, isSubscribed: false });
      }
    } catch (error) {
      console.error('Subscription success check error:', error);
      res.status(500).json({ error: 'Failed to check subscription status' });
    }
  });

  app.post('/api/create-checkout-session', auth, async (req, res) => {
    const { priceId } = req.body;
    try {
      const user = await User.findById(req.userId);
      if (!user) {
        return res.status(404).json({ error: 'User not found' });
      }
  
      const session = await stripe.checkout.sessions.create({
        mode: 'subscription',
        payment_method_types: ['card'],
        customer: user.stripeCustomerId,
        line_items: [
          {
            price: priceId,
            quantity: 1,
          },
        ],
        success_url: `${process.env.FRONTEND_URL}/subscription-success?session_id={CHECKOUT_SESSION_ID}`,
        cancel_url: `${process.env.FRONTEND_URL}/subscription-canceled`,
        metadata: {
          userId: user._id.toString(),
        },
      });
      res.json({ sessionId: session.id });
    } catch (error) {
      console.error('Stripe session creation error:', error);
      res.status(500).json({ error: 'Failed to create checkout session' });
    }
  });
  
  app.get('/api/subscription-status', auth, async (req, res) => {
    try {
      const user = await User.findById(req.userId);
      console.log('User found:', user);
      
      if (!user) {
        console.log('User not found');
        return res.status(404).json({ error: 'User not found' });
      }
  
      if (!user.stripeCustomerId) {
        console.log('User has no Stripe customer ID');
        return res.json({ isSubscribed: false });
      }
      
      const subscriptions = await stripe.subscriptions.list({
        customer: user.stripeCustomerId,
        status: 'active',
      });
  
      console.log('Stripe subscriptions:', subscriptions);
      
      const isSubscribed = subscriptions.data.length > 0;
      console.log('Is user subscribed:', isSubscribed);
  
      // Update user's subscription status in the database
      if (user.isSubscribed !== isSubscribed) {
        user.isSubscribed = isSubscribed;
        await user.save();
        console.log('Updated user subscription status:', isSubscribed);
      }
  
      res.json({ isSubscribed });
    } catch (error) {
      console.error('Subscription status check error:', error);
      res.status(500).json({ error: 'Failed to check subscription status' });
    }
  });

  app.post('/api/update-subscription', auth, async (req, res) => {
    try {
      const user = await User.findById(req.userId);
      if (!user) {
        return res.status(404).json({ error: 'User not found' });
      }
  
      const subscriptions = await stripe.subscriptions.list({
        customer: user.stripeCustomerId,
        status: 'active',
      });
  
      user.isSubscribed = subscriptions.data.length > 0;
      await user.save();
  
      res.json({ success: true, isSubscribed: user.isSubscribed });
    } catch (error) {
      console.error('Update subscription error:', error);
      res.status(500).json({ error: 'Failed to update subscription status' });
    }
  });

  

  const endpointSecret = process.env.STRIPE_WEBHOOK_SECRET;

  app.post('/webhook', express.raw({type: 'application/json'}), async (req, res) => {
    const sig = req.headers['stripe-signature'];
  
    let event;
  
    try {
      event = stripe.webhooks.constructEvent(req.body, sig, endpointSecret);
    } catch (err) {
      console.error('Webhook Error:', err.message);
      return res.status(400).send(`Webhook Error: ${err.message}`);
    }
  
    if (event.type === 'checkout.session.completed') {
      const session = event.data.object;
      const customerId = session.customer;
  
      try {
        const user = await User.findOne({ stripeCustomerId: customerId });
        if (user) {
          user.isSubscribed = true;
          await user.save();
          console.log(`User ${user._id} subscription updated to true`);
        } else {
          console.log(`User not found for Stripe customer ID: ${customerId}`);
        }
      } catch (error) {
        console.error('Error updating user subscription status:', error);
      }
    }
  
    res.json({received: true});
  });



app.listen(port, () => {
    console.log(`Server is running on port: ${port}`);
});
