import { useId, forwardRef } from 'react';

const Input = forwardRef(function Input(
  { 
    label, 
    type = 'text', 
    className = '', 
    error,
    ...props 
  }, ref
) {
  const id = useId();

  return (
    <div className="w-full">
      {label && (
        <label
          htmlFor={id}
          className="mb-2 block text-xs font-semibold uppercase tracking-[0.16em] text-slate-300"
        >
          {label}
        </label>
      )}
      <input
        id={id}
        type={type}
        ref={ref}
        {...props}
        className={`w-full rounded-xl border bg-white/[0.05] px-4 py-3 text-sm text-slate-100 placeholder:text-slate-500 outline-none backdrop-blur-md transition-all duration-300 focus:bg-white/[0.08] focus:shadow-[0_0_24px_rgba(34,211,238,0.2)] ${
          error
            ? 'border-rose-500/70 focus:border-rose-400 focus:ring-2 focus:ring-rose-500/20'
            : 'border-white/15 focus:border-cyan-400 focus:ring-2 focus:ring-cyan-400/20'
        } ${className}`}
      />
      {error && <p className="mt-1.5 text-xs font-medium text-rose-400">{error}</p>}
    </div>
  );
});

export default Input;