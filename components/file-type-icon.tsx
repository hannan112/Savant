import { FileText, File, Image as ImageIcon, FileSpreadsheet, FileImage } from 'lucide-react'
import { cn } from '@/lib/utils'

interface FileTypeIconProps {
  type: string
  size?: 'sm' | 'md' | 'lg'
  className?: string
}

const iconSizes = {
  sm: 'h-6 w-6',
  md: 'h-8 w-8',
  lg: 'h-12 w-12',
}

const typeColors: Record<string, string> = {
  PDF: 'text-red-600',
  DOCX: 'text-blue-600',
  DOC: 'text-blue-700',
  XLSX: 'text-green-600',
  XLS: 'text-green-700',
  PPTX: 'text-orange-600',
  PPT: 'text-orange-700',
  JPG: 'text-pink-600',
  JPEG: 'text-pink-600',
  PNG: 'text-purple-600',
  GIF: 'text-yellow-600',
  WEBP: 'text-indigo-600',
}

const borderColors: Record<string, string> = {
  PDF: 'border-red-200 dark:border-red-800',
  DOCX: 'border-blue-200 dark:border-blue-800',
  DOC: 'border-blue-200 dark:border-blue-800',
  XLSX: 'border-green-200 dark:border-green-800',
  XLS: 'border-green-200 dark:border-green-800',
  PPTX: 'border-orange-200 dark:border-orange-800',
  PPT: 'border-orange-200 dark:border-orange-800',
  JPG: 'border-pink-200 dark:border-pink-800',
  JPEG: 'border-pink-200 dark:border-pink-800',
  PNG: 'border-purple-200 dark:border-purple-800',
  GIF: 'border-yellow-200 dark:border-yellow-800',
  WEBP: 'border-indigo-200 dark:border-indigo-800',
}

export function FileTypeIcon({ type, size = 'md', className }: FileTypeIconProps) {
  const normalizedType = type.toUpperCase()
  const sizeClass = iconSizes[size]
  const colorClass = typeColors[normalizedType] || 'text-gray-600'

  const getIcon = () => {
    switch (normalizedType) {
      case 'PDF':
        return <FileText className={cn(sizeClass, colorClass)} />
      case 'DOCX':
      case 'DOC':
        return <File className={cn(sizeClass, colorClass)} />
      case 'XLSX':
      case 'XLS':
        return <FileSpreadsheet className={cn(sizeClass, colorClass)} />
      case 'PPTX':
      case 'PPT':
        return <FileImage className={cn(sizeClass, colorClass)} />
      case 'JPG':
      case 'JPEG':
      case 'PNG':
      case 'GIF':
      case 'WEBP':
        return <ImageIcon className={cn(sizeClass, colorClass)} />
      default:
        return <FileText className={cn(sizeClass, 'text-gray-600')} />
    }
  }

  const borderColorClass = borderColors[normalizedType] || 'border-gray-200 dark:border-gray-800'

  return (
    <div className={cn('flex items-center justify-center', className)}>
      <div className="relative flex flex-col items-center gap-2">
        <div className={cn(
          'rounded-lg p-3 bg-background border-2 shadow-sm',
          borderColorClass
        )}>
          {getIcon()}
        </div>
        <span className={cn(
          'text-xs font-semibold',
          colorClass
        )}>
          {normalizedType}
        </span>
      </div>
    </div>
  )
}

