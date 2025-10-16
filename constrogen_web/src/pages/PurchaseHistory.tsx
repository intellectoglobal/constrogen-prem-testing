import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { PurchaseRequest } from 'shared/types/purchase';
import { approvalApi } from '../services/approvalApi';
import { showToast } from '../utils/toast';
import { COLORS } from 'shared/constants/theme';
import PurchaseRequestCard from '../components/purchase/PurchaseRequestCard';
import PurchaseRequestDetailsModal from '../components/purchase/PurchaseRequestDetailsModal';
import SearchBar from '../components/common/SearchBar';

export default function PurchaseHistory() {
  const navigate = useNavigate();
  const [purchaseRequests, setPurchaseRequests] = useState<PurchaseRequest[]>([]);
  const [filteredRequests, setFilteredRequests] = useState<PurchaseRequest[]>([]);
  const [selectedRequest, setSelectedRequest] = useState<PurchaseRequest | null>(null);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [statusFilter, setStatusFilter] = useState<string>('all');

  const fetchPurchaseRequests = async () => {
    try {
      setLoading(true);
      const data = await approvalApi.getPurchaseRequestList(
        'api/transaction/purchase/requisition/?without_pagination=1'
      );
      setPurchaseRequests(data);
      applyFilters(data, statusFilter);
    } catch (error) {
      console.error('Error fetching purchase history:', error);
      showToast({ message: 'Failed to load purchase history', toastType: 'error' });
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    fetchPurchaseRequests();
  }, []);

  const handleRefresh = () => {
    setRefreshing(true);
    fetchPurchaseRequests();
  };

  const applyFilters = (data: PurchaseRequest[], status: string) => {
    if (status === 'all') {
      setFilteredRequests(data);
    } else {
      setFilteredRequests(data.filter(req => req.status === status));
    }
  };

  const handleStatusFilterChange = (status: string) => {
    setStatusFilter(status);
    applyFilters(purchaseRequests, status);
  };

  const handleSearch = (query: string) => {
    if (!query.trim()) {
      applyFilters(purchaseRequests, statusFilter);
      return;
    }

    const baseList = statusFilter === 'all' 
      ? purchaseRequests 
      : purchaseRequests.filter(req => req.status === statusFilter);

    const filtered = baseList.filter(
      (request) =>
        request.number.toLowerCase().includes(query.toLowerCase()) ||
        request.project.name.toLowerCase().includes(query.toLowerCase()) ||
        request.item_type.toLowerCase().includes(query.toLowerCase())
    );
    setFilteredRequests(filtered);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="flex flex-col items-center justify-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2" style={{ borderColor: COLORS.primaryColor }}></div>
            <p className="mt-4 text-sm" style={{ color: COLORS.secondaryText }}>
              Loading purchase history...
            </p>
          </div>
        </div>
      </div>
    );
  }

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
            Purchase History
          </h1>
          <p className="mt-2 text-sm" style={{ color: COLORS.secondaryText }}>
            View all purchase requisitions and their status
          </p>
        </div>

        {/* Filters */}
        <div className="mb-6 bg-white rounded-lg shadow-sm p-4">
          <div className="flex flex-wrap gap-2">
            <button
              onClick={() => handleStatusFilterChange('all')}
              className={`px-4 py-2 rounded-md font-medium text-sm transition-colors ${
                statusFilter === 'all' ? 'text-white' : 'bg-gray-100'
              }`}
              style={statusFilter === 'all' ? { backgroundColor: COLORS.primaryColor } : { color: COLORS.primaryText }}
            >
              All
            </button>
            <button
              onClick={() => handleStatusFilterChange('P')}
              className={`px-4 py-2 rounded-md font-medium text-sm transition-colors ${
                statusFilter === 'P' ? 'text-white' : 'bg-gray-100'
              }`}
              style={statusFilter === 'P' ? { backgroundColor: '#FFA500' } : { color: COLORS.primaryText }}
            >
              Pending
            </button>
            <button
              onClick={() => handleStatusFilterChange('A')}
              className={`px-4 py-2 rounded-md font-medium text-sm transition-colors ${
                statusFilter === 'A' ? 'text-white' : 'bg-gray-100'
              }`}
              style={statusFilter === 'A' ? { backgroundColor: '#4CAF50' } : { color: COLORS.primaryText }}
            >
              Approved
            </button>
            <button
              onClick={() => handleStatusFilterChange('R')}
              className={`px-4 py-2 rounded-md font-medium text-sm transition-colors ${
                statusFilter === 'R' ? 'text-white' : 'bg-gray-100'
              }`}
              style={statusFilter === 'R' ? { backgroundColor: '#F44336' } : { color: COLORS.primaryText }}
            >
              Rejected
            </button>
            <button
              onClick={() => handleStatusFilterChange('C')}
              className={`px-4 py-2 rounded-md font-medium text-sm transition-colors ${
                statusFilter === 'C' ? 'text-white' : 'bg-gray-100'
              }`}
              style={statusFilter === 'C' ? { backgroundColor: '#2196F3' } : { color: COLORS.primaryText }}
            >
              Closed
            </button>
          </div>
        </div>

        {/* Search */}
        <div className="mb-6">
          <SearchBar onSearch={handleSearch} placeholder="Search by PR number, project, or item type..." />
          <button
            onClick={handleRefresh}
            disabled={refreshing}
            className="mt-4 px-4 py-2 rounded-md text-white font-medium disabled:opacity-50 transition-colors"
            style={{ backgroundColor: COLORS.button }}
          >
            {refreshing ? 'Refreshing...' : 'Refresh'}
          </button>
        </div>

        {/* Purchase List */}
        {filteredRequests.length === 0 ? (
          <div className="bg-white rounded-lg shadow-md p-12 text-center">
            <svg
              className="mx-auto h-16 w-16 text-gray-400 mb-4"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
              />
            </svg>
            <h3 className="text-lg font-medium mb-2" style={{ color: COLORS.primaryText }}>
              No Purchase Requests Found
            </h3>
            <p className="text-sm" style={{ color: COLORS.secondaryText }}>
              {purchaseRequests.length === 0 ? 'No purchase requests have been created yet' : 'Try changing your filters or search term'}
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {filteredRequests.map((request) => (
              <PurchaseRequestCard
                key={request.key}
                request={request}
                onClick={() => setSelectedRequest(request)}
              />
            ))}
          </div>
        )}

        {/* Details Modal */}
        {selectedRequest && (
          <PurchaseRequestDetailsModal
            request={selectedRequest}
            onClose={() => setSelectedRequest(null)}
            showActions={false}
          />
        )}
      </div>
    </div>
  );
}

