import React, { useEffect, useState, useCallback } from 'react';
import { GRN } from '@shared/types/purchase';
import { grnApi } from '../../services/grnApi';
import { showToast } from '../../utils/toast';
import { COLORS } from '@shared/constants/theme';
import GRNCard from './GRNCard';
import GRNDetailsModal from './GRNDetailsModal';

export default function GRNListOpen() {
  const [grns, setGrns] = useState<GRN[]>([]);
  const [filteredGRNs, setFilteredGRNs] = useState<GRN[]>([]);
  const [selectedGRN, setSelectedGRN] = useState<GRN | null>(null);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  const fetchGRNs = useCallback(async () => {
    try {
      setLoading(true);
      const data = await grnApi.getGRNList('api/transaction/grn/?without_pagination=1');
      const openGRNs = data.filter(grn => ['P', 'PR'].includes(grn.status));
      setGrns(openGRNs);
      setFilteredGRNs(openGRNs);
    } catch (error) {
      console.error('Error fetching GRNs:', error);
      showToast({ message: 'Failed to load GRNs', toastType: 'error' });
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, []);

  useEffect(() => {
    fetchGRNs();
  }, [fetchGRNs]);

  const handleRefresh = () => {
    setRefreshing(true);
    fetchGRNs();
  };

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    const query = e.target.value;
    setSearchQuery(query);

    if (!query.trim()) {
      setFilteredGRNs(grns);
      return;
    }

    const filtered = grns.filter(grn =>
      grn.number.toLowerCase().includes(query.toLowerCase()) ||
      grn.pr_number.toString().includes(query) ||
      grn.comments.toLowerCase().includes(query.toLowerCase())
    );
    setFilteredGRNs(filtered);
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'P': return '#f59e0b'; // Orange
      case 'PR': return '#3b82f6'; // Blue
      default: return '#6b7280'; // Gray
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'P': return 'Pending';
      case 'PR': return 'Partially Received';
      default: return status;
    }
  };

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center py-12">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2" style={{ borderColor: COLORS.primary }}></div>
        <p className="mt-4 text-sm" style={{ color: COLORS.secondaryText }}>
          Loading open GRNs...
        </p>
      </div>
    );
  }

  return (
    <div>
      {/* Search Bar */}
      <div className="mb-6">
        <div className="relative">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <svg className="h-5 w-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
          </div>
          <input
            type="text"
            value={searchQuery}
            onChange={handleSearch}
            className="block w-full pl-10 pr-10 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
            style={{ borderColor: COLORS.inputBorder }}
            placeholder="Search by GRN number, PR number, or comments..."
          />
          {searchQuery && (
            <button
              onClick={() => {
                setSearchQuery('');
                setFilteredGRNs(grns);
              }}
              className="absolute inset-y-0 right-0 pr-3 flex items-center"
            >
              <svg className="h-5 w-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          )}
        </div>
        <button
          onClick={handleRefresh}
          disabled={refreshing}
          className="mt-4 px-4 py-2 rounded-md text-white font-medium disabled:opacity-50 transition-colors"
          style={{ backgroundColor: COLORS.button }}
        >
          {refreshing ? 'Refreshing...' : 'Refresh'}
        </button>
      </div>

      {/* GRN List */}
      {filteredGRNs.length === 0 ? (
        <div className="bg-white rounded-lg shadow-md p-12 text-center">
          <svg className="mx-auto h-16 w-16 text-gray-400 mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4" />
          </svg>
          <h3 className="text-lg font-medium mb-2" style={{ color: COLORS.primaryText }}>
            No Open GRNs
          </h3>
          <p className="text-sm" style={{ color: COLORS.secondaryText }}>
            {grns.length === 0 ? 'No open GRNs available' : 'No matching results'}
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredGRNs.map(grn => (
            <GRNCard
              key={grn.key}
              grn={grn}
              onClick={() => setSelectedGRN(grn)}
              getStatusColor={getStatusColor}
              getStatusText={getStatusText}
            />
          ))}
        </div>
      )}

      {/* Details Modal */}
      {selectedGRN && (
        <GRNDetailsModal
          grn={selectedGRN}
          onClose={() => setSelectedGRN(null)}
          onUpdate={fetchGRNs}
          getStatusColor={getStatusColor}
          getStatusText={getStatusText}
          showEdit={true}
        />
      )}
    </div>
  );
}

