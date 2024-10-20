import { Suspense } from "react";
import { ActionFunctionArgs, Await, Form } from "react-router-dom";
import { Settings } from "@/utils/store";

import { rootLoader } from "@/layouts/RootLayout";
import { useRouteLoaderData } from "react-router-typesafe";

export const settingsActions = async (props: ActionFunctionArgs<any>) => {
  if (props.request.method === "PUT") {
    const formData = await props.request.formData();
    const formDataEntries = Object.fromEntries(formData.entries());
    const settings: Settings = {
      displayUnproductiveNotifications:
        formDataEntries["displayUnproductiveNotifications"] === "on",
      productivityThresholdPercentage: Number(
        formDataEntries["productivityThresholdPercentage"]
      ),
      productivityCheckInterval:
        Number(formDataEntries["productivityCheckInterval"]) * 60000,
    };
    await window.electronAPI.setStoreValue("settings", settings);
  }
  return null;
};

const Settings = () => {
  const { settingsPromise } = useRouteLoaderData<typeof rootLoader>("root");

  return (
    <Suspense fallback={<p>Loading...</p>}>
      <Await
        resolve={settingsPromise}
        errorElement={<p>Error loading settings</p>}
        children={(resolvedSettings: Settings) => {
          return (
            <div>
              <h1>Settings</h1>
              <Form method="PUT" action="/settings">
                <h2>Unproductive Notifications</h2>
                <div>
                  <label>
                    Display Unproductive Notifications
                    <input
                      type="checkbox"
                      name="displayUnproductiveNotifications"
                      defaultChecked={
                        resolvedSettings.displayUnproductiveNotifications
                      }
                    />
                  </label>
                </div>
                <div>
                  <label>
                    Productivity Threshold Percentage
                    <input
                      type="number"
                      name="productivityThresholdPercentage"
                      min={0}
                      max={100}
                      defaultValue={
                        resolvedSettings.productivityThresholdPercentage
                      }
                    />
                  </label>
                </div>
                <div>
                  <label>
                    Productivity Check Interval (minutes)
                    <input
                      type="number"
                      name="productivityCheckInterval"
                      min={5}
                      max={180}
                      defaultValue={
                        resolvedSettings.productivityCheckInterval / 60000
                      }
                    />
                  </label>
                </div>
                <button type="submit">Save</button>
              </Form>
            </div>
          );
        }}
      />
    </Suspense>
  );
};

export default Settings;
