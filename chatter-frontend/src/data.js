const baseUrl = 'http://localhost:3003';

export async function getNewsArticlesForToday() {
  let response = await fetch(`${baseUrl}/news`);
  let json = await response.json;

  return json;
}
