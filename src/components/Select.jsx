import React, { forwardRef, useId } from "react";

const Select = forwardRef(function Select({
    options,
    label,
    className,
    error,
    ...props
}, ref){
    const id = useId()
    return(
     <div className="w-full">
        {label && <label htmlFor={id} className=""></label>}
        <select
        {...props}
        id={id}
        ref={ref}
         className={`px-3 py-2 rounded-lg bg-white text-black 
            outline-none focus:bg-gray-50 duration-200 border ${error ? 'border-red-500' : 'border-gray-200'} w-full ${className}`}
        >
            {options?.map((option) => (
                <option key={option} value={option}>
                    {option}
                </option>
            ))}
        </select>
        {error && <p className="text-red-500 text-sm mt-1">{error}</p>}
     </div>
    )
})

export default Select;