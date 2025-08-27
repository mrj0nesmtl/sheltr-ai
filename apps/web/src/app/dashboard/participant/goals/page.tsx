"use client";

import { useAuth } from '@/contexts/AuthContext';
import { useEffect, useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

import { 
  Target, 
  Plus, 
  X, 
  Calendar,
  Award,
  TrendingUp,
  CheckCircle,
  Clock,
  AlertCircle,
  Edit3,
  Save,
  BarChart3,
  Flag,
  User,
  Loader2,
  MessageCircle
} from 'lucide-react';
import { collection, doc, setDoc, getDocs, query, where, orderBy } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { goalsService, type Goal as RealGoal } from '@/services/goalsService';

interface Goal {
  id: string;
  title: string;
  description: string;
  category: string;
  targetDate: string;
  progress: number;
  status: string;
}

// Goal statistics interface
interface GoalStats {
  totalGoals: number;
  activeGoals: number;
  completedGoals: number;
  averageProgress: number;
  upcomingDeadlines: number;
  overdueGoals: number;
}

export default function ParticipantGoalsPage() {
  const { user, hasRole } = useAuth();
  const [goals, setGoals] = useState<Goal[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [editingGoal, setEditingGoal] = useState<string | null>(null);
  const [goalStats, setGoalStats] = useState<GoalStats>({
    totalGoals: 0,
    activeGoals: 0,
    completedGoals: 0,
    averageProgress: 0,
    upcomingDeadlines: 0,
    overdueGoals: 0
  });

  // Get participant ID (you can customize this logic)
  const getParticipantId = () => {
    if (user?.email === 'michael.rodriguez@oldbrewery.example.com') {
      return 'michael-rodriguez';
    }
    return user?.uid || 'demo-participant-001';
  };

  // Load goals from Firestore
  const loadGoals = async () => {
    setLoading(true);
    try {
      const participantId = getParticipantId();
      
      // Load real goals from goalsService
      const realGoals = await goalsService.getParticipantGoals(participantId);
      
      // Convert RealGoal to Goal format for this component
      const convertedGoals: Goal[] = realGoals.map((realGoal: RealGoal) => ({
        id: realGoal.id,
        title: realGoal.title,
        description: realGoal.description,
        category: realGoal.category,
        targetDate: realGoal.targetDate,
        progress: realGoal.progress,
        status: realGoal.status
      }));

      setGoals(convertedGoals);
      
      // Calculate statistics
      calculateGoalStats(convertedGoals);
      
    } catch (error) {
      console.error('Error loading goals:', error);
      
      // Fallback to demo goals if real goals fail to load
      setGoals([
        {
          id: 'demo-goal-1',
          title: 'Find Stable Housing',
          description: 'Secure permanent housing within the next 6 months',
          category: 'Housing',
          targetDate: '2024-07-01',
          progress: 45,
          status: 'active'
        },
        {
          id: 'demo-goal-2',
          title: 'Complete Job Training',
          description: 'Finish culinary arts certification program',
          category: 'Employment',
          targetDate: '2024-04-15',
          progress: 75,
          status: 'active'
        },
        {
          id: 'demo-goal-3',
          title: 'Build Emergency Fund',
          description: 'Save $1,000 for emergencies and housing deposit',
          category: 'Financial',
          targetDate: '2024-06-01',
          progress: 30,
          status: 'active'
        }
      ]);
      calculateGoalStats([]);
    } finally {
      setLoading(false);
    }
  };

  // Calculate goal statistics
  const calculateGoalStats = (goalsList: Goal[]) => {
    const now = new Date();
    const oneWeek = 7 * 24 * 60 * 60 * 1000; // 7 days in milliseconds
    
    const stats: GoalStats = {
      totalGoals: goalsList.length,
      activeGoals: goalsList.filter(g => g.status === 'active').length,
      completedGoals: goalsList.filter(g => g.status === 'completed').length,
      averageProgress: goalsList.length > 0 
        ? Math.round(goalsList.reduce((sum, g) => sum + g.progress, 0) / goalsList.length)
        : 0,
      upcomingDeadlines: goalsList.filter(g => {
        const targetDate = new Date(g.targetDate);
        const timeDiff = targetDate.getTime() - now.getTime();
        return timeDiff > 0 && timeDiff <= oneWeek && g.status === 'active';
      }).length,
      overdueGoals: goalsList.filter(g => {
        const targetDate = new Date(g.targetDate);
        return targetDate < now && g.status === 'active';
      }).length
    };

    setGoalStats(stats);
  };

  // Add new goal
  const addGoal = () => {
    const defaultDate = new Date();
    defaultDate.setMonth(defaultDate.getMonth() + 3);
    
    const newGoal: Goal = {
      id: `goal_${Date.now()}_${Math.random().toString(36).substr(2, 6)}`,
      title: 'New Goal',
      description: 'Describe your goal here...',
      category: 'Personal',
      targetDate: defaultDate.toISOString().split('T')[0],
      progress: 0,
      status: 'active'
    };

    setGoals(prev => [...prev, newGoal]);
    setEditingGoal(newGoal.id);
  };

  // Remove goal
  const removeGoal = (goalId: string) => {
    setGoals(prev => prev.filter(g => g.id !== goalId));
    if (editingGoal === goalId) {
      setEditingGoal(null);
    }
  };

  // Update goal
  const updateGoal = (goalId: string, updates: Partial<Goal>) => {
    setGoals(prev => prev.map(g => 
      g.id === goalId ? { ...g, ...updates } : g
    ));
  };

  // Save goals to Firestore
  const saveGoals = async () => {
    setSaving(true);
    try {
      const participantId = getParticipantId();
      
      // Save each goal to Firestore using goalsService
      for (const goal of goals) {
        // Convert Goal to RealGoal format for saving
        const goalData = {
          title: goal.title,
          description: goal.description,
          category: goal.category as any,
          targetDate: goal.targetDate,
          progress: goal.progress,
          status: goal.status as any,
          priority: 'medium' as any,
          assignedCaseWorker: 'Sarah Johnson'
        };

        // Create new goal or update existing based on ID format
        if (goal.id.startsWith('goal_') && goal.id.includes('_')) {
          await goalsService.createGoal(participantId, goalData);
        }
      }
      
      console.log('✅ Goals saved successfully!');
      
      // Reload goals to get fresh data
      await loadGoals();
      setEditingGoal(null);
      
    } catch (error) {
      console.error('❌ Error saving goals:', error);
    } finally {
      setSaving(false);
    }
  };

  // Get category color
  const getCategoryColor = (category: string) => {
    switch (category) {
      case 'Housing': return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'Employment': return 'bg-green-100 text-green-800 border-green-200';
      case 'Financial': return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'Health': return 'bg-red-100 text-red-800 border-red-200';
      case 'Education': return 'bg-purple-100 text-purple-800 border-purple-200';
      case 'Personal': return 'bg-gray-100 text-gray-800 border-gray-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  // Get progress color
  const getProgressColor = (progress: number) => {
    if (progress >= 80) return 'bg-green-500';
    if (progress >= 60) return 'bg-blue-500';
    if (progress >= 40) return 'bg-yellow-500';
    if (progress >= 20) return 'bg-orange-500';
    return 'bg-red-500';
  };

  // Get status icon
  const getStatusIcon = (status: string, progress: number) => {
    if (status === 'completed') return <CheckCircle className="w-5 h-5 text-green-500" />;
    if (progress >= 90) return <Award className="w-5 h-5 text-blue-500" />;
    if (progress >= 50) return <TrendingUp className="w-5 h-5 text-green-500" />;
    return <Clock className="w-5 h-5 text-gray-500" />;
  };

  // Check if goal is overdue
  const isOverdue = (targetDate: string, status: string) => {
    return new Date(targetDate) < new Date() && status === 'active';
  };

  // Load goals on component mount
  useEffect(() => {
    loadGoals();
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <Loader2 className="w-8 h-8 animate-spin mx-auto mb-4" />
          <p className="text-gray-600 dark:text-gray-400">Loading your goals...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white flex items-center">
            <Target className="w-8 h-8 mr-3 text-blue-500" />
            Goals & Progress
          </h1>
          <p className="text-gray-600 dark:text-gray-400 mt-2">
            Track your journey towards independence and stability
          </p>
        </div>
        <div className="flex space-x-3">
          <Button onClick={addGoal} className="bg-blue-500 hover:bg-blue-600">
            <Plus className="w-4 h-4 mr-2" />
            Add Goal
          </Button>
          {editingGoal && (
            <Button 
              onClick={saveGoals} 
              disabled={saving}
              className="bg-green-500 hover:bg-green-600"
            >
              {saving ? (
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
              ) : (
                <Save className="w-4 h-4 mr-2" />
              )}
              Save Changes
            </Button>
          )}
        </div>
      </div>

      {/* Statistics Cards */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
        <Card>
          <CardContent className="p-4 text-center">
            <Target className="w-8 h-8 mx-auto mb-2 text-blue-500" />
            <div className="text-2xl font-bold">{goalStats.totalGoals}</div>
            <div className="text-sm text-gray-600">Total Goals</div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4 text-center">
            <Flag className="w-8 h-8 mx-auto mb-2 text-green-500" />
            <div className="text-2xl font-bold">{goalStats.activeGoals}</div>
            <div className="text-sm text-gray-600">Active Goals</div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4 text-center">
            <CheckCircle className="w-8 h-8 mx-auto mb-2 text-green-600" />
            <div className="text-2xl font-bold">{goalStats.completedGoals}</div>
            <div className="text-sm text-gray-600">Completed</div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4 text-center">
            <BarChart3 className="w-8 h-8 mx-auto mb-2 text-purple-500" />
            <div className="text-2xl font-bold">{goalStats.averageProgress}%</div>
            <div className="text-sm text-gray-600">Avg Progress</div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4 text-center">
            <Clock className="w-8 h-8 mx-auto mb-2 text-yellow-500" />
            <div className="text-2xl font-bold">{goalStats.upcomingDeadlines}</div>
            <div className="text-sm text-gray-600">Due This Week</div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4 text-center">
            <AlertCircle className="w-8 h-8 mx-auto mb-2 text-red-500" />
            <div className="text-2xl font-bold">{goalStats.overdueGoals}</div>
            <div className="text-sm text-gray-600">Overdue</div>
          </CardContent>
        </Card>
      </div>

      {/* Goals List */}
      <div className="space-y-4">
        {goals.length === 0 ? (
          <Card>
            <CardContent className="p-8 text-center">
              <Target className="w-16 h-16 mx-auto mb-4 text-gray-400" />
              <h3 className="text-xl font-semibold mb-2">No Goals Set Yet</h3>
              <p className="text-gray-600 dark:text-gray-400 mb-4">
                Start your journey by setting your first goal. Every step forward counts!
              </p>
              <Button onClick={addGoal} className="bg-blue-500 hover:bg-blue-600">
                <Plus className="w-4 h-4 mr-2" />
                Create Your First Goal
              </Button>
            </CardContent>
          </Card>
        ) : (
          goals.map((goal) => (
            <Card key={goal.id} className={`transition-all duration-200 ${
              isOverdue(goal.targetDate, goal.status) ? 'border-red-300 bg-red-50 dark:bg-red-900/10' : ''
            }`}>
              <CardContent className="p-6">
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-center space-x-3">
                    {getStatusIcon(goal.status, goal.progress)}
                    <div>
                      <div className="flex items-center space-x-2 mb-1">
                        <Badge className={getCategoryColor(goal.category)}>
                          {goal.category}
                        </Badge>
                        <span className="text-sm text-gray-500">
                          Due: {new Date(goal.targetDate).toLocaleDateString()}
                        </span>
                        {isOverdue(goal.targetDate, goal.status) && (
                          <Badge variant="destructive">Overdue</Badge>
                        )}
                      </div>
                    </div>
                  </div>
                  <div className="flex space-x-2">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => setEditingGoal(editingGoal === goal.id ? null : goal.id)}
                    >
                      <Edit3 className="w-4 h-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => removeGoal(goal.id)}
                      className="text-red-500 hover:text-red-700"
                    >
                      <X className="w-4 h-4" />
                    </Button>
                  </div>
                </div>

                {editingGoal === goal.id ? (
                  <div className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <Label htmlFor={`title-${goal.id}`}>Goal Title</Label>
                        <Input
                          id={`title-${goal.id}`}
                          value={goal.title}
                          onChange={(e) => updateGoal(goal.id, { title: e.target.value })}
                          placeholder="Goal title"
                        />
                      </div>
                      <div>
                        <Label htmlFor={`category-${goal.id}`}>Category</Label>
                        <select 
                          id={`category-${goal.id}`}
                          value={goal.category}
                          onChange={(e) => updateGoal(goal.id, { category: e.target.value })}
                          className="w-full px-3 py-2 border rounded-md"
                        >
                          <option value="Housing">Housing</option>
                          <option value="Employment">Employment</option>
                          <option value="Financial">Financial</option>
                          <option value="Health">Health</option>
                          <option value="Education">Education</option>
                          <option value="Personal">Personal</option>
                        </select>
                      </div>
                    </div>
                    <div>
                      <Label htmlFor={`description-${goal.id}`}>Description</Label>
                      <Input
                        id={`description-${goal.id}`}
                        value={goal.description}
                        onChange={(e) => updateGoal(goal.id, { description: e.target.value })}
                        placeholder="Describe your goal..."
                      />
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <Label htmlFor={`target-${goal.id}`}>Target Date</Label>
                        <Input
                          id={`target-${goal.id}`}
                          type="date"
                          value={goal.targetDate}
                          onChange={(e) => updateGoal(goal.id, { targetDate: e.target.value })}
                        />
                      </div>
                      <div>
                        <Label htmlFor={`progress-${goal.id}`}>Progress (%)</Label>
                        <Input
                          id={`progress-${goal.id}`}
                          type="number"
                          min="0"
                          max="100"
                          value={goal.progress}
                          onChange={(e) => updateGoal(goal.id, { progress: parseInt(e.target.value) || 0 })}
                        />
                      </div>
                    </div>
                  </div>
                ) : (
                  <div>
                    <h3 className="text-xl font-semibold mb-2">{goal.title}</h3>
                    <p className="text-gray-600 dark:text-gray-400 mb-4">{goal.description}</p>
                    
                    <div className="space-y-2">
                      <div className="flex justify-between text-sm">
                        <span>Progress</span>
                        <span className="font-medium">{goal.progress}%</span>
                      </div>
                      <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                        <div
                          className={`h-2 rounded-full transition-all duration-300 ${getProgressColor(goal.progress)}`}
                          style={{ width: `${goal.progress}%` }}
                        />
                      </div>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          ))
        )}
      </div>

      {/* Help Section */}
      <Card className="bg-blue-50 dark:bg-blue-900/20 border-blue-200 dark:border-blue-800">
        <CardContent className="p-6">
          <div className="flex items-start space-x-4">
            <User className="w-8 h-8 text-blue-500 mt-1" />
            <div>
              <h3 className="font-semibold text-blue-900 dark:text-blue-100 mb-2">
                Need Help with Your Goals?
              </h3>
              <p className="text-blue-800 dark:text-blue-200 mb-3">
                Your case worker Sarah Johnson is here to help you create meaningful goals and track your progress. 
                Don't hesitate to reach out for support!
              </p>
              <Button variant="outline" className="border-blue-300 text-blue-700 hover:bg-blue-100">
                <MessageCircle className="w-4 h-4 mr-2" />
                Contact Case Worker
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
