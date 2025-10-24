import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import { RootState } from "../store";
import { COLORS } from "../../shared/constants/theme";
import { useState, useEffect } from "react";
import { approvalApi } from "../services/approvalApi";
import { grnApi } from "../services/grnApi";

export default function Dashboard() {
  const navigate = useNavigate();
  const user = useSelector((state: RootState) => state.user);
  const [currentTime, setCurrentTime] = useState(new Date());
  const [pendingApprovalsCount, setPendingApprovalsCount] = useState<number>(0);
  const [activeRequisitionsCount, setActiveRequisitionsCount] = useState<number>(0);
  const [completedGRNsCount, setCompletedGRNsCount] = useState<number>(0);
  const [totalRequisitionsCount, setTotalRequisitionsCount] = useState<number>(0);
  const [loading, setLoading] = useState(true);
  const [recentActivities, setRecentActivities] = useState<Array<{
    action: string;
    time: string;
    icon: string;
    color: string;
  }>>([]);

  useEffect(() => {
    const timer = setInterval(() => setCurrentTime(new Date()), 60000);
    return () => clearInterval(timer);
  }, []);

  // Fetch dashboard counts and recent activities
  useEffect(() => {
    const fetchDashboardData = async () => {
      setLoading(true);
      try {
        // Fetch all data in parallel
        const [pendingData, activeData, grnData, totalData, allRequests, allGRNs] = await Promise.all([
          approvalApi.getPurchaseRequestList('api/transaction/purchase/requisition/?without_pagination=1&status=P'),
          approvalApi.getPurchaseRequestList('api/transaction/purchase/requisition/?without_pagination=1&status=P'),
          grnApi.getGRNList('api/transaction/grn/?without_pagination=1&status=C'),
          approvalApi.getPurchaseRequestList('api/transaction/purchase/requisition/?without_pagination=1'),
          approvalApi.getPurchaseRequestList('api/transaction/purchase/requisition/?without_pagination=1'),
          grnApi.getGRNList('api/transaction/grn/?without_pagination=1'),
        ]);

        setPendingApprovalsCount(pendingData.length || 0);
        setActiveRequisitionsCount(activeData.length || 0);
        setCompletedGRNsCount(grnData.length || 0);
        setTotalRequisitionsCount(totalData.length || 0);

        // Generate recent activities from last 2 days
        const twoDaysAgo = new Date();
        twoDaysAgo.setDate(twoDaysAgo.getDate() - 2);

        const activities: Array<{ action: string; time: string; icon: string; color: string; timestamp: Date }> = [];

        // Add purchase requests from last 2 days
        allRequests
          .filter((req: any) => {
            const createdDate = new Date(req.createddttm);
            return createdDate >= twoDaysAgo;
          })
          .forEach((req: any) => {
            const createdDate = new Date(req.createddttm);
            activities.push({
              action: `Purchase Requisition #${req.number} ${req.status === 'A' ? 'approved' : req.status === 'R' ? 'rejected' : 'submitted'}`,
              time: getRelativeTime(createdDate),
              icon: req.status === 'A' ? '✓' : req.status === 'R' ? '✗' : '📝',
              color: req.status === 'A' ? COLORS.success : req.status === 'R' ? COLORS.error : COLORS.warning,
              timestamp: createdDate,
            });
          });

        // Add GRNs from last 2 days
        allGRNs
          .filter((grn: any) => {
            const createdDate = new Date(grn.createddttm || grn.date);
            return createdDate >= twoDaysAgo;
          })
          .forEach((grn: any) => {
            const createdDate = new Date(grn.createddttm || grn.date);
            const statusText = ['P', 'PR'].includes(grn.status) ? 'open' : 'closed';
            activities.push({
              action: `GRN #${grn.number} ${statusText}`,
              time: getRelativeTime(createdDate),
              icon: '📦',
              color: COLORS.info,
              timestamp: createdDate,
            });
          });

        // Sort by timestamp (most recent first) and take top 4
        const sortedActivities = activities
          .sort((a, b) => b.timestamp.getTime() - a.timestamp.getTime())
          .slice(0, 4)
          .map(({ timestamp, ...rest }) => rest); // Remove timestamp from final output

        setRecentActivities(sortedActivities.length > 0 ? sortedActivities : [
          { action: 'No recent activity in the last 2 days', time: '', icon: 'ℹ️', color: COLORS.secondaryText }
        ]);
      } catch (error) {
        console.error('Error fetching dashboard data:', error);
        setRecentActivities([
          { action: 'Failed to load recent activity', time: '', icon: '⚠️', color: COLORS.error }
        ]);
      } finally {
        setLoading(false);
      }
    };

    // Helper function to get relative time
    const getRelativeTime = (date: Date): string => {
      const now = new Date();
      const diffMs = now.getTime() - date.getTime();
      const diffMins = Math.floor(diffMs / 60000);
      const diffHours = Math.floor(diffMs / 3600000);
      const diffDays = Math.floor(diffMs / 86400000);

      if (diffMins < 1) return 'Just now';
      if (diffMins < 60) return `${diffMins} minute${diffMins > 1 ? 's' : ''} ago`;
      if (diffHours < 24) return `${diffHours} hour${diffHours > 1 ? 's' : ''} ago`;
      if (diffDays === 1) return '1 day ago';
      return `${diffDays} days ago`;
    };

    fetchDashboardData();
  }, []);

  const stats = [
    {
      title: 'Pending Approvals',
      value: loading ? '...' : String(pendingApprovalsCount),
      change: 'Requires action',
      changeType: 'increase',
      icon: (
        <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
      ),
      color: COLORS.warning,
      bgColor: '#fef3c7',
      path: '/approvals',
    },
    {
      title: 'Active Requisition',
      value: loading ? '...' : String(activeRequisitionsCount),
      change: 'Pending status',
      changeType: 'increase',
      icon: (
        <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
        </svg>
      ),
      color: COLORS.info,
      bgColor: '#dbeafe',
      path: "/purchase-history/?status=P"
    },
    {
      title: 'Completed GRNs',
      value: loading ? '...' : String(completedGRNsCount),
      change: 'Closed status',
      changeType: 'increase',
      icon: (
        <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4" />
        </svg>
      ),
      color: COLORS.success,
      bgColor: '#d1fae5',
      path: "/purchase-order-grn"
    },
    {
      title: 'Total Requisitions',
      value: loading ? '...' : String(totalRequisitionsCount),
      change: 'All time',
      changeType: 'neutral',
      icon: (
        <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
        </svg>
      ),
      color: COLORS.primaryColor,
      bgColor: COLORS.blueBox,
      path: "/purchase-history"
    },
  ];

  const quickActions = [
    {
      title: 'Create Purchase Requisition',
      description: 'Start a new purchase request',
      icon: (
        <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
        </svg>
      ),
      path: '/purchase-requisition',
      color: COLORS.primaryColor,
    },
    {
      title: 'Review Approvals',
      description: 'View pending requests',
      icon: (
        <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
        </svg>
      ),
      path: '/approvals',
      color: COLORS.warning,
    },
    {
      title: 'Purchase Orders',
      description: 'Manage all purchase orders',
      icon: (
        <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
        </svg>
      ),
      path: '/purchase',
      color: COLORS.info,
    },
    {
      title: 'GRN Management',
      description: 'Track goods receipts',
      icon: (
        <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
        </svg>
      ),
      path: '/purchase-order-grn',
      color: COLORS.success,
    },
  ];

  return (
    <div className="min-h-screen" style={{ backgroundColor: COLORS.gray50 }}>
      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Welcome Header */}
        <div className="mb-8">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
            <div>
              <h1 className="text-3xl font-bold" style={{ color: COLORS.primaryText }}>
                Welcome back, {user?.first_name || user?.user_name || "User"}! 👋
              </h1>
              <p className="mt-2 text-base" style={{ color: COLORS.secondaryText }}>
                {currentTime.toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
              </p>
            </div>
            <div className="mt-4 sm:mt-0">
              <button
                onClick={() => navigate('/purchase-requisition')}
                className="inline-flex items-center px-6 py-3 rounded-lg text-white font-semibold shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105"
                style={{ backgroundColor: COLORS.primaryColor }}
              >
                <svg className="w-5 h-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                </svg>
                New Requisition
              </button>
            </div>
          </div>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {stats.map((stat, index) => (
            <div
              key={index}
              className="bg-white rounded-xl shadow-sm hover:shadow-md transition-all duration-300 p-6 border"
              style={{ borderColor: COLORS.border, cursor:"pointer" }}
              onClick={() => navigate(stat.path)}
            >
              <div className="flex items-center justify-between mb-4">
                <div
                  className="p-3 rounded-lg"
                  style={{ backgroundColor: stat.bgColor, color: stat.color }}
                >
                  {stat.icon}
                </div>
              </div>
              <h3 className="text-sm font-medium mb-1" style={{ color: COLORS.secondaryText }}>
                {stat.title}
              </h3>
              <div className="flex items-baseline justify-between">
                <p className="text-3xl font-bold" style={{ color: COLORS.primaryText }}>
                  {stat.value}
                </p>
              </div>
              <p className="mt-2 text-xs" style={{ color: stat.color }}>
                {stat.change}
              </p>
            </div>
          ))}
        </div>

        {/* Main Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-8">
          {/* Quick Actions */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-xl shadow-sm p-6 border" style={{ borderColor: COLORS.border }}>
              <h2 className="text-xl font-bold mb-6" style={{ color: COLORS.primaryText }}>
                Quick Actions
              </h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {quickActions.map((action, index) => (
                  <button
                    key={index}
                    onClick={() => navigate(action.path)}
                    className="flex items-start p-4 rounded-lg border-2 border-transparent hover:border-current transition-all duration-300 text-left group"
                    style={{ backgroundColor: COLORS.gray50 }}
                  >
                    <div
                      className="p-2 rounded-lg mr-4 group-hover:scale-110 transition-transform duration-300"
                      style={{ backgroundColor: `${action.color}20`, color: action.color }}
                    >
                      {action.icon}
                    </div>
                    <div className="flex-1">
                      <h3 className="font-semibold mb-1" style={{ color: COLORS.primaryText }}>
                        {action.title}
                      </h3>
                      <p className="text-sm" style={{ color: COLORS.secondaryText }}>
                        {action.description}
                      </p>
                    </div>
                    <svg className="w-5 h-5 mt-1 opacity-0 group-hover:opacity-100 transition-opacity" fill="none" viewBox="0 0 24 24" stroke="currentColor" style={{ color: action.color }}>
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                    </svg>
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Recent Activity */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-xl shadow-sm p-6 border" style={{ borderColor: COLORS.border }}>
              <h2 className="text-xl font-bold mb-6" style={{ color: COLORS.primaryText }}>
                Recent Activity
              </h2>
              <div className="space-y-4">
                {recentActivities.map((activity, index) => (
                  <div key={index} className="flex items-start">
                    <div
                      className="flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center text-sm mr-3"
                      style={{ backgroundColor: `${activity.color}20` }}
                    >
                      {activity.icon}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium" style={{ color: COLORS.primaryText }}>
                        {activity.action}
                      </p>
                      <p className="text-xs mt-1" style={{ color: COLORS.secondaryText }}>
                        {activity.time}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
              <button
                onClick={() => navigate('/purchase-history')}
                className="mt-6 w-full py-2 px-4 rounded-lg border font-medium text-sm hover:bg-gray-50 transition-colors"
                style={{ borderColor: COLORS.border, color: COLORS.primaryColor }}
              >
                View All Activity
              </button>
            </div>
          </div>
        </div>

        {/* User Profile Card */}
        {user && (
          <div className="bg-gradient-to-r from-white to-gray-50 rounded-xl shadow-sm p-6 border" style={{ borderColor: COLORS.border }}>
            <div className="flex items-center mb-6">
              <div
                className="w-16 h-16 rounded-full flex items-center justify-center text-2xl font-bold text-white mr-4"
                style={{ backgroundColor: COLORS.primaryColor }}
              >
                {(user.first_name?.[0] || user.user_name?.[0] || 'U').toUpperCase()}
              </div>
              <div>
                <h3 className="text-xl font-bold" style={{ color: COLORS.primaryText }}>
                  {user.first_name} {user.last_name}
                </h3>
                <p className="text-sm" style={{ color: COLORS.secondaryText }}>
                  {user.email}
                </p>
              </div>
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
              <div className="p-4 rounded-lg" style={{ backgroundColor: COLORS.gray50 }}>
                <p className="text-xs font-medium mb-1" style={{ color: COLORS.secondaryText }}>Username</p>
                <p className="text-sm font-semibold" style={{ color: COLORS.primaryText }}>{user.user_name}</p>
              </div>
              <div className="p-4 rounded-lg" style={{ backgroundColor: COLORS.gray50 }}>
                <p className="text-xs font-medium mb-1" style={{ color: COLORS.secondaryText }}>Email</p>
                <p className="text-sm font-semibold truncate" style={{ color: COLORS.primaryText }}>{user.email}</p>
              </div>
              <div className="p-4 rounded-lg" style={{ backgroundColor: COLORS.gray50 }}>
                <p className="text-xs font-medium mb-1" style={{ color: COLORS.secondaryText }}>Phone</p>
                <p className="text-sm font-semibold" style={{ color: COLORS.primaryText }}>{user.phone_number || "N/A"}</p>
              </div>
              <div className="p-4 rounded-lg" style={{ backgroundColor: COLORS.gray50 }}>
                <p className="text-xs font-medium mb-1" style={{ color: COLORS.secondaryText }}>Status</p>
                <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium" style={{ backgroundColor: '#d1fae5', color: COLORS.success }}>
                  Active
                </span>
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}

