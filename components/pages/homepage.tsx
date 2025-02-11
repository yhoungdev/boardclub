"use client"
import { useEffect } from "react"
import { Wallet, Coins, ArrowRight } from "lucide-react"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { useState } from "react"
import { TonConnectButton, useTonConnectUI, useTonWallet } from "@tonconnect/ui-react"
import { Address, toNano } from 'ton-core'
import { usePrivy } from '@privy-io/react-auth'
import { FaTelegramPlane } from "react-icons/fa"
import { useRouter } from 'next/navigation'

export default function HomePage() {
  const router = useRouter()
  const [isConnected, setIsConnected] = useState(false)
  const [isDepositing, setIsDepositing] = useState(false)
  const [tonConnectUI] = useTonConnectUI()
  const wallet = useTonWallet()
  const { login, user, authenticated, ready } = usePrivy()

  const userWallet = wallet?.account?.address 
  const ownAddress = '0QBUagAZij47vy7i-p271eqVLaunwFpMn2tuGAU_XMoWMB-7'


  useEffect(() => {
    if (ready && authenticated) {
    
      console.log('User authenticated:', user)
    }
  }, [ready, authenticated, user])

  const handleLogin = async () => {
    try {
      await login()
    } catch (error) {
      console.error('❌ Login failed:', error)
    }
  }

  const handleDeposit = async () => {
    if (!authenticated) {
      console.error('❌ User not authenticated')
      return
    }

    if (!tonConnectUI || !wallet || !wallet.account) {
      console.error('❌ Wallet not connected or invalid')
      return
    }

    try {
      setIsDepositing(true)

      const receiverAddress = Address.parse(ownAddress)

      await tonConnectUI.sendTransaction({
        validUntil: Math.floor(Date.now() / 1000) + 300, 
        messages: [
          {
            address: receiverAddress.toString(),
            amount: toNano('1').toString(), 
            stateInit: null, 
            payload: '' 
          }
        ]
      })

      setIsConnected(true)
    } catch (error) {
      console.error('❌ Transaction failed:', error)
    } finally {
      setIsDepositing(false)
    }
  }


  if (!ready) {
    return (
      <div className="min-h-screen bg-black text-white flex items-center justify-center">
        <p>Loading...</p>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-black text-white">
      <div className="max-w-md mx-auto p-4 pt-20">
        <div className="text-center space-y-4 mb-12">
          <h1 className="text-4xl font-bold bg-gradient-to-r from-purple-400 to-pink-600 bg-clip-text text-transparent">
            Welcome to Boarding Club
          </h1>
          <p className="text-gray-400">
            Start your journey with just 1 TON
          </p>
        </div>
        <Card className="bg-gray-900/50 border-0 p-6">
          <div className="space-y-6">
            {!authenticated ? (
              <Button 
                className="w-full bg-blue-500 hover:bg-blue-600 text-white h-14"
                onClick={handleLogin}
              >
                <FaTelegramPlane className="mr-2" />
                Login with Telegram
              </Button>
            ) : !isConnected ? (
              <div className="space-y-4">
                <div className="text-center">
                  <span className="text-2xl font-bold">1 TON</span>
                  <p className="text-sm text-gray-400 mt-2">One-time entry fee</p>
                </div>
                <div>
                  <center>
                    <TonConnectButton/>
                  </center>
                </div>
                {wallet && (
                  <Button 
                    className="w-full bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white h-14"
                    onClick={handleDeposit}
                    disabled={isDepositing}
                  >
                    {isDepositing ? "Processing Payment..." : "Pay Entry Fee"}
                  </Button>
                )}
              </div>
            ) : (
              <div className="space-y-4">
                <div className="p-4 rounded-lg bg-gray-800/50 text-center">
                  <div className="text-sm text-gray-400 mb-1">Amount to deposit</div>
                  <span className="text-2xl font-bold">1 TON</span>
                </div>
                <Button 
                  className="w-full bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white h-14"
                  onClick={handleDeposit}
                  disabled={isDepositing}
                >
                  {isDepositing ? (
                    "Processing..."
                  ) : (
                    <>
                      Deposit Now
                      <ArrowRight className="ml-2 h-5 w-5" />
                    </>
                  )}
                </Button>
              </div>
            )}
          </div>
        </Card>

        <div className="mt-8 text-center">
          <div className="flex items-center justify-center gap-2 text-gray-400">
            <Coins className="h-4 w-4" />
            <span className="text-sm">Secure Payment Gateway</span>
          </div>
        </div>
      </div>
    </div>
  )
}
