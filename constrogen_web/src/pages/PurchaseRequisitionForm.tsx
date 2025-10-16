import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { COLORS } from '../../shared/constants/theme';
import { Project, ItemType, RequisitionItem, requisitionApi } from '../services/requisitionApi';
import { showToast } from '../utils/toast';
import AddItemModal from '../components/purchase/AddItemModal';

interface FormItem extends RequisitionItem {
  key: number;
  totalPrice?: string;
}

export default function PurchaseRequisitionForm() {
  const navigate = useNavigate();
  const [projects, setProjects] = useState<Project[]>([]);
  const [itemTypes, setItemTypes] = useState<ItemType[]>([]);
  const [projectKey, setProjectKey] = useState<number>(0);
  const [itemTypeKey, setItemTypeKey] = useState<number>(0);
  const [stage, setStage] = useState('');
  const [requiredDate, setRequiredDate] = useState('');
  const [notes, setNotes] = useState('');
  const [docId, setDocId] = useState<number>(0);
  const [items, setItems] = useState<FormItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<FormItem | undefined>();

  useEffect(() => {
    fetchInitialData();
  }, []);

  const fetchInitialData = async () => {
    setLoading(true);
    try {
      const [projectsData, itemTypesData, docIdData] = await Promise.all([
        requisitionApi.getProjects(),
        requisitionApi.getItemTypes(),
        requisitionApi.getNextDocId(),
      ]);
      setProjects(projectsData);
      setItemTypes(itemTypesData);
      setDocId(docIdData);
    } catch (error) {
      console.error('Error fetching initial data:', error);
      showToast({ message: 'Failed to load form data', toastType: 'error' });
    } finally {
      setLoading(false);
    }
  };

  const handleAddItem = (item: Omit<RequisitionItem, 'totalPrice'>) => {
    const totalPrice = item.unitPrice && item.qty
      ? (parseFloat(item.unitPrice) * parseFloat(item.qty)).toFixed(2)
      : undefined;

    if (editingItem) {
      // Update existing item
      setItems(prev =>
        prev.map(i =>
          i.key === editingItem.key
            ? { ...item, key: editingItem.key, totalPrice }
            : i
        )
      );
      setEditingItem(undefined);
    } else {
      // Add new item
      const newItem: FormItem = {
        ...item,
        key: Date.now(),
        totalPrice,
      };
      setItems(prev => [...prev, newItem]);
    }
  };

  const handleEditItem = (item: FormItem) => {
    setEditingItem(item);
    setIsModalOpen(true);
  };

  const handleDeleteItem = (itemKey: number) => {
    if (window.confirm('Are you sure you want to delete this item?')) {
      setItems(prev => prev.filter(i => i.key !== itemKey));
    }
  };

  const handleProceed = () => {
    if (!projectKey) {
      showToast({ message: 'Please select a project', toastType: 'error' });
      return;
    }

    if (!itemTypeKey) {
      showToast({ message: 'Please select an item type', toastType: 'error' });
      return;
    }

    if (items.length === 0) {
      showToast({ message: 'Please add at least one item', toastType: 'error' });
      return;
    }

    const project = projects.find(p => p.key === projectKey);
    const itemType = itemTypes.find(t => t.key === itemTypeKey);
    const totalAmount = items.reduce((sum, item) => sum + parseFloat(item.totalPrice || '0'), 0).toFixed(2);

    navigate('/purchase-requisition/review', {
      state: {
        proj_key: projectKey,
        item_type_key: itemTypeKey,
        docid: 'PR',
        number: docId,
        stage,
        requiredDate,
        notes,
        items,
        totalAmount,
        project: project?.name || '',
        itemType: itemType?.descr || '',
      },
    });
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="flex flex-col items-center justify-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2" style={{ borderColor: COLORS.primaryColor }}></div>
            <p className="mt-4 text-sm" style={{ color: COLORS.secondaryText }}>
              Loading form...
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-6">
          <button
            onClick={() => navigate('/purchase')}
            className="flex items-center mb-4 text-sm font-medium hover:opacity-80 transition-opacity"
            style={{ color: COLORS.primaryColor }}
          >
            <svg className="w-5 h-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
            Back to Purchase
          </button>
          <h1 className="text-3xl font-bold" style={{ color: COLORS.primaryText }}>
            Create Purchase Requisition
          </h1>
          <p className="mt-2 text-sm" style={{ color: COLORS.secondaryText }}>
            Fill in the details below to create a new purchase request
          </p>
          {docId > 0 && (
            <p className="mt-1 text-sm font-medium" style={{ color: COLORS.primaryColor }}>
              PR Number: {docId}
            </p>
          )}
        </div>

        {/* Form */}
        <div className="bg-white rounded-lg shadow-md p-6 mb-6">
          <div className="space-y-4">
            {/* Project Selection */}
            <div>
              <label className="block text-sm font-medium mb-2" style={{ color: COLORS.primaryText }}>
                Project <span className="text-red-500">*</span>
              </label>
              <select
                value={projectKey}
                onChange={(e) => setProjectKey(parseInt(e.target.value))}
                className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2"
                style={{ borderColor: COLORS.inputBorder, color: COLORS.primaryText }}
              >
                <option value="">Select a project</option>
                {projects.map((project) => (
                  <option key={project.key} value={project.key}>
                    {project.name}
                  </option>
                ))}
              </select>
            </div>

            {/* Item Type Selection */}
            <div>
              <label className="block text-sm font-medium mb-2" style={{ color: COLORS.primaryText }}>
                Item Type <span className="text-red-500">*</span>
              </label>
              <select
                value={itemTypeKey}
                onChange={(e) => setItemTypeKey(parseInt(e.target.value))}
                className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2"
                style={{ borderColor: COLORS.inputBorder, color: COLORS.primaryText }}
              >
                <option value="">Select item type</option>
                {itemTypes.map((type) => (
                  <option key={type.key} value={type.key}>
                    {type.descr}
                  </option>
                ))}
              </select>
            </div>

            {/* Stage/Priority */}
            <div>
              <label className="block text-sm font-medium mb-2" style={{ color: COLORS.primaryText }}>
                Stage/Priority
              </label>
              <select
                value={stage}
                onChange={(e) => setStage(e.target.value)}
                className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2"
                style={{ borderColor: COLORS.inputBorder, color: COLORS.primaryText }}
              >
                <option value="">Select stage</option>
                <option value="Low">Low</option>
                <option value="Medium">Medium</option>
                <option value="High">High</option>
              </select>
            </div>

            {/* Required Date */}
            <div>
              <label className="block text-sm font-medium mb-2" style={{ color: COLORS.primaryText }}>
                Required Date
              </label>
              <input
                type="date"
                value={requiredDate}
                onChange={(e) => setRequiredDate(e.target.value)}
                className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2"
                style={{ borderColor: COLORS.inputBorder, color: COLORS.primaryText }}
              />
            </div>

            {/* Notes */}
            <div>
              <label className="block text-sm font-medium mb-2" style={{ color: COLORS.primaryText }}>
                Notes
              </label>
              <textarea
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                rows={3}
                placeholder="Add any additional notes or requirements..."
                className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2"
                style={{ borderColor: COLORS.inputBorder, color: COLORS.primaryText }}
              />
            </div>
          </div>
        </div>

        {/* Items Section */}
        <div className="bg-white rounded-lg shadow-md p-6 mb-6">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-semibold" style={{ color: COLORS.primaryText }}>
              Items
            </h2>
            <button
              onClick={() => {
                if (!itemTypeKey) {
                  showToast({ message: 'Please select an item type first', toastType: 'error' });
                  return;
                }
                setEditingItem(undefined);
                setIsModalOpen(true);
              }}
              className="px-4 py-2 rounded-md text-white font-medium flex items-center gap-2 transition-colors"
              style={{ backgroundColor: COLORS.button }}
            >
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
              </svg>
              Add Item
            </button>
          </div>

          {/* Items Table */}
          {items.length === 0 ? (
            <div className="text-center py-12">
              <svg className="mx-auto h-16 w-16 text-gray-400 mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
              </svg>
              <h3 className="text-lg font-medium mb-2" style={{ color: COLORS.primaryText }}>
                No Items Added
              </h3>
              <p className="text-sm mb-4" style={{ color: COLORS.secondaryText }}>
                Click "Add Item" to start adding items to your requisition
              </p>
            </div>
          ) : (
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
                    <th className="px-4 py-3 text-center text-xs font-semibold uppercase" style={{ color: COLORS.secondaryText }}>
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y">
                  {items.map((item) => (
                    <tr key={item.key} className="hover:bg-gray-50">
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
                      <td className="px-4 py-3">
                        <div className="flex justify-center gap-2">
                          <button
                            onClick={() => handleEditItem(item)}
                            className="p-1 hover:bg-gray-200 rounded transition-colors"
                            title="Edit"
                          >
                            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" style={{ color: COLORS.button }}>
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                            </svg>
                          </button>
                          <button
                            onClick={() => handleDeleteItem(item.key)}
                            className="p-1 hover:bg-gray-200 rounded transition-colors"
                            title="Delete"
                          >
                            <svg className="w-5 h-5 text-red-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                            </svg>
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>

              {/* Total Amount */}
              <div className="mt-4 flex justify-end">
                <div className="bg-gray-50 rounded-md px-6 py-3 min-w-[200px]">
                  <div className="flex justify-between items-center">
                    <span className="text-sm font-semibold" style={{ color: COLORS.secondaryText }}>
                      Total Amount:
                    </span>
                    <span className="text-xl font-bold" style={{ color: COLORS.primaryColor }}>
                      ${items.reduce((sum, item) => sum + parseFloat(item.totalPrice || '0'), 0).toFixed(2)}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Action Buttons */}
        {items.length > 0 && (
          <div className="flex gap-4 justify-end">
            <button
              onClick={() => navigate('/purchase')}
              className="px-6 py-3 border rounded-md font-medium transition-colors"
              style={{ borderColor: COLORS.inputBorder, color: COLORS.primaryText }}
            >
              Cancel
            </button>
            <button
              onClick={handleProceed}
              disabled={!projectKey}
              className="px-6 py-3 rounded-md text-white font-medium flex items-center gap-2 disabled:opacity-50 transition-colors"
              style={{ backgroundColor: COLORS.button }}
            >
              Review & Submit
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
              </svg>
            </button>
          </div>
        )}
      </div>

      {/* Add/Edit Item Modal */}
      <AddItemModal
        isOpen={isModalOpen}
        onClose={() => {
          setIsModalOpen(false);
          setEditingItem(undefined);
        }}
        onSave={handleAddItem}
        editingItem={editingItem}
        itemTypeKey={itemTypeKey}
      />
    </div>
  );
}

