# CRM Integration Setup

## Important: Authentication Configuration

The application uses Basic Authentication to connect to SAP Sales and Service Cloud V2 APIs. You need to configure the credentials before the entity selectors will work.

### How to Configure Credentials

1. Open `src/app/services/crm.service.ts`
2. Find this line:
   ```typescript
   private readonly credentials = btoa('username:password');
   ```
3. Replace `'username:password'` with your actual SAP Sales Cloud credentials in the format `'your-username:your-password'`

Example:
```typescript
private readonly credentials = btoa('john.doe@company.com:MySecurePassword123');
```

### Security Note

**⚠️ Important for Production:**
- Never commit real credentials to source control
- Use environment variables or a secure backend proxy
- Consider implementing OAuth 2.0 for production deployments

### CRM Endpoints Configured

The application connects to:
- **Base URL:** `https://my1000210.de1.demo.crm.cloud.sap`
- **Opportunities:** `/sap/c4c/api/v1/opportunity-service/opportunities`
- **Accounts:** `/sap/c4c/api/v1/account-service/accounts`
- **Products:** `/sap/c4c/api/v1/product-service/products`
- **Employees:** `/sap/c4c/api/v1/employee-service/employees`
- **Service Cases:** `/sap/c4c/api/v1/case-service/cases`

## Features

The entity selector provides:
- **Type-ahead search** - Real-time filtering as you type
- **Keyboard navigation** - Use arrow keys to navigate, Enter to select, Escape to close
- **Display names** - Shows descriptive names instead of UUIDs
- **DisplayId support** - Shows additional identifier when available
- **Clear selection** - Easy button to remove selection

## Testing Without CRM Access

If you don't have access to the CRM system yet, you can test with mock data by temporarily modifying the `CrmService` to return static data instead of making HTTP calls.
