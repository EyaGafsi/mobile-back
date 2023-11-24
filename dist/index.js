"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const cors = require('cors');
const app = express();
const PORT = process.env.PORT || 3000;
// Connect to MongoDB
mongoose.connect('mongodb://127.0.0.1:27017/flywareMobileApp', { useNewUrlParser: true, useUnifiedTopology: true });
const db = mongoose.connection;
db.on('error', console.error.bind(console, 'MongoDB connection error:'));
db.once('open', () => {
    console.log('MongoDB connected successfully');
});
app.use(bodyParser.json());
app.use(cors());
const bookingSchema = new mongoose.Schema({
    duration: String,
    date: String,
    returnDate: String,
    destination: String,
    departure: String,
    price: Number,
    nbAdult: Number,
    nbChildren: Number,
    travelClass: String,
});
const flightSchema = new mongoose.Schema({
    duration: { type: String, required: true },
    date: { type: String, required: true },
    returnDate: { type: String, default: null },
    destination: { type: String, required: true },
    departure: { type: String, required: true },
    price: { type: Number, required: true },
    nbBuisPlaces: { type: Number, required: true },
    nbEcoPlaces: { type: Number, required: true },
});
const hotelSchema = new mongoose.Schema({
    pays: { type: String, required: true },
    hotel: { name: { type: String, required: true },
        location: { type: String, required: true },
        price: { type: Number, required: true },
        description: { type: String, required: true },
    },
});
const Flight = mongoose.model('Flight', flightSchema);
const Hotel = mongoose.model('Hotel', hotelSchema);
app.get('/flights', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const flights = yield Flight.find().exec();
        res.json(flights);
    }
    catch (err) {
        res.status(500).json({ message: "erreur" });
    }
}));
const Booking = mongoose.model('Booking', bookingSchema);
app.post('/bookings', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const booking = new Booking(req.body);
        yield booking.save();
        res.json({ message: 'booking created successfully', data: booking });
    }
    catch (error) {
        res.status(500).json({ message: 'Error creating booking' });
    }
}));
app.get('/bookings', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const bookings = yield Booking.find();
        res.json(bookings);
    }
    catch (error) {
        res.status(500).json({ message: 'Error fetching bookings' });
    }
}));
app.get('/bookings/:id', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const booking = yield Booking.findById(req.params.id);
        res.json(booking);
    }
    catch (error) {
        res.status(500).json({ message: 'Error fetching booking' });
    }
}));
app.put('/bookings/:id', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const booking = yield Booking.findByIdAndUpdate(req.params.id, req.body, { new: true });
        res.json({ message: 'Booking updated successfully', data: Booking });
    }
    catch (error) {
        res.status(500).json({ message: 'Error updating Booking' });
    }
}));
app.delete('/bookings/:id', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const booking = yield Booking.findByIdAndDelete(req.params.id);
        res.json({ message: 'Booking deleted successfully', data: Booking });
    }
    catch (error) {
        res.status(500).json({ message: 'Error deleting booking' });
    }
}));
app.get('/hotels', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const countries = yield Hotel.find().distinct('pays');
        res.json(countries);
    }
    catch (error) {
        res.status(500).json({ message: 'Error fetching countries' });
    }
}));
app.get('/hotels/:country', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const country = req.params.country;
    try {
        const hotels = yield Hotel.find({ pays: country }, { _id: 0, hotels: 1 });
        res.json(hotels);
    }
    catch (error) {
        res.status(500).json({ message: 'Error fetching hotels' });
    }
}));
app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});
