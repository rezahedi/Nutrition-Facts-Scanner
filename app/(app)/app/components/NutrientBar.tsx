import Image from 'next/image'
import { rateIndexColors } from '@/constants'
import { limitDecimalPlaces, getBarUIDetails, getRateByIndex, getMetric } from '@/utils'
import { ProductNutrients } from '@prisma/client';
import { Back } from '@/(app)/components';

export default function NutrientBar({nutrient}: {nutrient: ProductNutrients}) {

  const { amount } = nutrient;

  const metric = getMetric( nutrient.nameKey );
  if ( !metric ) return;

  const ratedIndex = getRateByIndex( nutrient.rated, metric );

  // Get UI details
  const ui = getBarUIDetails( amount, ratedIndex, metric);

  // handle nutrient bar expand/collapse
  const handleClick = (e: React.MouseEvent<HTMLDivElement>
    ) => {
    let bar = e.currentTarget;
    let barIcon = bar.querySelectorAll('.barIcon')[0];
    let barChart = bar.querySelectorAll('.barChart')[0];
    barIcon.classList.toggle('-rotate-90');
    barIcon.classList.toggle('rotate-90');
    barChart.classList.toggle('h-0');
    barChart.classList.toggle('h-9');
  }

  return (
    <div onClick={handleClick} className="flex flex-row gap-4 border-b border-background-3 last:border-b-0 py-4 cursor-pointer">
      <div>
      <Image
        src={ metric.img }
        alt={ metric.name }
        className='w-6 pt-2'
        width="24" height="24" />
      </div>
      <div className="flex flex-col gap-2 grow">
        <div className="flex flex-row justify-between">
          <div className='flex flex-col'>
            <p className="text-sm">{metric.name}</p>
            <p className="text-xs font-light text-text-2">{ui.message}</p>
          </div>
          <div className='flex items-center gap-2 text-xs'>
            <p>{limitDecimalPlaces(amount, 1)} {metric.benchmarks_unit}</p>
            <div style={{
                backgroundColor: `${ui.color}`
              }} className='rounded-2xl w-4 h-4'></div>
            <Back className='barIcon -rotate-90 text-text-3' />
          </div>
        </div>
        <div className='barChart h-0 -mx-2 px-2 overflow-hidden transition-[height] ease-in-out delay-50'>
          <div className='relative h-4'>
            <div style={{
                left: ui.arrowLeft,
                color: ui.color
              }} className='text-xs absolute -ml-1.5 animate-bounce'>▼</div>
          </div>
          <div className='flex gap-[2px] h-1'>
            {metric.rates.map((rate, index) => (
              <div key={index} style={{
                  width: ui.barPartsWidth[index],
                  backgroundColor: rateIndexColors[rate]
                }} className='w-1/4 h-full'></div>
            ))}
          </div>
          <div className='flex justify-between text-xs font-light'>
            <div >0</div>
            {metric.benchmarks_100g.map((benchmark, index) => (
              <div key={index} style={{
                  width: ui.barPartsWidth[index]
                }} className='text-right'>{ui.moreThanLargestBenchmark && index===metric.benchmarks_100g.length-1 && `+`}{benchmark}</div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
