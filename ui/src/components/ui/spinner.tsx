import { Loader2Icon } from 'lucide-react'

import { cn } from '@/lib/utils'

function Spinner({ className, ...props }: React.ComponentProps<'svg'>) {
  return (
    <div className="fixed inset-0 flex items-center justify-center z-50 bg-background/60">
      <Loader2Icon
        role="status"
        aria-label="Loading"
        className={cn('size-24 animate-spin', className)}
        {...props}
      />
    </div>
  )
}

export { Spinner }
