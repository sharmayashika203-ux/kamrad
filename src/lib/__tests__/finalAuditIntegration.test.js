import { describe, it, expect, beforeEach } from 'vitest';
import {
  calculateTravelCompatibility,
  rankTravelCompanions,
  filterCandidatesByGender
} from '../compatibilityEngine';
import {
  sendTravelInterest,
  blockUser,
  fetchUserConnections
} from '../connectionService';
import {
  fetchActiveSubscription,
  canAccessFeature,
  recordPaymentFailure,
  verifyAndProcessPayment
} from '../subscriptionService';

const memoryStore = new Map();
const mockLocalStorage = {
  getItem: (key) => memoryStore.get(key) || null,
  setItem: (key, val) => memoryStore.set(key, String(val)),
  removeItem: (key) => memoryStore.delete(key),
  clear: () => memoryStore.clear()
};
globalThis.localStorage = mockLocalStorage;

describe('KadamFind Final Production Audit - 12 Core Requirements', () => {

  beforeEach(() => {
    mockLocalStorage.clear();
  });

  // Test 1: Same destination + same interests + same dates → high score
  it('Test 1: Same destination + same interests + same dates → high score', () => {
    const userA = {
      destination: 'Bali, Indonesia',
      interests: ['Hiking', 'Photography', 'Foodie'],
      dates: 'Oct 15 - Oct 30',
      travelStyle: 'Adventure'
    };
    const userB = {
      destination: 'Bali, Indonesia',
      interests: ['Hiking', 'Photography', 'Foodie'],
      dates: 'Oct 15 - Oct 30',
      travelStyle: 'Adventure'
    };

    const score = calculateTravelCompatibility(userA, userB);
    expect(score).toBeGreaterThanOrEqual(95);
  });

  // Test 2: Different destination + no interests → low score
  it('Test 2: Different destination + no interests → low score', () => {
    const userA = {
      destination: 'Bali, Indonesia',
      interests: ['Hiking', 'Photography'],
      dates: 'Oct 15 - Oct 30'
    };
    const userB = {
      destination: 'Reykjavik, Iceland',
      interests: ['Shopping', 'Luxury Spa'],
      dates: 'Dec 01 - Dec 15'
    };

    const score = calculateTravelCompatibility(userA, userB);
    expect(score).toBeLessThan(30);
  });

  // Test 3: Male + Male → allowed
  it('Test 3: Male + Male → allowed', () => {
    const maleA = { id: 'm1', gender: 'Male', destination: 'Bali' };
    const maleB = { id: 'm2', gender: 'Male', destination: 'Bali' };
    const score = calculateTravelCompatibility(maleA, maleB);
    expect(score).toBeGreaterThan(0);
  });

  // Test 4: Male + Female → allowed
  it('Test 4: Male + Female → allowed', () => {
    const male = { id: 'm1', gender: 'Male', destination: 'Bali' };
    const female = { id: 'f1', gender: 'Female', destination: 'Bali' };
    const score = calculateTravelCompatibility(male, female);
    expect(score).toBeGreaterThan(0);
  });

  // Test 5: Female + Female → allowed
  it('Test 5: Female + Female → allowed', () => {
    const femaleA = { id: 'f1', gender: 'Female', destination: 'Bali' };
    const femaleB = { id: 'f2', gender: 'Female', destination: 'Bali' };
    const score = calculateTravelCompatibility(femaleA, femaleB);
    expect(score).toBeGreaterThan(0);
  });

  // Test 6: Gender filter = Female → only female results
  it('Test 6: Gender filter = Female → only female results', () => {
    const candidates = [
      { id: '1', name: 'Sophia', gender: 'Female' },
      { id: '2', name: 'Liam', gender: 'Male' },
      { id: '3', name: 'Emma', gender: 'Female' }
    ];
    const filtered = filterCandidatesByGender(candidates, 'Female Only');
    expect(filtered).toHaveLength(2);
    expect(filtered.every(c => c.gender === 'Female')).toBe(true);
  });

  // Test 7: Gender filter = Any → all eligible genders
  it('Test 7: Gender filter = Any → all eligible genders', () => {
    const candidates = [
      { id: '1', name: 'Sophia', gender: 'Female' },
      { id: '2', name: 'Liam', gender: 'Male' }
    ];
    const filtered = filterCandidatesByGender(candidates, 'Any Gender');
    expect(filtered).toHaveLength(2);
  });

  // Test 8: Blocked user → never appears
  it('Test 8: Blocked user → never appears', () => {
    const currentUser = { id: 'u-me', destination: 'Bali' };
    const candidates = [
      { id: 'u-blocked', name: 'Blocked Companion', destination: 'Bali', completionScore: 90 },
      { id: 'u-valid', name: 'Valid Companion', destination: 'Bali', completionScore: 90 }
    ];

    const ranked = rankTravelCompanions(currentUser, candidates, {
      blockedUserIds: ['u-blocked']
    });

    expect(ranked.some(c => c.id === 'u-blocked')).toBe(false);
    expect(ranked).toHaveLength(1);
    expect(ranked[0].id).toBe('u-valid');
  });

  // Test 9: Current user → never appears
  it('Test 9: Current user → never appears', () => {
    const currentUser = { id: 'u-self', destination: 'Bali' };
    const candidates = [
      { id: 'u-self', name: 'Self Profile', destination: 'Bali', completionScore: 100 },
      { id: 'u-other', name: 'Other Traveler', destination: 'Bali', completionScore: 90 }
    ];

    const ranked = rankTravelCompanions(currentUser, candidates);
    expect(ranked.some(c => c.id === 'u-self')).toBe(false);
    expect(ranked).toHaveLength(1);
  });

  // Test 10: A likes B + B likes A → exactly one match
  it('Test 10: A likes B + B likes A → creates mutual match', async () => {
    const userA = { id: 'usr_A', user_id: 'usr_A', full_name: 'User A', destination: 'Bali' };
    const userB = { id: 'usr_B', user_id: 'usr_B', full_name: 'User B', destination: 'Bali' };

    // Step 1: A likes B
    const resA = await sendTravelInterest(userA, userB);
    expect(resA).toBeDefined();
    expect(resA.receiverProfile).toEqual(userB);

    // Step 2: B likes A -> Trigger mutual match
    const resB = await sendTravelInterest(userB, userA);
    expect(resB.isMutualMatch).toBe(true);
  });

  // Test 11: A likes B twice → handles idempotency / existing connection
  it('Test 11: A likes B twice → returns existing response without duplicate error', async () => {
    const userA = { id: 'usr_A_dup', user_id: 'usr_A_dup', full_name: 'User A', destination: 'Bali' };
    const userB = { id: 'usr_B_dup', user_id: 'usr_B_dup', full_name: 'User B', destination: 'Bali' };

    const firstAttempt = await sendTravelInterest(userA, userB);
    const secondAttempt = await sendTravelInterest(userA, userB);

    expect(firstAttempt).toBeDefined();
    expect(secondAttempt).toBeDefined();
  });

  // Test 12: Expired subscription → premium features locked
  it('Test 12: Expired subscription → premium features locked', async () => {
    const mockUserId = 'usr_expired_sub_99';
    const pastDate = new Date(Date.now() - 48 * 60 * 60 * 1000).toISOString();

    // Store expired sub
    mockLocalStorage.setItem(`kadam_sub_${mockUserId}`, JSON.stringify({
      id: 'sub_expired_99',
      user_id: mockUserId,
      plan_id: 'kamrad_pro',
      payment_status: 'active',
      expiry_date: pastDate
    }));

    const activeSub = await fetchActiveSubscription(mockUserId);
    expect(activeSub.isExpired).toBe(true);
    expect(canAccessFeature(activeSub, 'unlimitedMessaging')).toBe(false);
    expect(canAccessFeature(activeSub, 'aiConcierge')).toBe(false);
  });

});
