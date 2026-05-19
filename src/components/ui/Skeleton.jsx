import { motion } from 'framer-motion';

export const Skeleton = ({ className }) => (
  <div className={`bg-white/5 animate-pulse rounded-2xl ${className}`} />
);

export const CardSkeleton = () => (
  <div className="glass-card rounded-3xl p-4 flex flex-col gap-4">
    <Skeleton className="aspect-square w-full rounded-2xl" />
    <div className="px-1 space-y-2">
      <Skeleton className="h-6 w-3/4" />
      <Skeleton className="h-4 w-1/2" />
    </div>
  </div>
);

export const ListSkeleton = () => (
  <div className="space-y-4">
    {Array(5).fill(0).map((_, i) => (
      <div key={i} className="flex items-center gap-4 px-4 py-3 rounded-2xl bg-white/5">
        <Skeleton className="w-12 h-12" />
        <div className="flex-1 space-y-2">
          <Skeleton className="h-5 w-1/4" />
          <Skeleton className="h-4 w-1/3" />
        </div>
      </div>
    ))}
  </div>
);
