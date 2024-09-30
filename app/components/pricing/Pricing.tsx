'use client'
import React, { useState, useEffect } from 'react';
import { getPricings } from '@/lib/pricingUtils'; // Adjust the import path as necessary
import { type Pricing } from '@/types/pricing'; // Import the Pricing type

const Pricing = () => {
  const [pricingData, setPricingData] = useState<Pricing[]>([]); // Specify the type here

  useEffect(() => {
    const fetchPricingData = async () => {
      const data: Pricing[] = await getPricings(); // Ensure data is typed as Pricing[]
      setPricingData(data);
    };
    fetchPricingData();
  }, []);

  const [activeTab, setActiveTab] = useState('Regular');

  const isEarlyBirdAvailable = (deadline: string) => {
    return new Date(deadline) > new Date();
  };

  return (
    <div className='flex flex-col items-center'>
      <h1 className='text-4xl font-bold mb-8'>Pricing</h1>

      <div className='flex mb-4'>
        {['Regular', 'Early Bird', '3 Payments', '4 Payments'].map(tab => (
          <button key={tab} onClick={() => setActiveTab(tab)} className={`px-4 py-2 ${activeTab === tab ? 'bg-blue-500 text-white' : 'bg-gray-200'}`}>{tab}</button>
        ))}
      </div>
    <div className='flex flex-col justify-center items-center border-2 border-purple p-8 rounded-2xl bg-purple/[0.2]'>
      <h1 className='text-4xl font-bold mb-8 text-purple'>HOP</h1>
      <div className='grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4'>
        {pricingData.slice(0, 4).map(({ _id, level, fullPrice, earlyBirdPrice, earlyBirdDeadline, threePayments, fourPayments, description, horarium }) => {
          const isUnavailable = activeTab === 'Early Bird' && !isEarlyBirdAvailable(earlyBirdDeadline);
          
          // Always show earlyBirdPrice if the Early Bird tab is active, regardless of availability
          const priceToDisplay = activeTab === 'Early Bird' ? earlyBirdPrice : 
                                 activeTab === '3 Payments' ? threePayments : 
                                 activeTab === '4 Payments' ? fourPayments : fullPrice;

          return (
            <div key={_id} className={`border justify-center items-center flex flex-col p-2 rounded-lg ${isUnavailable ? 'border-gray-300 opacity-80' : 'border-cyan bg-cyan/[0.2] hover:scale-105 transition-all duration-300'} shadow-lg w-56`}>
              <h2 className='text-xl font-semibold'>{level}</h2>
              <p className='text-2xl font-bold'>
                {activeTab === 'Early Bird' && (
                  <div className='flex flex-col items-center'>
                    <span className='line-through text-red-500/[0.8] text-sm'>{fullPrice}</span> {/* Striked regular price */}
                    <span className='ml-2'>{earlyBirdPrice}</span> {/* Early bird price */}
                  </div>
                )}
                {activeTab !== 'Early Bird' && priceToDisplay}
              </p>
              <p className='mb-4'>{description}</p>
              <p className='mb-4'>{horarium}</p>
              <button className={`bg-blue-500 text-white px-4 py-2 rounded ${isUnavailable ? 'cursor-not-allowed' : ''}`} disabled={isUnavailable}>
                {isUnavailable ? 'Unavailable' : 'TRY IT NOW'}
              </button>
            </div>
          );
        })}
      </div>
    </div>
      <h1 className='text-4xl font-bold my-12'>Grow Up</h1>

      <div className='grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6 gap-4 '>
        {pricingData.slice(4).map(({ _id, level, fullPrice, earlyBirdPrice, earlyBirdDeadline, threePayments, fourPayments, description, horarium }) => {
          const isUnavailable = activeTab === 'Early Bird' && !isEarlyBirdAvailable(earlyBirdDeadline);
          
          // Always show earlyBirdPrice if the Early Bird tab is active, regardless of availability
          const priceToDisplay = activeTab === 'Early Bird' ? earlyBirdPrice : 
                                 activeTab === '3 Payments' ? threePayments : 
                                 activeTab === '4 Payments' ? fourPayments : fullPrice;

          return (
            <div key={_id} className={`border justify-center items-center flex flex-col p-2 rounded-lg ${isUnavailable ? 'border-gray-300 opacity-50' : 'border-blue-500'} shadow-lg w-56`}>
              <h2 className='text-xl font-semibold'>{level}</h2>
              <p className='text-2xl font-bold'>
                {activeTab === 'Early Bird' && (
                  <div className='flex flex-col items-center'>
                    <span className='line-through text-red-500/[0.8] text-sm'>{fullPrice}</span> {/* Striked regular price */}
                    <span className='ml-2'>{earlyBirdPrice}</span> {/* Early bird price */}
                  </div>
                )}
                {activeTab !== 'Early Bird' && priceToDisplay}
              </p>
              <p className='mb-4'>{description}</p>
              <p className='mb-4'>{horarium}</p>
              <button className={`bg-blue-500 text-white px-4 py-2 rounded ${isUnavailable ? 'cursor-not-allowed' : ''}`} disabled={isUnavailable}>
                {isUnavailable ? 'Unavailable' : 'TRY IT NOW'}
              </button>
            </div>
          );
        })}
      </div>

    </div>
  );
};

export default Pricing;