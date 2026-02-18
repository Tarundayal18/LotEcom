"use client"

import type React from "react"
import { useState } from "react"
import { Mail, Lock, User, Building2, Phone, Tag, ArrowRight, ChevronDown } from "lucide-react"
import { AlertPopup } from "./alert-popup"

interface LoginFormProps {
  onLogin: (userData: any) => void
}

export function LoginForm({ onLogin }: LoginFormProps) {
  const [isSignUp, setIsSignUp] = useState(false)
  const [isForgotPassword, setIsForgotPassword] = useState(false)
  const [username, setUsername] = useState("")
  const [password, setPassword] = useState("")
  const [email, setEmail] = useState("")
  const [companyName, setCompanyName] = useState("")
  const [contactPerson, setContactPerson] = useState("")
  const [phone, setPhone] = useState("")
  const [category, setCategory] = useState("")
  const [currentPassword, setCurrentPassword] = useState("")
  const [newPassword, setNewPassword] = useState("")
  const [error, setError] = useState("")
  const [alertPopup, setAlertPopup] = useState({
    isOpen: false,
    title: "",
    message: "",
    type: "info" as "error" | "success" | "info"
  })

  const categories = [
    "Manufacturing",
    "Retail",
    "Wholesale",
    "Distribution",
    "Technology Services",
    "System Integration",
    "Reseller",
    "Other",
  ]

  const showAlert = (title: string, message: string, type: "error" | "success" | "info" = "info") => {
    setAlertPopup({ isOpen: true, title, message, type })
  }

  const closeAlert = () => {
    setAlertPopup(prev => ({ ...prev, isOpen: false }))
  }

  const clearAllFields = () => {
    setUsername("")
    setPassword("")
    setEmail("")
    setCompanyName("")
    setContactPerson("")
    setPhone("")
    setCategory("")
    setCurrentPassword("")
    setNewPassword("")
    setError("")
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError("")

    if (isForgotPassword) {
      if (!username || !currentPassword || !newPassword) {
        showAlert("Validation Error", "Please fill in all fields", "error")
        return
      }
      if (newPassword.length < 6) {
        showAlert("Validation Error", "New password must be at least 6 characters", "error")
        return
      }
      
      try {
        const response = await fetch('https://lot-ecom-backend.onrender.com/api/v1/auth/forgot-password', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            username,
            currentPassword,
            newPassword
          })
        })
        
        const data = await response.json()
        
        if (response.ok) {
          showAlert("Success", "Password updated successfully!", "success")
          setIsForgotPassword(false)
          clearAllFields()
        } else {
          showAlert("Error", data.message || "Failed to update password", "error")
        }
      } catch (error) {
        showAlert("Network Error", "Unable to connect to server. Please check your internet connection.", "error")
      }
      return
    }

    if (isSignUp) {
      const emptyFields = []
      if (!email) emptyFields.push("Email")
      if (!password) emptyFields.push("Password")
      if (!username) emptyFields.push("Username")
      if (!companyName) emptyFields.push("Company Name")
      if (!contactPerson) emptyFields.push("Contact Person")
      if (!phone) emptyFields.push("Phone Number")
      
      if (emptyFields.length > 0) {
        showAlert("Validation Error", `Please fill in the following fields: ${emptyFields.join(", ")}`, "error")
        return
      }
      if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
        showAlert("Validation Error", "Please enter a valid email address", "error")
        return
      }
      if (password.length < 6) {
        showAlert("Validation Error", "Password must be at least 6 characters long", "error")
        return
      }
      if (!/^\d{10}$/.test(phone.replace(/\D/g, ""))) {
        showAlert("Validation Error", "Please enter a valid 10-digit phone number", "error")
        return
      }

      try {
        const response = await fetch('https://lot-ecom-backend.onrender.com/api/v1/auth/register', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            email,
            password,
            username,
            companyName,
            contactPerson,
            phone
          })
        })
        
        const data = await response.json()
        
        if (response.ok) {
          showAlert("Registration Successful", "Your account has been created! Please wait for admin approval before logging in.", "success")
          setIsSignUp(false)
          clearAllFields()
        } else {
          showAlert("Registration Failed", data.message || "Unable to create account. Please try again.", "error")
        }
      } catch (error) {
        showAlert("Network Error", "Unable to connect to server. Please check your internet connection.", "error")
      }
      return
    }

    // Login
    if (!username || !password) {
      showAlert("Validation Error", "Please enter both username and password", "error")
      return
    }
    
    const requestData = {
      username,
      password
    }
    
    console.log("Login Request Data:", requestData)
    
    try {
      const response = await fetch('https://lot-ecom-backend.onrender.com/api/v1/auth/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(requestData)
      })
      
      const data = await response.json()
      console.log("Login Response Data:", data)
      console.log("Response Status:", response.status)
      
      if (response.ok) {
        // Store token in localStorage
        if (data.token) {
          localStorage.setItem('authToken', data.token)
          console.log("Token stored in localStorage:", data.token)
        }
        
        // If token exists, login regardless of approval status
        if (data.token) {
          onLogin(data)
          clearAllFields()
        } else {
          showAlert("Account Pending", "Your account is pending admin approval. Please wait for approval before logging in.", "info")
        }
      } else {
        showAlert("Login Failed", data.message || "Invalid username or password", "error")
      }
    } catch (error) {
      console.error("Login Error:", error)
      showAlert("Network Error", "Unable to connect to server. Please check your internet connection.", "error")
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary/10 via-background to-secondary/5 flex items-center justify-center px-4 py-12 animate-gradient">
      <div className="w-full max-w-md">
        {/* Hero Section */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-r from-primary to-secondary rounded-2xl mb-6 mx-auto animate-float glow-primary">
            <span className="text-3xl">⚡</span>
          </div>
          <h1 className="text-4xl font-bold text-foreground mb-3 text-balance animate-bounce-subtle">Welcome to TechHub</h1>
          <p className="text-lg text-muted-foreground text-balance">
            Your B2B electronics partner for premium tech solutions
          </p>
        </div>

        {/* Login Card */}
        <div className="bg-card border border-border rounded-2xl shadow-2xl p-8 mb-6 glow-primary-hover transition-all duration-500 hover:scale-[1.02]">
          {/* Tabs */}
          {!isForgotPassword && (
            <div className="flex gap-2 mb-8 bg-muted rounded-lg p-1">
              <button
                onClick={() => {
                  setIsSignUp(false)
                  clearAllFields()
                }}
                className={`flex-1 py-2 rounded-md font-medium transition-all duration-300 ${
                  !isSignUp ? "bg-gradient-to-r from-primary to-secondary text-primary-foreground shine-effect" : "text-muted-foreground hover:text-foreground hover:bg-muted/80"
                }`}
              >
                Login
              </button>
              <button
                onClick={() => {
                  setIsSignUp(true)
                  clearAllFields()
                }}
                className={`flex-1 py-2 rounded-md font-medium transition-all duration-300 ${
                  isSignUp ? "bg-gradient-to-r from-primary to-secondary text-primary-foreground shine-effect" : "text-muted-foreground hover:text-foreground hover:bg-muted/80"
                }`}
              >
                Sign Up
              </button>
            </div>
          )}

          {isForgotPassword && (
            <div className="mb-8">
              <button
                onClick={() => {
                  setIsForgotPassword(false)
                  clearAllFields()
                }}
                className="text-sm text-primary hover:underline font-medium"
              >
                ← Back to Login
              </button>
              <h2 className="text-xl font-bold text-foreground mt-4">Reset Password</h2>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Sign Up Fields */}
            {isSignUp && (
              <>
                {/* Username */}
                <div>
                  <label htmlFor="username" className="block text-sm font-medium text-foreground mb-2">
                    Username
                  </label>
                  <div className="relative">
                    <User className="absolute left-3 top-3 text-muted-foreground" size={20} />
                    <input
                      id="username"
                      type="text"
                      value={username}
                      onChange={(e) => setUsername(e.target.value)}
                      placeholder="Username"
                      className="w-full pl-10 pr-4 py-3 bg-background border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary transition-all duration-300 text-foreground placeholder:text-muted-foreground hover:border-primary/50"
                    />
                  </div>
                </div>

                {/* Email */}
                <div>
                  <label htmlFor="email-signup" className="block text-sm font-medium text-foreground mb-2">
                    Email Address
                  </label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-3 text-muted-foreground" size={20} />
                    <input
                      id="email-signup"
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="Email Address"
                      className="w-full pl-10 pr-4 py-3 bg-background border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary transition-all duration-300 text-foreground placeholder:text-muted-foreground hover:border-primary/50"
                    />
                  </div>
                </div>

                {/* Password */}
                <div>
                  <label htmlFor="password-signup" className="block text-sm font-medium text-foreground mb-2">
                    Password
                  </label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-3 text-muted-foreground" size={20} />
                    <input
                      id="password-signup"
                      type="password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      placeholder="Password"
                      className="w-full pl-10 pr-4 py-3 bg-background border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary transition-all duration-300 text-foreground placeholder:text-muted-foreground hover:border-primary/50"
                    />
                  </div>
                </div>

                {/* Company Name */}
                <div>
                  <label htmlFor="company" className="block text-sm font-medium text-foreground mb-2">
                    Company Name
                  </label>
                  <div className="relative">
                    <Building2 className="absolute left-3 top-3 text-muted-foreground" size={20} />
                    <input
                      id="company"
                      type="text"
                      value={companyName}
                      onChange={(e) => setCompanyName(e.target.value)}
                      placeholder="Company Name"
                      className="w-full pl-10 pr-4 py-3 bg-background border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary transition-all duration-300 text-foreground placeholder:text-muted-foreground hover:border-primary/50"
                    />
                  </div>
                </div>

                {/* Contact Person */}
                <div>
                  <label htmlFor="contact" className="block text-sm font-medium text-foreground mb-2">
                    Contact Person Name
                  </label>
                  <div className="relative">
                    <User className="absolute left-3 top-3 text-muted-foreground" size={20} />
                    <input
                      id="contact"
                      type="text"
                      value={contactPerson}
                      onChange={(e) => setContactPerson(e.target.value)}
                      placeholder="Contact Person Name"
                      className="w-full pl-10 pr-4 py-3 bg-background border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary transition-all duration-300 text-foreground placeholder:text-muted-foreground hover:border-primary/50"
                    />
                  </div>
                </div>

                {/* Phone */}
                <div>
                  <label htmlFor="phone" className="block text-sm font-medium text-foreground mb-2">
                    Phone Number
                  </label>
                  <div className="relative">
                    <Phone className="absolute left-3 top-3 text-muted-foreground" size={20} />
                    <input
                      id="phone"
                      type="tel"
                      value={phone}
                      maxLength={10}
                      onChange={(e) => setPhone(e.target.value)}
                      placeholder="Phone Number"
                      className="w-full pl-10 pr-4 py-3 bg-background border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary transition-all duration-300 text-foreground placeholder:text-muted-foreground hover:border-primary/50"
                    />
                  </div>
                </div>

                {/* Category Dropdown */}
                {/* <div>
                  <label htmlFor="category" className="block text-sm font-medium text-foreground mb-2">
                    Business Category
                  </label>
                  <div className="relative">
                    <Tag className="absolute left-3 top-3 text-muted-foreground pointer-events-none" size={20} />
                    <select
                      id="category"
                      value={category}
                      onChange={(e) => setCategory(e.target.value)}
                      className="w-full pl-10 pr-10 py-3 bg-background border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/50 transition-colors text-foreground appearance-none cursor-pointer"
                    >
                      <option value="">Select a category...</option>
                      {categories.map((cat) => (
                        <option key={cat} value={cat}>
                          {cat}
                        </option>
                      ))}
                    </select>
                    <ChevronDown
                      className="absolute right-3 top-3 text-muted-foreground pointer-events-none"
                      size={20}
                    />
                  </div>
                </div> */}
              </>
            )}

            {/* Forgot Password Fields */}
            {isForgotPassword && (
              <>
                <div>
                  <label htmlFor="username-forgot" className="block text-sm font-medium text-foreground mb-2">
                    Username
                  </label>
                  <div className="relative">
                    <User className="absolute left-3 top-3 text-muted-foreground" size={20} />
                    <input
                      id="username-forgot"
                      type="text"
                      value={username}
                      onChange={(e) => setUsername(e.target.value)}
                      placeholder="Username"
                      className="w-full pl-10 pr-4 py-3 bg-background border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary transition-all duration-300 text-foreground placeholder:text-muted-foreground hover:border-primary/50"
                    />
                  </div>
                </div>

                <div>
                  <label htmlFor="current-pass" className="block text-sm font-medium text-foreground mb-2">
                    Current Password
                  </label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-3 text-muted-foreground" size={20} />
                    <input
                      id="current-pass"
                      type="password"
                      value={currentPassword}
                      onChange={(e) => setCurrentPassword(e.target.value)}
                      placeholder="Current Password"
                      className="w-full pl-10 pr-4 py-3 bg-background border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary transition-all duration-300 text-foreground placeholder:text-muted-foreground hover:border-primary/50"
                    />
                  </div>
                </div>

                <div>
                  <label htmlFor="new-pass" className="block text-sm font-medium text-foreground mb-2">
                    New Password
                  </label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-3 text-muted-foreground" size={20} />
                    <input
                      id="new-pass"
                      type="password"
                      value={newPassword}
                      onChange={(e) => setNewPassword(e.target.value)}
                      placeholder="New Password"
                      className="w-full pl-10 pr-4 py-3 bg-background border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary transition-all duration-300 text-foreground placeholder:text-muted-foreground hover:border-primary/50"
                    />
                  </div>
                </div>
              </>
            )}

            {/* Login Fields */}
            {!isSignUp && !isForgotPassword && (
              <>
                <div>
                  <label htmlFor="username-login" className="block text-sm font-medium text-foreground mb-2">
                    Username
                  </label>
                  <div className="relative">
                    <User className="absolute left-3 top-3 text-muted-foreground" size={20} />
                    <input
                      id="username-login"
                      type="text"
                      value={username}
                      onChange={(e) => setUsername(e.target.value)}
                      placeholder="Username"
                      className="w-full pl-10 pr-4 py-3 bg-background border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary transition-all duration-300 text-foreground placeholder:text-muted-foreground hover:border-primary/50"
                    />
                  </div>
                </div>

                <div>
                  <label htmlFor="password-login" className="block text-sm font-medium text-foreground mb-2">
                    Password
                  </label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-3 text-muted-foreground" size={20} />
                    <input
                      id="password-login"
                      type="password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      placeholder="Password"
                      className="w-full pl-10 pr-4 py-3 bg-background border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary transition-all duration-300 text-foreground placeholder:text-muted-foreground hover:border-primary/50"
                    />
                  </div>
                </div>

                <button
                  type="button"
                  onClick={() => {
                    setIsForgotPassword(true)
                    clearAllFields()
                  }}
                  className="text-sm text-primary hover:underline font-medium"
                >
                  Forgot password?
                </button>
              </>
            )}

            {/* Error Message */}
            {error && (
              <div className="p-3 bg-destructive/10 border border-destructive/20 rounded-lg">
                <p className="text-sm text-destructive">{error}</p>
              </div>
            )}

            {/* Submit Button */}
            <button
              type="submit"
              className="w-full bg-gradient-to-r from-primary to-secondary text-primary-foreground py-3 rounded-xl font-semibold hover:from-primary/90 hover:to-secondary/90 transition-all duration-300 flex items-center justify-center gap-2 mt-6 shine-effect glow-primary-hover transform hover:scale-[1.02] hover:-translate-y-0.5"
            >
              {isForgotPassword ? "Update Password" : isSignUp ? "Create Account" : "Login"}
              <ArrowRight size={20} className="animate-bounce-subtle" />
            </button>
          </form>

          {!isForgotPassword && !isSignUp && (
            <div className="mt-6 pt-6 border-t border-border">
              <p className="text-xs text-muted-foreground text-center mb-3">Demo credentials:</p>
              <div className="space-y-1 text-xs text-muted-foreground">
                <p>
                  Username: <span className="text-foreground font-mono">demo_user</span>
                </p>
                <p>
                  Password: <span className="text-foreground font-mono">demo123456</span>
                </p>
              </div>
            </div>
          )}
        </div>
      </div>
      
      {/* Alert Popup */}
      <AlertPopup
        isOpen={alertPopup.isOpen}
        onClose={closeAlert}
        title={alertPopup.title}
        message={alertPopup.message}
        type={alertPopup.type}
      />
    </div>
  )
}
