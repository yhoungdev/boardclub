"use client"
import { Wallet, Coins, ArrowRight } from "lucide-react"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { useState } from "react"
import { TonConnectButton, useTonConnect, useTonWallet } from "@tonconnect/ui-react"
import { Address, toNano } from 'ton-core'

export default function HomePage() {
  const [isConnected, setIsConnected] = useState(false)
  const [isDepositing, setIsDepositing] = useState(false)
  const { sender } = useTonConnect()
  const wallet = useTonWallet()

  const handleDeposit = async () => {
    try {
      setIsDepositing(true)
      
      const receiverAddress = Address.parse('YOUR_WALLET_ADDRESS_HERE')
      
      await sender.send({
        to: receiverAddress,
        value: toNano('1'), 
        message: 'Boarding Club Entry Fee'
      })
      
      setIsConnected(true)
    } catch (error) {
      console.error('Transaction failed:', error)
    } finally {
      setIsDepositing(false)
    }
  }

  return (
    <div className="min-h-screen bg-black text-white">
      <div className="max-w-md mx-auto p-4 pt-20">
        <div className="text-center space-y-4 mb-12">
          <h1 className="text-4xl font-bold bg-gradient-to-r from-purple-400 to-pink-600 bg-clip-text text-transparent">
            Welcome to Boarding Club
          </h1>
          <p className="text-gray-400">
            Start your journey with just $1 USDT
          </p>
        </div>
        <Card className="bg-gray-900/50 border-0 p-6">
          <div className="space-y-6">
            {!isConnected ? (
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
                  <span className="text-2xl font-bold">1 USDT</span>
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