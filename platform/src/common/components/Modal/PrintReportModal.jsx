import { useState } from 'react';
import AlertBox from '@/components/AlertBox';
import ExportModalWrapper from './ExportModalWrapper';
import ShareIcon from '@/icons/Analytics/share.svg';
import MailIcon from '@/icons/Settings/mail.svg';
import PlusIcon from '@/icons/Settings/plus.svg';
import Button from '@/components/Button';
import { isEmpty } from 'underscore';

const PrintReportModal = ({ open, onClose, handlePrintPDF, data }) => {
  const [loading, setLoading] = useState(false);
  const [alert, setAlert] = useState({
    type: '',
    message: '',
    show: false,
  });
  const [emails, setEmails] = useState(['']);
  const [emailErrors, setEmailErrors] = useState([]);

  const handleEmailChange = (index, value) => {
    const updatedEmails = [...emails];
    updatedEmails[index] = value;
    setEmails(updatedEmails);

    if (!isEmpty(value)) {
      const updatedEmailErrors = [...emailErrors];
      updatedEmailErrors[index] = isValidEmail(value) ? '' : 'Invalid email';
      setEmailErrors(updatedEmailErrors);
    }
  };

  const handleAddEmail = () => {
    setEmails([...emails, '']);
  };

  const handleRemoveEmail = (index) => {
    const updatedEmails = [...emails];
    updatedEmails.splice(index, 1);
    setEmails(updatedEmails);
  };

  const isValidEmail = (email) => {
    // Email validation regex pattern
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    // Check if email is not empty and matches the regex pattern
    if (email && email.match(emailRegex)) {
      return true; // Email is valid and not empty
    }

    return false; // Email is either empty or invalid
  };

  const handleCancel = () => {
    setEmails(['']);
    setEmailErrors([]);
    onClose();
  };

  const downloadDataFunc = () => {
    try {
      handlePrintPDF();

      setLoading(false);
      setTimeout(() => {
        setAlert({
          type: 'success',
          message: 'Air quality data download successful',
          show: true,
        });
      }, 7000);
      handleCancel();
    } catch (err) {
      setAlert({
        type: 'error',
        message: 'An error occurred while exporting data',
        show: true,
      });
      setLoading(false);
    }
  };

  const handleDataExport = () => {
    setLoading(true);
    downloadDataFunc();
  };

  return (
    <div>
      <ExportModalWrapper
        title='Print your report'
        open={open}
        onClose={onClose}
        downloadDataFunc={handleDataExport}
        loading={loading}
        ModalIcon={ShareIcon}
        primaryButtonText='Print'
        data={data}
      >
        <div className='flex-col justify-start items-start gap-[13px] flex w-full self-stretch'>
          <AlertBox
            type={alert.type}
            message={alert.message}
            show={alert.show}
            hide={() => setAlert({ ...alert, show: false })}
          />
          {/* <div className='self-stretch pr-2 justify-start items-start gap-2.5 inline-flex'>
            <div className='text-gray-700 text-base font-medium leading-tight'>Send to email</div>
          </div> */}

          {/* {emails.map((email, index) => (
              <div key={index}>
                <div className='relative w-full' key={index}>
                  <input
                    type='text'
                    placeholder='Enter email'
                    className='input input-bordered w-full pl-9 placeholder-shown:text-secondary-neutral-light-300 text-secondary-neutral-light-800 text-sm leading-[26px] border border-secondary-neutral-light-100 bg-secondary-neutral-light-25 rounded'
                    value={email}
                    onChange={(e) => handleEmailChange(index, e.target.value)}
                  />
                  <div className='absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none'>
                    <MailIcon />
                  </div>
                  {index > 0 && (
                    <button
                      className='absolute inset-y-0 right-0 flex justify-center items-center mr-3 pointer-events-auto'
                      onClick={() => handleRemoveEmail(index)}
                    >
                      ✕
                    </button>
                  )}
                </div>
                {emailErrors[index] && email && (
                  <div className='relative flex justify-end pr-3'>
                    <span className='text-xs text-red-500'>{emailErrors[index]}</span>
                  </div>
                )}
              </div>
            ))}

            <div>
              <Button
                className='text-sm font-medium text-primary-600 leading-5 gap-2 h-5 mt-3 mb-8 w-auto pl-0'
                onClick={handleAddEmail}
              >
                <PlusIcon /> <span>Add email</span>
              </Button>
            </div> */}
        </div>
      </ExportModalWrapper>
    </div>
  );
};

export default PrintReportModal;