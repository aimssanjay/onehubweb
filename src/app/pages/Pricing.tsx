import { Check, X, Sparkles } from 'lucide-react';
import { Card } from '../components/ui/card';
import { Button } from '../components/ui/button';
import { Badge } from '../components/ui/badge';
import { brandPlans } from '../../data/mockData';

interface PricingProps {
  onNavigate: (page: string, data?: any) => void;
}

export function Pricing({ onNavigate }: PricingProps) {
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <section className="bg-white border-b py-16 px-4">
        <div className="max-w-4xl mx-auto text-center">
          <Badge className="mb-6 bg-primary/10 text-primary border-primary/20">
            Simple, Transparent Pricing
          </Badge>
          <h1 className="text-5xl font-bold mb-6">
            Plans That Grow With Your Business
          </h1>
          <p className="text-xl text-muted-foreground mb-8">
            Choose the perfect plan for your influencer marketing needs. No hidden fees, cancel anytime.
          </p>
        </div>
      </section>

      {/* Pricing Cards */}
      <section className="py-16 px-4">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {brandPlans.map((plan) => (
              <Card
                key={plan.id}
                className={`p-8 relative ${
                  plan.popular ? 'border-primary shadow-xl scale-105' : ''
                }`}
              >
                {plan.popular && (
                  <Badge className="absolute -top-3 left-1/2 -translate-x-1/2 bg-primary">
                    Most Popular
                  </Badge>
                )}

                <div className="text-center mb-8">
                  <h3 className="text-2xl font-bold mb-2">{plan.name}</h3>
                  <p className="text-muted-foreground mb-6">{plan.description}</p>
                  
                  <div className="mb-4">
                    {plan.price === null ? (
                      <div>
                        <p className="text-4xl font-bold">Custom</p>
                        <p className="text-muted-foreground">Contact us</p>
                      </div>
                    ) : plan.price === 0 ? (
                      <div>
                        <p className="text-4xl font-bold">Free</p>
                        <p className="text-muted-foreground">Forever</p>
                      </div>
                    ) : (
                      <div>
                        <div className="flex items-baseline justify-center gap-1">
                          <span className="text-4xl font-bold">${plan.price}</span>
                          <span className="text-muted-foreground">/{plan.period}</span>
                        </div>
                        <p className="text-muted-foreground">Billed monthly</p>
                      </div>
                    )}
                  </div>

                  <Button
                    className="w-full"
                    variant={plan.popular ? 'default' : 'outline'}
                    onClick={() => onNavigate('signup')}
                  >
                    {plan.cta}
                  </Button>
                </div>

                <div className="space-y-3">
                  {plan.features.map((feature, index) => (
                    <div key={index} className="flex items-start gap-3">
                      <Check className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" />
                      <span className="text-sm">{feature}</span>
                    </div>
                  ))}
                  {plan.limitations.map((limitation, index) => (
                    <div key={index} className="flex items-start gap-3 opacity-50">
                      <X className="w-5 h-5 text-gray-400 flex-shrink-0 mt-0.5" />
                      <span className="text-sm">{limitation}</span>
                    </div>
                  ))}
                </div>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Influencer Commission */}
      <section className="py-16 px-4 bg-white border-y">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-12">
            <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-6">
              <Sparkles className="w-8 h-8 text-primary" />
            </div>
            <h2 className="text-4xl font-bold mb-4">For Influencers</h2>
            <p className="text-xl text-muted-foreground">
              It's free to join and start earning
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <Card className="p-8">
              <h3 className="text-2xl font-semibold mb-4">How It Works</h3>
              <div className="space-y-4">
                <div className="flex gap-3">
                  <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
                    <span className="font-semibold text-primary">1</span>
                  </div>
                  <div>
                    <p className="font-semibold">Create Your Profile</p>
                    <p className="text-sm text-muted-foreground">Completely free to join</p>
                  </div>
                </div>
                <div className="flex gap-3">
                  <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
                    <span className="font-semibold text-primary">2</span>
                  </div>
                  <div>
                    <p className="font-semibold">Set Your Packages</p>
                    <p className="text-sm text-muted-foreground">You control your pricing</p>
                  </div>
                </div>
                <div className="flex gap-3">
                  <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
                    <span className="font-semibold text-primary">3</span>
                  </div>
                  <div>
                    <p className="font-semibold">Start Earning</p>
                    <p className="text-sm text-muted-foreground">Get paid for every collaboration</p>
                  </div>
                </div>
              </div>
            </Card>

            <Card className="p-8 bg-primary text-white">
              <h3 className="text-2xl font-semibold mb-4">Commission Structure</h3>
              <div className="space-y-4">
                <div className="bg-white/10 rounded-lg p-4">
                  <p className="text-3xl font-bold mb-2">15%</p>
                  <p className="text-white/90">Platform commission on each project</p>
                </div>
                <div className="space-y-2 text-sm">
                  <div className="flex items-center gap-2">
                    <Check className="w-4 h-4" />
                    <span>Secure payment processing</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Check className="w-4 h-4" />
                    <span>Buyer protection & dispute resolution</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Check className="w-4 h-4" />
                    <span>Marketing & exposure to brands</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Check className="w-4 h-4" />
                    <span>24/7 customer support</span>
                  </div>
                </div>
              </div>
            </Card>
          </div>

          <div className="text-center mt-8">
            <Button
              size="lg"
              onClick={() => onNavigate('signup-influencer')}
            >
              Join as a Creator
            </Button>
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section className="py-16 px-4">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-4xl font-bold text-center mb-12">
            Frequently Asked Questions
          </h2>
          
          <div className="space-y-6">
            {[
              {
                q: 'Can I change my plan later?',
                a: 'Yes! You can upgrade, downgrade, or cancel your plan at any time. Changes take effect immediately.',
              },
              {
                q: 'What payment methods do you accept?',
                a: 'We accept all major credit cards (Visa, Mastercard, American Express) and PayPal for brand subscriptions.',
              },
              {
                q: 'Is there a contract or commitment?',
                a: 'No contracts required. Our plans are month-to-month and you can cancel anytime without penalty.',
              },
              {
                q: 'How do influencer payments work?',
                a: 'Influencers receive payment 48 hours after the brand approves the deliverables. We handle all payment processing securely.',
              },
            ].map((faq, index) => (
              <Card key={index} className="p-6">
                <h3 className="text-lg font-semibold mb-2">{faq.q}</h3>
                <p className="text-muted-foreground">{faq.a}</p>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="bg-primary py-16 px-4">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-4xl font-bold text-white mb-6">
            Ready to Get Started?
          </h2>
          <p className="text-xl text-white/90 mb-8">
            Join thousands of brands and creators already succeeding on InfluenceHub
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button size="lg" variant="secondary" onClick={() => onNavigate('signup')}>
              Start as a Brand
            </Button>
            <Button
              size="lg"
              variant="outline"
              className="border-white text-white hover:bg-white/10"
              onClick={() => onNavigate('signup-influencer')}
            >
              Join as Creator
            </Button>
          </div>
        </div>
      </section>
    </div>
  );
}
