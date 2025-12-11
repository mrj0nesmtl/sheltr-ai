# POD Security Architecture

**Smart Locking & Access System for Model A Flat-Pack**

*Version: 2.0 | Updated: December 11, 2025*

---

## 1. Overview

The SHELTR Model A smart lock system provides multi-factor authentication and remote access control for flat-pack emergency housing units. The system integrates biometric authentication (fingerprint), numeric keypad entry, mobile app control, and QR code access, all managed through the SHELTR platform.

**Security Philosophy**: Layered security with local resilience and remote management capabilities.

The flat-pack design introduces unique security considerations during assembly, transport, and deployment phases, all addressed in this comprehensive security architecture.

---

## 2. Hardware Specifications

### Lock Body & Materials

**Construction:**
- **Casing**: Powder-coated aluminum alloy
  - Corrosion-resistant
  - Scratch-resistant
  - Matches POD exterior finish (matte dark gray)
- **Handle**: Stainless steel (black anodized finish)
  - High durability
  - Ergonomic design
  - ADA compliant
- **Weatherproofing**: IP65-rated enclosure
  - Suitable for outdoor winter use
  - Snow and ice resistant
  - Temperature range: -30°C to +50°C

### Authentication Modes

**Multi-Factor Access Control:**

1. **QR Code Scanner** (Primary)
   - SHELTR platform-generated codes
   - Time-limited access codes
   - Visitor/service access
   - Audit trail logging
   - Integrated with POD branding

2. **Keypad Entry**
   - Backlit capacitive touch
   - 0-9 digits
   - 4-8 digit PINs
   - Multiple user codes
   - Temporary codes (time-limited)

3. **Biometric Scanner**
   - Optical or capacitive fingerprint sensor
   - 99.9% recognition accuracy
   - Up to 100 fingerprints stored
   - Anti-spoofing technology
   - Works with gloves (optional upgrade)

4. **Mobile App Control**
   - Bluetooth unlock (proximity-based)
   - Remote unlock via internet
   - Access sharing
   - Real-time notifications
   - Geofencing capabilities

5. **Emergency Failsafe**
   - Mechanical override key (hidden slot)
   - Interior safety release (always accessible)
   - Emergency services master key
   - Battery backup access

### Electronics & Power

**Microcontroller:**
- ARM Cortex-M4 120MHz
- Low-power optimized
- Secure boot capability
- Encrypted storage

**Power System:**
- **Primary**: 12V DC from EcoFlow DELTA 2
  - Continuous power when POD is operational
  - Smart power management
- **Backup**: Internal 3.7V 5000mAh Li-ion battery
  - 36-48 hours runtime
  - Rechargeable via POD power
  - Low battery alerts
  - Emergency reserve mode

**Connectivity Modules:**
- **WiFi**: 2.4GHz (IEEE 802.11 b/g/n)
  - Platform communication
  - OTA updates
  - Remote management
- **Bluetooth**: BLE 5.0
  - Mobile app pairing
  - Proximity unlock
  - Low energy consumption
- **Optional LoRa**: Long-range mesh networking
  - Multi-POD deployments
  - Emergency communications
  - Extended range (10+ km)

---

## 3. Software Specifications

### Embedded Firmware

**Operating System:**
- Real-time OS with secure boot
- Cryptographically signed firmware
- Tamper detection
- Rollback protection

**Security Features:**
- **Encryption**: AES-256 for local data storage
  - PIN codes (hashed)
  - Biometric templates (hashed, not images)
  - Access logs
  - Configuration data
- **OTA Updates**: Over-the-air firmware updates
  - Signed update packages
  - Automatic rollback on failure
  - Scheduled update windows
  - Manual update approval option

**Local Processing:**
- Biometric matching (on-device)
- PIN validation (local)
- Access decision logic
- Emergency protocols
- Offline operation capability

### Cloud & Platform Integration

**Communication Protocols:**
- **RESTful API**: Standard HTTP/HTTPS endpoints
- **WebSocket**: Real-time bidirectional communication
- **MQTT**: Lightweight messaging for IoT
- **TLS 1.3**: End-to-end encryption
- **Mutual Authentication**: Certificate-based validation

**SHELTR Platform Dashboard:**

**Real-Time Control:**
- Door lock/unlock commands
- Access code management
- User permission management
- Emergency lockdown
- Temporary access grants

**Monitoring & Logging:**
- Access event logs
  - Timestamp
  - Access method (QR, PIN, biometric, app)
  - User identification
  - Success/failure status
- Battery status monitoring
- Connectivity status
- Tamper alerts
- System health metrics

**Advanced Features:**
- **Geofencing**: Auto-unlock when authorized user approaches
  - Configurable radius
  - GPS/Bluetooth-based
  - Privacy-controlled
- **Access Scheduling**: Time-based access control
  - Recurring schedules
  - One-time access windows
  - Service provider access
- **Integration**: EcoFlow app integration
  - Power status correlation
  - Smart home automation
  - Energy-aware security

---

## 4. Connection Protocol & API

### Communication Flow

**Device Initialization:**
1. **Startup**: Lock powers on and performs self-test
2. **Authentication**: Authenticates to SHELTR platform using MQTT over TLS 1.3
3. **Registration**: Sends unique device ID + manufacturer-signed certificate
4. **Handshake**: Platform validates certificate and establishes secure session
5. **Sync**: Downloads latest configuration and access permissions
6. **Ready**: Lock enters operational mode

**Access Request Flow:**
1. **User Action**: QR scan, PIN entry, biometric, or app unlock
2. **Local Validation**: Lock validates credentials locally (offline capable)
3. **Platform Notification**: Event logged to platform (when online)
4. **Audit Trail**: Access event recorded with timestamp and method
5. **Response**: Lock actuates and confirms action

**Remote Control Flow:**
1. **Command Issued**: Admin/user issues lock/unlock via dashboard or app
2. **Authentication**: JWT token validated, permissions checked
3. **Secure Tunnel**: Command encrypted with AES-256, signed with HMAC-SHA256
4. **Device Receives**: Lock validates signature and executes command
5. **Confirmation**: Lock sends status confirmation to platform
6. **Notification**: User receives confirmation notification

### API Endpoints

**Lock Control:**
```
POST /api/v1/pods/{pod_id}/lock/unlock
Headers:
  Authorization: Bearer {JWT_TOKEN}
  Content-Type: application/json
Body:
  {
    "auth_token": "JWT",
    "timestamp": "ISO8601",
    "reason": "user_request|emergency|maintenance"
  }
Response:
  {
    "success": true,
    "state": "unlocked",
    "timestamp": "ISO8601",
    "battery_level": 85
  }
```

```
POST /api/v1/pods/{pod_id}/lock/lock
Headers:
  Authorization: Bearer {JWT_TOKEN}
  Content-Type: application/json
Body:
  {
    "auth_token": "JWT",
    "timestamp": "ISO8601"
  }
Response:
  {
    "success": true,
    "state": "locked",
    "timestamp": "ISO8601"
  }
```

**Status & Monitoring:**
```
GET /api/v1/pods/{pod_id}/lock/status
Headers:
  Authorization: Bearer {JWT_TOKEN}
Response:
  {
    "state": "locked|unlocked",
    "battery_level": 85,
    "connectivity": "online|offline",
    "last_event": {
      "timestamp": "ISO8601",
      "type": "unlock",
      "method": "qr_code",
      "user_id": "user_123"
    },
    "tamper_detected": false
  }
```

```
GET /api/v1/pods/{pod_id}/lock/access-log
Headers:
  Authorization: Bearer {JWT_TOKEN}
Query Parameters:
  ?start_date=ISO8601&end_date=ISO8601&limit=100
Response:
  {
    "events": [
      {
        "timestamp": "ISO8601",
        "type": "unlock|lock",
        "method": "qr_code|pin|biometric|app|key",
        "user_id": "user_123",
        "success": true
      }
    ],
    "total": 245,
    "page": 1
  }
```

---

## 5. Security Model

### Multi-Layered Security

**Access Control Hierarchy:**
1. **Primary Access**: QR code (platform-generated)
2. **Secondary Access**: PIN code or biometric
3. **Tertiary Access**: Mobile app (Bluetooth/internet)
4. **Emergency Access**: Mechanical key override
5. **Interior Release**: Always accessible from inside (safety)

**Security Features:**

**Tamper Protection:**
- **Physical Tampering**: Accelerometer detects forced entry attempts
- **Electronic Tampering**: Alerts on unauthorized access to electronics
- **Casing Intrusion**: Triggers immediate alert to platform
- **Wire Cutting**: Battery backup maintains security
- **Alarm**: Audible alarm on tamper detection (optional)

**Fail-Safe Design:**
- **Battery Dead**: Mechanical key override always functional
- **Connectivity Lost**: Local PIN/biometric access continues to work
- **Platform Offline**: Cached access permissions remain valid
- **Power Failure**: Battery backup maintains operation
- **Emergency**: Interior release always accessible (life safety)

**Privacy Protection:**
- **Biometric Data**: Stored as hashes, not images
- **Access Logs**: Encrypted at rest and in transit
- **User Control**: Users can disable remote access
- **Data Retention**: Configurable log retention periods
- **GDPR Compliant**: Right to deletion, data portability

### Flat-Pack Security Considerations

**During Transport:**
- **Component Security**: Tamper-evident packaging
- **Tracking**: GPS tracking of shipments
- **Inventory Control**: Serial number tracking
- **Quality Seals**: Factory-applied security seals
- **Documentation**: Chain of custody records

**During Assembly:**
- **Lock Installation**: Installed during panel assembly phase
- **Verification**: QR code scan to verify authentic components
- **Activation**: Lock activated only after full assembly
- **Testing**: Security system tested before handover
- **Certification**: Assembly completion certificate

**Post-Assembly:**
- **Initial Setup**: Secure pairing with platform
- **User Enrollment**: Biometric and PIN registration
- **Access Audit**: Initial access log review
- **Monitoring**: 24/7 security monitoring (optional)

---

## 6. Installation & Setup

### Physical Installation

**Mounting Process:**
1. **Door Preparation**: Pre-drilled mounting holes in door panel
2. **Backing Plate**: Reinforced steel plate installed inside door
3. **Lock Body**: Mounted through door with tamper-resistant fasteners
4. **Alignment**: Precision alignment with strike plate
5. **Testing**: Mechanical operation verified

**Power Integration:**
- **Primary Power**: Direct connection to EcoFlow DELTA 2 (12V)
- **Wiring**: Pre-wired harness with quick-connect
- **Backup Battery**: Internal battery charged via POD power
- **Power Management**: Smart charging, low-power standby mode

### Digital Setup & Provisioning

**Initial Pairing:**
1. **Bluetooth Pairing**: Lock pairs with SHELTR mobile app
2. **WiFi Configuration**: Connect to POD WiFi or local network
3. **Certificate Provisioning**: Unique TLS certificate installed
4. **Platform Registration**: Register in SHELTR platform
5. **Verification**: Test all access methods

**User Enrollment:**
1. **Admin Setup**: Primary user/admin account created
2. **Biometric Enrollment**: Fingerprints registered (up to 100)
3. **PIN Codes**: User PINs created (4-8 digits)
4. **QR Access**: Platform-generated QR codes assigned
5. **Mobile App**: App access configured

**Fleet Management:**
- **Dashboard Registration**: POD added to fleet management
- **Access Policies**: Organizational access rules applied
- **Monitoring**: Real-time monitoring enabled
- **Alerts**: Notification preferences configured
- **Backup**: Configuration backed up to platform

---

## 7. Emergency Protocols

### Emergency Access

**Emergency Services:**
- **Master Key**: Emergency services master key access
- **Remote Unlock**: Platform emergency override
- **Location Sharing**: GPS coordinates shared with emergency services
- **Communication**: Two-way communication capability (future)

**Panic Button Integration:**
- **Interior Panic Button**: Triggers emergency alert
- **GPS Broadcast**: Location sent to emergency contacts
- **Platform Alert**: Immediate notification to SHELTR platform
- **Emergency Services**: Optional automatic 911 dispatch
- **Beacon Activation**: Emergency beacon activated

**Power Failure:**
- **Battery Backup**: 36-48 hours of operation
- **Low Battery Alert**: Warnings at 20%, 10%, 5%
- **Emergency Reserve**: Final 5% reserved for emergency access
- **Mechanical Override**: Always available regardless of power

### Security Incidents

**Intrusion Detection:**
- **Forced Entry**: Accelerometer detects forced entry
- **Tamper Alert**: Immediate notification to user and platform
- **Video Recording**: Optional camera activation
- **Alarm**: Audible alarm (configurable)
- **Emergency Contact**: Automatic notification to emergency contacts

**Response Protocols:**
- **User Notification**: Push notification, SMS, email
- **Platform Alert**: Security team notified
- **Access Log**: Detailed incident log created
- **Video Evidence**: Camera footage preserved (if equipped)
- **Follow-up**: Incident review and response coordination

---

## 8. Compliance & Standards

### Security Standards

**Certifications:**
- **UL 10C**: Positive Pressure Fire Tests of Door Assemblies
- **ANSI/BHMA A156.25**: Electrified Locks and Exit Trim
- **FCC Part 15**: Wireless communication compliance
- **IC (Industry Canada)**: Wireless device certification
- **CE Marking**: European conformity (for international deployment)

**Data Security:**
- **SOC 2 Type II**: Platform security certification
- **ISO 27001**: Information security management
- **GDPR**: Data protection compliance
- **PIPEDA**: Canadian privacy law compliance
- **Encryption**: AES-256 for data at rest, TLS 1.3 for data in transit

### Privacy Compliance

**User Rights:**
- **Access**: Users can access their data
- **Deletion**: Right to delete personal data
- **Portability**: Data export capability
- **Consent**: Explicit consent for data collection
- **Transparency**: Clear privacy policy

**Data Handling:**
- **Minimization**: Collect only necessary data
- **Retention**: Configurable retention periods
- **Anonymization**: Personal data anonymized where possible
- **Audit**: Regular privacy audits
- **Breach Notification**: Timely notification of any breaches

---

## ✅ Summary

The SHELTR Model A flat-pack security system provides comprehensive protection through:

**Multi-Factor Authentication:**
- QR code, PIN, biometric, mobile app, mechanical key
- Layered security with local resilience
- Remote management capability

**Flat-Pack Considerations:**
- Secure transport and assembly protocols
- Tamper-evident packaging
- Component tracking and verification

**Platform Integration:**
- Real-time monitoring and control
- Comprehensive access logging
- Emergency response protocols

**Fail-Safe Design:**
- Local operation during connectivity loss
- Battery backup for power failures
- Mechanical override always available
- Interior safety release

**Privacy & Compliance:**
- GDPR and PIPEDA compliant
- Encrypted data storage and transmission
- User control over data and access

**This system ensures local resilience (PIN, biometric, failsafe key) with remote centralized control (web app, API). It's secure, scalable, and ready for deployment, integrating seamlessly with SHELTR's EcoFlow-powered ecosystem.** 🔒✨

---

## 📊 Document Information

| Property | Value |
|----------|-------|
| **Document Version** | 2.0 |
| **Last Updated** | December 11, 2025 |
| **Author** | SHELTR Security Team |
| **Status** | Current Security Specifications - Model A |
| **Review Cycle** | Quarterly |
| **Next Review** | March 1, 2026 |

### Revision History

| Version | Date | Changes | Author |
|---------|------|---------|--------|
| 2.0 | Dec 11, 2025 | **Major Update**: Added flat-pack security considerations, updated for single Model A focus, enhanced API documentation, added emergency protocols, compliance section | Security Team |
| 1.0 | Oct 2, 2025 | Initial security documentation | Security Team |

---

*For security questions or concerns, contact: security@sheltr.ai*
