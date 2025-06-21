
import React, { useState, useEffect } from "react";
import Layout from "@/components/Layout";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Settings as SettingsIcon, Save, Barcode, Link as LinkIcon, Server, File } from "lucide-react";
import { useToast } from "@/components/ui/use-toast";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

const Settings = () => {
  const { toast } = useToast();
  const [settings, setSettings] = useState({
    apiUrl: localStorage.getItem("apiUrl") || "https://sohatey.info",
    reportPath: localStorage.getItem("reportPath") || "/reports",
    systemName: localStorage.getItem("systemName") || "نظام صحة V4.1",
    reportFooter: localStorage.getItem("reportFooter") || "جميع الحقوق محفوظة - نظام صحة",
    barcodeLink: localStorage.getItem("barcodeLink") || "",
    barcodeLogo: localStorage.getItem("barcodeLogo") || "",
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setSettings((prev) => ({ ...prev, [name]: value }));
  };
  
  const handleSaveSettings = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Save settings to localStorage
    Object.entries(settings).forEach(([key, value]) => {
      localStorage.setItem(key, value);
    });
    
    toast({
      title: "تم حفظ الإعدادات",
      description: "تم حفظ إعدادات النظام بنجاح",
    });
  };

  return (
    <Layout>
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <SettingsIcon className="mr-2 h-5 w-5" />
            إعدادات النظام
          </CardTitle>
          <CardDescription>يمكنك تعديل إعدادات النظام من هذه الصفحة</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSaveSettings} className="space-y-6">
            <Tabs defaultValue="server">
              <TabsList className="mb-4">
                <TabsTrigger value="server">إعدادات الخادم</TabsTrigger>
                <TabsTrigger value="barcode">إعدادات الباركود</TabsTrigger>
                <TabsTrigger value="reports">إعدادات التقارير</TabsTrigger>
              </TabsList>
              
              <TabsContent value="server">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="input-group">
                    <Label htmlFor="apiUrl" className="flex items-center">
                      <Server className="mr-2 h-4 w-4" />
                      رابط API
                    </Label>
                    <Input
                      id="apiUrl"
                      name="apiUrl"
                      value={settings.apiUrl}
                      onChange={handleChange}
                      placeholder="أدخل رابط الـ API"
                    />
                  </div>
                  
                  <div className="input-group">
                    <Label htmlFor="reportPath" className="flex items-center">
                      <File className="mr-2 h-4 w-4" />
                      مسار التقارير
                    </Label>
                    <Input
                      id="reportPath"
                      name="reportPath"
                      value={settings.reportPath}
                      onChange={handleChange}
                      placeholder="أدخل مسار حفظ التقارير"
                    />
                  </div>
                </div>
              </TabsContent>
              
              <TabsContent value="barcode">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="input-group">
                    <Label htmlFor="barcodeLogo" className="flex items-center">
                      <Barcode className="mr-2 h-4 w-4" />
                      شعار الباركود
                    </Label>
                    <Input
                      id="barcodeLogo"
                      name="barcodeLogo"
                      value={settings.barcodeLogo}
                      onChange={handleChange}
                      placeholder="أدخل رابط شعار الباركود"
                    />
                  </div>
                  
                  <div className="input-group">
                    <Label htmlFor="barcodeLink" className="flex items-center">
                      <LinkIcon className="mr-2 h-4 w-4" />
                      رابط الباركود
                    </Label>
                    <Input
                      id="barcodeLink"
                      name="barcodeLink"
                      value={settings.barcodeLink}
                      onChange={handleChange}
                      placeholder="أدخل رابط الباركود"
                    />
                  </div>
                </div>
              </TabsContent>
              
              <TabsContent value="reports">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="input-group">
                    <Label htmlFor="systemName">اسم النظام</Label>
                    <Input
                      id="systemName"
                      name="systemName"
                      value={settings.systemName}
                      onChange={handleChange}
                      placeholder="أدخل اسم النظام"
                    />
                  </div>
                  
                  <div className="input-group">
                    <Label htmlFor="reportFooter">نص تذييل التقارير</Label>
                    <Input
                      id="reportFooter"
                      name="reportFooter"
                      value={settings.reportFooter}
                      onChange={handleChange}
                      placeholder="أدخل نص تذييل التقارير"
                    />
                  </div>
                </div>
              </TabsContent>
            </Tabs>

            <div className="flex justify-end">
              <Button type="submit" className="btn-medical">
                <Save className="mr-2 h-4 w-4" />
                حفظ الإعدادات
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </Layout>
  );
};

export default Settings;
