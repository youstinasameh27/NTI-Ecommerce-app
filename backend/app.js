const express = require('express');
const dotenv = require('dotenv');
const mongoose = require('mongoose');
const cors = require('cors');
const path = require('path');
const aboutRoutes = require('./routes/about.route');
const faqRoutes   = require('./routes/faq.route');


dotenv.config();

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));



const origins = process.env.ALLOWED_ORIGINS
  ? process.env.ALLOWED_ORIGINS.split(',').map(s => s.trim())
  : '*';

app.use(
  cors({
    origin: origins,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization'],
    credentials: true,
  })
);


app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

const authRoutes = require('./routes/authRoutes');
const productRoutes = require('./routes/product.route');
const cartRoutes = require('./routes/cart.route');
const orderRoutes = require('./routes/order.route');
const categoryRoutes = require('./routes/category.route');
const reportRoutes = require('./routes/report.route');
const testimonialRoutes = require('./routes/testimonial.route');

const faqRoutes2 = faqRoutes; 
const contactRoutes = require('./routes/contact.route');
const adminConfigRoutes = require('./routes/admin-config.route');
const userRoutes = require('./routes/user.route');

const aboutRoutes2 = aboutRoutes; 


app.use('/api/about', aboutRoutes);
app.use('/api/faq', faqRoutes);

app.use('/api/auth', authRoutes);
app.use('/api/products', productRoutes);
app.use('/api/cart', cartRoutes);
app.use('/api/orders', orderRoutes);
app.use('/api/categories', categoryRoutes);
app.use('/api/reports', reportRoutes);
app.use('/api/testimonials', testimonialRoutes);
app.use('/api/faq', faqRoutes);      
app.use('/api/contact', contactRoutes);
app.use('/api/admin', adminConfigRoutes);
app.use('/api/users', userRoutes);
app.use('/api/about', aboutRoutes);   


app.use('/api/category', categoryRoutes);
app.use('/api/report', reportRoutes);
app.use('/api/testimonial', testimonialRoutes);


app.get('/api/_ping', (req, res) => res.json({ ok: true }));


app.get('/', (req, res) => res.send('API is running...'));


mongoose.connect(process.env.MONGO_URL)
  .then(() => console.log('MongoDB connected'))
  .catch((err) => { console.error('MongoDB error:', err); process.exit(1); });


const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
