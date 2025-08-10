const { initializeApp } = require('firebase/app');
const { getFirestore, collection, addDoc, Timestamp } = require('firebase/firestore');

// Firebase configuration - replace with your actual config
const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

// Demo services data
const services = [
  {
    categoryId: 'healthcare',
    shelterId: 'oldbrew',
    name: 'Medical Check-up',
    description: 'General health assessment and basic medical care',
    provider: 'Dr. Sarah Johnson',
    location: 'Medical Room A',
    duration: 30,
    capacity: 4,
    cost: 0,
    requirements: ['Photo ID required', 'Fasting for 12 hours if blood work needed'],
    isActive: true,
    schedule: [
      { dayOfWeek: 1, startTime: '09:00', endTime: '17:00', breakTime: { start: '12:00', end: '13:00' } },
      { dayOfWeek: 2, startTime: '09:00', endTime: '17:00', breakTime: { start: '12:00', end: '13:00' } },
      { dayOfWeek: 3, startTime: '09:00', endTime: '17:00', breakTime: { start: '12:00', end: '13:00' } },
      { dayOfWeek: 4, startTime: '09:00', endTime: '17:00', breakTime: { start: '12:00', end: '13:00' } },
      { dayOfWeek: 5, startTime: '09:00', endTime: '17:00', breakTime: { start: '12:00', end: '13:00' } }
    ]
  },
  {
    categoryId: 'employment',
    shelterId: 'oldbrew',
    name: 'Job Interview Preparation',
    description: 'Practice interviews and resume review',
    provider: 'Career Counselor Mike',
    location: 'Career Center',
    duration: 60,
    capacity: 1,
    cost: 0,
    requirements: ['Bring current resume if available'],
    isActive: true,
    schedule: [
      { dayOfWeek: 1, startTime: '10:00', endTime: '16:00' },
      { dayOfWeek: 3, startTime: '10:00', endTime: '16:00' },
      { dayOfWeek: 5, startTime: '10:00', endTime: '16:00' }
    ]
  },
  {
    categoryId: 'legal',
    shelterId: 'oldbrew',
    name: 'Legal Aid Consultation',
    description: 'Free legal advice and assistance',
    provider: 'Legal Aid Society',
    location: 'Conference Room B',
    duration: 45,
    capacity: 1,
    cost: 0,
    requirements: ['Bring all relevant documents'],
    isActive: true,
    schedule: [
      { dayOfWeek: 2, startTime: '13:00', endTime: '17:00' },
      { dayOfWeek: 4, startTime: '13:00', endTime: '17:00' }
    ]
  },
  {
    categoryId: 'benefits',
    shelterId: 'oldbrew',
    name: 'Government Benefits Application',
    description: 'Assistance with applying for government benefits',
    provider: 'Social Worker Lisa',
    location: 'Benefits Office',
    duration: 30,
    capacity: 2,
    cost: 0,
    requirements: ['Birth certificate or ID', 'Social security card if available'],
    isActive: true,
    schedule: [
      { dayOfWeek: 1, startTime: '08:00', endTime: '12:00' },
      { dayOfWeek: 2, startTime: '08:00', endTime: '12:00' },
      { dayOfWeek: 3, startTime: '08:00', endTime: '12:00' },
      { dayOfWeek: 4, startTime: '08:00', endTime: '12:00' },
      { dayOfWeek: 5, startTime: '08:00', endTime: '12:00' }
    ]
  },
  {
    categoryId: 'counseling',
    shelterId: 'oldbrew',
    name: 'Mental Health Counseling',
    description: 'Individual counseling sessions',
    provider: 'Therapist Amanda',
    location: 'Counseling Room',
    duration: 60,
    capacity: 1,
    cost: 0,
    requirements: [],
    isActive: true,
    schedule: [
      { dayOfWeek: 1, startTime: '09:00', endTime: '17:00', breakTime: { start: '12:00', end: '13:00' } },
      { dayOfWeek: 2, startTime: '09:00', endTime: '17:00', breakTime: { start: '12:00', end: '13:00' } },
      { dayOfWeek: 3, startTime: '09:00', endTime: '17:00', breakTime: { start: '12:00', end: '13:00' } },
      { dayOfWeek: 4, startTime: '09:00', endTime: '17:00', breakTime: { start: '12:00', end: '13:00' } },
      { dayOfWeek: 5, startTime: '09:00', endTime: '17:00', breakTime: { start: '12:00', end: '13:00' } }
    ]
  },
  {
    categoryId: 'shower',
    shelterId: 'oldbrew',
    name: 'Shower & Personal Care',
    description: 'Private shower facilities with towels and basic toiletries',
    provider: 'Facility Staff',
    location: 'Shower Facilities',
    duration: 30,
    capacity: 4,
    cost: 0,
    requirements: [],
    isActive: true,
    schedule: [
      { dayOfWeek: 0, startTime: '06:00', endTime: '22:00' },
      { dayOfWeek: 1, startTime: '06:00', endTime: '22:00' },
      { dayOfWeek: 2, startTime: '06:00', endTime: '22:00' },
      { dayOfWeek: 3, startTime: '06:00', endTime: '22:00' },
      { dayOfWeek: 4, startTime: '06:00', endTime: '22:00' },
      { dayOfWeek: 5, startTime: '06:00', endTime: '22:00' },
      { dayOfWeek: 6, startTime: '06:00', endTime: '22:00' }
    ]
  },
  {
    categoryId: 'meals',
    shelterId: 'oldbrew',
    name: 'Hot Meal Service',
    description: 'Nutritious hot meals served daily',
    provider: 'Kitchen Staff',
    location: 'Dining Hall',
    duration: 30,
    capacity: 50,
    cost: 0,
    requirements: [],
    isActive: true,
    schedule: [
      { dayOfWeek: 0, startTime: '07:00', endTime: '09:00' }, // Breakfast Sunday
      { dayOfWeek: 0, startTime: '12:00', endTime: '14:00' }, // Lunch Sunday
      { dayOfWeek: 0, startTime: '17:00', endTime: '19:00' }, // Dinner Sunday
      { dayOfWeek: 1, startTime: '07:00', endTime: '09:00' }, // Breakfast Monday
      { dayOfWeek: 1, startTime: '12:00', endTime: '14:00' }, // Lunch Monday
      { dayOfWeek: 1, startTime: '17:00', endTime: '19:00' }, // Dinner Monday
      { dayOfWeek: 2, startTime: '07:00', endTime: '09:00' }, // Breakfast Tuesday
      { dayOfWeek: 2, startTime: '12:00', endTime: '14:00' }, // Lunch Tuesday
      { dayOfWeek: 2, startTime: '17:00', endTime: '19:00' }, // Dinner Tuesday
      { dayOfWeek: 3, startTime: '07:00', endTime: '09:00' }, // Breakfast Wednesday
      { dayOfWeek: 3, startTime: '12:00', endTime: '14:00' }, // Lunch Wednesday
      { dayOfWeek: 3, startTime: '17:00', endTime: '19:00' }, // Dinner Wednesday
      { dayOfWeek: 4, startTime: '07:00', endTime: '09:00' }, // Breakfast Thursday
      { dayOfWeek: 4, startTime: '12:00', endTime: '14:00' }, // Lunch Thursday
      { dayOfWeek: 4, startTime: '17:00', endTime: '19:00' }, // Dinner Thursday
      { dayOfWeek: 5, startTime: '07:00', endTime: '09:00' }, // Breakfast Friday
      { dayOfWeek: 5, startTime: '12:00', endTime: '14:00' }, // Lunch Friday
      { dayOfWeek: 5, startTime: '17:00', endTime: '19:00' }, // Dinner Friday
      { dayOfWeek: 6, startTime: '07:00', endTime: '09:00' }, // Breakfast Saturday
      { dayOfWeek: 6, startTime: '12:00', endTime: '14:00' }, // Lunch Saturday
      { dayOfWeek: 6, startTime: '17:00', endTime: '19:00' }  // Dinner Saturday
    ]
  }
];

async function populateServices() {
  console.log('🔄 Starting to populate services...');
  
  try {
    for (const service of services) {
      const docRef = await addDoc(collection(db, 'services'), {
        ...service,
        createdAt: Timestamp.now(),
        updatedAt: Timestamp.now()
      });
      console.log(`✅ Added service: ${service.name} (ID: ${docRef.id})`);
    }
    
    console.log(`🎉 Successfully added ${services.length} services!`);
  } catch (error) {
    console.error('❌ Error adding services:', error);
  }
}

// Run the script
populateServices().then(() => {
  console.log('✅ Service population complete!');
  process.exit(0);
}).catch((error) => {
  console.error('❌ Script failed:', error);
  process.exit(1);
});
