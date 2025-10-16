import React, { useState, useEffect } from 'react';
import { Item, UOM, RequisitionItem, requisitionApi } from '../../services/requisitionApi';
import { COLORS } from 'shared/constants/theme';

interface AddItemModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (item: Omit<RequisitionItem, 'totalPrice'>) => void;
  editingItem?: RequisitionItem & { key: number };
  itemTypeKey: number;
}

export default function AddItemModal({
  isOpen,
  onClose,
  onSave,
  editingItem,
  itemTypeKey,
}: AddItemModalProps) {
  const [items, setItems] = useState<Item[]>([]);
  const [uoms, setUOMs] = useState<UOM[]>([]);
  const [itemKey, setItemKey] = useState<number>(0);
  const [itemName, setItemName] = useState('');
  const [quantity, setQuantity] = useState('');
  const [itemUomKey, setItemUomKey] = useState<number>(0);
  const [uom, setUom] = useState('');
  const [unitPrice, setUnitPrice] = useState('');
  const [loading, setLoading] = useState(false);

  // Fetch items and UOMs when itemTypeKey changes
  useEffect(() => {
    if (isOpen && itemTypeKey) {
      fetchItemsAndUOMs();
    }
  }, [isOpen, itemTypeKey]);

  // Initialize form when editing
  useEffect(() => {
    if (isOpen && editingItem) {
      setItemKey(editingItem.item_key);
      setItemName(editingItem.name);
      setQuantity(editingItem.qty);
      setItemUomKey(editingItem.item_uom_key);
      setUom(editingItem.uom);
      setUnitPrice(editingItem.unitPrice || '');
    } else if (isOpen) {
      resetForm();
    }
  }, [isOpen, editingItem]);

  const fetchItemsAndUOMs = async () => {
    setLoading(true);
    try {
      const [itemsData, uomsData] = await Promise.all([
        requisitionApi.getItems(itemTypeKey),
        requisitionApi.getUOMs(itemTypeKey),
      ]);
      setItems(itemsData);
      setUOMs(uomsData);
    } catch (error) {
      console.error('Error fetching items/UOMs:', error);
    } finally {
      setLoading(false);
    }
  };

  const resetForm = () => {
    setItemKey(0);
    setItemName('');
    setQuantity('');
    setItemUomKey(0);
    setUom('');
    setUnitPrice('');
  };

  const handleItemChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const key = parseInt(e.target.value);
    setItemKey(key);
    const item = items.find(i => i.key === key);
    if (item) {
      setItemName(item.descr);
    }
  };

  const handleUOMChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const key = parseInt(e.target.value);
    setItemUomKey(key);
    const uomItem = uoms.find(u => u.key === key);
    if (uomItem) {
      setUom(uomItem.descr);
    }
  };

  const handleSave = () => {
    // Validation
    if (!itemKey || !itemName.trim() || !quantity.trim() || !itemUomKey || !uom.trim()) {
      alert('Please fill all required fields');
      return;
    }

    const qty = parseFloat(quantity);
    if (isNaN(qty) || qty <= 0) {
      alert('Please enter a valid quantity');
      return;
    }

    if (unitPrice) {
      const price = parseFloat(unitPrice);
      if (isNaN(price) || price < 0) {
        alert('Please enter a valid unit price');
        return;
      }
    }

    const item: Omit<RequisitionItem, 'totalPrice'> = {
      item_key: itemKey,
      name: itemName.trim(),
      qty: quantity.trim(),
      item_uom_key: itemUomKey,
      uom: uom.trim(),
      unitPrice: unitPrice.trim() || undefined,
    };

    onSave(item);
    resetForm();
    onClose();
  };

  const handleClose = () => {
    resetForm();
    onClose();
  };

  if (!isOpen) return null;

  const totalPrice = unitPrice && quantity
    ? (parseFloat(unitPrice) * parseFloat(quantity)).toFixed(2)
    : null;

  return (
    <div
      className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50"
      onClick={handleClose}
    >
      <div
        className="bg-white rounded-lg shadow-2xl max-w-md w-full max-h-[90vh] overflow-y-auto"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="sticky top-0 bg-white border-b px-6 py-4 flex justify-between items-center">
          <h2 className="text-xl font-bold" style={{ color: COLORS.primaryText }}>
            {editingItem ? 'Edit Item' : 'Add Item'}
          </h2>
          <button
            onClick={handleClose}
            className="p-2 hover:bg-gray-100 rounded-full transition-colors"
          >
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Content */}
        <div className="p-6 space-y-4">
          {loading ? (
            <div className="flex justify-center py-8">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2" style={{ borderColor: COLORS.primaryColor }}></div>
            </div>
          ) : (
            <>
              {/* Item Selection */}
              <div>
                <label className="block text-sm font-medium mb-2" style={{ color: COLORS.primaryText }}>
                  Select Item <span className="text-red-500">*</span>
                </label>
                <select
                  value={itemKey}
                  onChange={handleItemChange}
                  className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2"
                  style={{ borderColor: COLORS.inputBorder, color: COLORS.primaryText }}
                >
                  <option value="">Select an item</option>
                  {items.map((item) => (
                    <option key={item.key} value={item.key}>
                      {item.descr}
                    </option>
                  ))}
                </select>
              </div>

              {/* Quantity and UOM Row */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-2" style={{ color: COLORS.primaryText }}>
                    Quantity <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="number"
                    value={quantity}
                    onChange={(e) => setQuantity(e.target.value)}
                    placeholder="0"
                    min="0"
                    step="any"
                    className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2"
                    style={{ borderColor: COLORS.inputBorder, color: COLORS.primaryText }}
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2" style={{ color: COLORS.primaryText }}>
                    UOM <span className="text-red-500">*</span>
                  </label>
                  <select
                    value={itemUomKey}
                    onChange={handleUOMChange}
                    className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2"
                    style={{ borderColor: COLORS.inputBorder, color: COLORS.primaryText }}
                  >
                    <option value="">Select UOM</option>
                    {uoms.map((uom) => (
                      <option key={uom.key} value={uom.key}>
                        {uom.descr}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Unit Price (Optional) */}
              <div>
                <label className="block text-sm font-medium mb-2" style={{ color: COLORS.primaryText }}>
                  Unit Price (Optional)
                </label>
                <input
                  type="number"
                  value={unitPrice}
                  onChange={(e) => setUnitPrice(e.target.value)}
                  placeholder="0.00"
                  min="0"
                  step="0.01"
                  className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2"
                  style={{ borderColor: COLORS.inputBorder, color: COLORS.primaryText }}
                />
              </div>

              {/* Total Price Display */}
              {totalPrice && (
                <div className="bg-gray-50 rounded-md p-3">
                  <div className="flex justify-between items-center">
                    <span className="text-sm font-medium" style={{ color: COLORS.secondaryText }}>
                      Total Price:
                    </span>
                    <span className="text-lg font-bold" style={{ color: COLORS.primaryColor }}>
                      ${totalPrice}
                    </span>
                  </div>
                </div>
              )}
            </>
          )}
        </div>

        {/* Footer */}
        <div className="sticky bottom-0 bg-gray-50 border-t px-6 py-4 flex gap-3">
          <button
            onClick={handleClose}
            className="flex-1 px-4 py-2 border rounded-md font-medium transition-colors"
            style={{ borderColor: COLORS.inputBorder, color: COLORS.primaryText }}
          >
            Cancel
          </button>
          <button
            onClick={handleSave}
            disabled={loading}
            className="flex-1 px-4 py-2 rounded-md text-white font-medium disabled:opacity-50 transition-colors"
            style={{ backgroundColor: COLORS.button }}
          >
            {editingItem ? 'Update' : 'Add'}
          </button>
        </div>
      </div>
    </div>
  );
}

