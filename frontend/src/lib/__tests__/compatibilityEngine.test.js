import { describe, it, expect } from 'vitest';
import {
  calculateInterestCompatibility,
  calculateDestinationCompatibility,
  calculateDateCompatibility,
  calculateTravelCompatibility,
  filterCandidatesByGender,
  rankTravelCompanions,
  COMPATIBILITY_WEIGHTS
} from '../compatibilityEngine';


describe('KadamFind Travel Compatibility Engine', () => {

  it('should use centralized configurable weights totaling 100%', () => {
    const totalWeight = Object.values(COMPATIBILITY_WEIGHTS).reduce((sum, w) => sum + w, 0);
    expect(totalWeight).toBeCloseTo(1.0, 5);
  });

  describe('Interest Compatibility (Set Intersection)', () => {
    it('calculates 100% interest match for identical interest sets', () => {
      const interests = ['Hiking', 'Photography', 'Food', 'Camping'];
      const score = calculateInterestCompatibility(interests, interests);
      expect(score).toBe(1.0);
    });

    it('calculates partial score based on common set intersection', () => {
      const userA = ['Hiking', 'Photography', 'Food', 'Camping'];
      const userB = ['Hiking', 'Photography', 'Food', 'Shopping'];
      // 3 common / 4 total max = 0.75
      const score = calculateInterestCompatibility(userA, userB);
      expect(score).toBe(0.75);
    });

    it('returns 0 for no common interests', () => {
      const userA = ['Hiking', 'Trekking'];
      const userB = ['Shopping', 'Nightlife'];
      const score = calculateInterestCompatibility(userA, userB);
      expect(score).toBe(0);
    });
  });

  describe('Destination Compatibility', () => {
    it('returns 1.0 for same destination', () => {
      const score = calculateDestinationCompatibility('Bali, Indonesia', 'Bali, Indonesia');
      expect(score).toBe(1.0);
    });

    it('returns 0.75 for overlapping preferred destinations', () => {
      const score = calculateDestinationCompatibility(
        'Tokyo, Japan',
        'Paris, France',
        ['Bali, Indonesia', 'Santorini'],
        ['Bali, Indonesia', 'Swiss Alps']
      );
      expect(score).toBe(0.75);
    });

    it('returns 0.0 for completely different destinations', () => {
      const score = calculateDestinationCompatibility(
        'Tokyo, Japan',
        'Reykjavik, Iceland',
        ['Kyoto'],
        ['Paris']
      );
      expect(score).toBe(0.0);
    });
  });

  describe('Date Compatibility', () => {
    it('returns 1.0 for identical travel dates', () => {
      const score = calculateDateCompatibility('Oct 15 - Oct 28', 'Oct 15 - Oct 28', false, false);
      expect(score).toBe(1.0);
    });

    it('returns 0.75 for flexible travel dates', () => {
      const score = calculateDateCompatibility('Oct 15 - Oct 28', 'Nov 01 - Nov 15', true, false);
      expect(score).toBe(0.75);
    });
  });

  describe('Gender Policy & Filtering', () => {
    it('NEVER alters compatibility score based on gender', () => {
      const userA = {
        destination: 'Bali, Indonesia',
        interests: ['Hiking', 'Food'],
        gender: 'Male'
      };
      const maleCompanion = {
        destination: 'Bali, Indonesia',
        interests: ['Hiking', 'Food'],
        gender: 'Male'
      };
      const femaleCompanion = {
        destination: 'Bali, Indonesia',
        interests: ['Hiking', 'Food'],
        gender: 'Female'
      };

      const scoreMale = calculateTravelCompatibility(userA, maleCompanion);
      const scoreFemale = calculateTravelCompatibility(userA, femaleCompanion);

      expect(scoreMale).toBe(scoreFemale);
    });

    it('filters result set by gender preference without modifying scores', () => {
      const candidates = [
        { id: '1', name: 'Sophia', gender: 'Female' },
        { id: '2', name: 'Liam', gender: 'Male' },
        { id: '3', name: 'Aria', gender: 'Female' }
      ];

      const femaleOnly = filterCandidatesByGender(candidates, 'Female Only');
      expect(femaleOnly).toHaveLength(2);
      expect(femaleOnly.map(c => c.name)).toEqual(['Sophia', 'Aria']);

      const anyGender = filterCandidatesByGender(candidates, 'Any Gender');
      expect(anyGender).toHaveLength(3);
    });
  });

  describe('Exclusions & Ranking Controls', () => {
    const currentUser = {
      id: 'user-me',
      destination: 'Bali, Indonesia',
      interests: ['Hiking', 'Photography', 'Food'],
      travelStyle: 'Adventure'
    };

    const candidates = [
      {
        id: 'user-me', // Self
        name: 'My Profile',
        destination: 'Bali, Indonesia',
        interests: ['Hiking', 'Photography', 'Food'],
        gender: 'Male'
      },
      {
        id: 'user-blocked', // Blocked
        name: 'Blocked Person',
        destination: 'Bali, Indonesia',
        interests: ['Hiking', 'Photography', 'Food'],
        gender: 'Female'
      },
      {
        id: 'user-incomplete', // Incomplete (< 60%)
        name: 'Incomplete User',
        destination: 'Bali, Indonesia',
        completionScore: 40,
        interests: ['Hiking'],
        gender: 'Female'
      },
      {
        id: 'user-valid-1', // High match (Same destination & interests)
        name: 'Sophia',
        destination: 'Bali, Indonesia',
        completionScore: 90,
        interests: ['Hiking', 'Photography', 'Food'],
        gender: 'Female'
      },
      {
        id: 'user-valid-2', // Moderate match (Different destination)
        name: 'Diego',
        destination: 'Tokyo, Japan',
        completionScore: 85,
        interests: ['Food'],
        gender: 'Male'
      }
    ];

    it('prevents self-matching, excludes blocked users & incomplete profiles, and sorts descending by score', () => {
      const results = rankTravelCompanions(currentUser, candidates, {
        blockedUserIds: ['user-blocked'],
        genderPref: 'Any Gender',
        targetDestination: 'Bali, Indonesia'
      });

      // Should exclude self ('user-me'), blocked ('user-blocked'), and incomplete ('user-incomplete')
      expect(results).toHaveLength(2);
      expect(results[0].id).toBe('user-valid-1');
      expect(results[1].id).toBe('user-valid-2');
      expect(results[0].compatibilityPercent).toBeGreaterThan(results[1].compatibilityPercent);
    });

    it('prevents duplicate profiles in result list', () => {
      const duplicates = [
        { id: 'user-valid-1', name: 'Sophia', destination: 'Bali, Indonesia', completionScore: 90 },
        { id: 'user-valid-1', name: 'Sophia Duplicate', destination: 'Bali, Indonesia', completionScore: 90 }
      ];

      const results = rankTravelCompanions(currentUser, duplicates, { genderPref: 'Any Gender' });
      expect(results).toHaveLength(1);
    });
  });

});
