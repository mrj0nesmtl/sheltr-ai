# EcoFlow DELTA 2 Integration Guide

**Power System Integration for SHELTR Model A**

*Version: 1.0 | Updated: December 11, 2025*

---

## 🎯 Overview

The SHELTR Model A integrates the EcoFlow DELTA 2 portable power station as its primary power system. This partnership delivers reliable, expandable, off-grid power with smart monitoring and control capabilities.

**Why EcoFlow DELTA 2?**
- ✅ 1kWh capacity (expandable to 3kWh)
- ✅ 1800W continuous output (3600W surge)
- ✅ LiFePO4 battery (3000+ cycles, 10-year lifespan)
- ✅ Fast charging (80% in 1 hour)
- ✅ Mobile app control and monitoring
- ✅ 5-year warranty
- ✅ Multiple output ports (AC, USB-C, USB-A, 12V DC)
- ✅ Solar MPPT controller built-in

---

## 📊 EcoFlow DELTA 2 Specifications

### Core Specifications

| Specification | Value | Notes |
|---------------|-------|-------|
| **Capacity** | 1024Wh (1kWh) | Expandable to 3072Wh with Extra Battery |
| **Battery Type** | LiFePO4 (Lithium Iron Phosphate) | Safer, longer lifespan than Li-ion |
| **Cycle Life** | 3000+ cycles to 80% capacity | ~10 years of daily use |
| **Weight** | 27 lbs (12 kg) | Portable yet substantial capacity |
| **Dimensions** | 15.7 × 8.3 × 11 inches | Compact footprint |
| **Operating Temp** | -4°F to 113°F (-20°C to 45°C) | Suitable for Canadian winters |
| **Warranty** | 5 years standard | Extended warranty available |

### Output Specifications

**AC Output:**
- **Ports**: 4× 120V outlets
- **Continuous Power**: 1800W total
- **Surge Power**: 3600W (2× continuous)
- **Waveform**: Pure sine wave
- **Frequency**: 60Hz

**USB-C Output:**
- **Ports**: 2× USB-C PD (Power Delivery)
- **Power**: 100W per port
- **Use Cases**: Laptop charging, tablets, phones

**USB-A Output:**
- **Ports**: 4× USB-A
- **Power**: Standard 5V/2.4A per port
- **Use Cases**: Phone charging, small devices

**12V DC Output:**
- **Ports**: 2× car socket outlets
- **Power**: 126W total (10.5A)
- **Use Cases**: 12V appliances, car accessories

**Wireless Charging:**
- **Power**: 15W
- **Location**: Top surface of unit
- **Use Cases**: Qi-compatible phones

### Input Specifications

**AC Charging:**
- **Input**: 120V AC wall outlet
- **Charging Speed**: 1200W X-Stream technology
- **Time to 80%**: 50 minutes
- **Time to 100%**: 70 minutes

**Solar Charging:**
- **Input**: 11-60V DC, 500W max
- **MPPT Controller**: Built-in (Maximum Power Point Tracking)
- **Time to 100%**: 3-6 hours (with 400W panels, full sun)
- **Compatibility**: EcoFlow solar panels or third-party (within voltage range)

**Car Charging:**
- **Input**: 12V/24V DC car socket
- **Charging Speed**: 100W
- **Time to 100%**: ~10 hours
- **Use Cases**: Charging while traveling

**Dual Charging:**
- **Capability**: AC + Solar simultaneously
- **Combined Input**: Up to 1700W
- **Time to 100%**: ~40 minutes

---

## 🔌 SHELTR Integration Architecture

### Physical Integration

**Mounting Location:**
- **Position**: Entry area, easily accessible
- **Mounting**: Custom bracket integrated into POD structure
- **Access**: Front-facing for easy monitoring and port access
- **Ventilation**: Adequate airflow for cooling
- **Protection**: Secured against movement during transport

**Electrical Connections:**
- **Solar Input**: Pre-wired harness from rooftop solar panels
- **POD Distribution**: Connection to POD electrical harness
- **Lighting**: Direct connection to LED lighting circuits
- **Smart Lock**: 12V DC power for smart lock system
- **Water Pump**: 12V DC power for water pump

### Solar Panel Integration

**400W Rooftop Array:**
- **Configuration**: 2× 200W monocrystalline panels
- **Mounting**: Integrated into roof panel design
- **Wiring**: Pre-wired harness with weather-sealed connectors
- **Connection**: Plug directly into DELTA 2 solar input
- **Tilt**: Adjustable mounting for optimal angle
- **Weather Rating**: IP67 waterproof

**Solar Optimization:**
- MPPT controller automatically optimizes charging
- Tilt-adjustable mounting for seasonal optimization
- Weather-resistant connections
- Bypass diodes prevent shading losses
- Monitoring via EcoFlow app

### Power Distribution

**POD Electrical System:**
```
EcoFlow DELTA 2
├── AC Outlets (4× 120V)
│   ├── Interior outlets (2× general use)
│   ├── Desk outlet (1× work area)
│   └── Entry outlet (1× charging station)
├── USB-C Ports (2× 100W)
│   ├── Desk area (laptop charging)
│   └── Bedside (device charging)
├── USB-A Ports (4× standard)
│   ├── Desk area (2× devices)
│   └── Entry area (2× devices)
├── 12V DC Outlets (2× car socket)
│   ├── Smart lock power
│   └── Water pump power
├── Wireless Charging (15W)
│   └── Bedside area
└── LED Lighting (12V)
    ├── Overhead lighting (2 zones)
    └── Task lighting (desk area)
```

---

## 📱 EcoFlow Mobile App

### App Features

**Real-Time Monitoring:**
- Battery level (percentage and Wh remaining)
- Input power (solar, AC, car)
- Output power (total and per device)
- Estimated runtime based on current load
- Charging time remaining
- Temperature monitoring

**Power Management:**
- Remote power on/off
- AC outlet control (individual or all)
- USB port control
- 12V DC outlet control
- Charging speed adjustment
- Power saving modes

**Energy Analytics:**
- Daily energy consumption
- Weekly/monthly trends
- Solar generation tracking
- Charging history
- Cost savings calculator
- Carbon offset tracking

**System Settings:**
- AC frequency (50Hz/60Hz)
- Charging speed limit
- Discharge limit (battery protection)
- Screen brightness
- Beep volume
- Auto power off timer

**Firmware Updates:**
- OTA (Over-The-Air) updates
- Automatic update notifications
- Update history
- Feature additions via firmware

### App Setup for SHELTR POD

**Initial Setup:**
1. Download EcoFlow app (iOS/Android)
2. Create EcoFlow account
3. Power on DELTA 2
4. Connect to DELTA 2 WiFi (temporary)
5. Add device to app
6. Connect DELTA 2 to POD WiFi or mobile hotspot
7. Name device (e.g., "SHELTR POD #123")
8. Configure preferences

**Integration with SHELTR Platform:**
- EcoFlow app operates independently
- SHELTR platform can access power data via API (future feature)
- Users manage power via EcoFlow app
- SHELTR platform monitors for maintenance alerts

---

## 🔋 Power Management Best Practices

### Daily Operation

**Optimal Usage:**
- Monitor battery level via app
- Charge during peak sun hours
- Use AC power for high-wattage devices
- Use USB-C for laptops (more efficient than AC)
- Use 12V DC for compatible devices (most efficient)
- Disable unused outlets to reduce standby power

**Load Management:**
- Total continuous load: 1800W max
- Surge capacity: 3600W (brief periods)
- Typical POD load: 200-400W (lights, devices, laptop)
- High-load devices: Space heater (1500W), A/C (900W)
- Avoid running multiple high-load devices simultaneously

**Battery Health:**
- Keep battery between 20-80% for longest lifespan
- Full discharge/charge cycles occasionally (monthly)
- Avoid extreme temperatures when possible
- Store at 50-60% charge if not in use for extended periods

### Solar Charging Optimization

**Maximizing Solar Input:**
- Clean solar panels regularly (dust, snow, debris)
- Adjust tilt angle seasonally
  - Summer: Lower angle (panels more horizontal)
  - Winter: Higher angle (panels more vertical)
- Avoid shading on panels
- Monitor solar input via app
- Charge during peak sun hours (10am-2pm typically)

**Expected Solar Performance:**
- **Full Sun (400W panels)**: 300-400W input, 3-6 hours to full charge
- **Partial Sun/Clouds**: 100-200W input, 8-12 hours to full charge
- **Overcast**: 50-100W input, 12+ hours to full charge
- **Winter/Low Sun**: 100-250W input, 6-10 hours to full charge

### Extreme Weather Operation

**Cold Weather (-20°C / -4°F):**
- Battery performance reduced ~20% in extreme cold
- Keep DELTA 2 inside POD (insulated environment)
- Charging slower in cold temperatures
- Battery self-heating during use improves performance
- Consider Arctic Package upgrade for enhanced heating

**Hot Weather (+40°C / 104°F):**
- DELTA 2 has built-in cooling fan
- Ensure adequate ventilation around unit
- Avoid direct sunlight on unit
- Performance may be reduced if overheating
- Unit will shut down if too hot (safety feature)

---

## 🔧 Installation & Setup

### Physical Installation (During POD Assembly)

**Step 1: Mounting Bracket Installation**
- Bracket pre-installed during POD assembly
- Location: Entry area, wall-mounted
- Height: Accessible standing height
- Secure to frame structure

**Step 2: DELTA 2 Installation**
- Slide DELTA 2 into mounting bracket
- Secure with retention strap or clips
- Verify unit is stable and level
- Ensure ventilation clearance (3" minimum)

**Step 3: Solar Panel Connection**
- Locate pre-wired solar harness
- Connect to DELTA 2 solar input port (XT60 connector)
- Verify connection is secure
- Check polarity (connector is keyed)

**Step 4: POD Electrical Harness**
- Connect POD electrical harness to DELTA 2 outputs
- AC outlets: Connect to POD outlet distribution
- 12V DC: Connect to smart lock and water pump
- LED lighting: Connect to lighting circuits
- Verify all connections secure

**Step 5: Testing**
- Power on DELTA 2
- Verify solar input (if sunny)
- Test all AC outlets
- Test USB ports
- Test 12V DC outputs
- Test LED lighting
- Verify app connectivity

### Digital Setup

**EcoFlow App Configuration:**
1. Download and install EcoFlow app
2. Create account or log in
3. Power on DELTA 2
4. Add device via app
5. Connect to WiFi (POD WiFi or mobile hotspot)
6. Name device appropriately
7. Configure settings:
   - AC frequency: 60Hz (North America)
   - Charging speed: Standard or Fast
   - Screen brightness: Medium
   - Beep volume: Low or Off
   - Auto power off: 12 hours

**User Training:**
- Show user how to monitor battery level
- Demonstrate charging via solar and AC
- Explain load management
- Show how to control outlets via app
- Review safety features and protections

---

## 🛠️ Maintenance & Troubleshooting

### Regular Maintenance

**Monthly:**
- Clean solar panels (water and soft cloth)
- Inspect solar panel connections
- Check DELTA 2 ventilation (clear any dust)
- Verify firmware is up to date
- Review energy usage patterns

**Quarterly:**
- Deep clean solar panels
- Inspect all electrical connections
- Test all outlets and ports
- Verify battery health via app
- Full discharge/charge cycle

**Annually:**
- Professional inspection (recommended)
- Solar panel performance testing
- Battery capacity testing
- Firmware and software updates
- Warranty registration verification

### Common Issues & Solutions

**Issue: DELTA 2 Not Charging from Solar**
- **Check**: Solar panels clean and unshaded
- **Check**: Solar connections secure
- **Check**: Solar input voltage (11-60V DC)
- **Check**: DELTA 2 solar input enabled in app
- **Solution**: Clean panels, verify connections, check app settings

**Issue: Low Solar Input**
- **Check**: Panel orientation and tilt
- **Check**: Shading on panels
- **Check**: Weather conditions (clouds reduce output)
- **Check**: Panel cleanliness
- **Solution**: Adjust tilt, clean panels, wait for better sun

**Issue: Battery Draining Quickly**
- **Check**: High-load devices running
- **Check**: Unused outlets left on
- **Check**: Extreme temperature conditions
- **Check**: Battery health in app
- **Solution**: Reduce load, disable unused outlets, check battery health

**Issue: DELTA 2 Overheating**
- **Check**: Ventilation around unit
- **Check**: High ambient temperature
- **Check**: Continuous high-load operation
- **Solution**: Improve ventilation, reduce load, allow cooling period

**Issue: App Not Connecting**
- **Check**: DELTA 2 powered on
- **Check**: WiFi connection
- **Check**: App permissions (location, Bluetooth)
- **Check**: Firmware version
- **Solution**: Restart DELTA 2, check WiFi, update app/firmware

### Warranty & Support

**EcoFlow Warranty:**
- **Standard**: 5 years on DELTA 2
- **Coverage**: Manufacturing defects, battery capacity
- **Exclusions**: Physical damage, misuse, unauthorized modifications
- **Registration**: Register product via app for full warranty

**SHELTR Support:**
- **Technical Support**: pods-support@sheltr.ai
- **Phone**: 1-800-SHELTR-POD
- **EcoFlow Direct**: support.ecoflow.com
- **Emergency**: 1-800-SHELTR-911

---

## 📈 Expansion Options

### EcoFlow Extra Battery

**Specifications:**
- **Capacity**: 1024Wh (doubles total capacity to 2048Wh)
- **Connection**: Plug-and-play expansion port
- **Weight**: 23 lbs (10.5 kg)
- **Cost**: ~$1,000 CAD

**Benefits:**
- Doubles runtime
- Ideal for high-energy users
- Better for winter operation (more reserve)
- Supports longer off-grid periods

### EcoFlow DELTA Pro Upgrade

**Specifications:**
- **Capacity**: 3600Wh (3.6kWh)
- **Output**: 3600W continuous (7200W surge)
- **Expandable**: Up to 25kWh with additional batteries
- **Cost**: ~$3,500 CAD

**When to Upgrade:**
- Need for higher power output
- Running multiple high-load devices
- Extended off-grid operation
- Extreme weather conditions
- Multiple POD connections (future)

### Additional Solar Panels

**400W to 800W Upgrade:**
- Add 2 more 200W panels (total 800W)
- Faster charging in all conditions
- Better winter performance
- Requires additional mounting hardware

---

## 📊 Energy Calculations

### Daily Energy Budget (1kWh DELTA 2)

**Typical POD Daily Usage:**
```
LED Lighting (4 hours): 20W × 4h = 80Wh
Laptop Charging (8 hours): 65W × 8h = 520Wh
Phone Charging (2 devices): 10W × 2h = 20Wh
Water Pump (30 min): 60W × 0.5h = 30Wh
Smart Lock: 5W × 24h = 120Wh
Miscellaneous: 50Wh
-------------------------------------------
Total Daily Usage: ~820Wh
```

**With 400W Solar (Full Sun, 5 hours):**
```
Solar Generation: 400W × 5h × 0.85 efficiency = 1700Wh
Daily Usage: 820Wh
Net Surplus: +880Wh (battery stays charged)
```

**Winter/Cloudy (2 hours equivalent sun):**
```
Solar Generation: 400W × 2h × 0.85 = 680Wh
Daily Usage: 820Wh
Net Deficit: -140Wh (need occasional AC charging)
```

### High-Load Scenarios

**Scenario 1: Space Heater (Winter)**
```
Space Heater: 1500W × 4h = 6000Wh
Standard Usage: 820Wh
Total: 6820Wh per day
-------------------------------------------
Requires: Extra Battery + frequent AC charging
OR: Reduce heater usage to 2-3 hours/day
```

**Scenario 2: Air Conditioning (Summer)**
```
A/C Unit: 900W × 6h = 5400Wh
Standard Usage: 820Wh
Total: 6220Wh per day
-------------------------------------------
Solar (summer, 6 hours): 400W × 6h × 0.85 = 2040Wh
Deficit: -4180Wh (need AC charging or Extra Battery)
```

---

## 🌍 Environmental Impact

### Carbon Offset

**Solar Energy Generation:**
- **Annual Solar Generation**: ~500-700 kWh (depending on location)
- **Grid Electricity Offset**: ~500-700 kWh/year
- **CO2 Reduction**: ~300-400 kg CO2/year
- **Equivalent**: Planting 15-20 trees per year

**Battery Lifecycle:**
- **LiFePO4 Chemistry**: Safer, more sustainable than Li-ion
- **Cycle Life**: 3000+ cycles = 10+ years of daily use
- **Recyclability**: Battery components recyclable
- **End-of-Life**: EcoFlow recycling program available

---

## 📞 Support & Resources

### Documentation
- **EcoFlow User Manual**: Included with DELTA 2
- **EcoFlow App**: iOS and Android
- **EcoFlow Website**: https://ca.ecoflow.com/
- **SHELTR Integration Guide**: This document

### Contact
- **EcoFlow Support**: support.ecoflow.com
- **SHELTR Technical Support**: pods-support@sheltr.ai
- **Emergency**: 1-800-SHELTR-911

### Online Resources
- **EcoFlow Community**: community.ecoflow.com
- **SHELTR Community**: community.sheltr.ai
- **Video Tutorials**: sheltr.ai/ecoflow-tutorials

---

## 📊 Document Information

| Property | Value |
|----------|-------|
| **Document Version** | 1.0 |
| **Last Updated** | December 11, 2025 |
| **Author** | SHELTR Engineering Team |
| **Partnership** | EcoFlow Technology |
| **Review Cycle** | Quarterly |
| **Next Review** | March 1, 2026 |

---

**The EcoFlow DELTA 2 integration brings reliable, expandable, smart power to the SHELTR Model A. Together, we're powering the future of emergency housing.** ⚡🏠✨

*For questions about EcoFlow integration, contact: ecoflow-support@sheltr.ai*

