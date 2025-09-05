import mongoose from "mongoose";

const BookingSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true,
    },
    hotel: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Hotel',
        required: true,
    },
    room: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Room',
        required: false,
    },
    checkInDate: {
        type: Date,
        required: true,
    },
    checkOutDate: {
        type: Date,
        required: true,
    },
    guests: {
        adults: {
            type: Number,
            required: true,
            min: 1,
        },
        children: {
            type: Number,
            default: 0,
            min: 0,
        },
    },
    rooms: {
        type: Number,
        required: true,
        min: 1,
    },
    totalPrice: {
        type: Number,
        required: true,
    },
    priceBreakdown: {
        basePrice: Number,
        taxes: Number,
        fees: Number,
        discount: {
            type: Number,
            default: 0,
        },
    },
    status: {
        type: String,
        enum: ['pending', 'confirmed', 'cancelled', 'completed', 'no-show'],
        default: 'pending',
    },
    paymentStatus: {
        type: String,
        enum: ['pending', 'paid', 'failed', 'refunded', 'partial'],
        default: 'pending',
    },
    paymentMethod: {
        type: String,
        enum: ['credit_card', 'debit_card', 'paypal', 'bank_transfer', 'cash'],
    },
    paymentDetails: {
        transactionId: String,
        paymentGateway: String,
        paidAmount: Number,
        currency: {
            type: String,
            default: 'INR',
        },
    },
    guestDetails: {
        firstName: {
            type: String,
            required: true,
        },
        lastName: {
            type: String,
            required: true,
        },
        email: {
            type: String,
            required: true,
        },
        phone: {
            type: String,
            required: true,
        },
        address: {
            street: String,
            city: String,
            state: String,
            zipCode: String,
            country: String,
        },
        specialRequests: String,
    },
    bookingReference: {
        type: String,
        unique: true,
        required: true,
    },
    source: {
        type: String,
        enum: ['website', 'mobile_app', 'phone', 'walk-in', 'third_party'],
        default: 'website',
    },
    cancellation: {
        isCancellable: {
            type: Boolean,
            default: true,
        },
        cancelledAt: Date,
        cancelledBy: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User',
        },
        cancellationReason: String,
        refundAmount: {
            type: Number,
            default: 0,
        },
    },
    nights: {
        type: Number,
        required: true,
    },
    metadata: {
        deviceInfo: String,
        ipAddress: String,
        userAgent: String,
    },
}, {
    timestamps: true,
});

// Generate booking reference before saving
BookingSchema.pre('save', function(next) {
    if (!this.bookingReference) {
        this.bookingReference = 'BK' + Date.now() + Math.random().toString(36).substr(2, 4).toUpperCase();
    }
    
    // Calculate nights
    const checkIn = new Date(this.checkInDate);
    const checkOut = new Date(this.checkOutDate);
    this.nights = Math.ceil((checkOut - checkIn) / (1000 * 60 * 60 * 24));
    
    next();
});

// Indexes for better query performance
BookingSchema.index({ user: 1, createdAt: -1 });
BookingSchema.index({ hotel: 1, checkInDate: 1, checkOutDate: 1 });
BookingSchema.index({ bookingReference: 1 });
BookingSchema.index({ status: 1, paymentStatus: 1 });
BookingSchema.index({ checkInDate: 1, checkOutDate: 1 });

export const Booking = mongoose.model("Booking", BookingSchema);
