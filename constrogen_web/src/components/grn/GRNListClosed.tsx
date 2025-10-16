import React, { useEffect, useState, useCallback } from 'react';
import { GRN } from 'shared/types/purchase';
import { grnApi } from '../../services/grnApi';
import { showToast } from '../../utils/toast';
import { COLORS } from 'shared/constants/theme';
import GRNCard from './GRNCard';
import GRNDetailsModal from './GRNDetailsModal';

export default function GRNListClosed() {
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
      const closedGRNs = data.filter((grn: GRN) => ['A', 'R', 'C'].includes(grn.status));
      setGrns(closedGRNs);
      setFilteredGRNs(closedGRNs);
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
      case 'A':
      case 'C': return '#10b981'; // Green
      case 'R': return '#ef4444'; // Red
      default: return '#6b7280'; // Gray
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'A': return 'Approved';
      case 'C': return 'Closed';
      case 'R': return 'Rejected';
      default: return status;
    }
  };

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center py-12">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2" style={{ borderColor: COLORS.primaryColor }}></div>
        <p className="mt-4 text-sm" style={{ color: COLORS.secondaryText }}>
          Loading closed GRNs...
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
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          <h3 className="text-lg font-medium mb-2" style={{ color: COLORS.primaryText }}>
            No Closed GRNs
          </h3>
          <p className="text-sm" style={{ color: COLORS.secondaryText }}>
            {grns.length === 0 ? 'No closed GRNs available' : 'No matching results'}
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
          showEdit={false}
        />
      )}
    </div>
  );
}

