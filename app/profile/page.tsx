"use client"
import { Copy, Users } from "lucide-react"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { useState } from "react"

interface Referral {
  id: number
  name: string
  joinedDate: string
  avatar: string
}

const referrals: Referral[] = [
  { id: 1, name: "Zain", joinedDate: "2024-01-15", avatar: "/placeholder.svg?height=40&width=40" },
  { id: 2, name: "Emerson", joinedDate: "2024-01-14", avatar: "/placeholder.svg?height=40&width=40" },
  { id: 3, name: "Emery", joinedDate: "2024-01-13", avatar: "/placeholder.svg?height=40&width=40" },
]

export default function Profile() {
  const [copied, setCopied] = useState(false)
  const referralUrl = "https://boardingclub.com/ref/mrtarahzad"

  const copyToClipboard = () => {
    navigator.clipboard.writeText(referralUrl)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  return (
    <div className="min-h-screen bg-black text-white p-4">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <button className="text-sm text-gray-400">Back</button>
        <div className="flex items-center gap-1">
          <button className="text-gray-400">•••</button>
        </div>
      </div>

      {/* Profile Card */}
      <Card className="bg-gray-900/50 border-0 p-4 mb-6">
        <div className="flex items-center gap-4">
          <Avatar className="h-16 w-16 border-2 border-purple-500">
            <AvatarImage src="/placeholder.svg?height=64&width=64" alt="MrTarahzad" />
            <AvatarFallback>MT</AvatarFallback>
          </Avatar>
          <div className="flex-1">
            <h1 className="text-xl font-bold">MrTarahzad</h1>
            <p className="text-sm text-gray-400">Joined December 2023</p>
          </div>
        </div>
      </Card>

      {/* Referral URL Card */}
      <Card className="bg-gray-900/50 border-0 p-4 mb-6">
        <div className="flex flex-col gap-3">
          <div className="flex items-center justify-between">
            <h2 className="text-sm font-semibold">Your Referral Link</h2>
            <Button 
              variant="ghost" 
              size="sm" 
              className="text-purple-400 hover:text-purple-300"
              onClick={copyToClipboard}
            >
              <Copy className="h-4 w-4 mr-2" />
              {copied ? "Copied!" : "Copy"}
            </Button>
          </div>
          <div className="text-sm text-gray-400 break-all">
            {referralUrl}
          </div>
        </div>
      </Card>

      {/* Referrals List */}
      <div>
        <div className="flex items-center gap-2 mb-4">
          <Users className="h-5 w-5 text-purple-500" />
          <h2 className="text-sm font-semibold">Your Referrals ({referrals.length})</h2>
        </div>
        <div className="space-y-3">
          {referrals.map((referral) => (
            <Card key={referral.id} className="bg-gray-900/50 border-0 p-3">
              <div className="flex items-center gap-3">
                <Avatar className="h-10 w-10">
                  <AvatarImage src={referral.avatar} alt={referral.name} />
                  <AvatarFallback>{referral.name[0]}</AvatarFallback>
                </Avatar>
                <div className="flex-1">
                  <div className="flex items-center justify-between">
                    <span className="font-medium">{referral.name}</span>
                    <span className="text-sm text-gray-400">
                      Joined {new Date(referral.joinedDate).toLocaleDateString()}
                    </span>
                  </div>
                </div>
              </div>
            </Card>
          ))}
        </div>
      </div>
    </div>
  )
}