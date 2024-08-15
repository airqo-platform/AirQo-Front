import GoodAir from '@/icons/Charts/GoodAir';
import Hazardous from '@/icons/Charts/Hazardous';
import Moderate from '@/icons/Charts/Moderate';
import Unhealthy from '@/icons/Charts/Unhealthy';
import UnhealthySG from '@/icons/Charts/UnhealthySG';
import VeryUnhealthy from '@/icons/Charts/VeryUnhealthy';
import UnknownAQ from '@/icons/Charts/Invalid';
import WindIcon from '@/icons/Common/wind.svg';
import CustomTooltip from '../Tooltip';
import { useWindowSize } from '@/lib/windowSize';
import { capitalizeAllText } from '@/core/utils/strings';

const AQNumberCard = ({
  reading,
  location,
  pollutant,
  count,
  locationFullName,
  isLoading = false,
}) => {
  let airQualityText = '';
  let AirQualityIcon = null;
  const window = useWindowSize().width;

  if (reading >= 0 && reading <= 12) {
    airQualityText = 'Air Quality is Good';
    AirQualityIcon = GoodAir;
  } else if (reading > 12 && reading <= 35.4) {
    airQualityText = 'Air Quality is Moderate';
    AirQualityIcon = Moderate;
  } else if (reading > 35.4 && reading <= 55.4) {
    airQualityText = 'Air Quality is Unhealthy for Sensitive Groups';
    AirQualityIcon = UnhealthySG;
  } else if (reading > 55.4 && reading <= 150.4) {
    airQualityText = 'Air Quality is Unhealthy';
    AirQualityIcon = Unhealthy;
  } else if (reading > 150.4 && reading <= 250.4) {
    airQualityText = 'Air Quality is Very Unhealthy';
    AirQualityIcon = VeryUnhealthy;
  } else if (reading > 250.4 && reading <= 500) {
    airQualityText = 'Air Quality is Hazardous';
    AirQualityIcon = Hazardous;
  } else {
    airQualityText = 'Air Quality is Unknown';
    AirQualityIcon = UnknownAQ;
  }

  return (
    <div
      className={`${count <= 2 ? 'w-full md:min-w-[200px] md:max-w-[50%] float-left' : 'w-full'} ${
        isLoading && 'animate-pulse'
      } relative h-[164.48px] flex-col justify-start items-center inline-flex`}>
      <div className='border border-gray-200 rounded-lg overflow-hidden w-full shadow-sm'>
        <div className='self-stretch w-full h-[68.48px] px-4 pt-3.5 pb-[10.48px] bg-white flex-col justify-start items-start flex'>
          <div className='self-stretch justify-between items-center inline-flex'>
            <div className='flex-col justify-start items-start inline-flex'>
              {location !== '--' ? (
                <div
                  className='text-gray-700 text-base font-medium leading-normal whitespace-nowrap overflow-ellipsis'
                  title={capitalizeAllText(locationFullName)}>
                  {capitalizeAllText(
                    location.length > 17 ? location.slice(0, 17) + '...' : location,
                  )}
                </div>
              ) : (
                <div className='text-gray-700 text-base font-medium leading-normal whitespace-nowrap overflow-ellipsis'>
                  {capitalizeAllText(
                    location.length > 17 ? location.slice(0, 17) + '...' : location,
                  )}
                </div>
              )}
            </div>
          </div>
        </div>
        <div className='self-stretch w-full pl-4 pr-5 py-4 bg-white justify-between items-center inline-flex gap-4'>
          <div className='flex-col justify-start items-start gap-0.5 inline-flex'>
            <div className='flex-col justify-start items-start gap-0.5 flex'>
              <div className='justify-start items-center gap-0.5 inline-flex'>
                <div className='p-[2.62px] bg-slate-100 rounded-[18.35px] justify-center items-center flex'>
                  <WindIcon width='10.48px' height='10.48px' />
                </div>
                <div className='text-slate-400 text-sm font-medium leading-tight'>
                  {pollutant === 'pm2_5' ? 'PM2.5' : 'PM10'}
                </div>
              </div>
              <div className='text-gray-700 text-[28px] font-extrabold leading-7'>
                {typeof reading === 'number' ? reading.toFixed(2) : reading}
              </div>
            </div>
          </div>
          <div className='absolute right-3 bottom-1 z-10'>
            <CustomTooltip tooltipsText={airQualityText} position={window > 1024 ? 'top' : 'left'}>
              <div className='w-16 h-16 justify-center items-center flex'>
                {AirQualityIcon && <AirQualityIcon />}
              </div>
            </CustomTooltip>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AQNumberCard;
