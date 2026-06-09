"use client";

import { useMemo, useState } from 'react';
import { z } from 'zod';
import { useEmailTemplates, useUpdateEmailTemplate, useSmtpTest } from '@/hooks/useEmailTemplates';
import AdminLayout from '@/components/AdminLayout';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  Loader2, Mail, ShieldCheck, CheckCircle2, 
  AlertCircle, Code2, Save, Hash, ArrowRight, Eye 
} from 'lucide-react';
import { cn } from '@/lib/utils';

// ... (Schema and helper functions remain the same)
const templateSchema = z.object({
  key: z.string().min(1),
  name: z.string().min(3),
  subject: z.string().min(3),
  body: z.string().min(10),
  required_variables: z.string().optional(),
});

type FormValues = z.infer<typeof templateSchema>;

const placeholderHelp = [
  'name', 'email', 'phone', 'destination', 'trip_type', 'check_in', 
  'check_out', 'guests', 'adults', 'children', 'room_type', 
  'airport_transfer', 'meal_plan', 'special_requests', 'contact_preference',
];

function formatTemplateVariables(value?: string) {
  if (!value) return '';
  return value.split(',').map((item) => item.trim()).filter(Boolean).join(', ');
}

function parseTemplateVariables(value: string) {
  return value.split(',').map((item) => item.trim()).filter(Boolean);
}

export default function EmailTemplates() {
  const { data: templates = [], isLoading } = useEmailTemplates();
  const [activeKey, setActiveKey] = useState('agency_notification');
  const updateTemplate = useUpdateEmailTemplate();
  const smtpTest = useSmtpTest();

  const selectedTemplate = useMemo(
    () => templates.find((item) => item.key === activeKey) ?? templates[0],
    [templates, activeKey]
  );

  const initialValues: FormValues = {
    key: selectedTemplate?.key ?? activeKey,
    name: selectedTemplate?.name ?? '',
    subject: selectedTemplate?.subject ?? '',
    body: selectedTemplate?.body ?? '',
    required_variables: formatTemplateVariables(selectedTemplate?.required_variables?.join(', ')),
  };

  const [formState, setFormState] = useState<FormValues>(initialValues);

  const handleSelectTemplate = (key: string) => {
    setActiveKey(key);
    const found = templates.find((item) => item.key === key);
    setFormState({
      key: found?.key ?? key,
      name: found?.name ?? '',
      subject: found?.subject ?? '',
      body: found?.body ?? '',
      required_variables: formatTemplateVariables(found?.required_variables?.join(', ')),
    });
  };

  const handleInputChange = (field: keyof FormValues, value: string) => {
    setFormState((current) => ({ ...current, [field]: value }));
  };

  const handleSave = async () => {
    const parsed = templateSchema.parse(formState);
    await updateTemplate.mutateAsync({
      key: parsed.key,
      changes: {
        key: parsed.key,
        name: parsed.name,
        subject: parsed.subject,
        body: parsed.body,
        required_variables: parseTemplateVariables(parsed.required_variables ?? ''),
      },
    });
  };

  // Mock data for preview replacement
  const previewHtml = useMemo(() => {
    let content = formState.body;
    placeholderHelp.forEach(key => {
      const regex = new RegExp(`{{${key}}}`, 'g');
      content = content.replace(regex, `<span style="background: #ecfdf5; color: #059669; padding: 2px 4px; border-radius: 4px; font-weight: bold;">[${key}]</span>`);
    });
    return content;
  }, [formState.body]);

  const templateList = [
    { key: 'agency_notification', label: 'Agency Notification', desc: 'Alert staff of new inquiries' },
    { key: 'customer_confirmation', label: 'Customer Confirmation', desc: 'Instant booking receipt' },
  ];

  return (
    <AdminLayout>
      <div className="max-w-[1400px] mx-auto space-y-6">
        {/* Header Section */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 border-b border-slate-200 pb-6">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <div className="h-8 w-1 bg-emerald-500 rounded-full" />
              <span className="text-xs font-bold tracking-widest uppercase text-emerald-600">Communications</span>
            </div>
            <h1 className="text-3xl font-serif font-bold text-slate-900">Email Templates</h1>
          </div>

          <div className="flex items-center gap-3">
             <Button variant="outline" onClick={() => smtpTest.mutateAsync()} disabled={smtpTest.isPending}>
               {smtpTest.isPending ? <Loader2 className="h-4 w-4 animate-spin" /> : <ShieldCheck className="h-4 w-4 mr-2" />}
              Connection Test
            </Button>
            {smtpTest.isSuccess && (
              <Badge variant="outline" className="bg-emerald-50 text-emerald-700 border-emerald-200"><CheckCircle2 className="h-3 w-3 mr-1" /> SMTP Active</Badge>
            )}
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-[280px_1fr] gap-8">
          <aside className="space-y-2">
            {templateList.map((template) => (
              <button
                key={template.key}
                onClick={() => handleSelectTemplate(template.key)}
                className={cn(
                  "w-full text-left p-4 rounded-xl transition-all border",
                  activeKey === template.key ? "bg-white border-emerald-200 shadow-md" : "hover:bg-slate-100 text-slate-500"
                )}
              >
                <div className="font-semibold text-sm">{template.label}</div>
                <p className="text-xs text-slate-400">{template.desc}</p>
              </button>
            ))}
          </aside>

          <div className="space-y-6">
            <Card className="border-slate-200 shadow-sm overflow-hidden bg-white">
              <CardContent className="p-0">
                <Tabs defaultValue="edit" className="w-full">
                  <div className="bg-slate-50 border-b border-slate-200 p-4 flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <Mail className="h-5 w-5 text-emerald-600" />
                      <h3 className="font-bold text-slate-900">{selectedTemplate?.name}</h3>
                    </div>
                    
                    <TabsList className="bg-slate-200/50">
                      <TabsTrigger value="edit" className="data-[state=active]:bg-white">
                        <Code2 className="h-3.5 w-3.5 mr-2" /> Edit
                      </TabsTrigger>
                      <TabsTrigger value="preview" className="data-[state=active]:bg-white">
                        <Eye className="h-3.5 w-3.5 mr-2" /> Preview
                      </TabsTrigger>
                    </TabsList>
                  </div>

                  <TabsContent value="edit" className="p-6 m-0 space-y-6">
                    <div className="grid md:grid-cols-2 gap-6">
                      <div className="space-y-2">
                        <Label className="text-xs font-bold uppercase tracking-tighter">Subject Line</Label>
                        <Input value={formState.subject} onChange={(e) => handleInputChange('subject', e.target.value)} />
                      </div>
                      <div className="space-y-2">
                        <Label className="text-xs font-bold uppercase tracking-tighter">Required Variables</Label>
                        <Input value={formState.required_variables} onChange={(e) => handleInputChange('required_variables', e.target.value)} />
                      </div>
                    </div>

                    <div className="space-y-2">
                      <Textarea 
                        rows={16} 
                        className="font-mono text-sm bg-slate-900 text-slate-200 rounded-xl p-4 leading-relaxed"
                        value={formState.body} 
                        onChange={(e) => handleInputChange('body', e.target.value)} 
                      />
                    </div>
                  </TabsContent>

                  <TabsContent value="preview" className="p-6 m-0">
                    <div className="rounded-xl border border-slate-200 bg-slate-50 overflow-hidden h-[500px]">
                      <div className="bg-white border-b border-slate-200 px-4 py-2 flex items-center gap-2">
                        <span className="text-[10px] font-bold text-slate-400 uppercase">Subject:</span>
                        <span className="text-xs font-medium text-slate-700">{formState.subject}</span>
                      </div>
                      <iframe 
                        title="Email Preview"
                        srcDoc={previewHtml}
                        className="w-full h-full bg-white"
                        sandbox="allow-popups allow-popups-to-escape-sandbox"
                      />
                    </div>
                  </TabsContent>
                </Tabs>

                <div className="p-6 pt-0 flex flex-wrap gap-2 mb-6">
                   <p className="w-full text-[10px] font-bold text-slate-400 uppercase mb-2">Variables (Click to add)</p>
                   {placeholderHelp.map((name) => (
                    <Badge 
                      key={name} 
                      className="cursor-pointer bg-slate-100 hover:bg-emerald-50 text-slate-600 border-slate-200"
                      onClick={() => handleInputChange('body', formState.body + ` {{${name}}}`)}
                    >
                      {`{{${name}}}`}
                    </Badge>
                  ))}
                </div>

                <div className="p-6 border-t border-slate-100 flex items-center justify-between">
                  <div className="text-xs text-red-500">
                    {smtpTest.isError && "SMTP Test Failed"}
                  </div>
                   <Button 
                     className="bg-emerald-600 hover:bg-emerald-700"
                     onClick={handleSave} 
                     disabled={updateTemplate.isPending}
                   >
                     {updateTemplate.isPending ? <Loader2 className="animate-spin mr-2" /> : <Save className="h-4 w-4 mr-2" />}
                    Save Template
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </AdminLayout>
  );
}