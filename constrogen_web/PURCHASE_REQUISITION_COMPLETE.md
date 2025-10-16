# Purchase Requisition Form - Complete Implementation

## 🎉 Overview

The **Purchase Requisition Form** has been fully implemented for the web application! You can now create purchase requisitions with the same functionality as the mobile app.

## ✅ Features Implemented

### 1. **Multi-Step Form Workflow**
- Step 1: Fill in basic details (Project, Item Type, Priority, etc.)
- Step 2: Add items with quantities and UOM
- Step 3: Review and submit

### 2. **Form Fields**
- ✅ **Project Selection** - Dropdown with all active projects
- ✅ **Item Type Selection** - Dropdown with all item types
- ✅ **Stage/Priority** - Low/Medium/High selection
- ✅ **Required Date** - Date picker
- ✅ **Notes** - Textarea for additional information
- ✅ **Auto-generated PR Number** - Fetched from backend

### 3. **Item Management**
- ✅ **Add Items** - Modal dialog for adding items
- ✅ **Edit Items** - Edit existing items in the list
- ✅ **Delete Items** - Remove items from the list
- ✅ **Item Selection** - Dropdown filtered by selected Item Type
- ✅ **Quantity Input** - Numeric input for quantities
- ✅ **UOM Selection** - Unit of Measurement dropdown
- ✅ **Unit Price** - Optional field for pricing
- ✅ **Auto-calculated Total** - Automatically calculates item total and grand total

### 4. **Review & Submit**
- ✅ **Summary Page** - Review all details before submitting
- ✅ **Edit Option** - Go back to edit if needed
- ✅ **Submit to Backend** - POST to API endpoint
- ✅ **Success Redirect** - Navigate to Purchase History after submission

## 📁 New Files Created

### API Services
```
shared/services/requisitionApi.ts
constrogen_web/src/services/requisitionApi.ts
```

### Components
```
constrogen_web/src/components/purchase/AddItemModal.tsx
```

### Pages
```
constrogen_web/src/pages/PurchaseRequisitionForm.tsx
constrogen_web/src/pages/PurchaseRequisitionReview.tsx
```

### Routes
```
/purchase-requisition - Main form
/purchase-requisition/review - Review & submit page
```

## 🔄 Complete User Flow

```
1. User clicks "Purchase Requisition" from Purchase menu
   ↓
2. Form loads with:
   - Projects dropdown
   - Item Types dropdown
   - PR Number auto-generated
   ↓
3. User fills in:
   - Select Project *
   - Select Item Type *
   - Select Priority (optional)
   - Select Required Date (optional)
   - Add Notes (optional)
   ↓
4. User clicks "Add Item"
   ↓
5. Modal opens:
   - Select Item * (filtered by Item Type)
   - Enter Quantity *
   - Select UOM *
   - Enter Unit Price (optional)
   - Auto-calculated total displayed
   ↓
6. User clicks "Add" or "Update"
   ↓
7. Item appears in table with:
   - Item name
   - Quantity
   - UOM
   - Unit Price
   - Total
   - Edit/Delete actions
   ↓
8. User can:
   - Add more items
   - Edit existing items
   - Delete items
   - See running total
   ↓
9. User clicks "Review & Submit"
   ↓
10. Review page shows:
    - All form fields
    - Complete items list
    - Total amount
    ↓
11. User can:
    - Click "Edit Request" to go back
    - Click "Submit Request" to finalize
    ↓
12. On submit:
    - Data POSTed to backend
    - Success message shown
    - Redirect to Purchase History
```

## 🎨 UI Features

### Form Page
- **Responsive Layout** - Works on all screen sizes
- **Clear Sections** - Basic Info and Items sections
- **Visual Feedback** - Hover effects, disabled states
- **Validation** - Required field indicators
- **Empty State** - Friendly message when no items added
- **Item Table** - Clean table layout with actions
- **Total Display** - Prominent total amount display

### Add Item Modal
- **Centered Modal** - Clean, focused interface
- **Dropdown Filtering** - Items filtered by Item Type
- **Auto-calculation** - Total price calculated automatically
- **Validation** - Client-side validation before save
- **Loading State** - Shows spinner while fetching data
- **Edit Mode** - Pre-populates fields when editing

### Review Page
- **Summary Cards** - Organized information display
- **Editable** - Easy to go back and edit
- **Submit Button** - Clear call-to-action
- **Loading State** - Disabled while submitting
- **Information Alert** - Helpful reminder before submission

## 🔌 API Integration

### Endpoints Used

```bash
# Get active projects
GET /api/project/project/all/active

# Get item types
GET /api/inventory/item_type/?without_pagination=1

# Get items for a specific item type
GET /api/inventory/item/?item_types={itemTypeKey}&without_pagination=1

# Get UOMs for a specific item type
GET /api/inventory/item_uom/?item_type={itemTypeKey}&without_pagination=1

# Get next PR document ID
GET /api/transaction/doc/id/next?docid=PR

# Submit purchase requisition
POST /api/transaction/purchase/requisition/
```

### Request Payload

```json
{
  "proj_key": 123,
  "item_type_key": 456,
  "docid": "PR",
  "number": 789,
  "stage": "High",
  "requiredDate": "2024-12-31",
  "notes": "Urgent requirement",
  "items": [
    {
      "item_key": 111,
      "name": "Cement 50kg",
      "qty": "100",
      "item_uom_key": 222,
      "uom": "Bags",
      "unitPrice": "10.50",
      "totalPrice": "1050.00"
    }
  ]
}
```

## 🎯 Validation Rules

### Required Fields
- ✅ Project - Must be selected
- ✅ Item Type - Must be selected
- ✅ At least 1 item - Must add minimum one item

### Item Validation
- ✅ Item - Must be selected
- ✅ Quantity - Must be numeric and > 0
- ✅ UOM - Must be selected
- ✅ Unit Price - If provided, must be numeric and >= 0

### Form Flow Validation
- ✅ Cannot add items without Item Type
- ✅ Cannot proceed to review without Project
- ✅ Cannot proceed to review without items

## 🚀 How to Use

### Creating a New Purchase Requisition

1. **Navigate to Form**
   ```
   Dashboard → Purchase → Purchase Requisition
   ```

2. **Fill Basic Information**
   - Select your project from dropdown
   - Select item type (this determines available items)
   - Optionally select priority and required date
   - Add any notes

3. **Add Items**
   - Click "Add Item" button
   - Select item from dropdown (filtered by item type)
   - Enter quantity
   - Select UOM (unit of measurement)
   - Optionally enter unit price (total auto-calculates)
   - Click "Add"

4. **Manage Items**
   - See all items in table
   - Click edit icon to modify
   - Click delete icon to remove
   - View running total at bottom

5. **Review & Submit**
   - Click "Review & Submit" when done
   - Review all details on summary page
   - Click "Edit Request" if changes needed
   - Click "Submit Request" to finalize

6. **After Submission**
   - See success message
   - Automatically redirected to Purchase History
   - Find your new requisition in the list

## 📊 Data Flow

```
User Input
    ↓
Form State (React)
    ↓
Validation
    ↓
Navigate to Review Page
    ↓
Review State (React Router Location)
    ↓
Submit Button Click
    ↓
API Service (requisitionApi)
    ↓
Backend API
    ↓
Success Response
    ↓
Toast Notification
    ↓
Navigate to Purchase History
```

## 💡 Technical Details

### State Management
- **Local State**: Form fields and items list
- **React Router Location State**: Data passed to review page
- **API Calls**: Async with loading states

### Form Handling
- **Controlled Inputs**: All fields controlled by React state
- **Dynamic Dropdowns**: Items and UOMs filtered by Item Type
- **Inline Editing**: Items can be edited in-place
- **Real-time Calculation**: Totals calculated on change

### Error Handling
- **API Errors**: Caught and displayed as toasts
- **Validation Errors**: Shown as alerts (can be improved with inline errors)
- **Loading States**: Buttons disabled while submitting
- **Fallbacks**: Empty states for no data

## 🔍 Differences from Mobile App

| Feature | Mobile | Web |
|---------|--------|-----|
| **Form Layout** | Single scrolling page | Single scrolling page |
| **Add Item** | Full-screen modal | Centered modal |
| **Item Selection** | Dropdown picker | Standard select dropdown |
| **Review Page** | Separate screen | Separate route |
| **Navigation** | Native stack | React Router |
| **Validation** | Alert dialogs | Alert dialogs (can be improved) |
| **Total Display** | Inline | Card with emphasis |
| **Date Picker** | Native | HTML5 date input |
| **Load from Kit** | ❌ Not implemented | ❌ Not implemented |

### Not Implemented (From Mobile)
- **Load Items from Kit**: This feature requires an additional modal and backend endpoint
- **Edit Existing Requisition**: Can be added by passing data via route state

## 🐛 Known Limitations

1. **No Load from Kit**: This feature from mobile is not yet implemented
2. **No Edit Mode**: Cannot edit existing requisitions (only create new)
3. **Alert-based Validation**: Uses browser alerts instead of inline validation messages
4. **No Auto-save**: No draft functionality

## 🎨 Styling

All components use:
- **Tailwind CSS** for layout and spacing
- **Shared COLORS** from theme for consistency
- **Responsive Design** with mobile-first approach
- **Hover States** for better UX
- **Loading States** with spinners
- **Disabled States** with opacity

## 📈 Future Enhancements

### High Priority
- [ ] Add inline validation messages (replace alerts)
- [ ] Add edit mode for existing requisitions
- [ ] Add draft/save functionality
- [ ] Add file attachments support

### Medium Priority
- [ ] Add item search/filter in dropdown
- [ ] Add bulk item addition
- [ ] Add item templates/favorites
- [ ] Add duplicate requisition feature

### Low Priority
- [ ] Add print preview
- [ ] Add email notification option
- [ ] Add approval workflow visibility
- [ ] Add cost center allocation

## ✅ Testing Checklist

- [✅] Form loads with data
- [✅] Project dropdown works
- [✅] Item Type dropdown works
- [✅] Add Item modal opens
- [✅] Item selection filtered by type
- [✅] Quantity validation works
- [✅] UOM selection works
- [✅] Total price calculates
- [✅] Item adds to list
- [✅] Edit item works
- [✅] Delete item works
- [✅] Grand total calculates
- [✅] Review page shows data
- [✅] Edit from review works
- [✅] Submit works
- [✅] Success redirect works
- [✅] Toast notifications work
- [✅] Error handling works
- [✅] Responsive on mobile

## 🎉 Summary

You now have a **fully functional Purchase Requisition Form** on the web with:

✅ Project and Item Type selection  
✅ Dynamic item addition with modal  
✅ Quantity and UOM management  
✅ Unit price and total calculation  
✅ Edit and delete items  
✅ Review before submit  
✅ API integration  
✅ Success notifications  
✅ Responsive design  

The form provides the same core functionality as the mobile app, with a clean web-native interface!

## 🚀 Get Started

```bash
cd constrogen_web
npm run dev
```

Then navigate to:
```
Login → Dashboard → Purchase → Purchase Requisition
```

Happy creating! 🎊

