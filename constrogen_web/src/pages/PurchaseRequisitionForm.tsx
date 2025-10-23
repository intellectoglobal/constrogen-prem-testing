import { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
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
  const location = useLocation();
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

  // ✅ Pre-populate form when editing from review or history
  useEffect(() => {
    if (location.state && projects.length > 0 && itemTypes.length > 0) {
      const stateData = location.state as any;
      
      console.log('📝 Form State Data:', stateData);
      console.log('🔧 Edit Mode:', stateData.isEditing ? 'YES' : 'NO');
      console.log('🔑 Request Key:', stateData.requestKey);
      
      if (stateData.proj_key) setProjectKey(stateData.proj_key);
      if (stateData.item_type_key) setItemTypeKey(stateData.item_type_key);
      if (stateData.stage) setStage(stateData.stage);
      if (stateData.requiredDate) setRequiredDate(stateData.requiredDate);
      if (stateData.notes) setNotes(stateData.notes);
      if (stateData.number) setDocId(stateData.number);
      if (stateData.items && Array.isArray(stateData.items)) {
        setItems(stateData.items);
      }
    }
  }, [location.state, projects, itemTypes]);

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
      // Only set new docId if we're not editing (i.e., no location state with existing number)
      if (!location.state || !(location.state as any).number) {
        setDocId(docIdData);
      }
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

    // Check if we're in edit mode from location state
    const stateData = location.state as any;
    const isEditing = stateData?.isEditing || false;
    const requestKey = stateData?.requestKey;

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
        // Preserve edit mode flags
        isEditing,
        requestKey,
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
    <div className="min-h-screen" style={{ backgroundColor: COLORS.gray50 }}>
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <button
            onClick={() => navigate('/purchase')}
            className="flex items-center mb-4 text-sm font-medium hover:opacity-80 transition-all duration-200 group"
            style={{ color: COLORS.primaryColor }}
          >
            <svg className="w-5 h-5 mr-2 transform group-hover:-translate-x-1 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
            Back to Purchase
          </button>
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold" style={{ color: COLORS.primaryText }}>
                {location.state && (location.state as any).isEditing 
                  ? 'Edit Purchase Requisition' 
                  : 'Create Purchase Requisition'}
              </h1>
              <p className="mt-2 text-base" style={{ color: COLORS.secondaryText }}>
                {location.state && (location.state as any).isEditing
                  ? 'Update the details for your purchase request'
                  : 'Fill in the details below to create a new purchase request'}
              </p>
            </div>
            {docId > 0 && (
              <div className="hidden sm:block">
                <div className="px-4 py-2 rounded-lg border-2" style={{ borderColor: COLORS.primaryColor, backgroundColor: `${COLORS.primaryColor}10` }}>
                  <p className="text-xs font-medium" style={{ color: COLORS.secondaryText }}>PR Number</p>
                  <p className="text-2xl font-bold" style={{ color: COLORS.primaryColor }}>#{docId}</p>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Form */}
        <div className="bg-white rounded-xl shadow-sm border p-8 mb-6" style={{ borderColor: COLORS.border }}>
          <div className="mb-6">
            <h2 className="text-xl font-bold flex items-center" style={{ color: COLORS.primaryText }}>
              <svg className="w-6 h-6 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor" style={{ color: COLORS.primaryColor }}>
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
              Requisition Details
            </h2>
            <p className="mt-1 text-sm" style={{ color: COLORS.secondaryText }}>
              Provide the basic information for your purchase requisition
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Project Selection */}
            <div>
              <label className="block text-sm font-semibold mb-2" style={{ color: COLORS.primaryText }}>
                Project <span className="text-red-500">*</span>
              </label>
              <select
                value={projectKey}
                onChange={(e) => setProjectKey(parseInt(e.target.value))}
                className="w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 transition-all duration-200"
                style={{ 
                  borderColor: COLORS.inputBorder, 
                  color: COLORS.primaryText,
                  backgroundColor: COLORS.gray50 
                }}
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
              <label className="block text-sm font-semibold mb-2" style={{ color: COLORS.primaryText }}>
                Item Type <span className="text-red-500">*</span>
              </label>
              <select
                value={itemTypeKey}
                onChange={(e) => setItemTypeKey(parseInt(e.target.value))}
                className="w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 transition-all duration-200"
                style={{ 
                  borderColor: COLORS.inputBorder, 
                  color: COLORS.primaryText,
                  backgroundColor: COLORS.gray50 
                }}
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
              <label className="block text-sm font-semibold mb-2" style={{ color: COLORS.primaryText }}>
                Priority Level
              </label>
              <select
                value={stage}
                onChange={(e) => setStage(e.target.value)}
                className="w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 transition-all duration-200"
                style={{ 
                  borderColor: COLORS.inputBorder, 
                  color: COLORS.primaryText,
                  backgroundColor: COLORS.gray50 
                }}
              >
                <option value="">Select priority</option>
                <option value="Low">🟢 Low Priority</option>
                <option value="Medium">🟡 Medium Priority</option>
                <option value="High">🔴 High Priority</option>
              </select>
            </div>

            {/* Required Date */}
            <div>
              <label className="block text-sm font-semibold mb-2" style={{ color: COLORS.primaryText }}>
                Required By Date
              </label>
              <input
                type="date"
                value={requiredDate}
                onChange={(e) => setRequiredDate(e.target.value)}
                className="w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 transition-all duration-200"
                style={{ 
                  borderColor: COLORS.inputBorder, 
                  color: COLORS.primaryText,
                  backgroundColor: COLORS.gray50 
                }}
              />
            </div>
          </div>

          {/* Notes - Full Width */}
          <div className="mt-6">
            <label className="block text-sm font-semibold mb-2" style={{ color: COLORS.primaryText }}>
              Additional Notes
            </label>
            <textarea
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              rows={4}
              placeholder="Add any additional notes, requirements, or special instructions..."
              className="w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 transition-all duration-200 resize-none"
              style={{ 
                borderColor: COLORS.inputBorder, 
                color: COLORS.primaryText,
                backgroundColor: COLORS.gray50 
              }}
            />
          </div>
        </div>

        {/* Items Section */}
        <div className="bg-white rounded-xl shadow-sm border p-8 mb-6" style={{ borderColor: COLORS.border }}>
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-6 gap-4">
            <div>
              <h2 className="text-xl font-bold flex items-center" style={{ color: COLORS.primaryText }}>
                <svg className="w-6 h-6 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor" style={{ color: COLORS.primaryColor }}>
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
                </svg>
                Requisition Items
              </h2>
              <p className="mt-1 text-sm" style={{ color: COLORS.secondaryText }}>
                Add items to your purchase requisition
              </p>
            </div>
            <button
              onClick={() => {
                if (!itemTypeKey) {
                  showToast({ message: 'Please select an item type first', toastType: 'error' });
                  return;
                }
                setEditingItem(undefined);
                setIsModalOpen(true);
              }}
              className="px-6 py-3 rounded-lg text-white font-semibold flex items-center gap-2 transition-all duration-200 shadow-sm hover:shadow-md transform hover:scale-105"
              style={{ backgroundColor: COLORS.primaryColor }}
            >
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
              </svg>
              Add Item
            </button>
          </div>

          {/* Items Table */}
          {items.length === 0 ? (
            <div className="text-center py-16 px-4" style={{ backgroundColor: COLORS.gray50, borderRadius: '12px' }}>
              <div className="inline-flex items-center justify-center w-20 h-20 rounded-full mb-4" style={{ backgroundColor: `${COLORS.primaryColor}15` }}>
                <svg className="h-10 w-10" fill="none" viewBox="0 0 24 24" stroke="currentColor" style={{ color: COLORS.primaryColor }}>
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
                </svg>
              </div>
              <h3 className="text-lg font-semibold mb-2" style={{ color: COLORS.primaryText }}>
                No Items Added Yet
              </h3>
              <p className="text-sm" style={{ color: COLORS.secondaryText }}>
                Click the "Add Item" button above to start adding items to your requisition
              </p>
            </div>
          ) : (
            <div className="space-y-4">
              <div className="overflow-x-auto rounded-lg border" style={{ borderColor: COLORS.border }}>
                <table className="w-full">
                  <thead style={{ backgroundColor: COLORS.gray50 }}>
                    <tr>
                      <th className="px-6 py-4 text-left text-xs font-bold uppercase tracking-wider" style={{ color: COLORS.secondaryText }}>
                        Item
                      </th>
                      <th className="px-6 py-4 text-left text-xs font-bold uppercase tracking-wider" style={{ color: COLORS.secondaryText }}>
                        Quantity
                      </th>
                      <th className="px-6 py-4 text-left text-xs font-bold uppercase tracking-wider" style={{ color: COLORS.secondaryText }}>
                        UOM
                      </th>
                      <th className="px-6 py-4 text-left text-xs font-bold uppercase tracking-wider" style={{ color: COLORS.secondaryText }}>
                        Unit Price
                      </th>
                      <th className="px-6 py-4 text-left text-xs font-bold uppercase tracking-wider" style={{ color: COLORS.secondaryText }}>
                        Total
                      </th>
                      <th className="px-6 py-4 text-center text-xs font-bold uppercase tracking-wider" style={{ color: COLORS.secondaryText }}>
                        Actions
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y" style={{ borderColor: COLORS.border }}>
                    {items.map((item, index) => (
                      <tr key={item.key} className="hover:bg-gray-50 transition-colors">
                        <td className="px-6 py-4">
                          <div className="flex items-center">
                            <div className="flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center mr-3" style={{ backgroundColor: `${COLORS.primaryColor}15`, color: COLORS.primaryColor }}>
                              <span className="text-xs font-bold">{index + 1}</span>
                            </div>
                            <span className="font-medium" style={{ color: COLORS.primaryText }}>{item.name}</span>
                          </div>
                        </td>
                        <td className="px-6 py-4 font-medium" style={{ color: COLORS.primaryText }}>
                          {item.qty}
                        </td>
                        <td className="px-6 py-4" style={{ color: COLORS.secondaryText }}>
                          {item.uom}
                        </td>
                        <td className="px-6 py-4 font-medium" style={{ color: COLORS.primaryText }}>
                          {item.unitPrice ? `$${parseFloat(item.unitPrice).toFixed(2)}` : '-'}
                        </td>
                        <td className="px-6 py-4 font-bold text-lg" style={{ color: COLORS.primaryColor }}>
                          {item.totalPrice ? `$${parseFloat(item.totalPrice).toFixed(2)}` : '-'}
                        </td>
                        <td className="px-6 py-4">
                          <div className="flex justify-center gap-2">
                            <button
                              onClick={() => handleEditItem(item)}
                              className="p-2 rounded-lg hover:bg-blue-50 transition-all duration-200"
                              title="Edit"
                            >
                              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" style={{ color: COLORS.info }}>
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                              </svg>
                            </button>
                            <button
                              onClick={() => handleDeleteItem(item.key)}
                              className="p-2 rounded-lg hover:bg-red-50 transition-all duration-200"
                              title="Delete"
                            >
                              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" style={{ color: COLORS.error }}>
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                              </svg>
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {/* Total Amount */}
              <div className="flex justify-end">
                <div className="rounded-xl px-8 py-4 border-2" style={{ borderColor: COLORS.primaryColor, backgroundColor: `${COLORS.primaryColor}08` }}>
                  <div className="flex items-center gap-8">
                    <span className="text-sm font-bold uppercase tracking-wider" style={{ color: COLORS.secondaryText }}>
                      Total Amount:
                    </span>
                    <span className="text-3xl font-bold" style={{ color: COLORS.primaryColor }}>
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
          <div className="flex flex-col sm:flex-row gap-4 justify-end">
            <button
              onClick={() => navigate('/purchase')}
              className="px-8 py-3 border-2 rounded-lg font-semibold transition-all duration-200 hover:bg-gray-50"
              style={{ borderColor: COLORS.border, color: COLORS.primaryText }}
            >
              Cancel
            </button>
            <button
              onClick={handleProceed}
              disabled={!projectKey}
              className="px-8 py-3 rounded-lg text-white font-semibold flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 shadow-lg hover:shadow-xl transform hover:scale-105 disabled:transform-none"
              style={{ backgroundColor: COLORS.primaryColor }}
            >
              <span>Review & Submit</span>
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

