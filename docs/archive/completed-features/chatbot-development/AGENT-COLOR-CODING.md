# Agent Color Coding System

**Date:** October 15, 2025  
**Feature:** Color-coded agent badges  
**Style:** Outline (no fill)

---

## 🎨 Color Palette

### Agent Colors:

| Agent | Color | Border Class | Text Class | Visual |
|-------|-------|--------------|------------|--------|
| **General Assistant** | 🔵 Blue | `border-blue-500` | `text-blue-600` | Blue outline |
| **SHELTR Support** | 🟢 Green | `border-green-500` | `text-green-600` | Green outline |
| **Technical Expert** | 🟣 Purple | `border-purple-500` | `text-purple-600` | Purple outline |
| **Business Analyst** | 🟠 Orange | `border-orange-500` | `text-orange-600` | Orange outline |
| **Creative Writer** | 🩷 Pink | `border-pink-500` | `text-pink-600` | Pink outline |
| **Unknown/Fallback** | ⚪ Gray | `border-gray-500` | `text-gray-600` | Gray outline |

### Dark Mode:
All colors have dark mode variants using `dark:text-[color]-400` for better contrast on dark backgrounds.

---

## 💡 Design Rationale

### Why These Colors?

1. **Blue (General):**
   - Universal, trustworthy, accessible
   - Default/general purpose feel
   - Most commonly used agent

2. **Green (SHELTR Support):**
   - Positive, helpful, supportive
   - Platform-specific assistance
   - Aligns with growth/progress

3. **Purple (Technical Expert):**
   - Technical, sophisticated, expert
   - Premium, advanced knowledge
   - Distinguishes technical content

4. **Orange (Business Analyst):**
   - Strategic, energetic, analytical
   - Business/professional focus
   - Stands out for important data

5. **Pink (Creative Writer):**
   - Creative, expressive, artistic
   - Storytelling and content
   - Feminine/emotional intelligence

---

## 📐 Implementation

### Code Location:
**File:** `apps/web/src/app/dashboard/chatbots/page.tsx`

### Color Mapping Object:
```typescript
const agentColors: Record<string, string> = {
  'general': 'border-blue-500 text-blue-600 dark:text-blue-400',
  'sheltr_support': 'border-green-500 text-green-600 dark:text-green-400',
  'technical_expert': 'border-purple-500 text-purple-600 dark:text-purple-400',
  'business_analyst': 'border-orange-500 text-orange-600 dark:text-orange-400',
  'creative_writer': 'border-pink-500 text-pink-600 dark:text-pink-400',
};
```

### Helper Function:
```typescript
const getAgentColorClass = (agentType: string): string => {
  return agentColors[agentType] || 'border-gray-500 text-gray-600 dark:text-gray-400';
};
```

### Usage in Components:
```tsx
<Badge variant="outline" className={`text-xs ${getAgentColorClass(session.agent_type)}`}>
  {session.agent_type}
</Badge>
```

---

## 🎯 Where Colors Appear

### 1. Session List Sidebar
**Location:** Left sidebar, each session card

**Visual:**
```
┌─────────────────────────────────────┐
│ Blockchain Architecture Basics      │
│ Certainly! Here's a simplified...   │
│                                     │
│ [technical_expert] [2 messages]    │
│    🟣 Purple                        │
└─────────────────────────────────────┘
```

### 2. Chat Header
**Location:** Top of chat area when session is selected

**Visual:**
```
┌─────────────────────────────────────┐
│ Blockchain Architecture Basics      │
│ [technical_expert] [gpt-4o-mini]   │
│    🟣 Purple                        │
└─────────────────────────────────────┘
```

---

## ✨ Visual Examples

### Session List with All Agents:

```
Chat Sessions
─────────────────────────────────────

Blockchain Architecture Basics
[technical_expert 🟣] [2 messages]

Housing Investment ROI Analysis  
[business_analyst 🟠] [2 messages]

Covenant House Outreach Letter
[creative_writer 🩷] [2 messages]

QR Code Implementation Guide
[sheltr_support 🟢] [2 messages]

SHELTR Platform Overview
[general 🔵] [2 messages]
```

---

## 🎨 Tailwind CSS Classes Used

### Border Colors:
- `border-blue-500` → #3b82f6
- `border-green-500` → #22c55e
- `border-purple-500` → #a855f7
- `border-orange-500` → #f97316
- `border-pink-500` → #ec4899
- `border-gray-500` → #6b7280

### Text Colors (Light Mode):
- `text-blue-600` → #2563eb
- `text-green-600` → #16a34a
- `text-purple-600` → #9333ea
- `text-orange-600` → #ea580c
- `text-pink-600` → #db2777
- `text-gray-600` → #4b5563

### Text Colors (Dark Mode):
- `dark:text-blue-400` → #60a5fa
- `dark:text-green-400` → #4ade80
- `dark:text-purple-400` → #c084fc
- `dark:text-orange-400` → #fb923c
- `dark:text-pink-400` → #f472b6
- `dark:text-gray-400` → #9ca3af

---

## ♿ Accessibility

### Color Contrast:
- ✅ All colors meet WCAG AA standards
- ✅ Dark mode variants optimized for contrast
- ✅ Outline style doesn't rely solely on color
- ✅ Agent name text always visible

### Color Blindness Considerations:
- 🟢 Green (SHELTR Support) vs 🟠 Orange (Business Analyst) - Distinguishable
- 🔵 Blue (General) vs 🟣 Purple (Technical Expert) - Distinguishable
- 🩷 Pink (Creative Writer) - Unique hue
- ⚪ Gray (Fallback) - Neutral

---

## 🚀 Future Enhancements

### Potential Additions:

1. **Custom Agent Colors:**
   - Allow admins to customize agent colors
   - Save preferences in user settings

2. **Color Legends:**
   - Add legend/key in settings panel
   - Tooltip on hover explaining agent type

3. **Agent Icons:**
   - Add unique icons alongside colors
   - Enhance visual identification

4. **Gradient Badges:**
   - Subtle gradients for premium feel
   - Maintain outline style

5. **Color Themes:**
   - Alternative color schemes
   - High contrast mode
   - Monochrome option

---

## 📊 User Experience Impact

### Benefits:

✅ **Quick Identification:**
- Glance at sidebar, instantly know agent types
- No need to read text labels

✅ **Visual Organization:**
- Group sessions by color mentally
- Easier to find specific agent conversations

✅ **Professional Appearance:**
- Clean, modern design
- Consistent branding
- Polished UI

✅ **Better UX:**
- Reduces cognitive load
- Faster navigation
- More engaging interface

---

## 🔧 Maintenance

### Adding New Agents:

1. Add to `agentColors` object:
```typescript
'new_agent_id': 'border-[color]-500 text-[color]-600 dark:text-[color]-400',
```

2. Choose from available Tailwind colors:
- cyan, teal, indigo, violet, fuchsia, rose, lime, emerald, sky, amber

3. Test in light and dark mode

4. Ensure accessibility (contrast checker)

---

## 📝 Related Files

- `apps/web/src/app/dashboard/chatbots/page.tsx` - Main implementation
- `apps/web/src/components/ui/badge.tsx` - Badge component
- `tailwind.config.js` - Color configuration

---

**Status:** ✅ LIVE  
**Version:** 1.0  
**Last Updated:** October 15, 2025

