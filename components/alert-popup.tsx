"use client"

import { X, AlertCircle, CheckCircle, Info } from "lucide-react"
import { useEffect } from "react"

interface AlertPopupProps {
  isOpen: boolean
  onClose: () => void
  title: string
  message: string
  type?: "error" | "success" | "info"
  autoClose?: boolean
  duration?: number
}

export function AlertPopup({ 
  isOpen, 
  onClose, 
  title, 
  message, 
  type = "info",
  autoClose = true,
  duration = 3000 
}: AlertPopupProps) {
  useEffect(() => {
    if (isOpen && autoClose) {
      const timer = setTimeout(() => {
        onClose()
      }, duration)
      
      return () => clearTimeout(timer)
    }
  }, [isOpen, autoClose, duration, onClose])

  if (!isOpen) return null

  const getIcon = () => {
    switch (type) {
      case "error":
        return <AlertCircle className="text-red-500" size={24} />
      case "success":
        return <CheckCircle className="text-green-500" size={24} />
      default:
        return <Info className="text-blue-500" size={24} />
    }
  }

  const getBorderColor = () => {
    switch (type) {
      case "error":
        return "border-red-200 bg-red-50"
      case "success":
        return "border-green-200 bg-green-50"
      default:
        return "border-blue-200 bg-blue-50"
    }
  }

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 px-4">
      <div className={`bg-white border-2 rounded-xl p-6 max-w-md w-full shadow-2xl transform transition-all ${getBorderColor()}`}>
        <div className="flex items-start gap-4">
          <div className="flex-shrink-0">
            {getIcon()}
          </div>
          
          <div className="flex-1">
            <h3 className="text-lg font-semibold text-gray-900 mb-2">
              {title}
            </h3>
            <p className="text-gray-600 text-sm leading-relaxed">
              {message}
            </p>
          </div>
          
          <button
            onClick={onClose}
            className="flex-shrink-0 text-gray-400 hover:text-gray-600 transition-colors"
          >
            <X size={20} />
          </button>
        </div>
        
        <div className="mt-4 flex justify-end">
          <button
            onClick={onClose}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
              type === "error" 
                ? "bg-red-100 text-red-700 hover:bg-red-200"
                : type === "success"
                ? "bg-green-100 text-green-700 hover:bg-green-200"
                : "bg-blue-100 text-blue-700 hover:bg-blue-200"
            }`}
          >
            OK
          </button>
        </div>
      </div>
    </div>
  )
}
