import { useMemo, useState } from "react";

function buildTree(users) {
  const companies = users.filter((u) => u.role === "COMPANY");
  return companies.map((c) => ({
    ...c,
    children: users
      .filter((b) => b.role === "BRANCH" && (b.company?._id || b.company) === c._id)
      .map((b) => ({
        ...b,
        children: users
          .filter((s) => s.role === "SUPERVISOR" && (s.branch?._id || s.branch) === b._id)
          .map((s) => ({
            ...s,
            children: users.filter(
              (e) => e.role === "EMPLOYEE" && (e.supervisor?._id || e.supervisor) === s._id
            ),
          })),
      })),
  }));
}

function Node({ node, depth = 0 }) {
  const [open, setOpen] = useState(true);
  const hasChildren = node.children && node.children.length > 0;
  return (
    <div className="tree-node" style={{ marginLeft: depth ? 20 : 0 }}>
      <div className="tree-row" onClick={() => hasChildren && setOpen(!open)}>
        <span className={`tree-toggle ${hasChildren ? "" : "invisible"}`}>{open ? "▾" : "▸"}</span>
        <span className={`role-badge role-${node.role.toLowerCase()}`}>{node.role}</span>
        <span className="tree-name">{node.name}</span>
        <span className="muted tree-email">{node.email}</span>
      </div>
      {open && hasChildren && (
        <div className="tree-children">
          {node.children.map((c) => <Node key={c._id} node={c} depth={depth + 1} />)}
        </div>
      )}
    </div>
  );
}

export default function HierarchyTree({ users }) {
  const tree = useMemo(() => buildTree(users), [users]);
  if (!tree.length) return <div className="empty">No hierarchy yet. Create a Company to start.</div>;
  return (
    <div className="tree">
      {tree.map((c) => <Node key={c._id} node={c} />)}
    </div>
  );
}
