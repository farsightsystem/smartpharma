/**
 * Pharma 360 ERP & Clinical Pharmacy API - OpenAPI 3.0 Specification
 */

export const openapiSpecification: Record<string, any> = {
  openapi: "3.0.3",
  info: {
    title: "Pharma 360 ERP & Clinical Pharmacy API",
    version: "1.0.0",
    description: `
**Pharma 360** is a high-reliability, multi-tenant pharmacy ERP and clinical dispensing system.

### Key Capabilities:
- **Clinical Dispensing**: Prescription validation, generic substitution recommendation, and strict controlled-substance register with dual-pharmacist witness logging.
- **Inventory & Batch Tracking**: Multi-unit hierarchy (Box / Strip / Tablet), FEFO batch rotation, expiry tracking, batch recall quarantine, and stock adjustments.
- **POS & Cash Management**: High-speed offline-ready POS, split tenders, register shifts, cash drops, and end-of-day X/Z reports.
- **Chronic Refill Management**: Patient medication registry, chronic refill queues, proactive patient engagement logging, and statement balances.
- **Supply Chain & AP Ledger**: Purchase Orders (Draft -> Submit -> Approve -> Receive), supplier invoices, supplier return workflows, and distributor payment ledgers.
- **Multi-Branch Operations**: Inter-branch stock transfers, cross-branch inventory visibility, and branch-specific price overrides.
- **AI Forecasting**: Automated reorder recommendations, expiry risk projection, and slow-moving stock identification.
    `,
    contact: {
      name: "Pharma 360 Engineering",
      url: "https://pharma360.app",
    },
  },
  servers: [
    {
      url: "http://localhost:3003",
      description: "Local Development Server (port 3003)",
    },
    {
      url: "",
      description: "Current Host",
    },
  ],
  components: {
    securitySchemes: {
      bearerAuth: {
        type: "http",
        scheme: "bearer",
        bearerFormat: "JWT",
        description: "Standard JWT Bearer token obtained from `/api/auth/login`.",
      },
      pharmacyId: {
        type: "apiKey",
        in: "header",
        name: "x-pharmacy-id",
        description: "Optional pharmacy tenant header override for multi-tenant requests.",
      },
    },
    schemas: {
      ErrorResponse: {
        type: "object",
        properties: {
          error: { type: "string", example: "Invalid credentials or unauthorized access" },
          code: { type: "string", example: "UNAUTHORIZED" },
          details: { type: "object", nullable: true },
        },
      },
      PaginationMeta: {
        type: "object",
        properties: {
          total: { type: "integer", example: 120 },
          page: { type: "integer", example: 1 },
          limit: { type: "integer", example: 20 },
          totalPages: { type: "integer", example: 6 },
        },
      },
      User: {
        type: "object",
        properties: {
          id: { type: "string", example: "usr_101" },
          email: { type: "string", example: "pharmacist@pharma360.app" },
          name: { type: "string", example: "Dr. Faraz Ahmed" },
          role: { type: "string", example: "PHARMACIST" },
          pharmacyId: { type: "string", example: "ph_default" },
          isActive: { type: "boolean", example: true },
          createdAt: { type: "string", format: "date-time" },
        },
      },
      Pharmacy: {
        type: "object",
        properties: {
          id: { type: "string", example: "ph_default" },
          name: { type: "string", example: "Pharma 360 Central Pharmacy" },
          countryCode: { type: "string", example: "SA" },
          currency: { type: "string", example: "SAR" },
          timezone: { type: "string", example: "Asia/Riyadh" },
          phone: { type: "string", example: "+966 50 123 4567" },
          address: { type: "string", example: "King Fahd Road, Riyadh" },
          taxNumber: { type: "string", example: "310123456700003" },
          plan: { type: "string", example: "PROFESSIONAL" },
          subscriptionStatus: { type: "string", example: "ACTIVE" },
        },
      },
      Product: {
        type: "object",
        properties: {
          id: { type: "string", example: "prod_001" },
          name: { type: "string", example: "Augmentin 1g" },
          genericName: { type: "string", example: "Amoxicillin / Clavulanate" },
          barcode: { type: "string", example: "6281001234567" },
          category: { type: "string", example: "Antibiotics" },
          costPrice: { type: "number", example: 45.5 },
          salePrice: { type: "number", example: 68.0 },
          unitsPerPack: { type: "integer", example: 14 },
          minStockAlert: { type: "integer", example: 10 },
          isControlled: { type: "boolean", example: false },
          isPrescriptionRequired: { type: "boolean", example: true },
          currentStock: { type: "integer", example: 85 },
        },
      },
      Batch: {
        type: "object",
        properties: {
          id: { type: "string", example: "batch_99" },
          batchNumber: { type: "string", example: "AUG-2025-01" },
          productId: { type: "string", example: "prod_001" },
          quantity: { type: "integer", example: 50 },
          costPrice: { type: "number", example: 45.5 },
          expiryDate: { type: "string", format: "date-time" },
          isRecalled: { type: "boolean", example: false },
          status: { type: "string", enum: ["ACTIVE", "EXPIRED", "RECALLED", "DEPLETED"] },
        },
      },
      SaleItem: {
        type: "object",
        properties: {
          productId: { type: "string", example: "prod_001" },
          batchId: { type: "string", example: "batch_99" },
          quantity: { type: "integer", example: 2 },
          unitPrice: { type: "number", example: 68.0 },
          discount: { type: "number", example: 0 },
          tax: { type: "number", example: 10.2 },
          total: { type: "number", example: 136.0 },
        },
      },
      Sale: {
        type: "object",
        properties: {
          id: { type: "string", example: "inv_1002" },
          invoiceNumber: { type: "string", example: "INV-2026-00042" },
          customerId: { type: "string", nullable: true, example: "cust_1" },
          subtotal: { type: "number", example: 136.0 },
          taxTotal: { type: "number", example: 20.4 },
          discountTotal: { type: "number", example: 0 },
          netTotal: { type: "number", example: 156.4 },
          paymentMethod: { type: "string", enum: ["CASH", "CARD", "SPLIT", "CREDIT"], example: "CARD" },
          status: { type: "string", example: "COMPLETED" },
          createdAt: { type: "string", format: "date-time" },
          items: {
            type: "array",
            items: { $ref: "#/components/schemas/SaleItem" },
          },
        },
      },
      Customer: {
        type: "object",
        properties: {
          id: { type: "string", example: "cust_1" },
          name: { type: "string", example: "Ahmed Al-Harbi" },
          phone: { type: "string", example: "+966 55 987 6543" },
          email: { type: "string", example: "ahmed@example.com" },
          nationalId: { type: "string", example: "1089283741" },
          arrearsBalance: { type: "number", example: 0.0 },
          chronicConditions: { type: "array", items: { type: "string" }, example: ["Hypertension", "Type 2 Diabetes"] },
        },
      },
      ChronicMedication: {
        type: "object",
        properties: {
          id: { type: "string", example: "cm_01" },
          customerId: { type: "string", example: "cust_1" },
          productId: { type: "string", example: "prod_001" },
          productName: { type: "string", example: "Concor 5mg" },
          dosage: { type: "string", example: "1 tablet once daily" },
          refillIntervalDays: { type: "integer", example: 30 },
          lastRefillDate: { type: "string", format: "date-time" },
          nextRefillDate: { type: "string", format: "date-time" },
          status: { type: "string", enum: ["ACTIVE", "PAUSED", "COMPLETED"], example: "ACTIVE" },
        },
      },
      Prescription: {
        type: "object",
        properties: {
          id: { type: "string", example: "rx_2001" },
          prescriptionNumber: { type: "string", example: "RX-88492" },
          doctorName: { type: "string", example: "Dr. Tariq Mansoor" },
          doctorLicense: { type: "string", example: "MOH-49821" },
          patientName: { type: "string", example: "Sara Khalid" },
          status: { type: "string", enum: ["PENDING_VERIFICATION", "VERIFIED", "DISPENSED", "CANCELLED"] },
          isControlled: { type: "boolean", example: false },
          createdAt: { type: "string", format: "date-time" },
        },
      },
      Shift: {
        type: "object",
        properties: {
          id: { type: "string", example: "sh_401" },
          userId: { type: "string", example: "usr_101" },
          status: { type: "string", enum: ["OPEN", "CLOSED"], example: "OPEN" },
          openedAt: { type: "string", format: "date-time" },
          openingCash: { type: "number", example: 250.0 },
          expectedCash: { type: "number", example: 1420.5 },
          actualCash: { type: "number", nullable: true, example: null },
          difference: { type: "number", nullable: true, example: null },
        },
      },
      PurchaseOrder: {
        type: "object",
        properties: {
          id: { type: "string", example: "po_501" },
          poNumber: { type: "string", example: "PO-2026-003" },
          distributorId: { type: "string", example: "dist_1" },
          status: { type: "string", enum: ["DRAFT", "SUBMITTED", "APPROVED", "REJECTED", "RECEIVED"] },
          totalEstimatedCost: { type: "number", example: 4500.0 },
          itemsCount: { type: "integer", example: 8 },
          createdAt: { type: "string", format: "date-time" },
        },
      },
      PurchaseInvoice: {
        type: "object",
        properties: {
          id: { type: "string", example: "pi_701" },
          invoiceNumber: { type: "string", example: "SUP-INV-9921" },
          distributorId: { type: "string", example: "dist_1" },
          totalAmount: { type: "number", example: 5200.0 },
          paidAmount: { type: "number", example: 2000.0 },
          balance: { type: "number", example: 3200.0 },
          status: { type: "string", enum: ["UNPAID", "PARTIAL", "PAID"] },
          invoiceDate: { type: "string", format: "date-time" },
        },
      },
    },
  },
  security: [
    {
      bearerAuth: [],
    },
  ],
  tags: [
    { name: "Health", description: "System diagnostics and server status" },
    { name: "Auth", description: "Authentication, session management, and password recovery" },
    { name: "Pharmacy", description: "Pharmacy tenant settings, onboarding, and subscription administration" },
    { name: "Products & Drug Master", description: "Medicine catalog, drug master register, dosage forms, and bulk importing" },
    { name: "Inventory & Batches", description: "Batch lifecycle, FEFO expiry tracking, stock movements, and recall quarantine" },
    { name: "Sales & POS", description: "High-speed point of sale, receipts, split payments, and historical sales lookup" },
    { name: "Dispensing & Prescriptions", description: "Clinical prescription validation, generic substitutions, and controlled drug register" },
    { name: "Shifts & Cash Management", description: "POS cash registers, opening float, cash drops, X-reports, and closing reconciliation" },
    { name: "Customers & Chronic Refills", description: "Patient directory, chronic disease medication tracking, and proactive refill alerts" },
    { name: "Arrears & Credit Ledger", description: "Customer credit balances, debt ledger, debt payments, and settlements" },
    { name: "Purchase Orders (PO)", description: "Procurement lifecycle: drafts, supervisor approval, rejection, and supplier submission" },
    { name: "Purchases & Invoices", description: "Supplier invoice entry, batch stock intake, supplier payment allocations, and AP ledgers" },
    { name: "Supplier Returns", description: "Near-expiry and recalled stock candidate detection, supplier return claims, and credit notes" },
    { name: "Suppliers & Distributors", description: "Distributor master records, supplier accounts, and statement balance summaries" },
    { name: "Customer Returns", description: "Sales returns, restock actions, and customer refund credits" },
    { name: "Expenses", description: "Operating expenditures, overhead tracking, and expense categories" },
    { name: "Reports & Financials", description: "KPI summaries, margins, profit & loss, valuation, loss tracking, and CSV exports" },
    { name: "Branches & Transfers", description: "Multi-branch setup, inter-branch stock requests/transfers, and branch price overrides" },
    { name: "AI & Stock Forecasting", description: "AI pharmacy assistant, smart replenishment candidates, and inventory intelligence" },
    { name: "Users & Access", description: "Pharmacy staff members, invitations, user activation, and password resets" },
    { name: "Roles & Permissions", description: "Granular RBAC role definition and permission catalogues" },
    { name: "Categories", description: "Pharmaceutical categories and therapeutic classifications" },
    { name: "Companies", description: "Pharmaceutical manufacturers and marketing authorization holders" },
    { name: "Barcodes", description: "Custom barcode label generation and thermal printing" },
    { name: "Settings & Backups", description: "Automated database backups, Google Drive sync, and AI provider configurations" },
  ],
  paths: {
    // -------------------------------------------------------------
    // HEALTH
    // -------------------------------------------------------------
    "/api/health": {
      get: {
        tags: ["Health"],
        summary: "Health Check",
        description: "Returns server operational health status and current timestamp.",
        security: [],
        responses: {
          200: {
            description: "Server is healthy",
            content: {
              "application/json": {
                schema: {
                  type: "object",
                  properties: {
                    status: { type: "string", example: "ok" },
                    timestamp: { type: "string", format: "date-time" },
                  },
                },
              },
            },
          },
        },
      },
    },

    // -------------------------------------------------------------
    // AUTHENTICATION
    // -------------------------------------------------------------
    "/api/auth/register": {
      post: {
        tags: ["Auth"],
        summary: "Register new account",
        description: "Registers an initial pharmacy owner or staff account.",
        security: [],
        requestBody: {
          required: true,
          content: {
            "application/json": {
              schema: {
                type: "object",
                required: ["email", "password", "name"],
                properties: {
                  email: { type: "string", format: "email", example: "owner@pharmacy.com" },
                  password: { type: "string", minLength: 8, example: "Password123!" },
                  name: { type: "string", example: "Dr. Sarah Adams" },
                  pharmacyName: { type: "string", example: "Adams Community Pharmacy" },
                  phone: { type: "string", example: "+966 50 123 4567" },
                },
              },
            },
          },
        },
        responses: {
          201: { description: "User registered successfully" },
          400: { description: "Validation error or email already in use" },
        },
      },
    },
    "/api/auth/login": {
      post: {
        tags: ["Auth"],
        summary: "Authenticate user and get JWT",
        description: "Validates credentials and returns access & refresh tokens.",
        security: [],
        requestBody: {
          required: true,
          content: {
            "application/json": {
              schema: {
                type: "object",
                required: ["email", "password"],
                properties: {
                  email: { type: "string", format: "email", example: "owner@pharmacy.com" },
                  password: { type: "string", example: "Password123!" },
                },
              },
            },
          },
        },
        responses: {
          200: {
            description: "Authentication successful",
            content: {
              "application/json": {
                schema: {
                  type: "object",
                  properties: {
                    token: { type: "string", example: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..." },
                    refreshToken: { type: "string", example: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..." },
                    user: { $ref: "#/components/schemas/User" },
                  },
                },
              },
            },
          },
          401: { description: "Invalid email or password" },
        },
      },
    },
    "/api/auth/refresh": {
      post: {
        tags: ["Auth"],
        summary: "Refresh access token",
        security: [],
        requestBody: {
          required: true,
          content: {
            "application/json": {
              schema: {
                type: "object",
                required: ["refreshToken"],
                properties: {
                  refreshToken: { type: "string" },
                },
              },
            },
          },
        },
        responses: {
          200: { description: "Token refreshed successfully" },
          401: { description: "Invalid or expired refresh token" },
        },
      },
    },
    "/api/auth/logout": {
      post: {
        tags: ["Auth"],
        summary: "Log out user",
        responses: {
          200: { description: "Logged out successfully" },
        },
      },
    },
    "/api/auth/me": {
      get: {
        tags: ["Auth"],
        summary: "Get current authenticated user profile",
        responses: {
          200: {
            description: "Current user profile",
            content: {
              "application/json": {
                schema: { $ref: "#/components/schemas/User" },
              },
            },
          },
          401: { description: "Unauthorized" },
        },
      },
    },
    "/api/auth/change-password": {
      post: {
        tags: ["Auth"],
        summary: "Change account password",
        requestBody: {
          required: true,
          content: {
            "application/json": {
              schema: {
                type: "object",
                required: ["currentPassword", "newPassword"],
                properties: {
                  currentPassword: { type: "string" },
                  newPassword: { type: "string", minLength: 8 },
                },
              },
            },
          },
        },
        responses: {
          200: { description: "Password updated successfully" },
          400: { description: "Current password incorrect" },
        },
      },
    },
    "/api/auth/verify-password": {
      post: {
        tags: ["Auth"],
        summary: "Verify password before sensitive action",
        requestBody: {
          required: true,
          content: {
            "application/json": {
              schema: {
                type: "object",
                required: ["password"],
                properties: { password: { type: "string" } },
              },
            },
          },
        },
        responses: {
          200: { description: "Password verified" },
          401: { description: "Password invalid" },
        },
      },
    },
    "/api/auth/generate-recovery-key": {
      post: {
        tags: ["Auth"],
        summary: "Generate emergency account recovery key",
        responses: {
          200: { description: "Recovery key generated" },
        },
      },
    },
    "/api/auth/recover-password": {
      post: {
        tags: ["Auth"],
        summary: "Recover password using recovery key",
        security: [],
        requestBody: {
          required: true,
          content: {
            "application/json": {
              schema: {
                type: "object",
                required: ["email", "recoveryKey", "newPassword"],
                properties: {
                  email: { type: "string" },
                  recoveryKey: { type: "string" },
                  newPassword: { type: "string" },
                },
              },
            },
          },
        },
        responses: {
          200: { description: "Password reset successfully" },
        },
      },
    },
    "/api/auth/send-verification-email": {
      post: {
        tags: ["Auth"],
        summary: "Send email verification link",
        responses: { 200: { description: "Verification email dispatched" } },
      },
    },
    "/api/auth/verify-email": {
      post: {
        tags: ["Auth"],
        summary: "Verify email with verification code/token",
        security: [],
        responses: { 200: { description: "Email verified" } },
      },
    },
    "/api/auth/forgot-password": {
      post: {
        tags: ["Auth"],
        summary: "Request OTP for forgotten password",
        security: [],
        requestBody: {
          required: true,
          content: {
            "application/json": {
              schema: {
                type: "object",
                required: ["email"],
                properties: { email: { type: "string", format: "email" } },
              },
            },
          },
        },
        responses: { 200: { description: "OTP sent to email" } },
      },
    },
    "/api/auth/reset-password-otp": {
      post: {
        tags: ["Auth"],
        summary: "Reset password using OTP code",
        security: [],
        requestBody: {
          required: true,
          content: {
            "application/json": {
              schema: {
                type: "object",
                required: ["email", "otp", "newPassword"],
                properties: {
                  email: { type: "string" },
                  otp: { type: "string" },
                  newPassword: { type: "string" },
                },
              },
            },
          },
        },
        responses: { 200: { description: "Password reset complete" } },
      },
    },

    // -------------------------------------------------------------
    // PHARMACY & TENANCY
    // -------------------------------------------------------------
    "/api/pharmacy": {
      get: {
        tags: ["Pharmacy"],
        summary: "Get current pharmacy configuration",
        responses: {
          200: {
            description: "Pharmacy configuration",
            content: { "application/json": { schema: { $ref: "#/components/schemas/Pharmacy" } } },
          },
        },
      },
      patch: {
        tags: ["Pharmacy"],
        summary: "Update pharmacy configuration",
        requestBody: {
          required: true,
          content: {
            "application/json": {
              schema: {
                type: "object",
                properties: {
                  name: { type: "string" },
                  countryCode: { type: "string" },
                  currency: { type: "string" },
                  timezone: { type: "string" },
                  phone: { type: "string" },
                  address: { type: "string" },
                  taxNumber: { type: "string" },
                },
              },
            },
          },
        },
        responses: {
          200: { description: "Pharmacy updated" },
        },
      },
    },
    "/api/pharmacy/onboarding": {
      post: {
        tags: ["Pharmacy"],
        summary: "Complete initial pharmacy setup onboarding",
        requestBody: {
          required: true,
          content: {
            "application/json": {
              schema: {
                type: "object",
                required: ["name", "countryCode", "currency"],
                properties: {
                  name: { type: "string", example: "Al-Amal Pharmacy" },
                  countryCode: { type: "string", example: "SA" },
                  currency: { type: "string", example: "SAR" },
                  timezone: { type: "string", example: "Asia/Riyadh" },
                  taxNumber: { type: "string" },
                },
              },
            },
          },
        },
        responses: { 200: { description: "Onboarding completed" } },
      },
    },
    "/api/pharmacy/admin/pharmacies": {
      get: {
        tags: ["Pharmacy"],
        summary: "Super-Admin: List all pharmacies",
        responses: { 200: { description: "List of all tenant pharmacies" } },
      },
    },
    "/api/pharmacy/admin/pharmacies/{id}": {
      get: {
        tags: ["Pharmacy"],
        summary: "Super-Admin: Get pharmacy details",
        parameters: [{ name: "id", in: "path", required: true, schema: { type: "string" } }],
        responses: { 200: { description: "Pharmacy details" } },
      },
    },
    "/api/pharmacy/admin/pharmacies/{id}/subscription": {
      patch: {
        tags: ["Pharmacy"],
        summary: "Super-Admin: Update subscription status",
        parameters: [{ name: "id", in: "path", required: true, schema: { type: "string" } }],
        requestBody: {
          required: true,
          content: {
            "application/json": {
              schema: {
                type: "object",
                required: ["status"],
                properties: {
                  status: { type: "string", enum: ["TRIAL", "ACTIVE", "PAST_DUE", "CANCELED"] },
                  plan: { type: "string", enum: ["STARTER", "PROFESSIONAL", "ENTERPRISE"] },
                  validUntil: { type: "string", format: "date-time" },
                },
              },
            },
          },
        },
        responses: { 200: { description: "Subscription status updated" } },
      },
    },

    // -------------------------------------------------------------
    // PRODUCTS & DRUG MASTER
    // -------------------------------------------------------------
    "/api/products": {
      get: {
        tags: ["Products & Drug Master"],
        summary: "List all pharmacy products",
        parameters: [
          { name: "page", in: "query", schema: { type: "integer", default: 1 } },
          { name: "limit", in: "query", schema: { type: "integer", default: 50 } },
          { name: "search", in: "query", schema: { type: "string" } },
          { name: "category", in: "query", schema: { type: "string" } },
          { name: "isPrescriptionRequired", in: "query", schema: { type: "boolean" } },
        ],
        responses: {
          200: {
            description: "List of products",
            content: {
              "application/json": {
                schema: {
                  type: "object",
                  properties: {
                    data: { type: "array", items: { $ref: "#/components/schemas/Product" } },
                    meta: { $ref: "#/components/schemas/PaginationMeta" },
                  },
                },
              },
            },
          },
        },
      },
      post: {
        tags: ["Products & Drug Master"],
        summary: "Create a new medicine / product",
        requestBody: {
          required: true,
          content: {
            "application/json": {
              schema: {
                type: "object",
                required: ["name", "costPrice", "salePrice"],
                properties: {
                  name: { type: "string", example: "Amoxicillin 500mg" },
                  genericName: { type: "string", example: "Amoxicillin" },
                  barcode: { type: "string", example: "62899912345" },
                  category: { type: "string", example: "Antibiotics" },
                  costPrice: { type: "number", example: 15.0 },
                  salePrice: { type: "number", example: 25.0 },
                  unitsPerPack: { type: "integer", example: 20 },
                  minStockAlert: { type: "integer", example: 10 },
                  isControlled: { type: "boolean", default: false },
                  isPrescriptionRequired: { type: "boolean", default: false },
                },
              },
            },
          },
        },
        responses: { 201: { description: "Product created" } },
      },
    },
    "/api/products/search": {
      get: {
        tags: ["Products & Drug Master"],
        summary: "Instant live search for products and barcodes",
        parameters: [
          { name: "q", in: "query", required: true, schema: { type: "string" } },
          { name: "limit", in: "query", schema: { type: "integer", default: 10 } },
        ],
        responses: { 200: { description: "Search results" } },
      },
    },
    "/api/products/barcode/{b}": {
      get: {
        tags: ["Products & Drug Master"],
        summary: "Look up product by barcode",
        parameters: [{ name: "b", in: "path", required: true, schema: { type: "string" } }],
        responses: {
          200: { description: "Product found", content: { "application/json": { schema: { $ref: "#/components/schemas/Product" } } } },
          404: { description: "Barcode not found" },
        },
      },
    },
    "/api/products/{id}": {
      put: {
        tags: ["Products & Drug Master"],
        summary: "Update existing product details",
        parameters: [{ name: "id", in: "path", required: true, schema: { type: "string" } }],
        requestBody: {
          required: true,
          content: {
            "application/json": {
              schema: {
                type: "object",
                properties: {
                  name: { type: "string" },
                  genericName: { type: "string" },
                  costPrice: { type: "number" },
                  salePrice: { type: "number" },
                  minStockAlert: { type: "integer" },
                  unitsPerPack: { type: "integer" },
                },
              },
            },
          },
        },
        responses: { 200: { description: "Product updated" } },
      },
      delete: {
        tags: ["Products & Drug Master"],
        summary: "Soft-delete product",
        parameters: [{ name: "id", in: "path", required: true, schema: { type: "string" } }],
        responses: { 200: { description: "Product marked as deleted" } },
      },
    },
    "/api/products/{id}/restore": {
      post: {
        tags: ["Products & Drug Master"],
        summary: "Restore soft-deleted product",
        parameters: [{ name: "id", in: "path", required: true, schema: { type: "string" } }],
        responses: { 200: { description: "Product restored" } },
      },
    },
    "/api/products/copy-catalog": {
      post: {
        tags: ["Products & Drug Master"],
        summary: "Copy global drug catalog to pharmacy",
        responses: { 200: { description: "Catalog imported" } },
      },
    },
    "/api/products/drug-master": {
      get: {
        tags: ["Products & Drug Master"],
        summary: "Search standardized Drug Master registry",
        parameters: [
          { name: "search", in: "query", schema: { type: "string" } },
          { name: "dosageForm", in: "query", schema: { type: "string" } },
          { name: "page", in: "query", schema: { type: "integer" } },
        ],
        responses: { 200: { description: "Drug Master search results" } },
      },
    },
    "/api/products/drug-master/incomplete": {
      get: {
        tags: ["Products & Drug Master"],
        summary: "List medicines with incomplete clinical metadata",
        responses: { 200: { description: "List of incomplete medicines" } },
      },
    },
    "/api/products/drug-master/dosage-forms": {
      get: {
        tags: ["Products & Drug Master"],
        summary: "List supported dosage forms (Tablets, Syrups, Injections, etc.)",
        responses: { 200: { description: "Dosage forms array" } },
      },
    },
    "/api/products/drug-master/run-expiry-scan": {
      post: {
        tags: ["Products & Drug Master"],
        summary: "Trigger automated background scan for expiring batches",
        responses: { 200: { description: "Scan complete" } },
      },
    },
    "/api/products/drug-master/bulk-import": {
      post: {
        tags: ["Products & Drug Master"],
        summary: "Bulk import medications from JSON / CSV",
        requestBody: {
          required: true,
          content: {
            "application/json": {
              schema: {
                type: "object",
                required: ["items"],
                properties: {
                  items: {
                    type: "array",
                    items: {
                      type: "object",
                      required: ["name", "costPrice", "salePrice"],
                      properties: {
                        name: { type: "string" },
                        genericName: { type: "string" },
                        barcode: { type: "string" },
                        costPrice: { type: "number" },
                        salePrice: { type: "number" },
                      },
                    },
                  },
                },
              },
            },
          },
        },
        responses: { 200: { description: "Import completed" } },
      },
    },
    "/api/products/drug-master/{id}": {
      get: {
        tags: ["Products & Drug Master"],
        summary: "Get specific Drug Master record",
        parameters: [{ name: "id", in: "path", required: true, schema: { type: "string" } }],
        responses: { 200: { description: "Drug Master record" } },
      },
      patch: {
        tags: ["Products & Drug Master"],
        summary: "Update Drug Master record details",
        parameters: [{ name: "id", in: "path", required: true, schema: { type: "string" } }],
        responses: { 200: { description: "Record updated" } },
      },
    },

    // -------------------------------------------------------------
    // INVENTORY & BATCHES
    // -------------------------------------------------------------
    "/api/v1/inventory/batches": {
      get: {
        tags: ["Inventory & Batches"],
        summary: "List stock batches",
        parameters: [
          { name: "status", in: "query", schema: { type: "string" } },
          { name: "productId", in: "query", schema: { type: "string" } },
        ],
        responses: {
          200: {
            description: "List of batches",
            content: { "application/json": { schema: { type: "array", items: { $ref: "#/components/schemas/Batch" } } } },
          },
        },
      },
      post: {
        tags: ["Inventory & Batches"],
        summary: "Create new batch manually",
        requestBody: {
          required: true,
          content: {
            "application/json": {
              schema: {
                type: "object",
                required: ["productId", "batchNumber", "quantity", "expiryDate", "costPrice"],
                properties: {
                  productId: { type: "string" },
                  batchNumber: { type: "string" },
                  quantity: { type: "integer" },
                  expiryDate: { type: "string", format: "date-time" },
                  costPrice: { type: "number" },
                },
              },
            },
          },
        },
        responses: { 201: { description: "Batch created" } },
      },
    },
    "/api/v1/inventory/batches/expiring-soon": {
      get: {
        tags: ["Inventory & Batches"],
        summary: "Get batches expiring within specified threshold (e.g. 90 days)",
        parameters: [{ name: "days", in: "query", schema: { type: "integer", default: 90 } }],
        responses: { 200: { description: "List of near-expiry batches" } },
      },
    },
    "/api/v1/inventory/batches/product/{productId}": {
      get: {
        tags: ["Inventory & Batches"],
        summary: "Get batches for a specific product sorted by FEFO",
        parameters: [{ name: "productId", in: "path", required: true, schema: { type: "string" } }],
        responses: { 200: { description: "Product batches" } },
      },
    },
    "/api/v1/inventory/batches/{id}": {
      get: {
        tags: ["Inventory & Batches"],
        summary: "Get batch details",
        parameters: [{ name: "id", in: "path", required: true, schema: { type: "string" } }],
        responses: { 200: { description: "Batch details" } },
      },
    },
    "/api/v1/inventory/batches/{id}/adjust": {
      patch: {
        tags: ["Inventory & Batches"],
        summary: "Adjust batch stock quantity with reason",
        parameters: [{ name: "id", in: "path", required: true, schema: { type: "string" } }],
        requestBody: {
          required: true,
          content: {
            "application/json": {
              schema: {
                type: "object",
                required: ["newQuantity", "reason"],
                properties: {
                  newQuantity: { type: "integer", example: 42 },
                  reason: { type: "string", enum: ["DAMAGED", "EXPIRED", "THEFT", "INVENTORY_COUNT_CORRECTION", "DONATION"] },
                  notes: { type: "string" },
                },
              },
            },
          },
        },
        responses: { 200: { description: "Stock adjusted and movement recorded" } },
      },
    },
    "/api/v1/inventory/batches/{id}/recall": {
      patch: {
        tags: ["Inventory & Batches"],
        summary: "Mark batch as recalled (quarantine from sales)",
        parameters: [{ name: "id", in: "path", required: true, schema: { type: "string" } }],
        requestBody: {
          required: true,
          content: {
            "application/json": {
              schema: {
                type: "object",
                required: ["recallReason"],
                properties: {
                  recallReason: { type: "string", example: "Manufacturer SFDA Class II recall for packaging defect" },
                },
              },
            },
          },
        },
        responses: { 200: { description: "Batch recalled and locked from dispensing" } },
      },
    },
    "/api/v1/inventory/movements": {
      get: {
        tags: ["Inventory & Batches"],
        summary: "List stock movements audit log",
        parameters: [
          { name: "productId", in: "query", schema: { type: "string" } },
          { name: "type", in: "query", schema: { type: "string" } },
          { name: "startDate", in: "query", schema: { type: "string" } },
          { name: "endDate", in: "query", schema: { type: "string" } },
        ],
        responses: { 200: { description: "Stock movement ledger" } },
      },
    },
    "/api/v1/inventory/movements/summary": {
      get: {
        tags: ["Inventory & Batches"],
        summary: "Get stock movement summary statistics",
        responses: { 200: { description: "Movement summary" } },
      },
    },
    "/api/v1/inventory/valuation": {
      get: {
        tags: ["Inventory & Batches"],
        summary: "Total inventory valuation (cost vs retail)",
        responses: { 200: { description: "Valuation figures" } },
      },
    },

    // -------------------------------------------------------------
    // SALES & POS
    // -------------------------------------------------------------
    "/api/sales": {
      post: {
        tags: ["Sales & POS"],
        summary: "Create new sale transaction (POS Checkout)",
        description: "Deducts stock according to FEFO batches, prints invoice, records payment.",
        requestBody: {
          required: true,
          content: {
            "application/json": {
              schema: {
                type: "object",
                required: ["items", "paymentMethod"],
                properties: {
                  customerId: { type: "string", nullable: true },
                  paymentMethod: { type: "string", enum: ["CASH", "CARD", "SPLIT", "CREDIT"] },
                  paidAmount: { type: "number", example: 100.0 },
                  discountTotal: { type: "number", example: 0 },
                  notes: { type: "string" },
                  items: {
                    type: "array",
                    items: {
                      type: "object",
                      required: ["productId", "quantity", "unitPrice"],
                      properties: {
                        productId: { type: "string" },
                        batchId: { type: "string" },
                        quantity: { type: "integer" },
                        unitPrice: { type: "number" },
                        discount: { type: "number", default: 0 },
                      },
                    },
                  },
                },
              },
            },
          },
        },
        responses: {
          201: {
            description: "Sale completed",
            content: { "application/json": { schema: { $ref: "#/components/schemas/Sale" } } },
          },
          400: { description: "Insufficient stock or invalid item" },
        },
      },
      get: {
        tags: ["Sales & POS"],
        summary: "List all sales transactions",
        parameters: [
          { name: "page", in: "query", schema: { type: "integer", default: 1 } },
          { name: "limit", in: "query", schema: { type: "integer", default: 25 } },
          { name: "startDate", in: "query", schema: { type: "string" } },
          { name: "endDate", in: "query", schema: { type: "string" } },
        ],
        responses: { 200: { description: "List of sales" } },
      },
    },
    "/api/sales/recent": {
      get: {
        tags: ["Sales & POS"],
        summary: "Get most recent sales transactions (for POS drawer)",
        parameters: [{ name: "limit", in: "query", schema: { type: "integer", default: 10 } }],
        responses: { 200: { description: "Recent sales" } },
      },
    },
    "/api/sales/search": {
      get: {
        tags: ["Sales & POS"],
        summary: "Search sales by invoice number, customer name, or phone",
        parameters: [{ name: "q", in: "query", required: true, schema: { type: "string" } }],
        responses: { 200: { description: "Matched sales" } },
      },
    },
    "/api/sales/date/{date}": {
      get: {
        tags: ["Sales & POS"],
        summary: "Get sales transactions by specific calendar date (YYYY-MM-DD)",
        parameters: [{ name: "date", in: "path", required: true, schema: { type: "string" } }],
        responses: { 200: { description: "Sales for the given date" } },
      },
    },
    "/api/sales/{id}": {
      get: {
        tags: ["Sales & POS"],
        summary: "Get sale details by ID",
        parameters: [{ name: "id", in: "path", required: true, schema: { type: "string" } }],
        responses: {
          200: { description: "Sale transaction details", content: { "application/json": { schema: { $ref: "#/components/schemas/Sale" } } } },
          404: { description: "Sale not found" },
        },
      },
    },

    // -------------------------------------------------------------
    // DISPENSING & PRESCRIPTIONS
    // -------------------------------------------------------------
    "/api/v1/dispensing": {
      get: {
        tags: ["Dispensing & Prescriptions"],
        summary: "List prescriptions queue",
        parameters: [
          { name: "status", in: "query", schema: { type: "string" } },
          { name: "patientName", in: "query", schema: { type: "string" } },
        ],
        responses: { 200: { description: "Prescriptions list" } },
      },
      post: {
        tags: ["Dispensing & Prescriptions"],
        summary: "Create / intake new prescription",
        requestBody: {
          required: true,
          content: {
            "application/json": {
              schema: {
                type: "object",
                required: ["patientName", "doctorName", "items"],
                properties: {
                  prescriptionNumber: { type: "string" },
                  patientName: { type: "string" },
                  patientId: { type: "string" },
                  doctorName: { type: "string" },
                  doctorLicense: { type: "string" },
                  diagnosis: { type: "string" },
                  items: {
                    type: "array",
                    items: {
                      type: "object",
                      required: ["productId", "prescribedQuantity", "dosageInstructions"],
                      properties: {
                        productId: { type: "string" },
                        prescribedQuantity: { type: "integer" },
                        dosageInstructions: { type: "string" },
                      },
                    },
                  },
                },
              },
            },
          },
        },
        responses: { 201: { description: "Prescription recorded" } },
      },
    },
    "/api/v1/dispensing/substitutions/suggest": {
      get: {
        tags: ["Dispensing & Prescriptions"],
        summary: "Suggest generic substitutions for out-of-stock or prescribed medication",
        parameters: [{ name: "productId", in: "query", required: true, schema: { type: "string" } }],
        responses: { 200: { description: "Equivalent generic alternatives in stock" } },
      },
    },
    "/api/v1/dispensing/controlled-register": {
      get: {
        tags: ["Dispensing & Prescriptions"],
        summary: "Audit log for controlled drugs (Narcotics/Psychotropics register)",
        parameters: [
          { name: "startDate", in: "query", schema: { type: "string" } },
          { name: "endDate", in: "query", schema: { type: "string" } },
        ],
        responses: { 200: { description: "Controlled drug legal dispensing register" } },
      },
    },
    "/api/v1/dispensing/{id}": {
      get: {
        tags: ["Dispensing & Prescriptions"],
        summary: "Get prescription details and fulfillment status",
        parameters: [{ name: "id", in: "path", required: true, schema: { type: "string" } }],
        responses: { 200: { description: "Prescription details" } },
      },
    },
    "/api/v1/dispensing/{id}/verify": {
      post: {
        tags: ["Dispensing & Prescriptions"],
        summary: "Pharmacist clinical verification of prescription",
        parameters: [{ name: "id", in: "path", required: true, schema: { type: "string" } }],
        requestBody: {
          content: {
            "application/json": {
              schema: {
                type: "object",
                properties: {
                  notes: { type: "string" },
                  flagInteractions: { type: "boolean", default: false },
                },
              },
            },
          },
        },
        responses: { 200: { description: "Prescription verified by pharmacist" } },
      },
    },
    "/api/v1/dispensing/{id}/dispense": {
      post: {
        tags: ["Dispensing & Prescriptions"],
        summary: "Dispense medication and log witness if controlled drug",
        parameters: [{ name: "id", in: "path", required: true, schema: { type: "string" } }],
        requestBody: {
          content: {
            "application/json": {
              schema: {
                type: "object",
                properties: {
                  witnessPharmacistId: { type: "string", description: "Required if controlled drug" },
                  notes: { type: "string" },
                },
              },
            },
          },
        },
        responses: { 200: { description: "Medication dispensed and inventory deducted" } },
      },
    },

    // -------------------------------------------------------------
    // SHIFTS & CASH DRAWERS
    // -------------------------------------------------------------
    "/api/v1/shifts/active": {
      get: {
        tags: ["Shifts & Cash Management"],
        summary: "Get current active shift for logged in user",
        responses: { 200: { description: "Active shift object or null" } },
      },
    },
    "/api/v1/shifts/open": {
      post: {
        tags: ["Shifts & Cash Management"],
        summary: "Open POS cashier register shift",
        requestBody: {
          required: true,
          content: {
            "application/json": {
              schema: {
                type: "object",
                required: ["openingCash"],
                properties: {
                  openingCash: { type: "number", example: 300.0 },
                  notes: { type: "string" },
                },
              },
            },
          },
        },
        responses: { 201: { description: "Shift opened" } },
      },
    },
    "/api/v1/shifts/drop": {
      post: {
        tags: ["Shifts & Cash Management"],
        summary: "Record mid-shift cash drop (safe drop)",
        requestBody: {
          required: true,
          content: {
            "application/json": {
              schema: {
                type: "object",
                required: ["amount"],
                properties: {
                  amount: { type: "number", example: 500.0 },
                  reason: { type: "string", example: "Midday safe transfer" },
                },
              },
            },
          },
        },
        responses: { 200: { description: "Cash drop recorded" } },
      },
    },
    "/api/v1/shifts/{id}/x-report": {
      get: {
        tags: ["Shifts & Cash Management"],
        summary: "Generate mid-shift X-Report without closing drawer",
        parameters: [{ name: "id", in: "path", required: true, schema: { type: "string" } }],
        responses: { 200: { description: "Shift sales totals and cash expectation" } },
      },
    },
    "/api/v1/shifts/{id}/close": {
      post: {
        tags: ["Shifts & Cash Management"],
        summary: "Close shift and reconcile physical cash (Z-Report)",
        parameters: [{ name: "id", in: "path", required: true, schema: { type: "string" } }],
        requestBody: {
          required: true,
          content: {
            "application/json": {
              schema: {
                type: "object",
                required: ["actualCash"],
                properties: {
                  actualCash: { type: "number", example: 1450.0 },
                  notes: { type: "string" },
                },
              },
            },
          },
        },
        responses: { 200: { description: "Shift closed and discrepancy calculated" } },
      },
    },
    "/api/v1/shifts": {
      get: {
        tags: ["Shifts & Cash Management"],
        summary: "List shift history",
        parameters: [
          { name: "userId", in: "query", schema: { type: "string" } },
          { name: "startDate", in: "query", schema: { type: "string" } },
        ],
        responses: { 200: { description: "Historical shifts" } },
      },
    },
    "/api/v1/shifts/{id}": {
      get: {
        tags: ["Shifts & Cash Management"],
        summary: "Get shift details and reconciliation data",
        parameters: [{ name: "id", in: "path", required: true, schema: { type: "string" } }],
        responses: { 200: { description: "Shift details" } },
      },
    },

    // -------------------------------------------------------------
    // CUSTOMERS & CHRONIC REFILLS
    // -------------------------------------------------------------
    "/api/customers": {
      get: {
        tags: ["Customers & Chronic Refills"],
        summary: "List customer directory",
        parameters: [
          { name: "page", in: "query", schema: { type: "integer", default: 1 } },
          { name: "search", in: "query", schema: { type: "string" } },
        ],
        responses: {
          200: {
            description: "Customers list",
            content: { "application/json": { schema: { type: "array", items: { $ref: "#/components/schemas/Customer" } } } },
          },
        },
      },
      post: {
        tags: ["Customers & Chronic Refills"],
        summary: "Create new patient / customer profile",
        requestBody: {
          required: true,
          content: {
            "application/json": {
              schema: {
                type: "object",
                required: ["name", "phone"],
                properties: {
                  name: { type: "string", example: "Fatima Zahra" },
                  phone: { type: "string", example: "+966 54 321 0987" },
                  email: { type: "string", example: "fatima@example.com" },
                  nationalId: { type: "string", example: "1078239012" },
                  chronicConditions: { type: "array", items: { type: "string" } },
                },
              },
            },
          },
        },
        responses: { 201: { description: "Customer profile created" } },
      },
    },
    "/api/customers/search": {
      get: {
        tags: ["Customers & Chronic Refills"],
        summary: "Search customers by name, phone, or ID",
        parameters: [{ name: "q", in: "query", required: true, schema: { type: "string" } }],
        responses: { 200: { description: "Matching customers" } },
      },
    },
    "/api/customers/refills/queue": {
      get: {
        tags: ["Customers & Chronic Refills"],
        summary: "Queue of upcoming or overdue chronic medication refills",
        parameters: [{ name: "daysAhead", in: "query", schema: { type: "integer", default: 7 } }],
        responses: { 200: { description: "Pending chronic refills" } },
      },
    },
    "/api/customers/chronic-medications": {
      post: {
        tags: ["Customers & Chronic Refills"],
        summary: "Enroll customer in a chronic medication program",
        requestBody: {
          required: true,
          content: {
            "application/json": {
              schema: {
                type: "object",
                required: ["customerId", "productId", "refillIntervalDays"],
                properties: {
                  customerId: { type: "string" },
                  productId: { type: "string" },
                  dosage: { type: "string", example: "10mg once daily" },
                  refillIntervalDays: { type: "integer", example: 30 },
                  notes: { type: "string" },
                },
              },
            },
          },
        },
        responses: { 201: { description: "Chronic medication enrolled" } },
      },
    },
    "/api/customers/chronic-medications/{medId}": {
      put: {
        tags: ["Customers & Chronic Refills"],
        summary: "Update chronic medication schedule or status",
        parameters: [{ name: "medId", in: "path", required: true, schema: { type: "string" } }],
        responses: { 200: { description: "Chronic medication updated" } },
      },
      delete: {
        tags: ["Customers & Chronic Refills"],
        summary: "Cancel chronic medication enrollment",
        parameters: [{ name: "medId", in: "path", required: true, schema: { type: "string" } }],
        responses: { 200: { description: "Chronic medication canceled" } },
      },
    },
    "/api/customers/chronic-medications/{medId}/contact": {
      post: {
        tags: ["Customers & Chronic Refills"],
        summary: "Log outreach contact to patient (WhatsApp, SMS, Phone call)",
        parameters: [{ name: "medId", in: "path", required: true, schema: { type: "string" } }],
        requestBody: {
          required: true,
          content: {
            "application/json": {
              schema: {
                type: "object",
                required: ["channel"],
                properties: {
                  channel: { type: "string", enum: ["WHATSAPP", "SMS", "PHONE", "IN_PERSON"] },
                  outcome: { type: "string", example: "Patient agreed to pick up tomorrow morning" },
                },
              },
            },
          },
        },
        responses: { 200: { description: "Contact logged" } },
      },
    },
    "/api/customers/chronic-medications/{medId}/refill": {
      post: {
        tags: ["Customers & Chronic Refills"],
        summary: "Mark chronic medication refilled and compute next refill target date",
        parameters: [{ name: "medId", in: "path", required: true, schema: { type: "string" } }],
        responses: { 200: { description: "Refill recorded" } },
      },
    },
    "/api/customers/{id}": {
      get: {
        tags: ["Customers & Chronic Refills"],
        summary: "Get customer details",
        parameters: [{ name: "id", in: "path", required: true, schema: { type: "string" } }],
        responses: { 200: { description: "Customer details" } },
      },
      put: {
        tags: ["Customers & Chronic Refills"],
        summary: "Update customer profile",
        parameters: [{ name: "id", in: "path", required: true, schema: { type: "string" } }],
        responses: { 200: { description: "Customer updated" } },
      },
      delete: {
        tags: ["Customers & Chronic Refills"],
        summary: "Delete customer",
        parameters: [{ name: "id", in: "path", required: true, schema: { type: "string" } }],
        responses: { 200: { description: "Customer deleted" } },
      },
    },
    "/api/customers/{id}/statement": {
      get: {
        tags: ["Customers & Chronic Refills"],
        summary: "Get customer financial statement & purchase ledger",
        parameters: [{ name: "id", in: "path", required: true, schema: { type: "string" } }],
        responses: { 200: { description: "Customer financial statement" } },
      },
    },
    "/api/customers/{id}/chronic-medications": {
      get: {
        tags: ["Customers & Chronic Refills"],
        summary: "List all chronic medications for specific customer",
        parameters: [{ name: "id", in: "path", required: true, schema: { type: "string" } }],
        responses: { 200: { description: "Customer chronic medications list" } },
      },
    },

    // -------------------------------------------------------------
    // ARREARS & CREDIT LEDGER
    // -------------------------------------------------------------
    "/api/arrears": {
      get: {
        tags: ["Arrears & Credit Ledger"],
        summary: "List customers with outstanding debt",
        responses: { 200: { description: "Outstanding debt ledger" } },
      },
      post: {
        tags: ["Arrears & Credit Ledger"],
        summary: "Add debt record to customer balance",
        requestBody: {
          required: true,
          content: {
            "application/json": {
              schema: {
                type: "object",
                required: ["customerId", "amount"],
                properties: {
                  customerId: { type: "string" },
                  amount: { type: "number", example: 120.0 },
                  reason: { type: "string" },
                },
              },
            },
          },
        },
        responses: { 201: { description: "Debt balance increased" } },
      },
    },
    "/api/arrears/{id}/pay": {
      post: {
        tags: ["Arrears & Credit Ledger"],
        summary: "Record partial debt payment",
        parameters: [{ name: "id", in: "path", required: true, schema: { type: "string" } }],
        requestBody: {
          required: true,
          content: {
            "application/json": {
              schema: {
                type: "object",
                required: ["amount"],
                properties: {
                  amount: { type: "number", example: 50.0 },
                  paymentMethod: { type: "string", enum: ["CASH", "CARD"] },
                },
              },
            },
          },
        },
        responses: { 200: { description: "Payment recorded" } },
      },
    },
    "/api/arrears/{id}/settle": {
      post: {
        tags: ["Arrears & Credit Ledger"],
        summary: "Settle entire remaining customer arrears balance",
        parameters: [{ name: "id", in: "path", required: true, schema: { type: "string" } }],
        responses: { 200: { description: "Arrears fully cleared" } },
      },
    },
    "/api/arrears/{id}": {
      delete: {
        tags: ["Arrears & Credit Ledger"],
        summary: "Void / remove arrears record",
        parameters: [{ name: "id", in: "path", required: true, schema: { type: "string" } }],
        responses: { 200: { description: "Arrears removed" } },
      },
    },

    // -------------------------------------------------------------
    // PURCHASE ORDERS (PO)
    // -------------------------------------------------------------
    "/api/v1/purchase-orders": {
      get: {
        tags: ["Purchase Orders (PO)"],
        summary: "List purchase orders",
        parameters: [
          { name: "status", in: "query", schema: { type: "string" } },
          { name: "distributorId", in: "query", schema: { type: "string" } },
        ],
        responses: {
          200: {
            description: "List of purchase orders",
            content: { "application/json": { schema: { type: "array", items: { $ref: "#/components/schemas/PurchaseOrder" } } } },
          },
        },
      },
      post: {
        tags: ["Purchase Orders (PO)"],
        summary: "Create purchase order draft",
        requestBody: {
          required: true,
          content: {
            "application/json": {
              schema: {
                type: "object",
                required: ["distributorId", "items"],
                properties: {
                  distributorId: { type: "string" },
                  notes: { type: "string" },
                  items: {
                    type: "array",
                    items: {
                      type: "object",
                      required: ["productId", "quantity", "unitCost"],
                      properties: {
                        productId: { type: "string" },
                        quantity: { type: "integer" },
                        unitCost: { type: "number" },
                      },
                    },
                  },
                },
              },
            },
          },
        },
        responses: { 201: { description: "Purchase order draft created" } },
      },
    },
    "/api/v1/purchase-orders/{id}": {
      get: {
        tags: ["Purchase Orders (PO)"],
        summary: "Get purchase order details",
        parameters: [{ name: "id", in: "path", required: true, schema: { type: "string" } }],
        responses: { 200: { description: "Purchase order details" } },
      },
    },
    "/api/v1/purchase-orders/{id}/submit": {
      post: {
        tags: ["Purchase Orders (PO)"],
        summary: "Submit draft PO for management approval",
        parameters: [{ name: "id", in: "path", required: true, schema: { type: "string" } }],
        responses: { 200: { description: "PO submitted" } },
      },
    },
    "/api/v1/purchase-orders/{id}/approve": {
      post: {
        tags: ["Purchase Orders (PO)"],
        summary: "Approve purchase order",
        parameters: [{ name: "id", in: "path", required: true, schema: { type: "string" } }],
        responses: { 200: { description: "PO approved" } },
      },
    },
    "/api/v1/purchase-orders/{id}/reject": {
      post: {
        tags: ["Purchase Orders (PO)"],
        summary: "Reject purchase order with reason",
        parameters: [{ name: "id", in: "path", required: true, schema: { type: "string" } }],
        requestBody: {
          required: true,
          content: {
            "application/json": {
              schema: {
                type: "object",
                required: ["reason"],
                properties: { reason: { type: "string" } },
              },
            },
          },
        },
        responses: { 200: { description: "PO rejected" } },
      },
    },

    // -------------------------------------------------------------
    // PURCHASES & SUPPLIER INVOICES
    // -------------------------------------------------------------
    "/api/purchases/invoices": {
      get: {
        tags: ["Purchases & Invoices"],
        summary: "List supplier purchase invoices",
        parameters: [
          { name: "distributorId", in: "query", schema: { type: "string" } },
          { name: "status", in: "query", schema: { type: "string" } },
        ],
        responses: { 200: { description: "List of invoices" } },
      },
      post: {
        tags: ["Purchases & Invoices"],
        summary: "Receive stock intake & record purchase invoice",
        requestBody: {
          required: true,
          content: {
            "application/json": {
              schema: {
                type: "object",
                required: ["invoiceNumber", "distributorId", "invoiceDate", "items"],
                properties: {
                  invoiceNumber: { type: "string" },
                  distributorId: { type: "string" },
                  invoiceDate: { type: "string", format: "date-time" },
                  paidAmount: { type: "number", default: 0 },
                  notes: { type: "string" },
                  items: {
                    type: "array",
                    items: {
                      type: "object",
                      required: ["productId", "batchNumber", "quantity", "costPrice", "salePrice", "expiryDate"],
                      properties: {
                        productId: { type: "string" },
                        batchNumber: { type: "string" },
                        quantity: { type: "integer" },
                        costPrice: { type: "number" },
                        salePrice: { type: "number" },
                        expiryDate: { type: "string", format: "date-time" },
                      },
                    },
                  },
                },
              },
            },
          },
        },
        responses: { 201: { description: "Invoice saved and batches added to inventory" } },
      },
    },
    "/api/purchases/invoices/{id}": {
      get: {
        tags: ["Purchases & Invoices"],
        summary: "Get purchase invoice details",
        parameters: [{ name: "id", in: "path", required: true, schema: { type: "string" } }],
        responses: { 200: { description: "Invoice details" } },
      },
    },
    "/api/purchases/invoices/{distributorId}/payments": {
      post: {
        tags: ["Purchases & Invoices"],
        summary: "Record payment to supplier invoice balance",
        parameters: [{ name: "distributorId", in: "path", required: true, schema: { type: "string" } }],
        requestBody: {
          required: true,
          content: {
            "application/json": {
              schema: {
                type: "object",
                required: ["amount", "paymentMethod"],
                properties: {
                  amount: { type: "number", example: 1000.0 },
                  paymentMethod: { type: "string", enum: ["BANK_TRANSFER", "CASH", "CHEQUE"] },
                  reference: { type: "string" },
                },
              },
            },
          },
        },
        responses: { 200: { description: "Payment recorded in supplier AP ledger" } },
      },
    },
    "/api/purchases/suppliers/ledger/summary": {
      get: {
        tags: ["Purchases & Invoices"],
        summary: "Summary of payables across all suppliers",
        responses: { 200: { description: "AP ledger summary" } },
      },
    },
    "/api/purchases/distributors/{id}/ledger": {
      get: {
        tags: ["Purchases & Invoices"],
        summary: "Statement of account for a specific distributor",
        parameters: [{ name: "id", in: "path", required: true, schema: { type: "string" } }],
        responses: { 200: { description: "Distributor ledger statements" } },
      },
    },

    // -------------------------------------------------------------
    // SUPPLIER RETURNS
    // -------------------------------------------------------------
    "/api/v1/supplier-returns/candidates": {
      get: {
        tags: ["Supplier Returns"],
        summary: "Find candidate batches eligible for supplier return (near expiry, expired, or recalled)",
        parameters: [{ name: "distributorId", in: "query", schema: { type: "string" } }],
        responses: { 200: { description: "List of candidate return batches" } },
      },
    },
    "/api/v1/supplier-returns": {
      get: {
        tags: ["Supplier Returns"],
        summary: "List supplier return credit requests",
        responses: { 200: { description: "Supplier returns list" } },
      },
      post: {
        tags: ["Supplier Returns"],
        summary: "Initiate return request to distributor",
        requestBody: {
          required: true,
          content: {
            "application/json": {
              schema: {
                type: "object",
                required: ["distributorId", "items", "reason"],
                properties: {
                  distributorId: { type: "string" },
                  reason: { type: "string", enum: ["NEAR_EXPIRY", "EXPIRED", "DAMAGED", "RECALL"] },
                  notes: { type: "string" },
                  items: {
                    type: "array",
                    items: {
                      type: "object",
                      required: ["batchId", "quantity"],
                      properties: {
                        batchId: { type: "string" },
                        quantity: { type: "integer" },
                      },
                    },
                  },
                },
              },
            },
          },
        },
        responses: { 201: { description: "Return initiated and stock quarantined" } },
      },
    },
    "/api/v1/supplier-returns/{id}": {
      get: {
        tags: ["Supplier Returns"],
        summary: "Get return request details",
        parameters: [{ name: "id", in: "path", required: true, schema: { type: "string" } }],
        responses: { 200: { description: "Return details" } },
      },
    },
    "/api/v1/supplier-returns/{id}/approve": {
      post: {
        tags: ["Supplier Returns"],
        summary: "Approve supplier return and credit note deduction",
        parameters: [{ name: "id", in: "path", required: true, schema: { type: "string" } }],
        responses: { 200: { description: "Return approved" } },
      },
    },
    "/api/v1/supplier-returns/{id}/reject": {
      post: {
        tags: ["Supplier Returns"],
        summary: "Reject supplier return",
        parameters: [{ name: "id", in: "path", required: true, schema: { type: "string" } }],
        responses: { 200: { description: "Return rejected" } },
      },
    },

    // -------------------------------------------------------------
    // SUPPLIERS & DISTRIBUTORS
    // -------------------------------------------------------------
    "/api/distributors": {
      get: {
        tags: ["Suppliers & Distributors"],
        summary: "List all suppliers and distributors",
        responses: { 200: { description: "Suppliers list" } },
      },
      post: {
        tags: ["Suppliers & Distributors"],
        summary: "Register new supplier / distributor",
        requestBody: {
          required: true,
          content: {
            "application/json": {
              schema: {
                type: "object",
                required: ["name", "phone"],
                properties: {
                  name: { type: "string", example: "Al-Dawaa Medical Distribution" },
                  contactPerson: { type: "string" },
                  phone: { type: "string" },
                  email: { type: "string" },
                  taxNumber: { type: "string" },
                  address: { type: "string" },
                },
              },
            },
          },
        },
        responses: { 201: { description: "Supplier registered" } },
      },
    },
    "/api/distributors/{id}": {
      put: {
        tags: ["Suppliers & Distributors"],
        summary: "Update supplier details",
        parameters: [{ name: "id", in: "path", required: true, schema: { type: "string" } }],
        responses: { 200: { description: "Supplier updated" } },
      },
      delete: {
        tags: ["Suppliers & Distributors"],
        summary: "Delete supplier",
        parameters: [{ name: "id", in: "path", required: true, schema: { type: "string" } }],
        responses: { 200: { description: "Supplier deleted" } },
      },
    },

    // -------------------------------------------------------------
    // CUSTOMER RETURNS
    // -------------------------------------------------------------
    "/api/returns": {
      get: {
        tags: ["Customer Returns"],
        summary: "List customer return transactions",
        responses: { 200: { description: "Returns list" } },
      },
      post: {
        tags: ["Customer Returns"],
        summary: "Process customer product return / refund",
        requestBody: {
          required: true,
          content: {
            "application/json": {
              schema: {
                type: "object",
                required: ["saleId", "items"],
                properties: {
                  saleId: { type: "string" },
                  reason: { type: "string" },
                  refundMethod: { type: "string", enum: ["CASH", "CARD", "CREDIT_NOTE"] },
                  items: {
                    type: "array",
                    items: {
                      type: "object",
                      required: ["productId", "quantity"],
                      properties: {
                        productId: { type: "string" },
                        batchId: { type: "string" },
                        quantity: { type: "integer" },
                        restockToInventory: { type: "boolean", default: true },
                      },
                    },
                  },
                },
              },
            },
          },
        },
        responses: { 201: { description: "Return processed and refund issued" } },
      },
    },
    "/api/returns/{id}": {
      get: {
        tags: ["Customer Returns"],
        summary: "Get return details",
        parameters: [{ name: "id", in: "path", required: true, schema: { type: "string" } }],
        responses: { 200: { description: "Return details" } },
      },
    },

    // -------------------------------------------------------------
    // EXPENSES
    // -------------------------------------------------------------
    "/api/expenses": {
      get: {
        tags: ["Expenses"],
        summary: "List pharmacy operating expenses",
        parameters: [
          { name: "category", in: "query", schema: { type: "string" } },
          { name: "startDate", in: "query", schema: { type: "string" } },
          { name: "endDate", in: "query", schema: { type: "string" } },
        ],
        responses: { 200: { description: "List of expenses" } },
      },
      post: {
        tags: ["Expenses"],
        summary: "Record operating expense",
        requestBody: {
          required: true,
          content: {
            "application/json": {
              schema: {
                type: "object",
                required: ["title", "amount", "category"],
                properties: {
                  title: { type: "string", example: "Monthly Electricity Bill" },
                  amount: { type: "number", example: 450.0 },
                  category: { type: "string", example: "UTILITIES" },
                  notes: { type: "string" },
                  date: { type: "string", format: "date-time" },
                },
              },
            },
          },
        },
        responses: { 201: { description: "Expense recorded" } },
      },
    },
    "/api/expenses/{id}": {
      put: {
        tags: ["Expenses"],
        summary: "Update expense entry",
        parameters: [{ name: "id", in: "path", required: true, schema: { type: "string" } }],
        responses: { 200: { description: "Expense updated" } },
      },
      delete: {
        tags: ["Expenses"],
        summary: "Delete expense entry",
        parameters: [{ name: "id", in: "path", required: true, schema: { type: "string" } }],
        responses: { 200: { description: "Expense deleted" } },
      },
    },

    // -------------------------------------------------------------
    // REPORTS & FINANCIALS
    // -------------------------------------------------------------
    "/api/reports/stats": {
      get: {
        tags: ["Reports & Financials"],
        summary: "Executive KPI statistics (Sales, Gross Revenue, Orders, Low Stock)",
        parameters: [{ name: "period", in: "query", schema: { type: "string", enum: ["today", "this_week", "this_month", "this_year"] } }],
        responses: { 200: { description: "KPI statistics" } },
      },
    },
    "/api/reports/margins": {
      get: {
        tags: ["Reports & Financials"],
        summary: "Gross profit margins by product & category",
        responses: { 200: { description: "Margin analysis report" } },
      },
    },
    "/api/reports/losses": {
      get: {
        tags: ["Reports & Financials"],
        summary: "Loss report (expired medicines, damaged stock, write-offs)",
        responses: { 200: { description: "Losses breakdown" } },
      },
    },
    "/api/reports/valuation": {
      get: {
        tags: ["Reports & Financials"],
        summary: "Inventory asset valuation at cost vs sales price",
        responses: { 200: { description: "Inventory valuation" } },
      },
    },
    "/api/reports/profit-loss": {
      get: {
        tags: ["Reports & Financials"],
        summary: "Net Profit & Loss statement",
        parameters: [
          { name: "startDate", in: "query", schema: { type: "string" } },
          { name: "endDate", in: "query", schema: { type: "string" } },
        ],
        responses: { 200: { description: "P&L financial statement" } },
      },
    },
    "/api/reports/export": {
      get: {
        tags: ["Reports & Financials"],
        summary: "Export report data to CSV",
        parameters: [
          { name: "type", in: "query", required: true, schema: { type: "string", enum: ["sales", "inventory", "pnl", "expenses"] } },
        ],
        responses: {
          200: {
            description: "CSV file download",
            content: { "text/csv": { schema: { type: "string" } } },
          },
        },
      },
    },

    // -------------------------------------------------------------
    // BRANCHES & TRANSFERS
    // -------------------------------------------------------------
    "/api/branches": {
      get: {
        tags: ["Branches & Transfers"],
        summary: "List all pharmacy branches",
        responses: { 200: { description: "Branches list" } },
      },
      post: {
        tags: ["Branches & Transfers"],
        summary: "Create new branch",
        requestBody: {
          required: true,
          content: {
            "application/json": {
              schema: {
                type: "object",
                required: ["name"],
                properties: {
                  name: { type: "string", example: "North Branch (Olaya)" },
                  address: { type: "string" },
                  phone: { type: "string" },
                  isMain: { type: "boolean", default: false },
                },
              },
            },
          },
        },
        responses: { 201: { description: "Branch created" } },
      },
    },
    "/api/branches/{id}": {
      get: {
        tags: ["Branches & Transfers"],
        summary: "Get branch details",
        parameters: [{ name: "id", in: "path", required: true, schema: { type: "string" } }],
        responses: { 200: { description: "Branch details" } },
      },
      patch: {
        tags: ["Branches & Transfers"],
        summary: "Update branch details",
        parameters: [{ name: "id", in: "path", required: true, schema: { type: "string" } }],
        responses: { 200: { description: "Branch updated" } },
      },
      delete: {
        tags: ["Branches & Transfers"],
        summary: "Delete branch",
        parameters: [{ name: "id", in: "path", required: true, schema: { type: "string" } }],
        responses: { 200: { description: "Branch deleted" } },
      },
    },
    "/api/branches/{branchId}/price-overrides": {
      get: {
        tags: ["Branches & Transfers"],
        summary: "Get branch specific price overrides",
        parameters: [{ name: "branchId", in: "path", required: true, schema: { type: "string" } }],
        responses: { 200: { description: "Price overrides" } },
      },
      post: {
        tags: ["Branches & Transfers"],
        summary: "Set price override for product in specific branch",
        parameters: [{ name: "branchId", in: "path", required: true, schema: { type: "string" } }],
        requestBody: {
          required: true,
          content: {
            "application/json": {
              schema: {
                type: "object",
                required: ["productId", "salePrice"],
                properties: {
                  productId: { type: "string" },
                  salePrice: { type: "number" },
                },
              },
            },
          },
        },
        responses: { 200: { description: "Price override saved" } },
      },
    },
    "/api/branches/{branchId}/price-overrides/{productId}": {
      delete: {
        tags: ["Branches & Transfers"],
        summary: "Remove price override (revert to global product price)",
        parameters: [
          { name: "branchId", in: "path", required: true, schema: { type: "string" } },
          { name: "productId", in: "path", required: true, schema: { type: "string" } },
        ],
        responses: { 200: { description: "Override removed" } },
      },
    },
    "/api/transfers": {
      get: {
        tags: ["Branches & Transfers"],
        summary: "List stock transfer requests between branches",
        responses: { 200: { description: "Transfers list" } },
      },
      post: {
        tags: ["Branches & Transfers"],
        summary: "Initiate stock transfer request between branches",
        requestBody: {
          required: true,
          content: {
            "application/json": {
              schema: {
                type: "object",
                required: ["sourceBranchId", "targetBranchId", "items"],
                properties: {
                  sourceBranchId: { type: "string" },
                  targetBranchId: { type: "string" },
                  notes: { type: "string" },
                  items: {
                    type: "array",
                    items: {
                      type: "object",
                      required: ["productId", "quantity"],
                      properties: {
                        productId: { type: "string" },
                        batchId: { type: "string" },
                        quantity: { type: "integer" },
                      },
                    },
                  },
                },
              },
            },
          },
        },
        responses: { 201: { description: "Transfer initiated" } },
      },
    },
    "/api/transfers/cross-stock/{productId}": {
      get: {
        tags: ["Branches & Transfers"],
        summary: "Check real-time stock levels of a product across all branches",
        parameters: [{ name: "productId", in: "path", required: true, schema: { type: "string" } }],
        responses: { 200: { description: "Cross-branch stock breakdown" } },
      },
    },
    "/api/transfers/{id}/send": {
      post: {
        tags: ["Branches & Transfers"],
        summary: "Dispatch / send transfer from source branch",
        parameters: [{ name: "id", in: "path", required: true, schema: { type: "string" } }],
        responses: { 200: { description: "Transfer in transit" } },
      },
    },
    "/api/transfers/{id}/receive": {
      post: {
        tags: ["Branches & Transfers"],
        summary: "Receive & accept transfer at destination branch",
        parameters: [{ name: "id", in: "path", required: true, schema: { type: "string" } }],
        responses: { 200: { description: "Transfer received into stock" } },
      },
    },
    "/api/transfers/{id}/reject": {
      post: {
        tags: ["Branches & Transfers"],
        summary: "Reject transfer",
        parameters: [{ name: "id", in: "path", required: true, schema: { type: "string" } }],
        responses: { 200: { description: "Transfer rejected" } },
      },
    },
    "/api/transfers/{id}/cancel": {
      post: {
        tags: ["Branches & Transfers"],
        summary: "Cancel pending transfer",
        parameters: [{ name: "id", in: "path", required: true, schema: { type: "string" } }],
        responses: { 200: { description: "Transfer canceled" } },
      },
    },

    // -------------------------------------------------------------
    // AI & FORECASTING
    // -------------------------------------------------------------
    "/api/v1/ai/chat": {
      post: {
        tags: ["AI & Stock Forecasting"],
        summary: "Chat with pharmacy AI assistant (clinical or business queries)",
        requestBody: {
          required: true,
          content: {
            "application/json": {
              schema: {
                type: "object",
                required: ["message"],
                properties: {
                  message: { type: "string", example: "Which antibiotics are currently below safe threshold?" },
                  conversationId: { type: "string" },
                },
              },
            },
          },
        },
        responses: { 200: { description: "AI response" } },
      },
    },
    "/api/v1/ai/conversations": {
      get: {
        tags: ["AI & Stock Forecasting"],
        summary: "List past AI conversations",
        responses: { 200: { description: "Conversations list" } },
      },
    },
    "/api/v1/ai/conversations/{id}": {
      get: {
        tags: ["AI & Stock Forecasting"],
        summary: "Get specific conversation history",
        parameters: [{ name: "id", in: "path", required: true, schema: { type: "string" } }],
        responses: { 200: { description: "Messages list" } },
      },
    },
    "/api/v1/ai/inventory/summary": {
      get: {
        tags: ["AI & Stock Forecasting"],
        summary: "AI inventory health score & risk summary",
        responses: { 200: { description: "Health score and risk distribution" } },
      },
    },
    "/api/v1/ai/inventory/reorder-candidates": {
      get: {
        tags: ["AI & Stock Forecasting"],
        summary: "AI calculated replenishment suggestions based on velocity & lead time",
        responses: { 200: { description: "Reorder candidates" } },
      },
    },
    "/api/v1/ai/inventory/critical": {
      get: {
        tags: ["AI & Stock Forecasting"],
        summary: "Critical stockout risks projected within 7 days",
        responses: { 200: { description: "Critical items list" } },
      },
    },
    "/api/v1/ai/inventory/overstock": {
      get: {
        tags: ["AI & Stock Forecasting"],
        summary: "Overstocked items tying up pharmacy capital",
        responses: { 200: { description: "Overstocked inventory" } },
      },
    },
    "/api/v1/ai/inventory/slow-moving": {
      get: {
        tags: ["AI & Stock Forecasting"],
        summary: "Slow-moving inventory (dead capital alert)",
        responses: { 200: { description: "Slow moving items" } },
      },
    },
    "/api/v1/ai/inventory/expiry": {
      get: {
        tags: ["AI & Stock Forecasting"],
        summary: "Projected expiry risk forecast",
        responses: { 200: { description: "Batches at risk of expiring before sell-through" } },
      },
    },
    "/api/v1/ai/inventory/data-quality": {
      get: {
        tags: ["AI & Stock Forecasting"],
        summary: "Audit data quality of drug catalog (missing barcode, cost, or generic names)",
        responses: { 200: { description: "Data quality report" } },
      },
    },
    "/api/v1/ai/inventory/recommendations": {
      get: {
        tags: ["AI & Stock Forecasting"],
        summary: "List all active AI inventory recommendations",
        responses: { 200: { description: "Recommendations list" } },
      },
    },
    "/api/v1/ai/inventory/recommendations/run": {
      post: {
        tags: ["AI & Stock Forecasting"],
        summary: "Trigger immediate recalculation of AI forecasting models",
        responses: { 200: { description: "Forecasting algorithm executed" } },
      },
    },
    "/api/v1/ai/inventory/recommendations/{id}/acknowledge": {
      patch: {
        tags: ["AI & Stock Forecasting"],
        summary: "Acknowledge AI recommendation",
        parameters: [{ name: "id", in: "path", required: true, schema: { type: "string" } }],
        responses: { 200: { description: "Acknowledged" } },
      },
    },
    "/api/v1/ai/inventory/recommendations/{id}/dismiss": {
      patch: {
        tags: ["AI & Stock Forecasting"],
        summary: "Dismiss recommendation with reason",
        parameters: [{ name: "id", in: "path", required: true, schema: { type: "string" } }],
        responses: { 200: { description: "Dismissed" } },
      },
    },

    // -------------------------------------------------------------
    // USERS & ACCESS
    // -------------------------------------------------------------
    "/api/users": {
      get: {
        tags: ["Users & Access"],
        summary: "List pharmacy users and employees",
        responses: { 200: { description: "Users list" } },
      },
      post: {
        tags: ["Users & Access"],
        summary: "Create staff user account",
        requestBody: {
          required: true,
          content: {
            "application/json": {
              schema: {
                type: "object",
                required: ["name", "email", "password", "role"],
                properties: {
                  name: { type: "string" },
                  email: { type: "string", format: "email" },
                  password: { type: "string" },
                  role: { type: "string", example: "PHARMACIST" },
                  branchId: { type: "string" },
                },
              },
            },
          },
        },
        responses: { 201: { description: "User created" } },
      },
    },
    "/api/users/{id}": {
      get: {
        tags: ["Users & Access"],
        summary: "Get user details",
        parameters: [{ name: "id", in: "path", required: true, schema: { type: "string" } }],
        responses: { 200: { description: "User details" } },
      },
      patch: {
        tags: ["Users & Access"],
        summary: "Update user details or role",
        parameters: [{ name: "id", in: "path", required: true, schema: { type: "string" } }],
        responses: { 200: { description: "User updated" } },
      },
      delete: {
        tags: ["Users & Access"],
        summary: "Delete user",
        parameters: [{ name: "id", in: "path", required: true, schema: { type: "string" } }],
        responses: { 200: { description: "User deleted" } },
      },
    },
    "/api/users/{id}/status": {
      patch: {
        tags: ["Users & Access"],
        summary: "Activate or deactivate user account",
        parameters: [{ name: "id", in: "path", required: true, schema: { type: "string" } }],
        requestBody: {
          required: true,
          content: {
            "application/json": {
              schema: {
                type: "object",
                required: ["isActive"],
                properties: { isActive: { type: "boolean" } },
              },
            },
          },
        },
        responses: { 200: { description: "Status updated" } },
      },
    },
    "/api/users/{id}/reset-password": {
      post: {
        tags: ["Users & Access"],
        summary: "Admin reset user password",
        parameters: [{ name: "id", in: "path", required: true, schema: { type: "string" } }],
        requestBody: {
          required: true,
          content: {
            "application/json": {
              schema: {
                type: "object",
                required: ["newPassword"],
                properties: { newPassword: { type: "string" } },
              },
            },
          },
        },
        responses: { 200: { description: "Password reset" } },
      },
    },

    // -------------------------------------------------------------
    // ROLES & PERMISSIONS
    // -------------------------------------------------------------
    "/api/roles": {
      get: {
        tags: ["Roles & Permissions"],
        summary: "List RBAC roles",
        responses: { 200: { description: "Roles list" } },
      },
      post: {
        tags: ["Roles & Permissions"],
        summary: "Create custom role with assigned permissions",
        requestBody: {
          required: true,
          content: {
            "application/json": {
              schema: {
                type: "object",
                required: ["name", "permissions"],
                properties: {
                  name: { type: "string", example: "CHIEF_PHARMACIST" },
                  description: { type: "string" },
                  permissions: { type: "array", items: { type: "string" } },
                },
              },
            },
          },
        },
        responses: { 201: { description: "Role created" } },
      },
    },
    "/api/roles/{id}": {
      get: {
        tags: ["Roles & Permissions"],
        summary: "Get role details",
        parameters: [{ name: "id", in: "path", required: true, schema: { type: "string" } }],
        responses: { 200: { description: "Role details" } },
      },
      patch: {
        tags: ["Roles & Permissions"],
        summary: "Update role permissions",
        parameters: [{ name: "id", in: "path", required: true, schema: { type: "string" } }],
        responses: { 200: { description: "Role updated" } },
      },
      delete: {
        tags: ["Roles & Permissions"],
        summary: "Delete role",
        parameters: [{ name: "id", in: "path", required: true, schema: { type: "string" } }],
        responses: { 200: { description: "Role deleted" } },
      },
    },
    "/api/permissions": {
      get: {
        tags: ["Roles & Permissions"],
        summary: "List all system permission keys",
        responses: { 200: { description: "System permissions catalogue" } },
      },
    },

    // -------------------------------------------------------------
    // CATEGORIES
    // -------------------------------------------------------------
    "/api/categories": {
      get: {
        tags: ["Categories"],
        summary: "List medication categories",
        responses: { 200: { description: "Categories list" } },
      },
      post: {
        tags: ["Categories"],
        summary: "Create category",
        requestBody: {
          required: true,
          content: {
            "application/json": {
              schema: {
                type: "object",
                required: ["name"],
                properties: {
                  name: { type: "string", example: "Analgesics & Antipyretics" },
                  description: { type: "string" },
                },
              },
            },
          },
        },
        responses: { 201: { description: "Category created" } },
      },
    },
    "/api/categories/{id}": {
      put: {
        tags: ["Categories"],
        summary: "Update category",
        parameters: [{ name: "id", in: "path", required: true, schema: { type: "string" } }],
        responses: { 200: { description: "Category updated" } },
      },
      delete: {
        tags: ["Categories"],
        summary: "Delete category",
        parameters: [{ name: "id", in: "path", required: true, schema: { type: "string" } }],
        responses: { 200: { description: "Category deleted" } },
      },
    },

    // -------------------------------------------------------------
    // COMPANIES
    // -------------------------------------------------------------
    "/api/companies": {
      get: {
        tags: ["Companies"],
        summary: "List pharmaceutical companies / manufacturers",
        responses: { 200: { description: "Companies list" } },
      },
      post: {
        tags: ["Companies"],
        summary: "Create company / manufacturer",
        requestBody: {
          required: true,
          content: {
            "application/json": {
              schema: {
                type: "object",
                required: ["name"],
                properties: {
                  name: { type: "string", example: "GlaxoSmithKline (GSK)" },
                  country: { type: "string", example: "UK" },
                },
              },
            },
          },
        },
        responses: { 201: { description: "Company created" } },
      },
    },
    "/api/companies/{id}": {
      put: {
        tags: ["Companies"],
        summary: "Update company",
        parameters: [{ name: "id", in: "path", required: true, schema: { type: "string" } }],
        responses: { 200: { description: "Company updated" } },
      },
      delete: {
        tags: ["Companies"],
        summary: "Delete company",
        parameters: [{ name: "id", in: "path", required: true, schema: { type: "string" } }],
        responses: { 200: { description: "Company deleted" } },
      },
    },

    // -------------------------------------------------------------
    // BARCODES
    // -------------------------------------------------------------
    "/api/barcodes": {
      get: {
        tags: ["Barcodes"],
        summary: "List saved barcode configurations",
        responses: { 200: { description: "Barcode list" } },
      },
      post: {
        tags: ["Barcodes"],
        summary: "Generate barcode label metadata",
        requestBody: {
          required: true,
          content: {
            "application/json": {
              schema: {
                type: "object",
                required: ["productId", "barcode"],
                properties: {
                  productId: { type: "string" },
                  barcode: { type: "string" },
                  type: { type: "string", default: "CODE128" },
                },
              },
            },
          },
        },
        responses: { 201: { description: "Barcode created" } },
      },
    },
    "/api/barcodes/{id}": {
      delete: {
        tags: ["Barcodes"],
        summary: "Delete barcode record",
        parameters: [{ name: "id", in: "path", required: true, schema: { type: "string" } }],
        responses: { 200: { description: "Barcode deleted" } },
      },
    },

    // -------------------------------------------------------------
    // SETTINGS & BACKUP
    // -------------------------------------------------------------
    "/api/settings/backup": {
      post: {
        tags: ["Settings & Backups"],
        summary: "Trigger database backup immediately",
        responses: { 200: { description: "Backup created successfully" } },
      },
      delete: {
        tags: ["Settings & Backups"],
        summary: "Delete backup file",
        parameters: [{ name: "filename", in: "query", required: true, schema: { type: "string" } }],
        responses: { 200: { description: "Backup deleted" } },
      },
    },
    "/api/settings/backups": {
      get: {
        tags: ["Settings & Backups"],
        summary: "List available database backup files",
        responses: { 200: { description: "List of backup files" } },
      },
    },
    "/api/settings/backup/restore": {
      post: {
        tags: ["Settings & Backups"],
        summary: "Restore database from selected backup file",
        requestBody: {
          required: true,
          content: {
            "application/json": {
              schema: {
                type: "object",
                required: ["filename"],
                properties: { filename: { type: "string" } },
              },
            },
          },
        },
        responses: { 200: { description: "Database restored" } },
      },
    },
    "/api/settings/backup/directory": {
      get: {
        tags: ["Settings & Backups"],
        summary: "Get current backup storage directory",
        responses: { 200: { description: "Directory path" } },
      },
    },
    "/api/settings/gdrive": {
      get: {
        tags: ["Settings & Backups"],
        summary: "Get Google Drive backup sync status and config",
        responses: { 200: { description: "Google Drive status" } },
      },
      put: {
        tags: ["Settings & Backups"],
        summary: "Update Google Drive backup sync credentials",
        requestBody: {
          required: true,
          content: {
            "application/json": {
              schema: {
                type: "object",
                properties: {
                  enabled: { type: "boolean" },
                  folderId: { type: "string" },
                },
              },
            },
          },
        },
        responses: { 200: { description: "Google Drive configuration updated" } },
      },
    },
    "/api/settings/ai": {
      get: {
        tags: ["Settings & Backups"],
        summary: "Get AI provider configuration",
        responses: { 200: { description: "AI config (keys masked)" } },
      },
      put: {
        tags: ["Settings & Backups"],
        summary: "Save AI provider configuration (OpenAI / Anthropic / Gemini)",
        requestBody: {
          required: true,
          content: {
            "application/json": {
              schema: {
                type: "object",
                properties: {
                  provider: { type: "string", enum: ["gemini", "openai", "anthropic"] },
                  apiKey: { type: "string" },
                  model: { type: "string" },
                },
              },
            },
          },
        },
        responses: { 200: { description: "AI settings saved" } },
      },
    },
    "/api/settings/ai/test": {
      post: {
        tags: ["Settings & Backups"],
        summary: "Test connection to configured AI model provider",
        responses: { 200: { description: "AI connection successful" } },
      },
    },
  },
};
