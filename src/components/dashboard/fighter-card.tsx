import * as React from "react"
import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { cn } from "@/lib/utils"

interface Fighter {
  id: string
  name: string
  image?: string
  organization?: string
}

interface FighterCardProps extends React.HTMLAttributes<HTMLDivElement> {
  fighter: Fighter
}

export function FighterCard({ fighter, className, ...props }: FighterCardProps) {
  const imageSrc = fighter.image || '/images/fighter-placeholder.jpg'

  return (
    <Card 
      className={cn(
        "overflow-hidden hover:bg-gray-700/30 transition-colors duration-200 bg-gray-800/20 border-white/10",
        className
      )} 
      {...props}
    >
      <div className="aspect-square w-full bg-gray-900 relative">
        <img 
          src={imageSrc} 
          alt={`${fighter.name}`} 
          className="w-full h-full object-cover"
          onError={(e) => {
            const target = e.target as HTMLImageElement
            target.onerror = null
            target.src = '/images/fighter-placeholder.jpg'
          }}
        />
      </div>
      <CardContent className="p-4">
        <h3 className="text-lg font-medium text-white truncate">
          {fighter.name}
        </h3>
        {fighter.organization && (
          <p className="text-sm text-gray-400 mt-1">
            {fighter.organization}
          </p>
        )}
      </CardContent>
    </Card>
  )
} 