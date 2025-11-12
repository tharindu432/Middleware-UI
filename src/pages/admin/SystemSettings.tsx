import { useState } from 'react'

import { useAdmin } from '@/hooks/useAdmin'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Settings, Save } from 'lucide-react'

export default function SystemSettings() {
  const { updateSystemSettings, loading } = useAdmin()
  const [settings, setSettings] = useState({
    commissionRate: '5.0',
    taxRate: '10.0',
    serviceFee: '25.0',
    maxCreditLimit: '500000',
  })

  const handleSave = async (settingKey: string, value: string) => {
    try {
      await updateSystemSettings({ [settingKey]: value })
    } catch (error) {
      console.error('Error updating setting:', error)
    }
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">System Settings</h1>
        <p className="text-gray-500 mt-1">Configure system-wide settings and parameters</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Settings className="h-5 w-5" />
              Commission Settings
            </CardTitle>
            <CardDescription>Configure commission rates and fees</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="commissionRate">Commission Rate (%)</Label>
              <div className="flex gap-2">
                <Input
                  id="commissionRate"
                  type="number"
                  step="0.1"
                  value={settings.commissionRate}
                  onChange={(e) => setSettings({ ...settings, commissionRate: e.target.value })}
                />
                <Button
                  onClick={() => handleSave('COMMISSION_RATE', settings.commissionRate)}
                  disabled={loading}
                >
                  <Save className="h-4 w-4" />
                </Button>
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="serviceFee">Service Fee ($)</Label>
              <div className="flex gap-2">
                <Input
                  id="serviceFee"
                  type="number"
                  step="0.01"
                  value={settings.serviceFee}
                  onChange={(e) => setSettings({ ...settings, serviceFee: e.target.value })}
                />
                <Button
                  onClick={() => handleSave('SERVICE_FEE', settings.serviceFee)}
                  disabled={loading}
                >
                  <Save className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Settings className="h-5 w-5" />
              Tax & Credit Settings
            </CardTitle>
            <CardDescription>Configure tax rates and credit limits</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="taxRate">Tax Rate (%)</Label>
              <div className="flex gap-2">
                <Input
                  id="taxRate"
                  type="number"
                  step="0.1"
                  value={settings.taxRate}
                  onChange={(e) => setSettings({ ...settings, taxRate: e.target.value })}
                />
                <Button
                  onClick={() => handleSave('TAX_RATE', settings.taxRate)}
                  disabled={loading}
                >
                  <Save className="h-4 w-4" />
                </Button>
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="maxCreditLimit">Max Credit Limit ($)</Label>
              <div className="flex gap-2">
                <Input
                  id="maxCreditLimit"
                  type="number"
                  value={settings.maxCreditLimit}
                  onChange={(e) => setSettings({ ...settings, maxCreditLimit: e.target.value })}
                />
                <Button
                  onClick={() => handleSave('MAX_CREDIT_LIMIT', settings.maxCreditLimit)}
                  disabled={loading}
                >
                  <Save className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
