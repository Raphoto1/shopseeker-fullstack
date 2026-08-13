import { useEffect, useState } from "react";

const ARTISTIC_COPY_FIELDS = [
  { key: "editionType", label: "Edition type", type: "select", options: ["Unique", "Limited", "Open"] },
  { key: "isSerial", label: "Is serial", type: "select", options: ["Yes", "No"] },
  { key: "serialNumber", label: "Serial / Register Number", type: "text", placeholder: "AC-2026-001", helperText: "Include the design registration number here" },
  { key: "totalCopies", label: "Total copies", type: "number", min: 0 },
  { key: "copyNumber", label: "Copy number", type: "number", min: 0 },
  { key: "availableCopies", label: "Available copies", type: "number", min: 0 },
  { key: "soldCopies", label: "Sold copies", type: "number", min: 0 },
  { key: "certificateOfAuthenticity", label: "Certificate of authenticity", type: "select", options: ["Yes", "No", "Not Applicable"] },
  { key: "signedByArtist", label: "Signed by artist", type: "select", options: ["Yes", "No", "Not Applicable"] },
  { key: "technique", label: "Technique", type: "text", placeholder: "Acrylic, oil, mixed media..." },
  { key: "support", label: "Support", type: "text", placeholder: "Canvas, paper, wood..." },
  { key: "dimensions", label: "Dimensions", type: "text", placeholder: "50x70 cm" },
  { key: "framedDimensions", label: "With frame", type: "text", placeholder: "55x75 cm" },
  { key: "series", label: "Series", type: "text", placeholder: "Collection or series name" },
  { key: "year", label: "Year of creation", type: "number", min: 1800 },
  { key: "currency", label: "Currency", type: "text", placeholder: "USD" },
  { key: "price", label: "Price", type: "number", min: 0, step: "0.01" },
  { key: "availability", label: "Availability", type: "select", options: ["Available", "Reserved", "Sold", "Out of Stock"] },
  { key: "shippingScope", label: "Shipping scope", type: "text", placeholder: "Local, national, international" },
  { key: "deliveryTime", label: "Delivery time", type: "text", placeholder: "3-7 business days" },
  { key: "paymentOptions", label: "Payment options", type: "select", options: ["Bank transfer", "Card", "PayPal", "Crypto", "Other"] },
  { key: "notes", label: "Notes", type: "textarea", placeholder: "Additional notes" },
  { key: "purchaseUrl", label: "Purchase URL", type: "text", placeholder: "Optional direct purchase link" },
];

const INITIAL_ARTISTIC_STATE = ARTISTIC_COPY_FIELDS.reduce((acc, field) => {
  acc[field.key] = "";
  return acc;
}, {});

export default function HiddenInput({ shopName, shopsFromUpdate }) {
  const shopUrl = `url${shopName}`;
  const [isChecked, setIsChecked] = useState(false);
  const [urlInput, setUrlInput] = useState("");
  const [artisticForm, setArtisticForm] = useState(INITIAL_ARTISTIC_STATE);

  const isArtisticCopy = shopName === "Artistic Copy";

  const handleArtisticInput = (fieldKey, value) => {
    setArtisticForm((prev) => ({ ...prev, [fieldKey]: value }));
  };

  const handleHide = () => {
    setIsChecked(!isChecked);
    if (urlInput) {
      setUrlInput("null");
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
      console.log(filterOld);
      if (filterOld.length === 0) {
        setIsChecked(false);
      } else {
        if (filterOld[0].shopUrl?.length >= 10) {
          setIsChecked(true);
          setUrlInput(filterOld[0].shopUrl);
        }

        if (isArtisticCopy) {
          const currentShop = filterOld[0];
          const hydratedState = ARTISTIC_COPY_FIELDS.reduce((acc, field) => {
            const value = currentShop?.[field.key];
            acc[field.key] = value === undefined || value === null ? "" : `${value}`;
            return acc;
          }, {});

          const hasArtisticData = ARTISTIC_COPY_FIELDS.some((field) => {
            const value = currentShop?.[field.key];
            return value !== undefined && value !== null && `${value}`.trim() !== "";
          });
          if (hasArtisticData) {
            setIsChecked(true);
          }

          setArtisticForm(hydratedState);
        }
      }
    }
  }, [shopsFromUpdate, shopName, isArtisticCopy]);

  return (
    <div>
      <label className='relative inline-flex items-center mb-2 cursor-pointer'>
        <input type='checkbox' value='' className='sr-only peer' checked={isChecked} onChange={handleHide} />
        <div className="w-11 h-6 bg-gray-200 rounded-full peer peer-focus:ring-4 peer-focus:ring-blue-300 dark:peer-focus:ring-blue-800 dark:bg-gray-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-0.5 after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-blue-600"></div>
        <span className='ml-3 text-sm font-medium'>{shopName}</span>
      </label>
      {isChecked && (
        <div className='py-2'>
          <label htmlFor={shopUrl} className='pr-3 w-full max-w-xs'>
            URL for {shopName}
          </label>
          <input type='text' id={shopUrl} name={shopUrl} className='rounded-lg w-full max-w-xs' value={urlInput} onChange={handleInput} />
        </div>
      )}
      {isArtisticCopy && isChecked && (
        <div className='rounded-xl border border-base-300 bg-base-100 p-3'>
          <p className='mb-3 text-xs text-base-content/70'>
            Note: for Artistic Copy you can keep URL empty and still save edition and sale details.
          </p>
          <div className='grid grid-cols-1 gap-3 md:grid-cols-2'>
            {ARTISTIC_COPY_FIELDS.map((field) => {
              const inputName = `artisticCopy__${field.key}`;
              
              // Logic: Hide isSerial, serialNumber, totalCopies, copyNumber, availableCopies if editionType is "Unique" or "Not specified" (empty string)
              if (["isSerial", "serialNumber", "totalCopies", "copyNumber", "availableCopies"].includes(field.key)) {
                if (artisticForm.editionType === "Unique" || artisticForm.editionType === "") {
                  return null;
                }
              }

              if (field.type === "select") {
                return (
                  <label key={field.key} className='form-control w-full'>
                    <span className='mb-1 text-xs font-semibold'>{field.label}</span>
                    <select
                      name={inputName}
                      value={artisticForm[field.key]}
                      onChange={(event) => handleArtisticInput(field.key, event.target.value)}
                      className='select select-bordered select-sm w-full'
                    >
                      <option value=''>Not specified</option>
                      {field.options?.map((option) => (
                        <option key={option} value={option}>{option}</option>
                      ))}
                    </select>
                  </label>
                );
              }

              if (field.type === "textarea") {
                return (
                  <label key={field.key} className='form-control w-full md:col-span-2'>
                    <span className='mb-1 text-xs font-semibold'>{field.label}</span>
                    <textarea
                      name={inputName}
                      value={artisticForm[field.key]}
                      onChange={(event) => handleArtisticInput(field.key, event.target.value)}
                      placeholder={field.placeholder || ""}
                      className='textarea textarea-bordered textarea-sm w-full'
                      rows={3}
                    />
                    {field.helperText && (
                      <p className='text-[10px] text-base-content/50 mt-1'>{field.helperText}</p>
                    )}
                  </label>
                );
              }

              return (
                <label key={field.key} className='form-control w-full'>
                  <span className='mb-1 text-xs font-semibold'>{field.label}</span>
                  <input
                    type={field.type}
                    name={inputName}
                    value={artisticForm[field.key]}
                    onChange={(event) => handleArtisticInput(field.key, event.target.value)}
                    min={field.min}
                    step={field.step}
                    placeholder={field.placeholder || ""}
                    className='input input-bordered input-sm w-full'
                  />
                  {field.helperText && (
                    <p className='text-[10px] text-base-content/50 mt-1'>{field.helperText}</p>
                  )}
                </label>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}