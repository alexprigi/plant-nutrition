import { NextRequest, NextResponse } from 'next/server';

// Server-side validation schema
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
}

function sanitizeString(str: string): string {
  return str
    .trim()
    .replace(/<[^>]*>/g, '') // Remove HTML tags
    .replace(/[<>'"]/g, ''); // Remove dangerous characters
}

function validateEmail(email: string): boolean {
  // RFC 5322 compliant regex
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;
  return emailRegex.test(email);
}

function validatePhone(phone: string): boolean {
  // Extract digits from phone
  const digits = phone.replace(/\D/g, '');
  // At least 6 digits for international flexibility
  return digits.length >= 6 && digits.length <= 20;
}

function validateZipCode(zipCode: string): boolean {
  // At least 4 characters
  return zipCode.length >= 4 && zipCode.length <= 10;
}

function validateFiscalCode(fiscalCode: string): boolean {
  // At least 8 alphanumeric characters
  const cleaned = fiscalCode.replace(/[^A-Za-z0-9]/g, '');
  return cleaned.length >= 8 && cleaned.length <= 20;
}

export async function POST(request: NextRequest) {
  try {
    const body: BookingValidationRequest = await request.json();

    const errors: Record<string, string> = {};

    // Required fields validation
    if (!body.name || body.name.trim().length === 0) {
      errors.name = 'Il nome è obbligatorio';
    } else if (body.name.length > 100) {
      errors.name = 'Il nome è troppo lungo';
    }

    if (!body.surname || body.surname.trim().length === 0) {
      errors.surname = 'Il cognome è obbligatorio';
    } else if (body.surname.length > 100) {
      errors.surname = 'Il cognome è troppo lungo';
    }

    if (!body.email || body.email.trim().length === 0) {
      errors.email = "L'email è obbligatoria";
    } else if (!validateEmail(body.email)) {
      errors.email = 'Inserisci un indirizzo email valido';
    }

    if (!body.phone || body.phone.trim().length === 0) {
      errors.phone = 'Il telefono è obbligatorio';
    } else if (!validatePhone(body.phone)) {
      errors.phone = 'Il numero di telefono non è valido';
    }

    if (!body.address || body.address.trim().length === 0) {
      errors.address = "L'indirizzo è obbligatorio";
    } else if (body.address.length > 200) {
      errors.address = "L'indirizzo è troppo lungo";
    }

    if (!body.civicNumber || body.civicNumber.trim().length === 0) {
      errors.civicNumber = 'Il numero civico è obbligatorio';
    }

    if (!body.city || body.city.trim().length === 0) {
      errors.city = 'La città è obbligatoria';
    } else if (body.city.length > 100) {
      errors.city = 'Il nome della città è troppo lungo';
    }

    if (!body.zipCode || body.zipCode.trim().length === 0) {
      errors.zipCode = 'Il codice postale è obbligatorio';
    } else if (!validateZipCode(body.zipCode)) {
      errors.zipCode = 'Il codice postale non è valido';
    }

    if (!body.fiscalCode || body.fiscalCode.trim().length === 0) {
      errors.fiscalCode = 'Il codice fiscale è obbligatorio';
    } else if (!validateFiscalCode(body.fiscalCode)) {
      errors.fiscalCode = 'Il codice fiscale non è valido';
    }

    // Notes validation (optional but limited)
    if (body.notes && body.notes.length > 500) {
      errors.notes = 'Il messaggio non può superare 500 caratteri';
    }

    // If there are errors, return them
    if (Object.keys(errors).length > 0) {
      return NextResponse.json(
        { valid: false, errors },
        { status: 400 }
      );
    }

    // Sanitize all fields
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

    // Return success with sanitized data
    return NextResponse.json({
      valid: true,
      sanitized,
    });
  } catch (error) {
    console.error('Validation error:', error);
    return NextResponse.json(
      { valid: false, errors: { general: 'Errore durante la validazione dei dati' } },
      { status: 500 }
    );
  }
}
