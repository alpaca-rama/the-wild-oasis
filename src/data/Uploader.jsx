import { useState } from "react";
import { isFuture, isPast, isToday } from "date-fns";
import supabase from "../services/supabase";
import Button from "../ui/Button";
import { subtractDates } from "../utils/helpers";

import { bookings } from "./data-bookings";
import { cabins } from "./data-cabins";
import { guests } from "./data-guests";

// const originalSettings = {
//   minBookingLength: 3,
//   maxBookingLength: 30,
//   maxGuestsPerBooking: 10,
//   breakfastPrice: 15,
// };

async function deleteGuests() {
  const { error } = await supabase.from("two_guests").delete().gt("id", 0);
  if (error) console.log(`1️⃣${error.message}`);
}

async function deleteCabins() {
  const { error } = await supabase.from("two_cabins").delete().gt("id", 0);
  if (error) console.log(`2️⃣${error.message}`);
}

async function deleteBookings() {
  const { error } = await supabase.from("two_bookings").delete().gt("id", 0);
  if (error) console.log(`3️⃣${error.message}`);
}

async function createGuests() {
  console.log('Creating guests...');
  console.log('Guest data:', guests);
  const { data, error } = await supabase.from("two_guests").insert(guests);
  if (error) {
    console.error('Error creating guests:', error.message);
    throw new Error(error.message);
  }
  console.log('Guests created successfully:', data);
}

async function createCabins() {
  console.log('Creating cabins...');
  console.log('Cabin data:', cabins);
  const { data, error } = await supabase.from("two_cabins").insert(cabins);
  if (error) {
    console.error('Error creating cabins:', error.message);
    throw new Error(error.message);
  }
  console.log('Cabins created successfully:', data);
}

async function createBookings() {
  console.log('Starting createBookings...');
  // Get guests
  const { data: guestsIds, error: guestsError } = await supabase
    .from("two_guests")
    .select("id")
    .order("id");

  if (guestsError) {
    console.error('Error fetching guests:', guestsError.message);
    throw new Error(guestsError.message);
  }
  console.log('Fetched guests:', guestsIds);

  const allGuestIds = guestsIds.map((guest) => guest.id);

  // Get cabins
  const { data: cabinsIds, error: cabinsError } = await supabase
    .from("two_cabins")
    .select("id")
    .order("id");

  if (cabinsError) {
    console.error('Error fetching cabins:', cabinsError.message);
    throw new Error(cabinsError.message);
  }
  console.log('Fetched cabins:', cabinsIds);

  const allCabinIds = cabinsIds.map((cabin) => cabin.id);

  const finalBookings = bookings.map((booking) => {
    const cabin = cabins.at(booking.cabin_id - 1);
    const num_nights = subtractDates(booking.end_date, booking.start_date);
    const cabin_price = num_nights * (cabin.regular_price - cabin.discount);
    const extras_price = booking.has_breakfast
      ? num_nights * 15 * booking.num_guests
      : 0;
    const total_price = cabin_price + extras_price;

    let status;
    if (
      isPast(new Date(booking.end_date)) &&
      !isToday(new Date(booking.end_date))
    )
      status = "checked-out";
    if (
      isFuture(new Date(booking.start_date)) ||
      isToday(new Date(booking.start_date))
    )
      status = "unconfirmed";
    if (
      (isFuture(new Date(booking.end_date)) ||
        isToday(new Date(booking.end_date))) &&
      isPast(new Date(booking.start_date)) &&
      !isToday(new Date(booking.start_date))
    )
      status = "checked-in";

    return {
      ...booking,
      num_nights,
      cabin_price,
      extras_price,
      total_price,
      guest_id: allGuestIds.at(booking.guest_id - 1),
      cabin_id: allCabinIds.at(booking.cabin_id - 1),
      status,
    };
  });

  console.log('Prepared bookings:', finalBookings);

  const { data, error } = await supabase.from("two_bookings").insert(finalBookings);
  if (error) {
    console.error('Error creating bookings:', error.message);
    throw new Error(error.message);
  }
  console.log('Bookings created successfully:', data);
  return data;
}

function Uploader() {
  const [isLoading, setIsLoading] = useState(false);

  async function uploadAll() {
    setIsLoading(true);
    try {
      // Bookings need to be deleted FIRST
      await deleteBookings();
      await deleteGuests();
      await deleteCabins();

      // Bookings need to be created LAST
      await createGuests();
      await createCabins();
      await createBookings();
    } catch (error) {
      console.error("Error during upload:", error);
      alert("Error uploading data: " + error.message);
    } finally {
      setIsLoading(false);
    }
  }

  async function uploadBookings() {
    setIsLoading(true);
    await deleteBookings();
    await createBookings();
    setIsLoading(false);
  }

  return (
    <div
      style={{
        marginTop: "auto",
        backgroundColor: "#e0e7ff",
        padding: "8px",
        borderRadius: "5px",
        textAlign: "center",
        display: "flex",
        flexDirection: "column",
        gap: "8px",
      }}
    >
      <h3 style={{ color: 'black' }}>SAMPLE DATA</h3>
      <p style={{ color: 'grey', fontSize: '12px' }}>If no sample data is showing</p>

      <Button onClick={uploadAll} disabled={isLoading}>
        Upload ALL
      </Button>

      <Button onClick={uploadBookings} disabled={isLoading}>
        Upload bookings ONLY
      </Button>
    </div>
  );
}

export default Uploader;
