import { useState } from 'react';
import { emailTemplateService } from '@/lib/apiService';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';

type TestResult = {
  success: boolean;
  message: string;
  error?: string;
  timestamp: string;
};

export default function EmailServiceTest() {
  const [testResult, setTestResult] = useState<TestResult | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const runTest = async () => {
    setIsLoading(true);
    try {
      const result = await emailTemplateService.testSmtp();
      setTestResult({
        success: true,
        message: result.message || 'SMTP connection is valid',
        timestamp: new Date().toISOString(),
      });
    } catch (error) {
      setTestResult({
        success: false,
        message: error instanceof Error ? error.message : 'SMTP test failed',
        error: error instanceof Error ? error.message : undefined,
        timestamp: new Date().toISOString(),
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto p-6 space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>📧 Email Service Test</CardTitle>
          <CardDescription>
            Test the local email service configuration and functionality
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="rounded-3xl bg-slate-50 border border-slate-200 p-4 text-sm text-slate-700">
            <p className="font-semibold">SMTP Test</p>
            <p>Click "Send Test Email" to verify the backend SMTP connection. This endpoint validates your SMTP transport settings.</p>
          </div>

          <Button 
            onClick={runTest} 
            disabled={isLoading}
            className="w-full"
          >
            {isLoading ? 'Testing...' : 'Send Test Email'}
          </Button>

          {testResult && (
            <div className={`p-4 rounded-lg border ${
              testResult.success ? 'bg-green-50 border-green-200' : 'bg-red-50 border-red-200'
            }`}>
              <h3 className="font-semibold mb-2">Test Result:</h3>
              <div className="space-y-2 text-sm">
                <div><strong>Success:</strong> {testResult.success ? '✅ Yes' : '❌ No'}</div>
                <div><strong>Message:</strong> {testResult.message}</div>
                {testResult.error && <div><strong>Error:</strong> {testResult.error}</div>}
                <div><strong>Timestamp:</strong> {new Date(testResult.timestamp).toLocaleString()}</div>
              </div>
            </div>
          )}

          {/* Instructions */}
          <div className="text-sm text-gray-600 space-y-2">
            <h4 className="font-semibold">Setup Instructions:</h4>
            <ol className="list-decimal list-inside space-y-1">
              <li>Configure SMTP credentials in your .env file</li>
              <li>Restart the backend if you change SMTP settings</li>
              <li>Click "Send Test Email" to verify the connection</li>
              <li>Check your inbox or SMTP provider logs for the test result</li>
            </ol>
            
            <div className="p-3 rounded-lg border bg-blue-50 border-blue-200 text-sm text-slate-700">
              <strong>Note:</strong> SMTP connection is verified by the backend endpoint. Configure `VITE_SMTP_HOST`, `VITE_SMTP_PORT`, `VITE_SMTP_USERNAME`, `VITE_SMTP_PASSWORD`, and then click "Send Test Email".
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}