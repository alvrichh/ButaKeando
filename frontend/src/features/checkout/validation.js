const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const SPANISH_POSTAL_CODE_PATTERN = /^(0[1-9]|[1-4]\d|5[0-2])\d{3}$/;
const PHONE_PATTERN = /^\+?[\d\s()-]{9,20}$/;

function requireMinLength(value, min, message) {
  return value.trim().length >= min ? undefined : message;
}

// Mirrors the backend CheckoutSessionRequest constraints so errors show next to each field.
export function validateCheckoutForm(values) {
  const errors = {
    fullName: requireMinLength(values.fullName, 2, 'Indica tu nombre y apellidos.'),
    email: EMAIL_PATTERN.test(values.email.trim()) ? undefined : 'Introduce un email válido, por ejemplo nombre@correo.es.',
    phone: PHONE_PATTERN.test(values.phone.trim()) ? undefined : 'Introduce un teléfono válido de al menos 9 cifras.',
    address: requireMinLength(values.address, 3, 'Indica la calle, número y piso.'),
    city: requireMinLength(values.city, 2, 'Indica la ciudad.'),
    postalCode: SPANISH_POSTAL_CODE_PATTERN.test(values.postalCode.trim())
      ? undefined
      : 'Introduce un código postal español de 5 cifras.',
    province: requireMinLength(values.province, 2, 'Indica la provincia.'),
  };

  return Object.fromEntries(Object.entries(errors).filter(([, message]) => message));
}
