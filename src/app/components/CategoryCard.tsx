import * as Icons from 'lucide-react';
import { Card } from './ui/card';

interface CategoryCardProps {
  name: string;
  icon: string;
  count: number;
  onClick: () => void;
}

export function CategoryCard({ name, icon, count, onClick }: CategoryCardProps) {
  const IconComponent = Icons[icon as keyof typeof Icons] as React.ComponentType<{ className?: string }>;

  return (
    <Card
      className="p-6 hover:shadow-xl hover:border-primary transition-all duration-300 cursor-pointer group bg-card border-border hover:-translate-y-1"
      onClick={onClick}
    >
      <div className="flex flex-col items-center text-center gap-3">
        <div className="w-14 h-14 rounded-full bg-primary/10 flex items-center justify-center group-hover:bg-primary group-hover:shadow-lg group-hover:shadow-primary/30 transition-all duration-300">
          {IconComponent && <IconComponent className="w-7 h-7 text-primary group-hover:text-primary-foreground transition-colors" />}
        </div>
        <div>
          <h3 className="font-semibold mb-1 text-foreground">{name}</h3>
          <p className="text-sm text-muted-foreground">{count.toLocaleString()} influencers</p>
        </div>
      </div>
    </Card>
  );
}