import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

// tiny-alert-export
export function tinyAlert(type:string = 'close', message:string = '') {
  toast.dismiss();
  switch (type) {
    case 'info':
      toast.info(message,{
        autoClose: 70000,
      });
      break;
    case 'success':
      toast.success(message,{
        autoClose: 70000,
      });
      break;
    case 'warning':
      toast.warning(message,{
        autoClose: 70000,
      });
      break;
    case 'error':
      toast.error(message,{
        autoClose: 70000,
      });
      break;
    case 'close':
      toast.dismiss();
      break;
    default:
      toast.error(message,{
        autoClose: 70000,
      });
  }
}