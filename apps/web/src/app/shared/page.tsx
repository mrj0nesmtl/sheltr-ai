'use client';

import { useEffect, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { ArrowLeft, Calendar, MessageSquare, User, Brain, Eye } from 'lucide-react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { chatbotDashboardService } from '@/services/chatbotDashboardService';

interface Message {
  role: 'user' | 'assistant';
  content: string;
  timestamp: string;
}

interface SharedConversation {
  session: {
    title: string;
    agent_type: string;
    model: string;
    created_at: string;
  };
  messages: Message[];
  share_info: {
    created_by: string;
    created_at: string;
    view_count: number;
  };
}

const AGENT_COLORS = {
  general: 'border-gray-500 text-gray-500',
  'technical-expert': 'border-blue-500 text-blue-500',
  'business-analyst': 'border-green-500 text-green-500',
  'donor-relations': 'border-purple-500 text-purple-500',
  'participant-support': 'border-orange-500 text-orange-500'
};

const AGENT_LABELS = {
  general: 'General Assistant',
  'technical-expert': 'Technical Expert',
  'business-analyst': 'Business Analyst',
  'donor-relations': 'Donor Relations',
  'participant-support': 'Participant Support'
};

export default function SharedConversationPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const shareId = searchParams.get('id');

  const [conversation, setConversation] = useState<SharedConversation | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const loadSharedConversation = async (id: string) => {
    try {
      setLoading(true);
      setError(null);
      const response = await chatbotDashboardService.getSharedConversation(id);
      
      if (response.success) {
        setConversation(response.data);
      } else {
        setError('Failed to load shared conversation');
      }
    } catch (err) {
      console.error('Error loading shared conversation:', err);
      setError(err instanceof Error ? err.message : 'Failed to load conversation');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (shareId) {
      loadSharedConversation(shareId);
    } else {
      setError('No share ID provided');
      setLoading(false);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [shareId]);

  const formatDate = (dateString: string) => {
    try {
      const date = new Date(dateString);
      return date.toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
      });
    } catch {
      return dateString;
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-white mx-auto mb-4"></div>
          <p className="text-white">Loading shared conversation...</p>
        </div>
      </div>
    );
  }

  if (error || !conversation) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center p-4">
        <Card className="max-w-md w-full bg-white/5 border-white/10">
          <CardHeader>
            <CardTitle className="text-red-500">Error</CardTitle>
            <CardDescription className="text-white/70">
              {error || 'Conversation not found'}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Button
              variant="outline"
              onClick={() => router.push('/')}
              className="w-full"
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Home
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  const agentType = conversation.session.agent_type || 'general';
  const agentColor = AGENT_COLORS[agentType as keyof typeof AGENT_COLORS] || AGENT_COLORS.general;
  const agentLabel = AGENT_LABELS[agentType as keyof typeof AGENT_LABELS] || 'General Assistant';

  return (
    <div className="min-h-screen bg-black">
      {/* Header */}
      <div className="border-b border-white/10 bg-black/50 backdrop-blur-sm sticky top-0 z-10">
        <div className="max-w-5xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between mb-4">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => router.push('/')}
              className="text-white/70 hover:text-white"
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back
            </Button>
            <Badge variant="outline" className="text-white/50 border-white/20">
              <Eye className="w-3 h-3 mr-1" />
              {conversation.share_info.view_count} views
            </Badge>
          </div>

          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <h1 className="text-2xl font-bold text-white">
                {conversation.session.title}
              </h1>
              <Badge variant="outline" className={`${agentColor}`}>
                {agentLabel}
              </Badge>
            </div>

            <div className="flex flex-wrap items-center gap-4 text-sm text-white/50">
              <div className="flex items-center gap-1">
                <Brain className="w-4 h-4" />
                <span>{conversation.session.model}</span>
              </div>
              <div className="flex items-center gap-1">
                <Calendar className="w-4 h-4" />
                <span>{formatDate(conversation.session.created_at)}</span>
              </div>
              <div className="flex items-center gap-1">
                <MessageSquare className="w-4 h-4" />
                <span>{conversation.messages.length} messages</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Messages */}
      <div className="max-w-5xl mx-auto px-4 py-8">
        <div className="space-y-6">
          {conversation.messages.map((message, index) => (
            <Card
              key={index}
              className={`${
                message.role === 'user'
                  ? 'bg-white/5 border-white/10'
                  : 'bg-white/10 border-white/20'
              }`}
            >
              <CardHeader className="pb-3">
                <div className="flex items-center gap-2">
                  {message.role === 'user' ? (
                    <>
                      <User className="w-4 h-4 text-white/70" />
                      <span className="text-sm font-medium text-white/70">User</span>
                    </>
                  ) : (
                    <>
                      <Brain className="w-4 h-4 text-white/70" />
                      <span className="text-sm font-medium text-white/70">Assistant</span>
                    </>
                  )}
                  <span className="text-xs text-white/40 ml-auto">
                    {formatDate(message.timestamp)}
                  </span>
                </div>
              </CardHeader>
              <CardContent>
                <div className="text-white prose prose-sm dark:prose-invert max-w-none">
                  <ReactMarkdown
                    remarkPlugins={[remarkGfm]}
                    components={{
                      h1: ({...props}) => <h1 className="text-xl font-bold mt-4 mb-2 text-white" {...props} />,
                      h2: ({...props}) => <h2 className="text-lg font-bold mt-3 mb-2 text-white" {...props} />,
                      h3: ({...props}) => <h3 className="text-base font-bold mt-2 mb-1 text-white" {...props} />,
                      h4: ({...props}) => <h4 className="text-sm font-bold mt-2 mb-1 text-white" {...props} />,
                      p: ({...props}) => <p className="mb-2 last:mb-0 text-white/90" {...props} />,
                      ul: ({...props}) => <ul className="list-disc list-inside mb-2 space-y-1 text-white/90" {...props} />,
                      ol: ({...props}) => <ol className="list-decimal list-inside mb-2 space-y-1 text-white/90" {...props} />,
                      li: ({...props}) => <li className="ml-2 text-white/90" {...props} />,
                      code: (props: React.HTMLAttributes<HTMLElement> & { inline?: boolean }) => 
                        props.inline ? (
                          <code className="bg-black/30 px-1 py-0.5 rounded text-xs text-white/90" {...props} />
                        ) : (
                          <code className="block bg-black/30 p-2 rounded text-xs overflow-x-auto text-white/90" {...props} />
                        ),
                      a: ({...props}) => <a className="text-blue-400 hover:underline" {...props} />,
                      blockquote: ({...props}) => <blockquote className="border-l-4 border-white/30 pl-4 italic my-2 text-white/80" {...props} />,
                      strong: ({...props}) => <strong className="font-bold text-white" {...props} />,
                      em: ({...props}) => <em className="italic text-white/90" {...props} />,
                    }}
                  >
                    {message.content}
                  </ReactMarkdown>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Footer */}
        <div className="mt-12 pt-8 border-t border-white/10">
          <div className="text-center text-sm text-white/40 space-y-1">
            <p>
              Shared by <span className="text-white/60">{conversation.share_info.created_by}</span>
            </p>
            <p>
              on {formatDate(conversation.share_info.created_at)}
            </p>
            <p className="mt-4 text-xs">
              This is a read-only snapshot of the conversation.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

