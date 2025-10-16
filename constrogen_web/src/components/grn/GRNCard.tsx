import { GRN } from '../../../shared/types/purchase';
import { COLORS } from '../../../shared/constants/theme';

interface GRNCardProps {
  grn: GRN;
  onClick: (grn: GRN) => void;
  getStatusColor: (status: string) => string;
  getStatusText: (status: string) => string;
}

export default function GRNCard({ grn, onClick, getStatusColor, getStatusText }: GRNCardProps) {
  return (
    <div
      onClick={() => onClick(grn)}
      className="bg-white rounded-lg shadow-md hover:shadow-xl transition-all duration-300 cursor-pointer p-4"
    >
      {/* Header */}
      <div className="flex justify-between items-start mb-3">
        <div className="flex-1">
          <h3 className="text-base font-semibold" style={{ color: COLORS.primaryText }}>
            {grn.number}
          </h3>
          <p className="text-sm" style={{ color: COLORS.secondaryText }}>
            PR: {grn.pr_number}
          </p>
        </div>
        <span
          className="px-2 py-1 rounded-full text-xs font-semibold text-white ml-2"
          style={{ backgroundColor: getStatusColor(grn.status) }}
        >
          {getStatusText(grn.status)}
        </span>
      </div>

      {/* Details */}
      <div className="space-y-2 text-sm">
        <div className="flex items-center" style={{ color: COLORS.secondaryText }}>
          <svg className="w-4 h-4 mr-2" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
          </svg>
          <span className="truncate">{grn.comments || 'No comments'}</span>
        </div>

        <div className="flex items-center" style={{ color: COLORS.secondaryText }}>
          <svg className="w-4 h-4 mr-2" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M6 2a1 1 0 00-1 1v1H4a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V6a2 2 0 00-2-2h-1V3a1 1 0 10-2 0v1H7V3a1 1 0 00-1-1zm0 5a1 1 0 000 2h8a1 1 0 100-2H6z" clipRule="evenodd" />
          </svg>
          <span>{grn.date}</span>
        </div>

        <div className="flex items-center" style={{ color: COLORS.secondaryText }}>
          <svg className="w-4 h-4 mr-2" fill="currentColor" viewBox="0 0 20 20">
            <path d="M3 1a1 1 0 000 2h1.22l.305 1.222a.997.997 0 00.01.042l1.358 5.43-.893.892C3.74 11.846 4.632 14 6.414 14H15a1 1 0 000-2H6.414l1-1H14a1 1 0 00.894-.553l3-6A1 1 0 0017 3H6.28l-.31-1.243A1 1 0 005 1H3zM16 16.5a1.5 1.5 0 11-3 0 1.5 1.5 0 013 0zM6.5 18a1.5 1.5 0 100-3 1.5 1.5 0 000 3z" />
          </svg>
          <span>{grn.grn_items.length} items</span>
        </div>

        {/* Images indicator */}
        {grn.grn_imgs && grn.grn_imgs.length > 0 && (
          <div className="flex items-center" style={{ color: COLORS.secondaryText }}>
            <svg className="w-4 h-4 mr-2" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M4 3a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V5a2 2 0 00-2-2H4zm12 12H4l4-8 3 6 2-4 3 6z" clipRule="evenodd" />
            </svg>
            <span>{grn.grn_imgs.length} image(s)</span>
          </div>
        )}
      </div>

      {/* Footer */}
      <div className="flex justify-end pt-3 mt-3 border-t">
        <button
          className="p-1 rounded hover:bg-gray-100 transition-colors"
          onClick={(e) => {
            e.stopPropagation();
            onClick(grn);
          }}
        >
          <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20" style={{ color: COLORS.primaryColor }}>
            <path d="M10 12a2 2 0 100-4 2 2 0 000 4z" />
            <path fillRule="evenodd" d="M.458 10C1.732 5.943 5.522 3 10 3s8.268 2.943 9.542 7c-1.274 4.057-5.064 7-9.542 7S1.732 14.057.458 10zM14 10a4 4 0 11-8 0 4 4 0 018 0z" clipRule="evenodd" />
          </svg>
        </button>
      </div>
    </div>
  );
}

