# Ignition Modules

This directory contains Hardhat Ignition modules for deployment and contract interactions.

## Available Modules

### `deploy-token.ts`

Deploys the FranekTataToken contract.

```bash
npx hardhat ignition deploy ignition/modules/deploy-token.ts
```

### `deploy-escrow.ts`

Deploys both FranekTataToken and Escrow contracts with proper dependencies.

```bash
npx hardhat ignition deploy ignition/modules/deploy-escrow.ts
```

### `airdrop.ts`

Performs an airdrop of 10 FTT tokens to a specific address.

```bash
npx hardhat ignition deploy ignition/modules/airdrop.ts
```

## Migration from Scripts

The following scripts have been migrated to Ignition modules:

- `scripts/deploy.ts` → `ignition/modules/deploy-token.ts`
- `scripts/airdrop.ts` → `ignition/modules/airdrop.ts`

## Benefits of Ignition

1. **Dependency Management**: Contracts are deployed in the correct order
2. **State Management**: Ignition tracks deployment state and can resume failed deployments
3. **Declarative**: Deployment logic is more readable and maintainable
4. **Reusability**: Modules can be composed and reused

## Commands

- Deploy a module: `npx hardhat ignition deploy ignition/modules/[module-name].ts`
- List deployments: `npx hardhat ignition list`
- Show deployment details: `npx hardhat ignition show [deployment-id]`
