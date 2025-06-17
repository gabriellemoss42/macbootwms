export async function POST(request) {
  const entrada = await request.json();
  const response = await fetch('https://api.bling.com.br/Api/v3/estoques', {
    method: 'POST',
    headers: {
      'accept': 'application/json',
      'Content-Type': 'application/json',
      'Authorization': 'Bearer c58969d98e12d2c51c0a5579b360bcfe79b092028d45df2d69a8bf819435'
    },
    body: JSON.stringify(entrada)
  });
  const data = await response.json();
  return new Response(JSON.stringify(data), { status: 200 });
}
