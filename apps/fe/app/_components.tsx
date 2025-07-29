'use client';

import { getProvider, deployEscrowContract, getContractBalance, approveEscrow } from './_utils';
import { useState, useEffect } from 'react';
import { ethers } from 'ethers';
import Link from 'next/link';

// Navigation Component
export const Navigation = () => {
  return (
    <nav className='border-b bg-white shadow-sm'>
      <div className='mx-auto max-w-7xl px-4 sm:px-6 lg:px-8'>
        <div className='flex h-16 justify-between'>
          <div className='flex items-center'>
            <Link
              href='/'
              className='text-xl font-bold text-gray-900'
            >
              Escrow App
            </Link>
          </div>
          <div className='flex items-center space-x-4'>
            <Link
              href='/'
              className='rounded-md px-3 py-2 text-sm font-medium text-gray-700 hover:text-gray-900'
            >
              Escrow
            </Link>
            <Link
              href='/wallet'
              className='rounded-md px-3 py-2 text-sm font-medium text-gray-700 hover:text-gray-900'
            >
              Wallet
            </Link>
          </div>
        </div>
      </div>
    </nav>
  );
};

const ApproveArbiterUI = ({
  contractAddress,
  arbiter,
  account,
  signer,
}: {
  contractAddress: string;
  arbiter: string;
  account: string | null;
  signer: ethers.Signer | null;
}) => {
  const [isApproving, setIsApproving] = useState(false);
  const [balance, setBalance] = useState<number>(0);

  useEffect(() => {
    const getBalance = async () => {
      const provider = getProvider();
      if (!provider) return;
      const balance = await getContractBalance({
        provider,
        contractAddress,
      });
      setBalance(balance);
    };
    getBalance();
  }, [contractAddress]);

  const handleApprove = async () => {
    if (!signer) return;

    setIsApproving(true);
    try {
      const res = await approveEscrow({
        contractAddress,
        signer,
      });
      console.log(res);
    } catch (error) {
      console.error(error);
    } finally {
      setIsApproving(false);
    }
  };

  return (
    <div className='w-full'>
      <p className='mt-2 text-center text-sm text-gray-600'>Contract Balance: {balance} ETH</p>
      <button
        onClick={handleApprove}
        disabled={isApproving || account !== arbiter}
        className='w-full rounded bg-green-600 px-4 py-2 font-semibold text-white transition hover:bg-green-700 disabled:cursor-not-allowed disabled:bg-gray-400'
      >
        {isApproving ? 'Approving...' : 'Approve Contract'}
      </button>
      {account !== arbiter && (
        <p className='mt-2 text-center text-sm text-gray-600'>Only the arbiter can approve this contract</p>
      )}
    </div>
  );
};

export const Escrow = () => {
  const provider = getProvider();
  const [account, setAccount] = useState<string | null>(null);
  const [beneficiary, setBeneficiary] = useState<string>('');
  const [arbiter, setArbiter] = useState<string>('');
  const [signer, setSigner] = useState<ethers.Signer | null>(null);
  const [contractAddress, setContractAddress] = useState<string>('');

  const [deployedContract, setDeployedContract] = useState<ethers.Contract | null>(null);

  useEffect(() => {
    if (deployedContract) {
      deployedContract.on('Approved', (arbiter: string) => {
        console.log('Approved by arbiter:', arbiter);

        setTimeout(() => {
          setDeployedContract(null);
          setContractAddress('');
        }, 2000);
      });
    }
  }, [deployedContract]);

  useEffect(() => {
    const initAccount = async () => {
      if (!provider) return;
      const signer = await provider.getSigner();
      const address = await signer.getAddress();

      setSigner(signer);
      setAccount(address);
    };
    initAccount();
  }, [provider]);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!signer) return;

    try {
      const contract = await deployEscrowContract({
        signer,
        arbiter,
        beneficiary,
        value: ethers.parseEther('1'),
      });
      setDeployedContract(contract as ethers.Contract);

      const address = await contract.getAddress();
      setContractAddress(address);
      console.log('Contract deployed at:', address);
      alert(`Contract deployed successfully at: ${address}`);
    } catch (error) {
      console.error('Deployment failed:', error);
      alert('Deployment failed. Check console for details.');
    }
  };

  return (
    <>
      {contractAddress ? (
        <div className='mx-auto mt-8 flex max-w-md flex-col gap-6 rounded-lg bg-white p-6 text-black shadow-md'>
          <h2 className='mb-4 flex items-center gap-2 text-2xl font-bold text-green-800'>
            <svg
              className='h-7 w-7 text-green-500'
              fill='none'
              stroke='currentColor'
              strokeWidth='2'
              viewBox='0 0 24 24'
            >
              <circle
                cx='12'
                cy='12'
                r='10'
                stroke='currentColor'
                strokeWidth='2'
                fill='#bbf7d0'
              />
              <path
                strokeLinecap='round'
                strokeLinejoin='round'
                strokeWidth='2'
                d='M9 12l2 2l4-4'
              />
            </svg>
            Contract Deployed!
          </h2>
          <div className='mb-4 rounded border border-green-200 bg-green-50 p-3'>
            <p className='font-semibold text-green-800'>Escrow Contract Address:</p>
            <p className='break-all text-sm text-gray-700'>{contractAddress}</p>
          </div>
          <div className='flex flex-col items-center rounded border border-blue-200 bg-blue-50 p-4'>
            <h3 className='mb-2 flex items-center gap-2 text-lg font-semibold text-blue-800'>
              <svg
                className='h-5 w-5 text-blue-500'
                fill='none'
                stroke='currentColor'
                strokeWidth='2'
                viewBox='0 0 24 24'
              >
                <path
                  strokeLinecap='round'
                  strokeLinejoin='round'
                  strokeWidth='2'
                  d='M13 16h-1v-4h-1m1-4h.01'
                />
              </svg>
              Awaiting Arbiter Approval
            </h3>
            <p className='mb-4 text-center text-sm text-blue-700'>
              The arbiter (<span className='font-mono'>{arbiter}</span>) must approve the contract to release the funds
              to the beneficiary.
            </p>
            <ApproveArbiterUI
              contractAddress={contractAddress}
              arbiter={arbiter}
              account={account}
              signer={signer}
            />
          </div>
        </div>
      ) : (
        <form
          className='mx-auto mt-8 flex max-w-md flex-col gap-6 rounded-lg bg-white p-6 text-black shadow-md'
          onSubmit={handleSubmit}
        >
          <h2 className='mb-4 text-2xl font-bold text-gray-800'>Escrow Setup</h2>

          {account && (
            <div className='mb-4 rounded bg-blue-100 p-3'>
              <p className='text-sm text-blue-800'>Connected Account: {account}</p>
            </div>
          )}

          <div>
            <label
              className='mb-1 block text-gray-700'
              htmlFor='beneficiary'
            >
              Beneficiary Address
            </label>
            <input
              id='beneficiary'
              type='text'
              className='w-full rounded border border-gray-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400'
              placeholder='0x...'
              value={beneficiary}
              onChange={e => setBeneficiary(e.target.value)}
              required
            />
          </div>
          <div>
            <label
              className='mb-1 block text-gray-700'
              htmlFor='arbiter'
            >
              Arbiter Address
            </label>
            <input
              id='arbiter'
              type='text'
              className='w-full rounded border border-gray-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400'
              placeholder='0x...'
              value={arbiter}
              onChange={e => setArbiter(e.target.value)}
              required
            />
          </div>
          <button
            type='submit'
            className='w-full rounded bg-blue-600 px-4 py-2 font-semibold text-white transition hover:bg-blue-700'
          >
            Deploy Escrow Contract (1 ETH)
          </button>
        </form>
      )}
    </>
  );
};
