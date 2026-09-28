/** Re-mounts on every navigation, giving each page a short fade-up entrance. */
export default function ShopTemplate({ children }: { children: React.ReactNode }) {
  return <div className="animate-[rise_.45s_cubic-bezier(.2,.8,.2,1)]">{children}</div>;
}
