import { SEED_TRANSFERS } from '@/data/transfers';

const delay = (ms = 150) => new Promise(res => setTimeout(res, ms));

export async function fetchTransfers() {
  await delay(200);
  return [...SEED_TRANSFERS];
}

export async function createTransfer(data) {
  await delay(150);
  return {
    ...data,
    id: `TRF-2026-${Date.now().toString().slice(-3)}`,
    date: new Date().toISOString().split('T')[0],
  };
}

export async function receiveTransfer(id, recvQtys) {
  await delay(100);
  return { id, recvQtys };
}