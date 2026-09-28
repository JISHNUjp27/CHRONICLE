import { forwardRef, useId } from "react";

const Select = forwardRef(function Select({
    options = [],
    label,
    className = "",
    error,
    ...props
}, ref){
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
        <div className="relative">
          <select
            {...props}
            id={id}
            ref={ref}
            className={`w-full appearance-none rounded-xl border bg-white/[0.05] px-4 py-3 pr-10 text-sm text-slate-100 outline-none backdrop-blur-md transition-all duration-300 focus:bg-white/[0.08] focus:shadow-[0_0_24px_rgba(34,211,238,0.2)] ${
              error
                ? 'border-rose-500/70 focus:border-rose-400 focus:ring-2 focus:ring-rose-500/20'
                : 'border-white/15 focus:border-cyan-400 focus:ring-2 focus:ring-cyan-400/20'
            } ${className}`}
          >
              {options?.map((option) => (
                  <option key={option} value={option} className="bg-[#0b0e1a] text-slate-100 py-2">
                      {option}
                  </option>
              ))}
          </select>
          <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-3.5 text-slate-400">
            <svg className="h-4 w-4 fill-current" viewBox="0 0 20 20">
              <path d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" />
            </svg>
          </div>
        </div>
        {error && <p className="mt-1.5 text-xs font-medium text-rose-400">{error}</p>}
     </div>
    );
});

export default Select;