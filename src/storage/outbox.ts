import AsyncStorage from '@react-native-async-storage/async-storage';
import {OUTBOX_KEY} from './keys';

export type OutboxAction = {
  id: string;
  method: 'PATCH' | 'POST';
  url: string;
  body: unknown;
  createdAt: string;
};

export async function getAll(): Promise<OutboxAction[]> {
  const raw = await AsyncStorage.getItem(OUTBOX_KEY);
  return raw ? (JSON.parse(raw) as OutboxAction[]) : [];
}

export async function enqueue(action: OutboxAction): Promise<void> {
  const actions = await getAll();
  await AsyncStorage.setItem(OUTBOX_KEY, JSON.stringify([...actions, action]));
}

export async function remove(id: string): Promise<void> {
  const actions = await getAll();
  await AsyncStorage.setItem(OUTBOX_KEY, JSON.stringify(actions.filter(action => action.id !== id)));
}
