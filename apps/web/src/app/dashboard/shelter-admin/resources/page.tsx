'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  Package, 
  Bed, 
  Utensils, 
  Shirt,
  Heart,
  AlertTriangle,
  CheckCircle,
  Plus,
  Search,
  Filter,
  TrendingUp,
  TrendingDown,
  Package2,
  Truck,
  Calendar,
  DollarSign,
  Users,
  Box
} from 'lucide-react';

// Mock inventory data
const inventoryItems = [
  {
    id: 'INV001',
    name: 'Bed Linens',
    category: 'Bedding',
    currentStock: 45,
    targetStock: 60,
    minStock: 20,
    unit: 'sets',
    status: 'Low',
    lastRestocked: '2025-01-15',
    supplier: 'Comfort Supplies Inc',
    cost: 25.99,
    monthlyUsage: 18
  },
  {
    id: 'INV002',
    name: 'Canned Soup',
    category: 'Food',
    currentStock: 120,
    targetStock: 150,
    minStock: 30,
    unit: 'cans',
    status: 'Good',
    lastRestocked: '2025-01-20',
    supplier: 'Food Bank Donation',
    cost: 0,
    monthlyUsage: 85
  },
  {
    id: 'INV003',
    name: 'Winter Coats',
    category: 'Clothing',
    currentStock: 8,
    targetStock: 25,
    minStock: 10,
    unit: 'pieces',
    status: 'Critical',
    lastRestocked: '2025-01-10',
    supplier: 'Community Donations',
    cost: 0,
    monthlyUsage: 12
  },
  {
    id: 'INV004',
    name: 'Toiletries',
    category: 'Personal Care',
    currentStock: 85,
    targetStock: 100,
    minStock: 25,
    unit: 'kits',
    status: 'Good',
    lastRestocked: '2025-01-18',
    supplier: 'Hygiene Plus',
    cost: 8.50,
    monthlyUsage: 35
  },
  {
    id: 'INV005',
    name: 'Medication Storage',
    category: 'Medical',
    currentStock: 15,
    targetStock: 20,
    minStock: 8,
    unit: 'units',
    status: 'Low',
    lastRestocked: '2025-01-12',
    supplier: 'Medical Supplies Co',
    cost: 125.00,
    monthlyUsage: 5
  }
];

const bedStatus = {
  total: 120,
  occupied: 89,
  available: 31,
  maintenance: 5,
  reserved: 3
};

const resourceCategories = [
  { name: 'Food & Kitchen', icon: Utensils, items: 145, value: 2850, status: 'Good' },
  { name: 'Bedding & Linens', icon: Bed, items: 89, value: 1200, status: 'Low' },
  { name: 'Clothing', icon: Shirt, items: 234, value: 3400, status: 'Critical' },
  { name: 'Personal Care', icon: Heart, items: 167, value: 890, status: 'Good' },
  { name: 'Medical Supplies', icon: Package, items: 45, value: 2200, status: 'Good' },
  { name: 'Cleaning Supplies', icon: Package2, items: 78, value: 450, status: 'Low' }
];

const recentDonations = [
  { donor: 'Local Food Bank', items: 'Canned goods (50 units)', value: 125, date: '2025-01-20' },
  { donor: 'Community Church', items: 'Winter clothing (15 pieces)', value: 450, date: '2025-01-19' },
  { donor: 'Anonymous Donor', items: 'Cash donation', value: 500, date: '2025-01-18' },
  { donor: 'School District', items: 'Hygiene kits (25 units)', value: 200, date: '2025-01-17' },
  { donor: 'Medical Center', items: 'First aid supplies', value: 180, date: '2025-01-16' }
];

export default function ResourcesPage() {
  const [selectedTab, setSelectedTab] = useState('inventory');

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Good': return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-100';
      case 'Low': return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-100';
      case 'Critical': return 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-100';
      default: return 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-100';
    }
  };

  const getStockPercentage = (current: number, target: number) => {
    return Math.min((current / target) * 100, 100);
  };

  const getCategoryStatusColor = (status: string) => {
    switch (status) {
      case 'Good': return 'text-green-600';
      case 'Low': return 'text-yellow-600';
      case 'Critical': return 'text-red-600';
      default: return 'text-gray-600';
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Resources</h1>
          <p className="text-gray-600 dark:text-gray-400 mt-1">
            Manage inventory, beds, meals, and shelter resources
          </p>
        </div>
        <Button className="bg-blue-600 hover:bg-blue-700">
          <Plus className="mr-2 h-4 w-4" />
          Add Resource
        </Button>
      </div>

      {/* Resource Overview */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Bed Occupancy</CardTitle>
            <Bed className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{bedStatus.occupied}/{bedStatus.total}</div>
            <Progress value={(bedStatus.occupied / bedStatus.total) * 100} className="mt-2" />
            <p className="text-xs text-muted-foreground mt-1">
              {bedStatus.available} available • {bedStatus.maintenance} in maintenance
            </p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Inventory Value</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">$11,190</div>
            <p className="text-xs text-muted-foreground">
              <TrendingUp className="inline h-3 w-3 mr-1 text-green-500" />
              +8% from last month
            </p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Critical Items</CardTitle>
            <AlertTriangle className="h-4 w-4 text-red-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-red-600">3</div>
            <p className="text-xs text-muted-foreground">Require immediate attention</p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Monthly Donations</CardTitle>
            <Heart className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">$1,455</div>
            <p className="text-xs text-muted-foreground">In-kind + monetary</p>
          </CardContent>
        </Card>
      </div>

      {/* Resource Categories */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {resourceCategories.map((category) => {
          const IconComponent = category.icon;
          return (
            <Card key={category.name}>
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <div className="p-2 bg-blue-100 dark:bg-blue-900 rounded-lg">
                      <IconComponent className="h-5 w-5 text-blue-600 dark:text-blue-300" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-sm">{category.name}</h3>
                      <p className="text-xs text-gray-600 dark:text-gray-400">
                        {category.items} items • ${category.value}
                      </p>
                    </div>
                  </div>
                  <Badge className={getStatusColor(category.status)}>
                    {category.status}
                  </Badge>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Main Content */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Inventory Management */}
        <div className="lg:col-span-2">
          <Card>
            <CardHeader>
              <div className="flex justify-between items-center">
                <CardTitle>Inventory Management</CardTitle>
                <div className="flex space-x-2">
                  <Button variant="outline" size="sm">
                    <Search className="mr-2 h-4 w-4" />
                    Search
                  </Button>
                  <Button variant="outline" size="sm">
                    <Filter className="mr-2 h-4 w-4" />
                    Filter
                  </Button>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <Tabs value={selectedTab} onValueChange={setSelectedTab}>
                <TabsList className="grid w-full grid-cols-3">
                  <TabsTrigger value="inventory">All Items</TabsTrigger>
                  <TabsTrigger value="low">Low Stock</TabsTrigger>
                  <TabsTrigger value="critical">Critical</TabsTrigger>
                </TabsList>
                
                <TabsContent value="inventory" className="space-y-4">
                  {inventoryItems.map((item) => (
                    <div key={item.id} className="border rounded-lg p-4 hover:bg-gray-50 dark:hover:bg-gray-800">
                      <div className="flex justify-between items-start">
                        <div className="flex-1">
                          <div className="flex items-center space-x-3">
                            <div className="p-2 bg-gray-100 dark:bg-gray-800 rounded-lg">
                              <Box className="h-4 w-4" />
                            </div>
                            <div>
                              <h3 className="font-semibold">{item.name}</h3>
                              <p className="text-sm text-gray-600 dark:text-gray-400">
                                {item.category} • {item.supplier}
                              </p>
                            </div>
                          </div>
                          <div className="mt-3 space-y-2">
                            <div className="flex justify-between text-sm">
                              <span>Stock Level</span>
                              <span>{item.currentStock}/{item.targetStock} {item.unit}</span>
                            </div>
                            <Progress value={getStockPercentage(item.currentStock, item.targetStock)} />
                            <div className="flex flex-wrap gap-2 mt-2">
                              <Badge className={getStatusColor(item.status)}>
                                {item.status}
                              </Badge>
                              <Badge variant="outline">
                                Monthly usage: {item.monthlyUsage}
                              </Badge>
                              {item.cost > 0 && (
                                <Badge variant="outline">
                                  ${item.cost} per unit
                                </Badge>
                              )}
                              {item.cost === 0 && (
                                <Badge variant="outline" className="text-green-600">
                                  Donated
                                </Badge>
                              )}
                            </div>
                          </div>
                          <p className="text-xs text-gray-500 dark:text-gray-400 mt-2">
                            Last restocked: {item.lastRestocked}
                          </p>
                        </div>
                        <div className="ml-4">
                          <Button variant="outline" size="sm">
                            Restock
                          </Button>
                        </div>
                      </div>
                    </div>
                  ))}
                </TabsContent>
                
                <TabsContent value="low" className="space-y-4">
                  {inventoryItems.filter(item => item.status === 'Low').map((item) => (
                    <div key={item.id} className="border rounded-lg p-4 hover:bg-gray-50 dark:hover:bg-gray-800 border-yellow-200">
                      <div className="flex justify-between items-start">
                        <div className="flex-1">
                          <div className="flex items-center space-x-3">
                            <div className="p-2 bg-yellow-100 dark:bg-yellow-900 rounded-lg">
                              <AlertTriangle className="h-4 w-4 text-yellow-600" />
                            </div>
                            <div>
                              <h3 className="font-semibold">{item.name}</h3>
                              <p className="text-sm text-gray-600 dark:text-gray-400">
                                {item.category} • Below minimum stock
                              </p>
                            </div>
                          </div>
                          <div className="mt-3 space-y-2">
                            <div className="flex justify-between text-sm">
                              <span>Stock Level</span>
                              <span className="text-yellow-600 font-medium">
                                {item.currentStock}/{item.targetStock} {item.unit}
                              </span>
                            </div>
                            <Progress value={getStockPercentage(item.currentStock, item.targetStock)} className="bg-yellow-100" />
                          </div>
                        </div>
                        <div className="ml-4">
                          <Button variant="outline" size="sm" className="border-yellow-300">
                            Order Now
                          </Button>
                        </div>
                      </div>
                    </div>
                  ))}
                </TabsContent>
                
                <TabsContent value="critical" className="space-y-4">
                  {inventoryItems.filter(item => item.status === 'Critical').map((item) => (
                    <div key={item.id} className="border rounded-lg p-4 hover:bg-gray-50 dark:hover:bg-gray-800 border-red-200">
                      <div className="flex justify-between items-start">
                        <div className="flex-1">
                          <div className="flex items-center space-x-3">
                            <div className="p-2 bg-red-100 dark:bg-red-900 rounded-lg">
                              <AlertTriangle className="h-4 w-4 text-red-600" />
                            </div>
                            <div>
                              <h3 className="font-semibold">{item.name}</h3>
                              <p className="text-sm text-red-600">
                                {item.category} • Critical shortage
                              </p>
                            </div>
                          </div>
                          <div className="mt-3 space-y-2">
                            <div className="flex justify-between text-sm">
                              <span>Stock Level</span>
                              <span className="text-red-600 font-medium">
                                {item.currentStock}/{item.targetStock} {item.unit}
                              </span>
                            </div>
                            <Progress value={getStockPercentage(item.currentStock, item.targetStock)} className="bg-red-100" />
                          </div>
                        </div>
                        <div className="ml-4">
                          <Button size="sm" className="bg-red-600 hover:bg-red-700">
                            Urgent Order
                          </Button>
                        </div>
                      </div>
                    </div>
                  ))}
                </TabsContent>
              </Tabs>
            </CardContent>
          </Card>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Recent Donations</CardTitle>
              <CardDescription>Last 7 days</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {recentDonations.map((donation, index) => (
                <div key={index} className="flex items-start space-x-3">
                  <div className="w-2 h-2 bg-green-500 rounded-full mt-2" />
                  <div className="flex-1">
                    <p className="text-sm font-medium">{donation.donor}</p>
                    <p className="text-xs text-gray-600 dark:text-gray-400">{donation.items}</p>
                    <div className="flex justify-between items-center mt-1">
                      <span className="text-xs text-gray-500">{donation.date}</span>
                      <span className="text-sm font-medium text-green-600">${donation.value}</span>
                    </div>
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Quick Actions</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <Button className="w-full justify-start" variant="outline">
                <Plus className="mr-2 h-4 w-4" />
                Add Inventory Item
              </Button>
              <Button className="w-full justify-start" variant="outline">
                <Truck className="mr-2 h-4 w-4" />
                Schedule Delivery
              </Button>
              <Button className="w-full justify-start" variant="outline">
                <Calendar className="mr-2 h-4 w-4" />
                Donation Calendar
              </Button>
              <Button className="w-full justify-start" variant="outline">
                <Package className="mr-2 h-4 w-4" />
                Generate Report
              </Button>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Bed Status</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="flex justify-between">
                <span className="text-sm">Occupied</span>
                <span className="font-medium">{bedStatus.occupied}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm">Available</span>
                <span className="font-medium text-green-600">{bedStatus.available}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm">Maintenance</span>
                <span className="font-medium text-yellow-600">{bedStatus.maintenance}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm">Reserved</span>
                <span className="font-medium text-blue-600">{bedStatus.reserved}</span>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
} 