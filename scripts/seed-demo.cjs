const demoUsers = [
  { f_name: 'Alex', l_name: 'Chen', username: 'alex_chen' },
  { f_name: 'Maya', l_name: 'Patel', username: 'maya_patel' },
  { f_name: 'Sam', l_name: 'Rivera', username: 'sam_rivera' },
];
const password = 'CampusDemo123!';
async function seedDemo(base = process.env.DEMO_API_URL || 'http://127.0.0.1:9000') {
  async function request(endpoint, body) {
    const response = await fetch(`${base}${endpoint}`, {
      method: body ? 'POST' : 'GET', headers: body ? { 'Content-Type': 'application/json' } : {},
      body: body ? JSON.stringify(body) : undefined, signal: AbortSignal.timeout(15000),
    });
    const data = await response.json();
    if (!response.ok) throw new Error(data.message || `HTTP ${response.status}`);
    return data;
  }
  const { users } = await request('/users');
  for (const person of demoUsers) {
    if (!users.some(user => user.username === person.username)) users.push((await request('/signup', { ...person, password })).user);
  }
  const { projects } = await request('/projects');
  const samples = [
    { name: 'Campus Planner', description: 'A shared place to plan campus events, coordinate volunteers, and keep the team moving together.', status: 'Planning', lead: 'alex_chen' },
    { name: 'Study Together', description: 'Connect classmates with study groups and build a welcoming space to learn together.', status: 'Active', lead: 'maya_patel' },
  ];
  for (const sample of samples) {
    const lead = users.find(user => user.username === sample.lead);
    if (!projects.some(project => project.name === sample.name && project.project_lead_id === lead._id)) {
      await request('/projects', { name: sample.name, description: sample.description, status: sample.status, project_lead_id: lead._id });
    }
  }
  console.log('Demo data ready: alex_chen, maya_patel, sam_rivera; Campus Planner and Study Together.');
  console.log('New demo account password: CampusDemo123! Existing accounts and memberships are preserved.');
}
module.exports = { seedDemo };
if (require.main === module) seedDemo().catch(error => { console.error('Could not prepare demo data:', error.message); console.error('Start npm run demo first.'); process.exitCode = 1; });
