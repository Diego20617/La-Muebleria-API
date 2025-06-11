"use client"

import type React from "react"

import { ArrowLeft } from "lucide-react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"

interface AdminHeaderProps {
  title: string
  description?: string
  backUrl?: string
  children?: React.ReactNode
}

export function AdminHeader({ title, description, backUrl, children }: AdminHeaderProps) {
  const router = useRouter()

  const handleBack = () => {
    if (backUrl) {
      router.push(backUrl)
    } else {
      router.back()
    }
  }

  return (
    <div className="border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-16 items-center px-4">
        <Button variant="ghost" size="icon" onClick={handleBack} className="mr-4">
          <ArrowLeft className="h-4 w-4" />
        </Button>
        <div className="flex-1">
          <h1 className="text-xl font-semibold">{title}</h1>
          {description && <p className="text-sm text-muted-foreground">{description}</p>}
        </div>
        {children && <div className="flex items-center space-x-2">{children}</div>}
      </div>
    </div>
  )
}
