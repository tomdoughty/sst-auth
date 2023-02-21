import { useContext, useEffect, useState } from "react";
import { AuthContext } from "./Auth";

export default function Profile() {
  const { get, put } = useContext(AuthContext);
  const [count, setCount] = useState(null);

  useEffect(() => {
    const getCount = async () => {
      const newCount = await get("count");
      setCount(newCount.count);
    };
    getCount();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const onClick = async () => {
    const newCount = await put("count");
    setCount(newCount.count);
  };

  return (
    <div className="content">
      <p>You clicked me {count} times.</p>
      <button onClick={onClick}>Add count</button>
    </div>
  );
}
