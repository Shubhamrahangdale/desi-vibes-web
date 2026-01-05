import { Link } from "react-router-dom";
import { 
  Calendar, 
  Users, 
  BarChart3, 
  CreditCard, 
  Shield, 
  Zap,
  CheckCircle,
  ArrowRight,
  Star
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";

const features = [
  {
    icon: Calendar,
    title: "Easy Event Creation",
    description: "Create and manage events in minutes with our intuitive dashboard."
  },
  {
    icon: Users,
    title: "Attendee Management",
    description: "Track registrations, send updates, and manage your audience effortlessly."
  },
  {
    icon: BarChart3,
    title: "Real-time Analytics",
    description: "Get insights on ticket sales, attendance, and revenue performance."
  },
  {
    icon: CreditCard,
    title: "Secure Payments",
    description: "Accept payments securely with Razorpay integration and instant settlements."
  },
  {
    icon: Shield,
    title: "Verified Badge",
    description: "Build trust with attendees through our verified organizer program."
  },
  {
    icon: Zap,
    title: "Instant Publishing",
    description: "Publish events instantly and reach thousands of potential attendees."
  }
];

const plans = [
  {
    name: "Starter",
    price: "Free",
    period: "",
    description: "Perfect for getting started",
    features: [
      "Up to 2 events per month",
      "Basic analytics",
      "Email support",
      "Standard listing"
    ],
    popular: false
  },
  {
    name: "Professional",
    price: "₹999",
    period: "/month",
    description: "For growing organizers",
    features: [
      "Unlimited events",
      "Advanced analytics",
      "Priority support",
      "Featured listings",
      "Custom branding"
    ],
    popular: true
  },
  {
    name: "Enterprise",
    price: "₹2,999",
    period: "/month",
    description: "For large-scale events",
    features: [
      "Everything in Professional",
      "Dedicated account manager",
      "API access",
      "White-label options",
      "Custom integrations"
    ],
    popular: false
  }
];

const testimonials = [
  {
    name: "Priya Sharma",
    role: "Event Manager, TechMeet",
    content: "This platform transformed how we manage our tech conferences. The analytics alone saved us hours of work.",
    rating: 5
  },
  {
    name: "Rahul Verma",
    role: "Founder, MusicFest India",
    content: "From small gigs to large festivals, the platform scales beautifully. Highly recommended!",
    rating: 5
  },
  {
    name: "Anita Desai",
    role: "Corporate Events, Infosys",
    content: "Secure payments and easy attendee management made our corporate events seamless.",
    rating: 5
  }
];

const OrganizerLanding = () => {
  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Navbar />
      
      <main className="flex-grow">
        {/* Hero Section */}
        <section className="relative py-20 px-4 bg-gradient-to-br from-primary/10 via-background to-secondary/10">
          <div className="container mx-auto text-center max-w-4xl">
            <span className="inline-block px-4 py-1.5 bg-primary/10 text-primary rounded-full text-sm font-medium mb-6">
              For Event Organizers
            </span>
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-foreground mb-6 leading-tight">
              Host Amazing Events,{" "}
              <span className="text-primary">Grow Your Audience</span>
            </h1>
            <p className="text-lg md:text-xl text-muted-foreground mb-8 max-w-2xl mx-auto">
              The all-in-one platform for creating, managing, and selling tickets for your events. 
              Join thousands of successful organizers.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button asChild size="lg" className="text-lg px-8">
                <Link to="/register">
                  Start Free Today
                  <ArrowRight className="ml-2 w-5 h-5" />
                </Link>
              </Button>
              <Button asChild variant="outline" size="lg" className="text-lg px-8">
                <Link to="/login">
                  Already an Organizer? Login
                </Link>
              </Button>
            </div>
            
            {/* Stats */}
            <div className="grid grid-cols-3 gap-8 mt-16 max-w-2xl mx-auto">
              <div>
                <div className="text-3xl md:text-4xl font-bold text-primary">10K+</div>
                <div className="text-sm text-muted-foreground">Events Hosted</div>
              </div>
              <div>
                <div className="text-3xl md:text-4xl font-bold text-primary">500K+</div>
                <div className="text-sm text-muted-foreground">Tickets Sold</div>
              </div>
              <div>
                <div className="text-3xl md:text-4xl font-bold text-primary">2K+</div>
                <div className="text-sm text-muted-foreground">Organizers</div>
              </div>
            </div>
          </div>
        </section>

        {/* Features Section */}
        <section className="py-20 px-4 bg-muted/30">
          <div className="container mx-auto max-w-6xl">
            <div className="text-center mb-12">
              <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
                Everything You Need to Succeed
              </h2>
              <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
                Powerful tools designed to help you create memorable events and grow your audience.
              </p>
            </div>
            
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {features.map((feature, index) => (
                <Card key={index} className="border-border/50 hover:border-primary/50 transition-colors">
                  <CardContent className="p-6">
                    <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center mb-4">
                      <feature.icon className="w-6 h-6 text-primary" />
                    </div>
                    <h3 className="text-xl font-semibold text-foreground mb-2">{feature.title}</h3>
                    <p className="text-muted-foreground">{feature.description}</p>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </section>

        {/* Pricing Section */}
        <section className="py-20 px-4">
          <div className="container mx-auto max-w-6xl">
            <div className="text-center mb-12">
              <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
                Simple, Transparent Pricing
              </h2>
              <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
                Choose the plan that fits your needs. No hidden fees, cancel anytime.
              </p>
            </div>
            
            <div className="grid md:grid-cols-3 gap-6">
              {plans.map((plan, index) => (
                <Card 
                  key={index} 
                  className={`relative ${plan.popular ? 'border-primary shadow-lg scale-105' : 'border-border/50'}`}
                >
                  {plan.popular && (
                    <div className="absolute -top-3 left-1/2 -translate-x-1/2">
                      <span className="bg-primary text-primary-foreground px-4 py-1 rounded-full text-sm font-medium">
                        Most Popular
                      </span>
                    </div>
                  )}
                  <CardContent className="p-6 pt-8">
                    <h3 className="text-xl font-semibold text-foreground mb-2">{plan.name}</h3>
                    <p className="text-muted-foreground text-sm mb-4">{plan.description}</p>
                    <div className="mb-6">
                      <span className="text-4xl font-bold text-foreground">{plan.price}</span>
                      <span className="text-muted-foreground">{plan.period}</span>
                    </div>
                    <ul className="space-y-3 mb-6">
                      {plan.features.map((feature, i) => (
                        <li key={i} className="flex items-center gap-2 text-sm">
                          <CheckCircle className="w-4 h-4 text-primary flex-shrink-0" />
                          <span className="text-foreground">{feature}</span>
                        </li>
                      ))}
                    </ul>
                    <Button 
                      asChild 
                      className="w-full" 
                      variant={plan.popular ? "default" : "outline"}
                    >
                      <Link to="/register">Get Started</Link>
                    </Button>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </section>

        {/* Testimonials Section */}
        <section className="py-20 px-4 bg-muted/30">
          <div className="container mx-auto max-w-6xl">
            <div className="text-center mb-12">
              <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
                Trusted by Organizers
              </h2>
              <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
                See what successful event organizers have to say about us.
              </p>
            </div>
            
            <div className="grid md:grid-cols-3 gap-6">
              {testimonials.map((testimonial, index) => (
                <Card key={index} className="border-border/50">
                  <CardContent className="p-6">
                    <div className="flex gap-1 mb-4">
                      {[...Array(testimonial.rating)].map((_, i) => (
                        <Star key={i} className="w-4 h-4 fill-primary text-primary" />
                      ))}
                    </div>
                    <p className="text-foreground mb-4 italic">"{testimonial.content}"</p>
                    <div>
                      <div className="font-semibold text-foreground">{testimonial.name}</div>
                      <div className="text-sm text-muted-foreground">{testimonial.role}</div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-20 px-4 bg-primary text-primary-foreground">
          <div className="container mx-auto max-w-4xl text-center">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              Ready to Host Your First Event?
            </h2>
            <p className="text-lg opacity-90 mb-8 max-w-2xl mx-auto">
              Join thousands of organizers who trust us with their events. 
              Get started for free today.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button asChild size="lg" variant="secondary" className="text-lg px-8">
                <Link to="/register">
                  Create Your First Event
                  <ArrowRight className="ml-2 w-5 h-5" />
                </Link>
              </Button>
              <Button asChild size="lg" variant="outline" className="text-lg px-8 border-primary-foreground/30 text-primary-foreground hover:bg-primary-foreground/10">
                <Link to="/contact">
                  Contact Sales
                </Link>
              </Button>
            </div>
          </div>
        </section>
      </main>
      
      <Footer />
    </div>
  );
};

export default OrganizerLanding;
