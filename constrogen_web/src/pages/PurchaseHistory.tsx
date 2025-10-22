import { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { PurchaseRequest } from "shared/types/purchase";
import { approvalApi } from "../services/approvalApi";
import { showToast } from "../utils/toast";
import { COLORS } from "../../shared/constants/theme";
import PurchaseRequestCard from "../components/purchase/PurchaseRequestCard";
import PurchaseRequestDetailsModal from "../components/purchase/PurchaseRequestDetailsModal";
import SearchBar from "../components/common/SearchBar";

export default function PurchaseHistory() {
  const navigate = useNavigate();
  const location = useLocation();
  const [purchaseRequests, setPurchaseRequests] = useState<PurchaseRequest[]>(
    []
  );
  const [filteredRequests, setFilteredRequests] = useState<PurchaseRequest[]>(
    []
  );
  const [selectedRequest, setSelectedRequest] =
    useState<PurchaseRequest | null>(null);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [statusFilter, setStatusFilter] = useState<string>();

  // ✅ Fetch Data
  const fetchPurchaseRequests = async () => {
    try {
      setLoading(true);
      const data = await approvalApi.getPurchaseRequestList(
        "api/transaction/purchase/requisition/?without_pagination=1"
      );
      setPurchaseRequests(data);
    } catch (error) {
      console.error("Error fetching purchase history:", error);
      showToast({
        message: "Failed to load purchase history",
        toastType: "error",
      });
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    fetchPurchaseRequests();
  }, []);

  // ✅ Apply filters when data or filter value changes
  useEffect(() => {
    applyFilters(purchaseRequests, statusFilter);
  }, [purchaseRequests, statusFilter]);

  // ✅ Read status from query & update filter
  useEffect(() => {
    const queryParams = new URLSearchParams(location.search);
    const status = queryParams.get("status");

    if (status) {
      setStatusFilter(status); // ✅ Trigger filters automatically
    }
  }, [location.search]);

  const applyFilters = (data: PurchaseRequest[], status: string = "all") => {
    if (status === "all") {
      setFilteredRequests(data);
    } else {
      setFilteredRequests(data.filter((req) => req.status === status));
    }
  };

  const handleStatusFilterChange = (status: string) => {
    setStatusFilter(status);
  };

  const handleSearch = (query: string) => {
    if (!query.trim()) {
      applyFilters(purchaseRequests, statusFilter);
      return;
    }

    const baseList =
      statusFilter === "all"
        ? purchaseRequests
        : purchaseRequests.filter((req) => req.status === statusFilter);

    const filtered = baseList.filter(
      (request) =>
        request.number.toLowerCase().includes(query.toLowerCase()) ||
        request.project.name.toLowerCase().includes(query.toLowerCase()) ||
        request.item_type.toLowerCase().includes(query.toLowerCase())
    );

    setFilteredRequests(filtered);
  };

  // ✅ Refresh button
  const handleRefresh = () => {
    setRefreshing(true);
    fetchPurchaseRequests();
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="flex flex-col items-center justify-center py-12">
            <div
              className="animate-spin rounded-full h-12 w-12 border-b-2"
              style={{ borderColor: COLORS.primaryColor }}
            ></div>
            <p className="mt-4 text-sm" style={{ color: COLORS.secondaryText }}>
              Loading purchase history...
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen" style={{ backgroundColor: COLORS.gray50 }}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <button
            onClick={() => navigate("/purchase")}
            className="flex items-center mb-4 text-sm font-medium hover:opacity-80 transition-all duration-200 group"
            style={{ color: COLORS.primaryColor }}
          >
            <svg
              className="w-5 h-5 mr-2 transform group-hover:-translate-x-1 transition-transform"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M15 19l-7-7 7-7"
              />
            </svg>
            Back to Purchase
          </button>
          <div className="flex items-center justify-between">
            <div>
              <h1
                className="text-3xl font-bold"
                style={{ color: COLORS.primaryText }}
              >
                Purchase History
              </h1>
              <p
                className="mt-2 text-base"
                style={{ color: COLORS.secondaryText }}
              >
                View and manage all purchase requisitions
              </p>
            </div>
            <div className="hidden sm:block">
              <div className="text-right">
                <p
                  className="text-sm font-medium"
                  style={{ color: COLORS.secondaryText }}
                >
                  Total Requests
                </p>
                <p
                  className="text-3xl font-bold"
                  style={{ color: COLORS.primaryColor }}
                >
                  {purchaseRequests.length}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Filters & Search Card */}
        <div
          className="mb-6 bg-white rounded-xl shadow-sm border p-6"
          style={{ borderColor: COLORS.border }}
        >
          <div className="space-y-4">
            {/* Status Filters */}
            <div>
              <h3
                className="text-sm font-semibold mb-3"
                style={{ color: COLORS.primaryText }}
              >
                Filter by Status
              </h3>
              <div className="flex flex-wrap gap-2">
                <button
                  onClick={() => handleStatusFilterChange("all")}
                  className={`px-5 py-2.5 rounded-lg font-semibold text-sm transition-all duration-200 ${
                    statusFilter === "all"
                      ? "text-white shadow-md transform scale-105"
                      : "hover:bg-gray-100"
                  }`}
                  style={
                    statusFilter === "all"
                      ? { backgroundColor: COLORS.primaryColor }
                      : {
                          backgroundColor: COLORS.gray100,
                          color: COLORS.primaryText,
                        }
                  }
                >
                  <span className="mr-2">📋</span> All
                </button>
                <button
                  onClick={() => handleStatusFilterChange("P")}
                  className={`px-5 py-2.5 rounded-lg font-semibold text-sm transition-all duration-200 ${
                    statusFilter === "P"
                      ? "text-white shadow-md transform scale-105"
                      : "hover:bg-orange-50"
                  }`}
                  style={
                    statusFilter === "P"
                      ? { backgroundColor: COLORS.warning }
                      : {
                          backgroundColor: `${COLORS.warning}15`,
                          color: COLORS.warning,
                        }
                  }
                >
                  <span className="mr-2">⏳</span> Pending
                </button>
                <button
                  onClick={() => handleStatusFilterChange("A")}
                  className={`px-5 py-2.5 rounded-lg font-semibold text-sm transition-all duration-200 ${
                    statusFilter === "A"
                      ? "text-white shadow-md transform scale-105"
                      : "hover:bg-green-50"
                  }`}
                  style={
                    statusFilter === "A"
                      ? { backgroundColor: COLORS.success }
                      : {
                          backgroundColor: `${COLORS.success}15`,
                          color: COLORS.success,
                        }
                  }
                >
                  <span className="mr-2">✅</span> Approved
                </button>
                <button
                  onClick={() => handleStatusFilterChange("R")}
                  className={`px-5 py-2.5 rounded-lg font-semibold text-sm transition-all duration-200 ${
                    statusFilter === "R"
                      ? "text-white shadow-md transform scale-105"
                      : "hover:bg-red-50"
                  }`}
                  style={
                    statusFilter === "R"
                      ? { backgroundColor: COLORS.error }
                      : {
                          backgroundColor: `${COLORS.error}15`,
                          color: COLORS.error,
                        }
                  }
                >
                  <span className="mr-2">❌</span> Rejected
                </button>
                <button
                  onClick={() => handleStatusFilterChange("C")}
                  className={`px-5 py-2.5 rounded-lg font-semibold text-sm transition-all duration-200 ${
                    statusFilter === "C"
                      ? "text-white shadow-md transform scale-105"
                      : "hover:bg-blue-50"
                  }`}
                  style={
                    statusFilter === "C"
                      ? { backgroundColor: COLORS.info }
                      : {
                          backgroundColor: `${COLORS.info}15`,
                          color: COLORS.info,
                        }
                  }
                >
                  <span className="mr-2">🔒</span> Closed
                </button>
              </div>
            </div>

            {/* Search Bar */}
            <div className="flex gap-3">
              <div className="flex-1">
                <SearchBar
                  onSearch={handleSearch}
                  placeholder="Search by PR number, project, or item type..."
                />
              </div>
              <button
                onClick={handleRefresh}
                disabled={refreshing}
                className="px-6 py-2 rounded-lg text-white font-semibold disabled:opacity-50 transition-all duration-200 shadow-sm hover:shadow-md flex items-center gap-2"
                style={{ backgroundColor: COLORS.primaryColor }}
              >
                <svg
                  className={`w-5 h-5 ${refreshing ? "animate-spin" : ""}`}
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
                  />
                </svg>
                <span className="hidden sm:inline">
                  {refreshing ? "Refreshing..." : "Refresh"}
                </span>
              </button>
            </div>

            {/* Results Count */}
            {filteredRequests.length !== purchaseRequests.length && (
              <div className="text-sm" style={{ color: COLORS.secondaryText }}>
                Showing{" "}
                <span
                  className="font-semibold"
                  style={{ color: COLORS.primaryColor }}
                >
                  {filteredRequests.length}
                </span>{" "}
                of {purchaseRequests.length} requests
              </div>
            )}
          </div>
        </div>

        {/* Purchase List */}
        {filteredRequests.length === 0 ? (
          <div
            className="bg-white rounded-xl shadow-sm border p-16 text-center"
            style={{ borderColor: COLORS.border }}
          >
            <div
              className="inline-flex items-center justify-center w-24 h-24 rounded-full mb-6"
              style={{ backgroundColor: `${COLORS.primaryColor}10` }}
            >
              <svg
                className="h-12 w-12"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                style={{ color: COLORS.primaryColor }}
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                />
              </svg>
            </div>
            <h3
              className="text-xl font-bold mb-2"
              style={{ color: COLORS.primaryText }}
            >
              No Purchase Requests Found
            </h3>
            <p
              className="text-base mb-6"
              style={{ color: COLORS.secondaryText }}
            >
              {purchaseRequests.length === 0
                ? "No purchase requests have been created yet"
                : "Try changing your filters or search term"}
            </p>
            {purchaseRequests.length === 0 && (
              <button
                onClick={() => navigate("/purchase-requisition")}
                className="inline-flex items-center px-6 py-3 rounded-lg text-white font-semibold shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105"
                style={{ backgroundColor: COLORS.primaryColor }}
              >
                <svg
                  className="w-5 h-5 mr-2"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 4v16m8-8H4"
                  />
                </svg>
                Create First Request
              </button>
            )}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
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
