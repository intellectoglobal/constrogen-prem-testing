import React from 'react';
import { useNavigate } from 'react-router-dom';
import { COLORS } from '@shared/constants/theme';

interface MenuItem {
  title: string;
  iconName: string;
  route: string;
  description?: string;
}

export default function Purchase() {
  const navigate = useNavigate();

  const menuItems: MenuItem[] = [
    {
      title: 'Purchase Requisition',
      iconName: 'receipt',
      route: '/purchase-requisition',
      description: 'Create new purchase requests'
    },
    {
      title: 'Purchase History',
      iconName: 'description',
      route: '/purchase-history',
      description: 'View past purchase orders'
    },
    {
      title: 'Purchase Order With GRN',
      iconName: 'history',
      route: '/purchase-order-grn',
      description: 'Goods Receipt Notes'
    },
  ];

  const handleCardClick = (route: string) => {
    navigate(route);
  };

  const getIcon = (iconName: string) => {
    // Material Icons mapping
    switch (iconName) {
      case 'receipt':
        return (
          <svg className="w-12 h-12" fill="currentColor" viewBox="0 0 24 24">
            <path d="M19.5 3.5L18 2l-1.5 1.5L15 2l-1.5 1.5L12 2l-1.5 1.5L9 2 7.5 3.5 6 2v14H3v3c0 1.66 1.34 3 3 3h12c1.66 0 3-1.34 3-3V2l-1.5 1.5zM15 20H6c-.55 0-1-.45-1-1v-1h10v2zm4-1c0 .55-.45 1-1 1s-1-.45-1-1v-3H8V5h11v14z"/>
            <path d="M9 7h6v2H9zm7 0h1v2h-1zm-7 3h6v2H9zm7 0h1v2h-1z"/>
          </svg>
        );
      case 'description':
        return (
          <svg className="w-12 h-12" fill="currentColor" viewBox="0 0 24 24">
            <path d="M8 16h8v2H8zm0-4h8v2H8zm6-10H6c-1.1 0-2 .9-2 2v16c0 1.1.89 2 1.99 2H18c1.1 0 2-.9 2-2V8l-6-6zm4 18H6V4h7v5h5v11z"/>
          </svg>
        );
      case 'history':
        return (
          <svg className="w-12 h-12" fill="currentColor" viewBox="0 0 24 24">
            <path d="M13 3c-4.97 0-9 4.03-9 9H1l3.89 3.89.07.14L9 12H6c0-3.87 3.13-7 7-7s7 3.13 7 7-3.13 7-7 7c-1.93 0-3.68-.79-4.94-2.06l-1.42 1.42C8.27 19.99 10.51 21 13 21c4.97 0 9-4.03 9-9s-4.03-9-9-9zm-1 5v5l4.28 2.54.72-1.21-3.5-2.08V8H12z"/>
          </svg>
        );
      default:
        return (
          <svg className="w-12 h-12" fill="currentColor" viewBox="0 0 24 24">
            <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z"/>
          </svg>
        );
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Page Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold" style={{ color: COLORS.primaryText }}>
            Purchase Management
          </h1>
          <p className="mt-2 text-sm" style={{ color: COLORS.secondaryText }}>
            Manage purchase orders, requisitions, and goods receipt notes
          </p>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {menuItems.map((item, index) => (
            <div
              key={index}
              onClick={() => handleCardClick(item.route)}
              className="bg-white rounded-lg shadow-md hover:shadow-xl transition-all duration-300 cursor-pointer transform hover:-translate-y-1 p-6"
            >
              <div className="flex flex-col items-center text-center">
                <div
                  className="mb-4 p-4 rounded-full"
                  style={{ backgroundColor: COLORS.blueBox, color: COLORS.primary }}
                >
                  {getIcon(item.iconName)}
                </div>
                <h3 className="text-lg font-semibold mb-2" style={{ color: COLORS.primaryText }}>
                  {item.title}
                </h3>
                {item.description && (
                  <p className="text-sm" style={{ color: COLORS.secondaryText }}>
                    {item.description}
                  </p>
                )}
              </div>
            </div>
          ))}
        </div>

        {/* Coming Soon Section */}
        <div className="mt-12 bg-white rounded-lg shadow-md p-8 text-center">
          <div className="inline-block p-4 rounded-full bg-gray-100 mb-4">
            <svg className="w-12 h-12 text-gray-400" fill="currentColor" viewBox="0 0 24 24">
              <path d="M11.99 2C6.47 2 2 6.48 2 12s4.47 10 9.99 10C17.52 22 22 17.52 22 12S17.52 2 11.99 2zM12 20c-4.42 0-8-3.58-8-8s3.58-8 8-8 8 3.58 8 8-3.58 8-8 8zm.5-13H11v6l5.25 3.15.75-1.23-4.5-2.67z"/>
            </svg>
          </div>
          <h3 className="text-xl font-semibold mb-2" style={{ color: COLORS.primaryText }}>
            More Features Coming Soon
          </h3>
          <p className="text-sm" style={{ color: COLORS.secondaryText }}>
            Purchase analytics, advanced reporting, and more features are in development
          </p>
        </div>
      </div>
    </div>
  );
}

