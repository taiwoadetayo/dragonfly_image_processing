// App.tsx

import DocumentUpload from './views/DocumentUpload';
import { ToastContainer } from 'react-toastify';

function App() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="bg-white p-8 rounded shadow-lg">
        <h1 className="text-xl font-semibold ">James Chase Consulting</h1>
        <p className='mb-4 underline'>JavaScript Technical Exercise</p>

        <DocumentUpload />
        <ToastContainer />

        <p className='text-xs text-center mt-12'>Prepared By: Adetayo TAIWO</p>
      </div>
    </div>
  );
}

export default App;
