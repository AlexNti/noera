'use client';

import { CopilotPopup, CopilotSidebar } from '@copilotkit/react-ui';
import { useCopilotAction, useCopilotReadable } from '@copilotkit/react-core';
import { useState, useEffect } from 'react';

interface EscrowAssistantProps {
  variant?: 'popup' | 'sidebar';
}

export function EscrowAssistant({ variant = 'popup' }: EscrowAssistantProps) {
  const [escrowData, setEscrowData] = useState({
    activeContracts: 0,
    totalValue: '0 ETH',
    pendingTransactions: 0,
  });

  console.log('🔧 EscrowAssistant component mounted with CopilotKit');

  // Make escrow data available to the assistant
  useCopilotReadable({
    description: 'Current escrow application state and user data',
    value: escrowData,
  });

  // Define actions the assistant can perform
  useCopilotAction(
    {
      name: 'create_escrow_contract',
      description: 'Help user create a new escrow contract',
      parameters: [
        {
          name: 'recipient',
          type: 'string',
          description: "The recipient's wallet address",
          required: true,
        },
        {
          name: 'amount',
          type: 'string',
          description: 'The amount to escrow (in ETH)',
          required: true,
        },
        {
          name: 'description',
          type: 'string',
          description: 'Description of the escrow contract',
          required: false,
        },
      ],
      handler: async ({ recipient, amount, description }) => {
        try {
          // Import the escrow utilities
          const { getProvider, deployEscrowContract } = await import('../_utils');
          const { ethers } = await import('ethers');

          console.log('🎯 CopilotKit Action: Creating escrow contract', { recipient, amount, description });

          // Get the provider and signer
          const provider = getProvider();
          if (!provider) {
            return `❌ **Wallet Not Connected**\n\nPlease connect your wallet first and try again.`;
          }

          const signer = await provider.getSigner();
          const userAddress = await signer.getAddress();

          // For now, use the user as arbiter (they can change this)
          const arbiter = userAddress;
          const beneficiary = recipient;
          const value = ethers.parseEther(amount);

          // Deploy the contract
          const contract = await deployEscrowContract({
            signer,
            arbiter,
            beneficiary,
            value,
          });

          const contractAddress = await contract.getAddress();

          console.log('✅ Contract deployed at:', contractAddress);

          return `✅ **Escrow Contract Created!**\n\n📋 **Details:**\n• **Address**: ${contractAddress}\n• **Amount**: ${amount} ETH\n• **Recipient**: ${beneficiary}\n• **Description**: ${description || 'CopilotKit created'}\n\n🎉 **Success!** Your contract is live on the blockchain!`;
        } catch (error: any) {
          console.error('Contract creation failed:', error);

          if (error.message.includes('user rejected')) {
            return `❌ **Transaction Cancelled**\n\nYou cancelled the wallet transaction.`;
          }

          return `❌ **Creation Failed**\n\nError: ${error.message}\n\nPlease check your wallet balance and try again.`;
        }
      },
    },
    [],
  );

  useCopilotAction(
    {
      name: 'check_contract_status',
      description: 'Check the status of an escrow contract',
      parameters: [
        {
          name: 'contractAddress',
          type: 'string',
          description: 'The contract address to check',
          required: true,
        },
      ],
      handler: async ({ contractAddress }) => {
        // This would query the blockchain for contract status
        console.log('Checking contract status for:', contractAddress);

        return `📊 **Contract Status for ${contractAddress}:**
      
- Status: Active
- Created: 2 days ago
- Amount: 1.5 ETH
- Recipient: 0x742d...7686
- Release Conditions: Manual release by both parties

🔍 **Current State:**
- Funds are locked in the contract
- Waiting for release conditions to be met
- Both parties can view transaction details on Etherscan

Would you like me to help you release the funds or check for any pending actions?`;
      },
    },
    [],
  );

  useCopilotAction(
    {
      name: 'explain_escrow_process',
      description: 'Explain how the escrow process works',
      parameters: [],
      handler: async () => {
        return `🏦 **How Escrow Works:**

**1. Contract Creation**
- Buyer creates an escrow contract
- Funds are locked in the smart contract
- Contract terms are set (amount, recipient, conditions)

**2. Verification Phase**
- Both parties can verify the contract details
- Funds remain locked and secure
- No single party can access the funds unilaterally

**3. Release Conditions**
- Manual release: Both parties agree
- Time-based release: After a specific date
- Milestone-based: When conditions are met

**4. Fund Release**
- Smart contract automatically transfers funds
- Transaction is recorded on the blockchain
- Both parties receive confirmation

🔒 **Security Features:**
- Funds are held by the smart contract, not a third party
- Transparent and verifiable on the blockchain
- Immutable contract terms

Need help with any specific step?`;
      },
    },
    [],
  );

  // Simulate fetching escrow data (replace with actual data fetching)
  useEffect(() => {
    // This would typically fetch real data from your contracts
    const fetchEscrowData = async () => {
      // Simulated data - replace with actual blockchain queries
      setEscrowData({
        activeContracts: 3,
        totalValue: '5.2 ETH',
        pendingTransactions: 1,
      });
    };

    fetchEscrowData();
  }, []);

  if (variant === 'sidebar') {
    return (
      <CopilotSidebar
        instructions='You are an expert escrow assistant. When users want to create contracts (e.g., "create escrow for 1 ETH to 0x123..."), use the create_escrow_contract action. When they ask about contract status, use check_contract_status. Always use actions when users provide specific details.'
        labels={{
          title: 'Escrow Assistant',
          initial:
            "Hi! I'm your escrow assistant. I can help you create contracts, check status, and explain the escrow process. What would you like to do?",
        }}
        defaultOpen={false}
        clickOutsideToClose={false}
      />
    );
  }

  return (
    <CopilotPopup
      instructions='You are an expert escrow assistant. When users want to create contracts (e.g., "create escrow for 1 ETH to 0x123..."), use the create_escrow_contract action. When they ask about contract status, use check_contract_status. Always use actions when users provide specific details.'
      labels={{
        title: 'Escrow Assistant',
        initial:
          "Hi! I'm your escrow assistant. I can help you create contracts, check status, and explain the escrow process. What would you like to do?",
      }}
    />
  );
}
