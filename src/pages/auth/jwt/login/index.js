'use client';

// auth
import { GuestGuard } from 'src/auth/guard';
// components
import AuthClassicLayout from 'src/layouts/auth/classic';
// sections
import { JwtLoginView } from 'src/sections/auth/jwt';

export default function LoginPage() {
  return (
    <GuestGuard>
      <AuthClassicLayout>
        <JwtLoginView />
      </AuthClassicLayout>
    </GuestGuard>
  );
}
