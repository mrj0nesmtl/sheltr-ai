POD Security
Technical Documentation
Smart Locking & Access System

⸻

1. Overview

The SHELTR smart lock system integrates biometric authentication (fingerprint), numeric keypad entry, and remote control via central web application. Designed to complement the insulated SHELTR units, the system ensures both security and ease of use while maintaining a sleek, modern design.

⸻

2. Hardware Specifications

Lock Body & Materials
	•	Casing: Powder-coated aluminum alloy (corrosion- and scratch-resistant)
	•	Handle: Stainless steel (black anodized finish for durability)
	•	Weatherproofing: IP65-rated enclosure (suitable for outdoor winter use, including snow/ice)

Authentication Modes
	•	Keypad: Backlit capacitive touch, 0–9 digits, 4–8 digit PINs
	•	Biometric Scanner: Optical or capacitive fingerprint sensor with 99.9% recognition accuracy
	•	Failsafe: Emergency mechanical override key (hidden slot)

Electronics
	•	Microcontroller: ARM Cortex-M4 120MHz, low-power optimized
	•	Power: 12V DC (connected to unit’s solar/battery system)
	•	Backup Power: Internal 3.7V 5000mAh Li-ion rechargeable backup battery (36–48 hrs runtime)
	•	Connectivity Modules:
	•	WiFi 2.4GHz (IEEE 802.11 b/g/n)
	•	Bluetooth Low Energy (BLE 5.0)
	•	Optional LoRa for long-range mesh networking in urban clusters

⸻

3. Software Specifications

Embedded Firmware
	•	Real-time OS with secure boot
	•	AES-256 encryption for local data (PINs, biometric hashes)
	•	OTA (over-the-air) firmware update capability

Cloud & Web App Integration
	•	RESTful API + WebSocket communication for live status & remote unlock/lock
	•	End-to-end TLS 1.3 encrypted sessions with mutual certificate authentication
	•	Web app dashboard supports:
	•	Door lock/unlock (real-time control)
	•	Access logs (PIN entries, biometric scans, remote unlock events)
	•	Battery status & alerts
	•	Geofencing (optional) — lock auto-disengage when authorized user approaches

⸻

4. Connection Protocol

Communication Flow
	1.	Device Startup: Lock authenticates to central server using MQTT over TLS 1.3
	2.	Registration: Device sends unique ID + certificate signed by manufacturer CA
	3.	Web App Command: Admin issues LOCK or UNLOCK via dashboard
	4.	Secure Tunnel: Command is encrypted with AES-256, signed with HMAC-SHA256
	5.	Device Response: Lock actuates mechanism and sends confirmation packet

API Endpoints
	•	POST /api/v1/lock/{device_id}/unlock
	•	Payload: { "auth_token": "JWT", "timestamp": "ISO8601" }
	•	POST /api/v1/lock/{device_id}/lock
	•	Payload: { "auth_token": "JWT", "timestamp": "ISO8601" }
	•	GET /api/v1/lock/{device_id}/status
	•	Response: { "state": "locked/unlocked", "battery": "%", "last_event": "timestamp" }

⸻

5. Security Model
	•	Multi-factor access: PIN + biometric OR remote app unlock
	•	Tamper protection: Lock triggers alert to central web app if casing is pried open
	•	Fail-safe design:
	•	If battery is dead, lock defaults to mechanical key override
	•	If connectivity is lost, local PIN/biometric access still functions

⸻

6. Installation Notes
	•	Mounting: Reinforced steel backing plate installed inside SHELTR door panel
	•	Power Routing: Direct connection to unit’s 12V system with solar recharge integration
	•	Setup:
	1.	Pair lock with central app via BLE
	2.	Provision unique TLS certificate
	3.	Register in fleet management dashboard

⸻

✅ Summary:
This system ensures local resilience (PIN, biometric, failsafe key) with remote centralized control (web app, API). It’s secure, scalable, and ready for urban deployment, integrating seamlessly with SHELTR’s solar-battery ecosystem.
