export function FieldError({ msg }: { msg?: string }) {
  if (!msg) return null;
  return (
    <p role="alert" className="mt-1 flex items-center gap-1 text-xs text-deal">
      <span aria-hidden className="flex h-3.5 w-3.5 items-center justify-center rounded-full bg-deal text-[10px] font-bold text-white">!</span>
      {msg}
    </p>
  );
}

export function FormAlert({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div role="alert" className="mb-4 flex gap-3 rounded-lg border border-deal p-4 shadow-[0_0_0_4px_#fcf4f4_inset]">
      <span aria-hidden className="text-2xl leading-none text-deal">⚠</span>
      <div>
        <p className="font-bold text-deal">{title}</p>
        <p className="text-sm">{children}</p>
      </div>
    </div>
  );
}
