import React, { useEffect } from 'react';
import PropTypes from 'prop-types';
import Button from '../../../Button';

const Footer = ({
  errorMessage,
  setError,
  selectedSites = [],
  handleClearSelection,
  handleSubmit,
  onClose,
  btnText = 'Download',
  loading = false, // New loading prop
}) => {
  useEffect(() => {
    if (errorMessage) {
      const timer = setTimeout(() => setError(''), 5000);
      return () => clearTimeout(timer);
    }
  }, [errorMessage]);

  return (
    <div className="bg-gray-50 absolute bottom-0 right-0 w-full px-4 py-3 sm:px-6 flex items-center justify-between">
      <div className="text-sm leading-5 font-normal">
        {errorMessage === '' ? (
          selectedSites.length === 0 ? (
            'Select locations to continue'
          ) : (
            <div>
              <span className="text-blue-600">{`${selectedSites.length} 
                          ${selectedSites.length === 1 ? 'location' : 'locations'} selected
                        `}</span>
              <button
                type="button"
                className="ml-2"
                onClick={handleClearSelection}
              >
                Clear
              </button>
            </div>
          )
        ) : (
          <span className="text-red-600">{errorMessage}</span>
        )}
      </div>
      <div className="sm:flex sm:flex-row-reverse gap-2">
        <Button
          type="button"
          variant={'filled'}
          onClick={handleSubmit}
          disabled={loading} // Disable button when loading
        >
          {loading ? (
            <div className="flex items-center gap-2">
              <span className="animate-spin w-4 h-4 border-2 border-t-transparent border-white rounded-full"></span>
              <span>Downloading...</span>
            </div>
          ) : (
            btnText
          )}
        </Button>
        <Button
          type="button"
          variant={'outlined'}
          onClick={onClose}
          disabled={loading}
        >
          Cancel
        </Button>
      </div>
    </div>
  );
};

Footer.propTypes = {
  errorMessage: PropTypes.string,
  selectedSites: PropTypes.arrayOf(PropTypes.object),
  handleClearSelection: PropTypes.func,
  handleSubmit: PropTypes.func,
  onClose: PropTypes.func,
  btnText: PropTypes.string,
  setError: PropTypes.func,
  loading: PropTypes.bool, // New prop type for loading
};

export default Footer;
