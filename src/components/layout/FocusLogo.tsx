import Link from 'next/link';
import { Logo } from './Logo';

export function FocusLogo() {
  return (
    <Link href="/" className="mx-auto block w-fit py-4 text-3xl">
      <Logo dark />
    </Link>
  );
}
