

import { Component } from '@angular/core';

interface Seat {
  seatNumber: number;
  isBooked: boolean;
}

@Component({
  selector: 'app-hello',
  templateUrl: './hello.component.html',
  styleUrls: ['./hello.component.css']
})
export class HelloComponent {
  coach: TrainCoach;
  bookedSeats: number[] = [];
  totalSeats: number = 80;
  bookedCount: number = 0;
  remainingCount: number = this.totalSeats;

  constructor() {
    this.coach = new TrainCoach();
  }

  onBookSeats(requestedSeats: number) {
    this.bookedSeats = this.coach.bookSeats(requestedSeats);

    if (typeof this.bookedSeats === 'string') {
      console.log(this.bookedSeats);  // Display message if not enough seats are available
    } else {
      console.log('Booked seats:', this.bookedSeats);
      this.bookedCount = this.coach.getBookedCount();
      this.remainingCount = this.totalSeats - this.bookedCount;
    }
  }

  getSeats(): Seat[] {
    return this.coach.seats;
  }
}

// TrainCoach class handles seat booking and display logic
class TrainCoach {
  seats: Seat[] = [];

  constructor() {
    this.initializeSeats();
  }

  initializeSeats() {
    // Initialize seats as per the specified layout
    for (let i = 1; i <= 80; i++) {
      this.seats.push({ seatNumber: i, isBooked: false });
    }
  }

  bookSeats(requestedSeats: number): number[] | string {
    let availableSeats: number[] = this.findAvailableSeats(requestedSeats);

    if (availableSeats.length < requestedSeats) {
      return 'Not enough seats available';
    }

    availableSeats.slice(0, requestedSeats).forEach(seatNumber => {
      this.seats[seatNumber - 1].isBooked = true;
    });

    return availableSeats.slice(0, requestedSeats);
  }

  findAvailableSeats(requestedSeats: number): number[] {
    let availableSeats: number[] = [];
    
    // Attempt to find seats in the same row
    for (let i = 0; i < 11; i++) { // 11 rows with 7 seats
      const rowSeats = this.seats.slice(i * 7, i * 7 + 7);
      const unbookedSeats = rowSeats.filter(seat => !seat.isBooked);
      if (unbookedSeats.length >= requestedSeats) {
        return unbookedSeats.slice(0, requestedSeats).map(seat => seat.seatNumber);
      }
    }

    // If not enough in a row, find the nearby available seats
    this.seats.forEach(seat => {
      if (!seat.isBooked && availableSeats.length < requestedSeats) {
        availableSeats.push(seat.seatNumber);
      }
    });

    return availableSeats;
  }

  getBookedCount(): number {
    return this.seats.filter(seat => seat.isBooked).length;
  }
}
