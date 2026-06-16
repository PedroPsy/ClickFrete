const state = {
  token: localStorage.getItem('clickfretes:token'),
  user: JSON.parse(localStorage.getItem('clickfretes:user') || 'null'),
};

const $ = (selector) => document.querySelector(selector);
const freightList = $('#freightList');
const toast = $('#toast');

const statusLabels = {
  REQUESTED: 'Solicitado',
  ACCEPTED: 'Aceito',
  IN_PROGRESS: 'Em andamento',
  FINISHED: 'Finalizado',
  CANCELED: 'Cancelado',
};

function showToast(message, isError = false) {
  toast.textContent = message;
  toast.classList.toggle('error', isError);
  toast.classList.add('show');
  window.setTimeout(() => toast.classList.remove('show'), 3200);
}

async function api(path, options = {}) {
  const response = await fetch(path, {
    ...options,
    headers: {
      'Content-Type': 'application/json',
      ...(state.token ? { Authorization: `Bearer ${state.token}` } : {}),
      ...options.headers,
    },
  });

  const payload = await response.json().catch(() => ({}));
  if (!response.ok) {
    throw new Error(payload.error || payload.message || 'Não foi possível concluir a ação.');
  }
  return payload;
}

function saveSession(result) {
  state.token = result.token;
  state.user = result.user;
  localStorage.setItem('clickfretes:token', result.token);
  localStorage.setItem('clickfretes:user', JSON.stringify(result.user));
  renderSession();
  loadFreights();
}

function clearSession() {
  state.token = null;
  state.user = null;
  localStorage.removeItem('clickfretes:token');
  localStorage.removeItem('clickfretes:user');
  renderSession();
  freightList.innerHTML = '<div class="empty-state"><strong>Faça login</strong><p>Entre para listar ou criar fretes.</p></div>';
}

function renderSession() {
  const logged = Boolean(state.token && state.user);
  $('#sessionCard').classList.toggle('hidden', !logged);
  $('#sessionName').textContent = state.user?.name || 'Usuário';
  $('#sessionRole').textContent = state.user?.role || '';
  $('#workspaceTitle').textContent = state.user?.role === 'DRIVER' ? 'Fretes disponíveis' : 'Solicite seu frete';
  $('#listTitle').textContent = state.user?.role === 'DRIVER' ? 'Oportunidades e meus fretes' : 'Meus fretes';
  $('#clientArea').classList.toggle('hidden', state.user?.role === 'DRIVER');
  $('#driverArea').classList.toggle('hidden', state.user?.role !== 'DRIVER');
}

function freightActions(freight) {
  if (!state.user) return '';
  const buttons = [];
  if (state.user.role === 'DRIVER') {
    if (freight.status === 'REQUESTED') buttons.push(['Aceitar', `/freights/${freight.id}/accept`]);
    if (freight.status === 'ACCEPTED') buttons.push(['Iniciar', `/freights/${freight.id}/start`]);
    if (freight.status === 'IN_PROGRESS') buttons.push(['Finalizar', `/freights/${freight.id}/finish`]);
  }
  if (['REQUESTED', 'ACCEPTED'].includes(freight.status)) {
    buttons.push(['Cancelar', `/freights/${freight.id}/cancel`, true]);
  }
  return buttons.map(([label, path, danger]) => `<button class="button ${danger ? 'button--secondary' : 'button--dark'}" data-action="${path}">${label}</button>`).join('');
}

function renderFreights(items = [], pagination) {
  $('#paginationInfo').textContent = pagination ? `${pagination.total} registro(s)` : '—';
  if (!items.length) {
    freightList.innerHTML = '<div class="empty-state"><strong>Nenhum frete encontrado</strong><p>Quando houver dados, eles aparecerão aqui.</p></div>';
    return;
  }

  freightList.innerHTML = items.map((freight) => `
    <article class="freight-card">
      <div>
        <h4>${freight.pickupAddress} → ${freight.dropoffAddress}</h4>
        <p>${freight.description || 'Sem descrição adicional.'}</p>
        <div class="freight-card__meta">
          <span class="badge">${statusLabels[freight.status] || freight.status}</span>
          ${freight.client?.name ? `<span class="badge">Cliente: ${freight.client.name}</span>` : ''}
          ${freight.driver?.user?.name ? `<span class="badge">Motorista: ${freight.driver.user.name}</span>` : ''}
        </div>
      </div>
      <div class="freight-card__actions">
        <span class="price">${Number(freight.price).toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}</span>
        ${freightActions(freight)}
      </div>
    </article>
  `).join('');
}

async function loadFreights() {
  if (!state.token || !state.user) return;
  try {
    if (state.user.role === 'DRIVER') {
      const [available, mine] = await Promise.all([
        api('/freights/available'),
        api('/freights/driver'),
      ]);
      renderFreights([...(available.data || []), ...(mine.data || [])], {
        total: (available.pagination?.total || 0) + (mine.pagination?.total || 0),
      });
      return;
    }
    const result = await api('/freights/client');
    renderFreights(result.data, result.pagination);
  } catch (error) {
    showToast(error.message, true);
  }
}

function setAuthTab(tabName) {
  document.querySelectorAll('[data-auth-tab]').forEach((tab) => tab.classList.toggle('active', tab.dataset.authTab === tabName));
  $('#loginForm').classList.toggle('hidden', tabName !== 'login');
  $('#registerForm').classList.toggle('hidden', tabName !== 'register');
}

document.addEventListener('click', async (event) => {
  const tab = event.target.closest('[data-auth-tab]');
  if (tab) setAuthTab(tab.dataset.authTab);

  const scrollButton = event.target.closest('[data-scroll-target]');
  if (scrollButton) document.getElementById(scrollButton.dataset.scrollTarget)?.scrollIntoView({ behavior: 'smooth' });

  const action = event.target.closest('[data-action]');
  if (action) {
    try {
      action.disabled = true;
      await api(action.dataset.action, { method: 'PATCH' });
      showToast('Frete atualizado com sucesso.');
      loadFreights();
    } catch (error) {
      showToast(error.message, true);
    } finally {
      action.disabled = false;
    }
  }
});

$('#roleSelect').addEventListener('change', (event) => {
  $('#driverFields').classList.toggle('hidden', event.target.value !== 'DRIVER');
});

$('#loginForm').addEventListener('submit', async (event) => {
  event.preventDefault();
  try {
    const data = Object.fromEntries(new FormData(event.currentTarget));
    saveSession(await api('/login', { method: 'POST', body: JSON.stringify(data) }));
    showToast('Login realizado.');
  } catch (error) {
    showToast(error.message, true);
  }
});

$('#registerForm').addEventListener('submit', async (event) => {
  event.preventDefault();
  try {
    const data = Object.fromEntries(new FormData(event.currentTarget));
    if (data.role !== 'DRIVER') {
      delete data.vehicleType;
      delete data.vehiclePlate;
    }
    await api('/register', { method: 'POST', body: JSON.stringify(data) });
    showToast('Cadastro criado. Faça login para continuar.');
    setAuthTab('login');
  } catch (error) {
    showToast(error.message, true);
  }
});

$('#freightForm').addEventListener('submit', async (event) => {
  event.preventDefault();
  try {
    const data = Object.fromEntries(new FormData(event.currentTarget));
    data.price = Number(data.price);
    await api('/freights', { method: 'POST', body: JSON.stringify(data) });
    event.currentTarget.reset();
    showToast('Frete criado com sucesso.');
    loadFreights();
  } catch (error) {
    showToast(error.message, true);
  }
});

$('#refreshButton').addEventListener('click', loadFreights);
$('#logoutButton').addEventListener('click', clearSession);

renderSession();
if (state.token) loadFreights();
else clearSession();
