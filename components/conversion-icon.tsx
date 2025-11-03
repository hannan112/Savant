import { FileTypeIcon } from './file-type-icon'
import { ArrowRight } from 'lucide-react'
import { cn } from '@/lib/utils'

interface ConversionIconProps {
  from: string | string[]
  to: string
  size?: 'sm' | 'md' | 'lg'
  className?: string
}

export function ConversionIcon({ from, to, size = 'md', className }: ConversionIconProps) {
  const fromTypes = Array.isArray(from) ? from : [from]
  const primaryFrom = fromTypes[0]

  return (
    <div className={cn('flex items-center justify-center gap-3', className)}>
      {/* From format icon */}
      <FileTypeIcon type={primaryFrom} size={size} />
      
      {/* Arrow */}
      <ArrowRight className={cn(
        size === 'sm' ? 'h-4 w-4' : size === 'md' ? 'h-5 w-5' : 'h-6 w-6',
        'text-muted-foreground'
      )} />
      
      {/* To format icon */}
      <FileTypeIcon type={to} size={size} />
    </div>
  )
}

