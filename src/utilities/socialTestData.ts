// Sample test data for social system testing
import { addDoc, collection, serverTimestamp } from 'firebase/firestore';
import { db } from '../firebase';

export const createTestCrewProfiles = async () => {
  const testProfiles = [
    {
      name: 'Sarah Johnson',
      bio: 'Experienced cinematographer with 10+ years in the industry. Specialized in documentary and commercial work.',
      jobTitles: [{ title: 'Cinematographer', department: 'Camera' }],
      residences: [{ country: 'USA', city: 'Los Angeles' }],
      isPublished: true,
      availability: 'available' as const,
      languages: ['English', 'Spanish'],
      createdAt: serverTimestamp()
    },
    {
      name: 'Michael Chen',
      bio: 'Sound designer and audio engineer. Passionate about creating immersive audio experiences.',
      jobTitles: [{ title: 'Sound Designer', department: 'Sound' }],
      residences: [{ country: 'Canada', city: 'Toronto' }],
      isPublished: true,
      availability: 'available' as const,
      languages: ['English', 'Mandarin'],
      createdAt: serverTimestamp()
    },
    {
      name: 'Emma Rodriguez',
      bio: 'Production designer with a background in art direction. Love creating unique visual worlds.',
      jobTitles: [{ title: 'Production Designer', department: 'Art' }],
      residences: [{ country: 'Spain', city: 'Madrid' }],
      isPublished: true,
      availability: 'soon' as const,
      languages: ['English', 'Spanish', 'French'],
      createdAt: serverTimestamp()
    },
    {
      name: 'David Kim',
      bio: 'Film editor specializing in narrative features and documentaries. Always looking for compelling stories.',
      jobTitles: [{ title: 'Film Editor', department: 'Post-Production' }],
      residences: [{ country: 'South Korea', city: 'Seoul' }],
      isPublished: true,
      availability: 'available' as const,
      languages: ['English', 'Korean'],
      createdAt: serverTimestamp()
    }
  ];

  try {
    console.log('Creating test crew profiles...');
    for (const profile of testProfiles) {
      await addDoc(collection(db, 'crewProfiles'), profile);
    }
    console.log('✅ Test crew profiles created successfully!');
  } catch (error) {
    console.error('❌ Error creating test profiles:', error);
  }
};

export const createTestActivityFeed = async () => {
  const testActivities = [
    {
      userId: 'test-user-1',
      type: 'project_created' as const,
      title: 'New Project Created',
      description: 'Sarah Johnson created a new documentary project',
      relatedProjectId: 'test-project-1',
      likes: 5,
      comments: 2,
      createdAt: serverTimestamp(),
      isPublic: true
    },
    {
      userId: 'test-user-2',
      type: 'profile_updated' as const,
      title: 'Profile Updated',
      description: 'Michael Chen updated their profile with new projects',
      relatedUserId: 'test-user-2',
      likes: 3,
      comments: 1,
      createdAt: serverTimestamp(),
      isPublic: true
    },
    {
      userId: 'test-user-3',
      type: 'follow_made' as const,
      title: 'New Connection',
      description: 'Emma Rodriguez gained a new follower',
      relatedUserId: 'test-user-4',
      likes: 8,
      comments: 3,
      createdAt: serverTimestamp(),
      isPublic: true
    }
  ];

  try {
    console.log('Creating test activity feed...');
    for (const activity of testActivities) {
      await addDoc(collection(db, 'activityFeed'), activity);
    }
    console.log('✅ Test activity feed created successfully!');
  } catch (error) {
    console.error('❌ Error creating test activity feed:', error);
  }
};

export const runSocialSystemTest = async () => {
  console.log('🧪 Running social system test...');
  
  try {
    await createTestCrewProfiles();
    await createTestActivityFeed();
    
    console.log('🎉 Social system test completed!');
    console.log('📝 You can now test the follow system with these sample profiles.');
  } catch (error) {
    console.error('❌ Social system test failed:', error);
  }
};

export default runSocialSystemTest; 