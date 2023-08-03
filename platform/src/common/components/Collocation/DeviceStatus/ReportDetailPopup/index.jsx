import { isEmpty } from 'underscore';
import DetailCard from './detail_card';
import { useRouter } from 'next/router';

const ReportDetailCard = ({ deviceName, batchId, data, open, closeModal }) => {
  const router = useRouter();
  // Adjust correlation & offset functionality
  return (
    <dialog id='report_detail_popup' className={`modal ${open && 'modal-open'} w-screen h-screen`}>
      <form
        method='dialog'
        className='modal-box p-0 overflow-hidden rounded max-w-3xl w-full h-full shadow border border-slate-100'
      >
        <div className='flex justify-between items-center p-5 border-b border-b-gray-200'>
          <div className='text-black text-base font-medium'>Status summary</div>
          <button onClick={closeModal} className='btn btn-sm btn-circle btn-ghost'>
            ✕
          </button>
        </div>
        <div className='self-stretch px-5 pt-4 sm:pb-20 pb-10 flex-col items-start gap-3.5 flex h-full overflow-y-auto'>
          {!isEmpty(data) ? (
            data.map((item, index) => (
              <DetailCard
                index={index}
                action={item.action}
                description={item.description}
                extra_message={item.extra_message}
                status={item.status}
                title={item.title}
                batchId={batchId}
                type={item.type}
                handleReportClick={() => {
                  router.push({
                    pathname: `/analytics/collocation/reports/${deviceName}`,
                    query: {
                      device: deviceName,
                      batchId: batchId,
                    },
                  });
                }}
                closeModal={closeModal}
              />
            ))
          ) : (
            <div className='text-gray-400 text-sm font-normal leading-snug flex items-center justify-center mx-auto w-full h-full'>
              No report yet. Please check later
            </div>
          )}
        </div>
      </form>
    </dialog>
  );
};

export default ReportDetailCard;
