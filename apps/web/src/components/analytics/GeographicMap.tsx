"use client";

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { MapPin, TrendingUp, TrendingDown, Building2, Users, DollarSign } from 'lucide-react';

interface GeographicRegion {
  region: string;
  shelters: number;
  participants: number;
  donations: number;
  growth: number;
  hasData: boolean;
}

interface GeographicMapProps {
  geographicData: GeographicRegion[];
}

export function GeographicMap({ geographicData }: GeographicMapProps) {
  const getRegionColor = (region: GeographicRegion) => {
    if (!region.hasData) return 'fill-gray-300 dark:fill-gray-600';
    if (region.donations > 5000) return 'fill-emerald-500 dark:fill-emerald-400';
    if (region.donations > 1000) return 'fill-blue-500 dark:fill-blue-400';
    return 'fill-orange-500 dark:fill-orange-400';
  };

  const getRegionInfo = (regionName: string) => {
    return geographicData.find(r => r.region === regionName);
  };

  return (
    <div className="space-y-6">
      {/* World Map Visualization */}
      <Card className="overflow-hidden">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <MapPin className="h-5 w-5 text-blue-600" />
            Global Platform Reach
          </CardTitle>
          <p className="text-sm text-muted-foreground">
            Interactive view of SHELTR platform presence worldwide
          </p>
        </CardHeader>
        <CardContent>
          <div className="relative bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-gray-800 dark:to-gray-900 rounded-lg p-6 overflow-hidden">
            {/* Simplified World Map SVG */}
            <div className="flex items-center justify-center min-h-[300px]">
              <svg 
                viewBox="0 0 1000 500" 
                className="w-full h-full max-w-4xl"
                style={{ filter: 'drop-shadow(0 4px 6px rgba(0, 0, 0, 0.1))' }}
              >
                {/* Background */}
                <rect width="1000" height="500" fill="rgba(59, 130, 246, 0.1)" rx="8" />
                
                {/* North America */}
                <g>
                  <path
                    d="M 100 100 L 350 100 L 380 150 L 350 200 L 300 250 L 200 280 L 150 250 L 100 200 Z"
                    className={getRegionColor(getRegionInfo('North America') || { region: 'North America', shelters: 0, participants: 0, donations: 0, growth: 0, hasData: false })}
                    stroke="rgba(255, 255, 255, 0.8)"
                    strokeWidth="2"
                  />
                  <text x="225" y="190" textAnchor="middle" className="fill-white font-semibold text-sm">
                    North America
                  </text>
                  {getRegionInfo('North America')?.hasData && (
                    <circle cx="225" cy="210" r="8" className="fill-white animate-pulse" />
                  )}
                </g>

                {/* Europe */}
                <g>
                  <path
                    d="M 450 120 L 600 120 L 620 180 L 580 220 L 500 240 L 450 200 Z"
                    className={getRegionColor(getRegionInfo('Europe') || { region: 'Europe', shelters: 0, participants: 0, donations: 0, growth: 0, hasData: false })}
                    stroke="rgba(255, 255, 255, 0.8)"
                    strokeWidth="2"
                  />
                  <text x="535" y="180" textAnchor="middle" className="fill-white font-semibold text-sm">
                    Europe
                  </text>
                  {getRegionInfo('Europe')?.hasData && (
                    <circle cx="535" cy="200" r="8" className="fill-white animate-pulse" />
                  )}
                </g>

                {/* Asia Pacific */}
                <g>
                  <path
                    d="M 650 100 L 900 100 L 920 180 L 880 250 L 800 280 L 700 260 L 650 200 Z"
                    className={getRegionColor(getRegionInfo('Asia Pacific') || { region: 'Asia Pacific', shelters: 0, participants: 0, donations: 0, growth: 0, hasData: false })}
                    stroke="rgba(255, 255, 255, 0.8)"
                    strokeWidth="2"
                  />
                  <text x="775" y="190" textAnchor="middle" className="fill-white font-semibold text-sm">
                    Asia Pacific
                  </text>
                  {getRegionInfo('Asia Pacific')?.hasData && (
                    <circle cx="775" cy="210" r="8" className="fill-white animate-pulse" />
                  )}
                </g>

                {/* Other Regions (Africa, South America, etc.) */}
                <g>
                  <path
                    d="M 200 320 L 400 320 L 420 380 L 380 420 L 300 440 L 220 420 L 200 380 Z"
                    className={getRegionColor(getRegionInfo('Other') || { region: 'Other', shelters: 0, participants: 0, donations: 0, growth: 0, hasData: false })}
                    stroke="rgba(255, 255, 255, 0.8)"
                    strokeWidth="2"
                  />
                  <text x="310" y="380" textAnchor="middle" className="fill-white font-semibold text-sm">
                    Other Regions
                  </text>
                  {getRegionInfo('Other')?.hasData && (
                    <circle cx="310" cy="400" r="8" className="fill-white animate-pulse" />
                  )}
                </g>

                {/* Grid lines for visual appeal */}
                <defs>
                  <pattern id="grid" width="50" height="50" patternUnits="userSpaceOnUse">
                    <path d="M 50 0 L 0 0 0 50" fill="none" stroke="rgba(255, 255, 255, 0.1)" strokeWidth="1"/>
                  </pattern>
                </defs>
                <rect width="1000" height="500" fill="url(#grid)" />
              </svg>
            </div>

            {/* Legend */}
            <div className="mt-4 flex flex-wrap items-center justify-center gap-4 text-sm">
              <div className="flex items-center gap-2">
                <div className="w-4 h-4 bg-emerald-500 rounded"></div>
                <span className="text-gray-700 dark:text-gray-300">High Activity ($5K+)</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-4 h-4 bg-blue-500 rounded"></div>
                <span className="text-gray-700 dark:text-gray-300">Medium Activity ($1K+)</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-4 h-4 bg-orange-500 rounded"></div>
                <span className="text-gray-700 dark:text-gray-300">Low Activity</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-4 h-4 bg-gray-400 rounded"></div>
                <span className="text-gray-700 dark:text-gray-300">No Data</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 bg-white rounded-full animate-pulse"></div>
                <span className="text-gray-700 dark:text-gray-300">Active Regions</span>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Regional Performance Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {geographicData.filter(region => region.hasData).map((region) => (
          <Card key={region.region} className="overflow-hidden border-l-4 border-l-emerald-500">
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <CardTitle className="text-lg">{region.region}</CardTitle>
                <Badge variant={region.growth > 0 ? "default" : "secondary"} className="flex items-center gap-1">
                  {region.growth > 0 ? <TrendingUp className="h-3 w-3" /> : <TrendingDown className="h-3 w-3" />}
                  {region.growth}%
                </Badge>
              </div>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-3 gap-4">
                <div className="text-center">
                  <div className="flex items-center justify-center w-8 h-8 bg-blue-100 dark:bg-blue-900/20 rounded-lg mx-auto mb-2">
                    <Building2 className="h-4 w-4 text-blue-600 dark:text-blue-400" />
                  </div>
                  <div className="text-2xl font-bold text-gray-900 dark:text-white">{region.shelters}</div>
                  <div className="text-xs text-gray-500 dark:text-gray-400">Shelters</div>
                </div>
                <div className="text-center">
                  <div className="flex items-center justify-center w-8 h-8 bg-purple-100 dark:bg-purple-900/20 rounded-lg mx-auto mb-2">
                    <Users className="h-4 w-4 text-purple-600 dark:text-purple-400" />
                  </div>
                  <div className="text-2xl font-bold text-gray-900 dark:text-white">{region.participants}</div>
                  <div className="text-xs text-gray-500 dark:text-gray-400">Participants</div>
                </div>
                <div className="text-center">
                  <div className="flex items-center justify-center w-8 h-8 bg-emerald-100 dark:bg-emerald-900/20 rounded-lg mx-auto mb-2">
                    <DollarSign className="h-4 w-4 text-emerald-600 dark:text-emerald-400" />
                  </div>
                  <div className="text-2xl font-bold text-emerald-600 dark:text-emerald-400">
                    ${region.donations.toLocaleString()}
                  </div>
                  <div className="text-xs text-gray-500 dark:text-gray-400">Donations</div>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Global Summary */}
      <Card>
        <CardHeader>
          <CardTitle>Global Platform Summary</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="text-center p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
              <div className="text-2xl font-bold text-blue-600 dark:text-blue-400">
                {geographicData.reduce((sum, region) => sum + region.shelters, 0)}
              </div>
              <div className="text-sm text-gray-600 dark:text-gray-400">Total Shelters</div>
            </div>
            <div className="text-center p-4 bg-purple-50 dark:bg-purple-900/20 rounded-lg">
              <div className="text-2xl font-bold text-purple-600 dark:text-purple-400">
                {geographicData.reduce((sum, region) => sum + region.participants, 0)}
              </div>
              <div className="text-sm text-gray-600 dark:text-gray-400">Total Participants</div>
            </div>
            <div className="text-center p-4 bg-emerald-50 dark:bg-emerald-900/20 rounded-lg">
              <div className="text-2xl font-bold text-emerald-600 dark:text-emerald-400">
                ${geographicData.reduce((sum, region) => sum + region.donations, 0).toLocaleString()}
              </div>
              <div className="text-sm text-gray-600 dark:text-gray-400">Total Donations</div>
            </div>
            <div className="text-center p-4 bg-orange-50 dark:bg-orange-900/20 rounded-lg">
              <div className="text-2xl font-bold text-orange-600 dark:text-orange-400">
                {geographicData.filter(region => region.hasData).length}
              </div>
              <div className="text-sm text-gray-600 dark:text-gray-400">Active Regions</div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
