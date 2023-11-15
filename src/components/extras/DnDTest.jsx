import React, { useCallback, useState } from 'react'
import { useDropzone } from 'react-dropzone'

export default function DnDTest({ name }) {
  const [fileToUpload,setFileToUpload] = useState([])
  const onDrop = useCallback(acceptedFiles => {
    // Do something with the files
    setFileToUpload(
      acceptedFiles.map((file) =>
        Object.assign(file, {
          preview: URL.createObjectURL(file),
        })
      )
     );
  }, [])
  const {getRootProps, getInputProps, isDragActive} = useDropzone({onDrop})

  const thumbs = fileToUpload.map((file) => (
    <div key={file.name}>
      <div >
        <img
          src={file.preview}
          
          // Revoke data uri after image is loaded
          onLoad={() => {
            URL.revokeObjectURL(file.preview);
          }}
        />
      </div>
    </div>
  ));

  return (
    <div>
      <div {...getRootProps()}>
        <input name={name} {...getInputProps()} />
        {
          isDragActive ?
            <p>Drop the files here ...</p> :
            <p>Drag 'n' drop some files here, or click to select files</p>
        }
      </div>
      <div>
          {thumbs}
      </div>
    </div>
  )
}