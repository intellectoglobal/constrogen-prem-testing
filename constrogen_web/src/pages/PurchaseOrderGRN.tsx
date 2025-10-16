import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { COLORS } from '@shared/constants/theme';
import GRNListOpen from '../components/grn/GRNListOpen';
import GRNListClosed from '../components/grn/GRNListClosed';

export default function PurchaseOrderGRN() {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState<'open' | 'closed'>('open');

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-6">
          <button
            onClick={() => navigate('/purchase')}
            className="flex items-center mb-4 text-sm font-medium hover:opacity-80 transition-opacity"
            style={{ color: COLORS.primaryColor }}
          >
            <svg className="w-5 h-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
            Back to Purchase
          </button>
          <h1 className="text-3xl font-bold" style={{ color: COLORS.primaryText }}>
            Purchase Order GRN
          </h1>
          <p className="mt-2 text-sm" style={{ color: COLORS.secondaryText }}>
            Manage Goods Receipt Notes for purchase orders
          </p>
        </div>

        {/* Tabs */}
        <div className="bg-white border rounded-lg mb-6">
          <div className="px-4">
            <div className="flex space-x-8">
              <button
                onClick={() => setActiveTab('open')}
                className={`py-4 px-1 border-b-2 font-medium text-sm transition-colors ${
                  activeTab === 'open'
                    ? 'border-primary text-primary'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
                style={activeTab === 'open' ? { 
                  borderColor: COLORS.primaryColor, 
                  color: COLORS.primaryColor 
                } : {}}
              >
                Open
              </button>
              <button
                onClick={() => setActiveTab('closed')}
                className={`py-4 px-1 border-b-2 font-medium text-sm transition-colors ${
                  activeTab === 'closed'
                    ? 'border-primary text-primary'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
                style={activeTab === 'closed' ? { 
                  borderColor: COLORS.primaryColor, 
                  color: COLORS.primaryColor 
                } : {}}
              >
                Closed
              </button>
            </div>
          </div>
        </div>

        {/* Tab Content */}
        <div>
          {activeTab === 'open' ? <GRNListOpen /> : <GRNListClosed />}
        </div>
      </div>
    </div>
  );
}

