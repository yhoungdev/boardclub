"use client"
import { Medal } from "lucide-react"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"

interface User {
  id: number
  name: string
  coins: number
  earnsPerSec: number
  avatar: string
}

const topUsers: User[] = [
  { id: 1, name: "Zain", coins: 153490751, earnsPerSec: 400, avatar: "/placeholder.svg?height=40&width=40" },
  { id: 2, name: "Emerson", coins: 153490751, earnsPerSec: 89.2, avatar: "/placeholder.svg?height=40&width=40" },
  { id: 3, name: "Emery", coins: 153490751, earnsPerSec: 75.6, avatar: "/placeholder.svg?height=40&width=40" },
  { id: 4, name: "Kierra", coins: 153490751, earnsPerSec: 54.3, avatar: "/placeholder.svg?height=40&width=40" },
  { id: 5, name: "Omar", coins: 153490751, earnsPerSec: 54.1, avatar: "/placeholder.svg?height=40&width=40" },
  { id: 6, name: "Maria", coins: 153490751, earnsPerSec: 48.9, avatar: "/placeholder.svg?height=40&width=40" },
  { id: 7, name: "Marcus", coins: 153490751, earnsPerSec: 400, avatar: "/placeholder.svg?height=40&width=40" },
]

export default function Leaderboard() {
  return (
    <div className="min-h-screen bg-black text-white p-4">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <button className="text-sm text-gray-400">Back</button>
        <div className="flex items-center gap-1">
          <span className="text-sm text-gray-400">bot</span>
          <button className="text-gray-400">•••</button>
        </div>
      </div>

      {/* Title Section */}
      <div className="mb-6 flex justify-between items-start">
        <div>
          <h1 className="text-2xl font-bold mb-1">LeaderBoard</h1>
          <p className="text-sm text-gray-400">Earn Coins Daily For Log In. Keep Your Streak To Earn More!</p>
        </div>
        <Medal className="h-12 w-12 text-purple-500" />
      </div>


      <Card className="bg-gray-900/50 border-0 p-4 mb-6">
        <div className="flex items-center gap-4">
          <Avatar className="h-12 w-12 border-2 border-purple-500">
            <AvatarImage src="/placeholder.svg?height=48&width=48" alt="MrTarahzad" />
            <AvatarFallback>MT</AvatarFallback>
          </Avatar>
          <div className="flex-1">
            <div className="flex items-center gap-2">
              <span className="font-semibold">MrTarahzad</span>
              <span className="text-yellow-500">🪙</span>
              <span>{topUsers[0].coins.toLocaleString()}</span>
            </div>
            <div className="flex items-center gap-1 text-sm text-purple-400">
              <span className="font-semibold">12.3k</span>
              <span className="text-gray-400">/ Your Rank</span>
            </div>
          </div>
        </div>
      </Card>

      <div className="grid grid-cols-2 gap-4 mb-6">
        <Button
          variant="outline"
          className="bg-green-900/20 border-green-800 text-green-500 hover:bg-green-900/30 hover:text-green-400"
        >
          By Coin
        </Button>
        <Button
          variant="outline"
          className="bg-gray-900/20 border-gray-800 text-gray-400 hover:bg-gray-900/30 hover:text-gray-300"
        >
          By Referrals
        </Button>
      </div>

     
      <div>
        <h2 className="text-sm font-semibold mb-4">TOP USER</h2>
        <div className="space-y-3">
          {topUsers.map((user, index) => (
            <Card key={user.id} className="bg-gray-900/50 border-0 p-3">
              <div className="flex items-center gap-3">
                <Avatar className="h-10 w-10">
                  <AvatarImage src={user.avatar} alt={user.name} />
                  <AvatarFallback>{user.name[0]}</AvatarFallback>
                </Avatar>
                <div className="flex-1">
                  <div className="flex items-center justify-between">
                    <span className="font-medium">{user.name}</span>
                    <span className="text-yellow-500">🪙 {user.coins.toLocaleString()}</span>
                  </div>
                  <div className="flex items-center justify-between text-sm text-gray-400">
                    <span>{user.earnsPerSec} Earns Per Sec</span>
                    <div className="flex items-center gap-2">
                      {index === 0 && <span className="text-yellow-500">🥇</span>}
                      {index === 1 && <span className="text-gray-400">🥈</span>}
                      {index === 2 && <span className="text-orange-400">🥉</span>}
                      <span>{index + 1}</span>
                    </div>
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

