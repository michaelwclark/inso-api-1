export function makeInsoId(length) {
  let result = '';
  const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
  const charactersLength = characters.length;
  for (let i = 0; i < length; i++) {
    result += characters.charAt(Math.floor(Math.random() * charactersLength));
  }
  return result;
}

export async function getUniqueInsoCode(model, length = 5) {
  let insoCode = makeInsoId(length);

  while (true) {
    const exists = await model.count({ insoCode });
    if (!exists) {
      break;
    }
    insoCode = makeInsoId(length);
  }
  return insoCode;
}
