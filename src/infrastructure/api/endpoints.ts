export const API_ENDPOINTS = {
  AUTH: {
    LOGIN: "/auth/login",
    REGISTER: "/auth/register",
    GOOGLE: "/auth/google",
    REFRESH: "/auth/refresh",
    LOGOUT: "/auth/logout",
    ME: "/auth/me",
  },

  PRODUCTS: {
    BASE: "/products",
    BY_ID: (id: string) => `/products/${id}`,
    BY_CATEGORY: (category: string) => `/products/category/${category}`,
    SEARCH: "/products/search",
    TRENDING: "/products/trending",
    LATEST: "/products/latest",
    COLORS: (category: string) => `/products/${category}/colors`,
    SIZES: (category: string) => `/products/${category}/sizes`,
  },

  DESIGNS: {
    BASE: "/designs",
    BY_ID: (id: string) => `/designs/${id}`,
    BY_DESIGNER: (designerId: string) => `/designs/designer/${designerId}`,
    VERIFY: (id: string) => `/designs/${id}/verify`,
    REJECT: (id: string) => `/designs/${id}/reject`,
    UPLOAD: "/designs/upload",
    SEARCH: "/designs/search",
    TRENDING: "/designs/trending",
    LATEST: "/designs/latest",
  },

  USERS: {
    BASE: "/users",
    BY_ID: (id: string) => `/users/${id}`,
    PROFILE: (id: string) => `/users/${id}/profile`,
    ORDERS: (id: string) => `/users/${id}/orders`,
    CART: (id: string) => `/users/${id}/cart`,
    WISHLIST: (id: string) => `/users/${id}/wishlist`,
    FOLLOW_DESIGNER: (designerId: string) => `/users/follow/${designerId}`,
    UNFOLLOW_DESIGNER: (designerId: string) => `/users/unfollow/${designerId}`,
  },

  FINAL_PRODUCTS: {
    BASE: "/final-products",
    BY_ID: (id: string) => `/final-products/${id}`,
    BY_DESIGNER: (designerId: string) =>
      `/final-products/designer/${designerId}`,
    BY_DESIGN: (designId: string) => `/final-products/design/${designId}`,
    TRENDING: "/final-products/trending",
    LATEST: "/final-products/latest",
    SEARCH: "/final-products/search",
  },

  DESIGNERS: {
    BASE: "/designers",

    // Basic CRUD
    BY_ID: (id: string) => `/designers/${id}`,
    REQUEST: "/designers/request",
    PROFILE: (id: string) => `/designers/${id}/profile`,
    SETTINGS: (id: string) => `/designers/${id}/settings`,

    // Profile & Portfolio
    PORTFOLIO: (id: string) => `/designers/${id}/portfolio`,
    DOCUMENTS: (id: string) => `/designers/${id}/documents`,
    UPLOAD_PHOTO: (id: string) => `/designers/${id}/photo`,
    COVER_IMAGE: (id: string) => `/designers/${id}/cover`,
    BIO: (id: string) => `/designers/${id}/bio`,
    SOCIAL_LINKS: (id: string) => `/designers/${id}/social-links`,

    // Verification & Legal
    VERIFICATION_STATUS: (id: string) => `/designers/${id}/verification`,
    VERIFY: (id: string) => `/designers/${id}/verify`,
    REJECT: (id: string) => `/designers/${id}/reject`,
    LEGAL_INFO: (id: string) => `/designers/${id}/legal`,
    TAX_INFO: (id: string) => `/designers/${id}/tax`,

    // Designs & Products
    DESIGNS: (id: string) => `/designers/${id}/designs`,
    PRODUCTS: (id: string) => `/designers/${id}/products`,
    COLLECTIONS: (id: string) => `/designers/${id}/collections`,
    FEATURED_DESIGNS: (id: string) => `/designers/${id}/designs/featured`,
    DRAFT_DESIGNS: (id: string) => `/designers/${id}/designs/drafts`,

    // Analytics & Metrics
    ANALYTICS: (id: string) => `/designers/${id}/analytics`,
    EARNINGS: (id: string) => `/designers/${id}/earnings`,
    SALES_REPORT: (id: string) => `/designers/${id}/sales-report`,
    PERFORMANCE: (id: string) => `/designers/${id}/performance`,
    TRAFFIC: (id: string) => `/designers/${id}/traffic`,
    CONVERSION_RATES: (id: string) => `/designers/${id}/conversion-rates`,

    // Financial
    PAYOUT_SETTINGS: (id: string) => `/designers/${id}/payout-settings`,
    PAYMENT_HISTORY: (id: string) => `/designers/${id}/payments`,
    WITHDRAW: (id: string) => `/designers/${id}/withdraw`,
    INVOICES: (id: string) => `/designers/${id}/invoices`,
    REVENUE_SHARE: (id: string) => `/designers/${id}/revenue-share`,

    // Social & Community
    FOLLOWERS: (id: string) => `/designers/${id}/followers`,
    FOLLOWING: (id: string) => `/designers/${id}/following`,
    REVIEWS: (id: string) => `/designers/${id}/reviews`,
    COMMENTS: (id: string) => `/designers/${id}/comments`,
    NOTIFICATIONS: (id: string) => `/designers/${id}/notifications`,

    // Discovery & Ranking
    FEATURED: "/designers/featured",
    TOP_EARNERS: "/designers/top-earners",
    TRENDING: "/designers/trending",
    RECOMMENDED: "/designers/recommended",
    NEW: "/designers/new",
    SEARCH: "/designers/search",

    // Categories & Specializations
    CATEGORIES: "/designers/categories",
    BY_CATEGORY: (category: string) => `/designers/category/${category}`,
    SPECIALIZATIONS: "/designers/specializations",
    BY_SPECIALIZATION: (spec: string) => `/designers/specialization/${spec}`,

    // Store Management
    STORE_SETTINGS: (id: string) => `/designers/${id}/store`,
    STORE_THEME: (id: string) => `/designers/${id}/store/theme`,
    STORE_SECTIONS: (id: string) => `/designers/${id}/store/sections`,
    FEATURED_ITEMS: (id: string) => `/designers/${id}/store/featured`,

    // Collaboration & Teams
    TEAM: (id: string) => `/designers/${id}/team`,
    COLLABORATIONS: (id: string) => `/designers/${id}/collaborations`,
    INVITE_MEMBER: (id: string) => `/designers/${id}/team/invite`,

    // Support & Help
    SUPPORT_TICKETS: (id: string) => `/designers/${id}/support`,
    CREATE_TICKET: (id: string) => `/designers/${id}/support/create`,
    RESOURCES: "/designers/resources",
    GUIDELINES: "/designers/guidelines",
    HELP_CENTER: "/designers/help",

    // Reports & Exports
    EXPORT_DATA: (id: string) => `/designers/${id}/export`,
    GENERATE_REPORT: (id: string) => `/designers/${id}/reports/generate`,
    SCHEDULED_REPORTS: (id: string) => `/designers/${id}/reports/scheduled`,

    // Settings & Preferences
    PREFERENCES: (id: string) => `/designers/${id}/preferences`,
    PRIVACY: (id: string) => `/designers/${id}/privacy`,
    NOTIFICATIONS_SETTINGS: (id: string) =>
      `/designers/${id}/notifications/settings`,
    API_KEYS: (id: string) => `/designers/${id}/api-keys`,

    // Bulk Operations
    BULK_UPDATE_DESIGNS: (id: string) => `/designers/${id}/designs/bulk-update`,
    BULK_UPDATE_PRICES: (id: string) =>
      `/designers/${id}/products/bulk-price-update`,
    BULK_EXPORT: (id: string) => `/designers/${id}/bulk-export`,

    // Integration & Tools
    TOOLS: (id: string) => `/designers/${id}/tools`,
    INTEGRATIONS: (id: string) => `/designers/${id}/integrations`,
    CONNECT_SOCIAL: (id: string) => `/designers/${id}/connect-social`,
    ANALYTICS_INTEGRATION: (id: string) =>
      `/designers/${id}/analytics-integration`,

    // Application & Approval
    APPLY: "/designers/apply",
    APPLICATION_STATUS: (applicationId: string) =>
      `/designers/application/${applicationId}`,
    SUBMIT_DOCUMENTS: (applicationId: string) =>
      `/designers/application/${applicationId}/documents`,
    REVIEW_APPLICATION: (applicationId: string) =>
      `/designers/application/${applicationId}/review`,

    // Communication
    MESSAGES: (id: string) => `/designers/${id}/messages`,
    ANNOUNCEMENTS: "/designers/announcements",
    FEEDBACK: (id: string) => `/designers/${id}/feedback`,

    // Stats & Achievements
    ACHIEVEMENTS: (id: string) => `/designers/${id}/achievements`,
    BADGES: (id: string) => `/designers/${id}/badges`,
    LEVEL: (id: string) => `/designers/${id}/level`,
    RANKING: (id: string) => `/designers/${id}/ranking`,

    // Quality & Moderation
    QUALITY_SCORE: (id: string) => `/designers/${id}/quality-score`,
    MODERATION_HISTORY: (id: string) => `/designers/${id}/moderation`,
    REPORTED_CONTENT: (id: string) => `/designers/${id}/reported`,
  },
  STORAGE: {
    // Upload endpoints
    UPLOAD: {
      BASE: "/storage/upload",
      DESIGN: "/storage/upload/design",
      PROFILE: "/storage/upload/profile",
      COVER: "/storage/upload/cover",
      DOCUMENT: "/storage/upload/document",
      BULK: "/storage/upload/bulk",
      SIGNED: "/storage/upload/signed", // Get signed upload URL
    },

    // File management
    FILES: {
      BASE: "/storage/files",
      BY_ID: (fileId: string) => `/storage/files/${fileId}`,
      METADATA: (fileId: string) => `/storage/files/${fileId}/metadata`,
      DOWNLOAD: (fileId: string) => `/storage/files/${fileId}/download`,
      SIGNED_URL: (fileId: string) => `/storage/files/${fileId}/signed-url`,
      DELETE: (fileId: string) => `/storage/files/${fileId}`,
      BULK_DELETE: "/storage/files/bulk-delete",
    },

    // Image transformations
    TRANSFORM: {
      BASE: "/storage/transform",
      BY_ID: (fileId: string) => `/storage/transform/${fileId}`,
      OPTIMIZE: (fileId: string) => `/storage/transform/${fileId}/optimize`,
      RESIZE: (fileId: string) => `/storage/transform/${fileId}/resize`,
      CROP: (fileId: string) => `/storage/transform/${fileId}/crop`,
      FORMAT: (fileId: string) => `/storage/transform/${fileId}/format`,
    },

    // Cloudinary specific
    CLOUDINARY: {
      SIGNATURE: "/storage/cloudinary/signature",
      DIRECT_UPLOAD: "/storage/cloudinary/direct-upload",
      PRESET: (presetName: string) =>
        `/storage/cloudinary/presets/${presetName}`,
      TRANSFORM_URL: (publicId: string) =>
        `/storage/cloudinary/transform/${publicId}`,
    },

    // Azure specific
    AZURE: {
      SAS_TOKEN: "/storage/azure/sas-token",
      CONTAINER: (container: string) =>
        `/storage/azure/containers/${container}`,
      BLOB: (container: string, blob: string) =>
        `/storage/azure/containers/${container}/blobs/${blob}`,
    },

    // Folders and organization
    FOLDERS: {
      BASE: "/storage/folders",
      CREATE: "/storage/folders/create",
      BY_ID: (folderId: string) => `/storage/folders/${folderId}`,
      CONTENTS: (folderId: string) => `/storage/folders/${folderId}/contents`,
      MOVE: "/storage/folders/move",
    },

    // Tags and metadata
    TAGS: {
      BASE: "/storage/tags",
      ADD: (fileId: string) => `/storage/files/${fileId}/tags`,
      REMOVE: (fileId: string) => `/storage/files/${fileId}/tags`,
      BY_TAG: (tag: string) => `/storage/tags/${tag}/files`,
    },

    // Analytics and metrics
    ANALYTICS: {
      USAGE: "/storage/analytics/usage",
      BANDWIDTH: "/storage/analytics/bandwidth",
      POPULAR: "/storage/analytics/popular-files",
      STORAGE_USAGE: "/storage/analytics/storage-usage",
    },

    // Storage management
    MANAGEMENT: {
      STATS: "/storage/management/stats",
      QUOTA: "/storage/management/quota",
      CLEANUP: "/storage/management/cleanup",
      OPTIMIZE_STORAGE: "/storage/management/optimize",
    },

    // Search and discovery
    SEARCH: {
      FILES: "/storage/search/files",
      BY_METADATA: "/storage/search/metadata",
      BY_SIMILARITY: "/storage/search/similar",
      SUGGESTIONS: "/storage/search/suggestions",
    },

    // Backup and archival
    BACKUP: {
      CREATE: "/storage/backup/create",
      RESTORE: "/storage/backup/restore",
      LIST: "/storage/backup/list",
      STATUS: (backupId: string) => `/storage/backup/${backupId}/status`,
    },

    // Health and monitoring
    HEALTH: {
      STATUS: "/storage/health/status",
      METRICS: "/storage/health/metrics",
      LOGS: "/storage/health/logs",
    },
  },

  // Helper function for building storage URLs with transformations
  STORAGE_UTILS: {
    /**
     * Build a transformed image URL
     */
    getTransformedImageUrl: (
      fileId: string,
      options: {
        width?: number;
        height?: number;
        format?: string;
        quality?: number;
        crop?: string;
      },
    ) => {
      const baseUrl = process.env.NEXT_PUBLIC_STORAGE_URL;
      const transformations = Object.entries(options)
        .filter(([_, value]) => value !== undefined)
        .map(([key, value]) => `${key}_${value}`)
        .join(",");

      return `${baseUrl}/transform/${fileId}/${transformations}`;
    },

    /**
     * Build a signed URL for temporary access
     */
    getSignedUrl: (fileId: string, expiresIn: number = 3600) => {
      return `${process.env.NEXT_PUBLIC_STORAGE_URL}/files/${fileId}/signed?expires=${expiresIn}`;
    },

    /**
     * Build an optimized image URL
     */
    getOptimizedImageUrl: (fileId: string, width?: number, height?: number) => {
      const baseUrl = process.env.NEXT_PUBLIC_STORAGE_URL;
      const dims =
        width || height ? `/${width || "auto"}x${height || "auto"}` : "";

      return `${baseUrl}/transform/${fileId}/optimize${dims}`;
    },
  },
} as const;
