const { contextBridge } = require("electron");

const API_BASE_URL = "http://localhost:3333/api";

async function request(path, options = {}) {
  const response = await fetch(`${API_BASE_URL}${path}`, {
    headers: { "Content-Type": "application/json", ...(options.headers || {}) },
    ...options
  });

  if (!response.ok) {
    const error = await response.json().catch(() => ({ message: "Erro na requisicao" }));
    throw new Error(error.message);
  }

  if (response.status === 204) return null;
  return response.json();
}

contextBridge.exposeInMainWorld("agendaApi", {
  listProcesses: (filters = {}) => {
    const params = new URLSearchParams(Object.entries(filters).filter(([, value]) => value));
    return request(`/processes?${params.toString()}`);
  },
  createProcess: (data) => request("/processes", { method: "POST", body: JSON.stringify(data) }),
  updateProcess: (id, data) => request(`/processes/${id}`, { method: "PUT", body: JSON.stringify(data) }),
  deleteProcess: (id) => request(`/processes/${id}`, { method: "DELETE" })
});
