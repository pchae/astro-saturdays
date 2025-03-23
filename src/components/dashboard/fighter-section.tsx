import * as React from "react"
import { FighterCard } from "./fighter-card"
import { cn } from "@/lib/utils"

interface Fighter {
  id: string
  name: string
  image?: string
  organization?: string
}

interface FighterSectionProps extends React.HTMLAttributes<HTMLDivElement> {
  title: string
  fighters: Fighter[]
}

export function FighterSection({ title, fighters = [], className, ...props }: FighterSectionProps) {
  return (
    <div className={cn("pb-12", className)} {...props}>
      <div>
        <h1 className="text-2xl font-bold text-white">
          {title}
        </h1>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 xl:grid-cols-6 2xl:grid-cols-8 gap-4 pt-4">
        {fighters.map(fighter => (
          <FighterCard key={fighter.id} fighter={fighter} />
        ))}
        
        {fighters.length === 0 && (
          <div className="col-span-full text-center py-8">
            <p className="text-gray-400">No fighters available</p>
          </div>
        )}
      </div>
    </div>
  )
} 