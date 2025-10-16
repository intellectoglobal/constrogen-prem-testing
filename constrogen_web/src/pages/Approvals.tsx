import React, { useState } from 'react';
import { COLORS } from '@shared/constants/theme';
import PendingApprovals from '../components/approvals/PendingApprovals';
import ApprovedRequests from '../components/approvals/ApprovedRequests';

export default function Approvals() {
  const [activeTab, setActiveTab] = useState<'pending' | 'approved'>('pending');

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Main Content Container */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Page Header */}
        <div className="mb-6">
          <h1 className="text-3xl font-bold" style={{ color: COLORS.primaryText }}>
            Approvals
          </h1>
          <p className="mt-2 text-sm" style={{ color: COLORS.secondaryText }}>
            Review and manage purchase request approvals
          </p>
        </div>

        {/* Tabs */}
        <div className="bg-white border rounded-lg mb-6">
          <div className="px-4">
            <div className="flex space-x-8">
              <button
                onClick={() => setActiveTab('pending')}
                className={`py-4 px-1 border-b-2 font-medium text-sm transition-colors ${
                  activeTab === 'pending'
                    ? 'border-primary text-primary'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
                style={activeTab === 'pending' ? { 
                  borderColor: COLORS.primary, 
                  color: COLORS.primary 
                } : {}}
              >
                Pending
              </button>
              <button
                onClick={() => setActiveTab('approved')}
                className={`py-4 px-1 border-b-2 font-medium text-sm transition-colors ${
                  activeTab === 'approved'
                    ? 'border-primary text-primary'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
                style={activeTab === 'approved' ? { 
                  borderColor: COLORS.primary, 
                  color: COLORS.primary 
                } : {}}
              >
                Approved
              </button>
            </div>
          </div>
        </div>

        {/* Tab Content */}
        <div>
          {activeTab === 'pending' ? <PendingApprovals /> : <ApprovedRequests />}
        </div>
      </div>
    </div>
  );
}

