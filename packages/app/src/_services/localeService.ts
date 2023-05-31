import { type District } from "@/_types"

const districts: {
  am: {
    [key: string]: string
  }
} = {
  am: {
    'AJAPNYAK': 'Աջափնյակ',
    'ARABKIR': 'Արաբկիր',
    'AVAN': 'Ավան',
    'DAVITASHEN': 'Դավիթաշեն',
    'EREBUNI': 'Էրեբունի',
    'QANAQER': 'Քանաքեռ Զեյթուն',
    'KENTRON': 'Կենտրոն',
    'MALATIA': 'Մալաթիա Սեբաստիա',
    'NORQ': 'Նոր Նորք',
    'SHENGAVIT': 'Շենգավիթ',
    'NORQMARASH': 'Նորք Մարաշ',
    'NUBARASHEN': 'Նուբարաշեն',
  }
}




export const getDistrictName = (district: District, lang = 'am') => {
  if (lang !== 'am') {
    return district;
  }

  return districts['am'][district]
}
