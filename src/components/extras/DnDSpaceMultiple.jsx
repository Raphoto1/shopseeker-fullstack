"use client";
//imports de app
import Image from "next/image";
import { useCallback, useEffect, useState } from "react";
import { useDropzone } from "react-dropzone";

export default function DnDSpaceMultiple({ files, setFiles }) {
  //file y set file se ajusta en el padre
    const { getRootProps, getInputProps, isDragActive } = useDropzone({
      maxFiles: 4,
      accept: {
        'image/*': []
      },
      onDrop: acceptedFiles => {
        setFiles(acceptedFiles.map(file => Object.assign(file, {
          preview: URL.createObjectURL(file)
        })));
      }
    });
  
    useEffect(() => {
      // Make sure to revoke the data uris to avoid memory leaks, will run on unmount
      return () => files.forEach(file => URL.revokeObjectURL(file.preview));
    }, []);
  
    return (
      <div {...getRootProps()} className={`w-full p-8 rounded-lg border-2 border-dashed transition-colors cursor-pointer text-center ${
        isDragActive 
          ? 'border-primary bg-primary/10' 
          : 'border-base-300 bg-transparent hover:border-primary/50'
      }`}>
        <input {...getInputProps()} />
        
        <div className='flex flex-col items-center justify-center gap-3'>
          {files.length > 0 ? (
            <>
              <div className='text-3xl'>✅</div>
              <p className='font-semibold'>{files.length} image{files.length !== 1 ? 's' : ''} selected</p>
              <p className='text-xs text-base-content/60'>Click to change or drop more images</p>
            </>
          ) : (
            <>
              <div className='text-3xl'>📁</div>
              <p className='font-semibold'>Drag and drop images here</p>
              <p className='text-xs text-base-content/60'>Max 4 images, or click to select</p>
            </>
          )}
        </div>

        {/* PREVIEW */}
        {files.length > 0 && (
          <div className='mt-6 grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3'>
            {files.map((file) => (
              <div key={file.name} className='relative aspect-square rounded-lg overflow-hidden bg-base-200 border border-base-300'>
                <img
                  src={file.preview}
                  alt={file.name}
                  className='w-full h-full object-cover'
                  onLoad={() => { URL.revokeObjectURL(file.preview) }}
                />
              </div>
            ))}
          </div>
        )}
      </div>
    );
}
