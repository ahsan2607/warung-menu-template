// ./src/app/api/menu/route.ts (No changes needed, as session is removed)
import { NextResponse } from 'next/server';
import axios, { AxiosError } from 'axios';

const APPS_SCRIPT_URL = 'https://script.google.com/macros/s/AKfycbzCmdhUaowNnqy-QIRZZUDzdL0Wnn-xoXZYGDuGl1QVDTWYXRvwuYk16OH2rANkxLEL/exec'; // Replace with your deployed script URL
const API_KEY = 'a1b2c3d4-e5f6-7890-abcd-ef1234567890'; // Match the key in Apps Script

export async function GET() {
  const proxiedBody = { action: 'getMenuData', apiKey: API_KEY };

  try {
    const response = await axios.post(APPS_SCRIPT_URL, proxiedBody, {
      headers: { 'Content-Type': 'application/json' },
    });

    return NextResponse.json(response.data, { status: response.status });
  } catch (error) {
    if (error instanceof AxiosError && error.response) {
      return NextResponse.json(
        { success: false, error: error.response.data.error || 'Proxy error' },
        { status: error.response.status }
      );
    }
    console.error('Menu route network error:', error);
    return NextResponse.json({ success: false, error: 'Network error' }, { status: 500 });
  }
}