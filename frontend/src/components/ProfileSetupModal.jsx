import React, { useState, useEffect } from 'react';
import { 
  X, CheckCircle2, Camera, AlertCircle, Trash2, RefreshCw 
} from 'lucide-react';

import { supabase } from '../lib/supabase';
import { useAuth } from '../context/AuthContext';
import { 
  ALL_INTERESTS, TRAVEL_STYLES, BUDGET_LEVELS, ACCOMMODATION_PREFS, 
  sanitizeInput, validateProfileImage, calculateAge, calculateProfileCompletion 
} from '../lib/profileUtils';

export default function ProfileSetupModal({ isOpen, onClose }) {
  const { user, profile, refreshProfile, signOut } = useAuth();

  const [activeTab, setActiveTab] = useState('basic'); // 'basic' | 'travel' | 'interests'

  // Basic Profile State
  const [fullName, setFullName] = useState('');
  const [dob, setDob] = useState('');
  const [gender, setGender] = useState('other');
  const [city, setCity] = useState('');
  const [country, setCountry] = useState('');
  const [phone, setPhone] = useState('');
  const [bio, setBio] = useState('');
  const [profilePhoto, setProfilePhoto] = useState('');
  const [imageUploading, setImageUploading] = useState(false);


  // Travel Preferences State
  const [plannedDest, setPlannedDest] = useState('');
  const [preferredDests, setPreferredDests] = useState([]);
  const [destInput, setDestInput] = useState('');
  const [travelDates, setTravelDates] = useState('');
  const [flexibleDates, setFlexibleDates] = useState(true);
  const [travelStyle, setTravelStyle] = useState('Relaxed');
  const [budgetLevel, setBudgetLevel] = useState('moderate');
  const [accommodation, setAccommodation] = useState('Hotel');
  const [transport, setTransport] = useState('Flight');

  // Interests State (Selected array)
  const [selectedInterests, setSelectedInterests] = useState([]);

  // Form UX state
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const [successMsg, setSuccessMsg] = useState('');
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

  // Load existing profile & preferences from database
  useEffect(() => {
    if (!isOpen || !user) return;

    // Populate basic info
    setFullName(profile?.full_name || user.user_metadata?.full_name || '');
    setDob(profile?.date_of_birth || '');
    setGender(profile?.gender || 'other');
    setCity(profile?.city || '');
    setCountry(profile?.country || '');
    setPhone(profile?.phone || '');
    setBio(profile?.bio || '');
    setProfilePhoto(profile?.profile_photo || user.user_metadata?.avatar_url || '');

    // Fetch existing travel preferences and interests from Supabase
    const loadUserData = async () => {
      try {
        // Fetch travel preferences
        const { data: prefData } = await supabase
          .from('travel_preferences')
          .select('*')
          .eq('user_id', user.id)
          .maybeSingle();

        if (prefData) {
          setPreferredDests(prefData.preferred_destinations || []);
          setTravelDates(prefData.travel_dates || '');
          setFlexibleDates(prefData.flexible_dates ?? true);
          setTravelStyle(prefData.travel_style || 'Relaxed');
          setBudgetLevel(prefData.budget_level || 'moderate');
          setAccommodation(prefData.accommodation_preference || 'Hotel');
          setTransport(prefData.transport_preference || 'Flight');
          if (prefData.preferred_destinations?.length > 0) {
            setPlannedDest(prefData.preferred_destinations[0]);
          }
        }

        // Fetch user interests
        const { data: interestJoin } = await supabase
          .from('user_interests')
          .select('interests ( name )')
          .eq('user_id', user.id);

        if (interestJoin && interestJoin.length > 0) {
          const names = interestJoin.map(i => i.interests?.name).filter(Boolean);
          setSelectedInterests(names);
        } else {
          // Default initial selection
          setSelectedInterests(['Beach', 'Food', 'Culture']);
        }
      } catch (err) {
        console.error('Error loading preferences:', err);
      }
    };

    loadUserData();
  }, [isOpen, user, profile]);

  if (!isOpen) return null;

  // Calculate live completion score
  const computedAge = dob ? calculateAge(dob) : profile?.age;
  const currentProfileData = {
    full_name: fullName,
    profile_photo: profilePhoto,
    date_of_birth: dob,
    age: computedAge,
    city,
    country,
    bio
  };

  const currentPrefsData = {
    travel_style: travelStyle,
    preferred_destinations: preferredDests
  };

  const completionPercent = calculateProfileCompletion(currentProfileData, currentPrefsData, selectedInterests);

  // Handle Image File Upload
  const handleImageChange = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setErrorMsg('');
    const validation = validateProfileImage(file);
    if (!validation.valid && validation.error) {
      setErrorMsg(validation.error);
      return;
    }


    setImageUploading(true);

    try {
      // 1. Try Supabase storage bucket 'avatars'
      const fileExt = file.name.split('.').pop();
      const filePath = `${user.id}/${Date.now()}.${fileExt}`;
      
      const { error: uploadError } = await supabase.storage
        .from('avatars')
        .upload(filePath, file, { upsert: true });

      if (!uploadError) {
        const { data: { publicUrl } } = supabase.storage
          .from('avatars')
          .getPublicUrl(filePath);
        setProfilePhoto(publicUrl);
      } else {
        // Fallback: Client-side Data URL for instant rendering & persistent fallback
        const reader = new FileReader();
        reader.onloadend = () => {
          setProfilePhoto(reader.result);
        };
        reader.readAsDataURL(file);
      }
    } catch (err) {
      console.error('Image upload catch:', err);
      // Data URL fallback
      const reader = new FileReader();
      reader.onloadend = () => {
        setProfilePhoto(reader.result);
      };
      reader.readAsDataURL(file);
    } finally {
      setImageUploading(false);
    }
  };

  // Add preferred destination tag
  const handleAddDestination = () => {
    const clean = destInput.trim();
    if (clean && !preferredDests.includes(clean)) {
      setPreferredDests([...preferredDests, clean]);
      if (!plannedDest) setPlannedDest(clean);
      setDestInput('');
    }
  };

  const handleRemoveDestination = (destToRemove) => {
    setPreferredDests(preferredDests.filter(d => d !== destToRemove));
  };

  // Toggle Interest Chip
  const toggleInterest = (interestName) => {
    if (selectedInterests.includes(interestName)) {
      setSelectedInterests(selectedInterests.filter(i => i !== interestName));
    } else {
      setSelectedInterests([...selectedInterests, interestName]);
    }
  };

  // Handle Main Save Submission
  const handleSave = async (e) => {
    e.preventDefault();
    if (loading) return;

    setErrorMsg('');
    setSuccessMsg('');

    // Field Validations
    const sanitizedName = sanitizeInput(fullName);
    if (!sanitizedName || sanitizedName.length < 2) {
      setErrorMsg('Please enter your full legal name.');
      setActiveTab('basic');
      return;
    }

    if (dob) {
      const age = calculateAge(dob);
      if (age === null || age < 18) {
        setErrorMsg('You must be at least 18 years old to join KadamFind.');
        setActiveTab('basic');
        return;
      }
    }

    const sanitizedCity = sanitizeInput(city);
    const sanitizedCountry = sanitizeInput(country);
    if (!sanitizedCity || !sanitizedCountry) {
      setErrorMsg('Please specify both your City and Country.');
      setActiveTab('basic');
      return;
    }

    if (selectedInterests.length === 0) {
      setErrorMsg('Please select at least 1 travel interest or activity tag.');
      setActiveTab('interests');
      return;
    }

    setLoading(true);

    try {
      // 1. Update Profiles Table
      const calculatedAge = dob ? calculateAge(dob) : profile?.age || null;
      const profileUpdates = {
        id: user.id,
        full_name: sanitizedName,
        email: user.email,
        phone: phone ? sanitizeInput(phone) : null,
        date_of_birth: dob || null,
        age: calculatedAge,
        gender: gender || 'other',
        profile_photo: profilePhoto || null,
        bio: sanitizeInput(bio).substring(0, 300),
        country: sanitizedCountry,
        city: sanitizedCity,
        verification_status: 'verified',
        account_status: 'active',
        updated_at: new Date().toISOString()
      };

      const { error: profileError } = await supabase
        .from('profiles')
        .upsert(profileUpdates, { onConflict: 'id' });

      if (profileError) throw profileError;

      // 2. Upsert Travel Preferences
      const prefsUpdates = {
        user_id: user.id,
        preferred_destinations: preferredDests.length > 0 ? preferredDests : [plannedDest || 'Bali, Indonesia'],
        travel_dates: travelDates || 'Flexible (Next 30 Days)',
        flexible_dates: flexibleDates,
        travel_style: travelStyle,
        budget_level: budgetLevel,
        accommodation_preference: accommodation,
        transport_preference: transport,
        updated_at: new Date().toISOString()
      };

      const { error: prefsError } = await supabase
        .from('travel_preferences')
        .upsert(prefsUpdates, { onConflict: 'user_id' });

      if (prefsError) console.error('Travel prefs upsert notice:', prefsError);

      // 3. Update User Interests normalized table
      // Clear previous user_interests
      await supabase.from('user_interests').delete().eq('user_id', user.id);

      // Fetch master interest IDs for selected interest names
      const { data: masterInterests } = await supabase
        .from('interests')
        .select('id, name')
        .in('name', selectedInterests);

      if (masterInterests && masterInterests.length > 0) {
        const rows = masterInterests.map(mi => ({
          user_id: user.id,
          interest_id: mi.id
        }));
        await supabase.from('user_interests').insert(rows);
      }

      await refreshProfile();
      setSuccessMsg('Profile and travel preferences saved successfully!');
      
      setTimeout(() => {
        setSuccessMsg('');
        onClose();
      }, 1200);

    } catch (err) {
      console.error('Save profile error:', err);
      setErrorMsg(err.message || 'Failed to save changes. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  // Handle Account Deletion
  const handleDeleteAccount = async () => {
    setLoading(true);
    setErrorMsg('');

    try {
      const { error } = await supabase.from('profiles').delete().eq('id', user.id);
      if (error) throw error;
      await signOut();
      onClose();
    } catch (err) {
      console.error('Delete account error:', err);
      setErrorMsg('Failed to delete account. Please contact support.');
    } finally {
      setLoading(false);
      setShowDeleteConfirm(false);
    }
  };

  return (
    <div className="modal-overlay">
      <div className="modal-content" style={{ maxWidth: '640px', padding: '32px', maxHeight: '90vh', overflowY: 'auto' }}>
        
        {/* Close Button */}
        <button onClick={onClose} className="close-btn" disabled={loading}>
          <X size={20} />
        </button>

        {/* Top Title */}
        <div style={{ marginBottom: '20px' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '12px' }}>
            <div>
              <h2 style={{ fontSize: '1.6rem', fontWeight: 900, color: '#0F172A', margin: 0 }}>
                Manage Your Traveler Profile
              </h2>
              <p style={{ fontSize: '0.85rem', color: '#64748B', marginTop: '2px' }}>
                Complete your details to rank higher in companion search results
              </p>
            </div>

            {/* Profile Completion Score Meter */}
            <div style={{
              backgroundColor: completionPercent >= 60 ? '#ECFDF5' : '#FFFBEB',
              border: completionPercent >= 60 ? '1px solid #A7F3D0' : '1px solid #FDE68A',
              borderRadius: '14px',
              padding: '8px 14px',
              textAlign: 'right'
            }}>
              <div style={{ fontSize: '0.72rem', fontWeight: 800, color: '#64748B', textTransform: 'uppercase' }}>
                Profile Status
              </div>
              <div style={{
                fontSize: '1.1rem',
                fontWeight: 900,
                color: completionPercent >= 60 ? '#059669' : '#D97706'
              }}>
                {completionPercent}% Complete
              </div>
            </div>
          </div>

          {/* Progress Bar */}
          <div style={{ width: '100%', height: '6px', backgroundColor: '#E2E8F0', borderRadius: '999px', marginTop: '12px', overflow: 'hidden' }}>
            <div style={{
              width: `${completionPercent}%`,
              height: '100%',
              backgroundColor: completionPercent >= 60 ? '#10B981' : '#FF5E00',
              transition: 'width 0.4s ease'
            }} />
          </div>
        </div>

        {/* Tab Navigation */}
        <div style={{
          display: 'flex',
          backgroundColor: '#F1F5F9',
          borderRadius: '12px',
          padding: '4px',
          marginBottom: '20px'
        }}>
          {[
            { id: 'basic', label: '👤 Basic Info & Bio' },
            { id: 'travel', label: '✈️ Travel Preferences' },
            { id: 'interests', label: '🎯 Interests & Tags' }
          ].map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              style={{
                flex: 1,
                padding: '10px 8px',
                borderRadius: '10px',
                border: 'none',
                backgroundColor: activeTab === tab.id ? '#FFFFFF' : 'transparent',
                color: activeTab === tab.id ? '#0F172A' : '#64748B',
                fontWeight: 700,
                fontSize: '0.85rem',
                cursor: 'pointer',
                boxShadow: activeTab === tab.id ? '0 2px 6px rgba(0,0,0,0.06)' : 'none',
                transition: 'all 0.2s ease'
              }}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Error Banner */}
        {errorMsg && (
          <div style={{
            backgroundColor: '#FEF2F2',
            border: '1px solid #FECACA',
            color: '#DC2626',
            borderRadius: '12px',
            padding: '12px 14px',
            fontSize: '0.85rem',
            marginBottom: '16px',
            fontWeight: 600,
            display: 'flex',
            alignItems: 'center',
            gap: '8px'
          }}>
            <AlertCircle size={18} style={{ flexShrink: 0 }} />
            <div style={{ flex: 1 }}>{errorMsg}</div>
          </div>
        )}

        {/* Success Banner */}
        {successMsg && (
          <div style={{
            backgroundColor: '#ECFDF5',
            border: '1px solid #A7F3D0',
            color: '#059669',
            borderRadius: '12px',
            padding: '12px 14px',
            fontSize: '0.85rem',
            marginBottom: '16px',
            fontWeight: 600,
            display: 'flex',
            alignItems: 'center',
            gap: '8px'
          }}>
            <CheckCircle2 size={18} style={{ flexShrink: 0 }} />
            <div style={{ flex: 1 }}>{successMsg}</div>
          </div>
        )}

        {/* TAB 1: BASIC INFO */}
        {activeTab === 'basic' && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            
            {/* Profile Photo Upload */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '18px', backgroundColor: '#FFF4EC', padding: '16px', borderRadius: '16px', border: '1px solid #FFD8A8' }}>
              <div style={{ position: 'relative' }}>
                <img
                  src={profilePhoto || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=200&q=80'}
                  alt="Profile"
                  style={{
                    width: '76px',
                    height: '76px',
                    borderRadius: '50%',
                    objectFit: 'cover',
                    border: '3px solid #FF5E00',
                    boxShadow: '0 4px 12px rgba(255, 94, 0, 0.25)'
                  }}
                />
                <label style={{
                  position: 'absolute',
                  bottom: '-4px',
                  right: '-4px',
                  backgroundColor: '#0F172A',
                  color: '#FFFFFF',
                  padding: '6px',
                  borderRadius: '50%',
                  cursor: 'pointer',
                  border: '2px solid #FFFFFF',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center'
                }}>
                  <Camera size={14} />
                  <input
                    type="file"
                    accept="image/jpeg,image/png,image/webp"
                    onChange={handleImageChange}
                    style={{ display: 'none' }}
                    disabled={imageUploading || loading}
                  />
                </label>
              </div>

              <div>
                <div style={{ fontWeight: 800, fontSize: '0.95rem', color: '#0F172A' }}>
                  {imageUploading ? 'Uploading Image...' : 'Profile Photo'}
                </div>
                <div style={{ fontSize: '0.78rem', color: '#64748B', marginTop: '2px' }}>
                  Upload a clear face photo (Max 5MB • JPG, PNG, WEBP)
                </div>
                {imageUploading && (
                  <div style={{ fontSize: '0.78rem', color: '#FF5E00', fontWeight: 700, marginTop: '4px' }}>
                    Processing image validation...
                  </div>
                )}
              </div>
            </div>

            {/* Full Name & Gender Grid */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
              <div>
                <label style={{ fontSize: '0.8rem', fontWeight: 800, color: '#475569', marginBottom: '6px', display: 'block' }}>
                  Full Legal Name <span style={{ color: '#EF4444' }}>*</span>
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Alex Morgan"
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  style={{
                    width: '100%',
                    padding: '12px 14px',
                    borderRadius: '12px',
                    border: '1.5px solid #CBD5E1',
                    fontSize: '0.92rem',
                    outline: 'none'
                  }}
                />
              </div>

              <div>
                <label style={{ fontSize: '0.8rem', fontWeight: 800, color: '#475569', marginBottom: '6px', display: 'block' }}>
                  Gender
                </label>
                <select
                  value={gender}
                  onChange={(e) => setGender(e.target.value)}
                  style={{
                    width: '100%',
                    padding: '12px 14px',
                    borderRadius: '12px',
                    border: '1.5px solid #CBD5E1',
                    fontSize: '0.92rem',
                    outline: 'none',
                    backgroundColor: '#FFF'
                  }}
                >
                  <option value="female">Female</option>
                  <option value="male">Male</option>
                  <option value="non-binary">Non-Binary</option>
                  <option value="other">Prefer not to say / Other</option>
                </select>
              </div>
            </div>

            {/* DOB & Phone Grid */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
              <div>
                <label style={{ fontSize: '0.8rem', fontWeight: 800, color: '#475569', marginBottom: '6px', display: 'block' }}>
                  Date of Birth {computedAge ? `(Age: ${computedAge})` : ''}
                </label>
                <input
                  type="date"
                  max={new Date(Date.now() - 18 * 365.25 * 86400000).toISOString().split('T')[0]}
                  value={dob}
                  onChange={(e) => setDob(e.target.value)}
                  style={{
                    width: '100%',
                    padding: '12px 14px',
                    borderRadius: '12px',
                    border: '1.5px solid #CBD5E1',
                    fontSize: '0.92rem',
                    outline: 'none'
                  }}
                />
              </div>

              <div>
                <label style={{ fontSize: '0.8rem', fontWeight: 800, color: '#475569', marginBottom: '6px', display: 'block' }}>
                  Phone Number <span style={{ color: '#94A3B8', fontWeight: 500 }}>(Optional)</span>
                </label>
                <input
                  type="tel"
                  placeholder="+1 (555) 000-0000"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  style={{
                    width: '100%',
                    padding: '12px 14px',
                    borderRadius: '12px',
                    border: '1.5px solid #CBD5E1',
                    fontSize: '0.92rem',
                    outline: 'none'
                  }}
                />
              </div>
            </div>

            {/* City & Country */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
              <div>
                <label style={{ fontSize: '0.8rem', fontWeight: 800, color: '#475569', marginBottom: '6px', display: 'block' }}>
                  City <span style={{ color: '#EF4444' }}>*</span>
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. New York"
                  value={city}
                  onChange={(e) => setCity(e.target.value)}
                  style={{
                    width: '100%',
                    padding: '12px 14px',
                    borderRadius: '12px',
                    border: '1.5px solid #CBD5E1',
                    fontSize: '0.92rem',
                    outline: 'none'
                  }}
                />
              </div>

              <div>
                <label style={{ fontSize: '0.8rem', fontWeight: 800, color: '#475569', marginBottom: '6px', display: 'block' }}>
                  Country <span style={{ color: '#EF4444' }}>*</span>
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. United States"
                  value={country}
                  onChange={(e) => setCountry(e.target.value)}
                  style={{
                    width: '100%',
                    padding: '12px 14px',
                    borderRadius: '12px',
                    border: '1.5px solid #CBD5E1',
                    fontSize: '0.92rem',
                    outline: 'none'
                  }}
                />
              </div>
            </div>

            {/* Bio Text */}
            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '6px' }}>
                <label style={{ fontSize: '0.8rem', fontWeight: 800, color: '#475569' }}>
                  Short Travel Bio
                </label>
                <span style={{ fontSize: '0.75rem', color: bio.length > 280 ? '#EF4444' : '#94A3B8' }}>
                  {bio.length}/300 chars
                </span>
              </div>
              <textarea
                rows={3}
                maxLength={300}
                placeholder="Share your favorite travel activities, upcoming destinations, and companion preferences..."
                value={bio}
                onChange={(e) => setBio(e.target.value)}
                style={{
                  width: '100%',
                  padding: '12px 14px',
                  borderRadius: '12px',
                  border: '1.5px solid #CBD5E1',
                  fontSize: '0.92rem',
                  outline: 'none',
                  resize: 'vertical',
                  fontFamily: 'inherit'
                }}
              />
            </div>

          </div>
        )}

        {/* TAB 2: TRAVEL PREFERENCES */}
        {activeTab === 'travel' && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            
            {/* Preferred Destinations Tag Input */}
            <div>
              <label style={{ fontSize: '0.8rem', fontWeight: 800, color: '#475569', marginBottom: '6px', display: 'block' }}>
                Target Destinations Interested In
              </label>
              
              <div style={{ display: 'flex', gap: '8px', marginBottom: '10px' }}>
                <input
                  type="text"
                  placeholder="Add destination e.g. Bali, Tokyo, Santorini..."
                  value={destInput}
                  onChange={(e) => setDestInput(e.target.value)}
                  onKeyDown={(e) => { if (e.key === 'Enter') { e.preventDefault(); handleAddDestination(); } }}
                  style={{
                    flex: 1,
                    padding: '12px 14px',
                    borderRadius: '12px',
                    border: '1.5px solid #CBD5E1',
                    fontSize: '0.92rem',
                    outline: 'none'
                  }}
                />
                <button
                  type="button"
                  onClick={handleAddDestination}
                  className="btn-primary"
                  style={{ padding: '12px 18px', borderRadius: '12px', fontSize: '0.88rem' }}
                >
                  Add
                </button>
              </div>

              {/* Tag Chips */}
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
                {preferredDests.map((d, idx) => (
                  <span
                    key={idx}
                    style={{
                      backgroundColor: '#FFF4EC',
                      color: '#FF5E00',
                      border: '1px solid #FFD8A8',
                      padding: '6px 12px',
                      borderRadius: '999px',
                      fontSize: '0.85rem',
                      fontWeight: 700,
                      display: 'inline-flex',
                      alignItems: 'center',
                      gap: '6px'
                    }}
                  >
                    <span>🏝️ {d}</span>
                    <X
                      size={14}
                      style={{ cursor: 'pointer', color: '#C2410C' }}
                      onClick={() => handleRemoveDestination(d)}
                    />
                  </span>
                ))}
              </div>
            </div>

            {/* Travel Dates & Flexible Checkbox */}
            <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '12px', alignItems: 'center' }}>
              <div>
                <label style={{ fontSize: '0.8rem', fontWeight: 800, color: '#475569', marginBottom: '6px', display: 'block' }}>
                  Trip Dates / Timeline
                </label>
                <input
                  type="text"
                  placeholder="e.g. Next 30 Days / Oct 15 - Nov 01"
                  value={travelDates}
                  onChange={(e) => setTravelDates(e.target.value)}
                  style={{
                    width: '100%',
                    padding: '12px 14px',
                    borderRadius: '12px',
                    border: '1.5px solid #CBD5E1',
                    fontSize: '0.92rem',
                    outline: 'none'
                  }}
                />
              </div>

              <div style={{ marginTop: '22px' }}>
                <label style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', cursor: 'pointer', fontSize: '0.85rem', fontWeight: 700, color: '#0F172A' }}>
                  <input
                    type="checkbox"
                    checked={flexibleDates}
                    onChange={(e) => setFlexibleDates(e.target.checked)}
                    style={{ width: '18px', height: '18px', accentColor: '#FF5E00' }}
                  />
                  Flexible Dates
                </label>
              </div>
            </div>

            {/* Travel Style Grid */}
            <div>
              <label style={{ fontSize: '0.8rem', fontWeight: 800, color: '#475569', marginBottom: '8px', display: 'block' }}>
                Primary Travel Style
              </label>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '8px' }}>
                {TRAVEL_STYLES.map(style => (
                  <button
                    key={style}
                    type="button"
                    onClick={() => setTravelStyle(style)}
                    style={{
                      padding: '10px 8px',
                      borderRadius: '12px',
                      border: travelStyle === style ? '2px solid #FF5E00' : '1px solid #CBD5E1',
                      backgroundColor: travelStyle === style ? '#FFF4EC' : '#FFFFFF',
                      color: travelStyle === style ? '#FF5E00' : '#475569',
                      fontWeight: 700,
                      fontSize: '0.82rem',
                      cursor: 'pointer'
                    }}
                  >
                    {style}
                  </button>
                ))}
              </div>
            </div>

            {/* Budget & Accommodation */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
              <div>
                <label style={{ fontSize: '0.8rem', fontWeight: 800, color: '#475569', marginBottom: '6px', display: 'block' }}>
                  Budget Level
                </label>
                <select
                  value={budgetLevel}
                  onChange={(e) => setBudgetLevel(e.target.value)}
                  style={{
                    width: '100%',
                    padding: '12px 14px',
                    borderRadius: '12px',
                    border: '1.5px solid #CBD5E1',
                    fontSize: '0.92rem',
                    outline: 'none',
                    backgroundColor: '#FFF'
                  }}
                >
                  {BUDGET_LEVELS.map(b => (
                    <option key={b.value} value={b.value}>{b.label}</option>
                  ))}
                </select>
              </div>

              <div>
                <label style={{ fontSize: '0.8rem', fontWeight: 800, color: '#475569', marginBottom: '6px', display: 'block' }}>
                  Accommodation Preference
                </label>
                <select
                  value={accommodation}
                  onChange={(e) => setAccommodation(e.target.value)}
                  style={{
                    width: '100%',
                    padding: '12px 14px',
                    borderRadius: '12px',
                    border: '1.5px solid #CBD5E1',
                    fontSize: '0.92rem',
                    outline: 'none',
                    backgroundColor: '#FFF'
                  }}
                >
                  {ACCOMMODATION_PREFS.map(a => (
                    <option key={a} value={a}>{a}</option>
                  ))}
                </select>
              </div>
            </div>

          </div>
        )}

        {/* TAB 3: INTERESTS */}
        {activeTab === 'interests' && (
          <div>
            <div style={{ marginBottom: '14px' }}>
              <div style={{ fontWeight: 800, fontSize: '0.95rem', color: '#0F172A' }}>
                Select Your Travel Interests & Activities
              </div>
              <div style={{ fontSize: '0.8rem', color: '#64748B', marginTop: '2px' }}>
                Select multiple tags ({selectedInterests.length} selected). At least 1 required.
              </div>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '10px' }}>
              {ALL_INTERESTS.map(interest => {
                const isSelected = selectedInterests.includes(interest);
                return (
                  <button
                    key={interest}
                    type="button"
                    onClick={() => toggleInterest(interest)}
                    style={{
                      padding: '12px 10px',
                      borderRadius: '14px',
                      border: isSelected ? '2px solid #FF5E00' : '1px solid #CBD5E1',
                      backgroundColor: isSelected ? '#FFF4EC' : '#FFFFFF',
                      color: isSelected ? '#FF5E00' : '#475569',
                      fontWeight: 700,
                      fontSize: '0.85rem',
                      cursor: 'pointer',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      boxShadow: isSelected ? '0 4px 12px rgba(255, 94, 0, 0.15)' : 'none',
                      transition: 'all 0.2s ease'
                    }}
                  >
                    <span>{interest}</span>
                    {isSelected && <CheckCircle2 size={14} style={{ color: '#FF5E00' }} />}
                  </button>
                );
              })}
            </div>
          </div>
        )}

        {/* Actions Footer */}
        <div style={{ marginTop: '24px', paddingTop: '18px', borderTop: '1px solid #E2E8F0', display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '12px' }}>
          
          <button
            type="button"
            onClick={() => setShowDeleteConfirm(true)}
            style={{
              background: 'none',
              border: 'none',
              color: '#EF4444',
              fontWeight: 700,
              fontSize: '0.82rem',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '4px'
            }}
          >
            <Trash2 size={15} /> Delete Account
          </button>

          <div style={{ display: 'flex', gap: '10px' }}>
            <button
              type="button"
              onClick={onClose}
              className="btn-outline"
              disabled={loading}
              style={{ padding: '12px 18px', fontSize: '0.88rem' }}
            >
              Cancel
            </button>

            <button
              type="button"
              onClick={handleSave}
              disabled={loading || imageUploading || selectedInterests.length === 0}
              className="btn-primary"
              style={{
                padding: '12px 22px',
                fontSize: '0.88rem',
                opacity: (loading || imageUploading || selectedInterests.length === 0) ? 0.7 : 1,
                cursor: (loading || imageUploading || selectedInterests.length === 0) ? 'not-allowed' : 'pointer'
              }}
            >
              {loading ? (
                <>
                  <RefreshCw size={15} className="spin" /> Saving...
                </>
              ) : (
                'Save Profile & Changes'
              )}
            </button>
          </div>
        </div>

        {/* Delete Account Confirmation Sub-Modal */}
        {showDeleteConfirm && (
          <div className="modal-overlay" style={{ zIndex: 300 }}>
            <div className="modal-content" style={{ maxWidth: '420px', padding: '28px', textAlign: 'center' }}>
              <Trash2 size={48} style={{ color: '#EF4444', marginBottom: '12px' }} />
              <h3 style={{ fontSize: '1.3rem', fontWeight: 900, color: '#0F172A', marginBottom: '8px' }}>
                Delete Account Permanently?
              </h3>
              <p style={{ fontSize: '0.88rem', color: '#64748B', marginBottom: '20px' }}>
                This action will delete your companion profile, preferences, and matches. This cannot be undone.
              </p>
              
              <div style={{ display: 'flex', gap: '12px' }}>
                <button
                  onClick={() => setShowDeleteConfirm(false)}
                  className="btn-outline"
                  style={{ flex: 1, justifyContent: 'center' }}
                >
                  Cancel
                </button>
                <button
                  onClick={handleDeleteAccount}
                  style={{
                    flex: 1,
                    backgroundColor: '#EF4444',
                    color: '#FFFFFF',
                    border: 'none',
                    borderRadius: '14px',
                    fontWeight: 800,
                    cursor: 'pointer',
                    padding: '12px'
                  }}
                >
                  Yes, Delete
                </button>
              </div>
            </div>
          </div>
        )}

      </div>
    </div>
  );
}
