// App.tsx

// import required components;
import DocumentUpload from './views/DocumentUpload';
import { ToastContainer } from 'react-toastify';


function App() {
  return (
    <main className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="bg-white p-8 rounded shadow-lg">
        <h1 className="text-xl font-semibold ">James Chase Consulting</h1>
        <p className='mb-4 underline'>JavaScript Technical Exercise</p>

        {/* DocumentUpload component */}
        <DocumentUpload />

        {/* feedback toast */}
        <ToastContainer />

        <p className='text-xs text-center mt-12'>Prepared By: Adetayo TAIWO</p>
      </div>
    </main>
  );
}

export default App;


// ** Instructions 
//! 1. Create a new REACT application ✔️. 
//! 2. Add any tools and frameworks you’d usually use for working with APIs ✔️. 
//! 3. Create a simple UI ✔️. 
// 4. Write code and handlers to execute the above flow. 


// ** Things to Consider 
// • How to gracefully handle errors. 
// • How to support multiple uploads and concurrency. 
// • Code quality and commenting.


// ** App uses Tailwind CSS.
