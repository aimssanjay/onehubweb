import { Shield, Lock, CreditCard, Check, ArrowLeft } from 'lucide-react';
import { Card } from '../components/ui/card';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Label } from '../components/ui/label';
import { Badge } from '../components/ui/badge';
import { Separator } from '../components/ui/separator';
import type { Influencer, Package } from '../../data/mockData';

interface CheckoutProps {
  influencer?: Influencer;
  package?: Package;
  onNavigate: (page: string, data?: any) => void;
}

export function Checkout({ influencer, package: pkg, onNavigate }: CheckoutProps) {
  if (!influencer || !pkg) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <Card className="p-8 text-center">
          <p className="text-muted-foreground mb-4">No package selected</p>
          <Button onClick={() => onNavigate('browse')}>Browse Influencers</Button>
        </Card>
      </div>
    );
  }

  const platformFee = pkg.price * 0.05; // 5% platform fee
  const total = pkg.price + platformFee;

  const handleCheckout = (e: React.FormEvent) => {
    e.preventDefault();
    // Mock checkout success
    alert('Order placed successfully! You will be redirected to your dashboard.');
    onNavigate('brand-dashboard');
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Back Button */}
        <Button
          variant="ghost"
          onClick={() => onNavigate('profile', { id: influencer.id })}
          className="gap-2 mb-6"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to Profile
        </Button>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Payment Form */}
          <div className="lg:col-span-2">
            <Card className="p-8">
              <h1 className="text-3xl font-bold mb-6">Secure Checkout</h1>

              <form onSubmit={handleCheckout} className="space-y-6">
                {/* Contact Information */}
                <div>
                  <h2 className="text-xl font-semibold mb-4">Contact Information</h2>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="firstName">First Name</Label>
                      <Input id="firstName" placeholder="John" required />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="lastName">Last Name</Label>
                      <Input id="lastName" placeholder="Doe" required />
                    </div>
                  </div>
                  <div className="space-y-2 mt-4">
                    <Label htmlFor="email">Email</Label>
                    <Input id="email" type="email" placeholder="you@company.com" required />
                  </div>
                </div>

                <Separator />

                {/* Payment Details */}
                <div>
                  <h2 className="text-xl font-semibold mb-4">Payment Details</h2>
                  
                  <div className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="cardNumber">Card Number</Label>
                      <div className="relative">
                        <CreditCard className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                        <Input
                          id="cardNumber"
                          placeholder="1234 5678 9012 3456"
                          className="pl-10"
                          required
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="expiry">Expiry Date</Label>
                        <Input id="expiry" placeholder="MM/YY" required />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="cvc">CVC</Label>
                        <Input id="cvc" placeholder="123" required />
                      </div>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="nameOnCard">Name on Card</Label>
                      <Input id="nameOnCard" placeholder="John Doe" required />
                    </div>
                  </div>
                </div>

                <Separator />

                {/* Campaign Details */}
                <div>
                  <h2 className="text-xl font-semibold mb-4">Campaign Details (Optional)</h2>
                  <div className="space-y-2">
                    <Label htmlFor="brief">Campaign Brief</Label>
                    <textarea
                      id="brief"
                      className="w-full min-h-[120px] px-3 py-2 rounded-lg border border-input bg-input-background"
                      placeholder="Provide details about your campaign, key messages, dos and don'ts..."
                    />
                    <p className="text-xs text-muted-foreground">
                      You can also send this information later through messages
                    </p>
                  </div>
                </div>

                {/* Trust Badges */}
                <div className="flex flex-wrap gap-4 py-4 px-6 bg-gray-50 rounded-lg">
                  <div className="flex items-center gap-2 text-sm">
                    <Shield className="w-5 h-5 text-green-600" />
                    <span>Secure Payment</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm">
                    <Lock className="w-5 h-5 text-green-600" />
                    <span>256-bit Encryption</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm">
                    <Check className="w-5 h-5 text-green-600" />
                    <span>Money-back Guarantee</span>
                  </div>
                </div>

                {/* Submit Button */}
                <Button type="submit" size="lg" className="w-full">
                  Complete Order - ${total.toFixed(2)}
                </Button>

                <p className="text-xs text-muted-foreground text-center">
                  By completing this purchase, you agree to our{' '}
                  <a href="#" className="text-primary hover:underline">
                    Terms of Service
                  </a>
                </p>
              </form>
            </Card>
          </div>

          {/* Order Summary */}
          <div>
            <Card className="p-6 sticky top-24">
              <h2 className="text-xl font-semibold mb-4">Order Summary</h2>

              {/* Influencer Info */}
              <div className="flex items-center gap-3 mb-6 pb-6 border-b">
                <div className="w-16 h-16 rounded-full overflow-hidden bg-gray-200 flex-shrink-0">
                  <img
                    src={influencer.profileImage}
                    alt={influencer.name}
                    className="w-full h-full object-cover"
                  />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="font-semibold truncate">{influencer.name}</p>
                  <p className="text-sm text-muted-foreground truncate">{influencer.username}</p>
                  <Badge variant="secondary" className="mt-1">
                    {influencer.category}
                  </Badge>
                </div>
              </div>

              {/* Package Details */}
              <div className="mb-6">
                <h3 className="font-semibold mb-3">{pkg.type}</h3>
                <div className="space-y-2">
                  {pkg.deliverables.map((item, index) => (
                    <div key={index} className="flex items-start gap-2 text-sm">
                      <Check className="w-4 h-4 text-green-600 mt-0.5 flex-shrink-0" />
                      <span className="text-muted-foreground">{item}</span>
                    </div>
                  ))}
                </div>
                <div className="mt-3 text-sm text-muted-foreground">
                  Delivery: {pkg.deliveryTime}
                </div>
              </div>

              {/* Price Breakdown */}
              <div className="space-y-3 mb-6 pb-6 border-b">
                <div className="flex items-center justify-between">
                  <span className="text-muted-foreground">Package price</span>
                  <span className="font-semibold">${pkg.price.toFixed(2)}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-muted-foreground">Platform fee (5%)</span>
                  <span className="font-semibold">${platformFee.toFixed(2)}</span>
                </div>
              </div>

              {/* Total */}
              <div className="flex items-center justify-between mb-6">
                <span className="text-lg font-semibold">Total</span>
                <span className="text-2xl font-bold text-primary">${total.toFixed(2)}</span>
              </div>

              {/* Protection Info */}
              <Card className="p-4 bg-blue-50 border-blue-200">
                <div className="flex gap-3">
                  <Shield className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" />
                  <div>
                    <p className="font-semibold text-blue-900 mb-1">Buyer Protection</p>
                    <p className="text-sm text-blue-800">
                      Your payment is held securely until you approve the final deliverables.
                    </p>
                  </div>
                </div>
              </Card>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}