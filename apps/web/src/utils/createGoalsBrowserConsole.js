/**
 * Browser Console Script to Create Real Goals for Michael Rodriguez
 * 
 * Usage: 
 * 1. Open browser console at http://localhost:3000/dashboard/participant/profile
 * 2. Copy and paste this entire script
 * 3. Run: await createMichaelGoals()
 */

async function createMichaelGoals() {
  console.log('🎯 Creating realistic goals for Michael Rodriguez...');
  
  // Import Firebase functions from the already loaded app
  const { collection, doc, setDoc, getDocs, query, where } = window.firebase.firestore;
  const { db } = window.firebase;
  
  if (!db) {
    console.error('❌ Firebase not initialized. Make sure you\'re on the SHELTR dashboard page.');
    return;
  }
  
  const participantId = 'michael-rodriguez';
  
  // Calculate target dates
  const now = new Date();
  const addDays = (days) => {
    const date = new Date(now);
    date.setDate(date.getDate() + days);
    return date.toISOString().split('T')[0]; // YYYY-MM-DD format
  };

  try {
    // Check if goals already exist
    const existingGoalsQuery = query(
      collection(db, 'participant_goals'),
      where('participantId', '==', participantId)
    );
    const existingGoals = await getDocs(existingGoalsQuery);
    
    if (!existingGoals.empty) {
      console.log('🔄 Goals already exist for Michael. Deleting old goals first...');
      for (const doc of existingGoals.docs) {
        await deleteDoc(doc.ref);
      }
    }

    // Goal 1: Housing - Most critical for homeless participants
    await setDoc(doc(db, 'participant_goals', 'goal_housing_michael'), {
      id: 'goal_housing_michael',
      participantId: participantId,
      title: 'Find Stable Housing',
      description: 'Secure permanent housing within the next 6 months through Old Brewery Mission housing program',
      category: 'Housing',
      targetDate: addDays(180), // 6 months
      createdDate: new Date().toISOString(),
      progress: 45, // Already made some progress
      status: 'active',
      priority: 'critical',
      assignedCaseWorker: 'Sarah Johnson',
      relatedServices: ['housing-assistance', 'case-management'],
      notes: 'Currently on waiting list for subsidized housing. Working with case manager on application process.',
      milestones: [
        {
          id: 'milestone_housing_1',
          title: 'Complete Housing Application',
          description: 'Submit application for subsidized housing program',
          targetDate: addDays(30),
          completed: true,
          completedDate: new Date(Date.now() - 15 * 24 * 60 * 60 * 1000).toISOString()
        },
        {
          id: 'milestone_housing_2',
          title: 'Save for Security Deposit',
          description: 'Accumulate $800 for first month rent and security deposit',
          targetDate: addDays(120),
          completed: false
        }
      ]
    });

    // Goal 2: Employment - Building financial stability
    await setDoc(doc(db, 'participant_goals', 'goal_employment_michael'), {
      id: 'goal_employment_michael',
      participantId: participantId,
      title: 'Complete Culinary Arts Certification',
      description: 'Finish culinary arts training program and secure employment in food service industry',
      category: 'Employment',
      targetDate: addDays(90), // 3 months
      createdDate: new Date().toISOString(),
      progress: 75, // Almost complete
      status: 'active',
      priority: 'high',
      assignedCaseWorker: 'Sarah Johnson',
      relatedServices: ['job-training', 'employment-support'],
      notes: 'Enrolled in 16-week culinary program. Currently in final practicum phase.',
      milestones: [
        {
          id: 'milestone_employment_1',
          title: 'Complete Classroom Training',
          description: 'Finish theoretical portion of culinary arts program',
          targetDate: addDays(30),
          completed: true,
          completedDate: new Date(Date.now() - 10 * 24 * 60 * 60 * 1000).toISOString()
        },
        {
          id: 'milestone_employment_2',
          title: 'Complete Kitchen Practicum',
          description: 'Finish hands-on training in professional kitchen',
          targetDate: addDays(45),
          completed: false
        }
      ]
    });

    // Goal 3: Financial - Emergency fund
    await setDoc(doc(db, 'participant_goals', 'goal_financial_michael'), {
      id: 'goal_financial_michael',
      participantId: participantId,
      title: 'Build Emergency Savings',
      description: 'Save $1,000 for emergency fund and housing security deposit',
      category: 'Financial',
      targetDate: addDays(120), // 4 months
      createdDate: new Date().toISOString(),
      progress: 30, // $300 saved so far
      status: 'active',
      priority: 'medium',
      assignedCaseWorker: 'Sarah Johnson',
      relatedServices: ['financial-counseling'],
      notes: 'Currently saving $75/week from part-time work. On track to meet goal.',
      milestones: [
        {
          id: 'milestone_financial_1',
          title: 'Open Bank Account',
          description: 'Establish banking relationship with local credit union',
          targetDate: addDays(15),
          completed: true,
          completedDate: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString()
        },
        {
          id: 'milestone_financial_2',
          title: 'Save First $500',
          description: 'Reach halfway point of emergency fund goal',
          targetDate: addDays(60),
          completed: false
        }
      ]
    });

    // Goal 4: Health - Address medical needs
    await setDoc(doc(db, 'participant_goals', 'goal_health_michael'), {
      id: 'goal_health_michael',
      participantId: participantId,
      title: 'Establish Regular Healthcare',
      description: 'Address immediate health needs and establish ongoing medical care',
      category: 'Health',
      targetDate: addDays(60), // 2 months
      createdDate: new Date().toISOString(),
      progress: 60, // Good progress on health
      status: 'active',
      priority: 'high',
      assignedCaseWorker: 'Sarah Johnson',
      relatedServices: ['healthcare', 'mental-health'],
      notes: 'Working with clinic social worker to establish comprehensive care plan.',
      milestones: [
        {
          id: 'milestone_health_1',
          title: 'Complete Health Assessment',
          description: 'Full medical evaluation at community health center',
          targetDate: addDays(20),
          completed: true,
          completedDate: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString()
        },
        {
          id: 'milestone_health_2',
          title: 'Establish Primary Care',
          description: 'Schedule follow-up with assigned primary care doctor',
          targetDate: addDays(45),
          completed: false
        }
      ]
    });

    console.log('✅ Successfully created 4 realistic goals for Michael Rodriguez!');
    console.log('📊 Goals include: Housing (45%), Employment (75%), Financial (30%), Health (60%)');
    console.log('🎯 Each goal has relevant milestones and progress tracking');
    console.log('🔄 Refresh the page to see the new goals in the dashboard');
    
    return {
      message: 'Goals created successfully!',
      goalCount: 4,
      participantId: participantId
    };

  } catch (error) {
    console.error('❌ Error creating Michael\'s goals:', error);
    throw error;
  }
}

// Make function available globally
window.createMichaelGoals = createMichaelGoals;

console.log('✅ Goal creation script loaded!');
console.log('🎯 Run: await createMichaelGoals() to create realistic goals for Michael Rodriguez');
