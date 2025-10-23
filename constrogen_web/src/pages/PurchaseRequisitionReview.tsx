import { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { COLORS } from '../../shared/constants/theme';
import { RequisitionData, requisitionApi } from '../services/requisitionApi';
import { showToast } from '../utils/toast';

export default function PurchaseRequisitionReview() {
  const navigate = useNavigate();
  const location = useLocation();
  const requisitionData = location.state as RequisitionData & {
    project: string;
    itemType: string;
    totalAmount: string;
    items: Array<{
      key: number;
      name: string;
      qty: string;
      uom: string;
      unitPrice?: string;
      totalPrice?: string;
    }>;
    isEditing?: boolean;
    requestKey?: number;
  };

  const [isSubmitting, setIsSubmitting] = useState(false);
  const isEditMode = requisitionData?.isEditing && requisitionData?.requestKey;

  // Debug logging
  console.log('🔍 Review Page - Requisition Data:', requisitionData);
  console.log('🔧 Is Edit Mode:', isEditMode);
  console.log('🔑 Request Key:', requisitionData?.requestKey);
  console.log('📝 Is Editing Flag:', requisitionData?.isEditing);

  if (!requisitionData) {
    navigate('/purchase-requisition');
    return null;
  }

  const handleSubmit = async () => {
    setIsSubmitting(true);
    try {
      // Prepare data for submission
      const submitData: RequisitionData = {
        proj_key: requisitionData.proj_key,
        item_type_key: requisitionData.item_type_key,
        docid: requisitionData.docid,
        number: requisitionData.number,
        stage: requisitionData.stage,
        requiredDate: requisitionData.requiredDate,
        notes: requisitionData.notes,
        items: requisitionData.items.map(item => ({
          item_key: item.item_key,
          name: item.name,
          qty: item.qty,
          item_uom_key: item.item_uom_key,
          uom: item.uom,
          unitPrice: item.unitPrice,
          totalPrice: item.totalPrice,
        })),
      };

      console.log('📤 Submitting with mode:', isEditMode ? 'UPDATE' : 'CREATE');
      console.log('📦 Submit Data:', submitData);
      
      // Use UPDATE if editing, CREATE if new
      if (isEditMode) {
        console.log('🔄 Calling UPDATE API with key:', requisitionData.requestKey);
        await requisitionApi.updateRequisition(requisitionData.requestKey!, submitData);
        showToast({
          message: 'Purchase requisition updated successfully!',
          toastType: 'success',
        });
      } else {
        console.log('➕ Calling CREATE API');
        await requisitionApi.submitRequisition(submitData);
        showToast({
          message: 'Purchase requisition submitted successfully!',
          toastType: 'success',
        });
      }

      // Navigate to purchase history
      navigate('/purchase-history');
    } catch (error: any) {
      console.error('Error submitting requisition:', error);
      const errorMessage = error?.response?.data?.detail || 
                          error?.response?.data?.message || 
                          error?.message ||
                          `Failed to ${isEditMode ? 'update' : 'submit'} purchase requisition`;
      showToast({
        message: errorMessage,
        toastType: 'error',
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleEdit = () => {
    navigate('/purchase-requisition', { state: requisitionData });
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-6">
          <button
            onClick={handleEdit}
            className="flex items-center mb-4 text-sm font-medium hover:opacity-80 transition-opacity"
            style={{ color: COLORS.primaryColor }}
          >
            <svg className="w-5 h-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
            Back to Edit
          </button>
          <h1 className="text-3xl font-bold" style={{ color: COLORS.primaryText }}>
            {isEditMode ? 'Edit Purchase Request' : 'Request Review'}
          </h1>
          <p className="mt-2 text-sm" style={{ color: COLORS.secondaryText }}>
            {isEditMode 
              ? 'Review your changes before updating the purchase requisition'
              : 'Review your purchase requisition before submitting'}
          </p>
        </div>

        {/* Purchase Request Summary */}
        <div className="bg-white rounded-lg shadow-md p-6 mb-6">
          <h2 className="text-xl font-semibold mb-4" style={{ color: COLORS.primaryText }}>
            Purchase Request Summary
          </h2>

          {/* Basic Information */}
          <div className="mb-6">
            <h3 className="text-lg font-medium mb-3" style={{ color: COLORS.primaryText }}>
              Basic Information
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="text-sm font-semibold" style={{ color: COLORS.secondaryText }}>
                  PR Number:
                </label>
                <p className="mt-1 font-medium" style={{ color: COLORS.primaryText }}>
                  {requisitionData.number}
                </p>
              </div>
              <div>
                <label className="text-sm font-semibold" style={{ color: COLORS.secondaryText }}>
                  Project:
                </label>
                <p className="mt-1 font-medium" style={{ color: COLORS.primaryText }}>
                  {requisitionData.project}
                </p>
              </div>
              <div>
                <label className="text-sm font-semibold" style={{ color: COLORS.secondaryText }}>
                  Item Type:
                </label>
                <p className="mt-1 font-medium" style={{ color: COLORS.primaryText }}>
                  {requisitionData.itemType}
                </p>
              </div>
              {requisitionData.stage && (
                <div>
                  <label className="text-sm font-semibold" style={{ color: COLORS.secondaryText }}>
                    Priority:
                  </label>
                  <p className="mt-1 font-medium" style={{ color: COLORS.primaryText }}>
                    {requisitionData.stage}
                  </p>
                </div>
              )}
              {requisitionData.requiredDate && (
                <div>
                  <label className="text-sm font-semibold" style={{ color: COLORS.secondaryText }}>
                    Required Date:
                  </label>
                  <p className="mt-1 font-medium" style={{ color: COLORS.primaryText }}>
                    {new Date(requisitionData.requiredDate).toLocaleDateString()}
                  </p>
                </div>
              )}
            </div>

            {requisitionData.notes && (
              <div className="mt-4">
                <label className="text-sm font-semibold" style={{ color: COLORS.secondaryText }}>
                  Notes:
                </label>
                <p className="mt-1 italic" style={{ color: COLORS.primaryText }}>
                  {requisitionData.notes}
                </p>
              </div>
            )}
          </div>
        </div>

        {/* Items Summary */}
        <div className="bg-white rounded-lg shadow-md p-6 mb-6">
          <h2 className="text-xl font-semibold mb-4" style={{ color: COLORS.primaryText }}>
            Items ({requisitionData.items.length})
          </h2>

          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-4 py-3 text-left text-xs font-semibold uppercase" style={{ color: COLORS.secondaryText }}>
                    Item
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-semibold uppercase" style={{ color: COLORS.secondaryText }}>
                    Quantity
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-semibold uppercase" style={{ color: COLORS.secondaryText }}>
                    UOM
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-semibold uppercase" style={{ color: COLORS.secondaryText }}>
                    Unit Price
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-semibold uppercase" style={{ color: COLORS.secondaryText }}>
                    Total
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y">
                {requisitionData.items.map((item, index) => (
                  <tr key={index} className="hover:bg-gray-50">
                    <td className="px-4 py-3" style={{ color: COLORS.primaryText }}>
                      {item.name}
                    </td>
                    <td className="px-4 py-3" style={{ color: COLORS.primaryText }}>
                      {item.qty}
                    </td>
                    <td className="px-4 py-3" style={{ color: COLORS.primaryText }}>
                      {item.uom}
                    </td>
                    <td className="px-4 py-3" style={{ color: COLORS.primaryText }}>
                      {item.unitPrice ? `$${item.unitPrice}` : '-'}
                    </td>
                    <td className="px-4 py-3 font-medium" style={{ color: COLORS.primaryColor }}>
                      {item.totalPrice ? `$${item.totalPrice}` : '-'}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Total Amount */}
          <div className="mt-6 flex justify-end">
            <div className="bg-blue-50 rounded-lg px-8 py-4 min-w-[250px]">
              <div className="flex justify-between items-center">
                <span className="text-base font-semibold" style={{ color: COLORS.secondaryText }}>
                  Total Amount:
                </span>
                <span className="text-2xl font-bold" style={{ color: COLORS.primaryColor }}>
                  ${requisitionData.totalAmount}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex gap-4 justify-end">
          <button
            onClick={handleEdit}
            disabled={isSubmitting}
            className="px-6 py-3 border rounded-md font-medium transition-colors disabled:opacity-50"
            style={{ borderColor: COLORS.inputBorder, color: COLORS.primaryText }}
          >
            Edit Request
          </button>
          <button
            onClick={handleSubmit}
            disabled={isSubmitting}
            className="px-6 py-3 rounded-md text-white font-medium flex items-center gap-2 disabled:opacity-50 transition-colors"
            style={{ backgroundColor: COLORS.button }}
          >
            {isSubmitting ? (
              <>
                <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                {isEditMode ? 'Updating...' : 'Submitting...'}
              </>
            ) : (
              <>
                {isEditMode ? 'Update Request' : 'Submit Request'}
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
                </svg>
              </>
            )}
          </button>
        </div>

        {/* Information Box */}
        <div className="mt-6 bg-blue-50 border-l-4 p-4 rounded" style={{ borderColor: COLORS.primaryColor }}>
          <div className="flex">
            <svg className="w-6 h-6 mr-3" style={{ color: COLORS.primaryColor }} fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <div>
              <p className="text-sm font-medium" style={{ color: COLORS.primaryText }}>
                {isEditMode ? 'Review Before Updating' : 'Review Before Submitting'}
              </p>
              <p className="text-sm mt-1" style={{ color: COLORS.secondaryText }}>
                {isEditMode 
                  ? 'Please review all changes carefully. Once updated, the purchase requisition will be modified.'
                  : 'Please review all details carefully. Once submitted, the purchase requisition will be sent for approval.'}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

