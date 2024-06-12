"use client"

import { useProfile } from "@/api/hooks/useProfile"
import { ProfileItem } from "../ProfileItem/ProfileItem"

const ProfilePage = () => {
  const { profile } = useProfile()
  if (!profile) return

  return (
    <main className="flex container flex-col items-center justify-between p-24">
      <div className="mb-32 grid gap-2 text-center lg:mb-0 lg:w-full lg:max-w-5xl lg:grid-cols-3 lg:text-left">
        <ProfileItem name="email" value={profile.email} />
        <ProfileItem name="login" value={profile.login} />
        <ProfileItem name="phone" value={profile.phone} />
      </div>
    </main>
  )
}

export { ProfilePage }
