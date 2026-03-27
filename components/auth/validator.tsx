type FormErrors<T> = Partial<Record<keyof T, string>>;

export type TravelerFormValues = {
  username: string;
  fullName: string;
  email: string;
  phone: string;
  password: string;
  confirmPassword: string;
};

export type PartnerFormValues = {
  username: string;
  businessName: string;
  ownerName: string;
  businessType: string;
  address: string;
  email: string;
  phone: string;
  password: string;
  confirmPassword: string;
};

const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

function isValidEmail(email: string) {
  return emailRegex.test(email);
}

function isValidPhone(phone: string) {
  const digits = phone.replace(/\D/g, "");
  return digits.length >= 10 && digits.length <= 15;
}

function isStrongEnoughPassword(password: string) {
  return password.length >= 8;
}

export function validateTravelerForm(
  values: TravelerFormValues
): FormErrors<TravelerFormValues> {
  const errors: FormErrors<TravelerFormValues> = {};

  if (!values.username.trim()) {
    errors.username = "Username wajib diisi.";
  }

  if (!values.fullName.trim()) {
    errors.fullName = "Nama lengkap wajib diisi.";
  }

  if (!values.email.trim()) {
    errors.email = "Email wajib diisi.";
  } else if (!isValidEmail(values.email)) {
    errors.email = "Format email tidak valid.";
  }

  if (!values.phone.trim()) {
    errors.phone = "Nomor telepon wajib diisi.";
  } else if (!isValidPhone(values.phone)) {
    errors.phone = "Nomor telepon tidak valid.";
  }

  if (!values.password) {
    errors.password = "Password wajib diisi.";
  } else if (!isStrongEnoughPassword(values.password)) {
    errors.password = "Password minimal 8 karakter.";
  }

  if (!values.confirmPassword) {
    errors.confirmPassword = "Konfirmasi password wajib diisi.";
  } else if (values.confirmPassword !== values.password) {
    errors.confirmPassword = "Konfirmasi password tidak sama.";
  }

  return errors;
}

export function validatePartnerForm(
  values: PartnerFormValues
): FormErrors<PartnerFormValues> {
  const errors: FormErrors<PartnerFormValues> = {};

  if (!values.username.trim()) {
    errors.username = "Username wajib diisi.";
  }

  if (!values.businessName.trim()) {
    errors.businessName = "Nama usaha wajib diisi.";
  }

  if (!values.ownerName.trim()) {
    errors.ownerName = "Nama pemilik wajib diisi.";
  }

  if (!values.businessType.trim()) {
    errors.businessType = "Jenis usaha wajib diisi.";
  }

  if (!values.address.trim()) {
    errors.address = "Alamat usaha wajib diisi.";
  }

  if (!values.email.trim()) {
    errors.email = "Email wajib diisi.";
  } else if (!isValidEmail(values.email)) {
    errors.email = "Format email tidak valid.";
  }

  if (!values.phone.trim()) {
    errors.phone = "Nomor telepon wajib diisi.";
  } else if (!isValidPhone(values.phone)) {
    errors.phone = "Nomor telepon tidak valid.";
  }

  if (!values.password) {
    errors.password = "Password wajib diisi.";
  } else if (!isStrongEnoughPassword(values.password)) {
    errors.password = "Password minimal 8 karakter.";
  }

  if (!values.confirmPassword) {
    errors.confirmPassword = "Konfirmasi password wajib diisi.";
  } else if (values.confirmPassword !== values.password) {
    errors.confirmPassword = "Konfirmasi password tidak sama.";
  }

  return errors;
}