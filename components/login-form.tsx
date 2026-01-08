"use client"

import type React from "react"
import { useState } from "react"
import { Mail, Lock, User, Building2, Phone, Tag, ArrowRight, ChevronDown } from "lucide-react"

interface LoginFormProps {
  onLogin: (userData: any) => void
}

export function LoginForm({ onLogin }: LoginFormProps) {
  const [isSignUp, setIsSignUp] = useState(false)
  const [isForgotPassword, setIsForgotPassword] = useState(false)
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [username, setUsername] = useState("")
  const [companyName, setCompanyName] = useState("")
  const [contactPerson, setContactPerson] = useState("")
  const [phone, setPhone] = useState("")
  const [category, setCategory] = useState("")
  const [currentPassword, setCurrentPassword] = useState("")
  const [newPassword, setNewPassword] = useState("")
  const [error, setError] = useState("")

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

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    setError("")

    if (isForgotPassword) {
      if (!email || !currentPassword || !newPassword) {
        setError("Please fill in all fields")
        return
      }
      if (newPassword.length < 6) {
        setError("New password must be at least 6 characters")
        return
      }
      setError("")
      alert("Password updated successfully!")
      setIsForgotPassword(false)
      setEmail("")
      setCurrentPassword("")
      setNewPassword("")
      return
    }

    if (isSignUp) {
      if (!email || !password || !username || !companyName || !contactPerson || !phone || !category) {
        setError("Please fill in all fields")
        return
      }
      if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
        setError("Please enter a valid email")
        return
      }
      if (password.length < 6) {
        setError("Password must be at least 6 characters")
        return
      }
      if (!/^\d{10}$/.test(phone.replace(/\D/g, ""))) {
        setError("Please enter a valid phone number")
        return
      }

      onLogin({
        email,
        username,
        companyName,
        contactPerson,
        phone,
        category,
      })
      setEmail("")
      setPassword("")
      setUsername("")
      setCompanyName("")
      setContactPerson("")
      setPhone("")
      setCategory("")
      return
    }

    // Login
    if (!email || !password) {
      setError("Please fill in all fields")
      return
    }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      setError("Please enter a valid email")
      return
    }
    if (password.length < 6) {
      setError("Password must be at least 6 characters")
      return
    }

    onLogin({ email })
    setEmail("")
    setPassword("")
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary/5 via-background to-background flex items-center justify-center px-4 py-12">
      <div className="w-full max-w-md">
        {/* Hero Section */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-primary rounded-2xl mb-6 mx-auto">
            <span className="text-3xl">⚡</span>
          </div>
          <h1 className="text-4xl font-bold text-foreground mb-3 text-balance">Welcome to TechHub</h1>
          <p className="text-lg text-muted-foreground text-balance">
            Your B2B electronics partner for premium tech solutions
          </p>
        </div>

        {/* Login Card */}
        <div className="bg-card border border-border rounded-2xl shadow-lg p-8 mb-6">
          {/* Tabs */}
          {!isForgotPassword && (
            <div className="flex gap-2 mb-8 bg-muted rounded-lg p-1">
              <button
                onClick={() => setIsSignUp(false)}
                className={`flex-1 py-2 rounded-md font-medium transition-colors ${
                  !isSignUp ? "bg-primary text-primary-foreground" : "text-muted-foreground hover:text-foreground"
                }`}
              >
                Login
              </button>
              <button
                onClick={() => setIsSignUp(true)}
                className={`flex-1 py-2 rounded-md font-medium transition-colors ${
                  isSignUp ? "bg-primary text-primary-foreground" : "text-muted-foreground hover:text-foreground"
                }`}
              >
                Sign Up
              </button>
            </div>
          )}

          {isForgotPassword && (
            <div className="mb-8">
              <button
                onClick={() => setIsForgotPassword(false)}
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
                      placeholder="john_doe"
                      className="w-full pl-10 pr-4 py-3 bg-background border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/50 transition-colors text-foreground placeholder:text-muted-foreground"
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
                      placeholder="company@email.com"
                      className="w-full pl-10 pr-4 py-3 bg-background border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/50 transition-colors text-foreground placeholder:text-muted-foreground"
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
                      placeholder="••••••••"
                      className="w-full pl-10 pr-4 py-3 bg-background border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/50 transition-colors text-foreground placeholder:text-muted-foreground"
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
                      placeholder="Tech Solutions Inc"
                      className="w-full pl-10 pr-4 py-3 bg-background border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/50 transition-colors text-foreground placeholder:text-muted-foreground"
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
                      placeholder="John Smith"
                      className="w-full pl-10 pr-4 py-3 bg-background border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/50 transition-colors text-foreground placeholder:text-muted-foreground"
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
                      onChange={(e) => setPhone(e.target.value)}
                      placeholder="+1 (555) 123-4567"
                      className="w-full pl-10 pr-4 py-3 bg-background border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/50 transition-colors text-foreground placeholder:text-muted-foreground"
                    />
                  </div>
                </div>

                {/* Category Dropdown */}
                <div>
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
                </div>
              </>
            )}

            {/* Forgot Password Fields */}
            {isForgotPassword && (
              <>
                <div>
                  <label htmlFor="email-forgot" className="block text-sm font-medium text-foreground mb-2">
                    Email Address
                  </label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-3 text-muted-foreground" size={20} />
                    <input
                      id="email-forgot"
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="your@email.com"
                      className="w-full pl-10 pr-4 py-3 bg-background border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/50 transition-colors text-foreground placeholder:text-muted-foreground"
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
                      placeholder="••••••••"
                      className="w-full pl-10 pr-4 py-3 bg-background border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/50 transition-colors text-foreground placeholder:text-muted-foreground"
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
                      placeholder="••••••••"
                      className="w-full pl-10 pr-4 py-3 bg-background border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/50 transition-colors text-foreground placeholder:text-muted-foreground"
                    />
                  </div>
                </div>
              </>
            )}

            {/* Login Fields */}
            {!isSignUp && !isForgotPassword && (
              <>
                <div>
                  <label htmlFor="email-login" className="block text-sm font-medium text-foreground mb-2">
                    Email Address
                  </label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-3 text-muted-foreground" size={20} />
                    <input
                      id="email-login"
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="you@company.com"
                      className="w-full pl-10 pr-4 py-3 bg-background border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/50 transition-colors text-foreground placeholder:text-muted-foreground"
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
                      placeholder="••••••••"
                      className="w-full pl-10 pr-4 py-3 bg-background border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/50 transition-colors text-foreground placeholder:text-muted-foreground"
                    />
                  </div>
                </div>

                <button
                  type="button"
                  onClick={() => setIsForgotPassword(true)}
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
              className="w-full bg-primary text-primary-foreground py-3 rounded-lg font-semibold hover:opacity-90 transition-opacity flex items-center justify-center gap-2 mt-6"
            >
              {isForgotPassword ? "Update Password" : isSignUp ? "Create Account" : "Login"}
              <ArrowRight size={20} />
            </button>
          </form>

          {!isForgotPassword && !isSignUp && (
            <div className="mt-6 pt-6 border-t border-border">
              <p className="text-xs text-muted-foreground text-center mb-3">Demo credentials:</p>
              <div className="space-y-1 text-xs text-muted-foreground">
                <p>
                  Email: <span className="text-foreground font-mono">demo@example.com</span>
                </p>
                <p>
                  Password: <span className="text-foreground font-mono">demo123456</span>
                </p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
