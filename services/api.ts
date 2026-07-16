
const API_BASE = '/api';

export const apiService = {
  async getProjects() {
    const res = await fetch(`${API_BASE}/projects`);
    return res.json();
  },
  
  async getNcrs() {
    const res = await fetch(`${API_BASE}/ncrs`);
    return res.json();
  },

  async createNcr(data: any) {
    const res = await fetch(`${API_BASE}/ncrs`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data)
    });
    return res.json();
  },

  async analyzeWithAI(problemDescription: string) {
    const res = await fetch(`${API_BASE}/ai/analyze-root-cause`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ problemDescription })
    });
    return res.json();
  }
};
