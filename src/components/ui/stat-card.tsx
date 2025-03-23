import * as React from "react"
import { Card, CardContent } from "@/components/ui/card"
import { cn } from "@/lib/utils"

interface StatCardProps extends React.HTMLAttributes<HTMLDivElement> {
  name: string
  value: string
  unit?: string
}

export function StatCard({ name, value, unit, className, ...props }: StatCardProps) {
  return (
    <Card className={cn("bg-gray-800/10 border-white/20", className)} {...props}>
      <CardContent className="p-6">
        <div className="text-sm font-medium leading-6 text-gray-400">
          {name}
        </div>
        <div className="mt-2 flex items-baseline gap-x-2">
          <div className="text-2xl font-semibold tracking-tight text-white">
            {value}
          </div>
          {unit && (
            <div className="text-sm text-gray-400">
              {unit}
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  )
} 