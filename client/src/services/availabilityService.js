// Room Availability Service for checking real-time availability
import api from './api';

class AvailabilityService {
  // Check room availability for specific dates
  async checkAvailability(hotelId, checkIn, checkOut, rooms = 1) {
    try {
      const response = await api.get(`/availability/check`, {
        params: {
          hotelId,
          checkIn: checkIn.toISOString(),
          checkOut: checkOut.toISOString(),
          rooms
        }
      });
      
      return response.data;
    } catch (error) {
      // Simulate availability check for demo
      return this.simulateAvailabilityCheck(hotelId, checkIn, checkOut, rooms);
    }
  }

  // Simulate availability check (for demo purposes)
  simulateAvailabilityCheck(hotelId, checkIn, checkOut, rooms) {
    const nights = Math.ceil((checkOut - checkIn) / (1000 * 60 * 60 * 24));
    
    // Simulate different availability scenarios
    const scenarios = [
      { available: true, roomsAvailable: 10, message: 'Rooms available' },
      { available: true, roomsAvailable: 5, message: 'Limited availability' },
      { available: true, roomsAvailable: 2, message: 'Only 2 rooms left!' },
      { available: false, roomsAvailable: 0, message: 'No rooms available for these dates' }
    ];
    
    // Random scenario based on hotel ID and dates
    const scenarioIndex = (parseInt(hotelId?.slice(-1) || '0') + nights) % 4;
    const scenario = scenarios[Math.min(scenarioIndex, 2)]; // Avoid no availability for demo
    
    return {
      available: scenario.available,
      roomsAvailable: scenario.roomsAvailable,
      requestedRooms: rooms,
      hotelId,
      checkIn,
      checkOut,
      nights,
      message: scenario.message,
      priceVariation: this.calculatePriceVariation(checkIn, checkOut),
      restrictions: this.getRestrictions(checkIn, checkOut)
    };
  }

  // Calculate price variations based on demand and season
  calculatePriceVariation(checkIn, checkOut) {
    const checkInMonth = checkIn.getMonth();
    const checkInDay = checkIn.getDay();
    
    let multiplier = 1.0;
    
    // Weekend premium (Friday, Saturday)
    if (checkInDay === 5 || checkInDay === 6) {
      multiplier += 0.2;
    }
    
    // Peak season (December, January)
    if (checkInMonth === 11 || checkInMonth === 0) {
      multiplier += 0.3;
    }
    
    // Summer season (April, May)
    if (checkInMonth === 3 || checkInMonth === 4) {
      multiplier += 0.15;
    }
    
    // Holiday periods (approximate)
    const holidays = this.isHolidayPeriod(checkIn);
    if (holidays.length > 0) {
      multiplier += 0.25;
    }
    
    return {
      multiplier: Math.round(multiplier * 100) / 100,
      factors: [
        checkInDay >= 5 && 'Weekend',
        (checkInMonth === 11 || checkInMonth === 0) && 'Peak Season',
        (checkInMonth === 3 || checkInMonth === 4) && 'Summer Season',
        holidays.length > 0 && `Holiday: ${holidays.join(', ')}`
      ].filter(Boolean)
    };
  }

  // Check for holiday periods
  isHolidayPeriod(date) {
    const month = date.getMonth();
    const day = date.getDate();
    const holidays = [];
    
    // Major Indian holidays (approximate dates)
    if (month === 0 && day === 26) holidays.push('Republic Day');
    if (month === 7 && day === 15) holidays.push('Independence Day');
    if (month === 9 && day === 2) holidays.push('Gandhi Jayanti');
    if (month === 11 && (day >= 20 && day <= 31)) holidays.push('Christmas/New Year');
    if (month === 2 && (day >= 10 && day <= 20)) holidays.push('Holi');
    if (month === 9 && (day >= 15 && day <= 25)) holidays.push('Diwali');
    
    return holidays;
  }

  // Get booking restrictions
  getRestrictions(checkIn, checkOut) {
    const restrictions = [];
    const nights = Math.ceil((checkOut - checkIn) / (1000 * 60 * 60 * 24));
    const daysUntilCheckIn = Math.ceil((checkIn - new Date()) / (1000 * 60 * 60 * 24));
    
    // Minimum stay requirements
    if (nights < 2 && checkIn.getDay() >= 5) {
      restrictions.push({
        type: 'minimum_stay',
        message: 'Minimum 2 nights stay required for weekend bookings'
      });
    }
    
    // Advance booking requirements
    if (daysUntilCheckIn < 1) {
      restrictions.push({
        type: 'advance_booking',
        message: 'Same-day bookings require confirmation call'
      });
    }
    
    // Cancellation policies
    if (daysUntilCheckIn <= 7) {
      restrictions.push({
        type: 'cancellation',
        message: 'Non-refundable for bookings within 7 days'
      });
    } else {
      restrictions.push({
        type: 'cancellation',
        message: 'Free cancellation until 24 hours before check-in'
      });
    }
    
    return restrictions;
  }

  // Block rooms for a reservation (temporary hold)
  async holdRooms(hotelId, checkIn, checkOut, rooms, duration = 15) {
    try {
      const response = await api.post('/availability/hold', {
        hotelId,
        checkIn: checkIn.toISOString(),
        checkOut: checkOut.toISOString(),
        rooms,
        holdDuration: duration // minutes
      });
      
      return response.data;
    } catch (error) {
      // Simulate hold for demo
      return {
        holdId: `HOLD_${Date.now()}`,
        expiresAt: new Date(Date.now() + duration * 60 * 1000),
        message: `Rooms held for ${duration} minutes`
      };
    }
  }

  // Release room hold
  async releaseHold(holdId) {
    try {
      await api.delete(`/availability/hold/${holdId}`);
      return { success: true, message: 'Room hold released' };
    } catch (error) {
      return { success: true, message: 'Hold released (simulated)' };
    }
  }

  // Get room inventory details
  async getRoomInventory(hotelId, checkIn, checkOut) {
    try {
      const response = await api.get(`/availability/inventory/${hotelId}`, {
        params: {
          checkIn: checkIn.toISOString(),
          checkOut: checkOut.toISOString()
        }
      });
      
      return response.data;
    } catch (error) {
      // Simulate inventory data
      return this.simulateRoomInventory(hotelId, checkIn, checkOut);
    }
  }

  // Simulate room inventory data
  simulateRoomInventory(hotelId, checkIn, checkOut) {
    const roomTypes = [
      {
        type: 'standard',
        name: 'Standard Room',
        totalRooms: 20,
        availableRooms: 15,
        basePrice: 2500,
        amenities: ['Free WiFi', 'AC', 'TV'],
        maxOccupancy: 2
      },
      {
        type: 'deluxe',
        name: 'Deluxe Room',
        totalRooms: 15,
        availableRooms: 8,
        basePrice: 3500,
        amenities: ['Free WiFi', 'AC', 'TV', 'Mini Bar'],
        maxOccupancy: 3
      },
      {
        type: 'suite',
        name: 'Executive Suite',
        totalRooms: 5,
        availableRooms: 2,
        basePrice: 5500,
        amenities: ['Free WiFi', 'AC', 'TV', 'Mini Bar', 'Balcony', 'Living Area'],
        maxOccupancy: 4
      }
    ];

    // Apply price variations
    const priceVariation = this.calculatePriceVariation(checkIn, checkOut);
    
    return roomTypes.map(room => ({
      ...room,
      currentPrice: Math.round(room.basePrice * priceVariation.multiplier),
      priceFactors: priceVariation.factors
    }));
  }

  // Search available hotels in a location
  async searchAvailableHotels(location, checkIn, checkOut, guests, rooms) {
    try {
      const response = await api.get('/availability/search', {
        params: {
          location,
          checkIn: checkIn.toISOString(),
          checkOut: checkOut.toISOString(),
          guests,
          rooms
        }
      });
      
      return response.data;
    } catch (error) {
      throw new Error('Hotel search failed');
    }
  }

  // Get popular dates and pricing
  async getPopularDates(hotelId, months = 3) {
    try {
      const response = await api.get(`/availability/popular-dates/${hotelId}`, {
        params: { months }
      });
      
      return response.data;
    } catch (error) {
      return this.simulatePopularDates(months);
    }
  }

  // Simulate popular booking dates
  simulatePopularDates(months) {
    const dates = [];
    const today = new Date();
    
    for (let i = 0; i < months * 30; i++) {
      const date = new Date(today);
      date.setDate(today.getDate() + i);
      
      // Simulate demand patterns
      const dayOfWeek = date.getDay();
      const isWeekend = dayOfWeek === 5 || dayOfWeek === 6;
      const isHoliday = this.isHolidayPeriod(date).length > 0;
      
      let demand = 'low';
      if (isHoliday) demand = 'very_high';
      else if (isWeekend) demand = 'high';
      else if (dayOfWeek === 4 || dayOfWeek === 0) demand = 'medium';
      
      dates.push({
        date: date.toISOString().split('T')[0],
        demand,
        priceMultiplier: demand === 'very_high' ? 1.5 : 
                        demand === 'high' ? 1.3 : 
                        demand === 'medium' ? 1.1 : 1.0,
        availabilityPercentage: demand === 'very_high' ? 20 : 
                               demand === 'high' ? 40 : 
                               demand === 'medium' ? 70 : 95
      });
    }
    
    return dates;
  }
}

export const availabilityService = new AvailabilityService();
export default availabilityService;
