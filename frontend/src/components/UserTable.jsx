export default function UserTable({ users, onEdit, onDelete }) {
  if (!users.length) {
    return <div className="empty">No users yet. Click "Add User" to get started.</div>;
  }
  return (
    <div className="table-wrap">
      <table className="table">
        <thead>
          <tr>
            <th>Name</th><th>Email</th><th>Role</th><th>Company</th><th>Branch</th><th>Supervisor</th><th></th>
          </tr>
        </thead>
        <tbody>
          {users.map((u) => (
            <tr key={u._id}>
              <td><strong>{u.name}</strong></td>
              <td>{u.email}</td>
              <td><span className={`role-badge role-${u.role.toLowerCase()}`}>{u.role}</span></td>
              <td>{u.company?.name || "—"}</td>
              <td>{u.branch?.name || "—"}</td>
              <td>{u.supervisor?.name || "—"}</td>
              <td className="row-actions">
                <button className="btn btn-sm btn-ghost" onClick={() => onEdit(u)}>Edit</button>
                <button className="btn btn-sm btn-danger" onClick={() => onDelete(u)}>Delete</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
