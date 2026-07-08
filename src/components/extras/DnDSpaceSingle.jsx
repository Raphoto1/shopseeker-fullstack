"use client";
//imports de app
import Image from "next/image";
import { useEffect, useState } from "react";
import { useDropzone } from "react-dropzone";

export default function DnDSpaceSingle({ files, setFiles }) {
  //file y set file se ajusta en el padre
  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    maxFiles: 1,
    accept: {
      "image/*": [],
    },
    onDrop: (acceptedFiles) => {
      setFiles(
        acceptedFiles.map((file) =>
          Object.assign(file, {
            preview: URL.createObjectURL(file),
          })
        )
      );
    },
  });

  useEffect(() => {
    // Make sure to revoke the data uris to avoid memory leaks, will run on unmount
    return () => files.forEach((file) => URL.revokeObjectURL(file.preview));
  }, [files]);

  return (
    <div {...getRootProps()} className={`w-full rounded-lg border-2 border-dashed transition-colors cursor-pointer ${
      isDragActive 
        ? 'border-primary bg-primary/10' 
        : 'border-base-300 bg-transparent hover:border-primary/50'
    }`}>
      <input {...getInputProps()} />
      
      {files.length > 0 ? (
        <div className='p-8 flex flex-col items-center justify-center gap-4'>
          <div className='relative w-full max-w-xs aspect-square bg-base-200 rounded-lg overflow-hidden'>
            <img
              src={files[0].preview}
              alt={files[0].name}
              className='w-full h-full object-cover'
              onLoad={() => URL.revokeObjectURL(files[0].preview)}
            />
            <div className='absolute inset-0 bg-black/20 opacity-0 hover:opacity-100 transition-opacity flex items-center justify-center'>
              <p className='text-white font-semibold'>Click to change</p>
            </div>
          </div>
          <div className='text-center'>
            <p className='font-semibold'>{files[0].name}</p>
            <p className='text-xs text-base-content/60'>Click to replace</p>
          </div>
        </div>
      ) : (
        <div className='p-8 flex flex-col items-center justify-center gap-3'>
          <div className='text-3xl'>📁</div>
          <p className='font-semibold'>Drag and drop your image here</p>
          <p className='text-xs text-base-content/60'>or click to select</p>
        </div>
      )}
    </div>
  );
}
