const arrowIcon = (
	<svg
		className='h-6 w-6'
		viewBox='0 0 16 16'
		fill='none'
		xmlns='http://www.w3.org/2000/svg'
	>
		<path
			fillRule='evenodd'
			clipRule='evenodd'
			d='M2.95339 5.67461C3.1331 5.46495 3.44875 5.44067 3.65841 5.62038L7.99968 9.34147L12.341 5.62038C12.5506 5.44067 12.8663 5.46495 13.046 5.67461C13.2257 5.88428 13.2014 6.19993 12.9917 6.37964L8.32508 10.3796C8.13783 10.5401 7.86153 10.5401 7.67429 10.3796L3.00762 6.37964C2.79796 6.19993 2.77368 5.88428 2.95339 5.67461Z'
			fill='currentColor'
		/>
	</svg>
);

export default function InputSelect(props: {
  name: string;
  label: string;
  options: { value: string; label: string }[];
  onChange: (event: React.ChangeEvent<HTMLSelectElement>) => void;
  value: string;
  required?: boolean;
  placeholder?: string;
}) {
  const { name, label, options, onChange, value, required, placeholder } = props;
  return (
    <div>
      <label
        htmlFor={name}
        className='mb-2.5 block font-satoshi text-base font-medium text-dark dark:text-white'
      >
        {label}
      </label>
      <div className='relative'>
        <select
          name={name}
          id={name}
          value={value || ""}
          onChange={onChange}
          required={required}
          className='relative z-20 h-[52px] w-full appearance-none rounded-lg border border-gray-3 bg-white py-3 pl-5.5 pr-12 text-dark outline-none ring-offset-1 duration-300 focus:shadow-input focus:ring-primary/20 dark:border-stroke-dark dark:bg-dark dark:text-white dark:focus:border-transparent'
        >
          <option value="" disabled>
            {placeholder || "Select option"}
          </option>
          {options?.map((option) => (
            <option key={option.value} value={option.value} className='bg-white dark:bg-dark'>
              {option.label}
            </option>
          ))}
        </select>
        <span className='absolute right-4 top-1/2 z-30 -translate-y-1/2 pointer-events-none text-gray-500 dark:text-gray-400'>
          {arrowIcon}
        </span>
      </div>
    </div>
  );
}
