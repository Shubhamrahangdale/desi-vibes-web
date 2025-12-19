import { useState } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { ArrowLeft, Calendar, MapPin, Clock, Users } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

// Mock event data - same as EventDetails
const allEvents = [
  {
    id: 1,
    title: "Bangalore Tech Summit 2025",
    category: "Conference",
    date: "Jan 15, 2025",
    time: "9:00 AM",
    location: "Bangalore International Exhibition Centre",
    city: "Bangalore",
    price: 2999,
    image: "https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=1200",
  },
  {
    id: 2,
    title: "Diwali Cultural Night",
    category: "Festival",
    date: "Nov 12, 2025",
    time: "6:00 PM",
    location: "Gateway of India Grounds",
    city: "Mumbai",
    price: 499,
    image: "https://images.unsplash.com/photo-1605810230434-7631ac76ec81?w=1200",
  },
  {
    id: 3,
    title: "Wedding Expo 2025",
    category: "Exhibition",
    date: "Feb 20, 2025",
    time: "10:00 AM",
    location: "Pragati Maidan",
    city: "Delhi",
    price: 0,
    image: "https://images.unsplash.com/photo-1519167758481-83f550bb49b3?w=1200",
  },
  {
    id: 4,
    title: "Startup Pitch Night",
    category: "Networking",
    date: "Dec 28, 2024",
    time: "5:00 PM",
    location: "T-Hub",
    city: "Hyderabad",
    price: 1499,
    image: "https://images.unsplash.com/photo-1475721027785-f74eccf877e2?w=1200",
  },
  {
    id: 5,
    title: "Classical Music Festival",
    category: "Concert",
    date: "Jan 5, 2025",
    time: "7:00 PM",
    location: "Music Academy",
    city: "Chennai",
    price: 799,
    image: "https://images.unsplash.com/photo-1514320291840-2e0a9bf2a9ae?w=1200",
  },
  {
    id: 6,
    title: "Yoga & Wellness Retreat",
    category: "Workshop",
    date: "Mar 10, 2025",
    time: "6:00 AM",
    location: "Parmarth Niketan Ashram",
    city: "Rishikesh",
    price: 5999,
    image: "https://images.unsplash.com/photo-1545205597-3d9d02c29597?w=1200",
  },
  {
    id: 7,
    title: "Food & Wine Festival",
    category: "Festival",
    date: "Feb 14, 2025",
    time: "12:00 PM",
    location: "Sula Vineyards",
    city: "Nashik",
    price: 1999,
    image: "https://images.unsplash.com/photo-1414235077428-338989a2e8c0?w=1200",
  },
  {
    id: 8,
    title: "Photography Masterclass",
    category: "Workshop",
    date: "Jan 25, 2025",
    time: "10:00 AM",
    location: "India Habitat Centre",
    city: "Delhi",
    price: 3499,
    image: "https://images.unsplash.com/photo-1452587925148-ce544e77e70d?w=1200",
  },
];

const BookingForm = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { toast } = useToast();
  
  const event = allEvents.find((e) => e.id === parseInt(id));
  
  const [ticketCount, setTicketCount] = useState(1);
  const [attendees, setAttendees] = useState([
    { name: "", age: "", phone: "", gender: "" }
  ]);

  if (!event) {
    return (
      <div className="min-h-screen bg-background">
        <Navbar />
        <div className="container mx-auto px-4 py-20 text-center">
          <h1 className="text-2xl font-bold text-foreground">Event Not Found</h1>
          <Link to="/events" className="text-primary hover:underline mt-4 inline-block">
            Back to Events
          </Link>
        </div>
        <Footer />
      </div>
    );
  }

  const handleTicketCountChange = (value) => {
    const count = parseInt(value);
    setTicketCount(count);
    
    // Adjust attendees array based on ticket count
    if (count > attendees.length) {
      const newAttendees = [...attendees];
      for (let i = attendees.length; i < count; i++) {
        newAttendees.push({ name: "", age: "", phone: "", gender: "" });
      }
      setAttendees(newAttendees);
    } else if (count < attendees.length) {
      setAttendees(attendees.slice(0, count));
    }
  };

  const handleAttendeeChange = (index, field, value) => {
    const updated = [...attendees];
    updated[index][field] = value;
    setAttendees(updated);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    // Validate all attendee details
    for (let i = 0; i < attendees.length; i++) {
      const attendee = attendees[i];
      if (!attendee.name || !attendee.age || !attendee.phone || !attendee.gender) {
        toast({
          title: "Missing Information",
          description: `Please fill all details for Attendee ${i + 1}`,
          variant: "destructive",
        });
        return;
      }
    }

    // Navigate to confirmation page with booking data
    navigate("/booking/confirmation", {
      state: {
        event,
        attendees,
        ticketCount,
        totalAmount: event.price * ticketCount,
        bookingId: `BK${Date.now()}`,
      },
    });
  };

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      
      <main className="container mx-auto px-4 py-8 pt-24">
        {/* Back Button */}
        <Link
          to={`/events/${id}`}
          className="inline-flex items-center gap-2 text-muted-foreground hover:text-foreground mb-6 transition-colors"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to Event
        </Link>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Booking Form */}
          <div className="lg:col-span-2">
            <div className="bg-card rounded-xl border border-border p-6 shadow-sm">
              <h1 className="text-2xl font-bold text-foreground mb-6">Book Your Tickets</h1>
              
              <form onSubmit={handleSubmit} className="space-y-8">
                {/* Number of Tickets */}
                <div className="space-y-2">
                  <Label htmlFor="tickets" className="flex items-center gap-2">
                    <Users className="h-4 w-4" />
                    Number of Tickets
                  </Label>
                  <Select
                    value={ticketCount.toString()}
                    onValueChange={handleTicketCountChange}
                  >
                    <SelectTrigger className="w-full max-w-[200px]">
                      <SelectValue placeholder="Select tickets" />
                    </SelectTrigger>
                    <SelectContent>
                      {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((num) => (
                        <SelectItem key={num} value={num.toString()}>
                          {num} {num === 1 ? "Ticket" : "Tickets"}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                {/* Attendee Details */}
                <div className="space-y-6">
                  <h2 className="text-lg font-semibold text-foreground">Attendee Details</h2>
                  
                  {attendees.map((attendee, index) => (
                    <div
                      key={index}
                      className="p-4 bg-muted/30 rounded-lg border border-border space-y-4"
                    >
                      <h3 className="font-medium text-foreground">
                        Attendee {index + 1}
                      </h3>
                      
                      <div className="grid sm:grid-cols-2 gap-4">
                        {/* Name */}
                        <div className="space-y-2">
                          <Label htmlFor={`name-${index}`}>Full Name</Label>
                          <Input
                            id={`name-${index}`}
                            placeholder="Enter full name"
                            value={attendee.name}
                            onChange={(e) =>
                              handleAttendeeChange(index, "name", e.target.value)
                            }
                            required
                          />
                        </div>

                        {/* Age */}
                        <div className="space-y-2">
                          <Label htmlFor={`age-${index}`}>Age</Label>
                          <Input
                            id={`age-${index}`}
                            type="number"
                            placeholder="Enter age"
                            min="1"
                            max="120"
                            value={attendee.age}
                            onChange={(e) =>
                              handleAttendeeChange(index, "age", e.target.value)
                            }
                            required
                          />
                        </div>

                        {/* Phone */}
                        <div className="space-y-2">
                          <Label htmlFor={`phone-${index}`}>Phone Number</Label>
                          <Input
                            id={`phone-${index}`}
                            type="tel"
                            placeholder="Enter phone number"
                            value={attendee.phone}
                            onChange={(e) =>
                              handleAttendeeChange(index, "phone", e.target.value)
                            }
                            required
                          />
                        </div>

                        {/* Gender */}
                        <div className="space-y-2">
                          <Label htmlFor={`gender-${index}`}>Gender</Label>
                          <Select
                            value={attendee.gender}
                            onValueChange={(value) =>
                              handleAttendeeChange(index, "gender", value)
                            }
                          >
                            <SelectTrigger>
                              <SelectValue placeholder="Select gender" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="male">Male</SelectItem>
                              <SelectItem value="female">Female</SelectItem>
                              <SelectItem value="other">Other</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Submit Button */}
                <Button type="submit" size="lg" className="w-full">
                  Proceed to Confirmation
                </Button>
              </form>
            </div>
          </div>

          {/* Event Summary Sidebar */}
          <div className="lg:col-span-1">
            <div className="bg-card rounded-xl border border-border p-6 shadow-sm sticky top-24">
              <h2 className="text-lg font-semibold text-foreground mb-4">Event Summary</h2>
              
              <img
                src={event.image}
                alt={event.title}
                className="w-full h-40 object-cover rounded-lg mb-4"
              />
              
              <h3 className="font-semibold text-foreground mb-3">{event.title}</h3>
              
              <div className="space-y-2 text-sm text-muted-foreground mb-6">
                <div className="flex items-center gap-2">
                  <Calendar className="h-4 w-4" />
                  <span>{event.date}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Clock className="h-4 w-4" />
                  <span>{event.time}</span>
                </div>
                <div className="flex items-center gap-2">
                  <MapPin className="h-4 w-4" />
                  <span>{event.location}, {event.city}</span>
                </div>
              </div>

              <div className="border-t border-border pt-4 space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Price per ticket</span>
                  <span className="text-foreground">
                    {event.price === 0 ? "Free" : `₹${event.price.toLocaleString()}`}
                  </span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Quantity</span>
                  <span className="text-foreground">{ticketCount}</span>
                </div>
                <div className="flex justify-between font-semibold text-lg pt-2 border-t border-border">
                  <span className="text-foreground">Total</span>
                  <span className="text-primary">
                    {event.price === 0 ? "Free" : `₹${(event.price * ticketCount).toLocaleString()}`}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default BookingForm;
