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
  duration = 5000 
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

  const getActionButtonColor = () => {
    switch (type) {
      case "error": 
        return "bg-red-100 text-red-700 hover:bg-red-200"
      case "success":
        return "bg-green-100 text-green-700 hover:bg-green-200"
      default:
        return "bg-blue-100 text-blue-700 hover:bg-blue-200"
    }
  }

  const getHelpfulMessage = () => {
    switch (title) {
      case "Validation Error":
        return "Please check the form fields and correct any errors before submitting."
      case "User Not Found":
        return "Double-check your username or consider creating a new account."
      case "Incorrect Password":
        return "Try again or use the 'Forgot password' option to reset it."
      case "Username Unavailable":
        return "Try using a different username with numbers or underscores."
      case "Email Already Registered":
        return "Use a different email address or try logging in with this email."
      case "Phone Already Registered":
        return "Use a different phone number or contact support if this is an error."
      case "Account Pending Approval":
        return "You'll receive an email once your account is approved by our team."
      case "Account Suspended":
        return "Please contact our support team for assistance with your account."
      case "Weak Password":
        return "Include uppercase, lowercase, numbers, and special characters for better security."
      case "Network Error":
        return "Check your internet connection and try again. If the problem persists, contact support."
      default:
        return ""
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
            <p className="text-gray-600 text-sm leading-relaxed mb-3">
              {message}
            </p>
            {getHelpfulMessage() && (
              <div className="bg-gray-50 border border-gray-200 rounded-lg p-3">
                <p className="text-xs text-gray-500 font-medium mb-1">💡 Helpful Tip:</p>
                <p className="text-xs text-gray-600">{getHelpfulMessage()}</p>
              </div>
            )}
          </div>
          
          <button
            onClick={onClose}
            className="flex-shrink-0 text-gray-400 hover:text-gray-600 transition-colors"
          >
            <X size={20} />
          </button>
        </div>
        
        <div className="mt-4 flex justify-between items-center">
          <div className="text-xs text-gray-400">
            {type === "error" && "⚠️ Error"}
            {type === "success" && "✅ Success"}
            {type === "info" && "ℹ️ Information"}
          </div>
          <button
            onClick={onClose}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${getActionButtonColor()}`}
          >
            {type === "error" ? "Try Again" : type === "success" ? "Got it" : "OK"}
          </button>
        </div>
      </div>
    </div>
  )
}
