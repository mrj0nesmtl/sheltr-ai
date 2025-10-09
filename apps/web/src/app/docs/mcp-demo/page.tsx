import { Metadata } from 'next';
import MCPDemoClientPage from './client-page';

export const metadata: Metadata = {
  title: 'OpenAI MCP Integration Demo | SHELTR-AI Documentation',
  description: 'Experience SHELTR-AI\'s advanced MCP-powered chatbot with OpenAI Agents SDK integration.',
  keywords: ['MCP', 'OpenAI', 'Agents', 'AI', 'Chatbot', 'SHELTR', 'Demo'],
};

export default function MCPDemoPage() {
  return <MCPDemoClientPage />;
}
