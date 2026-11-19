// Publica o site todo dia às 06:05 (horário de Brasília), para que a matéria agendada do dia entre no ar.
// O gancho de publicação (build hook) fica na variável de ambiente BUILD_HOOK_URL, configurada no Netlify.
export default async () => {
  const hook = process.env.BUILD_HOOK_URL;
  if (!hook) {
    console.error('BUILD_HOOK_URL não configurada.');
    return new Response('BUILD_HOOK_URL ausente', { status: 500 });
  }
  const res = await fetch(hook, { method: 'POST', body: '{}' });
  console.log(`Publicação diária solicitada: HTTP ${res.status}`);
  return new Response(`ok ${res.status}`);
};

export const config = { schedule: '5 9 * * *' };
