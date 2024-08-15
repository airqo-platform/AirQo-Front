import React, { useRef, useCallback, useState, useEffect } from 'react';
import CustomDropdown from '@/components/Dropdowns/CustomDropdown';
import Chart from './Charts';
import DotMenuIcon from '@/icons/Actions/three-dots-menu.svg';
import { useDispatch, useSelector } from 'react-redux';
import { setChartTab, setChartType, setRefreshChart } from '@/lib/store/services/charts/ChartSlice';
import { jsPDF } from 'jspdf';
import html2canvas from 'html2canvas';
import Spinner from '@/components/Spinner';
import CheckIcon from '@/icons/tickIcon';
import PrintReportModal from '@/components/Modal/PrintReportModal';
import TabButtons from '../Button/TabButtons';

const ChartContainer = ({ chartType, chartTitle, height, width, id }) => {
  const dispatch = useDispatch();
  const chartRef = useRef(null);
  const dropdownRef = useRef(null);
  const isLoading = useSelector((state) => state.analytics.status === 'loading');
  const [openShare, setOpenShare] = useState(false);
  const [shareFormat, setShareFormat] = useState(null);
  const [loadingFormat, setLoadingFormat] = useState(null);
  const [downloadComplete, setDownloadComplete] = useState(null);
  const chartData = useSelector((state) => state.chart);

  const modifiedData = {
    startDate: chartData.chartDataRange.startDate,
    endDate: chartData.chartDataRange.endDate,
    sites: chartData.chartSites,
  };

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setDownloadComplete(null);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [downloadComplete]);

  /**
   * Export chart as an image or pdf
   * @param {string} format - The format to export the chart to
   */
  const exportChart = useCallback(async (format) => {
    try {
      setDownloadComplete(null);
      setLoadingFormat(format);
      if (!chartRef.current) return;

      const rect = chartRef.current.getBoundingClientRect();
      const extraSpace = 20;
      const width = rect.width + extraSpace;
      const height = rect.height + extraSpace;

      const canvas = await html2canvas(chartRef.current, {
        scale: 2,
        useCORS: true,
        backgroundColor: rect.backgroundColor,
        width: width,
        height: height,
        scrollX: 0,
        scrollY: 0,
      });

      const link = document.createElement('a');
      link.download = `airquality-data.${format}`;

      switch (format) {
        case 'png':
        case 'jpg':
          canvas.toBlob(
            (blob) => {
              link.href = URL.createObjectURL(blob);
              link.click();
              setLoadingFormat(null);
              setDownloadComplete(format);
            },
            `image/${format}`,
            0.8,
          );
          break;
        case 'pdf':
          const pdf = new jsPDF({
            orientation: 'landscape',
            unit: 'px',
            format: [width, height],
          });
          pdf.addImage(canvas.toDataURL('image/png', 0.8), 'PNG', 0, 0, width, height);
          pdf.save('airquality-data.pdf');
          setLoadingFormat(null);
          setDownloadComplete(format);
          break;
        default:
          throw new Error('Unsupported format');
      }
    } catch (error) {
      console.error(error);
    }
  }, []);

  const handleMoreClick = () => {
    dispatch(setChartTab(1));
    dispatch(setChartType(chartType));
  };

  const refreshChart = () => {
    dispatch(setRefreshChart(true));
    document.getElementById('options-btn').click();
  };

  const shareReport = () => {
    setOpenShare(true);
    document.getElementById('options-btn').click();
  };

  const renderDropdown = () => (
    <div ref={dropdownRef}>
      <CustomDropdown
        trigger={
          <TabButtons
            btnText='More'
            btnStyle={'py-1 px-2 rounded-xl '}
            dropdown
            onClick={handleMoreClick}
            id='options-btn'
          />
        }
        id='options'
        className='top-7 right-0'>
        {isLoading ? (
          <div className='p-2'>
            <Spinner width={20} height={20} />
          </div>
        ) : (
          <>
            <a
              onClick={() => refreshChart()}
              className='flex justify-between items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 cursor-pointer'>
              <span>Refresh</span>
            </a>
            <hr className='border-gray-200' />
            {['jpg', 'pdf'].map((format) => (
              <a
                key={format}
                onClick={() => exportChart(format)}
                className='flex justify-between items-center px-4 py-3 text-sm text-gray-700 hover:bg-gray-100 cursor-pointer'>
                <span>Export as {format.toUpperCase()}</span>
                <span className='-mr-2'>
                  {loadingFormat === format && <Spinner width={15} height={15} />}
                  {downloadComplete === format && (
                    <CheckIcon fill='#1E40AF' width={20} height={20} />
                  )}
                </span>
              </a>
            ))}
            <hr className='border-gray-200' />
            {['csv', 'pdf'].map((format) => (
              <a
                key={format}
                onClick={() => {
                  setShareFormat(format);
                  shareReport(format);
                  setDownloadComplete(null);
                }}
                className='flex justify-between items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 cursor-pointer'>
                <span>Share report as {format.toUpperCase()}</span>
              </a>
            ))}
          </>
        )}
      </CustomDropdown>
    </div>
  );

  return (
    <div
      className='border-[0.5px] bg-white rounded-xl border-grey-150 shadow-sm'
      id='analytics-chart'>
      <div className='flex flex-col items-start gap-1 w-auto h-auto p-4'>
        <div className='flex items-center justify-between w-full h-8'>
          <div className='text-lg not-italic font-medium leading-[26px]'>{chartTitle}</div>
          {renderDropdown()}
        </div>
        <div
          ref={chartRef}
          className='mt-6 -ml-[27px] relative'
          style={{
            width: width || '100%',
            height: height || '300px',
          }}>
          <Chart id={id} chartType={chartType} width={width} height={height} />
        </div>
      </div>

      <PrintReportModal
        title='Share report'
        btnText='Send'
        shareModel={true}
        open={openShare}
        onClose={() => setOpenShare(false)}
        format={shareFormat}
        data={modifiedData}
      />
    </div>
  );
};

export default ChartContainer;
