import { Link, useLocation } from "react-router-dom";
import { XCircle, RefreshCw, ArrowLeft, Phone } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";

const PaymentFailed = () => {
  const location = useLocation();
  const { planName, amount, errorMessage } = location.state || {};

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Navbar />
      
      <main className="flex-grow flex items-center justify-center py-12 px-4">
        <Card className="w-full max-w-md border-destructive/20">
          <CardContent className="pt-8 pb-8 text-center">
            {/* Failed Icon */}
            <div className="mx-auto w-20 h-20 bg-destructive/10 rounded-full flex items-center justify-center mb-6">
              <XCircle className="w-12 h-12 text-destructive" />
            </div>
            
            {/* Title */}
            <h1 className="text-2xl font-bold text-foreground mb-2">
              Payment Failed
            </h1>
            
            <p className="text-muted-foreground mb-6">
              Unfortunately, your payment could not be processed. Please try again.
            </p>
            
            {/* Transaction Details */}
            {(planName || amount) && (
              <div className="bg-muted/50 rounded-lg p-4 mb-6 text-left">
                <h3 className="font-semibold text-foreground mb-3">Transaction Details</h3>
                <div className="space-y-2 text-sm">
                  {planName && (
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Plan:</span>
                      <span className="font-medium text-foreground">{planName}</span>
                    </div>
                  )}
                  {amount && (
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Amount:</span>
                      <span className="font-medium text-foreground">₹{amount.toLocaleString()}</span>
                    </div>
                  )}
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Status:</span>
                    <span className="font-medium text-destructive">Failed</span>
                  </div>
                </div>
              </div>
            )}
            
            {/* Error Message */}
            {errorMessage && (
              <div className="bg-destructive/10 border border-destructive/20 rounded-lg p-3 mb-6">
                <p className="text-sm text-destructive">{errorMessage}</p>
              </div>
            )}
            
            {/* Common Reasons */}
            <div className="bg-muted/30 rounded-lg p-4 mb-6 text-left">
              <h3 className="font-semibold text-foreground mb-2 text-sm">Common reasons for failure:</h3>
              <ul className="text-xs text-muted-foreground space-y-1">
                <li>• Insufficient funds in your account</li>
                <li>• Card declined by the bank</li>
                <li>• Network connectivity issues</li>
                <li>• Incorrect card details entered</li>
              </ul>
            </div>
            
            {/* Action Buttons */}
            <div className="space-y-3">
              <Button asChild className="w-full" size="lg">
                <Link to="/organizer">
                  <RefreshCw className="w-4 h-4 mr-2" />
                  Try Again
                </Link>
              </Button>
              
              <Button asChild variant="outline" className="w-full">
                <Link to="/">
                  <ArrowLeft className="w-4 h-4 mr-2" />
                  Back to Home
                </Link>
              </Button>
              
              <Button asChild variant="ghost" className="w-full">
                <Link to="/contact">
                  <Phone className="w-4 h-4 mr-2" />
                  Contact Support
                </Link>
              </Button>
            </div>
          </CardContent>
        </Card>
      </main>
      
      <Footer />
    </div>
  );
};

export default PaymentFailed;
