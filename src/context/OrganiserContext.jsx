import React, { createContext, useContext, useState } from 'react';

const OrganiserContext = createContext(undefined);

// Demo organisers data
const initialOrganisers = [
  {
    id: '1',
    name: 'Rajesh Kumar',
    email: 'rajesh@example.com',
    phone: '+91 98765 43210',
    company: 'Event Masters India',
    status: 'active', // pending, active, inactive, rejected
    eventsManaged: 12,
    joinedDate: '2024-01-15',
    subscription: {
      status: 'active', // active, expired, pending
      plan: 'Annual Premium',
      amount: 25000,
      expiryDate: '2025-01-15',
      eventsAllowed: 50,
    },
  },
  {
    id: '2',
    name: 'Priya Sharma',
    email: 'priya@example.com',
    phone: '+91 87654 32109',
    company: 'Celebration Co.',
    status: 'pending',
    eventsManaged: 0,
    joinedDate: '2024-12-20',
    subscription: {
      status: 'pending',
      plan: 'None',
      amount: 0,
      expiryDate: null,
      eventsAllowed: 0,
    },
  },
  {
    id: '3',
    name: 'Amit Patel',
    email: 'amit@example.com',
    phone: '+91 76543 21098',
    company: 'Grand Events',
    status: 'active',
    eventsManaged: 8,
    joinedDate: '2024-06-10',
    subscription: {
      status: 'active',
      plan: 'Annual Basic',
      amount: 15000,
      expiryDate: '2025-06-10',
      eventsAllowed: 20,
    },
  },
  {
    id: '4',
    name: 'Sneha Reddy',
    email: 'sneha@example.com',
    phone: '+91 65432 10987',
    company: 'Royal Occasions',
    status: 'inactive',
    eventsManaged: 5,
    joinedDate: '2024-03-22',
    subscription: {
      status: 'expired',
      plan: 'Annual Basic',
      amount: 15000,
      expiryDate: '2024-12-22',
      eventsAllowed: 20,
    },
  },
  {
    id: '5',
    name: 'Vikram Singh',
    email: 'vikram@example.com',
    phone: '+91 54321 09876',
    company: 'Elite Events',
    status: 'pending',
    eventsManaged: 0,
    joinedDate: '2024-12-25',
    subscription: {
      status: 'pending',
      plan: 'None',
      amount: 0,
      expiryDate: null,
      eventsAllowed: 0,
    },
  },
];

export const OrganiserProvider = ({ children }) => {
  const [organisers, setOrganisers] = useState(initialOrganisers);

  const approveOrganiser = (id) => {
    setOrganisers((prev) =>
      prev.map((org) =>
        org.id === id ? { ...org, status: 'active' } : org
      )
    );
  };

  const rejectOrganiser = (id) => {
    setOrganisers((prev) =>
      prev.map((org) =>
        org.id === id ? { ...org, status: 'rejected' } : org
      )
    );
  };

  const setOrganiserInactive = (id) => {
    setOrganisers((prev) =>
      prev.map((org) =>
        org.id === id ? { ...org, status: 'inactive' } : org
      )
    );
  };

  const updateSubscription = (id, subscriptionData) => {
    setOrganisers((prev) =>
      prev.map((org) =>
        org.id === id
          ? {
              ...org,
              subscription: { ...org.subscription, ...subscriptionData },
            }
          : org
      )
    );
  };

  const addOrganiser = (organiser) => {
    const newOrganiser = {
      id: Date.now().toString(),
      ...organiser,
      status: 'pending',
      eventsManaged: 0,
      joinedDate: new Date().toISOString().split('T')[0],
      subscription: {
        status: 'pending',
        plan: 'None',
        amount: 0,
        expiryDate: null,
        eventsAllowed: 0,
      },
    };
    setOrganisers((prev) => [newOrganiser, ...prev]);
  };

  return (
    <OrganiserContext.Provider
      value={{
        organisers,
        approveOrganiser,
        rejectOrganiser,
        setOrganiserInactive,
        updateSubscription,
        addOrganiser,
      }}
    >
      {children}
    </OrganiserContext.Provider>
  );
};

export const useOrganisers = () => {
  const context = useContext(OrganiserContext);
  if (context === undefined) {
    throw new Error('useOrganisers must be used within an OrganiserProvider');
  }
  return context;
};
