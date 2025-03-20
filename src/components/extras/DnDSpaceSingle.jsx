"use client";
//imports de app
import { useEffect, useState } from "react";
import { useDropzone } from "react-dropzone";

const thumbsContainer = {
  display: "flex",
  flexDirection: "row",
  flexWrap: "wrap",
  marginTop: 16,
  justify: "center",
  align: "middle",
  alignItems: "center",
};

const thumb = {
  display: "inline-flex",
  justify: "center",
  align:"middle",
  borderRadius: 2,
  border: "1px solid #eaeaea",
  marginBottom: 8,
  marginRight: 8,
  width: "100%",
  height: "100%",
  padding: 4,
  boxSizing: "border-box",
  alignItems: "center",
  alignItems: "center",
};

const thumbInner = {
  display: "flex",
  minWidth: 0,
  overflow: "hidden",
  justify: "center",
  align: "middle",
  borderRadius: 8,
  alignItems: "center",
};

const img = {
  display: "block",
  width: "auto",
  height: "100%",
  alignItems: "center",
};

export default function DnDSpaceSingle({ files, setFiles }) {
  //file y set file se ajusta en el padre
  const { getRootProps, getInputProps } = useDropzone({
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

  const thumbs = files.map((file) => (
    <div style={thumb} key={file.name}>
      <div style={thumbInner}>
        <img
          src={file.preview}
          style={img}
          // Revoke data uri after image is loaded
          onLoad={() => {
            URL.revokeObjectURL(file.preview);
          }}
        />
      </div>
    </div>
  ));

  useEffect(() => {
    // Make sure to revoke the data uris to avoid memory leaks, will run on unmount
    return () => files.forEach((file) => URL.revokeObjectURL(file.preview));
  }, []);

  return (
    <section className='container flex border-2 bg-slate-200 p-2 rounded-md w-1/2 justify-center align-middle text-center'>
      <div {...getRootProps({ className: "dropzone" })} className='bg-slate-100 border-2 border-slate-300 rounded-md flex justify-center align-middle text-center items-center'>
        <input {...getInputProps()} />

        {files.length > 0 ? (
          <div className='flex justify-center align-middle text-center items-center px-1'>
            <p>File uploaded: {files[0].name}</p>
          </div>
        ) : (
          <p className="px-1">Drag 'n' drop some file here, or click to select file</p>
        )}
      </div>
      <aside style={thumbsContainer}>{thumbs}</aside>
    </section>
  );
}
