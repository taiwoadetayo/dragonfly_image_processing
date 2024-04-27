// DocumentUpload.tsx

import { useState, ChangeEvent } from 'react'
import { makePOST, makeREQUEST } from '../api-services/_config.services';
import { tinyAlert } from '../utils';

function DocumentUpload() {

    // component local states
    const [selectedFiles, setSelectedFiles] =  useState<File[]>([]);
    const [selectedFilesStatus, setSelectedFilesStatus] =  useState<String[]>([]);

    //handles files selection from machine directory
    const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files.length > 0) {
            const filesArray: FileList | null = e.target.files;
            const files: File[] = Array.from(filesArray); // Convert FileList to Array
            setSelectedFiles(files);
        }
    };

    const startProcess = () => {
        // Create a new array to avoid mutating the state directly
        let updatedStatus = [...selectedFilesStatus];
    
        for(let i = 0; i < selectedFiles.length; i++) {
            updatedStatus[i] = 'START';
        }

        console.log(updatedStatus, 'i see');
    
        // Update the state only once after all changes
        setSelectedFilesStatus(updatedStatus);

        // call the state fn()
        handleStage();
    }

    //[step 1] request the presigned key && URL 
    const handleStage = () => {
        for(let i = 0; i < selectedFiles.length; i++){
            makeREQUEST('POST', 'dragonfly_stage.php')
            .then((res) => {
                const data = res.data;
                const presigned_URL = data.url;
                const presignedKey = data.key;

                
                let updatedStatus = [...selectedFilesStatus];
                updatedStatus[i] = 'PRESIGNED';
                setSelectedFilesStatus(updatedStatus);

                UploadJPEGFILE(presigned_URL, presignedKey, i);

            })      
            .catch((err) => {
                console.log(err)
                tinyAlert('error', err.message);

            })
        }

    }

    //[step 2] upload file using the resigned URL
    const UploadJPEGFILE= (presigned_URL:string, presignedKey:string, index:number) =>{
        const form: any = new FormData();

        form.append('url', presigned_URL);
        form.append('file', selectedFiles[index]);

        makePOST('dragonfly_upload.php', form)
        .then((res) => {
                            
            let updatedStatus = [...selectedFilesStatus];
            updatedStatus[index] = 'file sent!';
            setSelectedFilesStatus(updatedStatus);
            

            StartProcessing(presignedKey, index);
        })      
        .catch((err) => {
            console.log(err)
            tinyAlert('error', err.message)
        })
    }

    //[step 3] process uploaded file
    const StartProcessing = (presignedKey:string, index:number) =>{
        // prepare post data
        
        const form: any = new FormData();
        form.append('key', presignedKey);

        makeREQUEST('POST', 'dragonfly_process.php', form)
        .then((res) => {

            // print success message for Presigned URL in alert;
            // tinyAlert('success', 'Processing');
                                        
            let updatedStatus = [...selectedFilesStatus];
            updatedStatus[index] = 'processing...';
            setSelectedFilesStatus(updatedStatus);
            
            // store response in component state;
            const data = res.data
            CheckStatus(data.taskId, index);

        })      
        .catch((err) => {
            console.log(err)
            tinyAlert('error', err.message);

        })
            
    }

    //[step 4] check upload status
    const CheckStatus = (taskID:string, index:number) =>{
        // prepare post data
        const data = {
            "taskId": taskID,
        }

        makeREQUEST('POST', 'dragonfly_status.php', data)
        .then((res) => {
            const data = res.data;

            // print success message for Presigned URL in alert;
            // tinyAlert('success', data.status);

            let updatedStatus = [...selectedFilesStatus];
            updatedStatus[index] = data.status;
            setSelectedFilesStatus(updatedStatus);

            // recheck status until status is SUCCESS
            if(data.status === 'RUNNING'){

                // setInterval(() => {
                    CheckStatus(taskID, index);
                // },10000)

            }

        })      
        .catch((err) => {
            console.log(err)
            tinyAlert('error', err.message);

        })
    }


    return (
        <div className="flex flex-col items-center justify-center mt-8">

            {/* upload icon area */}
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

            {/* upload hidden input:file for label && accept image/jpeg only */}
            <input
                id="fileInput"
                type="file"
                accept="image/jpeg"
                className="hidden"
                multiple
                onChange={handleFileChange}
            />

            {selectedFiles.length > 0 && (
                <div className="mt-4 text-sm text-gray-500 text-xs">
                    {selectedFiles.map((file, index) => (
                        <div key={index} className="flex justify-between gap-6">
                            <span>{index + 1} {file.name} - {file.size / 1000} KB</span>
                            <span>({selectedFilesStatus[index]})</span>
                        </div>
                    ))}
                </div>
            )}


            {/* upload button; triggers workdlow when clicked */}
            <button
                onClick={startProcess}
                disabled={!selectedFiles.length}
                className={`${
                    !!selectedFiles.length
                    ? 'bg-blue-500 hover:bg-blue-600'
                    : 'bg-gray-300 cursor-not-allowed'
                } text-white font-semibold py-2 px-4 rounded focus:outline-none focus:ring focus:ring-blue-300 mt-6`}
            >
                Upload Image
            </button>


        </div>
    );
}

export default DocumentUpload;

//
    // const [presignedURL, setPresignedURL] = useState<string>("");
