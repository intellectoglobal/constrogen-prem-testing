import React, { useState, useEffect } from 'react';
import { GRN, GRNItem } from '@shared/types/purchase';
import { COLORS } from '@shared/constants/theme';
import { grnApi } from '../../services/grnApi';
import { showToast } from '../../utils/toast';

interface GRNDetailsModalProps {
  grn: GRN;
  onClose: () => void;
  onUpdate: () => void;
  getStatusColor: (status: string) => string;
  getStatusText: (status: string) => string;
  showEdit?: boolean;
}

export default function GRNDetailsModal({
  grn,
  onClose,
  onUpdate,
  getStatusColor,
  getStatusText,
  showEdit = false
}: GRNDetailsModalProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [editedItems, setEditedItems] = useState<GRNItem[]>([]);
  const [selectedStatus, setSelectedStatus] = useState<'PR' | 'C'>(grn.status === 'C' ? 'C' : 'PR');
  const [newImages, setNewImages] = useState<File[]>([]);
  const [imagePreviewUrls, setImagePreviewUrls] = useState<string[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [selectedImageUrl, setSelectedImageUrl] = useState<string | null>(null);

  useEffect(() => {
    setEditedItems(JSON.parse(JSON.stringify(grn.grn_items)));
    setSelectedStatus(grn.status === 'C' ? 'C' : 'PR');
  }, [grn]);

  const handleQuantityChange = (itemKey: number, newQty: string) => {
    setEditedItems(prev =>
      prev.map(item =>
        item.key === itemKey ? { ...item, received_qty: newQty } : item
      )
    );
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    const newFiles = Array.from(files);
    setNewImages(prev => [...prev, ...newFiles]);

    // Create preview URLs
    const newPreviewUrls = newFiles.map(file => URL.createObjectURL(file));
    setImagePreviewUrls(prev => [...prev, ...newPreviewUrls]);
  };

  const handleRemoveNewImage = (index: number) => {
    setNewImages(prev => prev.filter((_, i) => i !== index));
    URL.revokeObjectURL(imagePreviewUrls[index]);
    setImagePreviewUrls(prev => prev.filter((_, i) => i !== index));
  };

  const convertImageToBase64 = (file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => {
        if (typeof reader.result === 'string') {
          resolve(reader.result);
        } else {
          reject(new Error('Failed to convert to base64'));
        }
      };
      reader.onerror = reject;
      reader.readAsDataURL(file);
    });
  };

  const handleSave = async () => {
    setIsSubmitting(true);
    try {
      // Validate quantities
      const hasInvalidQty = editedItems.some(item => {
        const qty = parseFloat(item.received_qty);
        return isNaN(qty) || qty < 0;
      });

      if (hasInvalidQty) {
        showToast({ message: 'Please enter valid quantities', toastType: 'error' });
        setIsSubmitting(false);
        return;
      }

      // Convert new images to base64
      const base64Images = await Promise.all(
        newImages.map(file => convertImageToBase64(file))
      );

      // Prepare update data
      const updateData = {
        grn_items: editedItems,
        status: selectedStatus,
        grn_imgs: [
          // Existing images as strings
          ...grn.grn_imgs.map(img => 
            typeof img === 'string' ? img : img.image_url
          ),
          // New images as objects with image_url
          ...base64Images.map(base64 => ({
            image_url: base64,
          })),
        ],
      };

      await grnApi.updateGRN(grn.key, updateData);

      showToast({
        message: 'GRN updated successfully!',
        toastType: 'success',
      });

      // Cleanup preview URLs
      imagePreviewUrls.forEach(url => URL.revokeObjectURL(url));

      setIsEditing(false);
      setNewImages([]);
      setImagePreviewUrls([]);
      onUpdate();
      onClose();
    } catch (error: any) {
      console.error('Error saving GRN:', error);
      showToast({
        message: error?.response?.data?.message || 'Failed to save GRN',
        toastType: 'error',
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleCancelEdit = () => {
    setIsEditing(false);
    setEditedItems(JSON.parse(JSON.stringify(grn.grn_items)));
    setSelectedStatus(grn.status === 'C' ? 'C' : 'PR');
    setNewImages([]);
    imagePreviewUrls.forEach(url => URL.revokeObjectURL(url));
    setImagePreviewUrls([]);
  };

  const formatNumber = (value: string | number): string => {
    const num = typeof value === 'string' ? parseFloat(value) : value;
    if (isNaN(num)) return value.toString();
    if (num % 1 === 0) return num.toString();
    return num.toFixed(2).replace(/\.?0+$/, '');
  };

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
        <div className="sticky top-0 bg-white border-b px-6 py-4 flex justify-between items-center z-10">
          <div>
            <h2 className="text-2xl font-bold" style={{ color: COLORS.primaryText }}>
              {isEditing ? 'Edit GRN' : 'GRN Details'}
            </h2>
            <p className="text-sm mt-1" style={{ color: COLORS.secondaryText }}>
              {grn.number}
            </p>
          </div>
          <div className="flex items-center gap-3">
            {showEdit && !isEditing && (
              <button
                onClick={() => setIsEditing(true)}
                className="p-2 hover:bg-blue-50 rounded-full transition-colors"
                title="Edit GRN"
              >
                <svg className="w-6 h-6" style={{ color: COLORS.primary }} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                </svg>
              </button>
            )}
            {isEditing && (
              <button
                onClick={handleCancelEdit}
                className="p-2 hover:bg-gray-100 rounded-full transition-colors"
                title="Cancel Edit"
              >
                <svg className="w-6 h-6 text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            )}
            <button
              onClick={onClose}
              className="p-2 hover:bg-gray-100 rounded-full transition-colors"
            >
              <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
        </div>

        {/* Content */}
        <div className="p-6">
          {/* GRN Information */}
          <div className="bg-gray-50 rounded-lg p-4 mb-6">
            <h3 className="text-lg font-semibold mb-4" style={{ color: COLORS.primaryText }}>
              GRN Information
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="text-xs font-semibold uppercase" style={{ color: COLORS.secondaryText }}>
                  GRN Number
                </label>
                <p className="mt-1 font-medium" style={{ color: COLORS.primaryText }}>
                  {grn.number}
                </p>
              </div>
              <div>
                <label className="text-xs font-semibold uppercase" style={{ color: COLORS.secondaryText }}>
                  PR Number
                </label>
                <p className="mt-1 font-medium" style={{ color: COLORS.primaryText }}>
                  {grn.pr_number}
                </p>
              </div>
              <div>
                <label className="text-xs font-semibold uppercase" style={{ color: COLORS.secondaryText }}>
                  Date
                </label>
                <p className="mt-1 font-medium" style={{ color: COLORS.primaryText }}>
                  {grn.date}
                </p>
              </div>
              <div>
                <label className="text-xs font-semibold uppercase" style={{ color: COLORS.secondaryText }}>
                  Status
                </label>
                {isEditing ? (
                  <div className="mt-2 flex gap-2">
                    <button
                      onClick={() => setSelectedStatus('PR')}
                      className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
                        selectedStatus === 'PR' ? 'text-white' : 'bg-gray-100'
                      }`}
                      style={selectedStatus === 'PR' ? { backgroundColor: '#3b82f6' } : { color: COLORS.primaryText }}
                    >
                      Partial (PR)
                    </button>
                    <button
                      onClick={() => setSelectedStatus('C')}
                      className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
                        selectedStatus === 'C' ? 'text-white' : 'bg-gray-100'
                      }`}
                      style={selectedStatus === 'C' ? { backgroundColor: '#10b981' } : { color: COLORS.primaryText }}
                    >
                      Received (C)
                    </button>
                  </div>
                ) : (
                  <div className="mt-1">
                    <span
                      className="inline-block px-3 py-1 rounded-full text-sm font-semibold text-white"
                      style={{ backgroundColor: getStatusColor(grn.status) }}
                    >
                      {getStatusText(grn.status)}
                    </span>
                  </div>
                )}
              </div>
              <div className="md:col-span-2">
                <label className="text-xs font-semibold uppercase" style={{ color: COLORS.secondaryText }}>
                  Comments
                </label>
                <p className="mt-1" style={{ color: COLORS.primaryText }}>
                  {grn.comments || 'No comments'}
                </p>
              </div>
            </div>
          </div>

          {/* Items */}
          <div className="mb-6">
            <h3 className="text-lg font-semibold mb-3" style={{ color: COLORS.primaryText }}>
              Items ({editedItems.length})
            </h3>
            <div className="space-y-3">
              {editedItems.map((item, index) => (
                <div key={index} className="bg-white border rounded-lg p-4">
                  <h4 className="font-medium mb-2" style={{ color: COLORS.primaryText }}>
                    {item.item_name}
                  </h4>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-3 text-sm" style={{ color: COLORS.secondaryText }}>
                    <div>
                      <span className="font-semibold">Model:</span> {item.model_number || 'N/A'}
                    </div>
                    <div>
                      <span className="font-semibold">Ordered:</span> {formatNumber(item.ordered_qty)}
                    </div>
                    <div>
                      <span className="font-semibold">Received:</span>
                      {isEditing ? (
                        <input
                          type="number"
                          value={formatNumber(item.received_qty)}
                          onChange={(e) => handleQuantityChange(item.key, e.target.value)}
                          className="ml-2 w-20 px-2 py-1 border rounded focus:outline-none focus:ring-2 focus:ring-primary"
                          style={{ borderColor: COLORS.inputBorder }}
                          min="0"
                          step="any"
                        />
                      ) : (
                        <span className="ml-1">{formatNumber(item.received_qty)}</span>
                      )}
                    </div>
                    <div>
                      <span className="font-semibold">Unit:</span> {item.unit || 'N/A'}
                    </div>
                    {item.brand && (
                      <div className="md:col-span-2">
                        <span className="font-semibold">Brand:</span> {item.brand}
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Images */}
          <div className="mb-6">
            <div className="flex justify-between items-center mb-3">
              <h3 className="text-lg font-semibold" style={{ color: COLORS.primaryText }}>
                Images ({grn.grn_imgs.length + imagePreviewUrls.length})
              </h3>
              {isEditing && (
                <label className="px-4 py-2 rounded-md text-white font-medium cursor-pointer transition-colors hover:opacity-90 flex items-center gap-2"
                  style={{ backgroundColor: COLORS.button }}>
                  <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 13a3 3 0 11-6 0 3 3 0 016 0z" />
                  </svg>
                  Add Image
                  <input
                    type="file"
                    accept="image/*"
                    multiple
                    onChange={handleImageUpload}
                    className="hidden"
                  />
                </label>
              )}
            </div>

            {grn.grn_imgs.length === 0 && imagePreviewUrls.length === 0 ? (
              <div className="bg-gray-50 rounded-lg p-8 text-center">
                <svg className="mx-auto h-12 w-12 text-gray-400 mb-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
                <p className="text-sm" style={{ color: COLORS.secondaryText }}>
                  No images available
                </p>
              </div>
            ) : (
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                {/* Existing Images */}
                {grn.grn_imgs.map((img, index) => {
                  const imgUrl = typeof img === 'string' ? img : img.image_url;
                  return (
                    <div key={`existing-${index}`} className="relative group">
                      <img
                        src={imgUrl}
                        alt={`GRN Image ${index + 1}`}
                        className="w-full h-32 object-cover rounded-lg cursor-pointer hover:opacity-90 transition-opacity"
                        onClick={() => setSelectedImageUrl(imgUrl)}
                      />
                      <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-20 transition-all rounded-lg flex items-center justify-center">
                        <svg className="w-8 h-8 text-white opacity-0 group-hover:opacity-100 transition-opacity" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0zM10 7v3m0 0v3m0-3h3m-3 0H7" />
                        </svg>
                      </div>
                    </div>
                  );
                })}

                {/* New Images */}
                {imagePreviewUrls.map((url, index) => (
                  <div key={`new-${index}`} className="relative group">
                    <img
                      src={url}
                      alt={`New Image ${index + 1}`}
                      className="w-full h-32 object-cover rounded-lg"
                    />
                    <div className="absolute top-2 right-2">
                      <button
                        onClick={() => handleRemoveNewImage(index)}
                        className="p-1 bg-red-500 text-white rounded-full hover:bg-red-600 transition-colors"
                        title="Remove image"
                      >
                        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                        </svg>
                      </button>
                    </div>
                    <div className="absolute bottom-2 left-2">
                      <span className="px-2 py-1 bg-blue-500 text-white text-xs rounded-full">
                        New
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

        </div>

        {/* Footer */}
        <div className="sticky bottom-0 bg-gray-50 border-t px-6 py-4 flex justify-end gap-3">
          {isEditing ? (
            <>
              <button
                onClick={handleCancelEdit}
                disabled={isSubmitting}
                className="px-6 py-2 rounded-md font-medium border transition-colors disabled:opacity-50"
                style={{ borderColor: COLORS.inputBorder, color: COLORS.primaryText }}
              >
                Cancel
              </button>
              <button
                onClick={handleSave}
                disabled={isSubmitting}
                className="px-6 py-2 rounded-md text-white font-medium transition-colors disabled:opacity-50 flex items-center gap-2"
                style={{ backgroundColor: COLORS.button }}
              >
                {isSubmitting ? (
                  <>
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                    Saving...
                  </>
                ) : (
                  <>
                    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                    Save Changes
                  </>
                )}
              </button>
            </>
          ) : (
            <button
              onClick={onClose}
              className="px-6 py-2 rounded-md font-medium border transition-colors"
              style={{ borderColor: COLORS.inputBorder, color: COLORS.primaryText }}
            >
              Close
            </button>
          )}
        </div>

        {/* Image Preview Modal */}
        {selectedImageUrl && (
          <div
            className="fixed inset-0 bg-black bg-opacity-90 z-50 flex items-center justify-center p-4"
            onClick={() => setSelectedImageUrl(null)}
          >
            <div className="relative max-w-6xl max-h-full">
              <button
                onClick={() => setSelectedImageUrl(null)}
                className="absolute -top-12 right-0 p-2 text-white hover:bg-white hover:bg-opacity-20 rounded-full transition-colors"
              >
                <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
              <img
                src={selectedImageUrl}
                alt="Full size preview"
                className="max-w-full max-h-[90vh] object-contain rounded-lg"
                onClick={(e) => e.stopPropagation()}
              />
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

