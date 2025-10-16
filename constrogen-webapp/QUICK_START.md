# Quick Start Guide - Purchase & Approvals Modules

## 🚀 Getting Started

```bash
cd constrogen_web
npm install
npm run dev
```

Visit: `http://localhost:5173`

## 📍 Navigation Map

```
Login (/)
  ↓
Dashboard (/dashboard)
  ↓
  ├─ Purchase (/purchase)
  │   ├─ Purchase Requisition (/purchase-requisition) [Coming Soon]
  │   ├─ Purchase History (/purchase-history) ✅
  │   └─ Purchase Order with GRN (/purchase-order-grn) ✅
  │       ├─ Open Tab (Status: P, PR)
  │       └─ Closed Tab (Status: A, R, C)
  │
  └─ Approvals (/approvals) ✅
      ├─ Pending Tab (Status: P)
      └─ Approved Tab (Status: A)
```

## ✅ What's Working

| Feature | Status | Notes |
|---------|--------|-------|
| Purchase History | ✅ Full | View, search, filter all purchase requests |
| Purchase Requisition Form | ⏳ Coming Soon | Use mobile app to create requests |
| Purchase Order GRN - Open | ✅ Full | View pending and partially received GRNs |
| Purchase Order GRN - Closed | ✅ Full | View approved, rejected, and closed GRNs |
| Approvals - Pending | ✅ Full | View and approve/reject requests |
| Approvals - Approved | ✅ Full | View approved requests |

## 🎯 Quick Test Steps

1. **Login**
   - Enter your email
   - Enter OTP
   - Should redirect to Dashboard

2. **Test Purchase History**
   - Click "Purchase" → "Purchase History"
   - Should see list of all purchase requests
   - Try search and filters
   - Click a card to view details

3. **Test Purchase Order GRN**
   - Click "Purchase" → "Purchase Order With GRN"
   - Switch between Open and Closed tabs
   - Search for specific GRN
   - Click to view details and images

4. **Test Approvals**
   - Click "Approvals" in navigation
   - View pending requests
   - Click Approve/Reject on a request
   - Switch to Approved tab to see approved requests

## 🔑 Key Features

### Search & Filter
- Real-time search across all fields
- Status-based filtering
- Responsive cards

### Modals
- Detailed view for each item
- Image preview (click to open full size)
- Action buttons (Approve/Reject)

### Responsive
- Works on desktop, tablet, mobile
- Touch-friendly buttons
- Adaptive layout

## 📱 Mobile vs Web

| Feature | Mobile | Web |
|---------|--------|-----|
| View Purchase History | ✅ | ✅ |
| Create Purchase Requisition | ✅ | ⏳ Coming Soon |
| Edit Purchase Requisition | ✅ | ⏳ Coming Soon |
| View GRNs | ✅ | ✅ |
| Edit GRN Quantities | ✅ | ⏳ Coming Soon |
| Upload GRN Images | ✅ | ⏳ Coming Soon |
| Approve/Reject Requests | ✅ | ✅ |

## 🎨 UI Components Created

```
src/
├── pages/
│   ├── PurchaseHistory.tsx         [New - List view]
│   ├── PurchaseRequisition.tsx     [New - Coming soon]
│   └── PurchaseOrderGRN.tsx        [New - Tabs view]
├── components/
│   ├── grn/
│   │   ├── GRNListOpen.tsx         [New - Open GRNs]
│   │   ├── GRNListClosed.tsx       [New - Closed GRNs]
│   │   ├── GRNCard.tsx             [New - Card component]
│   │   └── GRNDetailsModal.tsx     [New - Details modal]
│   └── purchase/
│       ├── PurchaseRequestCard.tsx              [Existing]
│       └── PurchaseRequestDetailsModal.tsx      [Existing]
└── services/
    └── grnApi.ts                   [New - GRN API calls]
```

## 🌐 API Endpoints Used

```
# Purchase History
GET /api/transaction/purchase/requisition/?without_pagination=1

# GRN List
GET /api/transaction/grn/?without_pagination=1

# Approve Request
POST /api/transaction/purchase/requisition/{key}/approve/

# Reject Request
POST /api/transaction/purchase/requisition/{key}/reject/

# Update GRN (not implemented in UI yet)
PUT /api/transaction/grn/{key}/
```

## 🐛 Troubleshooting

### Issue: Can't see any data
**Solution**: Check that you're logged in and have valid permissions

### Issue: API errors
**Solution**: Verify backend is running at `https://api.bc.constrogen.com/`

### Issue: Search not working
**Solution**: Ensure there's data loaded first, then try searching

### Issue: Images not loading
**Solution**: Check image URLs in network tab, may need CORS setup

## 💡 Tips

1. **Use Refresh Button**: Pull-to-refresh on web is a button click
2. **Search is Real-time**: No need to press enter, just type
3. **Click Cards**: Most cards are clickable to view details
4. **Status Colors**: Color-coded for quick visual identification
5. **Back Navigation**: Use browser back or the back buttons in the UI

## 📞 Need Help?

Check the full documentation: `PURCHASE_MODULES_COMPLETE.md`

## 🎉 Success!

You now have a fully functional web version of Purchase History, GRN Management, and Approvals! 🚀

The only missing piece is the complex Purchase Requisition form, which requires multiple modals and complex state management. Use the mobile app for creating new requisitions until this is fully implemented.

