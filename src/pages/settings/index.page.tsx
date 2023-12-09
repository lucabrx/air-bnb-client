import { ProfileSettings } from "~/pages/settings/profile-settings"

import { Layout } from "~/components/layouts/layout"

export default function SettingsPage() {
  return (
    <Layout title="Settings" className="max-w-lg">
      <h2 className="text-2xl font-semibold">Settings</h2>
      <p className="mt-2 text-muted-foreground">Here you can update your account settings.</p>
      <ProfileSettings />
    </Layout>
  )
}
