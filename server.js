require("dotenv").config();
const express = require('express');
const cors = require('cors');
const productRoutes = require('./routes/productRoutes');
const adminRoutes = require('./routes/adminRoutes');
const errorHandler = require("./middleWare/errorHandler")
const cookieParser = require("cookie-parser")

const app = express();
app.use(cors({
    origin: [process.env.FRONT_DOMAIN, "http://5.182.26.85:3000"],
    methods: ["POST", "GET", "PUT", "DELETE"],
    credentials: true
}));
app.use(express.json());
app.use(cookieParser());
app.use(errorHandler);

app.use('/api/products', productRoutes);
app.use('/api/admins', adminRoutes);

const PORT = process.env.PORT || 6060;
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});