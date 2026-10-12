import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import useLocalStorage from '../hooks/useLocalStorage';

const emptyForm = { name: '', membershipId: '', username: '', password: '', role: 'Member' };

export default function Users() {
  const navigate = useNavigate();
  const [users, setUsers] = useLocalStorage('libraryUsers', []);
  const [loggedIn, setLoggedIn] = useLocalStorage('libraryLoggedIn', false);
  const [currentUser, setCurrentUser] = useLocalStorage('currentUser', null);
  const [usernameInput, setUsernameInput] = useState('');
  const [passwordInput, setPasswordInput] = useState('');
  const [form, setForm] = useState(emptyForm);
  const [editingUserId, setEditingUserId] = useState(null);
  const [errorMessage, setErrorMessage] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  const isFirstSetup = users.length === 0;

  useEffect(() => {
    const hasValidSession = currentUser?.id && users.some(user => user.id === currentUser.id);
    if (loggedIn && !hasValidSession) {
      setLoggedIn(false);
      setCurrentUser(null);
    }
    const hasLegacyDemo = users.some(user => user.username === 'manager' && user.password === 'manager123');
    if (hasLegacyDemo) setUsers(users.filter(user => !(user.username === 'manager' && user.password === 'manager123')));
  }, []);

  const updateForm = (field, value) => setForm(previous => ({ ...previous, [field]: value }));

  const handleLogin = (event) => {
    event.preventDefault();
    setErrorMessage('');
    setSuccessMessage('');
    const username = usernameInput.trim().toLowerCase();
    const account = users.find(user => String(user.username || '').toLowerCase() === username && user.password === passwordInput);
    if (!account) {
      setErrorMessage('The username or password is incorrect. If this is your first time, create the first librarian account.');
      return;
    }
    setLoggedIn(true);
    setCurrentUser({ id: account.id, name: account.name, username: account.username, role: account.role });
    navigate('/');
  };

  const handleSaveUser = (event) => {
    event.preventDefault();
    setErrorMessage('');
    setSuccessMessage('');
    const cleanName = form.name.trim();
    const cleanId = form.membershipId.trim();
    const cleanUsername = form.username.trim();
    const cleanPassword = form.password;

    if (!cleanName || !cleanId || !cleanUsername || (!editingUserId && !cleanPassword)) {
      setErrorMessage('Complete all required fields. A password is required when creating an account.');
      return;
    }
    if (cleanPassword && cleanPassword.length < 6) {
      setErrorMessage('Passwords must contain at least 6 characters.');
      return;
    }
    const duplicateId = users.some(user => String(user.membershipId).toLowerCase() === cleanId.toLowerCase() && user.id !== editingUserId);
    const duplicateUsername = users.some(user => String(user.username || '').toLowerCase() === cleanUsername.toLowerCase() && user.id !== editingUserId);
    if (duplicateId) return setErrorMessage('That membership ID is already registered.');
    if (duplicateUsername) return setErrorMessage('That username is already taken. Choose another one.');

    if (editingUserId) {
      setUsers(users.map(user => user.id === editingUserId
        ? { ...user, name: cleanName, membershipId: cleanId, username: cleanUsername, ...(cleanPassword ? { password: cleanPassword } : {}), role: form.role }
        : user));
      if (currentUser?.id === editingUserId) setCurrentUser({ ...currentUser, name: cleanName, username: cleanUsername, role: form.role });
      setSuccessMessage('User account updated successfully.');
    } else {
      const newUser = { id: `${Date.now()}-${Math.random().toString(36).slice(2, 8)}`, name: cleanName, membershipId: cleanId, username: cleanUsername, password: cleanPassword, role: isFirstSetup ? 'Admin' : form.role };
      setUsers([...users, newUser]);
      setSuccessMessage(isFirstSetup ? 'First administrator account created. You can now log in.' : 'User account created successfully.');
    }
    setForm(emptyForm);
    setEditingUserId(null);
  };

  const startEditUser = (user) => {
    setEditingUserId(user.id);
    setForm({ name: user.name || '', membershipId: user.membershipId || '', username: user.username || '', password: '', role: user.role || 'Member' });
    setErrorMessage('');
    setSuccessMessage('');
  };

  const cancelEdit = () => { setEditingUserId(null); setForm(emptyForm); setErrorMessage(''); };

  const handleDeleteUser = (user) => {
    if (user.id === currentUser?.id) {
      setErrorMessage('You cannot delete the account currently in use. Log in with another administrator first.');
      return;
    }
    if (window.confirm(`Delete the account for ${user.name}?`)) {
      setUsers(users.filter(item => item.id !== user.id));
      if (editingUserId === user.id) cancelEdit();
      setSuccessMessage('User account deleted.');
    }
  };

  if (!loggedIn) {
    return <div className="login-page"><div className="login-card">
      <div className="login-header"><i className="fa-solid fa-lock"></i><h1>Book Haven</h1><h2>{isFirstSetup ? 'Create First Administrator' : 'Library Login'}</h2>
        <p>{isFirstSetup ? 'Set up your own administrator account to begin. No default credentials are provided.' : 'Sign in using an account registered by the library administrator.'}</p>
      </div>
      {errorMessage && <div role="alert" className="form-message form-error">{errorMessage}</div>}
      {successMessage && <div role="status" className="form-message form-success">{successMessage}</div>}
      {isFirstSetup ? <form onSubmit={handleSaveUser} className="form-grid">
        <div className="form-group"><label htmlFor="setup-name">Full name</label><input id="setup-name" className="form-control" autoComplete="name" required value={form.name} onChange={e => updateForm('name', e.target.value)} /></div>
        <div className="form-group"><label htmlFor="setup-id">Membership / Staff ID</label><input id="setup-id" className="form-control" required value={form.membershipId} onChange={e => updateForm('membershipId', e.target.value)} /></div>
        <div className="form-group"><label htmlFor="setup-username">Create username</label><input id="setup-username" className="form-control" autoComplete="username" minLength={3} required value={form.username} onChange={e => updateForm('username', e.target.value)} /></div>
        <div className="form-group"><label htmlFor="setup-password">Create password (at least 6 characters)</label><input id="setup-password" type="password" className="form-control" autoComplete="new-password" minLength={6} required value={form.password} onChange={e => updateForm('password', e.target.value)} /></div>
        <input type="hidden" value="Admin" readOnly />
        <button type="submit" className="btn-add login-button">Create Administrator Account</button>
      </form> : <form onSubmit={handleLogin} className="form-grid">
        <div className="form-group"><label htmlFor="login-username">Username</label><input id="login-username" type="text" className="form-control" autoComplete="username" required value={usernameInput} onChange={e => setUsernameInput(e.target.value)} placeholder="Enter your username" /></div>
        <div className="form-group"><label htmlFor="login-password">Password</label><input id="login-password" type="password" className="form-control" autoComplete="current-password" required value={passwordInput} onChange={e => setPasswordInput(e.target.value)} placeholder="Enter your password" /></div>
        <button type="submit" className="btn-add login-button">Login</button>
      </form>}
    </div></div>;
  }

  return <section className="section-card">
    <div className="section-header"><h2><i className="fa-solid fa-users-gear"></i> User Management</h2><p>Signed in as {currentUser?.name || currentUser?.username} ({currentUser?.role || 'User'})</p></div>
    {errorMessage && <div role="alert" className="form-message form-error">{errorMessage}</div>}
    {successMessage && <div role="status" className="form-message form-success">{successMessage}</div>}
    <form id="user-form" onSubmit={handleSaveUser}>
      <div className="form-grid">
        <div className="form-group"><label htmlFor="user-name">Full name *</label><input id="user-name" className="form-control" autoComplete="name" required maxLength={100} value={form.name} onChange={e => updateForm('name', e.target.value)} placeholder="Enter full name" /></div>
        <div className="form-group"><label htmlFor="user-membership">Membership ID *</label><input id="user-membership" className="form-control" required maxLength={40} value={form.membershipId} onChange={e => updateForm('membershipId', e.target.value)} placeholder="Unique membership ID" /></div>
        <div className="form-group"><label htmlFor="user-username">Username *</label><input id="user-username" className="form-control" required minLength={3} maxLength={40} autoComplete="off" value={form.username} onChange={e => updateForm('username', e.target.value)} placeholder="Login username" /></div>
        <div className="form-group"><label htmlFor="user-password">{editingUserId ? 'New password (leave blank to keep current)' : 'Password *'}</label><input id="user-password" type="password" className="form-control" autoComplete="new-password" minLength={6} required={!editingUserId} value={form.password} onChange={e => updateForm('password', e.target.value)} placeholder={editingUserId ? 'Optional password change' : 'At least 6 characters'} /></div>
        <div className="form-group"><label htmlFor="user-role">Role *</label><select id="user-role" className="form-control" value={form.role} onChange={e => updateForm('role', e.target.value)}><option value="Member">Member</option><option value="Librarian">Librarian</option><option value="Admin">Admin</option></select></div>
      </div>
      <button type="submit" className="btn-add">{editingUserId ? 'Update User Account' : 'Add User Account'}</button>
      {editingUserId && <button type="button" className="btn-borrow" style={{ marginLeft: 12, minHeight: 48 }} onClick={cancelEdit}>Cancel Edit</button>}
    </form>
    <div className="table-wrapper"><table className="table"><thead><tr><th>#</th><th>Name</th><th>Membership ID</th><th>Username</th><th>Role</th><th>Actions</th></tr></thead>
      <tbody>{users.length === 0 ? <tr><td colSpan="6" style={{ textAlign: 'center' }}>No user accounts available.</td></tr> : users.map((user, index) => <tr key={user.id}><td>{index + 1}</td><td>{user.name}</td><td>{user.membershipId}</td><td>{user.username || 'Legacy account'}</td><td><span className="book-genre">{user.role}</span></td><td><div className="action-btns"><button type="button" className="btn-icon btn-edit" onClick={() => startEditUser(user)}>Edit</button><button type="button" className="btn-icon btn-delete" onClick={() => handleDeleteUser(user)}>Delete</button></div></td></tr>)}</tbody>
    </table></div>
    <p className="form-note">Assignment note: this demonstration stores account data in browser Local Storage, as required by the brief. It is suitable for a local coursework demo, not production authentication.</p>
  </section>;
}
