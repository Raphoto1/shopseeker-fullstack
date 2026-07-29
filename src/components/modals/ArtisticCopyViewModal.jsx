import React from "react";
import Link from "next/link";
import ContactForm from "@/components/contact/ContactForm";

const pickFirst = (obj, keys, fallback = "") => {
  for (const key of keys) {
    const value = obj?.[key];
    if (value !== undefined && value !== null && `${value}`.trim() !== "") {
      return value;
    }
  }
  return fallback;
};

const normalizePaymentOptions = (value) => {
  if (!value) return [];
  if (Array.isArray(value)) {
    return value.map((item) => `${item}`.trim()).filter(Boolean);
  }
  return `${value}`
    .split(/[|,;/]/)
    .map((item) => item.trim())
    .filter(Boolean);
};

const formatPrice = (price, currency = "USD") => {
  const numericPrice = Number(price);
  if (!Number.isFinite(numericPrice) || numericPrice <= 0) {
    return "Price on request";
  }

  try {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency,
      maximumFractionDigits: 2,
    }).format(numericPrice);
  } catch {
    return `${numericPrice} ${currency}`;
  }
};

const parsePositiveNumber = (value) => {
  if (value === undefined || value === null || `${value}`.trim() === "") {
    return null;
  }
  const parsed = Number(value);
  if (!Number.isFinite(parsed) || parsed < 0) {
    return null;
  }
  return parsed;
};

const parseBooleanFlag = (value) => {
  if (typeof value === "boolean") return value;
  const normalized = `${value ?? ""}`.trim().toLowerCase();
  if (["true", "1", "yes", "si", "y"].includes(normalized)) return true;
  if (["false", "0", "no", "n"].includes(normalized)) return false;
  return null;
};

export default function ArtisticCopyViewModal({ id, children, triggerClassName = "", designData = {}, artisticData = {} }) {
  const editionTypeRaw = `${pickFirst(artisticData, ["editionType", "artVersionType", "versionType", "type"], "").toLowerCase()}`;
  const isSerialRaw = parseBooleanFlag(pickFirst(artisticData, ["isSerial", "serial"], ""));
  const isUniqueLegacy = parseBooleanFlag(pickFirst(artisticData, ["isUnique", "unique", "oneOfOne"], ""));
  const looksUniqueByText = editionTypeRaw.includes("unique") || editionTypeRaw.includes("unica") || editionTypeRaw.includes("1/1");
  const isUnique = isSerialRaw !== null ? !isSerialRaw : isUniqueLegacy !== null ? isUniqueLegacy : looksUniqueByText;

  const title = designData.title || `Artwork ${id}`;
  const technique = pickFirst(artisticData, ["technique", "medium", "category"], designData.category || "Not specified");
  const support = pickFirst(artisticData, ["support", "surface", "canvas"], "Not specified");
  const dimensions = pickFirst(artisticData, ["dimensions", "size", "measures"], "Not Specified");
  const framedDimensions = pickFirst(artisticData, ["framedDimensions", "dimensionsWithFrame", "frameDimensions"], "Not Specified");
  const series = pickFirst(artisticData, ["series", "collection", "seriesName"], "Independent piece");
  const year = pickFirst(artisticData, ["year", "creationYear", "yearOfCreation"], "Not Specified");
  const serialNumber = pickFirst(artisticData, ["serialNumber", "editionNumber", "serialCode"], "Not Specified");
  const hasCertificate = parseBooleanFlag(pickFirst(artisticData, ["certificateOfAuthenticity", "certificate"], ""));
  const signedByArtist = parseBooleanFlag(pickFirst(artisticData, ["signedByArtist", "signed"], ""));

  const totalCopiesRaw = pickFirst(artisticData, ["totalCopies", "copies", "numberOfCopies", "editionSize", "limit"], "");
  const copyNumberRaw = pickFirst(artisticData, ["copyNumber", "editionNumber", "serialNumber", "copy"], "");
  const totalCopies = `${totalCopiesRaw}`.trim();
  const copyNumber = `${copyNumberRaw}`.trim();
  const totalCopiesNum = parsePositiveNumber(totalCopiesRaw);
  const availableCopiesRaw = pickFirst(artisticData, ["copiesLeft", "availableCopies", "editionStock", "stock", "remaining"], "");
  const availableCopiesNum = parsePositiveNumber(availableCopiesRaw);
  const soldCopiesRaw = pickFirst(artisticData, ["soldCopies", "sold", "reservedCopies"], "");
  const soldCopiesNum = parsePositiveNumber(soldCopiesRaw);
  const computedAvailable = totalCopiesNum !== null && soldCopiesNum !== null ? Math.max(totalCopiesNum - soldCopiesNum, 0) : null;
  const copiesAvailable = availableCopiesNum !== null ? availableCopiesNum : computedAvailable;
  const hasSeriesStock = !isUnique && copiesAvailable !== null;

  let stockBadge = "Stock not specified";
  let stockBadgeClass = "badge-ghost";
  if (hasSeriesStock) {
    if (copiesAvailable === 0) {
      stockBadge = "Sold out";
      stockBadgeClass = "badge-error";
    } else if (copiesAvailable <= 3) {
      stockBadge = "Few copies left";
      stockBadgeClass = "badge-warning";
    }
  } else {
    stockBadge = "Available";
    stockBadgeClass = "badge-success";
  }

  const editionLabel = isUnique ? "Unique version" : "Limited copies";
  const editionDetail = isUnique
    ? "Only one original artistic version is available."
    : copyNumber && totalCopies
      ? `Copy ${copyNumber} of ${totalCopies}`
      : totalCopies
        ? `${totalCopies} copies in this edition`
        : "Limited edition details on request";

  const currency = pickFirst(artisticData, ["currency"], "USD");
  const finalPrice = pickFirst(artisticData, ["price", "finalPrice", "amount"], designData.price);
  const priceLabel = formatPrice(finalPrice, currency);

  const paymentOptions = normalizePaymentOptions(
    pickFirst(artisticData, ["paymentOptions", "paymentMethods", "payment", "payments"], "Bank transfer, card, PayPal")
  );

  const availability = pickFirst(artisticData, ["availability", "status"], isUnique ? "Available" : "Not specified");
  const shippingScope = pickFirst(artisticData, ["shippingScope", "shipping", "deliveryScope"], "Not Specified");
  const deliveryTime = pickFirst(artisticData, ["deliveryTime", "leadTime"], "Not Specified");

  return (
    <>
      <button type='button' className={triggerClassName} onClick={() => document.getElementById(`my_modal_${id}`).showModal()}>
        {children}
      </button>
      <dialog id={`my_modal_${id}`} className='modal modal-middle'>
        <div className='modal-box w-11/12 max-w-2xl border border-base-300 bg-base-100 p-0'>
          <div className='rounded-t-2xl bg-gradient-to-r from-base-200 via-base-100 to-base-200 px-6 py-5'>
            <div className='flex flex-wrap items-center justify-between gap-3'>
              <div>
                <p className='text-xs uppercase tracking-[0.2em] text-base-content/60'>Artistic Version</p>
                <h3 className='text-2xl font-bold text-base-content'>{title}</h3>
              </div>
              <span className='badge badge-primary badge-lg'>{editionLabel}</span>
            </div>
            <p className='mt-2 text-sm text-base-content/70'>{editionDetail}</p>
          </div>

          <div className='space-y-5 px-6 py-5'>
            <div className='grid grid-cols-1 gap-3 sm:grid-cols-2'>
              <div className='rounded-xl border border-base-300 bg-base-200/40 p-3'>
                <p className='text-xs uppercase tracking-wide text-base-content/60'>Technique</p>
                <p className='text-sm font-medium text-base-content'>{technique}</p>
              </div>
              <div className='rounded-xl border border-base-300 bg-base-200/40 p-3'>
                <p className='text-xs uppercase tracking-wide text-base-content/60'>Support</p>
                <p className='text-sm font-medium text-base-content'>{support}</p>
              </div>
              <div className='rounded-xl border border-base-300 bg-base-200/40 p-3'>
                <p className='text-xs uppercase tracking-wide text-base-content/60'>Dimensions</p>
                <p className='text-sm font-medium text-base-content'>{dimensions}</p>
              </div>
              <div className='rounded-xl border border-base-300 bg-base-200/40 p-3'>
                <p className='text-xs uppercase tracking-wide text-base-content/60'>Framed Dimensions</p>
                <p className='text-sm font-medium text-base-content'>{framedDimensions}</p>
              </div>
            </div>

            <div className='rounded-xl border border-base-300 bg-base-200/40 p-4'>
              <p className='text-xs uppercase tracking-wide text-base-content/60 mb-2'>Edition Details</p>
              <div className='space-y-1 text-sm'>
                <p><span className='text-base-content/60'>Series:</span> {series}</p>
                <p><span className='text-base-content/60'>Year:</span> {year}</p>
                <p><span className='text-base-content/60'>Serial Number:</span> {serialNumber}</p>
                {hasCertificate && <p><span className='text-base-content/60'>Certificate:</span> Included</p>}
                {signedByArtist && <p><span className='text-base-content/60'>Signed:</span> Yes</p>}
              </div>
            </div>

            <div className='space-y-4'>
              <div className='flex flex-wrap items-center justify-between gap-3'>
                <div className='flex flex-col'>
                  <p className='text-xs uppercase tracking-wide text-base-content/60'>Price</p>
                  <p className='text-2xl font-extrabold text-primary'>{priceLabel}</p>
                </div>
                <div className='badge badge-outline'>{availability}</div>
              </div>

              {!isUnique ? (
                <div className='mt-3 rounded-xl border border-base-300 bg-base-100/70 p-3'>
                  <div className='flex flex-wrap items-center justify-between gap-2'>
                    <div className='flex flex-col'>
                      <p className='text-xs uppercase tracking-wide text-base-content/60'>Series stock</p>
                      <p className='font-semibold text-base-content'>
                        {hasSeriesStock ? `${copiesAvailable} copies available` : "Copies available on request"}
                      </p>
                    </div>
                    <div className={`badge ${stockBadgeClass}`}>{stockBadge}</div>
                  </div>
                </div>
              ) : null}

              <div className='mt-3'>
                <p className='mb-1 text-xs uppercase tracking-wide text-base-content/60'>Payment options</p>
                <div className='flex flex-wrap gap-2'>
                  {paymentOptions.map((option, index) => (
                    <span key={`${option}-${index}`} className='badge badge-neutral badge-outline'>
                      {option}
                    </span>
                  ))}
                </div>
              </div>

              <div className='mt-4 flex flex-wrap gap-2'>
                <Link href='/buy' target='_blank' rel='noreferrer' className='btn btn-primary btn-sm'>
                  View purchase details
                </Link>
                <ContactForm />
              </div>
            </div>
          </div>
        </div>
      </dialog>
    </>
  );
}
