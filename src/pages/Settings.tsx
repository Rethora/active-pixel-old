import { useEffect, useState } from "react";

const Settings = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [
    displayUnproductiveNotifications,
    setDisplayUnproductiveNotifications,
  ] = useState(true);

  useEffect(() => {
    setIsLoading(true);
    window.electronAPI
      .getSetting("displayUnproductiveNotifications")
      .then((value) => {
        setDisplayUnproductiveNotifications(Boolean(value));
        setIsLoading(false);
      });
    setIsLoading(false);
  }, []);

  return (
    <div>
      <h1>Settings</h1>
      {isLoading ? (
        <p>Loading...</p>
      ) : (
        <div>
          <label htmlFor="">Display Unproductive Notifications</label>
          <input
            type="checkbox"
            checked={displayUnproductiveNotifications}
            onChange={async () => {
              setDisplayUnproductiveNotifications(
                !displayUnproductiveNotifications
              );
              await window.electronAPI.setSetting(
                "displayUnproductiveNotifications",
                !displayUnproductiveNotifications
              );
            }}
          />
        </div>
      )}
    </div>
  );
};

export default Settings;
