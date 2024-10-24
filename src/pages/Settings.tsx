import { Suspense } from 'react'
import { ActionFunctionArgs, Form } from 'react-router-dom'
import { Settings } from '@/utils/store'
import { rootLoader } from '@/layouts/RootLayout'
import { useRouteLoaderData, Await } from 'react-router-typesafe'

export const settingsActions = async (
  props: ActionFunctionArgs<{
    request: Request
  }>,
) => {
  if (props.request.method === 'PUT') {
    const formData = await props.request.formData()
    const formDataEntries = Object.fromEntries(formData.entries())
    const settings: Settings = {
      displayUnproductiveNotifications:
        formDataEntries['displayUnproductiveNotifications'] === 'on',
      productivityThresholdPercentage: Number(
        formDataEntries['productivityThresholdPercentage'] ?? 70,
      ),
      productivityCheckInterval:
        Number(formDataEntries['productivityCheckInterval'] ?? 5) * 60000,
      runInBackground: formDataEntries['runInBackground'] === 'on',
      runOnStartup: formDataEntries['runOnStartup'] === 'on',
      showWindowOnStartup: formDataEntries['showWindowOnStartup'] === 'on',
    }
    await window.electronAPI.setStoreValue('settings', settings)
  }
  return null
}

const Settings = () => {
  const { settingsPromise } = useRouteLoaderData<typeof rootLoader>('root')

  return (
    <div>
      <Suspense fallback={<p>Loading...</p>}>
        <Await
          resolve={settingsPromise}
          errorElement={<p>Error loading settings</p>}
        >
          {(resolvedSettings) => (
            <div>
              <h1>Settings</h1>
              <Form method="PUT" action="/settings">
                <h2>System Settings</h2>
                <div>
                  <label>
                    Run in Background
                    <input
                      type="checkbox"
                      name="runInBackground"
                      defaultChecked={resolvedSettings.runInBackground}
                    />
                  </label>
                </div>
                <div>
                  <label>
                    Run on Startup
                    <input
                      type="checkbox"
                      name="runOnStartup"
                      defaultChecked={resolvedSettings.runOnStartup}
                    />
                  </label>
                </div>
                <div>
                  <label>
                    Show Window on Startup
                    <input
                      type="checkbox"
                      name="showWindowOnStartup"
                      defaultChecked={resolvedSettings.showWindowOnStartup}
                    />
                  </label>
                </div>
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
          )}
        </Await>
      </Suspense>
      <button onClick={() => window.electronAPI.quitApp()}>Quit App</button>
    </div>
  )
}

export default Settings
