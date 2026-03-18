import { Clock, Check } from 'lucide-react';
import { Card } from './ui/card';
import { Button } from './ui/button';
import type { Package } from '../../data/mockData';

interface PackageCardProps {
  package: Package;
  onHire: () => void;
}

export function PackageCard({ package: pkg, onHire }: PackageCardProps) {
  return (
    <Card className="p-6 hover:shadow-lg transition-shadow">
      <div className="mb-4">
        <h3 className="font-semibold mb-2">{pkg.type}</h3>
        <p className="text-sm text-muted-foreground">{pkg.description}</p>
      </div>

      {/* Deliverables */}
      <div className="mb-4 space-y-2">
        {pkg.deliverables.map((item, index) => (
          <div key={index} className="flex items-start gap-2">
            <Check className="w-4 h-4 text-success mt-0.5 flex-shrink-0" />
            <span className="text-sm">{item}</span>
          </div>
        ))}
      </div>

      {/* Delivery Time */}
      <div className="flex items-center gap-2 mb-4 text-sm text-muted-foreground">
        <Clock className="w-4 h-4" />
        <span>{pkg.deliveryTime} delivery</span>
      </div>

      {/* Price & CTA */}
      <div className="pt-4 border-t flex items-center justify-between">
        <div>
          <p className="text-sm text-muted-foreground">Package price</p>
          <p className="text-2xl font-semibold text-primary">${pkg.price}</p>
        </div>
        <Button onClick={onHire} size="lg">
          Hire Now
        </Button>
      </div>
    </Card>
  );
}
