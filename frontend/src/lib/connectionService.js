import { supabase, isSupabaseConfigured } from './supabase';
import { calculateTravelCompatibility } from './compatibilityEngine';

/**
 * Sends a Travel Interest / Connect request from senderId to receiverId.
 * Checks for reciprocal interest to form a mutual match.
 */
export async function sendTravelInterest(senderUser, receiverProfile) {
  const senderId = senderUser?.id || senderUser?.user_id;
  const receiverId = receiverProfile?.id || receiverProfile?.user_id;

  if (!senderId || !receiverId) {
    throw new Error('Valid sender and receiver IDs are required.');
  }

  if (senderId === receiverId) {
    throw new Error('You cannot connect with your own profile.');
  }

  if (!isSupabaseConfigured()) {
    // Offline / Mock fallback mode
    const compScore = calculateTravelCompatibility(senderUser, receiverProfile);
    return {
      isMutualMatch: true,
      match: {
        id: `mock-match-${Date.now()}`,
        user_one_id: senderId,
        user_two_id: receiverId,
        compatibility_score: compScore,
        status: 'active'
      },
      receiverProfile
    };
  }

  // 1. Check if blocked by either party
  const { data: blockCheck, error: blockErr } = await supabase
    .from('blocks')
    .select('id')
    .or(`and(blocker_id.eq.${senderId},blocked_id.eq.${receiverId}),and(blocker_id.eq.${receiverId},blocked_id.eq.${senderId})`);

  if (blockErr && blockErr.code !== 'PGRST116') {
    console.error('Block check error:', blockErr);
  }

  if (blockCheck && blockCheck.length > 0) {
    throw new Error('Unable to connect with this companion.');
  }

  // 2. Check if sender already sent interest
  const { data: existingLike } = await supabase
    .from('likes')
    .select('*')
    .eq('sender_user_id', senderId)
    .eq('receiver_user_id', receiverId)
    .maybeSingle();

  if (existingLike && existingLike.status === 'accepted') {
    return {
      isMutualMatch: true,
      alreadyMatched: true,
      receiverProfile
    };
  }

  // 3. Check for reciprocal like (User B already liked User A)
  const { data: reciprocalLike } = await supabase
    .from('likes')
    .select('*')
    .eq('sender_user_id', receiverId)
    .eq('receiver_user_id', senderId)
    .maybeSingle();

  // Insert or update current like
  const { error: likeInsertErr } = await supabase
    .from('likes')
    .upsert({
      sender_user_id: senderId,
      receiver_user_id: receiverId,
      status: reciprocalLike ? 'accepted' : 'pending',
      created_at: new Date().toISOString()
    }, { onConflict: 'sender_user_id,receiver_user_id' });

  if (likeInsertErr) {
    throw likeInsertErr;
  }

  // Calculate compatibility percentage
  const compScore = calculateTravelCompatibility(senderUser, receiverProfile);

  // If reciprocal like exists -> Create Mutual Match Record!
  if (reciprocalLike) {
    // Update reciprocal like status to accepted
    await supabase
      .from('likes')
      .update({ status: 'accepted' })
      .eq('id', reciprocalLike.id);

    const userOne = senderId < receiverId ? senderId : receiverId;
    const userTwo = senderId < receiverId ? receiverId : senderId;

    // Create single match record
    const { data: matchData, error: matchErr } = await supabase
      .from('matches')
      .upsert({
        user_one_id: userOne,
        user_two_id: userTwo,
        compatibility_score: compScore,
        status: 'active',
        matched_at: new Date().toISOString()
      })
      .select()
      .maybeSingle();

    if (matchErr && !matchErr.message?.includes('duplicate')) {
      console.error('Match creation error:', matchErr);
    }

    // Send notifications to both users
    const notifications = [
      {
        user_id: senderId,
        sender_id: receiverId,
        type: 'match',
        title: "🎉 It's a Travel Match!",
        content: `You and ${receiverProfile.full_name || 'your companion'} have mutual travel compatibility! Start planning your trip.`,
        data: { companionId: receiverId, destination: receiverProfile.destination || 'Bali' }
      },
      {
        user_id: receiverId,
        sender_id: senderId,
        type: 'match',
        title: "🎉 It's a Travel Match!",
        content: `You and ${senderUser.full_name || 'your companion'} matched for an upcoming trip! Start chatting now.`,
        data: { companionId: senderId }
      }
    ];

    await supabase.from('notifications').insert(notifications);

    return {
      isMutualMatch: true,
      match: matchData || { user_one_id: userOne, user_two_id: userTwo, compatibility_score: compScore },
      compatibilityScore: compScore,
      receiverProfile
    };
  } else {
    // Single-sided like: Notify receiver
    const senderName = senderUser.full_name || 'A traveler';
    await createNotification({
      userId: receiverId,
      senderId,
      type: 'like',
      title: '✈️ Someone Showed Travel Interest!',
      content: `${senderName} expressed interest in connecting for an upcoming trip. View their profile to respond.`,
      data: { senderId }
    });

    return {
      isMutualMatch: false,
      compatibilityScore: compScore,
      receiverProfile
    };
  }
}

/**
 * Creates a notification record for a user.
 */
export async function createNotification({ userId, senderId = null, type = 'info', title, content, data = {} }) {
  if (!userId || !isSupabaseConfigured()) return;
  try {
    await supabase.from('notifications').insert({
      user_id: userId,
      sender_id: senderId,
      type,
      title,
      content,
      data,
      created_at: new Date().toISOString()
    });
  } catch (err) {
    console.error('Create notification error:', err);
  }
}

/**
 * Fetches unread & read notifications for a given user.
 */
export async function fetchUserNotifications(userId) {
  if (!userId || !isSupabaseConfigured()) return [];
  try {
    const { data, error } = await supabase
      .from('notifications')
      .select('*')
      .eq('user_id', userId)
      .order('created_at', { ascending: false })
      .limit(30);

    if (error) throw error;
    return data || [];
  } catch (err) {
    console.error('Fetch notifications error:', err);
    return [];
  }
}

/**
 * Marks a notification as read.
 */
export async function markNotificationAsRead(notificationId) {
  if (!notificationId || !isSupabaseConfigured()) return;
  try {
    await supabase
      .from('notifications')
      .update({ is_read: true })
      .eq('id', notificationId);
  } catch (err) {
    console.error('Mark read error:', err);
  }
}

/**
 * Marks all notifications for a user as read.
 */
export async function markAllNotificationsAsRead(userId) {
  if (!userId || !isSupabaseConfigured()) return;
  try {
    await supabase
      .from('notifications')
      .update({ is_read: true })
      .eq('user_id', userId);
  } catch (err) {
    console.error('Mark all read error:', err);
  }
}

/**
 * Blocks a user and disables connection records & matches.
 */
export async function blockUser(blockerId, blockedId) {
  if (!blockerId || !blockedId || !isSupabaseConfigured()) return;
  try {
    // 1. Insert block record
    await supabase.from('blocks').upsert({
      blocker_id: blockerId,
      blocked_id: blockedId,
      created_at: new Date().toISOString()
    }, { onConflict: 'blocker_id,blocked_id' });

    // 2. Disable matches
    const u1 = blockerId < blockedId ? blockerId : blockedId;
    const u2 = blockerId < blockedId ? blockedId : blockerId;
    await supabase
      .from('matches')
      .update({ status: 'blocked' })
      .eq('user_one_id', u1)
      .eq('user_two_id', u2);

    // 3. Disable likes
    await supabase
      .from('likes')
      .update({ status: 'ignored' })
      .or(`and(sender_user_id.eq.${blockerId},receiver_user_id.eq.${blockedId}),and(sender_user_id.eq.${blockedId},receiver_user_id.eq.${blockerId})`);

  } catch (err) {
    console.error('Block user error:', err);
  }
}

/**
 * Fetches all blocked user IDs for a user.
 */
export async function fetchBlockedUserIds(userId) {
  if (!userId || !isSupabaseConfigured()) return [];
  try {
    const { data, error } = await supabase
      .from('blocks')
      .select('blocker_id, blocked_id')
      .or(`blocker_id.eq.${userId},blocked_id.eq.${userId}`);

    if (error || !data) return [];
    
    const blocked = new Set();
    data.forEach(b => {
      if (b.blocker_id !== userId) blocked.add(b.blocker_id);
      if (b.blocked_id !== userId) blocked.add(b.blocked_id);
    });
    return Array.from(blocked);
  } catch (err) {
    console.error('Fetch blocked IDs error:', err);
    return [];
  }
}
