import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Separator } from '@/components/ui/Separator';

export const metadata = { title: 'Settings — Campaign Operator' };

function SettingRow({ label, value, hint }: { label: string; value: string; hint?: string }) {
  return (
    <div className="flex items-start justify-between py-4">
      <div>
        <p className="text-sm font-medium text-slate-700">{label}</p>
        {hint && <p className="text-xs text-slate-500 mt-0.5">{hint}</p>}
      </div>
      <div className="flex items-center gap-3 ml-6">
        <span className="text-sm text-slate-600">{value}</span>
        <button className="text-xs font-medium text-violet-600 hover:text-violet-800 transition-colors whitespace-nowrap">
          Edit
        </button>
      </div>
    </div>
  );
}

export default function SettingsPage() {
  return (
    <div className="max-w-2xl space-y-8">
      <div>
        <h1 className="text-2xl font-bold text-slate-900">Settings</h1>
        <p className="mt-1 text-sm text-slate-500">Manage your account and preferences.</p>
      </div>

      {/* Profile */}
      <Card>
        <h2 className="text-base font-semibold text-slate-800 mb-1">Profile</h2>
        <p className="text-sm text-slate-500 mb-4">Your personal information.</p>
        <Separator />
        <div className="divide-y divide-slate-100">
          <SettingRow label="Full Name" value="Alex Rivera" />
          <SettingRow label="Email" value="alex@business.com" hint="Used for notifications and login" />
          <SettingRow label="Password" value="••••••••••" />
        </div>
        <div className="mt-4 flex items-center gap-3">
          <div className="flex h-14 w-14 items-center justify-center rounded-full bg-violet-100 text-violet-700 text-xl font-bold">
            A
          </div>
          <div>
            <p className="text-sm font-medium text-slate-700">Profile photo</p>
            <p className="text-xs text-slate-500">JPG, PNG or GIF, max 1MB</p>
          </div>
          <Button variant="secondary" size="sm" className="ml-auto">
            Upload
          </Button>
        </div>
      </Card>

      {/* Business Info */}
      <Card>
        <h2 className="text-base font-semibold text-slate-800 mb-1">Business Info</h2>
        <p className="text-sm text-slate-500 mb-4">Used as defaults in your campaigns.</p>
        <Separator />
        <div className="divide-y divide-slate-100">
          <SettingRow label="Business Name" value="—" hint="Pre-fill campaign forms" />
          <SettingRow label="Industry" value="—" />
          <SettingRow label="Default Brand Voice" value="—" />
          <SettingRow label="Website" value="—" />
        </div>
      </Card>

      {/* Notifications */}
      <Card>
        <h2 className="text-base font-semibold text-slate-800 mb-1">Notifications</h2>
        <p className="text-sm text-slate-500 mb-4">Choose when to be notified.</p>
        <Separator />
        <div className="divide-y divide-slate-100">
          {[
            { label: 'Campaign generated', hint: 'When AI finishes building your campaign', enabled: true },
            { label: 'New assets ready', hint: 'When content assets are available', enabled: true },
            { label: 'Product updates', hint: 'New features and improvements', enabled: false },
          ].map((item) => (
            <div key={item.label} className="flex items-center justify-between py-4">
              <div>
                <p className="text-sm font-medium text-slate-700">{item.label}</p>
                <p className="text-xs text-slate-500 mt-0.5">{item.hint}</p>
              </div>
              <div
                className={`relative inline-flex h-5 w-9 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors ${
                  item.enabled ? 'bg-violet-600' : 'bg-slate-200'
                }`}
              >
                <span
                  className={`pointer-events-none inline-block h-4 w-4 transform rounded-full bg-white shadow transition-transform ${
                    item.enabled ? 'translate-x-4' : 'translate-x-0'
                  }`}
                />
              </div>
            </div>
          ))}
        </div>
      </Card>

      {/* Billing */}
      <Card>
        <h2 className="text-base font-semibold text-slate-800 mb-1">Billing</h2>
        <p className="text-sm text-slate-500 mb-4">Your plan and payment details.</p>
        <Separator />
        <div className="mt-4 flex items-center justify-between rounded-lg bg-slate-50 border border-slate-200 px-4 py-3">
          <div>
            <div className="flex items-center gap-2">
              <p className="text-sm font-semibold text-slate-800">Free Plan</p>
              <span className="rounded-full bg-violet-100 px-2 py-0.5 text-xs font-medium text-violet-700">Current</span>
            </div>
            <p className="text-xs text-slate-500 mt-0.5">3 campaigns · 20 assets · 5 channels</p>
          </div>
          <Button variant="primary" size="sm">
            Upgrade
          </Button>
        </div>
      </Card>

      {/* Danger zone */}
      <Card>
        <h2 className="text-base font-semibold text-red-600 mb-1">Danger Zone</h2>
        <p className="text-sm text-slate-500 mb-4">Irreversible actions — proceed with caution.</p>
        <Separator />
        <div className="mt-4">
          <Button variant="destructive" size="sm">
            Delete Account
          </Button>
        </div>
      </Card>
    </div>
  );
}
