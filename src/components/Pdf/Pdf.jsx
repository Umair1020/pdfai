import React, { useEffect, useState } from "react";
import Loader from "./Loader";
import { Document, Page, pdfjs } from "react-pdf";
import { useLocation } from "react-router-dom";
import ControlPanel from "./ControlPanel";
import "./pdf.css";
import { baseurl } from "../../utils/BaseUrl";
import axios from "axios";
pdfjs.GlobalWorkerOptions.workerSrc = `//cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjs.version}/pdf.worker.js`;
import { useParams } from "react-router-dom";
import { useFile } from "../../FIleContext";
const PDFReader = ({ path }) => {
  const resolvePath = `https://anywhere.synapssolutions.com/${path}`;
  const { setFile } = useFile();
  const { id } = useParams();
  const [list, setList] = useState([]);
  const pathname = useLocation();
  const newName = pathname.pathname;
  const [scale, setScale] = useState(1.0);
  const [numPages, setNumPages] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [url, setUrl] = useState("");
  const [singleurl, setSingleUrl] = useState("");
  const [pageNumber, setPageNumber] = useState(1);

  const getMultiplePdf = async () => {
    try {
      const { data } = await axios.get(`${baseurl}/api/pdf/multiplePdf/${id}`);

      if (data.paths && data.paths.length > 0) {
        // Use Promise.all to wait for all promises to be resolved
        const setFilePromises = data.paths.map(async (path) => {
          const filePath = `${baseurl}/${path}`;
          await setFile(filePath);
          return filePath;
        });

        // Set single URL and URL after all promises are resolved
        const resolvedFilePaths = await Promise.all(setFilePromises);

        // Set srcFile to the first resolved file path
        setSingleUrl(
          `https://anywhere.synapssolutions.com/${resolvedFilePaths[0]}`
        );
        setUrl(`https://anywhere.synapssolutions.com/${resolvedFilePaths[0]}`);
      }

      setList(data.paths);
    } catch (error) {
      console.error("Error fetching multiple PDF:", error);
    }
  };

  useEffect(() => {
    getMultiplePdf();
  }, []);

  function onDocumentLoadSuccess({ numPages }) {
    setNumPages(numPages);
    setIsLoading(false);
  }

  function onDocumentLoadError(error) {
    console.error("Failed to load the document:", error.message);
    setIsLoading(false);
  }
  const handleSelectChange = (event) => {
    const selectedPath = event.target.value;
    const selectedUrl = `https://anywhere.synapssolutions.com/${baseurl}/${selectedPath}`;
    setUrl(selectedUrl);
    setSingleUrl(selectedUrl);
  };

  const srcFile = singleurl ? singleurl : url;
  const presentFile = srcFile ? srcFile : resolvePath;
  return (
    <div>
      <section
        id="pdf-section"
        className="pdf-container d-flex flex-column align-items-center w-100"
      >
        {newName === `/chatwithmultiple/${id}` ? (
          <div class="selectdiv">
            <label className="" style={{width: "300px"}}>
              <select className="select" onChange={handleSelectChange}>
                {list.map((path, index) => (
                  <option className="option" key={index} value={path}>
                    {path}
                  </option>
                ))}
              </select>
            </label>
          </div>
        ) : (
          ""
        )}
        <Document
          key={srcFile} // Add key prop here
          file={presentFile}
          onLoadSuccess={onDocumentLoadSuccess}
          onLoadError={onDocumentLoadError}
          loading={<Loader isLoading={true} />}
        >
          {Array.from({ length: numPages }, (_, index) => (
            <Page
              key={`page_${index + 1}`}
              pageNumber={index + 1}
              scale={scale}
              renderMode="canvas"
              renderTextLayer={false}
              inputRef={(ref) => {
                if (ref) {
                  ref.style.height = `100vh`;
                }
              }}
              width={
                newName === "/resumescanner" || newName === "/invoicescanner"
                  ? 500
                  : 700
              }
            />
          ))}
        </Document>
        {/* ... (rest of the component) */}
      </section>
    </div>
  );
};

export default PDFReader;
