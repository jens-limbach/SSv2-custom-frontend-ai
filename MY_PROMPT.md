# My Prompt to GitHub Copilot

This document contains the prompt I used with GitHub Copilot to create this Angular frontend application. Feel free to use it as inspiration for your own projects!

## Frontend Requirements

I need an angular frontend which has the following features: table view to display data, sorting and filtering features on that table, a "create" button which opens a modal dialog to create new entities, an inline editing feature that allows me to directly update values in the table view, an edit button that allows me to edit an entity in a modal dialog, a delete bin icon at the end of every table row to delete it.

## Design Requirements

For the design please consider the following stylesheets so that it looks similar to the UI of SAP Sales Cloud Version 2:

1. Import web component bundle into your index.html body
```html
<script type='module' src='https://stage.cxm-salescloud.com/modules/web-components/lib/cxm-components.017720c7.js'></script>
```

2. Import global styles into your index.html head
```html
<link rel="stylesheet" href="https://stage.cxm-salescloud.com/modules/web-components/assets/css/css-global.css"/>
```

3. Import theme styles into your index.html head
```html
<link rel="stylesheet" href="https://stage.cxm-salescloud.com/modules/web-components/assets/css/css-sap-horizon.css"/>
```

4. Start using the custom elements

General make sure that all navigation links are styled with the SAP Horizon theme colors (blue links that underline on hover) and the same also for buttons, icons etc.

Please make sure that all buttons have the following background color #0070F2 and a white font.

Please align the buttons and the search bar on the same level.

Call the button to create a new sample "+ Create Sample"

## Connection to Backend

Now I will describe the backend this angular frontend should connect to. The backend is creating using SAP CAP (Cloud Application Programming Model.)

**Endpoint of the backend:** `https://your-cap-backend.cfapps.eu10-004.hana.ondemand.com/sample-service/Samples`

### POST (create) request payload:

```json
{
    "sampleName": "Postman Sample JL",
    "packagingHeight": "50.00",
    "packagingMaterial": "METAL",
    "packagingWidth": "20.00",
    "costOfSample": {
        "currencyCode":"EUR",
        "content": 123.45
    },
    "notes": [
        {
            "note":"this is a note"
        },
        {
            "note":"this is second note"
        }
    ],
    "dueDate": "2025-10-23",
    "hazardous": true,
    "hazardousReason": "Some reason",
    "numberOfSamples": {
        "content":"5",
        "uomCode": "EA"
    },
    "sampleType": "WITHPACKAGING",
    "shipToAddress": "some address",
    "status": "OPEN",
    "account": {
        "accountId": "0197a1ea-090c-700e-b748-22408a48f5c1"
    },
    "product": {
        "productId": "0196b582-4c78-7bbe-8369-5b1d4d5e32a4"
    },
    "employee": {
        "employeeId": "11ed64c4-44e3-cf5e-afdb-814184010a00"
    },
    "serviceCase": {
        "serviceCaseId": "000a93ba-8418-11f0-a075-7bd7c4598b25"
    },
    "opportunity": {
        "opportunityId": "00e13fe3-97b2-11f0-95af-cbec6661d18a"
    }
}
```

**PATCH (update)** uses the same payload as the create.

### GET (read for your table view) for all entities with an example payload containing 2 entities:

```json
{
    "@odata.context": "$metadata#Samples",
    "value": [
        {
            "account_id": "04b7f966-0999-48f1-b8f6-3a1f2d1749d5",
            "costOfSample_id": "e12af3aa-d492-41cd-879b-6bd9334f0a87",
            "createdAt": "2025-11-23T10:17:29.120Z",
            "createdBy": "anonymous",
            "dueDate": "2025-11-28",
            "employee_id": "f080a8b3-c22e-40d2-a4e8-265a4823608e",
            "hazardous": true,
            "hazardousReason": "sdfsdf",
            "id": "3d2e644d-894c-4e35-8163-e35fb946cf95",
            "modifiedAt": "2025-11-23T10:18:02.258Z",
            "modifiedBy": "anonymous",
            "numberOfSamples_id": "0dd98526-be26-4a48-b49d-78c828b77b79",
            "opportunity_id": null,
            "overdueStatusIcon": "🟢",
            "packagingHeight": null,
            "packagingMaterial": null,
            "packagingWidth": null,
            "product_id": "699abc0f-9d9a-43db-9350-cc4e91d4a3a6",
            "sampleName": "New object",
            "sampleType": "WITHPACKAGING",
            "serviceCase_id": null,
            "shipToAddress": "sdfdsf",
            "status": "DELIVERED",
            "costOfSample": {
                "content": "333.00",
                "currencyCode": "IQD",
                "id": "e12af3aa-d492-41cd-879b-6bd9334f0a87"
            },
            "account": {
                "accountId": "0197a1ea-090c-700e-b748-22408a48f5c1",
                "name": "Billa Plus AG Filiale 8078",
                "displayId": "2136306"
            },
            "numberOfSamples": {
                "content": 4,
                "id": "0dd98526-be26-4a48-b49d-78c828b77b79",
                "uomCode": "XCR"
            },
            "product": {
                "productId": "11ed7535-6362-394e-afdb-813280010a00",
                "name": "Extension Tube",
                "displayId": "MZ-FG-P0004"
            },
            "employee": {
                "employeeId": "0198184d-54c7-7ccb-b051-f286aea2016a",
                "name": "Alex Rot",
                "displayId": "8000000745"
            },
            "opportunity": null,
            "serviceCase": null
        }
    ]
}
```

**Example path for reading a single entity and update:**
`https://your-cap-backend.cfapps.eu10-004.hana.ondemand.com/sample-service/Samples/95622404-82f3-4b51-aa5b-6f7e28d277d7`

Basically you append the "id" to the api path for update, delete and single read requests.

## Additional Instructions

- For the create, please make only "Sample Name" and the "Due Date" to be mandatory.
- Regarding the modal dialogs, please make sure all fields are displayed well. We have quite many fields and I don't want them to overflow in the dialog.
- When the newly created sample doesn't have all the nested objects (like costOfSample, account, product, employee, numberOfSamples, serviceCase and opportunity) please make sure that the data still displays well.

## Value Selectors

The fields opportunityId, accountId, productId, employeeId and serviceCaseId need a value selector that lists the available entries based on another rest api. These are data records stored in the connected CRM solution (SAP Sales and Service Cloud V2). So that the user can select a proper entry he needs to have a dialog where he sees a list of those entities each with their descriptive names and displayIds. He needs a type ahead search in the field itself to easily find the needed value. Still the sample API only requires the uuid to be sent with the request but it would be nice to display the descriptive name on the fields instead the uuids in our modal dialog. This is needed for both the edit and the create modal dialogs.

Use the following endpoints and basic authentication with the given credentials to fetch the lists. Also I provide you for you the attribute name of the descriptive names for each entity.

**Hostname:** `https://myXXXXXX.demo.crm.cloud.sap`  
**User:** `YOUR_USERNAME`  
**Password:** `YOUR_PASSWORD`

- **Path for fetching Opportunities:** `/sap/c4c/api/v1/opportunity-service/opportunities`  
  Descriptive name is "name"

- **Path for fetching Accounts:** `/sap/c4c/api/v1/account-service/accounts`  
  Descriptive name is "formattedName"

- **Path for fetching Products:** `/sap/c4c/api/v1/product-service/products`  
  Descriptive name is "name"

- **Path for fetching Employees:** `/sap/c4c/api/v1/employee-service/employees`  
  Descriptive name is "formattedName"

- **Path for fetching ServiceCases:** `/sap/c4c/api/v1/case-service/cases`  
  Descriptive name is "subject"

## Dropdowns

I copied you below the schema definitions for all the dropdowns.

```typescript
// Enum types
type StatusCodeType: String @assert.range enum {
    OPEN = 'OPEN';
    INPROGRESS = 'INPROGRESS';
    DELIVERED = 'DELIVERED';
    RETURNED = 'RETURNED';
    OVERDUE = 'OVERDUE';
}

type PackagingCodeType: String @assert.range enum {
    PLASTIC = 'PLASTIC';
    METAL = 'METAL';
    OTHERMATERIAL = 'OTHERMATERIAL';
}

type SampleCodeType: String @assert.range enum {
    WITHPACKAGING = 'WITHPACKAGING';
    WITHOUTPACKAGING = 'WITHOUTPACKAGING';
}
```

In addition currencyCode list currencies and uomCode list typical unit of measures.

## Business Logic

Please apply the following business logic in the modal dialogs of the frontend:
- The hazardous reason should only show if the hazardous is true
- The packaging width, height and material should only show if the sampleType is "with Packaging"
- The shipToAddress should be taken over from the account that was selected for the accountId based on the formattedPostalAddressDescription of the defaultAddress

## URL Parameter to Filter by Opportunity ID or Account ID

I want to be able to open the UI with a url parameter which filters all the samples by accountId or opportunityId. For example like this: `http://localhost:4200/?accountId=11eefcd1-7020-44ee-afdb-81dc69020a00`

## Navigation to CRM Resources

It should be possible for the user to navigate directly to each linked CRM entry of our table view. For that please add an onclick attribute with the following functions for opportunityId, accountId, productId, employeeId and serviceCaseId. Replace the UUID given in the objectKey with the actual UUID of each entity.

Example for serviceCaseId:
```javascript
onclick='openNewCnsCaseViewWithRoutingKey();'

// Open specific Case
function openNewCnsCaseViewWithRoutingKey() {
    var oCase = {operation: "navigation", params: {objectKey: "45413257-b7bc-11ef-aee8-63f1e786c385", routingKey: "case", viewType: "quickview"}};
    window.parent.postMessage(oCase, '*')
}
```

Please do it accordingly for accountId, opportunityId, productId and employeeId and use the following routingKey: mdaccount, guidedselling, mdemployee, mdproduct.

Please do the same also for the Sample itself but here place the link on top of Sample Name and use the following routingKey: `customer.ssc.CUS8735`

## Button for Configuration Dialog to Show and Hide Fields

Please add a little icon on top of the table view in the right hand side to open a configuration dialog that allows me to select which columns are displayed and which ones are hidden.

## Adding Graphical Charts

Can you please add 3 charts on top of the table that can be hidden/shown with a toggle button next to the configuration button. Let's do the following charts with Highcharts:
- Total cost of samples by currency
- Sample status distribution
- Samples by account

The charts should be hidden by default.

## Buttons for Entity Creation in Burger Menu

Can we have another button next to the others with a burger menu symbol. When we click on it there should be several actions be shown: Create Opportunity, Create Sample, Create Product, Create Account and Create Case. All these should have an onClick function assigned like this but fitting to each individual routingKey as already provided earlier.

```javascript
onClick: function openNewCnsOpportunityCreate() {
    var oOpportunity = {operation: "navigation", params: {routingKey: "guidedselling", viewType: "quickcreate"}};
    window.parent.postMessage(oOpportunity, '*')
}
```

Also the Create Sample should follow the function with RoutingKey because we want to demonstrate that you can either create a custom modal or use this standard function.

Please add another action to the burger menu called "Open Opportunities" which should be at the top. It should link to the following function:

```javascript
function openNewCnsOpportunityList() {
    var oOpportunity = {operation: "navigation", params: {routingKey: "guidedselling", viewType: "list"}};
    window.parent.postMessage(oOpportunity, '*')
}
```

## Adjust the Behaviour of the Create Sample Modal if an URL Parameter for OpportunityId was Provided

When the opportunityId was set via a url parameter the modal for the "+ Create Sample" should work slightly different. In that case the accountId and opportunityId should be pre-filled based on the opportunity that was handed over via the opportunityId filter. Also the product selection should be limited to the products existing on that current opportunity. 

For reading one opportunity you can use this path (replace the example uuid with the opportunityId):  
`/sap/c4c/api/v1/opportunity-service/opportunities/08ebf755-673a-11ee-95c9-15f11d84aae9`

You can find the accountId in `account.id` and the productIds in the array `items.productId`.

There are many product and account entries in the services. Please do not try to find the account or products in the CRM and do not validate. Just set the `account.id` you find in the field and try the lookup for the `formattedName` and `displayID` and you will most likely find it. Also for the product. Don't try to filter your list or validate the product. Create a new list only having the products you find in the opportunity in case we have one in the url parameter.

### Full Example Payload of One Opportunity with Items:

```json
{
    "value": {
        "id": "08ebf755-673a-11ee-95c9-15f11d84aae9",
        "displayId": "96",
        "name": "House Loan",
        "account": {
            "id": "11ee6680-5032-dbde-afdb-819a86020a00",
            "displayId": "1001641",
            "description": "Paula Prinz"
        },
        "items": [
            {
                "id": "bec8b2a7-4906-11ef-8cf0-cd7f7f60ca63",
                "productId": "11ed7541-056d-11ae-afdb-813280010a00",
                "productDisplayId": "MZ-FG-P0008",
                "productDescription": "1-Set Screws"
            },
            {
                "id": "20cdc7df-9943-11ef-b95c-89cc440e2c89",
                "productId": "11ed7541-056d-11ae-afdb-813280010a00",
                "productDisplayId": "MZ-FG-P0008",
                "productDescription": "1-Set Screws"
            }
        ]
    }
}
```

---

## Try It Yourself!

This prompt demonstrates how to leverage GitHub Copilot to build a complete Angular frontend application with CRM integration. The key is to be very specific about:

1. **Exact API endpoints and payload structures** - Copilot understands REST APIs well when given examples
2. **Business logic requirements** - Clearly state conditional field visibility and data transformations
3. **Design specifications** - Reference existing style systems (SAP Horizon) for consistency
4. **Integration patterns** - Explain how your app connects to external systems (CRM navigation via postMessage)

Feel free to adapt this prompt for your own use case by:
- Replacing the backend endpoints with your own API
- Adjusting the entity fields to match your data model
- Modifying the business logic rules for your domain
- Changing the design system to your company's UI framework

The more specific and detailed your prompt, the better results you'll get from AI-assisted development!
