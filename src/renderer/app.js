const statusOptions = ["Sim", "Não", "Pendente"];
const rows = document.querySelector("#processRows");
const dialog = document.querySelector("#processDialog");
const form = document.querySelector("#processForm");
const filters = document.querySelector("#filters");
const dialogTitle = document.querySelector("#dialogTitle");
let editingId = null;
let processes = [];

const dateFields = ["messageDate", "scheduledDate"];
const statusFields = ["confirmedPresence", "attended", "approved", "hired"];

function fillStatusSelects() {
  statusFields.forEach((field) => {
    const select = form.elements[field];
    select.innerHTML = statusOptions.map((option) => `<option value="${option}">${option}</option>`).join("");
  });
}

function formatDate(value) {
  if (!value) return "";
  const date = new Date(value);
  return date.toLocaleDateString("pt-BR", { timeZone: "UTC" });
}

function toDateInput(value) {
  if (!value) return "";
  return new Date(value).toISOString().slice(0, 10);
}

function statusClass(value) {
  return String(value || "Pendente")
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase();
}

function td(value, className = "") {
  return `<td class="${className}">${value || ""}</td>`;
}

function renderRows() {
  if (!processes.length) {
    rows.innerHTML = `<tr><td class="empty" colspan="14">Nenhum processo seletivo cadastrado.</td></tr>`;
    return;
  }

  rows.innerHTML = processes
    .map(
      (process) => `
        <tr>
          ${td(formatDate(process.messageDate))}
          ${td(formatDate(process.scheduledDate))}
          ${td(process.time)}
          ${td(process.name)}
          ${td(process.role)}
          ${td(process.confirmedPresence, `status ${statusClass(process.confirmedPresence)}`)}
          ${td(process.attended, `status ${statusClass(process.attended)}`)}
          ${td(process.source)}
          ${td(process.approved, `status ${statusClass(process.approved)}`)}
          ${td(process.scheduledBy)}
          ${td(process.attendedBy)}
          ${td(process.hired, `status ${statusClass(process.hired)}`)}
          ${td(process.notes)}
          <td>
            <div class="row-actions">
              <button type="button" data-action="edit" data-id="${process._id}" title="Editar">E</button>
              <button type="button" data-action="delete" data-id="${process._id}" title="Excluir">X</button>
            </div>
          </td>
        </tr>
      `
    )
    .join("");
}

async function loadProcesses() {
  const filterData = Object.fromEntries(new FormData(filters));
  processes = await window.agendaApi.listProcesses(filterData);
  renderRows();
}

function openForm(process = null) {
  editingId = process?._id || null;
  dialogTitle.textContent = editingId ? "Editar processo" : "Novo processo";
  form.reset();

  statusFields.forEach((field) => {
    form.elements[field].value = "Pendente";
  });

  if (process) {
    Object.entries(process).forEach(([key, value]) => {
      if (!form.elements[key]) return;
      form.elements[key].value = dateFields.includes(key) ? toDateInput(value) : value || "";
    });
  }

  dialog.showModal();
}

function getPayload() {
  const payload = Object.fromEntries(new FormData(form));
  return payload;
}

async function saveProcess(event) {
  event.preventDefault();
  const payload = getPayload();

  if (editingId) {
    await window.agendaApi.updateProcess(editingId, payload);
  } else {
    await window.agendaApi.createProcess(payload);
  }

  dialog.close();
  await loadProcesses();
}

async function handleTableClick(event) {
  const button = event.target.closest("button[data-action]");
  if (!button) return;

  const process = processes.find((item) => item._id === button.dataset.id);
  if (!process) return;

  if (button.dataset.action === "edit") {
    openForm(process);
    return;
  }

  if (confirm(`Excluir o processo de ${process.name}?`)) {
    await window.agendaApi.deleteProcess(process._id);
    await loadProcesses();
  }
}

fillStatusSelects();
loadProcesses().catch((error) => alert(error.message));

document.querySelector("#newProcess").addEventListener("click", () => openForm());
document.querySelector("#closeDialog").addEventListener("click", () => dialog.close());
document.querySelector("#cancelForm").addEventListener("click", () => dialog.close());
form.addEventListener("submit", saveProcess);
filters.addEventListener("input", () => loadProcesses().catch((error) => alert(error.message)));
filters.addEventListener("change", () => loadProcesses().catch((error) => alert(error.message)));
rows.addEventListener("click", handleTableClick);
