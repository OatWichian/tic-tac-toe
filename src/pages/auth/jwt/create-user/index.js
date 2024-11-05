'use client';

// auth
import { GuestGuard } from 'src/auth/guard';
// components
import AuthClassicLayout from 'src/layouts/auth/classic';
// sections
import { CreateUserView } from 'src/sections/auth/jwt';

export default function CreateUserPage() {
  return (
    <GuestGuard>
      <AuthClassicLayout>
        <CreateUserView />
      </AuthClassicLayout>
    </GuestGuard>
  );
}
