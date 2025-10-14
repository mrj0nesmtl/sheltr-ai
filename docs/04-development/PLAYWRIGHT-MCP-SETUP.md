# Playwright MCP Server Setup Guide

## Overview
The Playwright Model Context Protocol (MCP) server enables powerful browser automation and API testing capabilities directly within Cursor AI. This allows AI agents to interact with web pages, perform E2E testing, and validate API endpoints.

**Reference**: [Playwright MCP Documentation](https://executeautomation.github.io/mcp-playwright/docs/intro)

## What Can Playwright MCP Do?

### 🌐 Browser Automation
- Enable LLMs to interact with web pages in real browser environments
- Execute JavaScript and navigate web elements
- Take screenshots and perform visual testing
- Test across multiple browser engines: Chromium, Firefox, WebKit

### 🧪 API Testing
- Seamlessly handle API endpoint testing
- Validate REST APIs (GET, POST, PUT, PATCH, DELETE)
- Ensure reliability and proper responses
- Test authentication and authorization flows

### 🎯 Advanced Features
- **Code Generation**: Record browser interactions and generate Playwright test code
- **Multi-Browser**: Switch between Chromium, Firefox, and WebKit
- **Content Extraction**: Get visible text and HTML from pages
- **File Upload**: Automate file upload testing
- **PDF Export**: Save pages as PDFs
- **Console Logs**: Capture browser console output
- **iFrame Support**: Interact with iFramed content
- **Drag & Drop**: Test drag-and-drop interactions

## Installation

### Step 1: Install Playwright MCP Server Globally

```bash
npm install -g @executeautomation/playwright-mcp-server
```

### Step 2: Configure Cursor MCP Settings

Edit `~/.cursor/mcp.json` (global Cursor configuration):

```json
{
  "mcpServers": {
    "firebase": {
      "command": "npx",
      "args": ["-y", "firebase-tools@latest", "experimental:mcp"]
    },
    "playwright": {
      "command": "npx",
      "args": ["-y", "@executeautomation/playwright-mcp-server"]
    }
  }
}
```

**Note**: This is your **global Cursor MCP configuration** located at `~/.cursor/mcp.json` (Mac/Linux) or `%APPDATA%\.cursor\mcp.json` (Windows). This makes both Firebase and Playwright MCP servers available across all your projects.

### Step 3: Restart Cursor

After adding the configuration:
1. Save the `~/.cursor/mcp.json` file
2. **Completely quit Cursor** (Cmd+Q on Mac, not just close the window)
3. Reopen Cursor
4. Both Firebase and Playwright MCP servers should now show green lights in **Cursor Settings > Tools & MCP**

## Verification

To verify the installation is working, ask the AI:

```
Can you navigate to https://sheltr.org and take a screenshot?
```

The AI should be able to:
1. Launch a browser
2. Navigate to the URL
3. Capture and save a screenshot

## Common Use Cases for SHELTR Project

### 1. End-to-End Testing
```
Test the complete donation flow:
1. Navigate to /scan-give
2. Select a participant
3. Enter donation amount
4. Verify SmartFund breakdown
5. Take screenshots at each step
```

### 2. Visual Regression Testing
```
Take screenshots of all major pages and compare them:
- Homepage
- About page
- Solutions page
- Donation flow
- Dashboard views
```

### 3. API Endpoint Testing
```
Test the backend API endpoints:
- GET /api/v1/donations/active-donation-targets
- POST /api/chatbot/public
- GET /api/v1/shelters
Verify responses and status codes
```

### 4. Responsive Design Testing
```
Test pages at different viewport sizes:
- Mobile (375px)
- Tablet (768px)
- Desktop (1920px)
Take screenshots and verify layouts
```

### 5. Form Validation Testing
```
Test the contact form:
1. Navigate to /contact
2. Try submitting with empty fields
3. Verify validation messages
4. Submit with valid data
5. Verify success message
```

### 6. Chatbot Interaction Testing
```
Test the public chatbot:
1. Open chatbot on homepage
2. Send test messages
3. Verify responses
4. Check conversation starters
5. Verify no persistent history for public users
```

## Available Playwright Tools

According to the [Playwright MCP documentation](https://executeautomation.github.io/mcp-playwright/docs/playwright-web/Supported-Tools), the following tools are available:

### Navigation
- `playwright_navigate` - Navigate to URLs with browser type selection
- `playwright_go_back` - Navigate back in history
- `playwright_go_forward` - Navigate forward in history

### Interaction
- `playwright_click` - Click elements
- `playwright_fill` - Fill input fields
- `playwright_select` - Select dropdown options
- `playwright_hover` - Hover over elements
- `playwright_drag` - Drag and drop
- `playwright_press_key` - Press keyboard keys
- `playwright_upload_file` - Upload files

### Content Extraction
- `playwright_screenshot` - Take screenshots
- `playwright_get_visible_text` - Extract visible text
- `playwright_get_visible_html` - Get page HTML
- `playwright_save_as_pdf` - Save page as PDF

### Browser Control
- `playwright_console_logs` - Get console logs
- `playwright_close` - Close browser

### Advanced Features
- `playwright_click_and_switch_tab` - Click and switch to new tab
- `playwright_iframe_fill` - Fill fields in iframes
- `playwright_custom_user_agent` - Set custom user agent

### Code Generation
- `start_codegen_session` - Start recording interactions
- `end_codegen_session` - Generate test code
- `get_codegen_session` - Get session info
- `clear_codegen_session` - Clear recording

### API Testing
- `playwright_api_get` - GET request
- `playwright_api_post` - POST request
- `playwright_api_put` - PUT request
- `playwright_api_patch` - PATCH request
- `playwright_api_delete` - DELETE request

## Example Prompts for Testing SHELTR

### Test Homepage
```
Navigate to http://localhost:3000 and:
1. Verify the hero section displays correctly
2. Check that all navigation links are present
3. Verify the chatbot button is visible
4. Take a full-page screenshot
```

### Test Donation Flow
```
Test the participant donation flow:
1. Navigate to http://localhost:3000/scan-give
2. Click on Michael Rodriguez's card
3. Verify the donation form appears
4. Enter $50 as donation amount
5. Verify SmartFund breakdown shows 80-15-5 split
6. Take screenshots at each step
```

### Test API Endpoints
```
Test the backend API:
1. GET http://localhost:8000/api/v1/donations/active-donation-targets
2. Verify response contains active_shelters and verified_participants
3. Check that Old Brewery Mission is in the list
4. Verify Michael Rodriguez is in the participants
5. Print the response structure
```

### Test Responsive Design
```
Test the about page on different devices:
1. Navigate to http://localhost:3000/about
2. Set viewport to mobile (375x667)
3. Take screenshot
4. Set viewport to tablet (768x1024)
5. Take screenshot
6. Set viewport to desktop (1920x1080)
7. Take screenshot
8. Compare layouts
```

## Troubleshooting

### MCP Server Not Showing Up
1. Verify `.cursor/mcp.json` is in the project root
2. Restart Cursor completely (quit and reopen)
3. Check the MCP server status in Cursor's settings

### Browser Not Launching
1. Ensure Playwright browsers are installed: `npx playwright install`
2. Check system permissions for browser execution
3. Try specifying a different browser type (chromium, firefox, webkit)

### Screenshots Not Saving
1. Check file permissions in the project directory
2. Specify an absolute path for screenshot saving
3. Verify the directory exists before saving

## Best Practices

1. **Always Close Browsers**: Use `playwright_close` when done to free resources
2. **Use Specific Selectors**: Prefer data-testid attributes for reliable element selection
3. **Wait for Elements**: Give pages time to load before interacting
4. **Capture Console Logs**: Monitor for errors during testing
5. **Test Multiple Browsers**: Verify compatibility across Chromium, Firefox, and WebKit

## Resources

- [Playwright MCP Documentation](https://executeautomation.github.io/mcp-playwright/docs/intro)
- [Playwright MCP GitHub](https://github.com/executeautomation/mcp-playwright)
- [Playwright MCP Release Notes](https://executeautomation.github.io/mcp-playwright/docs/release)
- [Playwright Documentation](https://playwright.dev/)

## Version

Current Version: **1.0.6** (as of setup)

Major features:
- File upload support
- Enhanced content extraction
- Improved interactions
- Local browser support
- Full API testing suite

---

**Setup Date**: October 14, 2025  
**Configured By**: Development Team  
**Project**: SHELTR-AI

