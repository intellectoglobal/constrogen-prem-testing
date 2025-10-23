import { PurchaseRequest, getStatusColor, getStatusLabel } from '../../../shared/types/purchase';
import { COLORS } from '../../../shared/constants/theme';

interface PurchaseRequestDetailsModalProps {
  request: PurchaseRequest;
  onClose: () => void;
  onApprove?: (request: PurchaseRequest) => void;
  onReject?: (request: PurchaseRequest) => void;
  onEdit?: (request: PurchaseRequest) => void;
  showActions?: boolean;
  showEditButton?: boolean;
}

export default function PurchaseRequestDetailsModal({
  request,
  onClose,
  onApprove,
  onReject,
  onEdit,
  showActions = false,
  showEditButton = false,
}: PurchaseRequestDetailsModalProps) {
  return (
    <div
      className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50"
      onClick={onClose}
    >
      <div
        className="bg-white rounded-lg shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="sticky top-0 bg-white border-b px-6 py-4 flex justify-between items-center">
          <div>
            <h2 className="text-2xl font-bold" style={{ color: COLORS.primaryText }}>
              Purchase Request Details
            </h2>
            <p className="text-sm mt-1" style={{ color: COLORS.secondaryText }}>
              PR #{request.number}
            </p>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-full transition-colors"
          >
            <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Content */}
        <div className="p-6">
          {/* Status and Project Info */}
          <div className="bg-gray-50 rounded-lg p-4 mb-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="text-xs font-semibold uppercase" style={{ color: COLORS.secondaryText }}>
                  Status
                </label>
                <div className="mt-1">
                  <span
                    className="inline-block px-3 py-1 rounded-full text-sm font-semibold text-white"
                    style={{ backgroundColor: getStatusColor(request.status) }}
                  >
                    {getStatusLabel(request.status)}
                  </span>
                </div>
              </div>
              <div>
                <label className="text-xs font-semibold uppercase" style={{ color: COLORS.secondaryText }}>
                  Date
                </label>
                <p className="mt-1 font-medium" style={{ color: COLORS.primaryText }}>
                  {request.date}
                </p>
              </div>
              <div>
                <label className="text-xs font-semibold uppercase" style={{ color: COLORS.secondaryText }}>
                  Project
                </label>
                <p className="mt-1 font-medium" style={{ color: COLORS.primaryText }}>
                  {request.project.name}
                </p>
              </div>
              <div>
                <label className="text-xs font-semibold uppercase" style={{ color: COLORS.secondaryText }}>
                  Item Type
                </label>
                <p className="mt-1 font-medium" style={{ color: COLORS.primaryText }}>
                  {request.item_type}
                </p>
              </div>
            </div>
          </div>

          {/* Items List */}
          <div className="mb-6">
            <h3 className="text-lg font-semibold mb-3" style={{ color: COLORS.primaryText }}>
              Items ({request.purchs_req_items.length})
            </h3>
            <div className="space-y-3">
              {request.purchs_req_items.map((item) => (
                <div key={item.key} className="bg-white border rounded-lg p-4">
                  <div className="flex justify-between items-start">
                    <div className="flex-1">
                      <h4 className="font-medium mb-1" style={{ color: COLORS.primaryText }}>
                        {item.items.descr}
                      </h4>
                      <div className="grid grid-cols-2 md:grid-cols-3 gap-2 text-sm" style={{ color: COLORS.secondaryText }}>
                        <div>
                          <span className="font-semibold">Quantity:</span> {item.qty}
                        </div>
                        <div>
                          <span className="font-semibold">UOM:</span> {item.uom}
                        </div>
                        {item.unit && (
                          <div>
                            <span className="font-semibold">Unit:</span> {item.unit}
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Additional Info */}
          {request.desc && (
            <div className="mb-6">
              <h3 className="text-lg font-semibold mb-2" style={{ color: COLORS.primaryText }}>
                Description
              </h3>
              <p className="text-sm" style={{ color: COLORS.secondaryText }}>
                {request.desc}
              </p>
            </div>
          )}

          {/* Created By */}
          <div className="bg-gray-50 rounded-lg p-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
              <div>
                <label className="font-semibold" style={{ color: COLORS.primaryText }}>
                  Created By:
                </label>
                <p style={{ color: COLORS.secondaryText }}>{request.createdby}</p>
              </div>
              <div>
                <label className="font-semibold" style={{ color: COLORS.primaryText }}>
                  Created Date:
                </label>
                <p style={{ color: COLORS.secondaryText }}>
                  {new Date(request.createddttm).toLocaleString()}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Actions */}
        {(showActions || showEditButton) && (
          <div className="sticky bottom-0 bg-gray-50 border-t px-6 py-4 flex justify-end space-x-3">
            <button
              onClick={onClose}
              className="px-6 py-2 rounded-md font-medium border transition-colors"
              style={{ borderColor: COLORS.inputBorder, color: COLORS.primaryText }}
            >
              {showEditButton ? 'Close' : 'Cancel'}
            </button>
            {showEditButton && onEdit && request.status === 'P' && (
              <button
                onClick={() => onEdit(request)}
                className="px-6 py-2 rounded-md text-white font-medium transition-colors hover:opacity-90 flex items-center gap-2"
                style={{ backgroundColor: COLORS.info }}
              >
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                </svg>
                Edit Request
              </button>
            )}
            {onReject && (
              <button
                onClick={() => onReject(request)}
                className="px-6 py-2 rounded-md text-white font-medium transition-colors hover:opacity-90"
                style={{ backgroundColor: COLORS.error }}
              >
                Reject
              </button>
            )}
            {onApprove && (
              <button
                onClick={() => onApprove(request)}
                className="px-6 py-2 rounded-md text-white font-medium transition-colors hover:opacity-90"
                style={{ backgroundColor: '#4CAF50' }}
              >
                Approve
              </button>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

