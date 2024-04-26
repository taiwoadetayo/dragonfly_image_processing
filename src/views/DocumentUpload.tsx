// DocumentUpload.tsx

import { useState, ChangeEvent, useEffect } from 'react'
import { makePOST, makeREQUEST } from '../api-services/_config.services';
import { tinyAlert } from '../utils';

function DocumentUpload() {

    // component states
    const [selectedFile, setSelectedFile] = useState<File | null>(null);
    const [presignedKey, setPresignedKey] = useState<string>("");
    // const [presignedURL, setPresignedURL] = useState<string>("");
    const [isUploaded, setIsUploaded] = useState<boolean>(false);
    const [taskID, setTaskID] = useState<string>("");


    useEffect(() => { 
        if(isUploaded){
            StartProcessing();
        }
    }, [isUploaded]);

    useEffect(() => { 
        if(!!taskID)
            CheckStatus();
    }, [taskID]);


    // handle file change for upload logic
    const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files.length > 0) {
            setSelectedFile(e.target.files[0]);
        }
    };

    //[step 1] request the presigned key && URL 
    const handleStage = () =>{
        makeREQUEST('POST', 'https://wajesmarthrms.website/dragonfly_stage.php')
        .then((res) => {

            // print success message for Presigned URL in alert;
            tinyAlert('success', 'Presigned URL available!');

            // store response in component state;
            const data = res.data;
            const presigned_URL = data.url;
            setPresignedKey(data.key);
            // setPresignedURL(data.url);

            UploadJPEGFILE(presigned_URL);

        })      
        .catch((err) => {
            console.log(err)
            tinyAlert('error', err.message);

        })
        .finally(() => {
            console.log('do nothing')
        });
    }

    //[step 2] upload file using the resigned URL
    const UploadJPEGFILE= (presigned_URL:string) =>{
        const form: any = new FormData();

        form.append('url', presigned_URL)
        form.append('file', selectedFile)

        makePOST('https://wajesmarthrms.website/dragonfly_upload.php', form)
        .then((res) => {
            setIsUploaded(true)
        })      
        .catch((err) => {
            console.log(err)
            tinyAlert('error', err.message)
        })
        .finally(() => {
            console.log('do nothing')
        });
    }

    //[step 3] process uploaded file
    const StartProcessing = () =>{
        // prepare post data
        
        const form: any = new FormData();

        form.append('key', presignedKey)

        // console.log(presignedKey, 'key')

        // const data = {
        //     "key": presignedKey,
        // }

        makeREQUEST('POST', 'https://wajesmarthrms.website/dragonfly_process.php', form)
        .then((res) => {

            // print success message for Presigned URL in alert;
            tinyAlert('success', 'Presigned URL available!');

            // store response in component state;
            const data = res.data
            setTaskID(data.taskId);

        })      
        .catch((err) => {
            console.log(err)
            tinyAlert('error', err.message);

        })
        .finally(() => {
            console.log('do nothing')
        });
            
    }

    //[step 4] check upload status
    const CheckStatus = () =>{
        // prepare post data
        const data = {
            "taskId": taskID,
        }

        makeREQUEST('POST', 'https://wajesmarthrms.website/dragonfly_status.php', data)
        .then((res) => {
            const data = res.data

            // print success message for Presigned URL in alert;
            tinyAlert('success', data.message);

        })      
        .catch((err) => {
            console.log(err)
            tinyAlert('error', err.message);

        })
        .finally(() => {
            console.log('do nothing')
        });
    }


    return (
        <div className="flex flex-col items-center justify-center mt-8">
            {/* upload label area */}
            <label htmlFor="fileInput" className="mb-4 cursor-pointer text-center">
                <svg
                    className="w-12 h-12 text-gray-400 border-2 border-dashed border-gray-400 rounded-full p-3 ml-4"
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 20 20"
                    fill="currentColor"
                >
                    <path
                    fillRule="evenodd"
                    d="M5 3a2 2 0 012-2h6a2 2 0 012 2v2h2a2 2 0 012 2v10a2 2 0 01-2 2H5a2 2 0 01-2-2V7a2 2 0 012-2h2V3zm3 4v4a1 1 0 01-1 1H6a1 1 0 01-1-1V7h2zm8 4a1 1 0 01-1 1h-1v1a1 1 0 11-2 0v-1H9a1 1 0 110-2h3V8a1 1 0 112 0v1h1a1 1 0 011 1zm-4 5a1 1 0 100-2 1 1 0 000 2z"
                    clipRule="evenodd"
                    />
                </svg>

                <span className="mt-2 text-base leading-normal text-gray-600">
                    Select a file
                </span>

            </label>

            {/* upload input:file accept image/jpeg only */}
            <input
                id="fileInput"
                type="file"
                accept="image/jpeg"
                className="hidden"
                onChange={handleFileChange}
            />

            {/* upload image handler */}
            <button
                onClick={handleStage}
                disabled={!selectedFile && !presignedKey}
                className={`${
                    selectedFile
                    ? 'bg-blue-500 hover:bg-blue-600'
                    : 'bg-gray-300 cursor-not-allowed'
                } text-white font-semibold py-2 px-4 rounded focus:outline-none focus:ring focus:ring-blue-300`}
            >
                Upload
            </button>

            {presignedKey}
            
            {/* show selected files here */}
            {selectedFile && (
            <p className="mt-4 text-sm text-gray-500">
                {selectedFile.name} - {selectedFile.size / 1000} KB
            </p>
            )}
        </div>
  );
}

export default DocumentUpload;
