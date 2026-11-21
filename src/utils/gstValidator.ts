export const GST_STATE_CODES: Record<string, string> = {
  '01': 'Jammu & Kashmir',
  '02': 'Himachal Pradesh',
  '03': 'Punjab',
  '04': 'Chandigarh',
  '05': 'Uttarakhand',
  '06': 'Haryana',
  '07': 'Delhi',
  '08': 'Rajasthan',
  '09': 'Uttar Pradesh',
  '10': 'Bihar',
  '11': 'Sikkim',
  '12': 'Arunachal Pradesh',
  '13': 'Nagaland',
  '14': 'Manipur',
  '15': 'Mizoram',
  '16': 'Tripura',
  '17': 'Meghalaya',
  '18': 'Assam',
  '19': 'West Bengal',
  '20': 'Jharkhand',
  '21': 'Odisha',
  '22': 'Chhattisgarh',
  '23': 'Madhya Pradesh',
  '24': 'Gujarat',
  '26': 'Dadra & Nagar Haveli and Daman & Diu',
  '27': 'Maharashtra',
  '28': 'Andhra Pradesh (Old)',
  '29': 'Karnataka',
  '30': 'Goa',
  '31': 'Lakshadweep',
  '32': 'Kerala',
  '33': 'Tamil Nadu',
  '34': 'Puducherry',
  '35': 'Andaman & Nicobar Islands',
  '36': 'Telangana',
  '37': 'Andhra Pradesh',
  '38': 'Ladakh',
  '97': 'Other Territory',
};

export interface GstinValidationResult {
  isValid: boolean;
  stateCode?: string;
  stateName?: string;
  pan?: string;
  error?: string;
}

export function validateIndianGSTIN(gstin: string): GstinValidationResult {
  const clean = (gstin || '').trim().toUpperCase();
  if (!clean) {
    return { isValid: false, error: 'कृपया विज्ञापनदाता का 15 अंकों का GSTIN दर्ज करें।' };
  }
  if (clean.length !== 15) {
    return {
      isValid: false,
      error: `GSTIN ठीक 15 अक्षरों का होना अनिवार्य है (वर्तमान लंबाई: ${clean.length})।`,
    };
  }
  const gstinRegex = /^[0-9]{2}[A-Z]{5}[0-9]{4}[A-Z]{1}[1-9A-Z]{1}Z[0-9A-Z]{1}$/;
  if (!gstinRegex.test(clean)) {
    return {
      isValid: false,
      error: 'अमान्य GSTIN प्रारूप! सही उदाहरण: 07AAAAA0000A1Z5।',
    };
  }
  const stateCode = clean.substring(0, 2);
  const stateName = GST_STATE_CODES[stateCode];
  if (!stateName) {
    return {
      isValid: false,
      error: `अमान्य राज्य कोड '${stateCode}'। कृपया सही भारतीय GSTIN दर्ज करें।`,
    };
  }
  const pan = clean.substring(2, 12);
  return {
    isValid: true,
    stateCode,
    stateName,
    pan,
  };
}

export const PUBLISHER_GSTIN = '07AAACP9921D1Z8';
export const PUBLISHER_STATE_CODE = '07';
export const PUBLISHER_STATE_LABEL = '07 - Delhi';

export interface IndiaGstSupplyInfo {
  stateCode: string;
  stateName: string;
  placeOfSupply: string;
  isInterState: boolean;
  taxLabel: string;
  cgstAmount: number;
  sgstAmount: number;
  igstAmount: number;
  reverseCharge: string;
}

export function resolveIndiaGstSupply(opts: {
  clientType: 'b2b' | 'b2c';
  gstin?: string;
  b2cStateLabel?: string;
  gstAmount: number;
}): IndiaGstSupplyInfo {
  const { clientType, gstin = '', b2cStateLabel = PUBLISHER_STATE_LABEL, gstAmount } = opts;

  let stateCode = PUBLISHER_STATE_CODE;
  let stateName = GST_STATE_CODES[PUBLISHER_STATE_CODE];

  if (clientType === 'b2b') {
    const clean = gstin.trim().toUpperCase();
    const code = clean.substring(0, 2);
    if (GST_STATE_CODES[code]) {
      stateCode = code;
      stateName = GST_STATE_CODES[code];
    }
  } else if (b2cStateLabel) {
    const match = b2cStateLabel.match(/^(\d{2})/);
    const code = match?.[1] || PUBLISHER_STATE_CODE;
    if (GST_STATE_CODES[code]) {
      stateCode = code;
      stateName = GST_STATE_CODES[code];
    }
  }

  const isInterState = stateCode !== PUBLISHER_STATE_CODE;
  const cgstAmount = isInterState ? 0 : Math.round(gstAmount / 2);
  const sgstAmount = isInterState ? 0 : gstAmount - cgstAmount;
  const igstAmount = isInterState ? gstAmount : 0;

  return {
    stateCode,
    stateName,
    placeOfSupply: `${stateCode} - ${stateName}`,
    isInterState,
    taxLabel: isInterState ? 'IGST (18%)' : 'CGST (9%) + SGST (9%)',
    cgstAmount,
    sgstAmount,
    igstAmount,
    reverseCharge: 'No (Forward Charge)',
  };
}
