import { useEffect, useState } from 'react';
import { PurchaseRequest } from 'shared/types/purchase';
import { approvalApi } from '../../services/approvalApi';
import { showToast } from '../../utils/toast';
import { COLORS } from 'shared/constants/theme';
import PurchaseRequestCard from '../purchase/PurchaseRequestCard';
import PurchaseRequestDetailsModal from '../purchase/PurchaseRequestDetailsModal';
import SearchBar from '../common/SearchBar';

export default function PendingApprovals() {
  const [purchaseRequests, setPurchaseRequests] = useState<PurchaseRequest[]>([]);
  const [filteredRequests, setFilteredRequests] = useState<PurchaseRequest[]>([]);
  const [selectedRequest, setSelectedRequest] = useState<PurchaseRequest | null>(null);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const fetchPurchaseRequests = async () => {
    try {
      setLoading(true);
      const data = await approvalApi.getPurchaseRequestList(
        'api/transaction/purchase/requisition/?without_pagination=1&status=P'
      );
      setPurchaseRequests(data);
      setFilteredRequests(data);
    } catch (error) {
      console.error('Error fetching purchase requests:', error);
      showToast({ message: 'Failed to load pending approvals', toastType: 'error' });
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

  const handleApprove = async (request: PurchaseRequest) => {
    if (!window.confirm('Are you sure you want to approve this Purchase Request?')) {
      return;
    }

    try {
      await approvalApi.approvePurchaseRequest(request);
      showToast({ message: 'Purchase request approved successfully!', toastType: 'success' });
      setSelectedRequest(null);
      fetchPurchaseRequests();
    } catch (error) {
      console.error('Error approving request:', error);
      showToast({ message: 'Failed to approve purchase request', toastType: 'error' });
    }
  };

  const handleReject = async (request: PurchaseRequest) => {
    if (!window.confirm('Are you sure you want to reject this Purchase Request?')) {
      return;
    }

    try {
      await approvalApi.rejectPurchaseRequest(request);
      showToast({ message: 'Purchase request rejected successfully!', toastType: 'success' });
      setSelectedRequest(null);
      fetchPurchaseRequests();
    } catch (error) {
      console.error('Error rejecting request:', error);
      showToast({ message: 'Failed to reject purchase request', toastType: 'error' });
    }
  };

  const handleSearch = (query: string) => {
    if (!query.trim()) {
      setFilteredRequests(purchaseRequests);
      return;
    }

    const filtered = purchaseRequests.filter(
      (request) =>
        request.number.toLowerCase().includes(query.toLowerCase()) ||
        request.project.name.toLowerCase().includes(query.toLowerCase()) ||
        request.item_type.toLowerCase().includes(query.toLowerCase())
    );
    setFilteredRequests(filtered);
  };

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center py-12">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2" style={{ borderColor: COLORS.primaryColor }}></div>
        <p className="mt-4 text-sm" style={{ color: COLORS.secondaryText }}>
          Loading pending purchase orders...
        </p>
      </div>
    );
  }

  return (
    <div>
      {/* Search Bar */}
      <div className="mb-6">
        <SearchBar onSearch={handleSearch} placeholder="Search pending requests..." />
        <button
          onClick={handleRefresh}
          disabled={refreshing}
          className="mt-4 px-4 py-2 rounded-md text-white font-medium disabled:opacity-50 transition-colors"
          style={{ backgroundColor: COLORS.button }}
        >
          {refreshing ? 'Refreshing...' : 'Refresh'}
        </button>
      </div>

      {/* Request List */}
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
              d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4"
            />
          </svg>
          <h3 className="text-lg font-medium mb-2" style={{ color: COLORS.primaryText }}>
            No Pending Purchase Orders
          </h3>
          <p className="text-sm" style={{ color: COLORS.secondaryText }}>
            {purchaseRequests.length === 0 ? 'All requests have been processed' : 'No matching results'}
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
          onApprove={handleApprove}
          onReject={handleReject}
          showActions={true}
        />
      )}
    </div>
  );
}

