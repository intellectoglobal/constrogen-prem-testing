import { useState, useEffect } from 'react';
import { COLORS } from '../../shared/constants/theme';
import { approvalApi } from '../services/approvalApi';
import PendingApprovals from '../components/approvals/PendingApprovals';
import ApprovedRequests from '../components/approvals/ApprovedRequests';

export default function Approvals() {
  const [activeTab, setActiveTab] = useState<'pending' | 'approved'>('pending');
  const [pendingCount, setPendingCount] = useState<number>(0);
  const [approvedCount, setApprovedCount] = useState<number>(0);

  // Fetch both counts on initial load
  useEffect(() => {
    const fetchCounts = async () => {
      try {
        const [pendingData, approvedData] = await Promise.all([
          approvalApi.getPurchaseRequestList('api/transaction/purchase/requisition/?without_pagination=1&status=P'),
          approvalApi.getPurchaseRequestList('api/transaction/purchase/requisition/?without_pagination=1&status=A'),
        ]);
        setPendingCount(pendingData.length || 0);
        setApprovedCount(approvedData.length || 0);
      } catch (error) {
        console.error('Error fetching approval counts:', error);
      }
    };

    fetchCounts();
  }, []);

  return (
    <div className="min-h-screen" style={{ backgroundColor: COLORS.gray50 }}>
      {/* Main Content Container */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Page Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold" style={{ color: COLORS.primaryText }}>
            Approvals
          </h1>
          <p className="mt-2 text-base" style={{ color: COLORS.secondaryText }}>
            Review and manage purchase request approvals
          </p>
        </div>

        {/* Tabs */}
        <div className="bg-white rounded-xl shadow-sm border mb-6" style={{ borderColor: COLORS.border }}>
          <div className="px-6">
            <div className="flex space-x-8">
              <button
                onClick={() => setActiveTab('pending')}
                className={`py-4 px-2 border-b-3 font-semibold text-base transition-all duration-200 relative ${
                  activeTab === 'pending'
                    ? 'border-primary text-primary'
                    : 'border-transparent hover:text-gray-700'
                }`}
                style={activeTab === 'pending' ? { 
                  borderBottomWidth: '3px',
                  borderColor: COLORS.primaryColor, 
                  color: COLORS.primaryColor 
                } : { color: COLORS.secondaryText }}
              >
                <div className="flex items-center gap-2">
                  <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  <span>Pending</span>
                  <span className={`ml-1 px-2 py-0.5 rounded-full text-xs font-bold ${activeTab === 'pending' ? 'bg-orange-100 text-orange-700' : 'bg-gray-100 text-gray-600'}`}>
                    {pendingCount}
                  </span>
                </div>
              </button>
              <button
                onClick={() => setActiveTab('approved')}
                className={`py-4 px-2 border-b-3 font-semibold text-base transition-all duration-200 relative ${
                  activeTab === 'approved'
                    ? 'border-primary text-primary'
                    : 'border-transparent hover:text-gray-700'
                }`}
                style={activeTab === 'approved' ? { 
                  borderBottomWidth: '3px',
                  borderColor: COLORS.primaryColor, 
                  color: COLORS.primaryColor 
                } : { color: COLORS.secondaryText }}
              >
                <div className="flex items-center gap-2">
                  <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  <span>Approved</span>
                  <span className={`ml-1 px-2 py-0.5 rounded-full text-xs font-bold ${activeTab === 'approved' ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-600'}`}>
                    {approvedCount}
                  </span>
                </div>
              </button>
            </div>
          </div>
        </div>

        {/* Tab Content */}
        <div>
          {activeTab === 'pending' ? (
            <PendingApprovals onCountChange={setPendingCount} />
          ) : (
            <ApprovedRequests onCountChange={setApprovedCount} />
          )}
        </div>
      </div>
    </div>
  );
}

