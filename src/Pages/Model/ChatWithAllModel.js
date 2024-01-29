import React, { useState } from "react";
import "./model.css";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { FaCloudUploadAlt } from "react-icons/fa";
import { ToastContainer, toast } from "react-toastify";
import { useFile } from "../../FIleContext";
import { baseurl } from "../../utils/BaseUrl";
const ChatWithAllModel = ({ hide, namePdf }) => {
  const navigate = useNavigate();
  const { setFile, file } = useFile();
  const [name, setName] = useState("");
  const [isOcrChecked, setIsOcrChecked] = useState(false);
  const [activeButton, setActiveButton] = useState("document");
  const [showFileUpload, setShowFileUpload] = useState(true);
  const formdata = new FormData();
  formdata.append("pdfDoc", file);

  const handleFileChange = async (event) => {
    const files = event.target.files;

    // Clear existing files in the formdata
    formdata.delete("pdfDoc");

    // Assuming you want to handle multiple files, append each file to the formdata
    for (let i = 0; i < files.length; i++) {
      formdata.append("pdfDocs", files[i]);
    }
  };

  const [uploadProgress, setUploadProgress] = useState(0);
  const [loading, setLoading] = useState(false);

  const handleUrl = async () => {
    try {
      const config = {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      };

      setLoading(true);

      const res = await axios.post(
        `${baseurl}/api/pdf/storeMultipleDocs`,
        formdata,
        config
      );

      console.log("File upload complete:", res.data);

      if (res.status === 200) {
        navigate(`/chatwithmultiple/${res.data.id}`);
      }

      // Rest of your code...
    } catch (error) {
      console.error("Error uploading files:", error.message);
    }
  };

  // ... (the rest of your existing code)

  const toggleSections = (uploadType) => {
    if (uploadType === "document") {
      setShowFileUpload(true);
      setActiveButton("document");
    } else if (uploadType === "url") {
      setShowFileUpload(false);
      setActiveButton("url");
    }
  };

  return (
    <div className="sc-f44562c1-0 boSApP">
      <ToastContainer />

      <div
        className="sc-f44562c1-1 cseGOX my-3"
        style={{ maxWidth: "700px", margin: "auto" }}
        data-show=""
      >
        <div
          style={{
            display: "flex",
            justifyContent: "end",
            alignItems: "flex-end",
          }}
        >
          <button
            onClick={hide}
            style={{
              backgroundColor: "transparent",
              border: "none",
              cursor: "pointer",
              fontSize: "1.5rem",
              fontWeight: "bold",
              color: "#333",
            }}
          >
            X
          </button>
        </div>
        <div
          style={{
            display: "flex",
            gap: "4px",
            padding: "4px",
            marginBlock: "24px",
            background: "rgb(246, 246, 248)",
            borderRadius: "24px",
            width: " fit-content",
          }}
        >
          <button
            style={
              activeButton === "document"
                ? {
                    background: "rgb(255, 255, 255)",
                    padding: "8px 16px",
                    boxShadow:
                      "rgba(47, 43, 67, 0.1) 0px 1px 3px, rgba(47, 43, 67, 0.1) 0px -1px 0px inset",
                    borderRadius: "24px",
                    cursor: "pointer",
                  }
                : {
                    background: "transparent",
                    padding: "8px 16px",
                    borderRadius: "0px",
                    cursor: "pointer",
                  }
            }
            className=""
            onClick={() => toggleSections("document")}
          >
            Upload by Document
          </button>
          <button
            style={
              activeButton === "url"
                ? {
                    background: "rgb(255, 255, 255)",
                    padding: "8px 16px",
                    boxShadow:
                      "rgba(47, 43, 67, 0.1) 0px 1px 3px, rgba(47, 43, 67, 0.1) 0px -1px 0px inset",
                    borderRadius: "24px",
                    cursor: "pointer",
                  }
                : {
                    background: "transparent",
                    padding: "8px 16px",
                    borderRadius: "0px",
                    cursor: "pointer",
                  }
            }
            className=""
            onClick={() => toggleSections("url")}
          >
            Upload by URL
          </button>
        </div>
        <p className="sc-ebf96a8a-1 bYmorg"></p>
        <div>
          <div className="space-y-4" style={{ cursor: "pointer" }}>
            {showFileUpload && (
              <div
                className="h-40 w-full relative text-center file-upload-section"
                style={{ cursor: "pointer" }}
              >
                <input
                  className="cursor-pointer hidden"
                  style={{ cursor: "pointer" }}
                  type="file"
                  id="input-file-upload"
                  required
                  multiple
                  accept="application/pdf"
                  onChange={handleFileChange}
                />
                <label
                  style={{ cursor: "pointer" }}
                  className="h-full flex items-center justify-center border rounded transition-all bg-white border-dashed border-stone-300"
                  for="input-file-upload"
                >
                  <div className="cursor-pointer mx-auto">
                    <FaCloudUploadAlt className="mx-auto fs-2" />
                    <p className="pointer-events-none font-medium text-base leading-6 pointer opacity-75">
                      Click to upload or drag and drop
                    </p>
                  </div>
                </label>
              </div>
            )}
            {/* <div className="flex items-center">
              <div className="flex-grow border-t border-gray-200"></div>

              <span className="flex-shrink mx-4 uppercase text-gray-600 text-xs">
                or
              </span>

              <div className="flex-grow border-t border-gray-200"></div>
            </div> */}
            {!showFileUpload && (
              <>
                <div className="flex flex-col space-y-2 url-input-section">
                  <label className="pointer-events-none font-medium text-base leading-6 pointer opacity-75">
                    Import from URL
                  </label>
                  <div className="sc-1c859520-0 jHAXMR ">
                    <input
                      className="sc-1c859520-1 cvZGAj grow text-sm"
                      type="url"
                      placeholder="https://cdn.openai.com/papers/gpt-4.pdf"
                      value=""
                    />
                  </div>
                </div>
                <div className="flex justify-between items-center py-1 space-x-3">
                  <button
                    type="button"
                    disabled={!file} // Disable the button if no file is selected
                    className={`sc-7ff41d46-0 aEnZv ${
                      !file ? "opacity-50" : ""
                    }`}
                    style={{ marginTop: "10px" }}
                    onClick={handleUrl}
                  >
                    Upload
                  </button>
                  <button
                    type="button"
                    className="sc-7ff41d46-0 aEnZv !bg-[#f8f5ee] !text-black/75"
                    style={{ border: "1px solid rgb(229, 227, 218)" }}
                    fdprocessedid="9z47ta"
                    onClick={hide}
                  >
                    Cancel
                  </button>
                </div>
              </>
            )}

            <div className="flex">
              <span
                aria-label="This PDF file will not be stored on our servers. 
You will only be able to chat with this document but not view it. 
This document will be removed after 7 days of inactivity."
                data-microtip-position="top"
                role="tooltip"
              ></span>
            </div>
            <div className="flex items-center space-x-3">
              <span
                aria-label="Optical character recognition.
Makes the text of a scanned document searchable."
                data-microtip-position="top"
                role="tooltip"
              >
                <span className="flex items-center">
                  <input
                    id="ocr-doc"
                    type="checkbox"
                    className="cursor-pointer w-4 h-4 accent-orange-600 bg-gray-100 border-gray-300 rounded"
                    checked={isOcrChecked}
                    onChange={(e) => setIsOcrChecked(e.target.checked)}
                  />
                  <label
                    for="ocr-doc"
                    className="cursor-pointer ml-2 text-sm font-medium text-gray-900"
                  >
                    OCR
                  </label>
                </span>
              </span>
            </div>
            <button
              type="button"
              className={`sc-7ff41d46-0 aEnZv ${loading ? "opacity-50" : ""}`}
              onClick={handleUrl}
            >
              {loading ? (
                <>
                  <span>Uploading...</span>
                  <div className="loader1"></div>
                </>
              ) : (
                <span>Upload</span>
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ChatWithAllModel;
