# Security Policy - CarbonLens

CarbonLens is built with security, privacy, and regulatory compliance at its core. This document outlines the security architecture and reporting procedures for our platform.

## Security Controls

### 1. PII Hashing (GDPR & Data Privacy compliance)
To protect user privacy, personal identifiers such as emails are never stored in plain text.
- We utilize the browser's asynchronous **Web Crypto API (SubtleCrypto)** to perform zero-knowledge SHA-256 client-side hashing on user emails.
- Only the cryptographic hash is used for storage identifiers, preventing retrieval of plain-text email addresses from client logs or databases.

### 2. Content Security Policy (CSP)
We implement strict Content Security Policy headers to protect against Cross-Site Scripting (XSS) and data injection attacks:
- `default-src 'self'`
- Scripts are restricted to origin and approved CDN locations (e.g. Firebase SDKs).
- Style injections are limited to safe frameworks and origin styling.

### 3. XSS Sanitization
All freeform text inputs (such as activity logging descriptions) are fully sanitized using **DOMPurify** before they are rendered to prevent DOM-based XSS attacks.

### 4. Code Quality & Dependency Scanning
- Zero third-party telemetry, trackers, or cookies are integrated.
- Regular audits ensure no high-severity vulnerabilities (zero CVEs) in package dependencies.

## Reporting a Vulnerability

If you discover a security vulnerability, please do not disclose it publicly. Email us directly at:
**security@carbonlens.dev**

We will respond within 48 hours and coordinate a patch within 7 days.
