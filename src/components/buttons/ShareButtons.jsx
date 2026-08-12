"use client";

import { useState } from "react";
import { FaFacebookF, FaLinkedinIn, FaLink, FaTwitter, FaWhatsapp } from "react-icons/fa";

const shareNetworks = [
  {
    key: "facebook",
    label: "Share on Facebook",
    icon: <FaFacebookF size={18} />,
    buildUrl: (url) => `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}`,
  },
  {
    key: "twitter",
    label: "Share on X",
    icon: <FaTwitter size={18} />,
    buildUrl: (url, title) => `https://twitter.com/intent/tweet?url=${encodeURIComponent(url)}&text=${encodeURIComponent(title)}`,
  },
  {
    key: "linkedin",
    label: "Share on LinkedIn",
    icon: <FaLinkedinIn size={18} />,
    buildUrl: (url, title) => `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(url)}&summary=${encodeURIComponent(title)}`,
  },
  {
    key: "whatsapp",
    label: "Share on WhatsApp",
    icon: <FaWhatsapp size={18} />,
    buildUrl: (url, title) => `https://wa.me/?text=${encodeURIComponent(`${title} ${url}`)}`,
  },
];

export default function ShareButtons({ url, title, description = "" }) {
  const [copied, setCopied] = useState(false);
  const shareUrl = url || (typeof window !== "undefined" ? window.location.href : "");

  const copyToClipboard = async () => {
    if (!shareUrl) return;

    try {
      await navigator.clipboard.writeText(shareUrl);
      setCopied(true);
      window.setTimeout(() => setCopied(false), 2000);
    } catch {
      window.prompt("Copy this link:", shareUrl);
    }
  };

  const openShareWindow = (shareLink) => {
    window.open(shareLink, "_blank", "noopener,noreferrer,width=640,height=560");
  };

  const handleShare = (network) => {
    if (!shareUrl) return;

    const shareLink = network.buildUrl(shareUrl, title);
    openShareWindow(shareLink);
  };

  const handleNativeShare = async () => {
    if (!shareUrl || typeof navigator === "undefined" || !navigator.share) return;

    try {
      await navigator.share({
        title,
        text: description || title,
        url: shareUrl,
      });
    } catch {
      // Ignore shared dialog cancellation.
    }
  };

  return (
    <div className='mt-6 flex flex-wrap items-center gap-3'>
      <span className='text-sm font-bold uppercase tracking-[0.2em] text-base-content/60'>Share:</span>
      <div className='flex flex-wrap items-center gap-2'>
        {shareNetworks.map((network) => (
          <button
            key={network.key}
            type='button'
            onClick={() => handleShare(network)}
            className='btn btn-ghost btn-sm border border-base-300 hover:bg-base-200'
            aria-label={network.label}
            title={network.label}
          >
            {network.icon}
          </button>
        ))}

        <button
          type='button'
          onClick={handleNativeShare}
          className='btn btn-ghost btn-sm border border-base-300 hover:bg-base-200'
          aria-label='Share this post'
          title='Share this post'
        >
          <FaLink size={16} />
        </button>

        <button
          type='button'
          onClick={copyToClipboard}
          className='btn btn-ghost btn-sm border border-base-300 hover:bg-base-200'
          aria-label='Copy link'
          title='Copy link'
        >
          {copied ? <span className='text-success'>Copied!</span> : <FaLink size={16} />}
        </button>
      </div>
    </div>
  );
}
