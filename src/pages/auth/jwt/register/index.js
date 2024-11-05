'use client';

// auth
import { GuestGuard } from 'src/auth/guard';
// components
import AuthClassicLayout from 'src/layouts/auth/classic';
// sections
import { JwtRegisterView } from 'src/sections/auth/jwt';

export default function RegisterPage() {
  return (
    <GuestGuard>
      <AuthClassicLayout>
        <JwtRegisterView />
      </AuthClassicLayout>
    </GuestGuard>
  );
}
