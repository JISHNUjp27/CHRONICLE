function Button({
    children,
    type = 'button',
    bgColor = 'btn-primary',
    textColor = 'text-white',
    className = '',
    ...props
}){
    const isCustomBg = bgColor.startsWith('bg-');
    const baseClass = isCustomBg
        ? `btn-3d ${bgColor} ${textColor} ${className}`
        : `btn-3d ${bgColor} ${textColor} ${className}`;

    return (
        <button type={type} className={`cursor-pointer ${baseClass}`} {...props}>
            {children}
        </button>
    );
}

export default Button;