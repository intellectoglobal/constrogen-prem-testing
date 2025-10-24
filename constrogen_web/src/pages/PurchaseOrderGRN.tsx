import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { COLORS } from '../../shared/constants/theme';
import { grnApi } from '../services/grnApi';
import GRNListOpen from '../components/grn/GRNListOpen';
import GRNListClosed from '../components/grn/GRNListClosed';

export default function PurchaseOrderGRN() {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState<'open' | 'closed'>('open');
  const [openCount, setOpenCount] = useState<number>(0);
  const [closedCount, setClosedCount] = useState<number>(0);

  // Fetch both counts on initial load
  useEffect(() => {
    const fetchCounts = async () => {
      try {
        const allGRNs = await grnApi.getGRNList('api/transaction/grn/?without_pagination=1');
        
        const openGRNs = allGRNs.filter((grn: any) => ['P', 'PR'].includes(grn.status));
        const closedGRNs = allGRNs.filter((grn: any) => ['A', 'R', 'C'].includes(grn.status));
        
        setOpenCount(openGRNs.length || 0);
        setClosedCount(closedGRNs.length || 0);
      } catch (error) {
        console.error('Error fetching GRN counts:', error);
      }
    };

    fetchCounts();
  }, []);

  return (
    <div className="min-h-screen" style={{ backgroundColor: COLORS.gray50 }}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <button
            onClick={() => navigate('/purchase')}
            className="flex items-center mb-4 text-sm font-medium hover:opacity-80 transition-all duration-200 group"
            style={{ color: COLORS.primaryColor }}
          >
            <svg className="w-5 h-5 mr-2 transform group-hover:-translate-x-1 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
            Back to Purchase
          </button>
          <h1 className="text-3xl font-bold" style={{ color: COLORS.primaryText }}>
            Goods Receipt Notes (GRN)
          </h1>
          <p className="mt-2 text-base" style={{ color: COLORS.secondaryText }}>
            Manage and track goods receipt notes for purchase orders
          </p>
        </div>

        {/* Tabs */}
        <div className="bg-white rounded-xl shadow-sm border mb-6" style={{ borderColor: COLORS.border }}>
          <div className="px-6">
            <div className="flex space-x-8">
              <button
                onClick={() => setActiveTab('open')}
                className={`py-4 px-2 border-b-3 font-semibold text-base transition-all duration-200 relative ${
                  activeTab === 'open'
                    ? 'border-primary text-primary'
                    : 'border-transparent hover:text-gray-700'
                }`}
                style={activeTab === 'open' ? { 
                  borderBottomWidth: '3px',
                  borderColor: COLORS.primaryColor, 
                  color: COLORS.primaryColor 
                } : { color: COLORS.secondaryText }}
              >
                <div className="flex items-center gap-2">
                  <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  <span>Open</span>
                  <span className={`ml-1 px-2 py-0.5 rounded-full text-xs font-bold ${activeTab === 'open' ? 'bg-blue-100 text-blue-700' : 'bg-gray-100 text-gray-600'}`}>
                    {openCount}
                  </span>
                </div>
              </button>
              <button
                onClick={() => setActiveTab('closed')}
                className={`py-4 px-2 border-b-3 font-semibold text-base transition-all duration-200 relative ${
                  activeTab === 'closed'
                    ? 'border-primary text-primary'
                    : 'border-transparent hover:text-gray-700'
                }`}
                style={activeTab === 'closed' ? { 
                  borderBottomWidth: '3px',
                  borderColor: COLORS.primaryColor, 
                  color: COLORS.primaryColor 
                } : { color: COLORS.secondaryText }}
              >
                <div className="flex items-center gap-2">
                  <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  <span>Closed</span>
                  <span className={`ml-1 px-2 py-0.5 rounded-full text-xs font-bold ${activeTab === 'closed' ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-600'}`}>
                    {closedCount}
                  </span>
                </div>
              </button>
            </div>
          </div>
        </div>

        {/* Tab Content */}
        <div>
          {activeTab === 'open' ? (
            <GRNListOpen onCountChange={setOpenCount} />
          ) : (
            <GRNListClosed onCountChange={setClosedCount} />
          )}
        </div>
      </div>
    </div>
  );
}

