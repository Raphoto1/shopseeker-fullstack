"use client";
//imports de app
import { useCallback, useEffect, useState } from "react";
import { useDropzone } from "react-dropzone";

// const thumbsContainer = {
//   display: 'flex',
//   flexDirection: 'row',
//   flexWrap: 'wrap',
//   marginTop: 16
// };

const thumb = {
  display: 'inline-flex',
  borderRadius: 2,
  border: '1px solid #eaeaea',
  marginTop:5,
  marginBottom: 5,
  marginRight: 8,
  width: 'auto',
  height: '100%',
  padding: 2,
  boxSizing: 'border-box'
};

const thumbInner = {
  height:'auto',
  display: 'flex',
  minWidth: 0,
  overflow: 'hidden'
};

const img = {
  display: 'block',
  width: 'auto',
  height: '100%'
};

export default function DnDSpaceMultiple(props) {
    const [files, setFiles] = useState([]);
    const {getRootProps, getInputProps} = useDropzone({
      maxFiles:6,
      accept: {
        'image/*': []
      },
      onDrop: acceptedFiles => {
        setFiles(acceptedFiles.map(file => Object.assign(file, {
          preview: URL.createObjectURL(file)
        })));
      }
    });
    
    const thumbs = files.map(file => (
      <div className="block self-center border-2 rounded-md border-gray-50"  key={file.name}>
        <div style={thumbInner}>
          <img
            src={file.preview}
            style={img}
            // Revoke data uri after image is loaded
            onLoad={() => { URL.revokeObjectURL(file.preview) }}
          />
        </div>
      </div>
    ));
  
    useEffect(() => {
      // Make sure to revoke the data uris to avoid memory leaks, will run on unmount
      return () => files.forEach(file => URL.revokeObjectURL(file.preview));
    }, []);
  
    return (
      <section className="container border-2 bg-slate-200 p-2 rounded-md">
        <div className="">
          <div {...getRootProps({className: 'dropzone'})} className="bg-slate-100 border-2 border-slate-300 rounded-md">
            <input {...getInputProps({name:props.name})} multiple={true} />
            <p className="text-center">Drag 'n' drop max 4 Images, or click to select files</p>
          </div>
          <div  className="grid grid-flow-row xl:grid-cols-2 md:grid-cols-2 sm:grid-cols-2 xs:grid-cols-2 gap-2 px-1 pt-2">
            {thumbs}
          </div>
        </div>
      </section>
    );
}
