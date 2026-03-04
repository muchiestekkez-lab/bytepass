import { cn } from '@/lib/utils';

interface CardProps {
  children: React.ReactNode;
  className?: string;
  hover?: boolean;
}

export default function Card({ children, className, hover = false }: CardProps) {
  return (
    <div
      className={cn(
        'bg-white/80 backdrop-blur-sm border border-white/60 rounded-3xl shadow-card p-6',
        hover && 'hover:shadow-card-hover hover:-translate-y-1 transition-all duration-300',
        className
      )}
    >
      {children}
    </div>
  );
}
