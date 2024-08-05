import { useEffect, useState } from "react";

export default function HiddenInput({ shopName, shopsFromUpdate }) {
  const shopUrl = `url${shopName}`;
  const [isChecked, setIsChecked] = useState(false);
  const [urlInput, setUrlInput] = useState("");

  const handleHide = () => {
    setIsChecked(!isChecked);
    if (urlInput) {
      setUrlInput('null');
      console.log(urlInput);
      setIsChecked(true);
    }
  };

  const handleInput = (e) => {
    e.preventDefault();
    setUrlInput(e.target.value);
  };

  useEffect(() => {
    if (shopsFromUpdate.length !== 0) {
      const filterOld = shopsFromUpdate.filter((item) => item.shopName === shopName);
      if (filterOld[0].shopUrl.length >= 10) {
        setIsChecked(true);
        setUrlInput(filterOld[0].shopUrl);
      }
    }
  }, [shopsFromUpdate, shopName]);

  return (
    <div>
      <label className='relative inline-flex items-center mb-2 cursor-pointer'>
        <input type='checkbox' value='' className='sr-only peer' checked={isChecked} onChange={handleHide} />
        <div className="w-11 h-6 bg-gray-200 rounded-full peer peer-focus:ring-4 peer-focus:ring-blue-300 dark:peer-focus:ring-blue-800 dark:bg-gray-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-0.5 after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-blue-600"></div>
        <span className='ml-3 text-sm font-medium text-gray-900 dark:text-gray-300'>{shopName}</span>
      </label>
      {isChecked && (
        <div className='py-2'>
          <label htmlFor={shopUrl} className='pr-3 w-full max-w-xs'>
            URL for {shopName}
          </label>
          <input type='text' id={shopUrl} name={shopUrl} className='rounded-lg w-full max-w-xs' value={urlInput} onChange={handleInput} />
        </div>
      )}
    </div>
  );
}
