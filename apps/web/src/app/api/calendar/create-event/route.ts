import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  try {
    const eventData = await request.json();
    
    // In production, this would interface with the Google Calendar MCP server
    // For now, we'll simulate the calendar creation and return a mock response
    
    // Validate required fields
    if (!eventData.summary || !eventData.start || !eventData.end || !eventData.attendees) {
      return NextResponse.json(
        { error: 'Missing required fields: summary, start, end, attendees' },
        { status: 400 }
      );
    }

    // TODO: Integrate with actual Google Calendar MCP
    // const mcpResponse = await fetch('http://localhost:3420/calendar/events', {
    //   method: 'POST',
    //   headers: {
    //     'Content-Type': 'application/json',
    //   },
    //   body: JSON.stringify(eventData),
    // });

    // For development, return a mock successful response
    const mockResponse = {
      success: true,
      eventId: `event_${Date.now()}`,
      meetingLink: `https://meet.google.com/mock-${Math.random().toString(36).substring(7)}`,
      htmlLink: `https://calendar.google.com/event?eid=mock_${Date.now()}`,
      created: new Date().toISOString(),
    };

    console.log('Calendar event created (mock):', {
      summary: eventData.summary,
      start: eventData.start.dateTime,
      attendees: eventData.attendees.map((a: any) => a.email),
    });

    return NextResponse.json(mockResponse);
  } catch (error) {
    console.error('Error creating calendar event:', error);
    return NextResponse.json(
      { error: 'Failed to create calendar event' },
      { status: 500 }
    );
  }
} 