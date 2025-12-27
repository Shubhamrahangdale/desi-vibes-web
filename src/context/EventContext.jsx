import React, { createContext, useContext, useState } from 'react';

const EventContext = createContext(undefined);

// Demo events data
const initialEvents = [
  {
    id: '1',
    title: 'Diwali Night Festival 2024',
    description: 'A grand celebration of lights with cultural performances, food stalls, and fireworks.',
    date: '2024-11-01',
    time: '18:00',
    venue: 'Jio World Garden, Mumbai',
    city: 'Mumbai',
    category: 'Cultural',
    price: 1500,
    totalTickets: 500,
    soldTickets: 320,
    status: 'approved', // pending, approved, rejected
    organiserId: '1',
    organiserName: 'Rajesh Kumar',
    image: 'https://images.unsplash.com/photo-1605810230434-7631ac76ec81?w=400',
    createdAt: '2024-10-15',
  },
  {
    id: '2',
    title: 'Tech Startup Summit 2024',
    description: 'Connect with investors, founders, and tech enthusiasts at India\'s premier startup event.',
    date: '2024-12-15',
    time: '09:00',
    venue: 'HICC, Hyderabad',
    city: 'Hyderabad',
    category: 'Business',
    price: 2500,
    totalTickets: 300,
    soldTickets: 180,
    status: 'pending',
    organiserId: '1',
    organiserName: 'Rajesh Kumar',
    image: 'https://images.unsplash.com/photo-1519389950473-47ba0277781c?w=400',
    createdAt: '2024-12-01',
  },
  {
    id: '3',
    title: 'Classical Music Evening',
    description: 'An enchanting evening of Indian classical music featuring renowned artists.',
    date: '2024-12-20',
    time: '19:00',
    venue: 'Siri Fort Auditorium, Delhi',
    city: 'Delhi',
    category: 'Music',
    price: 800,
    totalTickets: 200,
    soldTickets: 45,
    status: 'pending',
    organiserId: '3',
    organiserName: 'Amit Patel',
    image: 'https://images.unsplash.com/photo-1514320291840-2e0a9bf2a9ae?w=400',
    createdAt: '2024-12-10',
  },
  {
    id: '4',
    title: 'Holi Color Festival',
    description: 'Celebrate the festival of colors with music, dance, and organic colors.',
    date: '2025-03-14',
    time: '10:00',
    venue: 'Nehru Stadium, Bangalore',
    city: 'Bangalore',
    category: 'Cultural',
    price: 1200,
    totalTickets: 1000,
    soldTickets: 0,
    status: 'approved',
    organiserId: '3',
    organiserName: 'Amit Patel',
    image: 'https://images.unsplash.com/photo-1492684223066-81342ee5ff30?w=400',
    createdAt: '2024-12-20',
  },
  {
    id: '5',
    title: 'Food & Wine Festival',
    description: 'A gastronomic journey featuring cuisines from across India and fine wines.',
    date: '2025-01-25',
    time: '12:00',
    venue: 'DLF Promenade, Delhi',
    city: 'Delhi',
    category: 'Food',
    price: 2000,
    totalTickets: 400,
    soldTickets: 0,
    status: 'rejected',
    organiserId: '1',
    organiserName: 'Rajesh Kumar',
    image: 'https://images.unsplash.com/photo-1555939594-58d7cb561ad1?w=400',
    createdAt: '2024-12-15',
  },
];

export const EventProvider = ({ children }) => {
  const [events, setEvents] = useState(initialEvents);

  const approveEvent = (id) => {
    setEvents((prev) =>
      prev.map((event) =>
        event.id === id ? { ...event, status: 'approved' } : event
      )
    );
  };

  const rejectEvent = (id) => {
    setEvents((prev) =>
      prev.map((event) =>
        event.id === id ? { ...event, status: 'rejected' } : event
      )
    );
  };

  const addEvent = (event) => {
    const newEvent = {
      id: Date.now().toString(),
      ...event,
      status: 'pending',
      soldTickets: 0,
      createdAt: new Date().toISOString().split('T')[0],
    };
    setEvents((prev) => [newEvent, ...prev]);
  };

  const updateEvent = (id, eventData) => {
    setEvents((prev) =>
      prev.map((event) =>
        event.id === id ? { ...event, ...eventData } : event
      )
    );
  };

  const deleteEvent = (id) => {
    setEvents((prev) => prev.filter((event) => event.id !== id));
  };

  // Get only approved events for public display
  const getApprovedEvents = () => {
    return events.filter((event) => event.status === 'approved');
  };

  return (
    <EventContext.Provider
      value={{
        events,
        approveEvent,
        rejectEvent,
        addEvent,
        updateEvent,
        deleteEvent,
        getApprovedEvents,
      }}
    >
      {children}
    </EventContext.Provider>
  );
};

export const useEvents = () => {
  const context = useContext(EventContext);
  if (context === undefined) {
    throw new Error('useEvents must be used within an EventProvider');
  }
  return context;
};
