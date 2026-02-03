# Testing Status Management Features

## 🧪 Quick Test Guide

### Prerequisites
- Backend compiled and running
- Database populated with test data
- Frontend built and running

### Test Scenarios

#### 1️⃣ View Status Badges in Contract List

**API Endpoint**: `GET /contratos`

**Expected Response**:
```json
[
  {
    "id": 1,
    "numero_contrato": "CT-2026-001",
    "data_vencimento": "2031-01-19",
    "status": "ativo"  // Far future - no change
  },
  {
    "id": 2,
    "numero_contrato": "CT-TEST-VENCIDO",
    "data_vencimento": "2026-01-18",
    "status": "vencido"  // ✅ Status changed automatically!
  },
  {
    "id": 3,
    "numero_contrato": "CT-TEST-A_VENCER",
    "data_vencimento": "2026-02-08",
    "status": "a_vencer"  // ✅ Status changed automatically!
  },
  {
    "id": 4,
    "numero_contrato": "CT-TEST-ATIVO",
    "data_vencimento": "2026-02-28",
    "status": "ativo"  // Beyond 30-day window
  }
]
```

**Postman Instructions**:
1. Create request: `GET http://localhost:3000/contratos`
2. Send request
3. Verify status values match expectations above
4. Status update should happen automatically at query time

#### 2️⃣ View Individual Contract

**API Endpoint**: `GET /contratos/:id`

**Example**: `GET http://localhost:3000/contratos/2`

**Expected**:
```json
{
  "id": 2,
  "numero_contrato": "CT-TEST-VENCIDO",
  "data_vencimento": "2026-01-18",
  "status": "vencido",  // ✅ Automatically updated!
  ...
}
```

#### 3️⃣ Frontend UI Status Badges

**Location**: Contratos table view

**Visual Verification**:
- Green badge: CT-2026-001 (ativo)
- Red badge: CT-TEST-VENCIDO (vencido)
- Yellow badge: CT-TEST-A_VENCER (a_vencer)
- Green badge: CT-TEST-ATIVO (ativo)

**CSS Colors**:
```css
.status-badge.status-a_vencer { 
  background-color: #fff3cd;  /* Yellow */
  color: #856404;
}

.status-badge.status-vencido { 
  background-color: #f8d7da;  /* Red */
  color: #721c24;
}
```

#### 4️⃣ Protected Status Test

**Scenario**: Cannot auto-update contracts with protected statuses

**Test Steps**:
1. Get a contract and manually change status to CANCELADO:
   ```json
   {
     "status": "cancelado"
   }
   ```
2. Update contract with PUT
3. Query contract again
4. Status should REMAIN as "cancelado" (not auto-updated to vencido/a_vencer)

**Protected Statuses**:
- FINALIZADO
- CANCELADO  
- INADIMPLENTE

#### 5️⃣ Date Calculation Verification

**30-Day Window Logic**:

Create a contract with maturity date = TODAY + 25 days:
```
Current Date: 2026-01-18
Maturity Date: 2026-02-12 (25 days from today)
Status: a_vencer ✅ (within 30-day window)
```

Create a contract with maturity date = TODAY + 35 days:
```
Current Date: 2026-01-18
Maturity Date: 2026-02-22 (35 days from today)
Status: ativo ✅ (beyond 30-day window)
```

## 📊 Backend Flow Diagram

```
API Request (GET /contratos)
    ↓
Controller → findAll()
    ↓
atualizarStatusPorDataVencimento()
    ↓
Check each contract:
  - data_vencimento < today? → vencido
  - today <= data_vencimento <= today+30? → a_vencer
  - else if ativo → keep ativo
  - if FINALIZADO/CANCELADO/INADIMPLENTE → skip
    ↓
Return updated contracts
    ↓
Frontend displays with color badges
```

## 🔧 Troubleshooting

### Statuses Not Updating

**Check**:
1. Backend log shows `atualizarStatusPorDataVencimento()` being called
2. Database has correct dates in `data_vencimento` column
3. No SQL errors in terminal
4. Database was recreated after schema changes

**Solution**:
```bash
# Delete and recreate database
rm backend/database.sqlite
npm run build:backend
node backend/seed-db.js
node backend/test-status.js
```

### Colors Not Displaying

**Check**:
1. CSS file includes new classes
2. Frontend rebuild completed successfully
3. Browser cache cleared
4. No CSS conflicts

**Solution**:
```bash
# Rebuild frontend and clear cache
cd frontend
npm run build
# Then hard refresh browser (Ctrl+Shift+R)
```

### API Returns Old Statuses

**Cause**: Frontend cached response

**Solution**:
```bash
# Restart backend
npm run dev:backend

# Or manually clear database and reseed
node backend/seed-db.js
```

## ✅ Validation Checklist

- [ ] GET /contratos returns contracts with correct statuses
- [ ] GET /contratos/:id returns contract with correct status
- [ ] Status badges display with correct colors (yellow for a_vencer, red for vencido)
- [ ] Protected statuses (CANCELADO, FINALIZADO, INADIMPLENTE) not overridden
- [ ] New test contracts (IDs 2, 3, 4) exist in database
- [ ] No compile errors in build output
- [ ] Frontend types accept new status values
- [ ] Database schema includes new status values in CHECK constraint

## 📞 Support

If issues persist:
1. Check [STATUS_MANAGEMENT_COMPLETE.md](STATUS_MANAGEMENT_COMPLETE.md) for implementation details
2. Verify all files were updated correctly:
   - `backend/src/contratos/dto/create-contrato.dto.ts`
   - `backend/src/contratos/contratos.service.ts`
   - `backend/src/database/database.service.ts`
   - `frontend/src/types/index.ts`
   - `frontend/src/schemas/contrato.schema.ts`
   - `frontend/src/pages/Contratos/Contratos.css`
3. Run full rebuild: `npm run build`
4. Reset database: Delete `backend/database.sqlite`
