import { SignIn } from '@clerk/nextjs';

export default function SignInPage() {
  return (
    <div className="min-h-screen flex items-center justify-center p-6 pt-24 relative z-10">
      <div className="w-full max-w-md">
        <SignIn />
      </div>
    </div>
  );
}