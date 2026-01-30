"use client"

import { useState, useEffect } from "react"
import { Building2, User, Phone, Mail, Edit2, Check, X } from "lucide-react"

interface UserData {
  username: string
  email: string
  companyName: string
  contactPerson: string
  phone: string
  category: string
}

interface ProfilePageProps {
  userData: UserData
  onUpdate: (data: UserData) => void
  onBack: () => void
}

export function ProfilePage({ userData, onUpdate, onBack }: ProfilePageProps) {
  const [isEditing, setIsEditing] = useState(false)
  const [formData, setFormData] = useState(userData)
  const [error, setError] = useState("")
  const [loading, setLoading] = useState(true)

  // Fetch user data from API
  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const token = localStorage.getItem('authToken')
        if (!token) {
          setError('No authentication token found')
          setLoading(false)
          return
        }

        console.log('Fetching user data with token:', token)
        
        const response = await fetch('https://lot-ecom-backend.onrender.com/api/v1/auth/me', {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
          }
        })
        
        const data = await response.json()
        console.log('User data response:', data)
        console.log('User data keys:', Object.keys(data))
        console.log('data.user:', data.user)
        
        if (response.ok) {
          // Map API response to form data structure
          const apiData = data.data || data.user || data
          console.log('API Data to map:', apiData)
          
          const mappedData = {
            username: apiData.username || apiData.name || '',
            email: apiData.email || '',
            companyName: apiData.companyName || apiData.company_name || apiData.company || '',
            contactPerson: apiData.contactPerson || apiData.contact_person || apiData.contactName || '',
            phone: apiData.phone || apiData.phoneNumber || apiData.phone_number || '',
            category: apiData.role || apiData.category || 'Customer'
          }
          
          console.log('Mapped form data:', mappedData)
          setFormData(mappedData)
        } else {
          setError(data.message || 'Failed to fetch user data')
        }
      } catch (error) {
        console.error('Error fetching user data:', error)
        setError('Network error. Please try again.')
      } finally {
        setLoading(false)
      }
    }

    fetchUserData()
  }, [])

  const handleSave = async () => {
    setError("")

    if (!formData.companyName || !formData.contactPerson || !formData.email || !formData.phone) {
      setError("Please fill in all fields")
      return
    }

    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      setError("Please enter a valid email")
      return
    }

    if (!/^\d{10}$/.test(formData.phone.replace(/\D/g, ""))) {
      setError("Please enter a valid phone number")
      return
    }

    try {
      const token = localStorage.getItem('authToken')
      if (!token) {
        setError('No authentication token found')
        return
      }

      console.log('Updating profile with data:', formData)
      
      const response = await fetch('https://lot-ecom-backend.onrender.com/api/v1/auth/updateprofile', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          companyName: formData.companyName,
          contactPerson: formData.contactPerson,
          phone: formData.phone
        })
      })
      
      const data = await response.json()
      console.log('Profile update response:', data)
      
      if (response.ok) {
        alert('Profile updated successfully!')
        onUpdate(formData)
        setIsEditing(false)
      } else {
        setError(data.message || 'Failed to update profile')
      }
    } catch (error) {
      console.error('Profile update error:', error)
      setError('Network error. Please try again.')
    }
  }

  return (
    <div className="min-h-screen bg-background py-12">
      <div className="max-w-2xl mx-auto px-4">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-foreground mb-2">My Profile</h1>
          <p className="text-muted-foreground">Manage your account information</p>
        </div>

        {/* Loading State */}
        {loading && (
          <div className="bg-card border border-border rounded-2xl shadow-lg p-8 text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
            <p className="text-muted-foreground">Loading profile data...</p>
          </div>
        )}

        {/* Error State */}
        {error && !loading && (
          <div className="bg-destructive/10 border border-destructive/20 rounded-2xl p-6 mb-6">
            <p className="text-destructive font-medium">{error}</p>
          </div>
        )}

        {/* Profile Card */}
        {!loading && !error && (
          <div className="bg-card border border-border rounded-2xl shadow-lg p-8">
          {/* User Info Section */}
          <div className="mb-8">
            <div className="flex items-center justify-between mb-6">
              <button
                onClick={onBack}
                className="flex items-center gap-2 px-4 py-2 rounded-lg font-medium transition-colors bg-muted text-foreground hover:bg-muted/80"
              >
                ← Back
              </button>
              <button
                onClick={() => setIsEditing(!isEditing)}
                className={`flex items-center gap-2 px-4 py-2 rounded-lg font-medium transition-colors ${
                  isEditing
                    ? "bg-destructive/20 text-destructive hover:bg-destructive/30"
                    : "bg-primary text-primary-foreground hover:opacity-90"
                }`}
              >
                {isEditing ? (
                  <>
                    <X size={20} />
                    Cancel
                  </>
                ) : (
                  <>
                    <Edit2 size={20} />
                    Edit
                  </>
                )}
              </button>
            </div>
            <div className="flex items-center gap-4">
              <div className="w-16 h-16 bg-primary rounded-full flex items-center justify-center text-2xl text-primary-foreground">
                {formData.username ? formData.username.charAt(0).toUpperCase() : formData.email ? formData.email.charAt(0).toUpperCase() : 'U'}
              </div>
              <div>
                <h2 className="text-2xl font-bold text-foreground">{formData.username || formData.email || 'User'}</h2>
                <p className="text-muted-foreground">{formData.category || 'Customer'}</p>
              </div>
            </div>
          </div>

          {/* Error Message */}
          {error && (
            <div className="p-4 bg-destructive/10 border border-destructive/20 rounded-lg mb-6">
              <p className="text-sm text-destructive">{error}</p>
            </div>
          )}

          {/* Fields */}
          <div className="space-y-6">
            {/* Email (Read-only) */}
            <div>
              <label className="block text-sm font-medium text-foreground mb-2">Email Address</label>
              <div className="relative">
                <Mail className="absolute left-3 top-3 text-muted-foreground" size={20} />
                <input
                  type="email"
                  value={formData.email}
                  readOnly
                  className="w-full pl-10 pr-4 py-3 bg-muted border border-border rounded-lg text-foreground placeholder:text-muted-foreground cursor-not-allowed"
                />
              </div>
              <p className="text-xs text-muted-foreground mt-2">Email cannot be changed</p>
            </div>

            {/* Company Name */}
            <div>
              <label className="block text-sm font-medium text-foreground mb-2">Company Name</label>
              <div className="relative">
                <Building2 className="absolute left-3 top-3 text-muted-foreground" size={20} />
                <input
                  type="text"
                  value={formData.companyName || ''}
                  onChange={(e) => setFormData({ ...formData, companyName: e.target.value })}
                  readOnly={!isEditing}
                  className={`w-full pl-10 pr-4 py-3 border border-border rounded-lg ${
                    isEditing
                      ? "bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary/50"
                      : "bg-muted text-foreground cursor-not-allowed"
                  }`}
                />
              </div>
            </div>

            {/* Contact Person */}
            <div>
              <label className="block text-sm font-medium text-foreground mb-2">Contact Person Name</label>
              <div className="relative">
                <User className="absolute left-3 top-3 text-muted-foreground" size={20} />
                <input
                  type="text"
                  value={formData.contactPerson || ''}
                  onChange={(e) => setFormData({ ...formData, contactPerson: e.target.value })}
                  readOnly={!isEditing}
                  className={`w-full pl-10 pr-4 py-3 border border-border rounded-lg ${
                    isEditing
                      ? "bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary/50"
                      : "bg-muted text-foreground cursor-not-allowed"
                  }`}
                />
              </div>
            </div>

            {/* Phone */}
            <div>
              <label className="block text-sm font-medium text-foreground mb-2">Phone Number</label>
              <div className="relative">
                <Phone className="absolute left-3 top-3 text-muted-foreground" size={20} />
                <input
                  type="tel"
                  value={formData.phone || ''}
                  onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                  readOnly={!isEditing}
                  className={`w-full pl-10 pr-4 py-3 border border-border rounded-lg ${
                    isEditing
                      ? "bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary/50"
                      : "bg-muted text-foreground cursor-not-allowed"
                  }`}
                />
              </div>
            </div>
          </div>

          {/* Save Button */}
          {isEditing && (
            <div className="flex gap-3 mt-8">
              <button
                onClick={handleSave}
                className="flex-1 flex items-center justify-center gap-2 px-4 py-3 bg-primary text-primary-foreground rounded-lg font-semibold hover:opacity-90 transition-opacity"
              >
                <Check size={20} />
                Save Changes
              </button>
            </div>
          )}
        </div>
        )}
      </div>
    </div>
  )
}
