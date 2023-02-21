import { useContext } from "react";
import { Link } from "react-router-dom";
import { Auth } from "aws-amplify";
import { AuthContext } from "./Auth";

export default function Header() {
  const { user } = useContext(AuthContext);

  return (
    <div className="header-container">
      <header>
        <div className="header-left">
          <Link to="/">Auth App</Link>
        </div>
        <div className="header-right">
          {user ? (
            <ul>
              <li>
                <Link to="/users">Users</Link>
              </li>
              <li>
                <Link to="/profile">Profile</Link>
              </li>
              <li>
                <button onClick={() => Auth.signOut()}>Sign out</button>
              </li>
            </ul>
          ) : (
            <ul>
              <li>
                <button onClick={() => Auth.federatedSignIn()}>Sign in</button>
              </li>
            </ul>
          )}
        </div>
      </header>
    </div>
  );
}
