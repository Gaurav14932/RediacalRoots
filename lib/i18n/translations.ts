export type Locale = 'en' | 'hi' | 'mr'

export interface Translations {
  common: {
    appName: string
    loading: string
    error: string
    retry: string
    save: string
    cancel: string
    submit: string
    close: string
    back: string
    view: string
    status: string
    date: string
    actions: string
    filter: string
    search: string
    all: string
    per: string
    kg: string
    quintal: string
    ton: string
    crop: string
    quantity: string
    price: string
    marketplace: string
    mandiPrices: string
    analytics: string
    inspectorQueue: string
    dashboard: string
    logisticsRuns: string
    orders: string
    signOut: string
    tip: string
    signIn: string
    getStarted: string
    myAccount: string
    demoModeBadge: string
    switchDemoRole: string
    demoMode: string
  }
  roles: {
    farmer: string
    buyer: string
    fpo: string
    inspector: string
    logistics: string
    admin: string
  }
  crops: {
    soybean: string
    tur: string
    wheat: string
    chana: string
    watermelon: string
    kharbuja: string
    onion: string
    rice: string
    cotton: string
    tomato: string
    potato: string
    maize: string
    mustard: string
    moong: string
  }
  lotStatuses: {
    draft: string
    submitted: string
    under_verification: string
    verified: string
    listed: string
    sold: string
    delivered: string
    paid: string
    aggregated: string
    rejected: string
  }
  orderStatuses: {
    pending: string
    confirmed: string
    invoiced: string
    paid: string
    scheduled: string
    picked_up: string
    in_transit: string
    delivered: string
    completed: string
    cancelled: string
  }
  header: {
    navMarketplace: string
    navMandiPrices: string
    navDashboard: string
    navOrders: string
    navLogistics: string
    navInspector: string
    navAdmin: string
    signIn: string
    getStarted: string
    myAccount: string
    signOut: string
    switchDemoRole: string
    demoMode: string
    demoDescription: string
    welcomeBack: string
  }
  landing: {
    heroTagline: string
    heroTitle: string
    heroSubtitle: string
    browseMarketplace: string
    listYourCrop: string
    howItWorksTitle: string
    howItWorksSubtitle: string
    step1Title: string
    step1Desc: string
    step2Title: string
    step2Desc: string
    step3Title: string
    step3Desc: string
    step4Title: string
    step4Desc: string
    ctaTitle: string
    ctaSubtitle: string
    createAccount: string
    exploreListings: string
    footerCopyright: string
    taglineBadge: string
    heroHeading: string
    howItWorksHeading: string
    ctaHeading: string
    footerTagline: string
  }
  marketplace: {
    title: string
    subtitle: string
    pageTitle: string
    pageSubtitle: string
    allCropsFilter: string
    allStates: string
    searchPlaceholder: string
    filterByCrop: string
    minQuantity: string
    maxPrice: string
    sortBy: string
    sortNewest: string
    sortPriceLow: string
    sortPriceHigh: string
    sortQuality: string
    noLotsFound: string
    noLotsDescription: string
    noLotsFoundDesc: string
    clearFilters: string
    resetFilters: string
    qualityScore: string
    verifiedByLab: string
    aiEstimated: string
    viewLot: string
    fpoAggregated: string
    aggregatedBadge: string
    gradePrefix: string
    perUnit: string
    sourcedFromFarmers: string
    availableQty: string
  }
  lotDetail: {
    backToMarketplace: string
    lotId: string
    qualityScore: string
    verifiedBy: string
    pendingVerification: string
    labCertified: string
    labPending: string
    passportTitle: string
    passportSubtitle: string
    metricsTitle: string
    moisture: string
    foreignMatter: string
    damagedGrains: string
    protein: string
    traceabilityTitle: string
    farmLocation: string
    harvestDate: string
    harvestDateLabel: string
    listedOnLabel: string
    fpoName: string
    sellerProfile: string
    farmerNameLabel: string
    memberFpoBadge: string
    rating: string
    reviews: string
    ratingsCountSuffix: string
    ratingsAndReviews: string
    placeOrder: string
    orderQuantity: string
    quantityLabel: string
    priceLabel: string
    totalAmount: string
    escrowNotice: string
    selectPayment: string
    payEscrow: string
    orderSuccess: string
    orderError: string
    verifiedBadge: string
    pendingBadge: string
    lotDescription: string
    contributionsTitle: string
    contributionsDesc: string
    contributingLotsDesc: string
    farmerNameCol: string
    quantityCol: string
    gradeCol: string
    locationCol: string
    noReviewsYet: string
    aggregatedLotBadge: string
    digitalQualityPassport: string
    declaredTag: string
    gradeLabel: string
    aiVisualPrescreen: string
    moistureLabel: string
    foreignMatterLabel: string
    damagedGrainLabel: string
    estimatedGradeLabel: string
    labMetricsPendingNote: string
    traceabilityBreakdown: string
    sourceLabel: string
    notAggregatedValue: string
    apmcCertified: string
    physicalPending: string
    passportId: string
    traceableBatch: string
    standardAgmark: string
    labTestingCompleted: string
    awaitingPhysicalAudit: string
    verifiedSellerBadge: string
  }
  orderForm: {
    quantityLabel: string
    quantityHelp: string
    priceBreakdown: string
    basePrice: string
    platformFee: string
    totalPrice: string
    paymentMethod: string
    escrowMethod: string
    escrowDescription: string
    escrowDesc: string
    upiMethod: string
    upiDescription: string
    instantUpi: string
    upiDesc: string
    mandiMethod: string
    mandiDescription: string
    apmcMandi: string
    mandiDesc: string
    mockDecline: string
    mockDeclineHelp: string
    simulateDeclineLabel: string
    resetTryAgainBtn: string
    orderTotalLabel: string
    authorizingBtn: string
    placeOrderBtn: string
    signInToOrderBtn: string
    confirmOrder: string
    processing: string
    insufficientStock: string
    exceedsStockError: string
    enterValidQty: string
    invalidQuantityError: string
    orderPlacedSuccess: string
    paymentDeclinedError: string
    orderSuccessToast: string
    ownListingNotice: string
    availableLabel: string
    enterQuantityPlaceholder: string
    securePaymentMethod: string
    radicalEscrow: string
  }
  orders: {
    title: string
    subtitle: string
    pageTitle: string
    farmerSubtitle: string
    buyerSubtitle: string
    orderId: string
    date: string
    crop: string
    quantity: string
    amount: string
    status: string
    seller: string
    buyer: string
    buyerLabel: string
    deliveryLabel: string
    tracking: string
    rateFarmer: string
    rated: string
    noOrders: string
    noOrdersTitle: string
    noOrdersDesc: string
    noOrdersFarmerDesc: string
    noOrdersBuyerDesc: string
    deliveryStatus: string
    tipTrackDelivery: string
    tipText: string
    viewDetails: string
    allStatuses: string
    refresh: string
    yourRatingLabel: string
    rateOrderBtn: string
  }
  ratingDialog: {
    title: string
    description: string
    dialogTitle: string
    dialogDesc: string
    qualityLabel: string
    rateCropQuality: string
    packagingLabel: string
    deliveryLabel: string
    commentLabel: string
    commentPlaceholder: string
    feedbackPlaceholder: string
    submitRating: string
    submitting: string
    submittingBtn: string
    submitRatingBtn: string
    warning: string
    requiredFeedbackWarning: string
    starPoor: string
    starFair: string
    starGood: string
    starVeryGood: string
    starExcellent: string
    flaggedWarningToast: string
    ratingSuccessToast: string
  }
  buyer: {
    welcome: string
    activeOrders: string
    totalSpent: string
    deliveredOrders: string
    recentOrders: string
    browseMore: string
    viewAllOrders: string
    ordersPlaced: string
    totalOrderValue: string
    browseMarketplaceBtn: string
    recentOrdersTitle: string
    viewAllLink: string
    noOrdersYetTitle: string
    noOrdersYetDesc: string
    goToMarketplaceBtn: string
  }
  farmer: {
    welcome: string
    activeLots: string
    totalEarned: string
    pendingReview: string
    listNewCrop: string
    myLots: string
    noLotsYet: string
    ratingTitle: string
    ratingSub: string
    dashboardSubtitle: string
    totalQuantityListed: string
    myCrops: string
    noLotsListed: string
    listFirstLot: string
    lotId: string
    actionViewLot: string
    marketComparison: string
    recentDispatches: string
    addLotBtn: string
  }
  newLot: {
    modalTitle: string
    selectCrop: string
    quantity: string
    pricePerUnit: string
    harvestDate: string
    location: string
    uploadPhotos: string
    uploadHelp: string
    aiAnalyzing: string
    aiScoreNotice: string
    estimatedOffline: string
    submitListing: string
    submitting: string
    unit: string
    expectedPrice: string
    pickupLocation: string
    selfGrade: string
    gradeA: string
    gradeB: string
    gradeC: string
    photoSectionTitle: string
    photosCount: string
    minPhotosNotice: string
    recommendedPhotosNotice: string
    uploadPhotosBtn: string
    uploadMoreBtn: string
    maxPhotosReached: string
    simulatingAi: string
    readyForInspection: string
    cancelBtn: string
    submittingBtn: string
    submitBtn: string
    successToast: string
    modalDesc: string
    cropType: string
    slotsRemaining: string
  }
  fpo: {
    welcome: string
    farmersCount: string
    totalVolume: string
    aggregateLots: string
    mergeModalTitle: string
    mergeModalDesc: string
    mergedPrice: string
    confirmMerge: string
    bulkListings: string
    pageSubtitle: string
    farmersContributing: string
    compatibleBatches: string
    mergedLots: string
    combinedVolume: string
    mergeSelectedBtn: string
    dialogTitle: string
    dialogDesc: string
    customPriceLabel: string
    pickupLocationLabel: string
    confirmMergeBtn: string
    noLotsEligible: string
    noAggregatedLots: string
    createFirstBulkDesc: string
  }
  inspector: {
    title: string
    subtitle: string
    pageTitle: string
    pageSubtitle: string
    pendingTab: string
    verifiedTab: string
    rejectedTab: string
    fifoQueue: string
    assayModalTitle: string
    moistureInput: string
    foreignMatterInput: string
    damagedGrainsInput: string
    gradeCalculated: string
    approveAndCertify: string
    rejectLot: string
    submitting: string
    noPendingLots: string
    allVerifiedDesc: string
    conductAssayBtn: string
    historyTab: string
    dialogTitle: string
    dialogDesc: string
    certifiedToast: string
    queueTab: string
    sortBy: string
    oldest: string
    locationSort: string
    damagedGrainInput: string
    computedGradeLabel: string
    notesInput: string
    certifyingBtn: string
    certifyBtn: string
  }
  logistics: {
    title: string
    subtitle: string
    pageTitle: string
    pageSubtitle: string
    activeDispatches: string
    fleetStatus: string
    routeOptimization: string
    optimizeRouteBtn: string
    optimizing: string
    routeOptimized: string
    stopProgression: string
    markPickedUp: string
    markDelivered: string
    mapLegend: string
    aiOptimizedRoute: string
    efficiencyGain: string
    stops: string
    advanceStatusBtn: string
    activeRuns: string
    noRunsTitle: string
    noRunsDesc: string
  }
  admin: {
    title: string
    subtitle: string
    pageTitle: string
    pageSubtitle: string
    totalVolume: string
    totalTransactions: string
    activeUsers: string
    disputeCount: string
    dateRange7d: string
    dateRange30d: string
    dateRange90d: string
    dateRangeAll: string
    volumeChartTitle: string
    disputesTitle: string
    resolveDispute: string
    disputeResolved: string
    platformHealth: string
    cropVolumeDistribution: string
    recentActivity: string
    resolveAction: string
    systemStatus: string
    operational: string
  }
  mandi: {
    title: string
    subtitle: string
    pageTitle: string
    pageSubtitle: string
    selectCrop: string
    selectState: string
    modalPrice: string
    minPrice: string
    maxPrice: string
    priceTrend: string
    apmcPriceDisclaimer: string
    marketArrivals: string
  }
  auth: {
    loginTitle: string
    loginSubtitle: string
    signupTitle: string
    signupSubtitle: string
    fullName: string
    phone: string
    email: string
    password: string
    repeatPassword: string
    selectRole: string
    state: string
    district: string
    location: string
    signInBtn: string
    signUpBtn: string
    noAccount: string
    hasAccount: string
    demoTitle: string
    demoSubtitle: string
    detectLocation: string
    detectingLocation: string
  }
  sellingWindow: {
    title: string
    subtitle: string
    currentPrice: string
    predictedPeak: string
    recommendation: string
    holdAdvice: string
    sellAdvice: string
    watchAdvice: string
    holdBadge: string
    sellBadge: string
    watchBadge: string
  }
}

export const translations: Record<Locale, Translations> = {
  en: {
    common: {
      appName: 'RadicalRoots',
      loading: 'Loading...',
      error: 'An error occurred',
      retry: 'Retry',
      save: 'Save',
      cancel: 'Cancel',
      submit: 'Submit',
      close: 'Close',
      back: 'Back',
      view: 'View',
      status: 'Status',
      date: 'Date',
      actions: 'Actions',
      filter: 'Filter',
      search: 'Search',
      all: 'All',
      per: 'per',
      kg: 'kg',
      quintal: 'qtl',
      ton: 'tonne',
      crop: 'Crop',
      quantity: 'Quantity',
      price: 'Price',
      marketplace: 'Marketplace',
      mandiPrices: 'Mandi Prices',
      analytics: 'Analytics',
      inspectorQueue: 'Assay Queue',
      dashboard: 'Dashboard',
      logisticsRuns: 'Dispatches',
      orders: 'Orders',
      signOut: 'Sign out',
      tip: 'Tip',
      signIn: 'Sign in',
      getStarted: 'Get started',
      myAccount: 'My Account',
      demoModeBadge: 'Demo Mode',
      switchDemoRole: 'Switch Demo Role',
      demoMode: 'Demo Mode',
    },
    roles: {
      farmer: 'Farmer',
      buyer: 'Institutional Buyer',
      fpo: 'FPO Manager',
      inspector: 'Quality Assayer',
      logistics: 'Logistics Partner',
      admin: 'Platform Admin',
    },
    crops: {
      soybean: 'Soybean',
      tur: 'Tur (Pigeon Pea)',
      wheat: 'Wheat',
      chana: 'Chana (Chickpea)',
      watermelon: 'Watermelon',
      kharbuja: 'Kharbuja (Muskmelon)',
      onion: 'Onion',
      rice: 'Rice',
      cotton: 'Cotton',
      tomato: 'Tomato',
      potato: 'Potato',
      maize: 'Maize',
      mustard: 'Mustard',
      moong: 'Moong Dal',
    },
    lotStatuses: {
      draft: 'Draft',
      submitted: 'Submitted',
      under_verification: 'Under Verification',
      verified: 'Verified',
      listed: 'Listed',
      sold: 'Sold',
      delivered: 'Delivered',
      paid: 'Paid',
      aggregated: 'Aggregated',
      rejected: 'Rejected',
    },
    orderStatuses: {
      pending: 'Pending',
      confirmed: 'Confirmed',
      invoiced: 'Invoiced',
      paid: 'Paid',
      scheduled: 'Scheduled',
      picked_up: 'Picked Up',
      in_transit: 'In Transit',
      delivered: 'Delivered',
      completed: 'Completed',
      cancelled: 'Cancelled',
    },
    header: {
      navMarketplace: 'Marketplace',
      navMandiPrices: 'Mandi Prices',
      navDashboard: 'Dashboard',
      navOrders: 'Orders',
      navLogistics: 'Logistics',
      navInspector: 'Inspector',
      navAdmin: 'Admin',
      signIn: 'Sign in',
      getStarted: 'Get started',
      myAccount: 'My Account',
      signOut: 'Sign out',
      switchDemoRole: 'Switch Demo Role',
      demoMode: 'Demo Mode',
      demoDescription: 'Preview role-specific workflows',
      welcomeBack: 'Welcome back',
    },
    landing: {
      heroTagline: 'Fair prices for farmers. Reliable supply for buyers.',
      heroTitle: 'Direct crop trade, verified quality, zero middlemen markups.',
      heroSubtitle: 'RadicalRoots connects verified agricultural producers directly with bulk commercial buyers across India. Backed by lab quality assays, transparent escrow payments, and end-to-end route logistics.',
      browseMarketplace: 'Browse the marketplace',
      listYourCrop: 'List your crop',
      howItWorksTitle: 'How RadicalRoots works',
      howItWorksSubtitle: 'From harvest listing to secure payout — fully digitized, transparent, and audited.',
      step1Title: '1. Farmers list crops',
      step1Desc: 'Farmers or FPOs upload harvest details, quantity, asking price, and photos with automated AI quality pre-screening.',
      step2Title: '2. Quality is verified',
      step2Desc: 'Certified APMC assayers conduct lab tests on moisture, foreign matter, and grain health to issue a Digital Quality Passport.',
      step3Title: '3. Buyers order directly',
      step3Desc: 'Commercial buyers browse certified lots, review lab metrics, and secure inventory with protected escrow funds.',
      step4Title: '4. Logistics and payment',
      step4Desc: 'Optimized freight routes ensure timely transit. Funds are released directly to farmer bank accounts upon digital delivery confirmation.',
      ctaTitle: 'Ready to trade crops directly, without the markup?',
      ctaSubtitle: 'Join thousands of farmers, FPOs, and institutional buyers streamlining agricultural commerce across India.',
      createAccount: 'Create your account',
      exploreListings: 'Explore listings',
      footerCopyright: '© RadicalRoots Marketplace. Built for transparent Indian agriculture.',
      taglineBadge: 'Fair prices for farmers. Reliable supply for buyers.',
      heroHeading: 'Direct crop trade, verified quality, zero middlemen markups.',
      howItWorksHeading: 'How RadicalRoots works',
      ctaHeading: 'Ready to trade crops directly, without the markup?',
      footerTagline: '© RadicalRoots Marketplace. Built for transparent Indian agriculture.',
    },
    marketplace: {
      title: 'Commodity Marketplace',
      subtitle: 'Browse lab-certified, verified crop lots directly from farmers and FPOs with guaranteed escrow protection.',
      pageTitle: 'Commodity Marketplace',
      pageSubtitle: 'Browse lab-certified, verified crop lots directly from farmers and FPOs with guaranteed escrow protection.',
      allCropsFilter: 'All Crops',
      allStates: 'All States',
      searchPlaceholder: 'Search by crop, farmer, or district...',
      filterByCrop: 'Filter by Crop',
      minQuantity: 'Min Quantity',
      maxPrice: 'Max Price',
      sortBy: 'Sort By',
      sortNewest: 'Newest First',
      sortPriceLow: 'Price: Low to High',
      sortPriceHigh: 'Price: High to Low',
      sortQuality: 'Highest Quality',
      noLotsFound: 'No crop lots match your criteria',
      noLotsDescription: 'Try adjusting your crop filters, quantity requirements, or search query to find available harvest listings.',
      noLotsFoundDesc: 'Try adjusting your crop filters, quantity requirements, or search query.',
      clearFilters: 'Clear all filters',
      resetFilters: 'Reset all filters',
      qualityScore: 'Quality Score',
      verifiedByLab: 'Lab Verified',
      aiEstimated: 'AI Screened',
      viewLot: 'View Lot Details',
      fpoAggregated: 'FPO Aggregated',
      aggregatedBadge: 'FPO Aggregated',
      gradePrefix: 'Grade',
      perUnit: 'per',
      sourcedFromFarmers: 'Sourced from verified member farmers',
      availableQty: 'Available',
    },
    lotDetail: {
      backToMarketplace: 'Back to Marketplace',
      lotId: 'Lot ID',
      qualityScore: 'Quality Score',
      verifiedBy: 'Assayed by',
      pendingVerification: 'Quality verification pending',
      labCertified: 'APMC Lab Certified',
      labPending: 'Verification in Progress',
      passportTitle: 'Digital Quality Passport',
      passportSubtitle: 'Comprehensive physical and chemical laboratory analysis certified before trade listing.',
      metricsTitle: 'Certified Lab Assay Metrics',
      moisture: 'Moisture Content',
      foreignMatter: 'Foreign Matter',
      damagedGrains: 'Damaged / Discolored Grains',
      protein: 'Protein Content',
      traceabilityTitle: 'Farm Traceability & Origin',
      farmLocation: 'Harvest Origin',
      harvestDate: 'Harvest Date',
      harvestDateLabel: 'Harvest Date',
      listedOnLabel: 'Listed on',
      fpoName: 'Producer Organization (FPO)',
      sellerProfile: 'Seller Profile',
      farmerNameLabel: 'Farmer Name',
      memberFpoBadge: 'FPO Producer Member',
      rating: 'Farmer Rating',
      reviews: 'verified buyer reviews',
      ratingsCountSuffix: 'reviews',
      ratingsAndReviews: 'Buyer Ratings & Reviews',
      placeOrder: 'Place Purchase Order',
      orderQuantity: 'Quantity to purchase',
      quantityLabel: 'Available Volume',
      priceLabel: 'Asking Rate',
      totalAmount: 'Total Estimated Value',
      escrowNotice: 'Secured via Radical Escrow — funds released only after gate-in quality verification.',
      selectPayment: 'Select Payment Rail',
      payEscrow: 'Fund Escrow & Confirm',
      orderSuccess: 'Purchase order placed successfully! Escrow deposit initiated.',
      orderError: 'Failed to place order. Please check quantity and try again.',
      verifiedBadge: 'Lab Verified',
      pendingBadge: 'Pending Verification',
      lotDescription: 'Lot Overview & Farm Notes',
      contributionsTitle: 'FPO Aggregation Traceability',
      contributionsDesc: 'This lot is aggregated from multiple verified member farmers to meet bulk commercial volume.',
      contributingLotsDesc: 'This bulk commercial lot is composed of verified contributions from member farmers.',
      farmerNameCol: 'Farmer',
      quantityCol: 'Contributed Qty',
      gradeCol: 'Grade',
      locationCol: 'Village / Tehsil',
      noReviewsYet: 'No buyer reviews recorded yet.',
      aggregatedLotBadge: 'FPO Aggregated Lot',
      digitalQualityPassport: 'Digital Quality Passport',
      declaredTag: 'Self-Declared',
      gradeLabel: 'Trade Grade',
      aiVisualPrescreen: 'AI Visual Pre-Screen',
      moistureLabel: 'Moisture',
      foreignMatterLabel: 'Foreign Matter',
      damagedGrainLabel: 'Damaged Kernels',
      estimatedGradeLabel: 'AI Estimated Grade',
      labMetricsPendingNote: 'Lab assay testing is in progress by an APMC certified inspector.',
      traceabilityBreakdown: 'Farmer Traceability Breakdown',
      sourceLabel: 'Traceability Source',
      notAggregatedValue: 'Single Farm Origin',
      apmcCertified: 'APMC Lab Certified',
      physicalPending: 'Physical Audit Pending',
      passportId: 'Passport ID',
      traceableBatch: 'Traceable Batch',
      standardAgmark: 'AGMARK Grade Specifications',
      labTestingCompleted: 'Certified Laboratory Assay Verified',
      awaitingPhysicalAudit: 'Awaiting Physical Lab Audit',
      verifiedSellerBadge: 'Verified Producer',
    },
    orderForm: {
      quantityLabel: 'Quantity (in quintals)',
      quantityHelp: 'Enter the exact quantity you wish to purchase from this lot.',
      priceBreakdown: 'Price Breakdown',
      basePrice: 'Crop Value',
      platformFee: 'Platform & Escrow Service Fee (1.5%)',
      totalPrice: 'Total Escrow Amount',
      paymentMethod: 'Select Payment Method',
      escrowMethod: 'Radical Escrow (Direct Bank-to-Bank)',
      escrowDescription: 'Funds held securely until shipment inspection and delivery sign-off.',
      escrowDesc: 'Funds held safely in escrow until you inspect and approve the shipment.',
      upiMethod: 'Instant Corporate UPI / QR',
      upiDescription: 'Real-time settlement for smaller wholesale transaction limits.',
      instantUpi: 'Instant Commercial UPI / QR',
      upiDesc: 'Instant real-time payment for direct wholesale orders.',
      mandiMethod: 'APMC Direct Mandi Settlement',
      mandiDescription: 'Standard regulated market settlement invoice format.',
      apmcMandi: 'APMC Direct Settlement',
      mandiDesc: 'Standard regulated APMC mandi invoice settlement.',
      mockDecline: 'Simulate Payment Failure / Decline (Testing Mode)',
      mockDeclineHelp: 'Check this box to test payment failure recovery and error handling.',
      simulateDeclineLabel: 'Simulate Payment Failure (Testing)',
      resetTryAgainBtn: 'Try Again',
      orderTotalLabel: 'Total Escrow Amount',
      authorizingBtn: 'Depositing Escrow Funds...',
      placeOrderBtn: 'Deposit Escrow & Place Order',
      signInToOrderBtn: 'Sign in to Place Order',
      confirmOrder: 'Fund Escrow & Confirm Order',
      processing: 'Processing Escrow Deposit...',
      insufficientStock: 'Requested quantity exceeds available stock.',
      exceedsStockError: 'Requested quantity exceeds available stock.',
      enterValidQty: 'Please enter a valid quantity greater than zero.',
      invalidQuantityError: 'Please enter a valid quantity greater than zero.',
      orderPlacedSuccess: 'Order placed successfully! Escrow funded.',
      paymentDeclinedError: 'Payment was declined by testing simulator. Uncheck the mock decline option to proceed.',
      orderSuccessToast: 'Order confirmed and escrow funded!',
      ownListingNotice: 'This is your own listing — you cannot purchase your own crop lot.',
      availableLabel: 'Available Volume',
      enterQuantityPlaceholder: 'Enter quantity up to',
      securePaymentMethod: 'Select Payment Rail',
      radicalEscrow: 'Radical Escrow',
    },
    orders: {
      title: 'Order Management',
      subtitle: 'Track purchase contracts, logistics milestones, escrow disbursements, and farmer ratings.',
      pageTitle: 'Order Management',
      farmerSubtitle: 'Track your crop sales, dispatch milestones, and escrow releases.',
      buyerSubtitle: 'Track contracts, delivery progression, and inspect shipments.',
      orderId: 'Order ID',
      date: 'Order Date',
      crop: 'Crop',
      quantity: 'Quantity',
      amount: 'Total Amount',
      status: 'Status',
      seller: 'Producer / Seller',
      buyer: 'Buyer / Client',
      buyerLabel: 'Buyer',
      deliveryLabel: 'Delivery',
      tracking: 'Logistics Route',
      rateFarmer: 'Rate Farmer',
      rated: 'Feedback Submitted',
      noOrders: 'No orders found',
      noOrdersTitle: 'No orders found',
      noOrdersDesc: 'You do not have any active or past orders in this account.',
      noOrdersFarmerDesc: 'When commercial buyers purchase your lots, the contracts will appear here.',
      noOrdersBuyerDesc: 'Browse verified crop lots in the marketplace and fund escrow to place an order.',
      deliveryStatus: 'Delivery Status',
      tipTrackDelivery: 'Real-time GPS tracking and transit temperature logs are recorded for all dispatched orders.',
      tipText: 'GPS tracking and real-time transit status are recorded for all dispatched orders.',
      viewDetails: 'View Contract',
      allStatuses: 'All Statuses',
      refresh: 'Refresh Orders',
      yourRatingLabel: 'Your Rating',
      rateOrderBtn: 'Rate Farmer',
    },
    ratingDialog: {
      title: 'Submit Farmer Quality Rating',
      description: 'Help build a high-trust agricultural network by providing transparent feedback on this lot.',
      dialogTitle: 'Rate Farmer Quality & Reliability',
      dialogDesc: 'Provide transparent feedback to help build trust in direct crop trading.',
      qualityLabel: 'Crop Quality & Grade Accuracy',
      rateCropQuality: 'Rate Crop Quality',
      packagingLabel: 'Packaging & Bagging Condition',
      deliveryLabel: 'Dispatch Timeliness & Cooperation',
      commentLabel: 'Detailed Buyer Feedback',
      commentPlaceholder: 'Describe the moisture, uniform size, color, or any delivery feedback...',
      feedbackPlaceholder: 'Describe the moisture, uniform size, color, or any delivery feedback...',
      submitRating: 'Submit Feedback & Rating',
      submitting: 'Recording Review...',
      submittingBtn: 'Submitting Review...',
      submitRatingBtn: 'Submit Rating',
      warning: 'Your rating is permanently attached to the seller profile and visible to institutional buyers.',
      requiredFeedbackWarning: 'For ratings of 2 stars or lower, please provide feedback to help the farmer improve.',
      starPoor: 'Poor (1/5)',
      starFair: 'Fair (2/5)',
      starGood: 'Good (3/5)',
      starVeryGood: 'Very Good (4/5)',
      starExcellent: 'Excellent (5/5)',
      flaggedWarningToast: 'Review recorded and marked for quality arbitration.',
      ratingSuccessToast: 'Thank you! Your verified rating was submitted.',
    },
    buyer: {
      welcome: 'Buyer Procurement Portal',
      activeOrders: 'Active Contracts',
      totalSpent: 'Total Escrow Deployed',
      deliveredOrders: 'Fulfilled Shipments',
      recentOrders: 'Recent Procurement Orders',
      browseMore: 'Browse Marketplace',
      viewAllOrders: 'View All Orders',
      ordersPlaced: 'Orders Placed',
      totalOrderValue: 'Total Order Value',
      browseMarketplaceBtn: 'Browse Marketplace',
      recentOrdersTitle: 'Your Recent Orders',
      viewAllLink: 'View all',
      noOrdersYetTitle: 'No orders yet',
      noOrdersYetDesc: 'Browse verified crop lots in the marketplace and fund escrow to place your first order.',
      goToMarketplaceBtn: 'Go to Marketplace',
    },
    farmer: {
      welcome: 'Farmer Dashboard',
      activeLots: 'Active Harvest Lots',
      totalEarned: 'Total Earnings',
      pendingReview: 'Under Quality Review',
      listNewCrop: 'List New Harvest Lot',
      myLots: 'My Listed Lots',
      noLotsYet: 'You have not listed any crop lots yet.',
      ratingTitle: 'Farmer Reputation Score',
      ratingSub: 'Based on verified commercial buyer evaluations',
      dashboardSubtitle: 'Manage your harvest listings, orders, and quality certifications.',
      totalQuantityListed: 'Total Quantity Listed',
      myCrops: 'My Listed Crops',
      noLotsListed: 'No crop lots listed yet',
      listFirstLot: 'List Your First Crop',
      lotId: 'Lot ID',
      actionViewLot: 'View Lot Details',
      marketComparison: 'APMC Market Intelligence & Real-time Trends',
      recentDispatches: 'Recent Shipments & Dispatches',
      addLotBtn: 'List New Harvest Lot',
    },
    newLot: {
      modalTitle: 'List a New Crop Lot',
      selectCrop: 'Select Crop Type',
      quantity: 'Available Quantity (quintals)',
      pricePerUnit: 'Asking Price per Quintal (₹)',
      harvestDate: 'Harvest Date',
      location: 'Farm Village / Tehsil Location',
      uploadPhotos: 'Upload Crop Sample Images',
      uploadHelp: 'Clear, well-lit photos allow AI pre-screening to estimate grade and surface faults.',
      aiAnalyzing: 'AI Pre-screening sample image...',
      aiScoreNotice: 'AI Estimated Quality Score',
      estimatedOffline: 'Estimated (Rule-based Fallback)',
      submitListing: 'Publish Crop Listing',
      submitting: 'Listing Crop...',
      unit: 'Unit of measurement',
      expectedPrice: 'Expected Price per Quintal',
      pickupLocation: 'Farm / Pickup Location',
      selfGrade: 'Self-Assessed Grade',
      gradeA: 'Grade A (Premium quality)',
      gradeB: 'Grade B (Standard quality)',
      gradeC: 'Grade C (Fair average quality)',
      photoSectionTitle: 'Crop Sample Photos',
      photosCount: 'photos uploaded',
      minPhotosNotice: 'Upload at least 1 clear photo of your crop sample.',
      recommendedPhotosNotice: 'Upload 3-4 photos showing grains, husk, and overall sample for best AI accuracy.',
      uploadPhotosBtn: 'Upload Photos',
      uploadMoreBtn: 'Add More Photos',
      maxPhotosReached: 'Maximum 10 photos allowed',
      slotsRemaining: 'slots remaining',
      simulatingAi: 'AI analyzing crop sample...',
      readyForInspection: 'Ready for APMC lab inspection',
      cancelBtn: 'Cancel',
      submittingBtn: 'Publishing Listing...',
      submitBtn: 'List Crop Lot',
      successToast: 'Harvest lot listed successfully!',
      modalDesc: 'Provide accurate harvest details and sample images for AI and APMC verification.',
      cropType: 'Commodity Type',
    },
    fpo: {
      welcome: 'FPO Operations Hub',
      farmersCount: 'Enrolled Member Farmers',
      totalVolume: 'Total Aggregated Volume',
      aggregateLots: 'Aggregate Member Lots',
      mergeModalTitle: 'Create Unified Bulk Lot',
      mergeModalDesc: 'Combine multiple member lots of identical crop and grade to negotiate institutional pricing.',
      mergedPrice: 'Weighted Average Price',
      confirmMerge: 'Confirm Aggregation & Publish',
      bulkListings: 'Aggregated Marketplace Lots',
      pageSubtitle: 'Aggregate member harvest lots and negotiate bulk commercial contracts.',
      farmersContributing: 'Farmers Contributing',
      compatibleBatches: 'Compatible Batches',
      mergedLots: 'Merged Aggregated Lots',
      combinedVolume: 'Combined Volume',
      mergeSelectedBtn: 'Merge Selected Lots',
      dialogTitle: 'Aggregate & Merge Crop Lots',
      dialogDesc: 'Combine selected batches of identical crop and grade into a single marketplace listing.',
      customPriceLabel: 'Asking Price per Quintal',
      pickupLocationLabel: 'Consolidated Pickup Hub',
      confirmMergeBtn: 'Confirm Aggregation & Publish',
      noLotsEligible: 'No lots eligible for aggregation',
      noAggregatedLots: 'No aggregated bulk lots published yet',
      createFirstBulkDesc: 'Select compatible member batches above to create your first aggregated bulk listing.',
    },
    inspector: {
      title: 'APMC Quality Assay Workbench',
      subtitle: 'Review harvest batches, perform physical grain inspection, and issue Digital Quality Passports.',
      pageTitle: 'APMC Quality Assay Workbench',
      pageSubtitle: 'Review harvest batches, perform physical grain inspection, and issue Digital Quality Passports.',
      pendingTab: 'Pending Inspection',
      verifiedTab: 'Certified Passports',
      rejectedTab: 'Rejected Batches',
      fifoQueue: 'FIFO Priority Queue',
      assayModalTitle: 'Enter Laboratory Assay Results',
      moistureInput: 'Moisture Percentage (%)',
      foreignMatterInput: 'Foreign Matter / Dust (%)',
      damagedGrainsInput: 'Damaged / Immature Kernels (%)',
      gradeCalculated: 'Computed APMC Trade Grade',
      approveAndCertify: 'Certify & Issue Passport',
      rejectLot: 'Reject Lot',
      submitting: 'Saving Assay Report...',
      noPendingLots: 'No pending inspections in queue',
      allVerifiedDesc: 'All crop batches currently have completed assay reports.',
      conductAssayBtn: 'Conduct Lab Assay',
      historyTab: 'Audit History',
      dialogTitle: 'Enter Laboratory Assay Results',
      dialogDesc: 'Record physical and chemical parameters measured using standard APMC testing equipment.',
      certifiedToast: 'Quality Passport issued and certified successfully!',
      queueTab: 'Pending Inspection Queue',
      sortBy: 'Sort Queue By',
      oldest: 'FIFO (Oldest First)',
      locationSort: 'Farm Location',
      damagedGrainInput: 'Damaged / Discolored Grains (%)',
      computedGradeLabel: 'Computed APMC Grade',
      notesInput: 'Inspector Laboratory Notes & Findings',
      certifyingBtn: 'Certifying & Issuing Passport...',
      certifyBtn: 'Certify & Issue Digital Passport',
    },
    logistics: {
      title: 'Logistics Fleet & Dispatch',
      subtitle: 'Live fleet dispatch management, multi-stop route optimization, and digital delivery handoffs.',
      pageTitle: 'Logistics Fleet & Dispatch',
      pageSubtitle: 'Live fleet dispatch management, multi-stop route optimization, and digital delivery handoffs.',
      activeDispatches: 'Active Dispatch Runs',
      fleetStatus: 'Fleet Readiness',
      routeOptimization: 'AI Route Optimization',
      optimizeRouteBtn: 'Optimize Delivery Route',
      optimizing: 'Calculating Optimal TSP Route...',
      routeOptimized: 'Route optimized! Fuel and transit time reduced.',
      stopProgression: 'Stop Progression Actions',
      markPickedUp: 'Mark Farm Gate Picked Up',
      markDelivered: 'Mark Buyer Warehouse Delivered',
      mapLegend: 'Fleet Map Legend',
      aiOptimizedRoute: 'AI Optimized Route',
      efficiencyGain: 'efficiency gain',
      stops: 'stops',
      advanceStatusBtn: 'Update Milestone',
      activeRuns: 'Active Dispatch Runs',
      noRunsTitle: 'No active dispatch runs',
      noRunsDesc: 'Confirmed customer orders requiring freight dispatch will appear here.',
    },
    admin: {
      title: 'Platform Administration & Governance',
      subtitle: 'Monitor platform liquidity, dispute resolutions, AI edge services, and user compliance.',
      pageTitle: 'Platform Administration & Governance',
      pageSubtitle: 'Monitor platform liquidity, dispute resolutions, AI edge services, and user compliance.',
      totalVolume: 'Gross Merchandise Value',
      totalTransactions: 'Completed Contracts',
      activeUsers: 'Verified Participants',
      disputeCount: 'Active Escrow Disputes',
      dateRange7d: '7 Days',
      dateRange30d: '30 Days',
      dateRange90d: '90 Days',
      dateRangeAll: 'All Time',
      volumeChartTitle: 'Trade Volume & Escrow Flow',
      disputesTitle: 'Dispute Arbitration Queue',
      resolveDispute: 'Resolve Dispute',
      disputeResolved: 'Dispute resolved and escrow disbursed successfully.',
      platformHealth: 'AI Service Edge Integrations',
      cropVolumeDistribution: 'Trade Volume by Commodity',
      recentActivity: 'System Audit Log',
      resolveAction: 'Disburse Funds',
      systemStatus: 'System Status',
      operational: 'Fully Operational',
    },
    mandi: {
      title: 'Live APMC Mandi Price Intelligence',
      subtitle: 'Official Agmarknet wholesale benchmark rates across major agricultural terminal markets.',
      pageTitle: 'Live APMC Mandi Price Intelligence',
      pageSubtitle: 'Official Agmarknet wholesale benchmark rates across major agricultural terminal markets.',
      selectCrop: 'Select Commodity',
      selectState: 'Select Mandi Market',
      modalPrice: 'Modal Wholesale Rate',
      minPrice: 'Min Price',
      maxPrice: 'Max Price',
      priceTrend: '30-Day APMC Trend',
      apmcPriceDisclaimer: 'Data sourced from regulated APMC wholesale arrivals and Ministry of Agriculture price feeds.',
      marketArrivals: 'Daily Arrivals (Metric Tonnes)',
    },
    auth: {
      loginTitle: 'Welcome back',
      loginSubtitle: 'Sign in to manage your crop listings, contracts, and payments.',
      signupTitle: 'Create your account',
      signupSubtitle: 'Join the transparent, verified farm-to-buyer agricultural marketplace.',
      fullName: 'Full Name',
      phone: 'Phone Number (10 digits)',
      email: 'Email Address',
      password: 'Password',
      repeatPassword: 'Confirm Password',
      selectRole: 'Account Type / Market Role',
      state: 'State',
      district: 'District',
      location: 'Primary Farm / Facility Location',
      signInBtn: 'Sign in to Account',
      signUpBtn: 'Create RadicalRoots Account',
      noAccount: "Don't have an account? Sign up",
      hasAccount: 'Already have an account? Sign in',
      demoTitle: 'Try Quick Demo Personas',
      demoSubtitle: 'Select a pre-configured role to immediately explore the platform without signup.',
      detectLocation: 'Detect Current Location',
      detectingLocation: 'Detecting GPS Coordinates...',
    },
    sellingWindow: {
      title: 'Suggested Selling Window',
      subtitle: 'Market intelligence prediction based on historical APMC arrivals and seasonal price cycles.',
      currentPrice: 'Current Modal Price',
      predictedPeak: 'Projected Peak Window',
      recommendation: 'Strategic Recommendation',
      holdAdvice: 'Prices trending upward due to tightening mandi supply. Holding for 1-2 weeks could yield higher realizations.',
      sellAdvice: 'Mandi arrivals are peaking. Current wholesale rates are favorable; selling now minimizes storage risk.',
      watchAdvice: 'Market prices are stable. Monitor arrival volumes over the coming days before committing.',
      holdBadge: 'Hold Harvest',
      sellBadge: 'Sell Now',
      watchBadge: 'Watch Market',
    },
  },
  hi: {
    common: {
      appName: 'RadicalRoots',
      loading: 'लोड हो रहा है...',
      error: 'एक त्रुटि हुई',
      retry: 'पुनः प्रयास करें',
      save: 'सुरक्षित करें',
      cancel: 'रद्द करें',
      submit: 'जमा करें',
      close: 'बंद करें',
      back: 'वापस जाएं',
      view: 'देखें',
      status: 'स्थिति',
      date: 'तारीख',
      actions: 'कार्रवाई',
      filter: 'फ़िल्टर',
      search: 'खोजें',
      all: 'सभी',
      per: 'प्रति',
      kg: 'किग्रा',
      quintal: 'क्विंटल',
      ton: 'टन',
      crop: 'फसल',
      quantity: 'मात्रा',
      price: 'भाव',
      marketplace: 'मंडी बाजार',
      mandiPrices: 'मंडी भाव',
      analytics: 'विश्लेषण',
      inspectorQueue: 'जांच कतार',
      dashboard: 'डैशबोर्ड',
      logisticsRuns: 'परिवहन फेरे',
      orders: 'ऑर्डर',
      signOut: 'लॉग आउट',
      tip: 'सुझाव',
      signIn: 'लॉग इन करें',
      getStarted: 'शुरुआत करें',
      myAccount: 'मेरा खाता',
      demoModeBadge: 'डेमो मोड',
      switchDemoRole: 'डेमो रोल बदलें',
      demoMode: 'डेमो मोड',
    },
    roles: {
      farmer: 'किसान',
      buyer: 'व्यापारिक खरीदार',
      fpo: 'एफपीओ प्रबंधक',
      inspector: 'गुणवत्ता निरीक्षक',
      logistics: 'लॉजिस्टिक्स पार्टनर',
      admin: 'प्लेटफ़ॉर्म एडमिन',
    },
    crops: {
      soybean: 'सोयाबीन',
      tur: 'अरहर (तूर दाल)',
      wheat: 'गेहूं',
      chana: 'चना',
      watermelon: 'तरबूज',
      kharbuja: 'खरबूजा',
      onion: 'प्याज',
      rice: 'चावल (धान)',
      cotton: 'कपास',
      tomato: 'टमाटर',
      potato: 'आलू',
      maize: 'मक्का',
      mustard: 'सरसों',
      moong: 'मूंग दाल',
    },
    lotStatuses: {
      draft: 'ड्राफ्ट',
      submitted: 'दर्ज किया गया',
      under_verification: 'जांच जारी है',
      verified: 'प्रमाणित',
      listed: 'मार्केट में उपलब्ध',
      sold: 'बिक चुका है',
      delivered: 'वितरित हुआ',
      paid: 'भुगतान पूरा',
      aggregated: 'एकत्रित लॉट',
      rejected: 'अस्वीकृत',
    },
    orderStatuses: {
      pending: 'लंबित',
      confirmed: 'पुष्टि हुई',
      invoiced: 'चालान जारी',
      paid: 'भुगतान प्राप्त',
      scheduled: 'निर्धारित',
      picked_up: 'उठाया गया',
      in_transit: 'रास्ते में है',
      delivered: 'पहुंचा दिया गया',
      completed: 'पूर्ण',
      cancelled: 'रद्द किया गया',
    },
    header: {
      navMarketplace: 'मंडी बाजार',
      navMandiPrices: 'मंडी भाव',
      navDashboard: 'डैशबोर्ड',
      navOrders: 'ऑर्डर',
      navLogistics: 'परिवहन',
      navInspector: 'जांचकर्ता',
      navAdmin: 'एडमिन',
      signIn: 'लॉग इन करें',
      getStarted: 'शुरुआत करें',
      myAccount: 'मेरा खाता',
      signOut: 'लॉग आउट',
      switchDemoRole: 'डेमो रोल बदलें',
      demoMode: 'डेमो मोड',
      demoDescription: 'रोल-विशिष्ट वर्कफ़्लो देखें',
      welcomeBack: 'वापसी पर स्वागत है',
    },
    landing: {
      heroTagline: 'किसानों के लिए उचित मूल्य। खरीदारों के लिए भरोसेमंद आपूर्ति।',
      heroTitle: 'सीधे फसल का व्यापार, जांची-परखी गुणवत्ता, बिना बिचौलियों का मुनाफा।',
      heroSubtitle: 'RadicalRoots भारत भर के प्रमाणित किसानों को सीधे बड़े खरीदारों से जोड़ता है। लैब परीक्षण रिपोर्ट, सुरक्षित एस्क्रो भुगतान और सुरक्षित परिवहन की गारंटी के साथ।',
      browseMarketplace: 'मंडी बाजार देखें',
      listYourCrop: 'अपनी फसल दर्ज करें',
      howItWorksTitle: 'RadicalRoots कैसे काम करता है',
      howItWorksSubtitle: 'फसल दर्ज करने से लेकर सुरक्षित भुगतान तक — पूरी तरह डिजिटल, पारदर्शी और प्रमाणित।',
      step1Title: '1. किसान फसल दर्ज करते हैं',
      step1Desc: 'किसान या एफपीओ फसल का विवरण, मात्रा, मांग मूल्य और फोटो अपलोड करते हैं जिसमें एआई गुणवत्ता जांच शामिल है।',
      step2Title: '2. गुणवत्ता प्रमाणित होती है',
      step2Desc: 'मान्यता प्राप्त एपीएमसी लैब परीक्षक नमी, बाहरी अशुद्धियों और दानों की जांच करके डिजिटल गुणवत्ता पासपोर्ट जारी करते हैं।',
      step3Title: '3. खरीदार सीधे ऑर्डर करते हैं',
      step3Desc: 'व्यापारिक खरीदार प्रमाणित लॉट देखते हैं, लैब आंकड़े जांचते हैं और एस्क्रो खाते में सुरक्षित अग्रिम जमा करके ऑर्डर देते हैं।',
      step4Title: '4. परिवहन और सुरक्षित भुगतान',
      step4Desc: 'सुव्यवस्थित मार्ग से समय पर माल पहुंचता है। डिजिटल डिलीवरी की पुष्टि होते ही भुगतान सीधे किसान के बैंक खाते में जमा होता है।',
      ctaTitle: 'क्या आप बिना बिचौलियों के सीधे फसल व्यापार के लिए तैयार हैं?',
      ctaSubtitle: 'देश भर के उन हजारों किसानों, एफपीओ और थोक खरीदारों से जुड़ें जो पारदर्शी कृषि व्यापार कर रहे हैं।',
      createAccount: 'अपना खाता बनाएं',
      exploreListings: 'उपलब्ध फसलें देखें',
      footerCopyright: '© RadicalRoots मार्केटप्लेस। पारदर्शी भारतीय कृषि के लिए समर्पित।',
      taglineBadge: 'किसानों के लिए उचित मूल्य। खरीदारों के लिए भरोसेमंद आपूर्ति।',
      heroHeading: 'सीधे फसल का व्यापार, जांची-परखी गुणवत्ता, बिना बिचौलियों का मुनाफा।',
      howItWorksHeading: 'RadicalRoots कैसे काम करता है',
      ctaHeading: 'क्या आप बिना बिचौलियों के सीधे फसल व्यापार के लिए तैयार हैं?',
      footerTagline: '© RadicalRoots मार्केटप्लेस। पारदर्शी भारतीय कृषि के लिए समर्पित।',
    },
    marketplace: {
      title: 'कृषि जिंस बाजार',
      subtitle: 'किसानों और एफपीओ से सीधे लैब-प्रमाणित फसल लॉट खरीदें, पूर्ण एस्क्रो भुगतान सुरक्षा के साथ।',
      pageTitle: 'कृषि जिंस बाजार',
      pageSubtitle: 'किसानों और एफपीओ से सीधे लैब-प्रमाणित फसल लॉट खरीदें, पूर्ण एस्क्रो भुगतान सुरक्षा के साथ।',
      allCropsFilter: 'सभी फसलें',
      allStates: 'सभी राज्य',
      searchPlaceholder: 'फसल, किसान या जिले के नाम से खोजें...',
      filterByCrop: 'फसल अनुसार चुनें',
      minQuantity: 'न्यूनतम मात्रा',
      maxPrice: 'अधिकतम भाव',
      sortBy: 'क्रमबद्ध करें',
      sortNewest: 'सबसे नए पहले',
      sortPriceLow: 'भाव: कम से ज्यादा',
      sortPriceHigh: 'भाव: ज्यादा से कम',
      sortQuality: 'सर्वोत्तम गुणवत्ता',
      noLotsFound: 'कोई फसल लॉट नहीं मिला',
      noLotsDescription: 'कृपया अपने फ़िल्टर या खोज शब्दों को बदलकर पुनः प्रयास करें।',
      noLotsFoundDesc: 'कृपया अपने फ़िल्टर या खोज शब्दों को बदलकर पुनः प्रयास करें।',
      clearFilters: 'फ़िल्टर हटाएं',
      resetFilters: 'फ़िल्टर हटाएं',
      qualityScore: 'गुणवत्ता स्कोर',
      verifiedByLab: 'लैब द्वारा प्रमाणित',
      aiEstimated: 'एआई द्वारा आकलित',
      viewLot: 'लॉट विवरण देखें',
      fpoAggregated: 'एफपीओ समूह लॉट',
      aggregatedBadge: 'एफपीओ समूह लॉट',
      gradePrefix: 'ग्रेड',
      perUnit: 'प्रति',
      sourcedFromFarmers: 'सत्यापित सदस्य किसानों से संकलित',
      availableQty: 'उपलब्ध मात्रा',
    },
    lotDetail: {
      backToMarketplace: 'मंडी बाजार पर वापस जाएं',
      lotId: 'लॉट क्रमांक',
      qualityScore: 'गुणवत्ता स्कोर',
      verifiedBy: 'परीक्षक',
      pendingVerification: 'गुणवत्ता जांच जारी है',
      labCertified: 'एपीएमसी लैब प्रमाणित',
      labPending: 'जांच प्रक्रियाधीन',
      passportTitle: 'डिजिटल गुणवत्ता पासपोर्ट',
      passportSubtitle: 'बिक्री से पूर्व प्रयोगशाला में भौतिक एवं रासायनिक परीक्षण द्वारा प्रमाणित रिपोर्ट।',
      metricsTitle: 'प्रमाणित लैब परीक्षण आंकड़े',
      moisture: 'नमी की मात्रा',
      foreignMatter: 'विदेशी तत्व / कचरा',
      damagedGrains: 'क्षतिग्रस्त / बदरंग दाने',
      protein: 'प्रोटीन की मात्रा',
      traceabilityTitle: 'खेत और उत्पत्ति की जानकारी',
      farmLocation: 'उत्पत्ति स्थान (खेत)',
      harvestDate: 'कटाई की तारीख',
      harvestDateLabel: 'कटाई की तारीख',
      listedOnLabel: 'दर्ज तारीख',
      fpoName: 'उत्पादक संगठन (FPO)',
      sellerProfile: 'विक्रेता प्रोफाइल',
      farmerNameLabel: 'किसान का नाम',
      memberFpoBadge: 'एफपीओ सदस्य',
      rating: 'किसान रेटिंग',
      reviews: 'सत्यापित खरीदार समीक्षाएं',
      ratingsCountSuffix: 'समीक्षाएं',
      ratingsAndReviews: 'खरीदार रेटिंग और समीक्षाएं',
      placeOrder: 'खरीद ऑर्डर दर्ज करें',
      orderQuantity: 'खरीदने हेतु मात्रा',
      quantityLabel: 'उपलब्ध मात्रा',
      priceLabel: 'मांग भाव',
      totalAmount: 'कुल अनुमानित मूल्य',
      escrowNotice: 'Radical एस्क्रो द्वारा सुरक्षित — माल की जांच और प्राप्ति के बाद ही राशि हस्तांतरित होगी।',
      selectPayment: 'भुगतान का माध्यम चुनें',
      payEscrow: 'एस्क्रो जमा करें और ऑर्डर दें',
      orderSuccess: 'खरीद ऑर्डर सफलतापूर्वक दर्ज हुआ! एस्क्रो में राशि जमा हो चुकी है।',
      orderError: 'ऑर्डर दर्ज करने में समस्या आई। कृपया मात्रा जांचकर पुनः प्रयास करें।',
      verifiedBadge: 'लैब प्रमाणित',
      pendingBadge: 'जांच जारी है',
      lotDescription: 'लॉट का विवरण और खेत की जानकारी',
      contributionsTitle: 'एफपीओ सामूहिक योगदान विवरण',
      contributionsDesc: 'व्यापारिक मात्रा पूरी करने के लिए यह लॉट कई पंजीकृत किसानों की उपज मिलाकर तैयार किया गया है।',
      contributingLotsDesc: 'व्यापारिक मात्रा पूरी करने के लिए यह लॉट कई पंजीकृत किसानों की उपज मिलाकर तैयार किया गया है।',
      farmerNameCol: 'किसान का नाम',
      quantityCol: 'योगदान मात्रा',
      gradeCol: 'दर्जा (ग्रेड)',
      locationCol: 'गांव / तहसील',
      noReviewsYet: 'अभी तक कोई समीक्षा उपलब्ध नहीं है।',
      aggregatedLotBadge: 'एफपीओ एकत्रित समूह लॉट',
      digitalQualityPassport: 'डिजिटल गुणवत्ता पासपोर्ट',
      declaredTag: 'स्व-घोषित',
      gradeLabel: 'व्यापार ग्रेड',
      aiVisualPrescreen: 'एआई दृश्य पूर्व-जांच',
      moistureLabel: 'नमी',
      foreignMatterLabel: 'विदेशी तत्व / कचरा',
      damagedGrainLabel: 'क्षतिग्रस्त दाने',
      estimatedGradeLabel: 'एआई अनुमानित ग्रेड',
      labMetricsPendingNote: 'एपीएमसी प्रमाणित परीक्षक द्वारा प्रयोगशाला जांच प्रगति पर है।',
      traceabilityBreakdown: 'किसानवार उगम व योगदान तपशील',
      sourceLabel: 'उगम स्त्रोत',
      notAggregatedValue: 'एकल खेत उत्पत्ति',
      apmcCertified: 'एपीएमसी लैब प्रमाणित',
      physicalPending: 'भौतिक जांच प्रतीक्षित',
      passportId: 'पासपोर्ट क्रमांक',
      traceableBatch: 'सत्यापनीय बैच',
      standardAgmark: 'एगमार्क ग्रेड मानक',
      labTestingCompleted: 'प्रमाणित प्रयोगशाला जांच पूर्ण',
      awaitingPhysicalAudit: 'भौतिक लैब जांच प्रतीक्षित',
      verifiedSellerBadge: 'सत्यापित उत्पादक',
    },
    orderForm: {
      quantityLabel: 'मात्रा (क्विंटल में)',
      quantityHelp: 'इस लॉट से आप जितनी मात्रा खरीदना चाहते हैं, वह दर्ज करें।',
      priceBreakdown: 'मूल्य विवरण',
      basePrice: 'फसल का मूल्य',
      platformFee: 'प्लेटफ़ॉर्म व एस्क्रो शुल्क (1.5%)',
      totalPrice: 'कुल एस्क्रो राशि',
      paymentMethod: 'भुगतान का तरीका चुनें',
      escrowMethod: 'Radical एस्क्रो (सुरक्षित बैंक ट्रांसफर)',
      escrowDescription: 'डिलीवरी और गुणवत्ता जांच पूरी होने तक राशि सुरक्षित रूप से रोकी जाती है।',
      escrowDesc: 'डिलीवरी और गुणवत्ता जांच पूरी होने तक राशि सुरक्षित रूप से रोकी जाती है।',
      upiMethod: 'त्वरित व्यापारिक यूपीआई / क्यूआर',
      upiDescription: 'छोटे थोक भुगतानों के लिए तुरंत निपटान।',
      instantUpi: 'त्वरित व्यापारिक यूपीआई / क्यूआर',
      upiDesc: 'थोक खरीद के लिए तुरंत रीयल-टाइम भुगतान।',
      mandiMethod: 'एपीएमसी सीधा मंडी निपटान',
      mandiDescription: 'नियमित मंडी चालान और निपटान प्रक्रिया।',
      apmcMandi: 'एपीएमसी सीधा मंडी निपटान',
      mandiDesc: 'नियमित मंडी चालान और निपटान प्रक्रिया।',
      mockDecline: 'भुगतान विफलता का परीक्षण करें (डेमो मोड)',
      mockDeclineHelp: 'भुगतान अस्वीकार होने पर सिस्टम की प्रतिक्रिया जांचने हेतु यह विकल्प चुनें।',
      simulateDeclineLabel: 'भुगतान विफलता का परीक्षण करें (डेमो मोड)',
      resetTryAgainBtn: 'पुनः प्रयास करें',
      orderTotalLabel: 'कुल एस्क्रो राशि',
      authorizingBtn: 'एस्क्रो जमा हो रहा है...',
      placeOrderBtn: 'एस्क्रो जमा करें और ऑर्डर दें',
      signInToOrderBtn: 'ऑर्डर देने के लिए लॉग इन करें',
      confirmOrder: 'एस्क्रो जमा करें और ऑर्डर पक्का करें',
      processing: 'एस्क्रो जमा हो रहा है...',
      insufficientStock: 'मांगी गई मात्रा उपलब्ध स्टॉक से अधिक है।',
      exceedsStockError: 'मांगी गई मात्रा उपलब्ध स्टॉक से अधिक है।',
      enterValidQty: 'कृपया शून्य से अधिक मान्य मात्रा दर्ज करें।',
      invalidQuantityError: 'कृपया शून्य से अधिक मान्य मात्रा दर्ज करें।',
      orderPlacedSuccess: 'ऑर्डर दर्ज हुआ! एस्क्रो सुरक्षित रूप से जमा हो गया।',
      paymentDeclinedError: 'परीक्षण सिम्युलेटर द्वारा भुगतान अस्वीकृत किया गया। आगे बढ़ने के लिए विकल्प अनचेक करें।',
      orderSuccessToast: 'ऑर्डर की पुष्टि हुई और एस्क्रो जमा हुआ!',
      ownListingNotice: 'यह आपका अपना लॉट है — आप अपनी खुद की फसल नहीं खरीद सकते।',
      availableLabel: 'उपलब्ध मात्रा',
      enterQuantityPlaceholder: 'मात्रा दर्ज करें, अधिकतम',
      securePaymentMethod: 'भुगतान का माध्यम चुनें',
      radicalEscrow: 'Radical एस्क्रो',
    },
    orders: {
      title: 'ऑर्डर प्रबंधन',
      subtitle: 'अपने सौदे, माल ढुलाई की स्थिति, एस्क्रो भुगतान और किसान रेटिंग की निगरानी करें।',
      pageTitle: 'ऑर्डर प्रबंधन',
      farmerSubtitle: 'अपनी फसल बिक्री, परिवहन और एस्क्रो भुगतान की स्थिति देखें।',
      buyerSubtitle: 'अपने सौदे, माल ढुलाई की स्थिति और डिलीवरी की निगरानी करें।',
      orderId: 'ऑर्डर क्रमांक',
      date: 'ऑर्डर तारीख',
      crop: 'फसल',
      quantity: 'मात्रा',
      amount: 'कुल राशि',
      status: 'स्थिति',
      seller: 'उत्पादक / विक्रेता',
      buyer: 'खरीदार / ग्राहक',
      buyerLabel: 'खरीदार',
      deliveryLabel: 'डिलीवरी',
      tracking: 'परिवहन मार्ग',
      rateFarmer: 'किसान को रेटिंग दें',
      rated: 'रेटिंग दर्ज हुई',
      noOrders: 'कोई ऑर्डर नहीं मिला',
      noOrdersTitle: 'कोई ऑर्डर नहीं मिला',
      noOrdersDesc: 'आपके इस खाते में अभी तक कोई सक्रिय या पुराना ऑर्डर दर्ज नहीं है।',
      noOrdersFarmerDesc: 'जब खरीदार आपकी फसल खरीदेंगे, तो अनुबंध यहां दिखाई देंगे।',
      noOrdersBuyerDesc: 'मंडी बाजार में प्रमाणित फसलें देखें और ऑर्डर दर्ज करें।',
      deliveryStatus: 'डिलीवरी स्थिति',
      tipTrackDelivery: 'सभी भेजी गई गाड़ियों की लाइव जीपीएस ट्रैकिंग उपलब्ध रहती है।',
      tipText: 'सभी भेजी गई गाड़ियों की लाइव जीपीएस ट्रैकिंग उपलब्ध रहती है।',
      viewDetails: 'सौदा पत्र देखें',
      allStatuses: 'सभी स्थितियां',
      refresh: 'ऑर्डर रिफ्रेश करें',
      yourRatingLabel: 'आपकी रेटिंग',
      rateOrderBtn: 'किसान को रेटिंग दें',
    },
    ratingDialog: {
      title: 'किसान की गुणवत्ता रेटिंग दर्ज करें',
      description: 'सच्ची और निष्पक्ष समीक्षा देकर कृषि नेटवर्क में विश्वास बढ़ाने में सहयोग करें।',
      dialogTitle: 'किसान की गुणवत्ता रेटिंग दर्ज करें',
      dialogDesc: 'सच्ची और निष्पक्ष समीक्षा देकर कृषि नेटवर्क में विश्वास बढ़ाएं।',
      qualityLabel: 'फसल की गुणवत्ता व वादे अनुसार माल',
      rateCropQuality: 'फसल गुणवत्ता रेटिंग',
      packagingLabel: 'बोरी और पैकेजिंग की स्थिति',
      deliveryLabel: 'माल रवानगी में समयबद्धता व सहयोग',
      commentLabel: 'खरीदार की विस्तृत टिप्पणी',
      commentPlaceholder: 'नमी, दाने का आकार, रंग या डिलीवरी के अनुभव के बारे में लिखें...',
      feedbackPlaceholder: 'नमी, दाने का आकार, रंग या डिलीवरी के अनुभव के बारे में लिखें...',
      submitRating: 'रेटिंग और समीक्षा जमा करें',
      submitting: 'समीक्षा दर्ज हो रही है...',
      submittingBtn: 'समीक्षा दर्ज हो रही है...',
      submitRatingBtn: 'रेटिंग सबमिट करें',
      warning: 'आपकी रेटिंग विक्रेता के प्रोफाइल पर स्थायी रूप से दिखेगी।',
      requiredFeedbackWarning: '2 स्टार या उससे कम रेटिंग के लिए, कृपया कारण अवश्य बताएं।',
      starPoor: 'खराब (1/5)',
      starFair: 'साधारण (2/5)',
      starGood: 'अच्छा (3/5)',
      starVeryGood: 'बहुत अच्छा (4/5)',
      starExcellent: 'उत्कृष्ट (5/5)',
      flaggedWarningToast: 'समीक्षा दर्ज की गई और गुणवत्ता मध्यस्थता के लिए भेजी गई।',
      ratingSuccessToast: 'धन्यवाद! आपकी सत्यापित रेटिंग दर्ज हो चुकी है।',
    },
    buyer: {
      welcome: 'खरीदार खरीद पोर्टल',
      activeOrders: 'सक्रिय सौदे',
      totalSpent: 'कुल खर्च की गई राशि',
      deliveredOrders: 'प्राप्त हुए ऑर्डर',
      recentOrders: 'हालिया खरीद ऑर्डर',
      browseMore: 'बाजार में और फसलें देखें',
      viewAllOrders: 'सभी ऑर्डर देखें',
      ordersPlaced: 'दर्ज किए गए ऑर्डर',
      totalOrderValue: 'कुल ऑर्डर मूल्य',
      browseMarketplaceBtn: 'मंडी बाजार देखें',
      recentOrdersTitle: 'आपके हालिया ऑर्डर',
      viewAllLink: 'सभी देखें',
      noOrdersYetTitle: 'अभी तक कोई ऑर्डर नहीं',
      noOrdersYetDesc: 'मंडी बाजार में प्रमाणित फसलें देखें और पहला ऑर्डर देने के लिए एस्क्रो जमा करें।',
      goToMarketplaceBtn: 'मंडी बाजार पर जाएं',
    },
    farmer: {
      welcome: 'किसान डैशबोर्ड',
      activeLots: 'सक्रिय फसल लॉट',
      totalEarned: 'कुल कमाई',
      pendingReview: 'जांच जारी लॉट',
      listNewCrop: 'नई फसल लॉट दर्ज करें',
      myLots: 'मेरे द्वारा दर्ज फसलें',
      noLotsYet: 'आपने अभी तक कोई फसल लॉट दर्ज नहीं किया है।',
      ratingTitle: 'किसान प्रतिष्ठा स्कोर',
      ratingSub: 'सत्यापित व्यापारिक खरीदारों के फीडबैक पर आधारित',
      dashboardSubtitle: 'अपनी फसल लिस्टिंग, ऑर्डर और गुणवत्ता प्रमाण पत्रों का प्रबंधन करें।',
      totalQuantityListed: 'कुल दर्ज मात्रा',
      myCrops: 'मेरी दर्ज फसलें',
      noLotsListed: 'अभी तक कोई फसल लॉट दर्ज नहीं है',
      listFirstLot: 'अपनी पहली फसल दर्ज करें',
      lotId: 'लॉट क्रमांक',
      actionViewLot: 'लॉट का विवरण देखें',
      marketComparison: 'एपीएमसी मंडी भाव और रीयल-टाइम रुझान',
      recentDispatches: 'हालिया रवानगी और माल परिवहन',
      addLotBtn: 'नई फसल लॉट दर्ज करें',
    },
    newLot: {
      modalTitle: 'नई फसल का लॉट दर्ज करें',
      selectCrop: 'फसल का प्रकार चुनें',
      quantity: 'उपलब्ध मात्रा (क्विंटल में)',
      pricePerUnit: 'मांग भाव प्रति क्विंटल (₹)',
      harvestDate: 'कटाई की तारीख',
      location: 'खेत का गांव / तहसील',
      uploadPhotos: 'फसल के नमूनों की फोटो अपलोड करें',
      uploadHelp: 'साफ फोटो से एआई तुरंत गुणवत्ता का अनुमान लगा सकता है।',
      aiAnalyzing: 'एआई द्वारा फोटो का विश्लेषण जारी...',
      aiScoreNotice: 'एआई द्वारा अनुमानित गुणवत्ता स्कोर',
      estimatedOffline: 'अनुमानित (ऑफलाइन बैकअप)',
      submitListing: 'फसल बाजार में दर्ज करें',
      submitting: 'फसल दर्ज हो रही है...',
      unit: 'माप की इकाई',
      expectedPrice: 'अपेक्षित भाव प्रति क्विंटल',
      pickupLocation: 'खेत / पिकअप का स्थान',
      selfGrade: 'स्व-आकलित ग्रेड',
      gradeA: 'ग्रेड ए (उत्कृष्ट गुणवत्ता)',
      gradeB: 'ग्रेड बी (मानक गुणवत्ता)',
      gradeC: 'ग्रेड सी (साधारण गुणवत्ता)',
      photoSectionTitle: 'फसल के नमूनों की तस्वीरें',
      photosCount: 'तस्वीरें अपलोड हुईं',
      minPhotosNotice: 'फसल के नमूने की कम से कम 1 स्पष्ट तस्वीर अपलोड करें।',
      recommendedPhotosNotice: 'बेहतर एआई सटीकता के लिए दाने और पूरे नमूने की 3-4 तस्वीरें जोड़ें।',
      uploadPhotosBtn: 'फोटो अपलोड करें',
      uploadMoreBtn: 'और फोटो जोड़ें',
      maxPhotosReached: 'अधिकतम 10 तस्वीरें अनुमत हैं',
      slotsRemaining: 'स्थान शेष',
      simulatingAi: 'एआई नमूने का विश्लेषण कर रहा है...',
      readyForInspection: 'एपीएमसी लैब जांच के लिए तैयार',
      cancelBtn: 'रद्द करें',
      submittingBtn: 'लॉट दर्ज हो रहा है...',
      submitBtn: 'फसल लॉट दर्ज करें',
      successToast: 'फसल लॉट सफलतापूर्वक दर्ज हुआ!',
      modalDesc: 'एआई और एपीएमसी जांच के लिए फसल का सही विवरण और फोटो प्रदान करें।',
      cropType: 'फसल का प्रकार',
    },
    fpo: {
      welcome: 'एफपीओ परिचालन केंद्र',
      farmersCount: 'पंजीकृत सदस्य किसान',
      totalVolume: 'कुल एकत्रित मात्रा',
      aggregateLots: 'सदस्यों के लॉट एकत्र करें',
      mergeModalTitle: 'सामूहिक बड़ा लॉट बनाएं',
      mergeModalDesc: 'एक ही किस्म और दर्जे की फसलों को मिलाकर बेहतर थोक भाव प्राप्त करें।',
      mergedPrice: 'औसत तय मूल्य',
      confirmMerge: 'एकत्रीकरण की पुष्टि करें और प्रकाशित करें',
      bulkListings: 'बाजार में उपलब्ध सामूहिक लॉट',
      pageSubtitle: 'सदस्य किसानों की उपज एकत्र करें और बड़े व्यापारिक सौदे करें।',
      farmersContributing: 'योगदानकर्ता किसान',
      compatibleBatches: 'अनुकूल बैच',
      mergedLots: 'एकत्रित किए गए लॉट',
      combinedVolume: 'कुल संयुक्त मात्रा',
      mergeSelectedBtn: 'चुने हुए लॉट एकत्र करें',
      dialogTitle: 'फसल लॉट एकत्र और एकीकृत करें',
      dialogDesc: 'समान फसल और ग्रेड के लॉट्स को मिलाकर एक बड़ा लॉट बनाएं।',
      customPriceLabel: 'मांग भाव प्रति क्विंटल',
      pickupLocationLabel: 'संयुक्त पिकअप केंद्र',
      confirmMergeBtn: 'एकत्रीकरण की पुष्टि करें और प्रकाशित करें',
      noLotsEligible: 'एकत्रीकरण के लिए कोई लॉट उपलब्ध नहीं',
      noAggregatedLots: 'अभी तक कोई सामूहिक लॉट प्रकाशित नहीं हुआ है',
      createFirstBulkDesc: 'सामूहिक लॉट तैयार करने के लिए ऊपर दिए गए सदस्य बैच चुनें।',
    },
    inspector: {
      title: 'एपीएमसी गुणवत्ता जांच केंद्र',
      subtitle: 'फसलों के नमूनों की भौतिक जांच करें और डिजिटल गुणवत्ता पासपोर्ट जारी करें।',
      pageTitle: 'एपीएमसी गुणवत्ता जांच केंद्र',
      pageSubtitle: 'फसलों के नमूनों की भौतिक जांच करें और डिजिटल गुणवत्ता पासपोर्ट जारी करें।',
      pendingTab: 'जांच हेतु लंबित',
      verifiedTab: 'प्रमाणित पासपोर्ट',
      rejectedTab: 'अस्वीकृत लॉट',
      fifoQueue: 'प्राथमिकता क्रम',
      assayModalTitle: 'प्रयोगशाला परीक्षण के नतीजे दर्ज करें',
      moistureInput: 'नमी का प्रतिशत (%)',
      foreignMatterInput: 'विदेशी तत्व / कचरा (%)',
      damagedGrainsInput: 'क्षतिग्रस्त / सिकुड़े दाने (%)',
      gradeCalculated: 'आकलित एपीएमसी ग्रेड',
      approveAndCertify: 'प्रमाणित करें व पासपोर्ट जारी करें',
      rejectLot: 'लॉट अस्वीकार करें',
      submitting: 'जांच रिपोर्ट सुरक्षित हो रही है...',
      noPendingLots: 'कतार में कोई लंबित जांच नहीं है',
      allVerifiedDesc: 'सभी फसलों के लॉट्स की जांच रिपोर्ट पूर्ण हो चुकी है।',
      conductAssayBtn: 'लैब जांच करें',
      historyTab: 'जांच इतिहास',
      dialogTitle: 'प्रयोगशाला परीक्षण के नतीजे दर्ज करें',
      dialogDesc: 'मानक परीक्षण उपकरणों से मापे गए भौतिक व रासायनिक मानक दर्ज करें।',
      certifiedToast: 'गुणवत्ता पासपोर्ट सफलतापूर्वक प्रमाणित और जारी किया गया!',
      queueTab: 'लंबित जांच कतार',
      sortBy: 'क्रम अनुसार चुनें',
      oldest: 'पहले आए पहले पाएं (पुराने पहले)',
      locationSort: 'खेत का स्थान',
      damagedGrainInput: 'क्षतिग्रस्त / सिकुड़े दाने (%)',
      computedGradeLabel: 'आकलित एपीएमसी ग्रेड',
      notesInput: 'परीक्षक प्रयोगशाला टिप्पणियां व निष्कर्ष',
      certifyingBtn: 'प्रमाणित किया जा रहा है...',
      certifyBtn: 'प्रमाणित करें व पासपोर्ट जारी करें',
    },
    logistics: {
      title: 'परिवहन व वाहन बेड़ा प्रबंधन',
      subtitle: 'गाड़ियों का रवानगी प्रबंधन, सबसे अनुकूल मार्ग और डिजिटल डिलीवरी पुष्टि।',
      pageTitle: 'परिवहन व वाहन बेड़ा प्रबंधन',
      pageSubtitle: 'गाड़ियों का रवानगी प्रबंधन, सबसे अनुकूल मार्ग और डिजिटल डिलीवरी पुष्टि।',
      activeDispatches: 'सक्रिय परिवहन फेरे',
      fleetStatus: 'वाहनों की उपलब्धता',
      routeOptimization: 'एआई द्वारा सुगम मार्ग',
      optimizeRouteBtn: 'मार्ग अनुकूलित करें',
      optimizing: 'सबसे छोटा और सुरक्षित मार्ग खोजा जा रहा है...',
      routeOptimized: 'मार्ग अनुकूलित हुआ! ईंधन और समय की बचत होगी।',
      stopProgression: 'पड़ाव की प्रगति दर्ज करें',
      markPickedUp: 'खेत से माल उठाया गया दर्ज करें',
      markDelivered: 'गोदाम में डिलीवरी पूर्ण दर्ज करें',
      mapLegend: 'नक्शे के संकेत',
      aiOptimizedRoute: 'एआई अनुकूलित मार्ग',
      efficiencyGain: 'दक्षता सुधार',
      stops: 'पड़ाव',
      advanceStatusBtn: 'पड़ाव अपडेट करें',
      activeRuns: 'सक्रिय परिवहन फेरे',
      noRunsTitle: 'कोई सक्रिय परिवहन फेरा नहीं है',
      noRunsDesc: 'माल परिवहन के लिए पुष्ट किए गए ऑर्डर यहां प्रदर्शित होंगे।',
    },
    admin: {
      title: 'प्लेटफ़ॉर्म प्रशासन और निगरानी',
      subtitle: 'कारोबार, विवाद निपटारे, एआई सेवाएं और उपयोगकर्ताओं की स्थिति देखें।',
      pageTitle: 'प्लेटफ़ॉर्म प्रशासन और निगरानी',
      pageSubtitle: 'कारोबार, विवाद निपटारे, एआई सेवाएं और उपयोगकर्ताओं की स्थिति देखें।',
      totalVolume: 'कुल व्यापार मूल्य',
      totalTransactions: 'पूर्ण हुए सौदे',
      activeUsers: 'सत्यापित उपयोगकर्ता',
      disputeCount: 'सक्रिय एस्क्रो विवाद',
      dateRange7d: '7 दिन',
      dateRange30d: '30 दिन',
      dateRange90d: '90 दिन',
      dateRangeAll: 'अब तक का',
      volumeChartTitle: 'व्यापार मात्रा और एस्क्रो प्रवाह',
      disputesTitle: 'विवाद निपटान सूची',
      resolveDispute: 'विवाद सुलझाएं',
      disputeResolved: 'विवाद सुलझा लिया गया और एस्क्रो राशि जारी कर दी गई।',
      platformHealth: 'एआई क्लाउड सेवाएं स्थिति',
      cropVolumeDistribution: 'फसल अनुसार व्यापार वितरण',
      recentActivity: 'प्रणाली ऑडिट लॉग',
      resolveAction: 'राशि जारी करें',
      systemStatus: 'सिस्टम स्थिति',
      operational: 'पूरी तरह सुचारू',
    },
    mandi: {
      title: 'लाइव एपीएमसी मंडी भाव रिपोर्ट',
      subtitle: 'देश की प्रमुख थोक मंडियों के आधिकारिक एग्मार्कनेट भाव।',
      pageTitle: 'लाइव एपीएमसी मंडी भाव रिपोर्ट',
      pageSubtitle: 'देश की प्रमुख थोक मंडियों के आधिकारिक एग्मार्कनेट भाव।',
      selectCrop: 'फसल चुनें',
      selectState: 'मंडी चुनें',
      modalPrice: 'मॉडल भाव (औसत)',
      minPrice: 'न्यूनतम भाव',
      maxPrice: 'अधिकतम भाव',
      priceTrend: '30 दिनों का भाव रुझान',
      apmcPriceDisclaimer: 'यह आंकड़े कृषि मंत्रालय के आधिकारिक मंडी आवक पोर्टल से लिए गए हैं।',
      marketArrivals: 'दैनिक आवक (मीट्रिक टन)',
    },
    auth: {
      loginTitle: 'वापसी पर स्वागत है',
      loginSubtitle: 'अपनी फसल लिस्टिंग, सौदों और भुगतानों के प्रबंधन के लिए लॉग इन करें।',
      signupTitle: 'नया खाता बनाएं',
      signupSubtitle: 'पारदर्शी और सत्यापित कृषि मंडी से जुड़ें।',
      fullName: 'पूरा नाम',
      phone: 'मोबाइल नंबर (10 अंक)',
      email: 'ईमेल पता',
      password: 'पासवर्ड',
      repeatPassword: 'पासवर्ड की पुष्टि करें',
      selectRole: 'खाते का प्रकार / भूमिका',
      state: 'राज्य',
      district: 'जिला',
      location: 'मुख्य खेत / गोदाम का पता',
      signInBtn: 'खाते में प्रवेश करें',
      signUpBtn: 'RadicalRoots खाता बनाएं',
      noAccount: 'खाता नहीं है? पंजीकरण करें',
      hasAccount: 'पहले से खाता है? लॉग इन करें',
      demoTitle: 'त्वरित डेमो प्रोफाइल आजमाएं',
      demoSubtitle: 'बिना साइन अप किए सीधे किसी भी भूमिका में प्लेटफ़ॉर्म का अनुभव लें।',
      detectLocation: 'वर्तमान स्थान पहचानें',
      detectingLocation: 'जीपीएस स्थान जांचा जा रहा है...',
    },
    sellingWindow: {
      title: 'फसल बेचने का अनुशंसित समय',
      subtitle: 'मंडी में आवक और मौसमी चक्र पर आधारित बाजार विश्लेषण।',
      currentPrice: 'वर्तमान मॉडल भाव',
      predictedPeak: 'अनुमानित उच्चतम भाव अवधि',
      recommendation: 'रणनीतिक सुझाव',
      holdAdvice: 'मंडी में कम आवक के कारण भाव बढ़ रहे हैं। 1-2 सप्ताह फसल रोकने पर अधिक लाभ मिल सकता है।',
      sellAdvice: 'मंडी में आवक चरम पर है। मौजूदा थोक भाव अनुकूल हैं; अभी बेचना भंडारण जोखिम घटाता है।',
      watchAdvice: 'मंडी में भाव स्थिर हैं। आगामी दिनों की आवक देखकर निर्णय लें।',
      holdBadge: 'फसल रोकें',
      sellBadge: 'अभी बेचें',
      watchBadge: 'बाजार पर नजर रखें',
    },
  },
  mr: {
    common: {
      appName: 'RadicalRoots',
      loading: 'लोड होत आहे...',
      error: 'त्रुटी आढळली',
      retry: 'पुन्हा प्रयत्न करा',
      save: 'जतन करा',
      cancel: 'रद्द करा',
      submit: 'सादर करा',
      close: 'बंद करा',
      back: 'मागे जा',
      view: 'पहा',
      status: 'स्थिती',
      date: 'दिनांक',
      actions: 'कृती',
      filter: 'फिल्टर',
      search: 'शोधा',
      all: 'सर्व',
      per: 'प्रति',
      kg: 'किलो',
      quintal: 'क्विंटल',
      ton: 'टन',
      crop: 'शेतमाल',
      quantity: 'प्रमाण',
      price: 'दर',
      marketplace: 'शेतमाल बाजार',
      mandiPrices: 'बाजारभाव',
      analytics: 'विश्लेषण',
      inspectorQueue: 'तपासणी रांग',
      dashboard: 'डॅशबोर्ड',
      logisticsRuns: 'वाहतूक फेऱ्या',
      orders: 'ऑर्डर्स',
      signOut: 'लॉग आऊट',
      tip: 'सल्ला',
      signIn: 'लॉग इन करा',
      getStarted: 'सुरू करा',
      myAccount: 'माझे खाते',
      demoModeBadge: 'डेमो मोड',
      switchDemoRole: 'डेमो भूमिका बदला',
      demoMode: 'डेमो मोड',
    },
    roles: {
      farmer: 'शेतकरी',
      buyer: 'व्यापारी खरेदीदार',
      fpo: 'एफपीओ व्यवस्थापक',
      inspector: 'दर्जा तपासणी अधिकारी',
      logistics: 'वाहतूक भागीदार',
      admin: 'प्लॅटफॉर्म ॲडमिन',
    },
    crops: {
      soybean: 'सोयाबीन',
      tur: 'तूर',
      wheat: 'गहू',
      chana: 'हरभरा (चना)',
      watermelon: 'कलिंगड',
      kharbuja: 'खरबूज',
      onion: 'कांदा',
      rice: 'तांदूळ (भात)',
      cotton: 'कापूस',
      tomato: 'टोमॅटो',
      potato: 'बटाटा',
      maize: 'मका',
      mustard: 'मोहरी',
      moong: 'मूग',
    },
    lotStatuses: {
      draft: 'मसुदा',
      submitted: 'नोंदणीकृत',
      under_verification: 'तपासणी सुरू आहे',
      verified: 'प्रमाणित',
      listed: 'बाजारात उपलब्ध',
      sold: 'विक्री झाली',
      delivered: 'पोहोचवले',
      paid: 'पैसे जमा झाले',
      aggregated: 'एकत्रित लॉट',
      rejected: 'नाकारले',
    },
    orderStatuses: {
      pending: 'प्रलंबित',
      confirmed: 'निश्चित',
      invoiced: 'चलन जारी',
      paid: 'पैसे भरले',
      scheduled: 'नियोजित',
      picked_up: 'मालाची उचल झाली',
      in_transit: 'मार्गावर आहे',
      delivered: 'पोहोचवले',
      completed: 'पूर्ण',
      cancelled: 'रद्द केले',
    },
    header: {
      navMarketplace: 'शेतमाल बाजार',
      navMandiPrices: 'बाजारभाव',
      navDashboard: 'डॅशबोर्ड',
      navOrders: 'ऑर्डर्स',
      navLogistics: 'वाहतूक',
      navInspector: 'तपासणी',
      navAdmin: 'ॲडमिन',
      signIn: 'लॉग इन करा',
      getStarted: 'सुरू करा',
      myAccount: 'माझे खाते',
      signOut: 'लॉग आऊट',
      switchDemoRole: 'डेमो भूमिका बदला',
      demoMode: 'डेमो मोड',
      demoDescription: 'भूमिका-विशिष्ट कार्यप्रणाली पहा',
      welcomeBack: 'पुन्हा स्वागत आहे',
    },
    landing: {
      heroTagline: 'शेतकऱ्यांसाठी योग्य भाव. खरेदीदारांसाठी खात्रीशीर पुरवठा.',
      heroTitle: 'थेट शेतमालाचा व्यापार, तपासलेला दर्जा, मध्यस्थांशिवाय अधिक नफा.',
      heroSubtitle: 'RadicalRoots भारतातील प्रमाणित शेतकऱ्यांना थेट मोठ्या व्यावसायिक खरेदीदारांशी जोडते. लॅब तपासणी अहवाल, सुरक्षित एस्क्रो देयके आणि थेट वाहतूक सुविधेसह.',
      browseMarketplace: 'शेतमाल बाजार पहा',
      listYourCrop: 'तुमचा शेतमाल नोंदवा',
      howItWorksTitle: 'RadicalRoots कसे कार्य करते',
      howItWorksSubtitle: 'माल नोंदणीपासून ते सुरक्षित बँक खात्यात पैसे मिळेपर्यंत — संपूर्ण डिजिटल, पारदर्शक आणि खात्रीशीर.',
      step1Title: '१. शेतकरी माल नोंदवतात',
      step1Desc: 'शेतकरी किंवा एफपीओ पिकाचा तपशील, वजन, अपेक्षित भाव आणि एआय तपासणीसाठी फोटो अपलोड करतात.',
      step2Title: '२. दर्जा तपासणी व प्रमाणीकरण',
      step2Desc: 'मान्यताप्राप्त प्रयोगशाळेत आर्द्रता, कचरा आणि दाण्यांची तपासणी करून डिजिटल गुणवत्ता पासपोर्ट दिला जातो.',
      step3Title: '३. खरेदीदार थेट खरेदी करतात',
      step3Desc: 'व्यावसायिक खरेदीदार प्रमाणित मालाचा दर्जा पाहून एस्क्रो खात्यात सुरक्षित पैसे जमा करून थेट ऑर्डर देतात.',
      step4Title: '४. वाहतूक व खात्रीशीर मोबदला',
      step4Desc: 'थेट शेतातून वाहतूक होऊन माल पोहोचताच डिजिटल पोचपावतीद्वारे पैसे थेट शेतकऱ्याच्या बँक खात्यात वर्ग होतात.',
      ctaTitle: 'दलालांशिवाय थेट शेतमाल व्यापार करण्यास आपण तयार आहात का?',
      ctaSubtitle: 'महाराष्ट्रासह देशभरातील हजारो शेतकरी, एफपीओ आणि खरेदीदारांसोबत आजच जोडले जा.',
      createAccount: 'नवीन खाते तयार करा',
      exploreListings: 'उपलब्ध शेतमाल पहा',
      footerCopyright: '© RadicalRoots मार्केटप्लेस. पारदर्शक भारतीय शेतीसाठी वचनबद्ध.',
      taglineBadge: 'शेतकऱ्यांसाठी योग्य भाव. खरेदीदारांसाठी खात्रीशीर पुरवठा.',
      heroHeading: 'थेट शेतमालाचा व्यापार, तपासलेला दर्जा, मध्यस्थांशिवाय अधिक नफा.',
      howItWorksHeading: 'RadicalRoots कसे कार्य करते',
      ctaHeading: 'दलालांशिवाय थेट शेतमाल व्यापार करण्यास आपण तयार आहात का?',
      footerTagline: '© RadicalRoots मार्केटप्लेस. पारदर्शक भारतीय शेतीसाठी वचनबद्ध.',
    },
    marketplace: {
      title: 'कृषी शेतमाल बाजार',
      subtitle: 'शेतकरी आणि एफपीओंकडून थेट लॅब-प्रमाणित शेतमाल खरेदी करा, १००% सुरक्षित एस्क्रो संरक्षणासह.',
      pageTitle: 'कृषी शेतमाल बाजार',
      pageSubtitle: 'शेतकरी आणि एफपीओंकडून थेट लॅब-प्रमाणित शेतमाल खरेदी करा, १००% सुरक्षित एस्क्रो संरक्षणासह.',
      allCropsFilter: 'सर्व पिके',
      allStates: 'सर्व राज्ये',
      searchPlaceholder: 'पीक, शेतकरी किंवा जिल्ह्यावरून शोधा...',
      filterByCrop: 'पिकानुसार निवडा',
      minQuantity: 'किमान प्रमाण',
      maxPrice: 'कमाल भाव',
      sortBy: 'क्रम लावा',
      sortNewest: 'नवीनतम आधी',
      sortPriceLow: 'भाव: कमी ते जास्त',
      sortPriceHigh: 'भाव: जास्त ते कमी',
      sortQuality: 'सर्वोत्तम दर्जा',
      noLotsFound: 'कोणताही शेतमाल उपलब्ध नाही',
      noLotsDescription: 'कृपया फिल्टर किंवा शोध शब्द बदलून पुन्हा प्रयत्न करा.',
      noLotsFoundDesc: 'कृपया फिल्टर किंवा शोध शब्द बदलून पुन्हा प्रयत्न करा.',
      clearFilters: 'फिल्टर हटवा',
      resetFilters: 'फिल्टर हटवा',
      qualityScore: 'गुणवत्ता गुण',
      verifiedByLab: 'लॅब प्रमाणित',
      aiEstimated: 'एआय अंदाज',
      viewLot: 'तपशील पहा',
      fpoAggregated: 'एफपीओ एकत्रित लॉट',
      aggregatedBadge: 'एफपीओ एकत्रित लॉट',
      gradePrefix: 'ग्रेड',
      perUnit: 'प्रति',
      sourcedFromFarmers: 'प्रमाणित सदस्य शेतकऱ्यांकडून संकलित',
      availableQty: 'उपलब्ध प्रमाण',
    },
    lotDetail: {
      backToMarketplace: 'शेतमाल बाजाराकडे परत जा',
      lotId: 'लॉट क्रमांक',
      qualityScore: 'गुणवत्ता गुण',
      verifiedBy: 'तपासणी अधिकारी',
      pendingVerification: 'तपासणी सुरू आहे',
      labCertified: 'एपीएमसी लॅब प्रमाणित',
      labPending: 'तपासणी प्रलंबित',
      passportTitle: 'डिजिटल गुणवत्ता पासपोर्ट',
      passportSubtitle: 'विक्रीपूर्वी प्रयोगशाळेत भौतिक व रासायनिक तपासणी करून प्रमाणित केलेला अहवाल.',
      metricsTitle: 'प्रमाणित लॅब चाचणी आकडेवारी',
      moisture: 'आर्द्रता (ओलावा)',
      foreignMatter: 'कचरा / बाह्य घटक',
      damagedGrains: 'खराब / डागी दाणे',
      protein: 'प्रथिनांचे प्रमाण',
      traceabilityTitle: 'शेत आणि उगमस्थानाची माहिती',
      farmLocation: 'उत्पादनाचे ठिकाण (शेत)',
      harvestDate: 'काढणीची तारीख',
      harvestDateLabel: 'काढणीची तारीख',
      listedOnLabel: 'नोंदणी तारीख',
      fpoName: 'शेतकरी उत्पादक संस्था (FPO)',
      sellerProfile: 'विक्रेता प्रोफाइल',
      farmerNameLabel: 'शेतकऱ्याचे नाव',
      memberFpoBadge: 'एफपीओ सदस्य',
      rating: 'शेतकरी रेटिंग',
      reviews: 'सत्यापित खरेदीदार अभिप्राय',
      ratingsCountSuffix: 'अभिप्राय',
      ratingsAndReviews: 'खरेदीदार रेटिंग व अभिप्राय',
      placeOrder: 'खरेदी ऑर्डर नोंदवा',
      orderQuantity: 'खरेदी करायचे प्रमाण',
      quantityLabel: 'उपलब्ध प्रमाण',
      priceLabel: 'अपेक्षित दर',
      totalAmount: 'एकूण अंदाजे रक्कम',
      escrowNotice: 'Radical एस्क्रो द्वारे पूर्ण सुरक्षित — माल पोहोचल्यावर तपासणीअंतीच रक्कम वर्ग केली जाईल.',
      selectPayment: 'पेमेंट पद्धत निवडा',
      payEscrow: 'एस्क्रो जमा करा आणि ऑर्डर द्या',
      orderSuccess: 'खरेदी ऑर्डर यशस्वीरीत्या नोंदवली गेली! एस्क्रो रक्कम जमा झाली आहे.',
      orderError: 'ऑर्डर नोंदवण्यात त्रुटी आली. कृपया प्रमाण तपासून पुन्हा प्रयत्न करा.',
      verifiedBadge: 'लॅब प्रमाणित',
      pendingBadge: 'तपासणी प्रलंबित',
      lotDescription: 'लॉटचा तपशील आणि शेताची माहिती',
      contributionsTitle: 'एफपीओ एकत्रित शेतकरी योगदान',
      contributionsDesc: 'व्यावसायिक मागणी पूर्ण करण्यासाठी हा लॉट अनेक सदस्य शेतकऱ्यांचा माल एकत्रित करून बनवला आहे.',
      contributingLotsDesc: 'व्यावसायिक मागणी पूर्ण करण्यासाठी हा लॉट अनेक सदस्य शेतकऱ्यांचा माल एकत्रित करून बनवला आहे.',
      farmerNameCol: 'शेतकऱ्याचे नाव',
      quantityCol: 'योगदान प्रमाण',
      gradeCol: 'दर्जा (ग्रेड)',
      locationCol: 'गाव / तालुका',
      noReviewsYet: 'अजून कोणताही खरेदीदार अभिप्राय नाही.',
      aggregatedLotBadge: 'एफपीओ एकत्रित शेतमाल लॉट',
      digitalQualityPassport: 'डिजिटल गुणवत्ता पासपोर्ट',
      declaredTag: 'स्वतः घोषित',
      gradeLabel: 'व्यापारी दर्जा',
      aiVisualPrescreen: 'एआय प्राथमिक तपासणी',
      moistureLabel: 'ओलावा',
      foreignMatterLabel: 'कचरा / बाह्य घटक',
      damagedGrainLabel: 'खराब दाणे',
      estimatedGradeLabel: 'एआय अंदाजित दर्जा',
      labMetricsPendingNote: 'एपीएमसी प्रमाणित अधिकाऱ्याद्वारे लॅब तपासणी सुरू आहे.',
      traceabilityBreakdown: 'शेतकरीनिहाय उगम व योगदान तपशील',
      sourceLabel: 'उगम स्त्रोत',
      notAggregatedValue: 'एकाच शेतातील उत्पादन',
      apmcCertified: 'एपीएमसी लॅब प्रमाणित',
      physicalPending: 'प्रत्यक्ष तपासणी प्रलंबित',
      passportId: 'पासपोर्ट क्रमांक',
      traceableBatch: 'सत्यापित लॉट',
      standardAgmark: 'ॲगमार्क दर्जा निकष',
      labTestingCompleted: 'प्रमाणित प्रयोगशाळा तपासणी पूर्ण',
      awaitingPhysicalAudit: 'प्रत्यक्ष लॅब तपासणी प्रलंबित',
      verifiedSellerBadge: 'प्रमाणित उत्पादक',
    },
    orderForm: {
      quantityLabel: 'प्रमाण (क्विंटलमध्ये)',
      quantityHelp: 'या लॉटमधून आपल्याला खरेदी करायचे अचूक प्रमाण भरा.',
      priceBreakdown: 'रक्कमेचा तपशील',
      basePrice: 'शेतीमालाचे मूल्य',
      platformFee: 'प्लॅटफॉर्म आणि एस्क्रो फी (१.५%)',
      totalPrice: 'एकूण एस्क्रो रक्कम',
      paymentMethod: 'पेमेंटचा पर्याय निवडा',
      escrowMethod: 'Radical एस्क्रो (थेट सुरक्षित बँक हस्तांतरण)',
      escrowDescription: 'मालाची पावती आणि दर्जा तपासणी पूर्ण होईपर्यंत पैसे सुरक्षित ठेवले जातात.',
      escrowDesc: 'मालाची पावती आणि दर्जा तपासणी पूर्ण होईपर्यंत पैसे सुरक्षित ठेवले जातात.',
      upiMethod: 'त्वरित कॉर्पोरेट यूपीआय / क्यूआर',
      upiDescription: 'लहान घाऊक व्यवहारांसाठी तत्काळ भरणा.',
      instantUpi: 'त्वरित कॉर्पोरेट यूपीआय / क्यूआर',
      upiDesc: 'घाऊक खरेदीसाठी तत्काळ भरणा.',
      mandiMethod: 'एपीएमसी थेट बाजार समिती चलन',
      mandiDescription: 'नियमित बाजार समिती चलन आणि व्यवहार पद्धत.',
      apmcMandi: 'एपीएमसी थेट बाजार समिती चलन',
      mandiDesc: 'नियमित बाजार समिती चलन आणि व्यवहार पद्धत.',
      mockDecline: 'पेमेंट अयशस्वी चाचणी (डेमो मोड)',
      mockDeclineHelp: 'पेमेंट अयशस्वी झाल्यावर प्रणाली कशी वागते हे तपासण्यासाठी ही खूण करा.',
      simulateDeclineLabel: 'पेमेंट अयशस्वी चाचणी (डेमो मोड)',
      resetTryAgainBtn: 'पुन्हा प्रयत्न करा',
      orderTotalLabel: 'एकूण एस्क्रो रक्कम',
      authorizingBtn: 'एस्क्रो जमा होत आहे...',
      placeOrderBtn: 'एस्क्रो जमा करा आणि ऑर्डर द्या',
      signInToOrderBtn: 'ऑर्डर देण्यासाठी लॉग इन करा',
      confirmOrder: 'एस्क्रो जमा करा आणि ऑर्डर पक्की करा',
      processing: 'एस्क्रो जमा होत आहे...',
      insufficientStock: 'मागणी केलेले प्रमाण उपलब्ध साठ्यापेक्षा जास्त आहे.',
      exceedsStockError: 'मागणी केलेले प्रमाण उपलब्ध साठ्यापेक्षा जास्त आहे.',
      enterValidQty: 'कृपया शून्यापेक्षा जास्त योग्य प्रमाण प्रविष्ट करा.',
      invalidQuantityError: 'कृपया शून्यापेक्षा जास्त योग्य प्रमाण प्रविष्ट करा.',
      orderPlacedSuccess: 'ऑर्डर यशस्वीरीत्या नोंदवली गेली! एस्क्रो सुरक्षित जमा झाला.',
      paymentDeclinedError: 'चाचणी सिम्युलेटरने पेमेंट नाकारले. पुढे जाण्यासाठी अनचेक करा.',
      orderSuccessToast: 'ऑर्डर निश्चित झाली आणि एस्क्रो जमा झाला!',
      ownListingNotice: 'हा आपला स्वतःचा शेतमाल आहे — आपण स्वतःचा माल खरेदी करू शकत नाही.',
      availableLabel: 'उपलब्ध प्रमाण',
      enterQuantityPlaceholder: 'कमाल प्रमाण टाका',
      securePaymentMethod: 'पेमेंट पर्याय निवडा',
      radicalEscrow: 'Radical एस्क्रो',
    },
    orders: {
      title: 'ऑर्डर व्यवस्थापन',
      subtitle: 'आपले खरेदी सौदे, मालवाहतुकीची स्थिती, एस्क्रो देयके आणि शेतकरी रेटिंग पहा.',
      pageTitle: 'ऑर्डर व्यवस्थापन',
      farmerSubtitle: 'आपली शेतमाल विक्री, वाहतूक आणि एस्क्रो जमा रकमा पहा.',
      buyerSubtitle: 'आपले खरेदी सौदे, मालवाहतुकीची स्थिती आणि डिलिव्हरी पहा.',
      orderId: 'ऑर्डर क्रमांक',
      date: 'ऑर्डर तारीख',
      crop: 'शेतमाल',
      quantity: 'प्रमाण',
      amount: 'एकूण रक्कम',
      status: 'स्थिती',
      seller: 'उत्पादक / विक्रेता',
      buyer: 'खरेदीदार / ग्राहक',
      buyerLabel: 'खरेदीदार',
      deliveryLabel: 'डिलिव्हरी',
      tracking: 'वाहतूक मार्ग',
      rateFarmer: 'शेतकऱ्याला रेटिंग द्या',
      rated: 'रेटिंग दिले गेले',
      noOrders: 'कोणतीही ऑर्डर नाही',
      noOrdersTitle: 'कोणतीही ऑर्डर नाही',
      noOrdersDesc: 'आपल्या या खात्यामध्ये सध्या कोणतीही सक्रिय किंवा मागील ऑर्डर नोंदवलेली नाही.',
      noOrdersFarmerDesc: 'जेव्हा खरेदीदार आपला शेतमाल खरेदी करतील, तेव्हा करार येथे दिसतील.',
      noOrdersBuyerDesc: 'शेतमाल बाजारातील प्रमाणित शेतमाल पहा आणि ऑर्डर नोंदवा.',
      deliveryStatus: 'डिलिव्हरी स्थिती',
      tipTrackDelivery: 'रवाना झालेल्या सर्व वाहनांचे थेट जीपीएस ट्रॅकिंग उपलब्ध असते.',
      tipText: 'रवाना झालेल्या सर्व वाहनांचे थेट जीपीएस ट्रॅकिंग उपलब्ध असते.',
      viewDetails: 'करारपत्र पहा',
      allStatuses: 'सर्व स्थिती',
      refresh: 'ऑर्डर्स रिफ्रेश करा',
      yourRatingLabel: 'आपले रेटिंग',
      rateOrderBtn: 'शेतकऱ्याला रेटिंग द्या',
    },
    ratingDialog: {
      title: 'शेतकऱ्याची गुणवत्ता रेटिंग नोंदवा',
      description: 'पारदर्शक आणि विश्वासू शेतकरी नेटवर्क तयार करण्यासाठी आपला प्रामाणिक अभिप्राय द्या.',
      dialogTitle: 'शेतकऱ्याची गुणवत्ता रेटिंग नोंदवा',
      dialogDesc: 'पारदर्शक अभिप्राय देऊन थेट शेतमाल व्यापारात विश्वास वाढवा.',
      qualityLabel: 'शेतमालाचा दर्जा आणि दर्जानुसार माल',
      rateCropQuality: 'शेतमाल गुणवत्ता रेटिंग',
      packagingLabel: 'पोती आणि पॅकिंगची स्थिती',
      deliveryLabel: 'माल रवानगीची वेळ आणि सहकार्य',
      commentLabel: 'खरेदीदाराचा सविस्तर अभिप्राय',
      commentPlaceholder: 'ओलावा, दाण्यांचा आकार, रंग किंवा डिलिव्हरी अनुभवाबद्दल लिहा...',
      feedbackPlaceholder: 'ओलावा, दाण्यांचा आकार, रंग किंवा डिलिव्हरी अनुभवाबद्दल लिहा...',
      submitRating: 'अभिप्राय आणि रेटिंग सबमिट करा',
      submitting: 'अभिप्राय नोंदवला जात आहे...',
      submittingBtn: 'अभिप्राय नोंदवला जात आहे...',
      submitRatingBtn: 'रेटिंग सबमिट करा',
      warning: 'आपले रेटिंग कायमस्वरूपी विक्रेत्याच्या प्रोफाइलवर दिसेल.',
      requiredFeedbackWarning: '२ स्टार किंवा त्याहून कमी रेटिंगसाठी कृपया कारण नमूद करा.',
      starPoor: 'कमी दर्जा (१/५)',
      starFair: 'साधारण (२/५)',
      starGood: 'चांगला (३/५)',
      starVeryGood: 'खूप छान (४/५)',
      starExcellent: 'उत्कृष्ट (५/५)',
      flaggedWarningToast: 'अभिप्राय नोंदवला गेला आणि मध्यस्थीसाठी पाठवला गेला.',
      ratingSuccessToast: 'धन्यवाद! आपले सत्यापित रेटिंग नोंदवले गेले.',
    },
    buyer: {
      welcome: 'खरेदीदार खरेदी दालन',
      activeOrders: 'सक्रिय सौदे',
      totalSpent: 'एकूण खर्च केलेली रक्कम',
      deliveredOrders: 'प्राप्त झालेल्या ऑर्डर्स',
      recentOrders: 'नुकत्याच झालेल्या खरेदी ऑर्डर्स',
      browseMore: 'बाजारपेठेत अधिक शेतमाल पहा',
      viewAllOrders: 'सर्व ऑर्डर्स पहा',
      ordersPlaced: 'नोंदवलेल्या ऑर्डर्स',
      totalOrderValue: 'एकूण ऑर्डर मूल्य',
      browseMarketplaceBtn: 'शेतमाल बाजार पहा',
      recentOrdersTitle: 'आपल्या अलीकडील ऑर्डर्स',
      viewAllLink: 'सर्व पहा',
      noOrdersYetTitle: 'अजून कोणतीही ऑर्डर नाही',
      noOrdersYetDesc: 'शेतमाल बाजारातील प्रमाणित माल पहा आणि पहिली ऑर्डर देण्यासाठी एस्क्रो जमा करा.',
      goToMarketplaceBtn: 'शेतमाल बाजाराकडे जा',
    },
    farmer: {
      welcome: 'शेतकरी डॅशबोर्ड',
      activeLots: 'सक्रिय शेतमाल लॉट',
      totalEarned: 'एकूण उत्पन्न',
      pendingReview: 'तपासणी सुरू असलेले लॉट',
      listNewCrop: 'नवीन शेतमाल नोंदवा',
      myLots: 'माझे नोंदवलेले शेतमाल',
      noLotsYet: 'आपण अजून कोणताही शेतमाल नोंदवलेला नाही.',
      ratingTitle: 'शेतकरी पत निर्देशांक',
      ratingSub: 'प्रमाणित खरेदीदारांच्या अभिप्रायावर आधारित',
      dashboardSubtitle: 'आपला शेतमाल, ऑर्डर्स आणि गुणवत्ता प्रमाणपत्रांचे व्यवस्थापन करा.',
      totalQuantityListed: 'एकूण नोंदवलेले प्रमाण',
      myCrops: 'माझी नोंदवलेली पिके',
      noLotsListed: 'अजून कोणताही शेतमाल नोंदवलेला नाही',
      listFirstLot: 'आपला पहिला शेतमाल नोंदवा',
      lotId: 'लॉट क्रमांक',
      actionViewLot: 'तपशील पहा',
      marketComparison: 'बाजारभाव कल आणि विश्लेषक माहिती',
      recentDispatches: 'अलीकडील वाहतूक आणि फेऱ्या',
      addLotBtn: 'नवीन शेतमाल नोंदवा',
    },
    newLot: {
      modalTitle: 'नवीन शेतमाल लॉट नोंदवा',
      selectCrop: 'पिकाचा प्रकार निवडा',
      quantity: 'उपलब्ध प्रमाण (क्विंटलमध्ये)',
      pricePerUnit: 'अपेक्षित भाव प्रति क्विंटल (₹)',
      harvestDate: 'काढणीची तारीख',
      location: 'शेताचे गाव / तालुका',
      uploadPhotos: 'शेतमालाच्या नमुन्याचे फोटो जोडा',
      uploadHelp: 'स्वच्छ फोटोमुळे एआय प्रणाली त्वरित दर्जाचा प्राथमिक अंदाज लावू शकते.',
      aiAnalyzing: 'एआय द्वारे नमुन्याचे विश्लेषण सुरू आहे...',
      aiScoreNotice: 'एआय अंदाजित गुणवत्ता गुण',
      estimatedOffline: 'अंदाजित (ऑफलाइन पर्याय)',
      submitListing: 'शेतमाल बाजारात नोंदवा',
      submitting: 'नोंदणी सुरू आहे...',
      unit: 'मोजमाप एकक',
      expectedPrice: 'अपेक्षित भाव प्रति क्विंटल',
      pickupLocation: 'शेत / संकलन ठिकाण',
      selfGrade: 'स्वतः ठरवलेला दर्जा',
      gradeA: 'ग्रेड अ (उत्कृष्ट दर्जा)',
      gradeB: 'ग्रेड ब (मध्यम दर्जा)',
      gradeC: 'ग्रेड क (साधारण दर्जा)',
      photoSectionTitle: 'शेतमालाच्या नमुन्याचे फोटो',
      photosCount: 'फोटो जोडले',
      minPhotosNotice: 'शेतमालाच्या नमुन्याचा किमान १ स्पष्ट फोटो जोडा.',
      recommendedPhotosNotice: 'अचूक एआय तपासणीसाठी दाणे आणि संपूर्ण नमुन्याचे ३-४ फोटो जोडा.',
      uploadPhotosBtn: 'फोटो जोडा',
      uploadMoreBtn: 'आणखी फोटो जोडा',
      maxPhotosReached: 'जास्तीत जास्त १० फोटो अनुमत आहेत',
      slotsRemaining: 'जागा शिल्लक',
      simulatingAi: 'एआय नमुन्याचे विश्लेषण करत आहे...',
      readyForInspection: 'एपीएमसी लॅब तपासणीसाठी तयार',
      cancelBtn: 'रद्द करा',
      submittingBtn: 'नोंदणी सुरू आहे...',
      submitBtn: 'शेतमाल लॉट नोंदवा',
      successToast: 'शेतमाल लॉट यशस्वीरीत्या नोंदवला गेला!',
      modalDesc: 'एआय आणि लॅब तपासणीसाठी पिकाचा अचूक तपशील आणि फोटो द्या.',
      cropType: 'पिकाचा प्रकार',
    },
    fpo: {
      welcome: 'एफपीओ कामकाज केंद्र',
      farmersCount: 'नोंदणीकृत सदस्य शेतकरी',
      totalVolume: 'एकूण संकलित प्रमाण',
      aggregateLots: 'सदस्यांचा माल एकत्र करा',
      mergeModalTitle: 'एकत्रित मोठा लॉट तयार करा',
      mergeModalDesc: 'एकाच प्रकारचा आणि दर्जाचा शेतमाल एकत्र करून मोठ्या खरेदीदारांकडून चांगला दर मिळवा.',
      mergedPrice: 'सरासरी निश्चित दर',
      confirmMerge: 'एकत्रीकरण निश्चित करा व प्रकाशित करा',
      bulkListings: 'बाजारातील एकत्रित शेतमाल लॉट',
      pageSubtitle: 'सदस्य शेतकऱ्यांचा माल एकत्र करा आणि मोठे व्यापारी सौदे करा.',
      farmersContributing: 'सहभागी शेतकरी',
      compatibleBatches: 'सुसंगत लॉट्स',
      mergedLots: 'एकत्रित केलेले लॉट्स',
      combinedVolume: 'एकूण एकत्रित प्रमाण',
      mergeSelectedBtn: 'निवडलेले लॉट्स एकत्र करा',
      dialogTitle: 'शेतमाल लॉट्स एकत्र करा',
      dialogDesc: 'एकाच पिकाचे आणि दर्जाचे लॉट्स एकत्र करून मोठी नोंदणी करा.',
      customPriceLabel: 'अपेक्षित भाव प्रति क्विंटल',
      pickupLocationLabel: 'एकत्रित संकलन केंद्र',
      confirmMergeBtn: 'एकत्रीकरण निश्चित करा व प्रकाशित करा',
      noLotsEligible: 'एकत्रीकरणासाठी कोणतेही लॉट्स उपलब्ध नाहीत',
      noAggregatedLots: 'अजून कोणताही एकत्रित लॉट प्रकाशित केलेला नाही',
      createFirstBulkDesc: 'मोठा लॉट तयार करण्यासाठी वरील सदस्य बॅचेस निवडा.',
    },
    inspector: {
      title: 'एपीएमसी गुणवत्ता तपासणी केंद्र',
      subtitle: 'शेतमालाच्या नमुन्यांची तपासणी करा आणि डिजिटल गुणवत्ता पासपोर्ट जारी करा.',
      pageTitle: 'एपीएमसी गुणवत्ता तपासणी केंद्र',
      pageSubtitle: 'शेतमालाच्या नमुन्यांची तपासणी करा आणि डिजिटल गुणवत्ता पासपोर्ट जारी करा.',
      pendingTab: 'तपासणीसाठी प्रलंबित',
      verifiedTab: 'प्रमाणित पासपोर्ट',
      rejectedTab: 'नाकारलेले लॉट',
      fifoQueue: 'प्राधान्यक्रम रांग',
      assayModalTitle: 'प्रयोगशाळा तपासणी निकाल नोंदवा',
      moistureInput: 'ओलाव्याचे प्रमाण (%)',
      foreignMatterInput: 'कचरा / बाह्य घटक (%)',
      damagedGrainsInput: 'खराब / अपरिपक्व दाणे (%)',
      gradeCalculated: 'काढलेला एपीएमसी ग्रेड',
      approveAndCertify: 'प्रमाणित करा व पासपोर्ट द्या',
      rejectLot: 'लॉट नाकारा',
      submitting: 'तपासणी अहवाल जतन केला जात आहे...',
      noPendingLots: 'रांगेत कोणतीही प्रलंबित तपासणी नाही',
      allVerifiedDesc: 'सर्व शेतमाल लॉट्सची तपासणी पूर्ण झाली आहे.',
      conductAssayBtn: 'लॅब चाचणी करा',
      historyTab: 'तपासणी इतिहास',
      dialogTitle: 'प्रयोगशाळा तपासणी निकाल नोंदवा',
      dialogDesc: 'मानक उपकरणांद्वारे मोजलेले भौतिक व रासायनिक निकष नोंदवा.',
      certifiedToast: 'गुणवत्ता पासपोर्ट यशस्वीरीत्या प्रमाणित आणि जारी केला गेला!',
      queueTab: 'प्रलंबित तपासणी रांग',
      sortBy: 'क्रमानुसार निवडा',
      oldest: 'आधी आलेले आधी (जुने प्रथम)',
      locationSort: 'शेताचे ठिकाण',
      damagedGrainInput: 'खराब / अपरिपक्व दाणे (%)',
      computedGradeLabel: 'काढलेला एपीएमसी ग्रेड',
      notesInput: 'प्रयोगशाळा तपासणी शेरा व निष्कर्ष',
      certifyingBtn: 'प्रमाणित केले जात आहे...',
      certifyBtn: 'प्रमाणित करा व पासपोर्ट द्या',
    },
    logistics: {
      title: 'वाहतूक व वाहन व्यवस्थापन',
      subtitle: 'थेट शेतातून वाहतूक, वाहनांचे मार्ग नियोजन आणि डिजिटल डिलिव्हरी खात्री.',
      pageTitle: 'वाहतूक व वाहन व्यवस्थापन',
      pageSubtitle: 'थेट शेतातून वाहतूक, वाहनांचे मार्ग नियोजन आणि डिजिटल डिलिव्हरी खात्री.',
      activeDispatches: 'सक्रिय वाहतूक फेऱ्या',
      fleetStatus: 'वाहनांची उपलब्धता',
      routeOptimization: 'एआय द्वारे सुलभ मार्ग नियोजन',
      optimizeRouteBtn: 'वाहतूक मार्ग अनुकूल करा',
      optimizing: 'सर्वात जवळचा आणि जलद मार्ग शोधत आहे...',
      routeOptimized: 'मार्ग अनुकूल केला! इंधन आणि वेळेची बचत होईल.',
      stopProgression: 'टप्प्यांची प्रगती नोंदवा',
      markPickedUp: 'शेतातून माल भरल्याची नोंद करा',
      markDelivered: 'गोदामात माल पोहोचल्याची नोंद करा',
      mapLegend: 'नकाशा निर्देशक',
      aiOptimizedRoute: 'एआय अनुकूलित मार्ग',
      efficiencyGain: 'कार्यक्षमता वाढ',
      stops: 'थांबे',
      advanceStatusBtn: 'टप्पा अपडेट करा',
      activeRuns: 'सक्रिय वाहतूक फेऱ्या',
      noRunsTitle: 'कोणतीही सक्रिय वाहतूक फेरी नाही',
      noRunsDesc: 'वाहतुकीसाठी निश्चित केलेल्या ऑर्डर्स येथे दिसतील.',
    },
    admin: {
      title: 'प्लॅटफॉर्म प्रशासन आणि नियंत्रण',
      subtitle: 'व्यापार उलाढाल, तंटे निवारण, एआय सेवा आणि वापरकर्त्यांची स्थिती तपासा.',
      pageTitle: 'प्लॅटफॉर्म प्रशासन आणि नियंत्रण',
      pageSubtitle: 'व्यापार उलाढाल, तंटे निवारण, एआय सेवा आणि वापरकर्त्यांची स्थिती तपासा.',
      totalVolume: 'एकूण व्यापार उलाढाल',
      totalTransactions: 'पूर्ण झालेले व्यवहार',
      activeUsers: 'सत्यापित वापरकर्ते',
      disputeCount: 'सक्रिय एस्क्रो तक्रारी',
      dateRange7d: '७ दिवस',
      dateRange30d: '३० दिवस',
      dateRange90d: '९० दिवस',
      dateRangeAll: 'सुरुवातीपासून',
      volumeChartTitle: 'व्यापार प्रमाण आणि एस्क्रो प्रवाह',
      disputesTitle: 'तक्रार निवारण यादी',
      resolveDispute: 'तक्रार सोडवा',
      disputeResolved: 'तक्रार सोडवली गेली आणि एस्क्रो रक्कम वर्ग करण्यात आली.',
      platformHealth: 'एआय क्लाउड सेवा स्थिती',
      cropVolumeDistribution: 'शेतमालानुसार व्यापार विभागणी',
      recentActivity: 'प्रणाली ऑडिट नोंदवही',
      resolveAction: 'रक्कम वर्ग करा',
      systemStatus: 'प्रणाली स्थिती',
      operational: 'पूर्णपणे कार्यरत',
    },
    mandi: {
      title: 'थेट एपीएमसी बाजारभाव माहिती',
      subtitle: 'देशातील प्रमुख बाजार समित्यांमधील अधिकृत ॲगमार्कनेट घाऊक दर.',
      pageTitle: 'थेट एपीएमसी बाजारभाव माहिती',
      pageSubtitle: 'देशातील प्रमुख बाजार समित्यांमधील अधिकृत ॲगमार्कनेट घाऊक दर.',
      selectCrop: 'शेतमाल निवडा',
      selectState: 'बाजार समिती निवडा',
      modalPrice: 'सरासरी घाऊक दर',
      minPrice: 'किमान दर',
      maxPrice: 'कमाल दर',
      priceTrend: '३० दिवसांचा बाजारभाव कल',
      apmcPriceDisclaimer: 'ही माहिती कृषी मंत्रालयाच्या अधिकृत बाजार आवक पोर्टलवरून घेतलेली आहे.',
      marketArrivals: 'दैनिक आवक (मेट्रिक टन)',
    },
    auth: {
      loginTitle: 'पुन्हा स्वागत आहे',
      loginSubtitle: 'आपला शेतमाल, करार आणि व्यवहारांच्या व्यवस्थापनासाठी लॉग इन करा.',
      signupTitle: 'नवीन खाते तयार करा',
      signupSubtitle: 'पारदर्शक आणि थेट शेतमाल व्यापार बाजारात सामील व्हा.',
      fullName: 'पूर्ण नाव',
      phone: 'मोबाईल क्रमांक (१० अंक)',
      email: 'ईमेल पत्ता',
      password: 'पासवर्ड',
      repeatPassword: 'पासवर्डची खात्री करा',
      selectRole: 'खात्याचा प्रकार / भूमिका',
      state: 'राज्य',
      district: 'जिल्हा',
      location: 'मुख्य शेत / गोदामाचा पत्ता',
      signInBtn: 'खात्यात प्रवेश करा',
      signUpBtn: 'RadicalRoots खाते तयार करा',
      noAccount: 'खाते नाही का? नोंदणी करा',
      hasAccount: 'आधीच खाते आहे का? लॉग इन करा',
      demoTitle: 'झटपट डेमो खाती वापरून पहा',
      demoSubtitle: 'नोंदणी न करता कोणत्याही भूमिकेचा प्लॅटफॉर्मवर थेट अनुभव घ्या.',
      detectLocation: 'सध्याचे स्थान शोधा',
      detectingLocation: 'जीपीएस स्थान शोधत आहे...',
    },
    sellingWindow: {
      title: 'शेतमाल विक्रीचा योग्य काळ',
      subtitle: 'बाजार समिती आवक आणि हंगामी भावावर आधारित बाजार विश्लेषक सल्ला.',
      currentPrice: 'सध्याचा सरासरी दर',
      predictedPeak: 'अपेक्षित उच्च दर कालावधी',
      recommendation: 'रणनीतिक सल्ला',
      holdAdvice: 'बाजार समितीत कमी आवक असल्याने भाव वाढण्याची शक्यता आहे. १-२ आठवडे माल थांबवल्यास अधिक नफा मिळू शकतो.',
      sellAdvice: 'बाजार समितीत आवक भरपूर आहे. सध्याचे दर चांगले आहेत; आत्ताच विक्री केल्याने साठवणुकीचा धोका टळेल.',
      watchAdvice: 'बाजारातील भाव सध्या स्थिर आहेत. येत्या काही दिवसांतील आवक पाहून विक्रीचा निर्णय घ्या.',
      holdBadge: 'माल रोखून ठेवा',
      sellBadge: 'आत्ताच विक्री करा',
      watchBadge: 'बाजारावर लक्ष ठेवा',
    },
  },
}

export function getCropLabel(crop: string, locale: Locale = 'en'): string {
  const c = crop.toLowerCase() as keyof Translations['crops']
  const localizedCrops = translations[locale]?.crops || translations.en.crops
  return localizedCrops[c] || crop
}

export function getRoleLabel(role: string, locale: Locale = 'en'): string {
  const r = role.toLowerCase() as keyof Translations['roles']
  const localizedRoles = translations[locale]?.roles || translations.en.roles
  return localizedRoles[r] || role
}

export function getLotStatusLabel(status: string, locale: Locale = 'en'): string {
  const s = status.toLowerCase() as keyof Translations['lotStatuses']
  const localizedStatuses = translations[locale]?.lotStatuses || translations.en.lotStatuses
  return localizedStatuses[s] || status
}

export function getOrderStatusLabel(status: string, locale: Locale = 'en'): string {
  const s = status.toLowerCase() as keyof Translations['orderStatuses']
  const localizedStatuses = translations[locale]?.orderStatuses || translations.en.orderStatuses
  return localizedStatuses[s] || status
}
