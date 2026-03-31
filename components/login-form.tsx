"use client"

import type React from "react"
import { useState, useEffect } from "react"
import { Mail, Lock, User, Building2, Phone, Tag, ArrowRight, ChevronDown, Loader2, Eye, EyeOff } from "lucide-react"
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

  // Field validation states
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({})
  const [touchedFields, setTouchedFields] = useState<Record<string, boolean>>({})
  const [isLoading, setIsLoading] = useState(false)
  const [showPassword, setShowPassword] = useState(false)
  const [showSignupPassword, setShowSignupPassword] = useState(false)
  const [showCurrentPassword, setShowCurrentPassword] = useState(false)
  const [showNewPassword, setShowNewPassword] = useState(false)

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

  // Validation functions
  const validateField = (fieldName: string, value: string): string => {
    switch (fieldName) {
      case 'username':
        if (!value.trim()) return 'Username is required'
        return ''
      
      case 'email':
        if (!value.trim()) return 'Email is required'
        if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)) return 'Please enter a valid email address'
        return ''
      
      case 'password':
        if (!value) return 'Password is required'
        return ''
      
      case 'confirmPassword':
        if (!value) return 'Please confirm your password'
        if (value !== password) return 'Passwords do not match'
        return ''
      
      case 'companyName':
        if (!value.trim()) return 'Company name is required'
        return ''
      
      case 'contactPerson':
        if (!value.trim()) return 'Contact person name is required'
        return ''
      
      case 'phone':
        if (!value.trim()) return 'Phone number is required'
        const cleanPhone = value.replace(/\D/g, '')
        if (cleanPhone.length < 10) return 'Phone number must be at least 10 digits'
        if (cleanPhone.length > 10) return 'Phone number must be exactly 10 digits'
        if (!/^[6-9]/.test(cleanPhone)) return 'Phone number must start with 6, 7, 8, or 9'
        return ''
      
      case 'currentPassword':
        if (!value) return 'Current password is required'
        return ''
      
      case 'newPassword':
        if (!value) return 'New password is required'
        return ''
      
      default:
        return ''
    }
  }

  // Real-time validation
  const handleFieldChange = (fieldName: string, value: string) => {
    // Update field value
    switch (fieldName) {
      case 'username': setUsername(value); break
      case 'email': setEmail(value); break
      case 'password': setPassword(value); break
      case 'companyName': setCompanyName(value); break
      case 'contactPerson': setContactPerson(value); break
      case 'phone': setPhone(value); break
      case 'currentPassword': setCurrentPassword(value); break
      case 'newPassword': setNewPassword(value); break
    }

    // Validate if field has been touched
    if (touchedFields[fieldName]) {
      const error = validateField(fieldName, value)
      setFieldErrors(prev => ({ ...prev, [fieldName]: error }))
    }
  }

  const handleFieldBlur = (fieldName: string, value: string) => {
    setTouchedFields(prev => ({ ...prev, [fieldName]: true }))
    const error = validateField(fieldName, value)
    setFieldErrors(prev => ({ ...prev, [fieldName]: error }))
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
    setFieldErrors({})
    setTouchedFields({})
    setIsLoading(false)
    setShowPassword(false)
    setShowSignupPassword(false)
    setShowCurrentPassword(false)
    setShowNewPassword(false)
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError("")

    if (isForgotPassword) {
      // Validate all forgot password fields
      const forgotPasswordErrors: Record<string, string> = {}
      forgotPasswordErrors.username = validateField('username', username)
      forgotPasswordErrors.currentPassword = validateField('currentPassword', currentPassword)
      forgotPasswordErrors.newPassword = validateField('newPassword', newPassword)
      
      const hasErrors = Object.values(forgotPasswordErrors).some(error => error)
      if (hasErrors) {
        setFieldErrors(forgotPasswordErrors)
        setTouchedFields({ username: true, currentPassword: true, newPassword: true })
        showAlert("Validation Error", "Please fix the errors in the form", "error")
        return
      }

      setIsLoading(true)
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
          // Handle specific backend errors
          const errorMessage = data.message || data.error || "Failed to update password"
          if (errorMessage.toLowerCase().includes('user not found') || errorMessage.toLowerCase().includes('invalid username')) {
            showAlert("User Not Found", "The username you entered does not exist in our system.", "error")
          } else if (errorMessage.toLowerCase().includes('incorrect password') || errorMessage.toLowerCase().includes('invalid password')) {
            showAlert("Incorrect Password", "The current password you entered is incorrect.", "error")
          } else if (errorMessage.toLowerCase().includes('weak password') || errorMessage.toLowerCase().includes('password strength')) {
            showAlert("Weak Password", "Please choose a stronger password with at least 6 characters, including uppercase, lowercase, and numbers.", "error")
          } else {
            showAlert("Update Failed", errorMessage, "error")
          }
        }
      } catch (error) {
        showAlert("Network Error", "Unable to connect to server. Please check your internet connection.", "error")
      } finally {
        setIsLoading(false)
      }
      return
    }

    if (isSignUp) {
      // Validate all signup fields
      const signupErrors: Record<string, string> = {}
      signupErrors.username = validateField('username', username)
      signupErrors.email = validateField('email', email)
      signupErrors.password = validateField('password', password)
      signupErrors.companyName = validateField('companyName', companyName)
      signupErrors.contactPerson = validateField('contactPerson', contactPerson)
      signupErrors.phone = validateField('phone', phone)
      
      const hasErrors = Object.values(signupErrors).some(error => error)
      if (hasErrors) {
        setFieldErrors(signupErrors)
        setTouchedFields({ username: true, email: true, password: true, companyName: true, contactPerson: true, phone: true })
        showAlert("Validation Error", "Please fix the errors in the form", "error")
        return
      }

      setIsLoading(true)
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
          // Handle specific backend errors
          const errorMessage = data.message || data.error || "Unable to create account. Please try again."
          if (errorMessage.toLowerCase().includes('user already exists') || errorMessage.toLowerCase().includes('username taken')) {
            showAlert("Username Unavailable", "This username is already taken. Please choose a different one.", "error")
          } else if (errorMessage.toLowerCase().includes('email already exists') || errorMessage.toLowerCase().includes('email taken')) {
            showAlert("Email Already Registered", "An account with this email already exists. Please use a different email.", "error")
          } else if (errorMessage.toLowerCase().includes('phone already exists') || errorMessage.toLowerCase().includes('phone taken')) {
            showAlert("Phone Already Registered", "An account with this phone number already exists. Please use a different phone number.", "error")
          } else if (errorMessage.toLowerCase().includes('invalid email')) {
            showAlert("Invalid Email", "Please enter a valid email address.", "error")
          } else if (errorMessage.toLowerCase().includes('invalid phone')) {
            showAlert("Invalid Phone", "Please enter a valid phone number.", "error")
          } else {
            showAlert("Registration Failed", errorMessage, "error")
          }
        }
      } catch (error) {
        showAlert("Network Error", "Unable to connect to server. Please check your internet connection.", "error")
      } finally {
        setIsLoading(false)
      }
      return
    }

    // Login - only basic validation, let backend handle the rest
    if (!username.trim() || !password.trim()) {
      showAlert("Validation Error", "Please enter both username and password", "error")
      return
    }

    const requestData = {
      username: username.trim(),
      password: password.trim()
    }

    console.log("Login Request Data:", requestData)
    console.log("API Endpoint:", 'https://lot-ecom-backend.onrender.com/api/v1/auth/login')

    setIsLoading(true)
    try {
      const response = await fetch('https://lot-ecom-backend.onrender.com/api/v1/auth/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(requestData)
      })

      console.log("Response Status:", response.status)
      console.log("Response Headers:", response.headers)

      const data = await response.json()
      console.log("Login Response Data:", data)

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
        console.error("Login failed with status:", response.status)
        console.error("Error response:", data)
        
        // Handle specific backend errors
        const errorMessage = data.message || data.error || "Invalid username or password"
        if (errorMessage.toLowerCase().includes('user not found') || errorMessage.toLowerCase().includes('invalid username')) {
          showAlert("User Not Found", "The username you entered does not exist in our system.", "error")
        } else if (errorMessage.toLowerCase().includes('incorrect password') || errorMessage.toLowerCase().includes('invalid password')) {
          showAlert("Incorrect Password", "The password you entered is incorrect.", "error")
        } else if (errorMessage.toLowerCase().includes('account not approved') || errorMessage.toLowerCase().includes('pending approval')) {
          showAlert("Account Pending Approval", "Your account is pending admin approval. Please wait for approval before logging in.", "info")
        } else if (errorMessage.toLowerCase().includes('account suspended') || errorMessage.toLowerCase().includes('account blocked')) {
          showAlert("Account Suspended", "Your account has been suspended. Please contact support.", "error")
        } else if (errorMessage.toLowerCase().includes('inactive account')) {
          showAlert("Inactive Account", "Your account is inactive. Please contact support.", "error")
        } else {
          showAlert("Login Failed", errorMessage, "error")
        }
      }
    } catch (error: any) {
      console.error("Network Error:", error)
      showAlert("Network Error", `Unable to connect to server: ${error?.message || 'Unknown error'}. Please check your internet connection.`, "error")
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary/10 via-background to-secondary/5 flex items-center justify-center px-4 py-12 animate-gradient">
      <div className="w-full max-w-md">
        {/* Hero Section */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl mb-6 mx-auto animate-float glow-primary">
            <img
              src="/Logo/mainlogo.png"
              alt="TechHub Logo"
              className="w-full h-full rounded-2xl"
            />
          </div>
          <h1 className="text-4xl font-bold text-foreground mb-3 text-balance animate-bounce-subtle">Welcome to Little Other Things</h1>
          <p className="text-lg text-muted-foreground text-balance">
            Your Wholesale and B2B Marketplace
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
                className={`flex-1 py-2 rounded-md font-medium transition-all duration-300 ${!isSignUp ? "bg-gradient-to-r from-primary to-secondary text-primary-foreground shine-effect" : "text-muted-foreground hover:text-foreground hover:bg-muted/80"
                  }`}
              >
                Login
              </button>
              <button
                onClick={() => {
                  setIsSignUp(true)
                  clearAllFields()
                }}
                className={`flex-1 py-2 rounded-md font-medium transition-all duration-300 ${isSignUp ? "bg-gradient-to-r from-primary to-secondary text-primary-foreground shine-effect" : "text-muted-foreground hover:text-foreground hover:bg-muted/80"
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
                      onChange={(e) => handleFieldChange('username', e.target.value)}
                      onBlur={() => handleFieldBlur('username', username)}
                      placeholder="Username"
                      className={`w-full pl-10 pr-4 py-3 bg-background border rounded-lg focus:outline-none focus:ring-2 transition-all duration-300 text-foreground placeholder:text-muted-foreground ${
                        fieldErrors.username && touchedFields.username
                          ? 'border-red-500 focus:ring-red-500/50 focus:border-red-500'
                          : 'border-border focus:ring-primary/50 focus:border-primary hover:border-primary/50'
                      }`}
                    />
                  </div>
                  {fieldErrors.username && touchedFields.username && (
                    <p className="text-red-500 text-xs mt-1">{fieldErrors.username}</p>
                  )}
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
                      onChange={(e) => handleFieldChange('email', e.target.value)}
                      onBlur={() => handleFieldBlur('email', email)}
                      placeholder="Email Address"
                      className={`w-full pl-10 pr-4 py-3 bg-background border rounded-lg focus:outline-none focus:ring-2 transition-all duration-300 text-foreground placeholder:text-muted-foreground ${
                        fieldErrors.email && touchedFields.email
                          ? 'border-red-500 focus:ring-red-500/50 focus:border-red-500'
                          : 'border-border focus:ring-primary/50 focus:border-primary hover:border-primary/50'
                      }`}
                    />
                  </div>
                  {fieldErrors.email && touchedFields.email && (
                    <p className="text-red-500 text-xs mt-1">{fieldErrors.email}</p>
                  )}
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
                      type={showSignupPassword ? "text" : "password"}
                      value={password}
                      onChange={(e) => handleFieldChange('password', e.target.value)}
                      onBlur={() => handleFieldBlur('password', password)}
                      placeholder="Password"
                      className={`w-full pl-10 pr-12 py-3 bg-background border rounded-lg focus:outline-none focus:ring-2 transition-all duration-300 text-foreground placeholder:text-muted-foreground ${
                        fieldErrors.password && touchedFields.password
                          ? 'border-red-500 focus:ring-red-500/50 focus:border-red-500'
                          : 'border-border focus:ring-primary/50 focus:border-primary hover:border-primary/50'
                      }`}
                    />
                    <button
                      type="button"
                      onClick={() => setShowSignupPassword(!showSignupPassword)}
                      className="absolute right-3 top-3 text-muted-foreground hover:text-foreground transition-colors"
                    >
                      {showSignupPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                    </button>
                  </div>
                  {fieldErrors.password && touchedFields.password && (
                    <p className="text-red-500 text-xs mt-1">{fieldErrors.password}</p>
                  )}
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
                      onChange={(e) => handleFieldChange('companyName', e.target.value)}
                      onBlur={() => handleFieldBlur('companyName', companyName)}
                      placeholder="Company Name"
                      className={`w-full pl-10 pr-4 py-3 bg-background border rounded-lg focus:outline-none focus:ring-2 transition-all duration-300 text-foreground placeholder:text-muted-foreground ${
                        fieldErrors.companyName && touchedFields.companyName
                          ? 'border-red-500 focus:ring-red-500/50 focus:border-red-500'
                          : 'border-border focus:ring-primary/50 focus:border-primary hover:border-primary/50'
                      }`}
                    />
                  </div>
                  {fieldErrors.companyName && touchedFields.companyName && (
                    <p className="text-red-500 text-xs mt-1">{fieldErrors.companyName}</p>
                  )}
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
                      onChange={(e) => handleFieldChange('contactPerson', e.target.value)}
                      onBlur={() => handleFieldBlur('contactPerson', contactPerson)}
                      placeholder="Contact Person Name"
                      className={`w-full pl-10 pr-4 py-3 bg-background border rounded-lg focus:outline-none focus:ring-2 transition-all duration-300 text-foreground placeholder:text-muted-foreground ${
                        fieldErrors.contactPerson && touchedFields.contactPerson
                          ? 'border-red-500 focus:ring-red-500/50 focus:border-red-500'
                          : 'border-border focus:ring-primary/50 focus:border-primary hover:border-primary/50'
                      }`}
                    />
                  </div>
                  {fieldErrors.contactPerson && touchedFields.contactPerson && (
                    <p className="text-red-500 text-xs mt-1">{fieldErrors.contactPerson}</p>
                  )}
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
                      onChange={(e) => handleFieldChange('phone', e.target.value)}
                      onBlur={() => handleFieldBlur('phone', phone)}
                      placeholder="Phone Number"
                      className={`w-full pl-10 pr-4 py-3 bg-background border rounded-lg focus:outline-none focus:ring-2 transition-all duration-300 text-foreground placeholder:text-muted-foreground ${
                        fieldErrors.phone && touchedFields.phone
                          ? 'border-red-500 focus:ring-red-500/50 focus:border-red-500'
                          : 'border-border focus:ring-primary/50 focus:border-primary hover:border-primary/50'
                      }`}
                    />
                  </div>
                  {fieldErrors.phone && touchedFields.phone && (
                    <p className="text-red-500 text-xs mt-1">{fieldErrors.phone}</p>
                  )}
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
                      onChange={(e) => handleFieldChange('username', e.target.value)}
                      onBlur={() => handleFieldBlur('username', username)}
                      placeholder="Username"
                      className={`w-full pl-10 pr-4 py-3 bg-background border rounded-lg focus:outline-none focus:ring-2 transition-all duration-300 text-foreground placeholder:text-muted-foreground ${
                        fieldErrors.username && touchedFields.username
                          ? 'border-red-500 focus:ring-red-500/50 focus:border-red-500'
                          : 'border-border focus:ring-primary/50 focus:border-primary hover:border-primary/50'
                      }`}
                    />
                  </div>
                  {fieldErrors.username && touchedFields.username && (
                    <p className="text-red-500 text-xs mt-1">{fieldErrors.username}</p>
                  )}
                </div>

                <div>
                  <label htmlFor="current-pass" className="block text-sm font-medium text-foreground mb-2">
                    Current Password
                  </label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-3 text-muted-foreground" size={20} />
                    <input
                      id="current-pass"
                      type={showCurrentPassword ? "text" : "password"}
                      value={currentPassword}
                      onChange={(e) => handleFieldChange('currentPassword', e.target.value)}
                      onBlur={() => handleFieldBlur('currentPassword', currentPassword)}
                      placeholder="Current Password"
                      className={`w-full pl-10 pr-12 py-3 bg-background border rounded-lg focus:outline-none focus:ring-2 transition-all duration-300 text-foreground placeholder:text-muted-foreground ${
                        fieldErrors.currentPassword && touchedFields.currentPassword
                          ? 'border-red-500 focus:ring-red-500/50 focus:border-red-500'
                          : 'border-border focus:ring-primary/50 focus:border-primary hover:border-primary/50'
                      }`}
                    />
                    <button
                      type="button"
                      onClick={() => setShowCurrentPassword(!showCurrentPassword)}
                      className="absolute right-3 top-3 text-muted-foreground hover:text-foreground transition-colors"
                    >
                      {showCurrentPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                    </button>
                  </div>
                  {fieldErrors.currentPassword && touchedFields.currentPassword && (
                    <p className="text-red-500 text-xs mt-1">{fieldErrors.currentPassword}</p>
                  )}
                </div>

                <div>
                  <label htmlFor="new-pass" className="block text-sm font-medium text-foreground mb-2">
                    New Password
                  </label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-3 text-muted-foreground" size={20} />
                    <input
                      id="new-pass"
                      type={showNewPassword ? "text" : "password"}
                      value={newPassword}
                      onChange={(e) => handleFieldChange('newPassword', e.target.value)}
                      onBlur={() => handleFieldBlur('newPassword', newPassword)}
                      placeholder="New Password"
                      className={`w-full pl-10 pr-12 py-3 bg-background border rounded-lg focus:outline-none focus:ring-2 transition-all duration-300 text-foreground placeholder:text-muted-foreground ${
                        fieldErrors.newPassword && touchedFields.newPassword
                          ? 'border-red-500 focus:ring-red-500/50 focus:border-red-500'
                          : 'border-border focus:ring-primary/50 focus:border-primary hover:border-primary/50'
                      }`}
                    />
                    <button
                      type="button"
                      onClick={() => setShowNewPassword(!showNewPassword)}
                      className="absolute right-3 top-3 text-muted-foreground hover:text-foreground transition-colors"
                    >
                      {showNewPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                    </button>
                  </div>
                  {fieldErrors.newPassword && touchedFields.newPassword && (
                    <p className="text-red-500 text-xs mt-1">{fieldErrors.newPassword}</p>
                  )}
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
                      type={showPassword ? "text" : "password"}
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      placeholder="Password"
                      className="w-full pl-10 pr-12 py-3 bg-background border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary transition-all duration-300 text-foreground placeholder:text-muted-foreground hover:border-primary/50"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-3 text-muted-foreground hover:text-foreground transition-colors"
                    >
                      {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                    </button>
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
              disabled={isLoading}
              className="w-full bg-gradient-to-r from-primary to-secondary text-primary-foreground py-3 rounded-xl font-semibold hover:from-primary/90 hover:to-secondary/90 transition-all duration-300 flex items-center justify-center gap-2 mt-6 shine-effect glow-primary-hover transform hover:scale-[1.02] hover:-translate-y-0.5 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
            >
              {isLoading ? (
                <>
                  <Loader2 className="animate-spin" size={20} />
                  {isForgotPassword ? "Updating..." : isSignUp ? "Creating..." : "Signing in..."}
                </>
              ) : (
                <>
                  {isForgotPassword ? "Update Password" : isSignUp ? "Create Account" : "Login"}
                  <ArrowRight size={20} className="animate-bounce-subtle" />
                </>
              )}
            </button>
          </form>


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
