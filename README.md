# RadicalRoots — Farm-to-Buyer Marketplace

RadicalRoots connects verified agricultural producers directly with bulk commercial buyers across India. Backed by lab quality assays, transparent escrow payments, end-to-end logistics routing, and multilingual accessibility (English, Hindi, and Marathi).

---

## 🛠 Internal Production-Readiness & Architecture Status

This section explicitly documents what is **real/production-ready** versus what is **intentionally simulated/mocked for this hackathon**:

### 1. Simulated vs Production Services

| Component | Current Hackathon Implementation | Production Architecture Plan |
| :--- | :--- | :--- |
| **(a) Crop Sample Photos** | **In-memory Object URLs (`URL.createObjectURL`)**: Photos selected by farmers are loaded into browser memory for immediate preview and multi-image AI pre-screening. | **Cloud Storage (Supabase Storage / AWS S3)**: Multipart uploads with signed URLs, server-side virus scanning, WebP transcoding, and permanent bucket URLs stored in `crop_lots.photos`. |
| **(b) APMC Mandi Rates** | **Realistic Calibrated Mock Data**: Comprehensive benchmark pricing based on actual Maharashtra APMC modal wholesale rate ranges (Agmarknet historical seasonal curves). | **Live Agmarknet & Ministry of Agriculture API Feeds**: Scheduled cron worker fetching official Agmarknet XML/JSON commodity feeds daily, storing time-series price indices with anomaly rejection. |
| **(c) Reverse Geocoding** | **OpenStreetMap Nominatim REST API**: Free external geocoding service with manual input fallback. Does not maintain an offline local vector/tile cache. | **Dual Offline/Online Hybrid Geolocation**: SQLite/IndexedDB offline village-level PIN/Pincode gazetteer + resilient edge fallback for remote low-connectivity rural farm locations. |

---

## 🚀 Key Production-Ready Features
- **Multilingual i18n**: 100% full-page coverage in English, Hindi (हिंदी), and Marathi (मराठी) with zero layout truncation, persistent cookie/localStorage sync, and runtime console safeguard warnings.
- **Role-Based Security Gating**: Strict separation between Farmers, Buyers, FPOs, Logistics Partners, Quality Inspectors, and Admins.
- **Privacy & PII Protection**: Server-side PII sanitization on `/marketplace/[id]` ensuring buyer identity and bidding history are visible exclusively to that buyer, their seller, and Admins.
- **Digital Quality Passports**: Verified assay metrics (Moisture, Foreign Matter, Damaged Kernels) computed against APMC specifications.
- **Consolidated FPO Aggregation**: Multi-farmer lot bundling with transparent origin traceability.
