import { describe, it, expect } from 'vitest';
import { sendTravelInterest } from '../connectionService';
import { calculateTravelCompatibility } from '../compatibilityEngine';


describe('Real Connection & Matching System', () => {

  const userA = {
    id: 'user-a-uuid',
    user_id: 'user-a-uuid',
    full_name: 'Alex Morgan',
    destination: 'Bali, Indonesia',
    interests: ['Hiking', 'Food', 'Photography'],
    travelStyle: 'Adventure'
  };

  const userB = {
    id: 'user-b-uuid',
    user_id: 'user-b-uuid',
    full_name: 'Sophia Chen',
    destination: 'Bali, Indonesia',
    interests: ['Hiking', 'Food', 'Beach'],
    travelStyle: 'Adventure'
  };

  it('calculates travel compatibility between user A and user B accurately', () => {
    const score = calculateTravelCompatibility(userA, userB);
    expect(score).toBeGreaterThanOrEqual(70);
  });

  it('prevents user A from liking themselves', async () => {
    await expect(sendTravelInterest(userA, userA)).rejects.toThrow('You cannot connect with your own profile.');
  });

  it('handles single-sided interest without throwing errors in mock/offline mode', async () => {
    const result = await sendTravelInterest(userA, userB);
    expect(result).toBeDefined();
    expect(result.receiverProfile).toEqual(userB);
  });

});
