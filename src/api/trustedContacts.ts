import { apiFetch } from './config';

export interface TrustedContact {
  id: number;
  name: string;
  country_code: string;
  phoneNo: string;
  isSOS: boolean;
}

export interface CreateTrustedContactPayload {
  name: string;
  phone_number: string;
  is_sos_contact?: boolean;
}

export function readContacts(): Promise<TrustedContact[]> {
  return apiFetch<TrustedContact[]>('/trusted-contacts/read_contacts');
}

export function createContact(data: CreateTrustedContactPayload): Promise<TrustedContact> {
  return apiFetch<TrustedContact>('/trusted-contacts/create_contact', {
    method: 'POST',
    body: JSON.stringify(data),
  });
}

export function editContact(id: number, data: CreateTrustedContactPayload): Promise<TrustedContact> {
  return apiFetch<TrustedContact>(`/trusted-contacts/edit_contact/${id}`, {
    method: 'PUT',
    body: JSON.stringify(data),
  });
}

export function removeContact(id: number): Promise<void> {
  return apiFetch<void>(`/trusted-contacts/remove_contact/${id}`, {
    method: 'DELETE',
  });
}

export function formatContactPhone(contact: TrustedContact): string {
  if (contact.country_code) {
    return `${contact.country_code} ${contact.phoneNo}`;
  }
  return contact.phoneNo;
}

export function normalizePhoneNumber(raw: string): string {
  const digits = raw.replace(/\D/g, '');

  if (digits.length !== 10) {
    throw new Error('Phone number must be 10 digits');
  }

  return digits;
}
