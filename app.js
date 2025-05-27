const express = require('express');
const cors = require('cors');

const app = express();

const userRoutes = require('./routes/userRoutes');
const brandRoutes = require('./routes/brandRoutes');
const cateRoutes = require('./routes/categoryRoutes');
const compRoutes = require('./routes/componentRoutes');
const prodTagRoutes = require('./routes/product_TagRoutes');
const carRoutes = require('./routes/carRoutes');
const tagRoutes = require('./routes/tagRoutes');
const typeRoutes = require('./routes/typeRoutes');
const reviewRoutes = require('./routes/reviewRoutes');
const orderRoutes = require('./routes/orderRoutes');
const imageRoutes = require('./routes/imageRoutes');
const prodCompRoutes = require('./routes/productComponentRoutes');
const selectedProductRoutes = require('./routes/selectedProductRoutes');
const callbackRoutes = require('./routes/callBackRoutes');
const chatbotRoutes = require('./routes/chatbotRoutes');

app.use(cors());
app.use(express.json({ limit: '50mb' }));
app.use('/api/users', userRoutes);
app.use('/api/brands', brandRoutes);
app.use('/api/categories', cateRoutes);
app.use('/api/components', compRoutes);
app.use('/api/product-tags', prodTagRoutes);
app.use('/api/product-components', prodCompRoutes);
app.use('/api/cars', carRoutes);
app.use('/api/tags', tagRoutes);
app.use('/api/types', typeRoutes);
app.use('/api/reviews', reviewRoutes);
app.use('/api/selected-products', selectedProductRoutes);
app.use('/api/orders', orderRoutes);
app.use('/api/images', imageRoutes);
app.use('/api/callback', callbackRoutes);
app.use('/api/chatbot', chatbotRoutes);

app.use((req, res, next) => {
  res.status(404).json({ error: 'Endpoint not found' });
});

module.exports = app;
