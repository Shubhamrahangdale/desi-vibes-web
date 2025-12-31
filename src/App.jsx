import { useEffect } from "react";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "@/context/AuthContext";
import { AdminProvider } from "@/context/AdminContext";
import { OrganiserProvider } from "@/context/OrganiserContext";
import { EventProvider } from "@/context/EventContext";
import Index from "./pages/Index";
import Events from "./pages/Events";
import EventDetails from "./pages/EventDetails";
import BookingForm from "./pages/BookingForm";
import BookingConfirmation from "./pages/BookingConfirmation";
import Login from "./pages/Login";
import Register from "./pages/Register";
import About from "./pages/About";
import Contact from "./pages/Contact";
import NotFound from "./pages/NotFound";
import OrganizerDashboard from "./pages/OrganizerDashboard";
import Profile from "./pages/Profile";
import AdminLogin from "./pages/admin/AdminLogin";
import AdminDashboard from "./pages/admin/AdminDashboard";
import AdminOrganisers from "./pages/admin/AdminOrganisers";
import AdminEvents from "./pages/admin/AdminEvents";
import AdminTransactions from "./pages/admin/AdminTransactions";

const App = () => {
  // Force light mode as default
  useEffect(() => {
    document.documentElement.classList.remove('dark');
    localStorage.setItem('theme', 'light');
  }, []);

  return (
    <AuthProvider>
      <AdminProvider>
        <OrganiserProvider>
          <EventProvider>
            <TooltipProvider>
              <Toaster />
              <BrowserRouter>
                <Routes>
                  {/* Public Routes */}
                  <Route path="/" element={<Index />} />
                  <Route path="/events" element={<Events />} />
                  <Route path="/events/:id" element={<EventDetails />} />
                  <Route path="/events/:id/book" element={<BookingForm />} />
                  <Route path="/booking/confirmation" element={<BookingConfirmation />} />
                  <Route path="/login" element={<Login />} />
                  <Route path="/register" element={<Register />} />
                  <Route path="/about" element={<About />} />
                  <Route path="/contact" element={<Contact />} />
                  <Route path="/organizer" element={<OrganizerDashboard />} />
                  <Route path="/profile" element={<Profile />} />
                  
                  {/* Admin Routes */}
                  <Route path="/admin" element={<AdminLogin />} />
                  <Route path="/admin/login" element={<AdminLogin />} />
                  <Route path="/admin/dashboard" element={<AdminDashboard />} />
                  <Route path="/admin/organisers" element={<AdminOrganisers />} />
                  <Route path="/admin/events" element={<AdminEvents />} />
                  <Route path="/admin/transactions" element={<AdminTransactions />} />
                  
                  <Route path="*" element={<NotFound />} />
                </Routes>
              </BrowserRouter>
            </TooltipProvider>
          </EventProvider>
        </OrganiserProvider>
      </AdminProvider>
    </AuthProvider>
  );
};

export default App;
