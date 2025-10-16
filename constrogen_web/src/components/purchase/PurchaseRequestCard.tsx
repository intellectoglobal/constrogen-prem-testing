import { PurchaseRequest, getStatusColor, getStatusLabel } from '../../../shared/types/purchase';
import { COLORS } from '../../../shared/constants/theme';

interface PurchaseRequestCardProps {
  request: PurchaseRequest;
  onClick: (request: PurchaseRequest) => void;
}

export default function PurchaseRequestCard({ request, onClick }: PurchaseRequestCardProps) {
  return (
    <div
      onClick={() => onClick(request)}
      className="bg-white rounded-lg shadow-md hover:shadow-xl transition-all duration-300 cursor-pointer p-4"
    >
      {/* Header */}
      <div className="flex justify-between items-start mb-3">
        <h3 className="text-base font-semibold flex-1" style={{ color: COLORS.primaryText }}>
          {request.project.name}
        </h3>
        <span
          className="px-2 py-1 rounded-full text-xs font-semibold text-white ml-2"
          style={{ backgroundColor: getStatusColor(request.status) }}
        >
          {getStatusLabel(request.status)}
        </span>
      </div>

      {/* Details */}
      <div className="space-y-2 text-sm">
        <div className="flex items-center" style={{ color: COLORS.secondaryText }}>
          <svg className="w-4 h-4 mr-2" fill="currentColor" viewBox="0 0 20 20">
            <path d="M10.394 2.08a1 1 0 00-.788 0l-7 3a1 1 0 000 1.84L5.25 8.051a.999.999 0 01.356-.257l4-1.714a1 1 0 11.788 1.838L7.667 9.088l1.94.831a1 1 0 00.787 0l7-3a1 1 0 000-1.838l-7-3zM3.31 9.397L5 10.12v4.102a8.969 8.969 0 00-1.05-.174 1 1 0 01-.89-.89 11.115 11.115 0 01.25-3.762zM9.3 16.573A9.026 9.026 0 007 14.935v-3.957l1.818.78a3 3 0 002.364 0l5.508-2.361a11.026 11.026 0 01.25 3.762 1 1 0 01-.89.89 8.968 8.968 0 00-5.35 2.524 1 1 0 01-1.4 0zM6 18a1 1 0 001-1v-2.065a8.935 8.935 0 00-2-.712V17a1 1 0 001 1z" />
          </svg>
          <span>{request.item_type}</span>
        </div>

        <div className="flex items-center" style={{ color: COLORS.secondaryText }}>
          <svg className="w-4 h-4 mr-2" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M6 2a1 1 0 00-1 1v1H4a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V6a2 2 0 00-2-2h-1V3a1 1 0 10-2 0v1H7V3a1 1 0 00-1-1zm0 5a1 1 0 000 2h8a1 1 0 100-2H6z" clipRule="evenodd" />
          </svg>
          <span>{request.date}</span>
        </div>

        <div className="flex items-center" style={{ color: COLORS.secondaryText }}>
          <svg className="w-4 h-4 mr-2" fill="currentColor" viewBox="0 0 20 20">
            <path d="M3 1a1 1 0 000 2h1.22l.305 1.222a.997.997 0 00.01.042l1.358 5.43-.893.892C3.74 11.846 4.632 14 6.414 14H15a1 1 0 000-2H6.414l1-1H14a1 1 0 00.894-.553l3-6A1 1 0 0017 3H6.28l-.31-1.243A1 1 0 005 1H3zM16 16.5a1.5 1.5 0 11-3 0 1.5 1.5 0 013 0zM6.5 18a1.5 1.5 0 100-3 1.5 1.5 0 000 3z" />
          </svg>
          <span>{request.purchs_req_items.length} items</span>
        </div>

        {/* Footer */}
        <div className="flex justify-between items-center pt-2 mt-2 border-t">
          <div className="flex items-center">
            <span className="font-semibold text-sm mr-1" style={{ color: COLORS.primaryText }}>
              PR
            </span>
            <span className="text-sm" style={{ color: COLORS.secondaryText }}>
              {request.number}
            </span>
          </div>
          <button
            className="p-1 rounded hover:bg-gray-100 transition-colors"
            onClick={(e) => {
              e.stopPropagation();
              onClick(request);
            }}
          >
            <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20" style={{ color: COLORS.primaryColor }}>
              <path d="M10 12a2 2 0 100-4 2 2 0 000 4z" />
              <path fillRule="evenodd" d="M.458 10C1.732 5.943 5.522 3 10 3s8.268 2.943 9.542 7c-1.274 4.057-5.064 7-9.542 7S1.732 14.057.458 10zM14 10a4 4 0 11-8 0 4 4 0 018 0z" clipRule="evenodd" />
            </svg>
          </button>
        </div>
      </div>
    </div>
  );
}

