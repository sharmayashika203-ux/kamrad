// Profile Utility Helper Functions

export const ALL_INTERESTS = [
  'Hiking', 'Trekking', 'Beach', 'Adventure', 'Food', 
  'Photography', 'Culture', 'History', 'Shopping', 'Nightlife', 
  'Nature', 'Camping', 'Road Trip', 'Backpacking', 'Luxury', 
  'Wellness', 'Wildlife', 'Scuba Diving', 'Skiing', 'Festivals', 'Local Experiences'
];

export const TRAVEL_STYLES = [
  'Relaxed', 'Adventure', 'Backpacker', 'Luxury', 
  'Cultural', 'Food-focused', 'Nature', 'Photography', 'Digital Nomad'
];

export const BUDGET_LEVELS = [
  { value: 'budget', label: 'Budget Backpacker (Hostel / Shared)' },
  { value: 'moderate', label: 'Moderate (50/50 Hotel Split)' },
  { value: 'luxury', label: 'Luxury (Boutique Hotels & Villas)' },
  { value: 'flexible', label: 'Flexible / Open to Offers' }
];

export const ACCOMMODATION_PREFS = [
  'Hostel', 'Hotel', 'Resort', 'Homestay', 'Camping', 'Any'
];

export const TRANSPORT_PREFS = [
  'Flight', 'Train', 'Car', 'Bus', 'Any'
];

// Sanitize user text inputs
export function sanitizeInput(text) {
  if (!text) return '';
  return text.toString().replace(/<[^>]*>?/gm, '').trim();
}

// Validate profile photo file
export function validateProfileImage(file) {
  if (!file) return { valid: false, error: 'No file selected.' };
  
  const validTypes = ['image/jpeg', 'image/png', 'image/webp', 'image/gif'];
  if (!validTypes.includes(file.type)) {
    return { valid: false, error: 'Invalid file format. Please upload JPG, PNG, or WEBP images.' };
  }
  
  const maxSizeInBytes = 5 * 1024 * 1024; // 5MB
  if (file.size > maxSizeInBytes) {
    return { valid: false, error: 'File size too large. Maximum allowed size is 5MB.' };
  }
  
  return { valid: true, error: null };
}

// Calculate age from date of birth
export function calculateAge(dobString) {
  if (!dobString) return null;
  const dob = new Date(dobString);
  if (isNaN(dob.getTime())) return null;
  const today = new Date();
  let age = today.getFullYear() - dob.getFullYear();
  const monthDiff = today.getMonth() - dob.getMonth();
  if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < dob.getDate())) {
    age--;
  }
  return age;
}

// Calculate profile completion percentage
export function calculateProfileCompletion(profile, travelPrefs = {}, userInterests = []) {
  let score = 0;
  
  if (profile?.full_name && profile.full_name.trim().length > 1) score += 15;
  if (profile?.profile_photo && profile.profile_photo.trim().length > 5) score += 15;
  if (profile?.age || profile?.date_of_birth) score += 10;
  if (profile?.city?.trim() && profile?.country?.trim()) score += 15;
  if (profile?.bio && profile.bio.trim().length >= 10) score += 15;
  if (travelPrefs?.travel_style || (travelPrefs?.preferred_destinations && travelPrefs.preferred_destinations.length > 0)) score += 15;
  if (userInterests && userInterests.length >= 1) score += 15;
  
  return Math.min(100, score);
}
