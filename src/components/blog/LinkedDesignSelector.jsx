"use client";

import Image from "next/image";
import { useMemo } from "react";

export default function LinkedDesignSelector({
  availableDesigns = [],
  selectedDesignIds = [],
  setSelectedDesignIds,
  showLinkedDesign = false,
  setShowLinkedDesign,
  idPrefix = "linkedDesign",
  sectionTitle = "Linked Designs",
  sectionBadge = "Optional",
  selectLabel = "Select One or More Designs",
  showToggleLabel = "Show linked design cards in blog layouts",
  emptyDesignMessage = "No available designs found.",
}) {
  const selectedDesigns = useMemo(
    () => availableDesigns.filter((design) => selectedDesignIds.includes(String(design?._id))),
    [availableDesigns, selectedDesignIds]
  );

  const handleToggleDesign = (designId) => {
    if (typeof setSelectedDesignIds !== "function") return;

    setSelectedDesignIds((prev) => {
      const current = Array.isArray(prev) ? prev : [];
      return current.includes(designId)
        ? current.filter((item) => item !== designId)
        : [...current, designId];
    });
  };

  return (
    <div className='rounded-xl border border-base-300 bg-base-200/40 p-4'>
      <div className='mb-3 flex items-center justify-between'>
        <p className='text-sm font-semibold'>{sectionTitle}</p>
        <div className='flex items-center gap-2'>
          {sectionBadge ? <span className='badge badge-outline badge-sm'>{sectionBadge}</span> : null}
          <span className='badge badge-outline badge-sm'>{selectedDesignIds.length} selected</span>
        </div>
      </div>

      <div className='grid grid-cols-1 gap-4'>
        <div>
          <label className='label' htmlFor={`${idPrefix}Dropdown`}>
            <span className='label-text font-semibold'>{selectLabel}</span>
          </label>

          <div id={`${idPrefix}Dropdown`} className='dropdown w-full'>
            <button type='button' tabIndex={0} className='btn btn-outline w-full justify-start gap-3 normal-case'>
              {selectedDesigns.length > 0 ? (
                <>
                  <Image
                    src={selectedDesigns[0].photo}
                    alt={selectedDesigns[0].title}
                    width={40}
                    height={40}
                    className='h-10 w-10 rounded-lg object-cover'
                  />
                  <span className='truncate'>
                    {selectedDesigns[0].title}
                    {selectedDesigns.length > 1 ? ` +${selectedDesigns.length - 1}` : ""}
                  </span>
                </>
              ) : (
                <span className='text-base-content/70'>Choose designs to link...</span>
              )}
            </button>

            <ul tabIndex={0} className='dropdown-content menu z-[80] mt-2 max-h-72 w-full flex-nowrap overflow-y-auto rounded-box border border-base-300 bg-base-100 p-2 shadow-xl'>
              {availableDesigns.length > 0 ? (
                availableDesigns.map((design) => {
                  const designId = String(design._id);
                  const isSelected = selectedDesignIds.includes(designId);
                  return (
                    <li key={designId}>
                      <button
                        type='button'
                        className='flex items-center gap-3'
                        onClick={() => handleToggleDesign(designId)}
                      >
                        <input
                          type='checkbox'
                          className='checkbox checkbox-xs'
                          checked={isSelected}
                          readOnly
                        />
                        <Image
                          src={design.photo}
                          alt={design.title}
                          width={36}
                          height={36}
                          className='h-9 w-9 rounded-md object-cover'
                          loading='lazy'
                        />
                        <span className='truncate'>{design.title}</span>
                      </button>
                    </li>
                  );
                })
              ) : (
                <li>
                  <span className='text-base-content/70'>{emptyDesignMessage}</span>
                </li>
              )}
            </ul>
          </div>
        </div>

        <div className='grid grid-cols-1 gap-4 md:grid-cols-2'>
          <div>
            <label className='label' htmlFor={`${idPrefix}Ids`}>
              <span className='label-text font-semibold'>Design IDs</span>
            </label>
            <input
              id={`${idPrefix}Ids`}
              type='text'
              value={selectedDesignIds.join(", ")}
              readOnly
              className='input input-bordered w-full'
              placeholder='Selected design ids will appear here'
            />
          </div>

          <div>
            <label className='label' htmlFor={`${idPrefix}Urls`}>
              <span className='label-text font-semibold'>Design URLs</span>
            </label>
            <input
              id={`${idPrefix}Urls`}
              type='text'
              value={selectedDesigns.map((design) => `/shops/${design._id}`).join(", ")}
              readOnly
              className='input input-bordered w-full'
              placeholder='Selected design links will appear here'
            />
          </div>
        </div>
      </div>

      {typeof setShowLinkedDesign === "function" ? (
        <div className='mt-3 form-control'>
          <label className='label cursor-pointer justify-start gap-3'>
            <input
              type='checkbox'
              className='checkbox checkbox-primary checkbox-sm'
              checked={showLinkedDesign}
              onChange={(event) => setShowLinkedDesign(event.target.checked)}
            />
            <span className='label-text'>{showToggleLabel}</span>
          </label>
        </div>
      ) : null}
    </div>
  );
}
