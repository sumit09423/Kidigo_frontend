'use client'

export default function Input({
  label,
  name,
  type = 'text',
  value,
  onChange,
  error,
  placeholder,
  required = false,
  autoComplete,
  className = '',
  ...props
}) {
  return (
    <div className={className}>
      {label && (
        <label htmlFor={name} className="block text-sm font-medium text-gray-700 mb-2">
          {label}
          {required && <span className="text-red-500 ml-1">*</span>}
        </label>
      )}
      <input
        id={name}
        name={name}
        type={type}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        required={required}
        autoComplete={autoComplete}
        className={`appearance-none relative block w-full px-4 py-3 border ${
          error ? 'border-red-300' : 'border-gray-300'
        } placeholder-gray-400 text-gray-900 rounded-lg focus:outline-none focus:ring-2 ${
          error ? 'focus:ring-red-500' : 'focus:ring-indigo-500'
        } focus:border-transparent transition-all ${props.className || ''}`}
        {...props}
      />
      {error && (
        <p className="mt-1 text-sm text-red-600">{error}</p>
      )}
    </div>
  )
}
