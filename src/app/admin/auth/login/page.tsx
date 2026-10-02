"use client"

import React, { useState } from "react"
import { Button } from "@/components/ui/button"
import { Lock, ArrowRight } from "lucide-react"

export default function AdminLoginPage() {
    const [passcode, setPasscode] = useState("")
    const [error, setError] = useState(false)

    const handleLogin = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault()

        if (passcode === "1234" || passcode === "admin") {
            // Set cookie with Max-Age (e.g., 1 day) and SameSite policy
            document.cookie = "admin_authenticated=true; path=/; max-age=86400; SameSite=Lax"

            // Full navigation forces middleware to read the new cookie
            window.location.href = "/admin"
        } else {
            setError(true)
        }
    }

    return (
        <div className="min-h-[80vh] flex items-center justify-center px-4">
            <form onSubmit={handleLogin} className="border border-border p-8 bg-card w-full max-w-sm space-y-6">
                <div className="text-center space-y-2">
                    <div className="h-12 w-12 rounded-full bg-muted flex items-center justify-center mx-auto">
                        <Lock className="h-5 w-5 text-foreground" />
                    </div>
                    <h1 className="text-xl font-light uppercase tracking-wider">Admin Portal</h1>
                    <p className="text-xs text-muted-foreground">Enter admin passcode to manage orders</p>
                </div>

                <div className="space-y-2">
                    <input
                        type="password"
                        value={passcode}
                        onChange={(e) => {
                            setPasscode(e.target.value)
                            setError(false)
                        }}
                        placeholder="Enter passcode (Demo: 1234)"
                        className="w-full border border-border p-3 text-center font-mono text-sm bg-background focus:outline-none focus:border-foreground"
                        required
                    />
                    {error && <p className="text-[11px] text-destructive text-center">Invalid passcode. Use '1234'.</p>}
                </div>

                <Button type="submit" className="w-full rounded-none uppercase text-xs tracking-widest h-12">
                    Authenticate <ArrowRight className="h-4 w-4 ml-2" />
                </Button>
            </form>
        </div>
    )
}