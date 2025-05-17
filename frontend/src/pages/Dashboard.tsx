import { useAuth } from "../context/AuthContext";

const Dashboard = () => {
  const { user, logout } = useAuth();

  const handleLogout = () => {
    logout();
  };

  return (
    <div className="min-h-screen bg-gray-100">
      <nav className="bg-white shadow">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            <div className="flex">
              <div className="flex-shrink-0 flex items-center">
                <h1 className="text-xl font-bold text-gray-900">認証アプリ</h1>
              </div>
            </div>
            <div className="flex items-center">
              <span className="mr-4 text-gray-600">
                こんにちは、{user?.name || user?.email}さん
              </span>
              <button
                onClick={handleLogout}
                className="ml-4 px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
              >
                ログアウト
              </button>
            </div>
          </div>
        </div>
      </nav>

      <main>
        <div className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
          <div className="px-4 py-6 sm:px-0">
            <div className="border-4 border-dashed border-gray-200 rounded-lg h-96 p-6">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">
                ダッシュボード
              </h2>
              <p className="text-gray-600">
                ログインに成功しました！これはプロテクテッドなページです。
              </p>

              <div className="mt-6">
                <h3 className="text-lg font-semibold text-gray-800 mb-2">
                  ユーザー情報:
                </h3>
                <div className="bg-white overflow-hidden shadow rounded-lg divide-y divide-gray-200">
                  <div className="px-4 py-5 sm:p-6">
                    <dl className="grid grid-cols-1 gap-x-4 gap-y-8 sm:grid-cols-2">
                      <div className="sm:col-span-1">
                        <dt className="text-sm font-medium text-gray-500">
                          ユーザーID
                        </dt>
                        <dd className="mt-1 text-sm text-gray-900">
                          {user?.id}
                        </dd>
                      </div>
                      <div className="sm:col-span-1">
                        <dt className="text-sm font-medium text-gray-500">
                          メールアドレス
                        </dt>
                        <dd className="mt-1 text-sm text-gray-900">
                          {user?.email}
                        </dd>
                      </div>
                      <div className="sm:col-span-1">
                        <dt className="text-sm font-medium text-gray-500">
                          名前
                        </dt>
                        <dd className="mt-1 text-sm text-gray-900">
                          {user?.name || "未設定"}
                        </dd>
                      </div>
                    </dl>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default Dashboard;
