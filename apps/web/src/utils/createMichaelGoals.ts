/**
 * Create realistic goals for Michael Rodriguez demo participant
 * Run this from browser console to populate real goal data
 */

import { goalsService } from '@/services/goalsService';

export async function createMichaelGoals() {
  console.log('🎯 Creating realistic goals for Michael Rodriguez...');
  
  const participantId = 'michael-rodriguez';
  
  // Calculate target dates
  const now = new Date();
  const addDays = (days: number) => {
    const date = new Date(now);
    date.setDate(date.getDate() + days);
    return date.toISOString().split('T')[0]; // YYYY-MM-DD format
  };

  try {
    // Goal 1: Housing - Most critical for homeless participants
    const housingGoalId = await goalsService.createGoal(participantId, {
      title: 'Find Stable Housing',
      description: 'Secure permanent housing within the next 6 months through Old Brewery Mission housing program',
      category: 'Housing',
      targetDate: addDays(180), // 6 months
      progress: 45, // Already made some progress
      status: 'active',
      priority: 'critical',
      assignedCaseWorker: 'Sarah Johnson',
      relatedServices: ['housing-assistance', 'case-management'],
      notes: 'Currently on waiting list for subsidized housing. Working with case manager on application process.'
    });

    // Add milestones to housing goal
    await goalsService.addMilestone(housingGoalId, {
      title: 'Complete Housing Application',
      description: 'Submit application for subsidized housing program',
      targetDate: addDays(30),
      completed: true,
      completedDate: new Date(Date.now() - 15 * 24 * 60 * 60 * 1000).toISOString() // Completed 15 days ago
    });

    await goalsService.addMilestone(housingGoalId, {
      title: 'Save for Security Deposit',
      description: 'Accumulate $800 for first month rent and security deposit',
      targetDate: addDays(120),
      completed: false
    });

    await goalsService.addMilestone(housingGoalId, {
      title: 'Complete Housing Interview',
      description: 'Attend scheduled interview with housing coordinator',
      targetDate: addDays(60),
      completed: false
    });

    // Goal 2: Employment - Building financial stability
    const employmentGoalId = await goalsService.createGoal(participantId, {
      title: 'Complete Culinary Arts Certification',
      description: 'Finish culinary arts training program and secure employment in food service industry',
      category: 'Employment',
      targetDate: addDays(90), // 3 months
      progress: 75, // Almost complete
      status: 'active',
      priority: 'high',
      assignedCaseWorker: 'Sarah Johnson',
      relatedServices: ['job-training', 'employment-support'],
      notes: 'Enrolled in 16-week culinary program. Currently in final practicum phase.'
    });

    // Add milestones to employment goal
    await goalsService.addMilestone(employmentGoalId, {
      title: 'Complete Classroom Training',
      description: 'Finish theoretical portion of culinary arts program',
      targetDate: addDays(30),
      completed: true,
      completedDate: new Date(Date.now() - 10 * 24 * 60 * 60 * 1000).toISOString()
    });

    await goalsService.addMilestone(employmentGoalId, {
      title: 'Complete Kitchen Practicum',
      description: 'Finish hands-on training in professional kitchen',
      targetDate: addDays(45),
      completed: false
    });

    await goalsService.addMilestone(employmentGoalId, {
      title: 'Pass Certification Exam',
      description: 'Successfully complete culinary certification test',
      targetDate: addDays(75),
      completed: false
    });

    // Goal 3: Financial - Emergency fund
    const financialGoalId = await goalsService.createGoal(participantId, {
      title: 'Build Emergency Savings',
      description: 'Save $1,000 for emergency fund and housing security deposit',
      category: 'Financial',
      targetDate: addDays(120), // 4 months
      progress: 30, // $300 saved so far
      status: 'active',
      priority: 'medium',
      assignedCaseWorker: 'Sarah Johnson',
      relatedServices: ['financial-counseling'],
      notes: 'Currently saving $75/week from part-time work. On track to meet goal.'
    });

    // Add milestones to financial goal
    await goalsService.addMilestone(financialGoalId, {
      title: 'Open Bank Account',
      description: 'Establish banking relationship with local credit union',
      targetDate: addDays(15),
      completed: true,
      completedDate: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString()
    });

    await goalsService.addMilestone(financialGoalId, {
      title: 'Save First $500',
      description: 'Reach halfway point of emergency fund goal',
      targetDate: addDays(60),
      completed: false
    });

    await goalsService.addMilestone(financialGoalId, {
      title: 'Complete Financial Literacy Course',
      description: 'Attend budget management and financial planning workshop',
      targetDate: addDays(45),
      completed: false
    });

    // Goal 4: Health - Address medical needs
    const healthGoalId = await goalsService.createGoal(participantId, {
      title: 'Establish Regular Healthcare',
      description: 'Address immediate health needs and establish ongoing medical care',
      category: 'Health',
      targetDate: addDays(60), // 2 months
      progress: 60, // Good progress on health
      status: 'active',
      priority: 'high',
      assignedCaseWorker: 'Sarah Johnson',
      relatedServices: ['healthcare', 'mental-health'],
      notes: 'Working with clinic social worker to establish comprehensive care plan.'
    });

    await goalsService.addMilestone(healthGoalId, {
      title: 'Complete Health Assessment',
      description: 'Full medical evaluation at community health center',
      targetDate: addDays(20),
      completed: true,
      completedDate: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString()
    });

    await goalsService.addMilestone(healthGoalId, {
      title: 'Establish Primary Care',
      description: 'Schedule follow-up with assigned primary care doctor',
      targetDate: addDays(45),
      completed: false
    });

    console.log('✅ Successfully created 4 realistic goals for Michael Rodriguez');
    console.log('📊 Goals include: Housing, Employment, Financial, and Health');
    console.log('🎯 Each goal has relevant milestones and progress tracking');
    
    return {
      housingGoalId,
      employmentGoalId,
      financialGoalId,
      healthGoalId
    };

  } catch (error) {
    console.error('❌ Error creating Michael\'s goals:', error);
    throw error;
  }
}

// Export for console use
(window as any).createMichaelGoals = createMichaelGoals;
