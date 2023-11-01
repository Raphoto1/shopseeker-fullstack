"use client";
//imports de app
import { useState } from "react";
import { toast } from "react-toastify";
//imports propios
import { addDesignPath } from "@/enums/SuperVariables";
import DesignUploader from "@/components/design/DesignUploader";

export default function Upload() {
  return (
    <>
      <DesignUploader path={addDesignPath} method={"POST"} />
    </>
  );
}
