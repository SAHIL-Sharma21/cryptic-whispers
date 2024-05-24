'use client'

import { SessionProvider } from "next-auth/react"
import React from "react"

//session providrer ko use krenge layout mei
export default function AuthProvider({
  children,
}: {children: React.ReactNode}) {
  return (
    <SessionProvider>
      {children}
    </SessionProvider>
  )
}