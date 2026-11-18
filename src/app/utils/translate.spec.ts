import { translateEyes, translateGender, translateHair, translateRace } from './translate';

describe('translate', () => {
  it('traduce el género y deja lo desconocido tal cual', () => {
    expect(translateGender('Male')).toBe('Masculino');
    expect(translateGender('Female')).toBe('Femenino');
    expect(translateGender('Other')).toBe('Other');
  });

  it('traduce razas simples y compuestas parte por parte', () => {
    expect(translateRace('Human')).toBe('Humano');
    expect(translateRace('Human / Radiation')).toBe('Humano / Radiación');
    expect(translateRace('God / Eternal')).toBe('Dios / Eterno');
    expect(translateRace('Yautja')).toBe('Yautja');
  });

  it('usa tablas distintas para ojos y cabello', () => {
    expect(translateEyes('Brown')).toBe('Marrón');
    expect(translateHair('Brown')).toBe('Castaño');
    expect(translateEyes('Yellow (without irises)')).toBe('Amarillo (sin iris)');
    expect(translateHair('No Hair')).toBe('Sin cabello');
    expect(translateHair('Red / Orange')).toBe('Rojo / Naranja');
  });
});
