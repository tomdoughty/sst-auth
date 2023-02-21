import { useContext, useEffect, useState } from "react";
import { AuthContext } from "./Auth";

export default function Users() {
  const { get } = useContext(AuthContext);
  const [users, setUsers] = useState([]);
  const [error, setError] = useState(null);

  useEffect(() => {
    const getUsers = async () => {
      try {
        const newUsers = await get("users");
        setUsers(newUsers.users);
      } catch (error) {
        setError(error.message);
      }
    };
    getUsers();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div className="content">
      {users.length > 0 && (
        <table>
          <thead>
            <tr>
              <th>Name</th>
              <th>Count</th>
              <th>Actor</th>
            </tr>
          </thead>
          <tbody>
            {users.map((user) => (
              <tr key={user.sub}>
                <td>{user.email}</td>
                <td>{user.count}</td>
                <td>{user.actor}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
      {error}
    </div>
  );
}
