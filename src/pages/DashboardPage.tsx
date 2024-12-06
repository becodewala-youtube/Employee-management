import React from 'react';
import { Users, UserPlus, UserCheck, Calendar } from 'lucide-react';
import { Card } from '../components/Card';
import { format } from 'date-fns';

export default function DashboardPage() {
  const stats = [
    {
      title: 'Total Employees',
      value: '25',
      icon: <Users className="h-6 w-6 text-indigo-600" />,
    },
    {
      title: 'New Employees',
      value: '3',
      icon: <UserPlus className="h-6 w-6 text-green-600" />,
    },
    {
      title: 'Active Employees',
      value: '22',
      icon: <UserCheck className="h-6 w-6 text-blue-600" />,
    },
    {
      title: 'Last Updated',
      value: format(new Date(), 'MMM d, yyyy'),
      icon: <Calendar className="h-6 w-6 text-purple-600" />,
    },
  ];

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-semibold text-gray-900">Dashboard</h1>
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
        {stats.map((stat, index) => (
          <Card
            key={index}
            title={stat.title}
            value={stat.value}
            icon={stat.icon}
          />
        ))}
      </div>
      
      <div className="mt-8">
        <h2 className="text-lg font-medium text-gray-900 mb-4">Recent Activity</h2>
        <div className="bg-white shadow-sm rounded-lg divide-y divide-gray-200">
          {[1, 2, 3].map((_, index) => (
            <div key={index} className="p-4">
              <div className="flex items-center space-x-4">
                <div className="flex-shrink-0">
                  <div className="h-8 w-8 rounded-full bg-indigo-100 flex items-center justify-center">
                    <Users className="h-5 w-5 text-indigo-600" />
                  </div>
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-gray-900">
                    New employee added
                  </p>
                  <p className="text-sm text-gray-500">
                    John Doe was added as a Software Engineer
                  </p>
                </div>
                <div className="flex-shrink-0 text-sm text-gray-500">
                  {format(new Date(), 'MMM d, h:mm a')}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}