import { NextRequest, NextResponse } from 'next/server';
import { DEFAULT_LOCALE } from '@/i18n/locales';

interface BookingValidationRequest {
  name: string;
  surname: string;
  email: string;
  phone: string;
  address: string;
  civicNumber: string;
  city: string;
  zipCode: string;
  country: string;
  fiscalCode: string;
  notes?: string;
  locale?: string;
}

const validationMessages: Record<string, Record<string, string>> = {
  it: {
    nameRequired: 'Il nome è obbligatorio',
    nameTooLong: 'Il nome è troppo lungo',
    surnameRequired: 'Il cognome è obbligatorio',
    surnameTooLong: 'Il cognome è troppo lungo',
    emailRequired: "L'email è obbligatoria",
    emailInvalid: 'Inserisci un indirizzo email valido',
    phoneRequired: 'Il telefono è obbligatorio',
    phoneInvalid: 'Il numero di telefono non è valido',
    addressRequired: "L'indirizzo è obbligatorio",
    addressTooLong: "L'indirizzo è troppo lungo",
    civicNumberRequired: 'Il numero civico è obbligatorio',
    cityRequired: 'La città è obbligatoria',
    cityTooLong: 'Il nome della città è troppo lungo',
    zipCodeRequired: 'Il codice postale è obbligatorio',
    zipCodeInvalid: 'Il codice postale non è valido',
    fiscalCodeRequired: 'Il codice fiscale è obbligatorio',
    fiscalCodeInvalid: 'Il codice fiscale non è valido',
    notesTooLong: 'Il messaggio non può superare 500 caratteri',
    generalError: 'Errore durante la validazione dei dati',
  },
  de: {
    nameRequired: 'Vorname ist erforderlich',
    nameTooLong: 'Vorname ist zu lang',
    surnameRequired: 'Nachname ist erforderlich',
    surnameTooLong: 'Nachname ist zu lang',
    emailRequired: 'E-Mail ist erforderlich',
    emailInvalid: 'Bitte gib eine gültige E-Mail-Adresse ein',
    phoneRequired: 'Telefonnummer ist erforderlich',
    phoneInvalid: 'Die Telefonnummer ist ungültig',
    addressRequired: 'Adresse ist erforderlich',
    addressTooLong: 'Adresse ist zu lang',
    civicNumberRequired: 'Hausnummer ist erforderlich',
    cityRequired: 'Stadt ist erforderlich',
    cityTooLong: 'Stadtname ist zu lang',
    zipCodeRequired: 'Postleitzahl ist erforderlich',
    zipCodeInvalid: 'Postleitzahl ist ungültig',
    fiscalCodeRequired: 'Steuer-ID ist erforderlich',
    fiscalCodeInvalid: 'Steuer-ID ist ungültig',
    notesTooLong: 'Die Nachricht darf 500 Zeichen nicht überschreiten',
    generalError: 'Fehler bei der Datenvalidierung',
  },
  en: {
    nameRequired: 'First name is required',
    nameTooLong: 'First name is too long',
    surnameRequired: 'Last name is required',
    surnameTooLong: 'Last name is too long',
    emailRequired: 'Email is required',
    emailInvalid: 'Please enter a valid email address',
    phoneRequired: 'Phone number is required',
    phoneInvalid: 'The phone number is invalid',
    addressRequired: 'Address is required',
    addressTooLong: 'Address is too long',
    civicNumberRequired: 'House number is required',
    cityRequired: 'City is required',
    cityTooLong: 'City name is too long',
    zipCodeRequired: 'Postal code is required',
    zipCodeInvalid: 'Postal code is invalid',
    fiscalCodeRequired: 'Tax ID is required',
    fiscalCodeInvalid: 'Tax ID is invalid',
    notesTooLong: 'Message cannot exceed 500 characters',
    generalError: 'Error during data validation',
  },
};

function sanitizeString(str: string): string {
  return str
    .trim()
    .replace(/<[^>]*>/g, '')
    .replace(/[<>'"]/g, '');
}

function validateEmail(email: string): boolean {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;
  return emailRegex.test(email);
}

function validatePhone(phone: string): boolean {
  const digits = phone.replace(/\D/g, '');
  return digits.length >= 6 && digits.length <= 20;
}

function validateZipCode(zipCode: string): boolean {
  return zipCode.length >= 4 && zipCode.length <= 10;
}

function validateFiscalCode(fiscalCode: string): boolean {
  const cleaned = fiscalCode.replace(/[^A-Za-z0-9]/g, '');
  return cleaned.length >= 8 && cleaned.length <= 20;
}

export async function POST(request: NextRequest) {
  try {
    const body: BookingValidationRequest = await request.json();
    const locale = body.locale && validationMessages[body.locale] ? body.locale : DEFAULT_LOCALE;
    const m = validationMessages[locale];

    const errors: Record<string, string> = {};

    if (!body.name || body.name.trim().length === 0) {
      errors.name = m.nameRequired;
    } else if (body.name.length > 100) {
      errors.name = m.nameTooLong;
    }

    if (!body.surname || body.surname.trim().length === 0) {
      errors.surname = m.surnameRequired;
    } else if (body.surname.length > 100) {
      errors.surname = m.surnameTooLong;
    }

    if (!body.email || body.email.trim().length === 0) {
      errors.email = m.emailRequired;
    } else if (!validateEmail(body.email)) {
      errors.email = m.emailInvalid;
    }

    if (!body.phone || body.phone.trim().length === 0) {
      errors.phone = m.phoneRequired;
    } else if (!validatePhone(body.phone)) {
      errors.phone = m.phoneInvalid;
    }

    if (!body.address || body.address.trim().length === 0) {
      errors.address = m.addressRequired;
    } else if (body.address.length > 200) {
      errors.address = m.addressTooLong;
    }

    if (!body.civicNumber || body.civicNumber.trim().length === 0) {
      errors.civicNumber = m.civicNumberRequired;
    }

    if (!body.city || body.city.trim().length === 0) {
      errors.city = m.cityRequired;
    } else if (body.city.length > 100) {
      errors.city = m.cityTooLong;
    }

    if (!body.zipCode || body.zipCode.trim().length === 0) {
      errors.zipCode = m.zipCodeRequired;
    } else if (!validateZipCode(body.zipCode)) {
      errors.zipCode = m.zipCodeInvalid;
    }

    if (!body.fiscalCode || body.fiscalCode.trim().length === 0) {
      errors.fiscalCode = m.fiscalCodeRequired;
    } else if (!validateFiscalCode(body.fiscalCode)) {
      errors.fiscalCode = m.fiscalCodeInvalid;
    }

    if (body.notes && body.notes.length > 500) {
      errors.notes = m.notesTooLong;
    }

    if (Object.keys(errors).length > 0) {
      return NextResponse.json(
        { valid: false, errors },
        { status: 400 }
      );
    }

    const sanitized = {
      name: sanitizeString(body.name),
      surname: sanitizeString(body.surname),
      email: sanitizeString(body.email.toLowerCase()),
      phone: sanitizeString(body.phone),
      address: sanitizeString(body.address),
      civicNumber: sanitizeString(body.civicNumber),
      city: sanitizeString(body.city),
      zipCode: sanitizeString(body.zipCode),
      country: sanitizeString(body.country),
      fiscalCode: sanitizeString(body.fiscalCode.toUpperCase()),
      notes: body.notes ? sanitizeString(body.notes).substring(0, 500) : '',
    };

    return NextResponse.json({ valid: true, sanitized });
  } catch (error) {
    console.error('Validation error:', error);
    return NextResponse.json(
      { valid: false, errors: { general: 'Errore durante la validazione dei dati' } },
      { status: 500 }
    );
  }
}
